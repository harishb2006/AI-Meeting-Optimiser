import { useState } from 'react'
import TranscriptInput from './components/TranscriptInput'
import Results from './components/Results'
import type { AnalysisResult } from './types'

function App() {
  const [results, setResults] = useState<AnalysisResult | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const handleAnalyze = (data: AnalysisResult) => {
    setResults(data)
    setLoading(false)
  }

  const handleLoading = (isLoading: boolean) => {
    setLoading(isLoading)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              🤖 AI Meeting Actions Agent
            </h1>
            <p className="text-gray-600 text-lg">
              Extract tasks, decisions, and summaries from your meeting transcripts
            </p>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <TranscriptInput 
          onAnalyze={handleAnalyze} 
          onLoading={handleLoading}
        />
        
        {loading && (
          <div className="mt-8 bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="inline-block w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-700 text-lg font-medium">Analyzing transcript...</p>
            <p className="text-gray-500 text-sm mt-2">This may take a few moments</p>
          </div>
        )}
        
        {results && !loading && (
          <Results data={results} />
        )}
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t border-purple-100 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-600">
            ⚡ Powered by AI • Extract actionable insights from meetings
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
