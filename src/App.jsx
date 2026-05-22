import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Star, Clock, Settings as SettingsIcon, Zap, AlertTriangle } from 'lucide-react'
import ApiSetup from './components/ApiSetup'
import CounterBar from './components/CounterBar'
import SearchPage from './pages/Search'
import Leads from './pages/Leads'
import History from './pages/History'
import Settings from './pages/Settings'
import { useApiCounter } from './hooks/useApiCounter'
import { useLeads } from './hooks/useLeads'
import { useSession } from './hooks/useSession'

function loadSavedCredentials() {
  try {
    const apiKey = localStorage.getItem('leadflow_api_key') || ''
    return { apiKey }
  } catch {
    return { apiKey: '' }
  }
}

const TABS = [
  { id: 'search', label: 'Busca', Icon: Search },
  { id: 'leads', label: 'Leads', Icon: Star },
  { id: 'history', label: 'Histórico', Icon: Clock },
  { id: 'settings', label: 'Config', Icon: SettingsIcon },
]

export default function App() {
  const [credentials, setCredentials] = useState(loadSavedCredentials)
  const [activeTab, setActiveTab] = useState('search')
  const counter = useApiCounter()
  const leads = useLeads()
  const session = useSession()

  const isSetup = Boolean(credentials.apiKey)

  if (!isSetup) {
    return <ApiSetup onComplete={setCredentials} />
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border bg-surface/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1.5 bg-accent/10 border border-accent/20 rounded-lg px-2.5 py-1">
              <Zap size={13} className="text-accent" />
              <span className="font-mono text-accent text-xs font-semibold tracking-wider">LeadFlow</span>
            </div>
          </div>

          <nav className="flex items-center gap-1" role="navigation" aria-label="Navegação principal">
            {TABS.map(({ id, label, Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all relative ${
                  activeTab === id
                    ? 'text-accent bg-accent/10'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface'
                }`}
                aria-current={activeTab === id ? 'page' : undefined}
              >
                <Icon size={14} />
                <span className="hidden sm:inline">{label}</span>
                {id === 'leads' && leads.leads.length > 0 && (
                  <span className="ml-0.5 bg-warning text-bg text-xs rounded-full w-4 h-4 flex items-center justify-center font-mono font-bold">
                    {leads.leads.length > 9 ? '9+' : leads.leads.length}
                  </span>
                )}
              </button>
            ))}
          </nav>

          <CounterBar
            used={counter.used}
            remaining={counter.remaining}
            percentage={counter.percentage}
            MONTHLY_LIMIT={counter.MONTHLY_LIMIT}
          />
        </div>
      </header>

      {counter.isWarning && !counter.isLimited && (
        <div className="bg-warning/10 border-b border-warning/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex items-center gap-2 text-warning text-xs">
            <AlertTriangle size={13} />
            Você usou {counter.used} de {counter.MONTHLY_LIMIT} buscas este mês. Use com moderação.
          </div>
        </div>
      )}

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'search' && (
              <SearchPage
                credentials={credentials}
                counter={counter}
                leads={leads}
                session={session}
              />
            )}
            {activeTab === 'leads' && <Leads leads={leads} />}
            {activeTab === 'history' && (
              <History
                session={session}
                onRepeatSearch={() => setActiveTab('search')}
              />
            )}
            {activeTab === 'settings' && (
              <Settings
                credentials={credentials}
                onUpdateCredentials={setCredentials}
                counter={counter}
                leads={leads}
                session={session}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="border-t border-border py-3 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-text-secondary/40 text-xs font-mono">
          <span>LeadFlow — 100% local · zero dados enviados</span>
          <span>Brave Search API</span>
        </div>
      </footer>
    </div>
  )
}
