import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface AnswerDisplayProps {
  answer?: string;
  isLoading?: boolean;
  error?: string;
}

export default function AnswerDisplay({ answer, isLoading, error }: AnswerDisplayProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex items-center justify-center gap-3 text-blue-600">
          <Loader2 className="h-6 w-6 animate-spin" />
          <p className="font-medium">Analyzing image and generating answer...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-red-900 mb-1">Error</h3>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!answer) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-green-50 to-blue-50 border border-green-200 rounded-lg p-6 shadow-md">
      <div className="flex items-start gap-3">
        <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-2">Answer</h3>
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{answer}</p>
        </div>
      </div>
    </div>
  );
}
