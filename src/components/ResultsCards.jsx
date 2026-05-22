import { motion } from 'framer-motion'
import { ExternalLink, Link2, Search, Star } from 'lucide-react'
import { buildLinkedInCompanyLink, buildLinkedInLeadershipLinks } from '../lib/queryBuilder'

export default function ResultsCards({ results, roles, onSaveLead, isLeadSaved }) {
  if (!results.length) return null

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {results.map((result, i) => (
        <ResultCard
          key={result.id}
          result={result}
          index={i}
          roles={roles}
          isSaved={isLeadSaved(result.id)}
          onSave={() => onSaveLead(result)}
        />
      ))}
    </div>
  )
}

function ResultCard({ result, index, roles, isSaved, onSave }) {
  const linkedinCompany = buildLinkedInCompanyLink(result.name)
  const leadershipLinks = buildLinkedInLeadershipLinks(result.name, roles)

  return (
    <motion.div
      className="bg-surface border border-border rounded-xl p-4 flex flex-col gap-3 hover:border-accent/20 transition-colors"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="text-text-primary font-medium text-sm truncate" title={result.name}>
            {result.name}
          </h3>
          <div className="flex gap-1.5 mt-1.5 flex-wrap">
            {result.hasSite && (
              <span className="text-xs bg-accent/10 text-accent px-1.5 py-0.5 rounded font-mono">com site</span>
            )}
            {result.isLinkedIn && (
              <span className="text-xs bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded font-mono">linkedin</span>
            )}
            {!result.hasSite && (
              <span className="text-xs bg-danger/10 text-danger px-1.5 py-0.5 rounded font-mono">sem site</span>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={onSave}
          className={`p-1.5 rounded-md transition-all shrink-0 ${
            isSaved ? 'text-warning bg-warning/10' : 'text-text-secondary hover:text-warning hover:bg-warning/10'
          }`}
          aria-label={isSaved ? 'Lead salvo' : 'Salvar lead'}
        >
          {isSaved ? <Star size={16} fill="currentColor" /> : <Star size={16} />}
        </button>
      </div>

      {result.description && (
        <p className="text-text-secondary text-xs line-clamp-3 leading-relaxed">
          {result.description}
        </p>
      )}

      <div className="flex flex-col gap-2 pt-1 border-t border-border">
        <a
          href={result.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-accent hover:underline text-xs font-mono truncate"
        >
          <ExternalLink size={11} />
          {result.domain}
        </a>
        <a
          href={linkedinCompany}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 text-xs"
        >
          <Link2 size={11} />
          Pesquisar empresa no LinkedIn
        </a>
      </div>

      {leadershipLinks.length > 0 && (
        <div>
          <p className="font-mono text-xs text-text-secondary uppercase mb-2">Liderança</p>
          <div className="flex flex-wrap gap-1.5">
            {leadershipLinks.map((link) => (
              <a
                key={link.role}
                href={link.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs bg-bg border border-border hover:border-accent/30 rounded px-2 py-1 text-text-secondary hover:text-accent transition-all"
              >
                <Search size={10} />
                {link.role.split(' / ')[0]}
              </a>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  )
}
