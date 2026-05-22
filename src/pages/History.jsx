import { motion, AnimatePresence } from 'framer-motion'
import { Clock, RotateCcw, Trash2 } from 'lucide-react'

export default function History({ session, onRepeatSearch }) {
  const { history, clearHistory } = session

  if (!history.length) {
    return (
      <div className="text-center py-20 text-text-secondary">
        <Clock size={32} className="mx-auto mb-3 opacity-30" />
        <p className="font-mono text-sm">Nenhuma busca realizada nesta sessão.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="font-mono text-text-secondary text-sm">
          <span className="text-accent font-semibold">{history.length}</span> busca{history.length !== 1 && 's'} nesta sessão
        </span>
        <button
          onClick={clearHistory}
          className="flex items-center gap-1.5 text-xs bg-danger/10 border border-danger/20 text-danger hover:bg-danger/20 rounded-lg px-3 py-1.5 transition-all"
        >
          <Trash2 size={13} />
          Limpar histórico
        </button>
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          {history.map((item, i) => (
            <motion.div
              key={item.id}
              className="bg-surface border border-border rounded-xl p-4 flex items-center justify-between gap-4"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ delay: i * 0.04 }}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-text-primary text-sm font-medium">{item.params.niche}</span>
                  <span className="text-text-secondary/40 text-xs">em</span>
                  <span className="text-accent text-sm">{item.params.city}</span>
                </div>
                <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                  <span className="font-mono text-text-secondary text-xs">
                    {item.resultCount} resultado{item.resultCount !== 1 && 's'}
                  </span>
                  {item.params.roles?.length > 0 && (
                    <span className="text-text-secondary/60 text-xs">
                      Cargos: {item.params.roles.slice(0, 2).join(', ')}
                      {item.params.roles.length > 2 && ` +${item.params.roles.length - 2}`}
                    </span>
                  )}
                  <span className="text-text-secondary/40 font-mono text-xs">
                    {new Date(item.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
              <button
                onClick={() => onRepeatSearch(item.params)}
                className="flex items-center gap-1.5 text-xs bg-bg border border-border hover:border-accent/40 text-text-secondary hover:text-accent rounded-lg px-3 py-1.5 transition-all shrink-0"
              >
                <RotateCcw size={13} />
                Repetir
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
