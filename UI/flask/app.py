# app.py
import os
import time
import uuid
import logging
from typing import Dict, Any, Optional
from flask import Flask, request, jsonify, send_from_directory, abort
from flask_cors import CORS
from werkzeug.utils import secure_filename
from PIL import Image

# -------------------
# Configuration
# -------------------
# Read config from env with sane defaults
HOST = os.getenv("HOST", "0.0.0.0")
PORT = int(os.getenv("PORT", "5000"))
DEBUG = os.getenv("FLASK_DEBUG", "true").lower() in ("1", "true", "yes")

# Directory to persist uploaded images (for debugging). You can change to a tmp dir or cloud storage.
BASE_DIR = os.path.dirname(__file__)
UPLOAD_DIR = os.path.abspath(os.getenv("UPLOAD_DIR", os.path.join(BASE_DIR, "uploads")))
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Max size (bytes). Default 10MB.
MAX_CONTENT_LENGTH = int(os.getenv("MAX_CONTENT_LENGTH", 10 * 1024 * 1024))

# Allowed image extensions
ALLOWED_EXTENSIONS = set(x.strip().lower() for x in os.getenv("ALLOWED_EXTENSIONS", "png,jpg,jpeg,bmp,tiff,webp").split(","))

# CORS origins: comma-separated list or "*" for all (dev). In production set your frontend URL.
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "*")  # e.g. "http://localhost:5173,https://yourdomain.com"

# Optional: folder with built frontend to serve (production)
FRONTEND_DIST = os.getenv("FRONTEND_DIST", os.path.join(BASE_DIR, "frontend", "dist"))

# -------------------
# App init and logging
# -------------------
app = Flask(__name__, static_folder=None)  # static served manually if needed
app.config["UPLOAD_FOLDER"] = UPLOAD_DIR
app.config["MAX_CONTENT_LENGTH"] = MAX_CONTENT_LENGTH

# Configure CORS. Accept either "*" or a list.
if CORS_ORIGINS.strip() == "*" or CORS_ORIGINS.strip() == "":
    CORS(app, supports_credentials=True)
else:
    origins = [o.strip() for o in CORS_ORIGINS.split(",") if o.strip()]
    CORS(app, origins=origins, supports_credentials=True)

# Logging
logging.basicConfig(level=logging.DEBUG if DEBUG else logging.INFO,
                    format="%(asctime)s %(levelname)s %(name)s %(message)s")
logger = logging.getLogger("geovqa-backend")

# -------------------
# Helpers
# -------------------
def allowed_file(filename: str) -> bool:
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

def save_image(file_storage) -> str:
    """
    Save the uploaded FileStorage to disk with a secure, unique name.
    Returns the absolute path to the saved file.
    Raises ValueError if the file is not a valid image.
    """
    orig_name = secure_filename(file_storage.filename or "")
    if not orig_name:
        ext = "jpg"
    else:
        ext = orig_name.rsplit(".", 1)[1] if "." in orig_name else "jpg"

    new_name = f"{uuid.uuid4().hex}.{ext}"
    path = os.path.join(app.config["UPLOAD_FOLDER"], new_name)
    file_storage.save(path)

    # verify image validity using PIL
    try:
        with Image.open(path) as img:
            img.verify()  # will raise exception if not a valid image
    except Exception as e:
        # cleanup and re-raise a clearer error
        try:
            os.remove(path)
        except Exception:
            pass
        raise ValueError("Uploaded file is not a valid image") from e

    return path

# -------------------
# Model placeholder / inference function
# -------------------
# Load model here (once), e.g. PyTorch/TensorFlow model initialization.
# Example: MODEL = torch.load('best_model.pt'); MODEL.eval()
MODEL = None  # Replace with actual loaded model object if you have one

def answer_question(image_path: str, question: str) -> Dict[str, Any]:
    """
    Replace this stub with actual GeoVQA model inference.
    The function should accept the image path (or loaded image) and the question string.
    Return a dict serializable to JSON, e.g.:
      {
        "answer": "yes",
        "confidence": 0.9,
        "spatial": {"bbox": [x,y,w,h], "coords": {...}},
        "debug": {...}
      }
    """
    logger.debug("Running placeholder answer_question for %s and question: %s", image_path, question)
    # --- BEGIN STUB ---
    # For a real model, open image and preprocess then run model
    fake_answer = f"stub answer to: '{question}'"
    response = {
        "answer": fake_answer,
        "confidence": 0.6,
        "debug": {
            "saved_image": os.path.basename(image_path)
        }
    }
    # --- END STUB ---
    return response

# -------------------
# Routes
# -------------------
@app.route("/health", methods=["GET"])
def health():
    """Simple health check."""
    return jsonify({"status": "ok"}), 200

@app.route("/uploads/<path:filename>", methods=["GET"])
def uploaded_file(filename):
    """
    Serve uploaded files (for debugging). In production, prefer cloud storage or serve via nginx.
    """
    # Protect against path traversal automatically handled by send_from_directory
    return send_from_directory(app.config["UPLOAD_FOLDER"], filename)

