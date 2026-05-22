import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, Download, FileJson, StickyNote } from 'lucide-react'
import { exportCSV, downloadFile, generateFilename } from '../lib/exportData'

const STATUSES = ['Novo', 'Contatado', 'Em negociação', 'Fechado', 'Descartado']

const STATUS_COLORS = {
  Novo: 'bg-accent/10 text-accent border-accent/20',
  Contatado: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'Em negociação': 'bg-warning/10 text-warning border-warning/20',
  Fechado: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  Descartado: 'bg-danger/10 text-danger border-danger/20',
}

export default function Leads({ leads }) {
  const [editingNote, setEditingNote] = useState(null)
  const [noteText, setNoteText] = useState('')

  const handleExportCSV = () => {
    const csv = exportCSV(leads.leads, [])
    downloadFile(csv, generateFilename('leads', 'todos', 'csv'))
  }

  const handleExportJSON = () => {
    const json = JSON.stringify(leads.leads, null, 2)
    downloadFile(json, generateFilename('leads', 'todos', 'json'), 'application/json')
  }

  const startEditNote = (lead) => {
    setEditingNote(lead.id)
    setNoteText(lead.notes || '')
  }

  const saveNote = (id) => {
    leads.updateLead(id, { notes: noteText })
    setEditingNote(null)
  }

  if (!leads.leads.length) {
    return (
      <div className="text-center py-20 text-text-secondary">
        <p className="font-mono text-sm mb-2">Nenhum lead salvo ainda.</p>
        <p className="text-xs">Use o ★ nos resultados de busca para salvar leads.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <span className="font-mono text-text-secondary text-sm">
          <span className="text-accent font-semibold">{leads.leads.length}</span> lead{leads.leads.length !== 1 && 's'} salvo{leads.leads.length !== 1 && 's'}
        </span>
        <div className="flex gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 text-xs bg-surface border border-border hover:border-accent/40 text-text-secondary hover:text-text-primary rounded-lg px-3 py-1.5 transition-all"
          >
            <Download size={13} />
            CSV
          </button>
          <button
            onClick={handleExportJSON}
            className="flex items-center gap-1.5 text-xs bg-surface border border-border hover:border-accent/40 text-text-secondary hover:text-text-primary rounded-lg px-3 py-1.5 transition-all"
          >
            <FileJson size={13} />
            JSON
          </button>
          <button
            onClick={leads.clearLeads}
            className="flex items-center gap-1.5 text-xs bg-danger/10 border border-danger/20 text-danger hover:bg-danger/20 rounded-lg px-3 py-1.5 transition-all"
          >
            <Trash2 size={13} />
            Limpar
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-surface">
              <th className="px-4 py-3 text-left font-mono text-xs text-text-secondary uppercase">Empresa</th>
              <th className="px-4 py-3 text-left font-mono text-xs text-text-secondary uppercase">Site</th>
              <th className="px-4 py-3 text-left font-mono text-xs text-text-secondary uppercase">Status</th>
              <th className="px-4 py-3 text-left font-mono text-xs text-text-secondary uppercase">Notas</th>
              <th className="px-4 py-3 text-left font-mono text-xs text-text-secondary uppercase">Salvo em</th>
              <th className="px-4 py-3 text-center font-mono text-xs text-text-secondary uppercase">Ação</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {leads.leads.map((lead, i) => (
                <motion.tr
                  key={lead.id}
                  className="border-b border-border/50 hover:bg-surface/60 transition-colors"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <td className="px-4 py-3">
                    <div className="font-medium text-text-primary text-sm truncate max-w-[180px]" title={lead.name}>
                      {lead.name}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <a
                      href={lead.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:underline font-mono text-xs truncate max-w-[120px] block"
                    >
                      {lead.domain}
                    </a>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={lead.status}
                      onChange={(e) => leads.updateLead(lead.id, { status: e.target.value })}
                      className={`text-xs px-2 py-1 rounded border font-mono bg-transparent cursor-pointer ${STATUS_COLORS[lead.status] || ''}`}
                      aria-label="Status do lead"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s} className="bg-surface text-text-primary">
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 max-w-[200px]">
                    {editingNote === lead.id ? (
                      <div className="flex items-center gap-1.5">
                        <input
                          type="text"
                          value={noteText}
                          onChange={(e) => setNoteText(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && saveNote(lead.id)}
                          className="flex-1 bg-bg border border-border rounded px-2 py-1 text-text-primary text-xs focus:border-accent/60"
                          autoFocus
                          aria-label="Editar nota"
                        />
                        <button
                          onClick={() => saveNote(lead.id)}
                          className="text-accent text-xs hover:underline shrink-0"
                        >
                          Ok
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => startEditNote(lead)}
                        className="flex items-center gap-1.5 text-text-secondary hover:text-text-primary text-xs text-left w-full group"
                        aria-label="Editar nota"
                      >
                        <StickyNote size={11} className="shrink-0 group-hover:text-accent transition-colors" />
                        <span className="truncate">{lead.notes || 'Adicionar nota...'}</span>
                      </button>
                    )}
                  </td>
                  <td className="px-4 py-3 font-mono text-text-secondary text-xs">
                    {lead.savedAt ? new Date(lead.savedAt).toLocaleDateString('pt-BR') : '—'}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => leads.removeLead(lead.id)}
                      className="p-1.5 rounded-md text-text-secondary hover:text-danger hover:bg-danger/10 transition-all"
                      aria-label="Remover lead"
                      title="Remover lead"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  )
}
