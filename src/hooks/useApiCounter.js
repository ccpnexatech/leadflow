import { useState, useEffect } from 'react'

const STORAGE_KEY = 'leadflow_api_counter'
const MONTHLY_LIMIT = 2000

function getMonthKey() {
  const now = new Date()
  return `${now.getFullYear()}-${now.getMonth() + 1}`
}

function loadCounter() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    if (data.month === getMonthKey()) return data.count || 0
    return 0
  } catch {
    return 0
  }
}

function saveCounter(count) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ month: getMonthKey(), count }))
}

export function useApiCounter() {
  const [used, setUsed] = useState(loadCounter)

  useEffect(() => {
    saveCounter(used)
  }, [used])

  const increment = (by = 1) => {
    setUsed((prev) => {
      const next = prev + by
      saveCounter(next)
      return next
    })
  }

  const reset = () => {
    setUsed(0)
    saveCounter(0)
  }

  const remaining = Math.max(0, MONTHLY_LIMIT - used)
  const percentage = Math.min(100, (used / MONTHLY_LIMIT) * 100)
  const isLimited = used >= MONTHLY_LIMIT
  const isWarning = used >= MONTHLY_LIMIT * 0.8

  return { used, remaining, percentage, isLimited, isWarning, increment, reset, MONTHLY_LIMIT }
}
