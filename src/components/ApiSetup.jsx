import { useState } from 'react'
import { motion } from 'framer-motion'
import { Key, Search, CheckCircle, XCircle, Eye, EyeOff, ExternalLink, Zap } from 'lucide-react'
import { useSearch } from '../hooks/useSearch'

export default function ApiSetup({ onComplete }) {
  const [apiKey, setApiKey] = useState('')
  const [showKey, setShowKey] = useState(false)
  const [saveLocally, setSaveLocally] = useState(false)
  const [testStatus, setTestStatus] = useState(null)
  const [testing, setTesting] = useState(false)

  const { testConnection } = useSearch()

  const handleTest = async () => {
    if (!apiKey.trim()) return
    setTesting(true)
    setTestStatus(null)
    const result = await testConnection(apiKey.trim())
    setTestStatus(result)
    setTesting(false)
  }

  const handleSubmit = () => {
    if (!apiKey.trim()) return
    if (saveLocally) {
      localStorage.setItem('leadflow_api_key', apiKey.trim())
    }
    onComplete({ apiKey: apiKey.trim() })
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <motion.div
        className="w-full max-w-2xl"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-1.5 mb-6">
            <Zap size={14} className="text-accent" />
            <span className="text-accent font-mono text-xs tracking-wider uppercase">LeadFlow</span>
          </div>
          <h1 className="text-3xl font-bold text-text-primary mb-3 font-mono">
            Gerador de Leads B2B
          </h1>
          <p className="text-text-secondary text-sm max-w-md mx-auto">
            100% gratuito, 100% local. Nenhum dado sai do seu browser. Configure sua chave da
            Brave Search API para começar.
          </p>
        </div>

        <div className="bg-surface border border-border rounded-xl p-6 mb-4">
          <h2 className="font-mono text-sm text-accent uppercase tracking-wider mb-4">
            Como obter sua API Key gratuita
          </h2>

          <div className="space-y-3 mb-6">
            <Step
              num="01"
              title="Criar conta"
              desc="Acesse o Brave Search API e crie uma conta gratuita. Não precisa de cartão de crédito."
              link="https://api.search.brave.com/register"
              linkText="api.search.brave.com/register"
            />
            <Step
              num="02"
              title="Criar uma aplicação"
              desc='No painel, vá em "Applications" → "Add Application". Dê um nome (ex: LeadFlow) e selecione o plano gratuito.'
            />
            <Step
              num="03"
              title="Copiar a API Key"
              desc='Clique na aplicação criada e copie o valor de "API Key". Cole no campo abaixo.'
            />
            <Step
              num="04"
              title="Limite gratuito"
              desc="2.000 buscas por mês, gratuitamente. Reset automático no início de cada mês."
            />
          </div>

          <div className="flex items-start gap-2 bg-accent/5 border border-accent/20 rounded-lg px-3 py-2.5 text-xs text-accent/80 mb-5">
            <span className="shrink-0 mt-0.5">✓</span>
            <span>
              Brave Search é independente de Google e Microsoft, com índice próprio e sem previsão de encerramento. Plano gratuito permanente.
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="apikey" className="block text-text-secondary font-mono text-xs mb-1.5 uppercase">
                API Key
              </label>
              <div className="relative">
                <input
                  id="apikey"
                  type={showKey ? 'text' : 'password'}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="BSA..."
                  className="w-full bg-bg border border-border rounded-lg px-4 py-3 text-text-primary font-mono text-sm focus:border-accent/60 pr-10 placeholder:text-text-secondary/40"
                  autoComplete="off"
                  onKeyDown={(e) => e.key === 'Enter' && apiKey && handleTest()}
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors"
                  aria-label={showKey ? 'Ocultar chave' : 'Mostrar chave'}
                >
                  {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <input
                id="save-local"
                type="checkbox"
                checked={saveLocally}
                onChange={(e) => setSaveLocally(e.target.checked)}
                className="mt-0.5 accent-accent"
              />
              <label htmlFor="save-local" className="text-text-secondary text-sm cursor-pointer">
                Salvar API Key no browser{' '}
                <span className="text-text-secondary/60 text-xs">
                  (apenas no seu dispositivo, nunca enviado a servidores)
                </span>
              </label>
            </div>
          </div>
        </div>

        {testStatus && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`px-4 py-3 rounded-lg mb-4 text-sm ${
              testStatus.ok
                ? 'bg-accent/10 border border-accent/20 text-accent'
                : 'bg-danger/10 border border-danger/20 text-danger'
            }`}
          >
            <div className="flex items-center gap-2">
              {testStatus.ok ? <CheckCircle size={16} /> : <XCircle size={16} />}
              {testStatus.ok
                ? 'Conexão bem-sucedida! API Key válida.'
                : `Erro: ${testStatus.error}`}
            </div>
            {!testStatus.ok && apiKey && (
              <p className="text-xs mt-2 opacity-70">
                Verifique se a API Key foi copiada corretamente do painel em api.search.brave.com/app
              </p>
            )}
          </motion.div>
        )}

        <div className="flex gap-3">
          <button
            onClick={handleTest}
            disabled={!apiKey || testing}
            className="flex-1 flex items-center justify-center gap-2 bg-surface border border-border hover:border-accent/40 rounded-lg px-4 py-3 text-text-secondary hover:text-text-primary transition-all disabled:opacity-40 disabled:cursor-not-allowed font-mono text-sm"
          >
            <Search size={15} />
            {testing ? 'Testando...' : 'Testar conexão'}
          </button>
          <button
            onClick={handleSubmit}
            disabled={!apiKey}
            className="flex-1 flex items-center justify-center gap-2 bg-accent hover:bg-accent-dim text-bg rounded-lg px-4 py-3 transition-all disabled:opacity-40 disabled:cursor-not-allowed font-semibold text-sm"
          >
            <Key size={15} />
            Começar
          </button>
        </div>
      </motion.div>
    </div>
  )
}

function Step({ num, title, desc, link, linkText }) {
  return (
    <div className="flex gap-4">
      <span className="font-mono text-accent/50 text-xs pt-0.5 shrink-0">{num}</span>
      <div>
        <span className="text-text-primary text-sm font-medium">{title}</span>
        <span className="text-text-secondary text-sm"> — {desc}</span>
        {link && (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-accent text-xs mt-1 hover:underline w-fit"
          >
            <ExternalLink size={11} />
            {linkText}
          </a>
        )}
      </div>
    </div>
  )
}
