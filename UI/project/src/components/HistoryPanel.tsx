import { Clock, Trash2 } from 'lucide-react';

interface HistoryItem {
  id: string;
  question: string;
  answer: string;
  timestamp: Date;
  imagePreview: string;
}

interface HistoryPanelProps {
  history: HistoryItem[];
  onClear: () => void;
  onSelect: (item: HistoryItem) => void;
}

export default function HistoryPanel({ history, onClear, onSelect }: HistoryPanelProps) {
  if (history.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <Clock className="h-12 w-12 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-500">No history yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">Recent Questions</h3>
        </div>
        <button
          onClick={onClear}
          className="text-red-600 hover:text-red-700 transition-colors"
          title="Clear history"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {history.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item)}
            className="w-full p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors text-left"
          >
            <div className="flex gap-3">
              <img
                src={item.imagePreview}
                alt="Preview"
                className="w-16 h-16 object-cover rounded"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {item.question}
                </p>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                  {item.answer}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(item.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
