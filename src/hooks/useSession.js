import { useState } from 'react'

export function useSession() {
  const [history, setHistory] = useState([])
  const [currentResults, setCurrentResults] = useState([])
  const [currentParams, setCurrentParams] = useState(null)

  const addToHistory = (params, results) => {
    setHistory((prev) => [
      {
        id: Date.now(),
        params,
        resultCount: results.length,
        timestamp: Date.now(),
      },
      ...prev.slice(0, 19),
    ])
  }

  const clearHistory = () => setHistory([])

  return {
    history,
    addToHistory,
    clearHistory,
    currentResults,
    setCurrentResults,
    currentParams,
    setCurrentParams,
  }
}
