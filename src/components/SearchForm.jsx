import { useState } from 'react'
import { ChevronDown, ChevronUp, Search } from 'lucide-react'
import { buildSearchQuery } from '../lib/queryBuilder'

const NICHES = [
  'Escritório de Contabilidade',
  'Escritório de Advocacia',
  'Consultoria de RH',
  'Consultoria Empresarial',
  'Imobiliária / Corretora de Imóveis',
  'Clínica Médica',
  'Clínica Psicológica',
  'Empresa de Treinamento Corporativo',
  'Assessoria Financeira',
  'Franquia',
  'Agência de Marketing',
  'Empresa de Tecnologia',
]

const CITIES = [
  'Todo o Brasil',
  'Fortaleza',
  'São Paulo',
  'Rio de Janeiro',
  'Belo Horizonte',
  'Curitiba',
  'Recife',
  'Salvador',
  'Porto Alegre',
  'Brasília',
]

const ROLES = [
  'Sócio / Fundador',
  'CEO / Diretor Geral',
  'Diretor Comercial',
  'Gerente Comercial',
  'Gerente de Marketing',
  'Head de Tecnologia / CTO',
  'Diretor Financeiro / CFO',
  'Gerente Administrativo',
]

export default function SearchForm({ onSearch, loading, isLimited }) {
  const [niche, setNiche] = useState('')
  const [customNiche, setCustomNiche] = useState('')
  const [city, setCity] = useState('Fortaleza')
  const [customCity, setCustomCity] = useState('')
  const [selectedRoles, setSelectedRoles] = useState(['CEO / Diretor Geral', 'Sócio / Fundador'])
  const [customRole, setCustomRole] = useState('')
  const [numResults, setNumResults] = useState(10)
  const [advancedOpen, setAdvancedOpen] = useState(false)
  const [filterSocials, setFilterSocials] = useState(true)
  const [filterNoSite, setFilterNoSite] = useState(false)
  const [linkedinOnly, setLinkedinOnly] = useState(false)
  const [keywords, setKeywords] = useState('')

  const effectiveNiche = niche === '__custom__' ? customNiche : niche
  const effectiveCity = city === '__custom__' ? customCity : city

  const allRoles = customRole
    ? [...selectedRoles, ...(selectedRoles.includes(customRole) ? [] : [customRole])]
    : selectedRoles

  const toggleRole = (role) => {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    )
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!effectiveNiche || !effectiveCity) return

    const params = {
      niche: effectiveNiche,
      city: effectiveCity,
      roles: allRoles,
      keywords,
      filterSocials,
      filterNoSite,
      linkedinOnly,
    }

    const query = buildSearchQuery(params)
    onSearch({ query, params, numResults })
  }

  const isValid = effectiveNiche.trim() && effectiveCity.trim() && !isLimited

  return (
    <form onSubmit={handleSubmit} className="bg-surface border border-border rounded-xl p-6 space-y-5">
      <h2 className="font-mono text-sm text-accent uppercase tracking-wider">Configurar Busca</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="niche" className="block text-text-secondary font-mono text-xs mb-1.5 uppercase">
            Nicho / Segmento
          </label>
          <select
            id="niche"
            value={niche}
            onChange={(e) => setNiche(e.target.value)}
            className="w-full bg-bg border border-border rounded-lg px-3 py-2.5 text-text-primary text-sm focus:border-accent/60"
          >
            <option value="">Selecione um nicho...</option>
            {NICHES.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
            <option value="__custom__">Outro (campo livre)</option>
          </select>
          {niche === '__custom__' && (
            <input
              type="text"
              value={customNiche}
              onChange={(e) => setCustomNiche(e.target.value)}
              placeholder="Digite o nicho..."
              className="w-full mt-2 bg-bg border border-border rounded-lg px-3 py-2.5 text-text-primary text-sm focus:border-accent/60 placeholder:text-text-secondary/40"
              aria-label="Nicho personalizado"
            />
          )}
        </div>

        <div>
          <label htmlFor="city" className="block text-text-secondary font-mono text-xs mb-1.5 uppercase">
            Cidade / Região
          </label>
          <select
            id="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full bg-bg border border-border rounded-lg px-3 py-2.5 text-text-primary text-sm focus:border-accent/60"
          >
            {CITIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
            <option value="__custom__">Outra cidade</option>
          </select>
          {city === '__custom__' && (
            <input
              type="text"
              value={customCity}
              onChange={(e) => setCustomCity(e.target.value)}
              placeholder="Digite a cidade..."
              className="w-full mt-2 bg-bg border border-border rounded-lg px-3 py-2.5 text-text-primary text-sm focus:border-accent/60 placeholder:text-text-secondary/40"
              aria-label="Cidade personalizada"
            />
          )}
        </div>
      </div>

      <div>
        <label className="block text-text-secondary font-mono text-xs mb-2 uppercase">
          Cargos de Liderança (LinkedIn)
        </label>
        <div className="flex flex-wrap gap-2">
          {ROLES.map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => toggleRole(role)}
              className={`px-3 py-1.5 rounded-md text-xs font-mono transition-all ${
                selectedRoles.includes(role)
                  ? 'bg-accent/20 border border-accent/40 text-accent'
                  : 'bg-bg border border-border text-text-secondary hover:border-accent/20'
              }`}
            >
              {role}
            </button>
          ))}
        </div>
        <input
          type="text"
          value={customRole}
          onChange={(e) => setCustomRole(e.target.value)}
          placeholder="Cargo personalizado (opcional)..."
          className="w-full mt-2 bg-bg border border-border rounded-lg px-3 py-2 text-text-primary text-sm focus:border-accent/60 placeholder:text-text-secondary/40"
          aria-label="Cargo personalizado"
        />
      </div>

      <div className="flex items-center gap-4">
        <div>
          <label htmlFor="numResults" className="block text-text-secondary font-mono text-xs mb-1.5 uppercase">
            Resultados
          </label>
          <select
            id="numResults"
            value={numResults}
            onChange={(e) => setNumResults(Number(e.target.value))}
            className="bg-bg border border-border rounded-lg px-3 py-2.5 text-text-primary text-sm focus:border-accent/60"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
          <p className="text-text-secondary/50 text-xs mt-1">máx. 20 por busca · 2.000/mês grátis</p>
        </div>
      </div>

      <div>
        <button
          type="button"
          onClick={() => setAdvancedOpen(!advancedOpen)}
          className="flex items-center gap-2 text-text-secondary hover:text-text-primary text-sm transition-colors"
        >
          {advancedOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          <span className="font-mono text-xs">Filtros avançados</span>
        </button>

        {advancedOpen && (
          <div className="mt-3 space-y-3 pl-4 border-l border-border">
            <CheckOption
              id="filter-socials"
              checked={filterSocials}
              onChange={setFilterSocials}
              label="Excluir redes sociais dos resultados"
            />
            <CheckOption
              id="filter-nosite"
              checked={filterNoSite}
              onChange={setFilterNoSite}
              label="Incluir apenas empresas com site ativo"
            />
            <CheckOption
              id="linkedin-only"
              checked={linkedinOnly}
              onChange={setLinkedinOnly}
              label="Modo LinkedIn Only (busca apenas no LinkedIn)"
            />
            <div>
              <label htmlFor="keywords" className="block text-text-secondary font-mono text-xs mb-1 uppercase">
                Palavras-chave adicionais
              </label>
              <input
                id="keywords"
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder='ex: "pequeno porte", "desde 2015", "premium"'
                className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-text-primary text-sm focus:border-accent/60 placeholder:text-text-secondary/40"
              />
            </div>
          </div>
        )}
      </div>

      {isLimited && (
        <div className="bg-danger/10 border border-danger/30 rounded-lg px-4 py-3 text-danger text-sm">
          Limite diário de 100 buscas atingido. Reset automático à meia-noite.
        </div>
      )}

      <button
        type="submit"
        disabled={!isValid || loading}
        className="w-full flex items-center justify-center gap-2 bg-accent hover:bg-accent-dim text-bg rounded-lg px-4 py-3 font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <Search size={16} />
        {loading ? 'Buscando...' : 'Buscar Leads'}
      </button>
    </form>
  )
}

function CheckOption({ id, checked, onChange, label }) {
  return (
    <div className="flex items-center gap-2">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="accent-accent"
      />
      <label htmlFor={id} className="text-text-secondary text-sm cursor-pointer hover:text-text-primary transition-colors">
        {label}
      </label>
    </div>
  )
}
