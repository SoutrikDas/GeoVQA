import { Send } from 'lucide-react';
import { useState } from 'react';

interface QuestionInputProps {
  onSubmit: (question: string) => void;
  disabled?: boolean;
}

export default function QuestionInput({ onSubmit, disabled }: QuestionInputProps) {
  const [question, setQuestion] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim()) {
      onSubmit(question);
      setQuestion('');
    }
  };

  const suggestedQuestions = [
    "What geographical features are visible in this image?",
    "What city or region is shown in this image?",
    "What is the approximate location of this place?",
    "Describe the terrain and landscape features.",
  ];

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="relative">
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a question about the geographical location or features in the image..."
          className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          rows={3}
          disabled={disabled}
        />
        <button
          type="submit"
          disabled={disabled || !question.trim()}
          className="absolute bottom-3 right-3 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          <Send className="h-5 w-5" />
        </button>
      </form>

      <div className="mt-4">
        <p className="text-sm text-gray-600 mb-2 font-medium">Suggested Questions:</p>
        <div className="flex flex-wrap gap-2">
          {suggestedQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => setQuestion(q)}
              disabled={disabled}
              className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