@app.route("/api/answer", methods=["POST"])
def api_answer():
    """
    Main inference endpoint.
    Expects multipart/form-data:
      - 'image' : file
      - 'question' : string (form field)
    Returns JSON.
    """
    # Validate presence of 'image'
    if "image" not in request.files:
        return jsonify({"error": "Missing 'image' file in form data"}), 400

    file = request.files["image"]
    question = (request.form.get("question") or "").strip()

    # Basic validations
    if file.filename == "":
        return jsonify({"error": "No file selected"}), 400
    if not question:
        return jsonify({"error": "Missing 'question' parameter"}), 400
    if not allowed_file(file.filename):
        return jsonify({"error": f"Unsupported file type. Allowed: {sorted(list(ALLOWED_EXTENSIONS))}"}), 400

    # Save & verify image
    try:
        saved_path = save_image(file)
    except ValueError as ve:
        logger.warning("Invalid image uploaded: %s", ve)
        return jsonify({"error": str(ve)}), 400
    except Exception as ex:
        logger.exception("Failed to save uploaded file")
        return jsonify({"error": "Failed to save uploaded file", "details": str(ex)}), 500

    # Run inference
    try:
        result = answer_question(saved_path, question)
        # attach debug info if not present
        result.setdefault("debug", {})
        result["debug"].setdefault("saved_image", os.path.basename(saved_path))
        return jsonify(result), 200
    except Exception as e:
        logger.exception("Model inference failed")
        # Do not leak internal traceback in production; details for dev
        return jsonify({"error": "Model inference failed", "details": str(e)}), 500

# Optional: serve frontend production build (if you place built frontend in FRONTEND_DIST)
if os.path.isdir(FRONTEND_DIST):
    logger.info("Frontend dist detected at %s — enabling static serving", FRONTEND_DIST)

    @app.route("/", defaults={"path": ""})
    @app.route("/<path:path>")
    def serve_frontend(path: str):
        """
        Serves files from FRONTEND_DIST. Useful for deploying single container with both backend + frontend.
        Make sure to set FRONTEND_DIST env var to the directory containing index.html.
        """
        safe_path = path or "index.html"
        full = os.path.join(FRONTEND_DIST, safe_path)
        if os.path.isfile(full):
            return send_from_directory(FRONTEND_DIST, safe_path)
        # fallback to index.html for client-side routing
        if os.path.isfile(os.path.join(FRONTEND_DIST, "index.html")):
            return send_from_directory(FRONTEND_DIST, "index.html")
        abort(404)

# -------------------
# Error handlers
# -------------------
@app.errorhandler(413)
def request_entity_too_large(error):
    return jsonify({"error": "File is too large. Increase MAX_CONTENT_LENGTH if needed."}), 413

@app.errorhandler(404)
def page_not_found(e):
    return jsonify({"error": "Not found"}), 404

@app.route("/incomingquestion", methods=["POST"])
def incoming_question():
    """
    Extract image + question from incoming POST and return a simple standby answer.
    Saves the uploaded image using save_image() (so it's available in uploads/).
    """
    try:
        logger.info("=== /incomingquestion received ===")
        # Extract question from form, querystring, or JSON
        question = (request.form.get("question") or
                    request.args.get("question") or
                    (request.get_json(silent=True) or {}).get("question") or
                    "").strip()

        if question:
            logger.info("Question: %s", question)
        else:
            logger.info("No question provided in form/query/JSON")

        # Extract image file (if any)
        image_info = None
        if "image" in request.files:
            file = request.files["image"]
            filename = file.filename or "<no filename>"
            content_type = file.content_type
            logger.info("Received file field 'image': filename=%s content_type=%s", filename, content_type)

            # Optionally save the file using existing helper so you can inspect it later
            try:
                saved_path = save_image(file)  # uses your save_image helper
                logger.info("Image saved to: %s", saved_path)
                image_info = {"saved_path": saved_path, "filename": filename, "content_type": content_type}
            except ValueError as ve:
                # invalid image (PIL verification failed)
                logger.warning("Uploaded file is not a valid image: %s", ve)
                image_info = {"error": "invalid image", "details": str(ve)}
            except Exception as ex:
                logger.exception("Failed to save uploaded image: %s", ex)
                image_info = {"error": "save_failed", "details": str(ex)}
        else:
            logger.info("No file field named 'image' found in request.files")

        # Log a short summary for debugging
        logger.info("Summary: question_present=%s image_info=%s", bool(question), bool(image_info))

        # Return the plain text standby answer
        time.sleep(10)
        answer1 = "Around the Howrah Bridge area in Kolkata, you’ll find some of the city’s most iconic local foods, especially street-food. The area is famous for phuchka (Kolkata-style pani puri), Kolkata rolls (egg, chicken, or mutton wrapped in a flaky paratha), and a variety of Bengali fried snacks like beguni, vegetable chops, and fish fry sold by small roadside stalls. If you walk a little toward Howrah Station or the bridge approach, you’ll also find eateries serving traditional Bengali meals—fish curry, rice, dal, and veg thalis—along with plenty of sweet shops offering rosogolla, mishti doi, and other local desserts. Overall, it’s one of the best places to taste authentic everyday Kolkata street flavours."

        reply = {
            "answer": answer1,
            "confidence": 0.42,
            "note": "standby response — replace with model output",
            "debug": {
                "received_question": question,
                "saved_image": image_info.get("saved_path") if isinstance(image_info, dict) else None
            }
        }
        return jsonify(reply), 200

    except Exception as exc:
        logger.exception("Error handling /incomingquestion: %s", exc)
        return jsonify({"error": "internal server error", "details": str(exc)}), 500


# -------------------
# Startup
# -------------------
if __name__ == "__main__":
    logger.info("Starting GeoVQA Flask app on %s:%s (debug=%s)", HOST, PORT, DEBUG)
    # In production, use gunicorn/uwsgi instead of Flask dev server.
    app.run(host=HOST, port=PORT, debug=DEBUG)
