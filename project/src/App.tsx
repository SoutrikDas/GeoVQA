import { useState } from 'react';
import { MapPin, X } from 'lucide-react';
import ImageUpload from './components/ImageUpload';
import QuestionInput from './components/QuestionInput';
import MapView from './components/MapView';
import AnswerDisplay from './components/AnswerDisplay';
import HistoryPanel from './components/HistoryPanel';
import About from './components/About';

interface Location {
  latitude: number;
  longitude: number;
  name: string; 
  confidence: number;
}

interface HistoryItem {
  id: string;
  question: string;
  answer: string;
  timestamp: Date;
  imagePreview: string;
}

function App() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [currentQuestion, setCurrentQuestion] = useState<string>('');
  const [answer, setAnswer] = useState<string>('');
  const [location, setLocation] = useState<Location | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showAbout, setShowAbout] = useState(false);

  const handleImageSelect = (file: File, preview: string) => {
    setImageFile(file);
    setImagePreview(preview);
    setAnswer('');
    setLocation(undefined);
    setError('');
  };

  const handleClearImage = () => {
    setImageFile(null);
    setImagePreview('');
    setAnswer('');
    setLocation(undefined);
    setError('');
    setCurrentQuestion('');
  };

  const handleQuestionSubmit2 = async(question: string) => {
    if (!imageFile) {
      setError("Please upload an image first");
      return;
    }

    setCurrentQuestion(question);
    setIsLoading(true);
    setError("");

    // build form
    const form = new FormData();
    form.append("image", imageFile);     // <- the image file from ImageUpload
    form.append("question", question);   // <- the text question

    console.log("Submitting question and image to backend...");
    try {
      console.log("inside the try block");
      const res = await fetch("http://localhost:5000/incomingquestion", {
          method: "POST",
          body: form,
        });

      // parse JSON safely
      // const json = await res.json().catch(() => null);

      if (!res.ok) {
        const errText = await res.text().catch(() => `Server error ${res.status}`);
        setError(errText);
        setIsLoading(false);
        return;
      }

      // inspect content-type to decide how to parse
      const ctype = res.headers.get("content-type") || "";
      if (ctype.includes("application/json")) {
        const json = await res.json();
        // json.answer expected
        setAnswer(json.answer ?? JSON.stringify(json));
        // optionally use confidence / debug
        if (json.confidence) {
          // setConfidence(json.confidence)  // if you have such state
        }
      } else {
        const text = await res.text();
        setAnswer(text);
      }
    } catch (err) {
      console.error("Error during fetch:", err);
      setError("Network error or server is unreachable.");
    } finally {
      setIsLoading(false);
    }
};


  const handleQuestionSubmit = async (question: string) => {
    if (!imageFile) {
      setError('Please upload an image first');
      return;
    }

    setCurrentQuestion(question);
    setIsLoading(true);
    setError('');

    await new Promise(resolve => setTimeout(resolve, 2000));

    const isGeographical = Math.random() > 0.2;

    if (!isGeographical) {
      setError('This works only with geographical dataset.');
      setIsLoading(false);
      return;
    }

    const mockAnswers = [
      "This image shows the Golden Gate Bridge in San Francisco, California. The distinctive Art Deco suspension bridge spans the Golden Gate strait, connecting San Francisco to Marin County. The image captures the iconic International Orange color of the bridge against the backdrop of the bay waters.",
      "Based on the geographical features visible, this appears to be a mountainous region with snow-capped peaks. The terrain suggests this could be part of the Rocky Mountains or similar alpine environment, characterized by steep elevations and glacial formations.",
      "This coastal area features characteristic Mediterranean geography, with limestone cliffs meeting clear blue waters. The vegetation and geological formations are typical of regions along the Adriatic or Aegean seas.",
      "The image shows an urban landscape with modern skyscrapers and dense development patterns typical of major metropolitan areas in East Asia. The architectural style and city planning suggest this could be a major financial district.",
    ];

    const mockLocations: Location[] = [
      { latitude: 37.8199, longitude: -122.4783, name: "San Francisco, California", confidence: 0.92 },
      { latitude: 39.7392, longitude: -104.9903, name: "Rocky Mountains Region", confidence: 0.85 },
      { latitude: 43.5081, longitude: 16.4402, name: "Split, Croatia", confidence: 0.88 },
      { latitude: 22.3193, longitude: 114.1694, name: "Hong Kong", confidence: 0.91 },
    ];

    const randomIndex = Math.floor(Math.random() * mockAnswers.length);
    const mockAnswer = mockAnswers[randomIndex];
    const mockLocation = mockLocations[randomIndex];

    setAnswer(mockAnswer);
    setLocation(mockLocation);
    setIsLoading(false);

    const newHistoryItem: HistoryItem = {
      id: Date.now().toString(),
      question,
      answer: mockAnswer,
      timestamp: new Date(),
      imagePreview,
    };
    setHistory([newHistoryItem, ...history].slice(0, 10));
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  const handleSelectHistory = (item: HistoryItem) => {
    setCurrentQuestion(item.question);
    setAnswer(item.answer);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <div className="bg-gradient-to-r from-teal-600 to-blue-600 text-white py-3 shadow-md">
        <div className="container mx-auto px-4 flex justify-end">
          <button
            onClick={() => setShowAbout(true)}
            className="px-4 py-2 bg-white text-gray-800 rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            About
          </button>
        </div>
      </div>

      {showAbout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 flex justify-between items-center p-6">
              <h2 className="text-2xl font-bold text-gray-900">About</h2>
              <button
                onClick={() => setShowAbout(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6">
              <About />
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <MapPin className="h-10 w-10 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">
              Geo-Visual QA
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Upload an image and ask questions about its geographical location and features
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload Image</h2>
              <ImageUpload
                onImageSelect={handleImageSelect}
                currentImage={imagePreview}
                onClear={handleClearImage}
              />
            </div>

            {imagePreview && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Ask a Question</h2>
                <QuestionInput
                  onSubmit={handleQuestionSubmit2}
                  disabled={isLoading}
                />
              </div>
            )}

            {(answer || isLoading || error) && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900">Results</h2>

                {currentQuestion && !isLoading && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-900 mb-2">Question</h3>
                    <p className="text-blue-800">{currentQuestion}</p>
                  </div>
                )}

                <AnswerDisplay
                  answer={answer}
                  isLoading={isLoading}
                  error={error}
                />
              </div>
            )}

            {location && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Detected Location</h2>
                <MapView location={location} />
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">History</h2>
            <HistoryPanel
              history={history}
              onClear={handleClearHistory}
              onSelect={handleSelectHistory}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
