import { useState } from 'react'

export function useLeads() {
  const [leads, setLeads] = useState([])

  const addLead = (result) => {
    setLeads((prev) => {
      if (prev.find((l) => l.id === result.id)) return prev
      return [...prev, { ...result, savedAt: Date.now(), status: 'Novo', notes: '' }]
    })
  }

  const removeLead = (id) => {
    setLeads((prev) => prev.filter((l) => l.id !== id))
  }

  const updateLead = (id, updates) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, ...updates } : l)))
  }

  const isLeadSaved = (id) => leads.some((l) => l.id === id)

  const clearLeads = () => setLeads([])

  return { leads, addLead, removeLead, updateLead, isLeadSaved, clearLeads }
}
