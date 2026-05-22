# LeadFlow

Ferramenta gratuita de geração de leads para prospecção no LinkedIn. Busca empresas por nicho e cidade, e entrega links prontos para encontrar os líderes de cada empresa diretamente no LinkedIn.

> Criada para resolver um problema real: encontrar perfis qualificados no LinkedIn para se conectar, sem depender da busca nativa da plataforma.

**[→ Acessar o LeadFlow](https://automacao-lead-flow.netlify.app)**

---

## Como funciona

1. Você informa o **nicho** (ex: Escritório de Contabilidade) e a **cidade**
2. O LeadFlow busca empresas reais com site ativo via **Brave Search API**
3. Para cada empresa encontrada, gera links de busca no Google apontando para os perfis de liderança no LinkedIn (CEO, Sócio, Diretor, etc.)
4. Você exporta os resultados em **CSV** e usa como base para sua prospecção

Nenhum dado sai do seu navegador. Não há banco de dados, não há login, não há rastreamento.

---

## Como usar

### Opção 1 — Usar direto no navegador (recomendado)

Acesse **[automacao-lead-flow.netlify.app](https://automacao-lead-flow.netlify.app)**, insira sua Brave Search API Key e comece a buscar. Não é necessário instalar nada.

### Opção 2 — Deploy próprio

Se preferir hospedar sua própria instância:

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/ccpnexatech/leadflow)

### Opção 3 — Rodar localmente

```bash
git clone https://github.com/ccpnexatech/leadflow.git
cd leadflow
npm install
npx netlify dev
```

> Necessário ter o [Netlify CLI](https://docs.netlify.com/cli/get-started/) instalado: `npm install -g netlify-cli`

---

## Pré-requisito: Brave Search API Key

O LeadFlow usa a [Brave Search API](https://brave.com/search/api/) como motor de busca. O plano gratuito oferece **2.000 buscas por mês**.

1. Acesse [brave.com/search/api](https://brave.com/search/api/)
2. Crie uma conta gratuita
3. Gere uma API Key no painel
4. Cole a chave na tela inicial do LeadFlow

---

## Funcionalidades

- Busca por **nicho + cidade** com filtros avançados
- 12 nichos pré-configurados + campo livre para qualquer segmento
- 10 cidades pré-configuradas + campo livre para qualquer cidade
- Seleção de **cargos de liderança** para gerar links direcionados (CEO, Sócio/Fundador, Diretor Comercial, CTO, CFO e mais)
- Cargo personalizado para qualquer função
- Filtros: excluir redes sociais, apenas empresas com site, modo LinkedIn Only
- Visualização em **tabela** ou **cards**
- Aba **Leads** para salvar e gerenciar empresas com status e anotações
- **Histórico** de buscas realizadas na sessão
- Exportação em **CSV** com links LinkedIn prontos para uso
- Limite de uso visível (2.000 buscas/mês grátis)
- 100% local — zero dados enviados a servidores próprios

---

## Stack

- **React** + **Vite** — interface
- **Tailwind CSS** + **Framer Motion** — estilo e animações
- **Netlify Functions** — proxy seguro para a Brave Search API
- **PapaParse** — exportação CSV
- **Brave Search API** — motor de busca

---

## Estrutura do projeto

```
leadflow/
├── netlify/
│   └── functions/
│       └── search.js       # Proxy para a Brave Search API
├── src/
│   ├── components/         # CounterBar, SearchForm, ResultsTable, ResultsCards...
│   ├── hooks/              # useSearch, useLeads, useApiCounter, useSession
│   ├── lib/                # queryBuilder, parseResults, exportData
│   └── pages/              # Search, Leads, History, Settings
└── netlify.toml
```

---

## Limitações conhecidas

- Os links gerados apontam para buscas no Google — não acessam o LinkedIn diretamente
- Nem todas as empresas encontradas terão perfil no LinkedIn
- A qualidade dos resultados depende da indexação da Brave Search

---

## Licença

MIT — use, modifique e distribua livremente.

---

Feito por [@ccpnexatech](https://github.com/ccpnexatech)
