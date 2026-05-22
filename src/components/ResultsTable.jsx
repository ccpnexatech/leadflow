import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink, Star, Link2, Search, ChevronDown, ChevronUp } from 'lucide-react'
import { buildLinkedInCompanyLink, buildLinkedInLeadershipLinks } from '../lib/queryBuilder'

export default function ResultsTable({ results, roles, onSaveLead, isLeadSaved, selectedIds, onToggleSelect, onSelectAll }) {
  const allSelected = results.length > 0 && results.every((r) => selectedIds.includes(r.id))

  if (!results.length) return null

  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-surface">
            <th className="w-10 px-3 py-3">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={() => onSelectAll(!allSelected)}
                className="accent-accent"
                aria-label="Selecionar todos"
              />
            </th>
            <th className="px-4 py-3 text-left font-mono text-xs text-text-secondary uppercase">#</th>
            <th className="px-4 py-3 text-left font-mono text-xs text-text-secondary uppercase">Empresa</th>
            <th className="px-4 py-3 text-left font-mono text-xs text-text-secondary uppercase">Site</th>
            <th className="px-4 py-3 text-left font-mono text-xs text-text-secondary uppercase">Descrição</th>
            <th className="px-4 py-3 text-left font-mono text-xs text-text-secondary uppercase">LinkedIn</th>
            <th className="px-4 py-3 text-center font-mono text-xs text-text-secondary uppercase">Ação</th>
          </tr>
        </thead>
        <tbody>
          <AnimatePresence>
            {results.map((result, i) => (
              <ResultRow
                key={result.id}
                result={result}
                index={i}
                roles={roles}
                isSaved={isLeadSaved(result.id)}
                isSelected={selectedIds.includes(result.id)}
                onToggle={() => onToggleSelect(result.id)}
                onSave={() => onSaveLead(result)}
              />
            ))}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  )
}

function ResultRow({ result, index, roles, isSaved, isSelected, onToggle, onSave }) {
  const [expanded, setExpanded] = useState(false)
  const linkedinCompany = buildLinkedInCompanyLink(result.name)
  const leadershipLinks = buildLinkedInLeadershipLinks(result.name, roles)

  return (
    <motion.tr
      className={`border-b border-border/50 hover:bg-surface/60 transition-colors ${isSelected ? 'bg-accent/5' : ''}`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
    >
      <td className="px-3 py-3 text-center">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onToggle}
          className="accent-accent"
          aria-label={`Selecionar ${result.name}`}
        />
      </td>
      <td className="px-4 py-3 font-mono text-text-secondary text-xs">{index + 1}</td>
      <td className="px-4 py-3 max-w-[200px]">
        <div className="font-medium text-text-primary truncate" title={result.name}>
          {result.name}
        </div>
        <div className="flex gap-1 mt-1 flex-wrap">
          {result.hasSite && (
            <span className="text-xs bg-accent/10 text-accent px-1.5 py-0.5 rounded font-mono">com site</span>
          )}
          {result.isLinkedIn && (
            <span className="text-xs bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded font-mono">linkedin</span>
          )}
        </div>
      </td>
      <td className="px-4 py-3">
        <a
          href={result.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent hover:underline flex items-center gap-1 font-mono text-xs max-w-[160px] truncate"
          title={result.domain}
        >
          <ExternalLink size={11} />
          {result.domain}
        </a>
      </td>
      <td className="px-4 py-3 max-w-[240px]">
        <p className="text-text-secondary text-xs line-clamp-2" title={result.description}>
          {result.description || '—'}
        </p>
      </td>
      <td className="px-4 py-3">
        <div className="flex flex-col gap-1.5">
          <a
            href={linkedinCompany}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 text-xs whitespace-nowrap"
          >
            <Link2 size={11} />
            LinkedIn
          </a>
          {leadershipLinks.length > 0 && (
            <div>
              <button
                type="button"
                onClick={() => setExpanded(!expanded)}
                className="flex items-center gap-1 text-text-secondary hover:text-text-primary text-xs"
              >
                <Search size={11} />
                Liderança {expanded ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
              </button>
              {expanded && (
                <div className="mt-1.5 space-y-1 pl-2 border-l border-border">
                  {leadershipLinks.map((link) => (
                    <a
                      key={link.role}
                      href={link.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-accent/80 hover:text-accent text-xs truncate max-w-[140px]"
                      title={link.role}
                    >
                      {link.role}
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </td>
      <td className="px-4 py-3 text-center">
        <button
          type="button"
          onClick={onSave}
          className={`p-1.5 rounded-md transition-all ${
            isSaved
              ? 'text-warning bg-warning/10'
              : 'text-text-secondary hover:text-warning hover:bg-warning/10'
          }`}
          aria-label={isSaved ? 'Lead salvo' : 'Salvar lead'}
          title={isSaved ? 'Lead salvo' : 'Salvar lead'}
        >
          {isSaved ? <Star size={15} fill="currentColor" /> : <Star size={15} />}
        </button>
      </td>
    </motion.tr>
  )
}
