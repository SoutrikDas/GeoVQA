
# 🌍 GeoVQA — End-to-End Geographical Visual Question Answering System  

**GeoVQA** is a fully-integrated **multimodal Visual Question Answering (VQA)** application that interprets and answers **textual questions about geographical images**.  
It leverages **CLIP-based encoders**, **multimodal retrieval-augmented generation (RAG)**, and a **GPT-2 decoder** to generate contextually aware, human-like answers.  

---

## ✨ Key Features  

- 🧠 **Multimodal Understanding** — Fuses image and text representations through CLIP-based encoders and cross-attention fusion.  
- 🔍 **Retrieval-Augmented Generation (RAG)** — Uses a multimodal retriever to enhance contextual reasoning and factual grounding.  
- 🗣️ **Natural Language Generation** — GPT-2 based decoder generates coherent, context-aware responses.  
- 🌐 **End-to-End Architecture** — Deployed as a REST API backend with a clean modern frontend interface.  
- ⚙️ **Scalable Infrastructure** — Integrated with **NGINX** for reverse proxying and **ngrok** for secure external access.  

---

## 🧩 System Architecture  

```
            ┌────────────────────┐
            │     Frontend       │
            │ (React / Modern UI)│
            └────────┬───────────┘
                     │ REST API
            ┌────────┴───────────┐
            │     Backend API    │
            │ (FastAPI / Flask)  │
            └────────┬───────────┘
                     │
     ┌───────────────┴────────────────┐
     │         Model Server           │
     │                                │
     │  🖼️ CLIP Encoder (Image/Text)  │
     │  🔗 Cross Attention Fusion      │
     │  🔍 Multimodal Retriever (RAG)  │
     │  🧩 GPT-2 Decoder (Answer Gen.) │
     └───────────────┬────────────────┘
                     │
              ┌──────┴──────┐
              │   NGINX     │
              └──────┬──────┘
                     │
                 🌐 ngrok
```



## 🚀 Tech Stack  

| Component | Technology |
|------------|-------------|
| **Frontend** | React.js, Tailwind CSS |
| **Backend** | Python (FastAPI / Flask) |
| **Model** | CLIP (Encoder), Cross-Attention Fusion, Multimodal RAG, GPT-2 (Decoder) |
| **Serving** | NGINX, Gunicorn / Uvicorn |
| **Exposure** | ngrok (Localhost tunneling) |

---

## 🧠 Workflow  

1. **Input:** User uploads a geographical image and enters a textual question.  
2. **Encoding:** CLIP encodes both image and question into a shared embedding space.  
3. **Fusion:** Image tokens are projected and cross-attended with text embeddings to form a correlated tensor.  
4. **Retrieval:** The retriever fetches relevant multimodal context (RAG).  
5. **Generation:** GPT-2 decoder generates a final, context-grounded answer.  
6. **Output:** The system returns a natural language answer with optional visual annotations.  

---

## ⚙️ Setup & Installation  

```bash
# Clone the repository
git clone https://github.com/yourusername/GeoVQA.git
cd GeoVQA

# Install dependencies
pip install -r requirements.txt

# Start backend server
uvicorn app.main:app --reload

# Start frontend
cd frontend
npm install
npm start

# Run NGINX and expose via ngrok
sudo service nginx start
ngrok http 80
````

---

## 🧾 Example

**Input:**
*Image:* Satellite view of the Himalayas
*Question:* “Which mountain range is shown in this image?”

**Output:**

> “This image shows the Himalayan mountain range, located in South Asia.”

---

## 📦 Folder Structure

```
GeoVQA/
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── model_handler.py
│   │   └── retriever.py
│
├── model/
│   ├── clip_encoder.py
│   ├── fusion_layer.py
│   ├── rag_retriever.py
│   └── gpt2_decoder.py
│
├── frontend/
│   ├── src/
│   └── public/
│
├── nginx/
│   └── nginx.conf
│
├── requirements.txt
└── README.md
```

---

## 🧪 Future Enhancements

* 🌏 Integration with **geospatial datasets** for factual grounding.
* 📈 Support for **larger LLM decoders (GPT-3, LLaMA)**.
* 🎯 Region-based **visual grounding and attention visualization**.

---

## 👩‍💻 Contributors

| Name                  | Role                   |
| --------------------- | ---------------------- |
| **Sapna Vishwakarma** | Research & Development |
| **Devesh Sharma**     | Full-Stack Integration |

---

## 📜 License

This project is released under the **MIT License**.
See [LICENSE](LICENSE) for details.

---

## 🖼️ Optional: Preview

You can add screenshots or demo gifs here once your frontend is running:

```
![GeoVQA Interface](docs/demo_ui.png)
![Example Output](docs/example_output.gif)
```

---

## 🧩 Badges

Add GitHub badges for better visibility (optional):

```
![Python](https://img.shields.io/badge/Python-3.10-blue.svg)
![React](https://img.shields.io/badge/Frontend-React-green)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![Build](https://img.shields.io/badge/Build-Passing-brightgreen)
```

---

> 🌐 **GeoVQA** — Bridging geography and intelligence through multimodal AI.
