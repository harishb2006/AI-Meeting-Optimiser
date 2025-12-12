import React, { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import type { TranscriptRequest, AnalysisResult } from '../types';

interface TranscriptInputProps {
  onAnalyze: (data: AnalysisResult) => void;
  onLoading: (isLoading: boolean) => void;
}

type InputMethod = 'text' | 'file';

const TranscriptInput: React.FC<TranscriptInputProps> = ({ onAnalyze, onLoading }) => {
  const [transcript, setTranscript] = useState<string>('');
  const [meetingTitle, setMeetingTitle] = useState<string>('');
  const [inputMethod, setInputMethod] = useState<InputMethod>('text');
  const [error, setError] = useState<string>('');

  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setTranscript(e.target.value);
    setError('');
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const result = event.target?.result;
          if (typeof result === 'string') {
            setTranscript(result);
            setError('');
          }
        };
        reader.onerror = () => {
          setError('Failed to read file');
        };
        reader.readAsText(file);
      } else {
        setError('Please upload a .txt file');
      }
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!transcript.trim()) {
      setError('Please enter or upload a transcript');
      return;
    }

    setError('');
    onLoading(true);

    try {
      const requestData: TranscriptRequest = {
        transcript: transcript.trim(),
        meeting_title: meetingTitle.trim() || 'Untitled Meeting'
      };

      const response = await axios.post<AnalysisResult>('/api/analyze', requestData);
      onAnalyze(response.data);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.detail || 'Failed to analyze transcript. Please try again.');
      } else {
        setError('An unexpected error occurred');
      }
      onLoading(false);
    }
  };

  const handleClear = () => {
    setTranscript('');
    setMeetingTitle('');
    setError('');
  };

  const sampleTranscript = `[Meeting starts at 10:00 AM]

John: Good morning everyone. Let's discuss the Q1 product roadmap. We need to finalize our priorities for the next quarter.

Sarah: Thanks John. I think our main focus should be on the new mobile app features. We've received a lot of customer requests for offline mode.

Mike: Agreed. I can lead the offline mode implementation. We should also consider the dark theme that users have been asking for.

John: Great points. Sarah, can you coordinate with the design team to finalize the UI mockups by next Friday?

Sarah: Absolutely. I'll schedule a meeting with them this week and we'll have the mockups ready.

Mike: One more thing - we need to address the performance issues in the dashboard. It's been loading slowly for users with large datasets.

John: Good catch, Mike. Let's make that a high priority. Can you investigate and provide a solution proposal by Wednesday?

Mike: Will do. I'll run some profiling tests and document my findings.

Sarah: Should we also plan for the API rate limiting feature? Some enterprise clients have mentioned they need better control.

John: Yes, let's add that to the roadmap. Mike, can you work with the backend team on that?

Mike: Sure, I'll coordinate with them.

John: Excellent. To summarize: Sarah handles UI mockups, Mike investigates dashboard performance and works on API rate limiting. Let's reconvene next Monday to review progress.

[Meeting ends at 10:30 AM]`;

  const loadSample = () => {
    setTranscript(sampleTranscript);
    setMeetingTitle('Q1 Product Roadmap Planning');
    setError('');
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-purple-100">
      {/* Header with Toggle */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h2 className="text-2xl font-bold text-gray-800">📝 Input Meeting Transcript</h2>
        <div className="flex bg-purple-50 rounded-lg p-1">
          <button
            type="button"
            className={`px-4 py-2 rounded-md font-medium transition-all ${
              inputMethod === 'text'
                ? 'bg-white text-purple-600 shadow-sm'
                : 'text-gray-600 hover:text-purple-600'
            }`}
            onClick={() => setInputMethod('text')}
          >
            ✍️ Type/Paste
          </button>
          <button
            type="button"
            className={`px-4 py-2 rounded-md font-medium transition-all ${
              inputMethod === 'file'
                ? 'bg-white text-purple-600 shadow-sm'
                : 'text-gray-600 hover:text-purple-600'
            }`}
            onClick={() => setInputMethod('file')}
          >
            📁 Upload File
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Meeting Title */}
        <div>
          <label htmlFor="meetingTitle" className="block text-sm font-semibold text-gray-700 mb-2">
            Meeting Title (Optional)
          </label>
          <input
            type="text"
            id="meetingTitle"
            placeholder="e.g., Q1 Planning Meeting"
            value={meetingTitle}
            onChange={(e) => setMeetingTitle(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          />
        </div>

        {inputMethod === 'text' ? (
          <div>
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="transcript" className="block text-sm font-semibold text-gray-700">
                Transcript
              </label>
              <button
                type="button"
                className="text-sm px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-md hover:from-purple-600 hover:to-pink-600 transition-all"
                onClick={loadSample}
              >
                Load Sample
              </button>
            </div>
            <textarea
              id="transcript"
              placeholder="Paste your meeting transcript here...&#10;&#10;Example:&#10;John: Let's start with the quarterly review.&#10;Sarah: I'll present the sales numbers first.&#10;..."
              value={transcript}
              onChange={handleTextChange}
              rows={15}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-sm leading-relaxed transition-all resize-y"
            />
            <div className="text-right text-sm text-gray-500 mt-1">
              {transcript.length} characters
            </div>
          </div>
        ) : (
          <div>
            <label htmlFor="fileUpload" className="block text-sm font-semibold text-gray-700 mb-2">
              Upload Transcript File (.txt)
            </label>
            <div className="relative border-2 border-dashed border-purple-300 rounded-lg p-8 text-center hover:border-purple-500 hover:bg-purple-50 transition-all cursor-pointer">
              <input
                type="file"
                id="fileUpload"
                accept=".txt"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <span className="text-5xl mb-3 block">📄</span>
              <p className="text-gray-700 font-medium">Click to upload or drag & drop</p>
              <p className="text-gray-500 text-sm mt-1">Text files (.txt) only</p>
            </div>
            {transcript && (
              <div className="mt-4 p-4 bg-purple-50 border-l-4 border-purple-500 rounded-lg">
                <strong className="text-gray-700">Preview:</strong>
                <pre className="mt-2 text-sm text-gray-600 whitespace-pre-wrap">{transcript.substring(0, 300)}...</pre>
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
            <p className="text-red-700 font-medium">⚠️ {error}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end pt-4">
          <button
            type="button"
            onClick={handleClear}
            className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-all"
          >
            Clear
          </button>
          <button
            type="submit"
            disabled={!transcript.trim()}
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            🚀 Analyze Transcript
          </button>
        </div>
      </form>
    </div>
  );
};

export default TranscriptInput;
