import { useState } from 'react'
import { Key, Eye, EyeOff, CheckCircle, XCircle, Trash2, RotateCcw, Download, ExternalLink } from 'lucide-react'
import { useSearch } from '../hooks/useSearch'
import { downloadFile } from '../lib/exportData'

export default function Settings({ credentials, onUpdateCredentials, counter, leads, session }) {
  const [apiKey, setApiKey] = useState(credentials.apiKey)
  const [showKey, setShowKey] = useState(false)
  const [testStatus, setTestStatus] = useState(null)
  const [testing, setTesting] = useState(false)
  const [saved, setSaved] = useState(false)

  const { testConnection } = useSearch()

  const handleTest = async () => {
    setTesting(true)
    setTestStatus(null)
    const result = await testConnection(apiKey)
    setTestStatus(result)
    setTesting(false)
  }

  const handleSave = () => {
    onUpdateCredentials({ apiKey })
    localStorage.setItem('leadflow_api_key', apiKey)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleRemoveCredentials = () => {
    localStorage.removeItem('leadflow_api_key')
  }

  const handleExportSession = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      leads: leads.leads,
      history: session.history,
    }
    downloadFile(JSON.stringify(data, null, 2), 'leadflow_session.json', 'application/json')
  }

  const handleClearSession = () => {
    leads.clearLeads()
    session.clearHistory()
    counter.reset()
  }

  return (
    <div className="space-y-6 max-w-xl">
      <Section title="Brave Search API Key">
        <div className="space-y-4">
          <div>
            <label htmlFor="s-apikey" className="block text-text-secondary font-mono text-xs mb-1.5 uppercase">
              API Key
            </label>
            <div className="relative">
              <input
                id="s-apikey"
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full bg-bg border border-border rounded-lg px-4 py-2.5 text-text-primary font-mono text-sm focus:border-accent/60 pr-10"
                autoComplete="off"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors"
                aria-label={showKey ? 'Ocultar' : 'Mostrar'}
              >
                {showKey ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <a
            href="https://api.search.brave.com/app"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-accent/70 hover:text-accent transition-colors"
          >
            <ExternalLink size={11} />
            Gerenciar chaves em api.search.brave.com/app
          </a>

          {testStatus && (
            <div
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                testStatus.ok
                  ? 'bg-accent/10 border border-accent/20 text-accent'
                  : 'bg-danger/10 border border-danger/20 text-danger'
              }`}
            >
              {testStatus.ok ? <CheckCircle size={14} /> : <XCircle size={14} />}
              {testStatus.ok ? 'Conexão bem-sucedida!' : `Erro: ${testStatus.error}`}
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={handleTest}
              disabled={!apiKey || testing}
              className="flex items-center gap-1.5 text-sm bg-surface border border-border hover:border-accent/40 text-text-secondary hover:text-text-primary rounded-lg px-4 py-2 transition-all disabled:opacity-40"
            >
              {testing ? 'Testando...' : 'Testar'}
            </button>
            <button
              onClick={handleSave}
              disabled={!apiKey}
              className="flex items-center gap-1.5 text-sm bg-accent hover:bg-accent-dim text-bg rounded-lg px-4 py-2 transition-all disabled:opacity-40 font-semibold"
            >
              {saved ? <CheckCircle size={14} /> : <Key size={14} />}
              {saved ? 'Salvo!' : 'Salvar'}
            </button>
            <button
              onClick={handleRemoveCredentials}
              className="flex items-center gap-1.5 text-sm bg-danger/10 border border-danger/20 text-danger hover:bg-danger/20 rounded-lg px-3 py-2 transition-all"
              title="Remover API Key do browser"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </Section>

      <Section title="Uso da API">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-text-secondary text-sm">Buscas utilizadas este mês</span>
            <span className="font-mono text-text-primary text-sm">
              {counter.used} / {counter.MONTHLY_LIMIT}
            </span>
          </div>
          <div className="h-2 bg-border rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                counter.percentage >= 90 ? 'bg-danger' : counter.percentage >= 70 ? 'bg-warning' : 'bg-accent'
              }`}
              style={{ width: `${counter.percentage}%` }}
            />
          </div>
          <p className="text-text-secondary/60 text-xs">
            Plano gratuito: 2.000 buscas/mês · Reset automático no início de cada mês.
          </p>
          <button
            onClick={counter.reset}
            className="flex items-center gap-1.5 text-xs bg-surface border border-border hover:border-accent/40 text-text-secondary hover:text-text-primary rounded-lg px-3 py-1.5 transition-all"
          >
            <RotateCcw size={12} />
            Resetar contador
          </button>
        </div>
      </Section>

      <Section title="Dados da Sessão">
        <div className="space-y-3">
          <p className="text-text-secondary text-sm">
            <span className="text-text-primary">{leads.leads.length}</span> leads salvos ·{' '}
            <span className="text-text-primary">{session.history.length}</span> buscas no histórico
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleExportSession}
              className="flex items-center gap-1.5 text-xs bg-surface border border-border hover:border-accent/40 text-text-secondary hover:text-text-primary rounded-lg px-3 py-1.5 transition-all"
            >
              <Download size={13} />
              Exportar sessão (JSON)
            </button>
            <button
              onClick={handleClearSession}
              className="flex items-center gap-1.5 text-xs bg-danger/10 border border-danger/20 text-danger hover:bg-danger/20 rounded-lg px-3 py-1.5 transition-all"
            >
              <Trash2 size={13} />
              Limpar tudo
            </button>
          </div>
        </div>
      </Section>

      <Section title="Sobre">
        <div className="space-y-2 text-text-secondary text-sm">
          <p>LeadFlow — Gerador de Leads B2B com LinkedIn</p>
          <p>100% gratuito · 100% local · zero cadastro · zero dado salvo em servidor</p>
          <p className="text-xs text-text-secondary/40 font-mono">Motor: Brave Search API · 2.000 buscas/mês grátis</p>
          <p className="font-mono text-xs text-text-secondary/50">v2.0.0</p>
        </div>
      </Section>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div className="bg-surface border border-border rounded-xl p-5 space-y-4">
      <h3 className="font-mono text-xs text-accent uppercase tracking-wider">{title}</h3>
      {children}
    </div>
  )
}
