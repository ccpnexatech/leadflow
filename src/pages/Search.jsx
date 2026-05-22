import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LayoutList, LayoutGrid, Download, Trash2, AlertTriangle } from 'lucide-react'
import SearchForm from '../components/SearchForm'
import ResultsTable from '../components/ResultsTable'
import ResultsCards from '../components/ResultsCards'
import SkeletonLoader from '../components/SkeletonLoader'
import { useSearch } from '../hooks/useSearch'
import { exportCSV, downloadFile, generateFilename } from '../lib/exportData'

export default function Search({ credentials, counter, leads, session }) {
  const { loading, error, results, search, setResults } = useSearch()
  const [viewMode, setViewMode] = useState('table')
  const [selectedIds, setSelectedIds] = useState([])
  const [lastParams, setLastParams] = useState(null)

  const handleSearch = async ({ query, params, numResults }) => {
    if (counter.isLimited) return
    setSelectedIds([])
    setLastParams(params)
    const { results: res } = await search({
      query,
      apiKey: credentials.apiKey,
      numResults,
      params,
    })
    counter.increment(1)
    session.addToHistory(params, res || [])
    session.setCurrentResults(res || [])
    session.setCurrentParams(params)
  }

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const selectAll = (checked) => {
    setSelectedIds(checked ? results.map((r) => r.id) : [])
  }

  const saveSelected = () => {
    const toSave = results.filter((r) => selectedIds.includes(r.id))
    toSave.forEach((r) => leads.addLead(r))
  }

  const handleExport = () => {
    const toExport = selectedIds.length
      ? results.filter((r) => selectedIds.includes(r.id))
      : results
    const roles = lastParams?.roles || []
    const niche = lastParams?.niche || 'busca'
    const city = lastParams?.city || 'brasil'
    const csv = exportCSV(toExport, roles)
    downloadFile(csv, generateFilename(niche, city, 'csv'))
  }

  return (
    <div className="space-y-6">
      <SearchForm
        onSearch={handleSearch}
        loading={loading}
        isLimited={counter.isLimited}
      />

      {loading && <SkeletonLoader count={5} />}

      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-start gap-3 bg-danger/10 border border-danger/30 rounded-xl px-4 py-3 text-danger text-sm"
        >
          <AlertTriangle size={16} className="shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Erro na busca</p>
            <p className="text-danger/80 text-xs mt-0.5">{error}</p>
          </div>
        </motion.div>
      )}

      {!loading && results.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <span className="font-mono text-text-secondary text-sm">
                <span className="text-accent font-semibold">{results.length}</span> resultado{results.length !== 1 && 's'}
                {selectedIds.length > 0 && (
                  <span className="ml-2 text-text-secondary/60">({selectedIds.length} selecionados)</span>
                )}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex border border-border rounded-lg overflow-hidden">
                <ViewBtn active={viewMode === 'table'} onClick={() => setViewMode('table')} aria-label="Modo tabela">
                  <LayoutList size={15} />
                </ViewBtn>
                <ViewBtn active={viewMode === 'cards'} onClick={() => setViewMode('cards')} aria-label="Modo cards">
                  <LayoutGrid size={15} />
                </ViewBtn>
              </div>

              {selectedIds.length > 0 && (
                <>
                  <button
                    onClick={saveSelected}
                    className="flex items-center gap-1.5 text-xs bg-warning/10 border border-warning/30 text-warning hover:bg-warning/20 rounded-lg px-3 py-1.5 transition-all"
                  >
                    Salvar selecionados
                  </button>
                </>
              )}

              <button
                onClick={handleExport}
                className="flex items-center gap-1.5 text-xs bg-surface border border-border hover:border-accent/40 text-text-secondary hover:text-text-primary rounded-lg px-3 py-1.5 transition-all"
              >
                <Download size={13} />
                Exportar CSV
              </button>
            </div>
          </div>

          {viewMode === 'table' ? (
            <ResultsTable
              results={results}
              roles={lastParams?.roles || []}
              onSaveLead={leads.addLead}
              isLeadSaved={leads.isLeadSaved}
              selectedIds={selectedIds}
              onToggleSelect={toggleSelect}
              onSelectAll={selectAll}
            />
          ) : (
            <ResultsCards
              results={results}
              roles={lastParams?.roles || []}
              onSaveLead={leads.addLead}
              isLeadSaved={leads.isLeadSaved}
            />
          )}
        </motion.div>
      )}

      {!loading && !error && results.length === 0 && lastParams && (
        <div className="text-center py-12 text-text-secondary">
          <p className="font-mono text-sm">Nenhum resultado encontrado.</p>
          <p className="text-xs mt-1">Tente ajustar os filtros ou as palavras-chave.</p>
        </div>
      )}
    </div>
  )
}

function ViewBtn({ active, onClick, children, ...props }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1.5 transition-all ${
        active ? 'bg-accent text-bg' : 'bg-bg text-text-secondary hover:text-text-primary'
      }`}
      {...props}
    >
      {children}
    </button>
  )
}
