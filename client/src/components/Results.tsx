import React from 'react';
import type { AnalysisResult } from '../types';

interface ResultsProps {
  data: AnalysisResult;
}

const Results: React.FC<ResultsProps> = ({ data }) => {
  const { meeting_title, summary, tasks, decisions, follow_ups } = data;

  const exportJSON = () => {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${meeting_title.replace(/\s+/g, '_')}_analysis.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportText = () => {
    let text = `Meeting: ${meeting_title}\n\n`;
    text += `SUMMARY:\n${summary}\n\n`;
    text += `TASKS:\n${tasks?.map((t, i) => `${i + 1}. ${t.task}${t.assignee ? ` (${t.assignee})` : ''}${t.deadline ? ` - Due: ${t.deadline}` : ''}`).join('\n') || 'None'}\n\n`;
    text += `DECISIONS:\n${decisions?.map((d, i) => `${i + 1}. ${d.decision}`).join('\n') || 'None'}\n\n`;
    if (follow_ups?.length) {
      text += `FOLLOW-UPS:\n${follow_ups.map((f, i) => `${i + 1}. ${f}`).join('\n')}\n`;
    }
    
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${meeting_title.replace(/\s+/g, '_')}_analysis.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mt-8 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-purple-100">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">📊 Analysis Results</h2>
        <h3 className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          {meeting_title}
        </h3>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Summary Section */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6 border border-purple-100 hover:shadow-xl transition-shadow">
          <div className="flex items-center gap-3 mb-4 pb-4 border-b-2 border-purple-100">
            <span className="text-3xl">📝</span>
            <h3 className="text-xl font-bold text-gray-800">Meeting Summary</h3>
          </div>
          <p className="text-gray-700 leading-relaxed text-lg">{summary}</p>
        </div>

        {/* Tasks Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-purple-100 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4 pb-4 border-b-2 border-purple-100">
            <div className="flex items-center gap-3">
              <span className="text-3xl">✅</span>
              <h3 className="text-xl font-bold text-gray-800">Action Items</h3>
            </div>
            <span className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-sm font-bold">
              {tasks?.length || 0}
            </span>
          </div>
          {tasks && tasks.length > 0 ? (
            <ul className="space-y-3">
              {tasks.map((task, index) => (
                <li
                  key={index}
                  className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500 hover:bg-purple-100 transition-colors"
                >
                  <div className="flex justify-between items-start gap-3 mb-2">
                    <strong className="text-gray-800 flex-1">{task.task}</strong>
                    {task.assignee && (
                      <span className="px-3 py-1 bg-purple-200 text-purple-800 rounded-full text-xs font-semibold whitespace-nowrap">
                        👤 {task.assignee}
                      </span>
                    )}
                  </div>
                  {task.deadline && (
                    <div className="text-sm text-gray-600 mt-2">⏰ Due: {task.deadline}</div>
                  )}
                  {task.priority && (
                    <span
                      className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold ${
                        task.priority === 'High'
                          ? 'bg-red-100 text-red-700'
                          : task.priority === 'Medium'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {task.priority}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400 italic text-center py-8">No tasks identified</p>
          )}
        </div>

        {/* Decisions Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-purple-100 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4 pb-4 border-b-2 border-purple-100">
            <div className="flex items-center gap-3">
              <span className="text-3xl">💡</span>
              <h3 className="text-xl font-bold text-gray-800">Key Decisions</h3>
            </div>
            <span className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-sm font-bold">
              {decisions?.length || 0}
            </span>
          </div>
          {decisions && decisions.length > 0 ? (
            <ul className="space-y-3">
              {decisions.map((decision, index) => (
                <li
                  key={index}
                  className="p-4 bg-amber-50 rounded-lg border-l-4 border-amber-500 hover:bg-amber-100 transition-colors"
                >
                  <div className="text-gray-800 font-semibold mb-2">{decision.decision}</div>
                  {decision.rationale && (
                    <div className="text-sm text-gray-600 italic mt-2">
                      Rationale: {decision.rationale}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400 italic text-center py-8">No decisions recorded</p>
          )}
        </div>

        {/* Follow-ups Section */}
        {follow_ups && follow_ups.length > 0 && (
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6 border border-purple-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4 pb-4 border-b-2 border-purple-100">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🔔</span>
                <h3 className="text-xl font-bold text-gray-800">Follow-ups</h3>
              </div>
              <span className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-sm font-bold">
                {follow_ups.length}
              </span>
            </div>
            <ul className="space-y-2">
              {follow_ups.map((followup, index) => (
                <li
                  key={index}
                  className="p-3 bg-green-50 rounded-lg border-l-4 border-green-500 text-gray-800 hover:bg-green-100 transition-colors"
                >
                  {followup}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Export Actions */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-purple-100">
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={exportJSON}
            className="px-6 py-3 border-2 border-purple-600 text-purple-600 font-semibold rounded-lg hover:bg-purple-600 hover:text-white transition-all shadow-md hover:shadow-lg"
          >
            💾 Export JSON
          </button>
          <button
            onClick={exportText}
            className="px-6 py-3 border-2 border-pink-600 text-pink-600 font-semibold rounded-lg hover:bg-pink-600 hover:text-white transition-all shadow-md hover:shadow-lg"
          >
            📄 Export Text
          </button>
        </div>
      </div>
    </div>
  );
};

export default Results;
