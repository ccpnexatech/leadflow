import { useState, useCallback } from 'react'
import { parseBraveResults } from '../lib/parseResults'

async function callProxy(apiKey, params) {
  const response = await fetch('/api/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
    },
    body: JSON.stringify(params),
  })

  const data = await response.json()

  if (!response.ok) {
    const msg = data?.message || data?.detail || `Erro HTTP ${response.status}`
    if (response.status === 401) throw new Error('API Key inválida ou expirada.')
    if (response.status === 403) throw new Error('API Key sem permissão. Verifique seu plano no Brave Search.')
    if (response.status === 429) throw new Error('Limite de requisições atingido. Aguarde e tente novamente.')
    throw new Error(`[${response.status}] ${msg}`)
  }

  return data
}

export function useSearch() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [results, setResults] = useState([])

  const search = useCallback(async ({ query, apiKey, numResults = 10, params = {} }) => {
    setLoading(true)
    setError(null)
    setResults([])

    try {
      const data = await callProxy(apiKey, {
        q: query,
        count: Math.min(numResults, 20),
        search_lang: 'pt-br',
        country: 'BR',
        safesearch: 'off',
        text_decorations: false,
      })

      const items = data?.web?.results || []
      const parsed = parseBraveResults(items, params)
      setResults(parsed)
      return { results: parsed, totalResults: items.length }
    } catch (e) {
      const msg = e.message || 'Erro ao realizar a busca.'
      setError(msg)
      return { results: [], error: msg }
    } finally {
      setLoading(false)
    }
  }, [])

  const testConnection = useCallback(async (apiKey) => {
    try {
      await callProxy(apiKey, {
        q: 'empresa brasil',
        count: 1,
      })
      return { ok: true }
    } catch (e) {
      return { ok: false, error: e.message }
    }
  }, [])

  return { loading, error, results, search, testConnection, setResults }
}
