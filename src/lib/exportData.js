import Papa from 'papaparse'
import { buildLinkedInCompanyLink, buildLinkedInLeadershipLinks } from './queryBuilder'

export function exportCSV(leads, roles = []) {
  const rows = leads.map((lead) => ({
    Nome: lead.name,
    Site: lead.url,
    Dominio: lead.domain,
    Descricao: lead.description,
    'LinkedIn Empresa': buildLinkedInCompanyLink(lead.name),
    'Buscar Liderança': roles
      .map((r) => buildLinkedInLeadershipLinks(lead.name, [r])[0]?.googleUrl)
      .join(' | '),
    Status: lead.status,
    Notas: lead.notes,
    'Data de Busca': lead.savedAt ? new Date(lead.savedAt).toLocaleDateString('pt-BR') : '',
  }))

  const csv = Papa.unparse(rows)
  return csv
}

export function downloadFile(content, filename, type = 'text/csv') {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function generateFilename(niche, city, ext) {
  const date = new Date().toISOString().split('T')[0]
  const nicheSlug = niche.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  const citySlug = city.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  return `leadflow_${nicheSlug}_${citySlug}_${date}.${ext}`
}
