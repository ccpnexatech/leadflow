export function buildSearchQuery(params) {
  const { niche, city, keywords, filterSocials, linkedinOnly } = params

  const socialExclusions = filterSocials
    ? ' -site:facebook.com -site:instagram.com -site:youtube.com -site:twitter.com -site:tiktok.com'
    : ''

  if (linkedinOnly) {
    const cityPart = city && city !== 'Todo o Brasil' ? ` "${city}"` : ''
    return `site:linkedin.com/company "${niche}"${cityPart}`
  }

  const cityPart = city && city !== 'Todo o Brasil' ? ` "${city}"` : ''
  const keywordsPart = keywords ? ` ${keywords}` : ''

  return `"${niche}"${cityPart}${keywordsPart}${socialExclusions}`
}

export function buildLinkedInCompanyLink(companyName) {
  const encoded = encodeURIComponent(`site:linkedin.com/company "${companyName}"`)
  return `https://www.google.com/search?q=${encoded}`
}

export function buildLinkedInLeadershipLinks(companyName, roles) {
  return roles.map((role) => ({
    role,
    googleUrl: `https://www.google.com/search?q=${encodeURIComponent(`site:linkedin.com/in "${role}" "${companyName}"`)}`,
    linkedinUrl: `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(`${role} ${companyName}`)}&origin=GLOBAL_SEARCH_HEADER`,
  }))
}
