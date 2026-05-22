const SOCIAL_DOMAINS = [
  'facebook.com',
  'instagram.com',
  'youtube.com',
  'twitter.com',
  'x.com',
  'tiktok.com',
  'linkedin.com/in',
]

export function extractDomain(url) {
  try {
    const u = new URL(url)
    return u.hostname.replace('www.', '')
  } catch {
    return url
  }
}

export function isSocialMedia(url) {
  return SOCIAL_DOMAINS.some((d) => url.includes(d))
}

export function cleanCompanyName(title) {
  return title
    .replace(/\s*[-|–—]\s*.*$/, '')
    .replace(/\s*[|]\s*.*$/, '')
    .replace(/\s*:.*$/, '')
    .replace(/^\s*|\s*$/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

export function parseBraveResults(items = [], params = {}) {
  const { filterSocials, filterNoSite } = params

  return items
    .filter((item) => {
      if (!item?.url) return false
      if (filterSocials && isSocialMedia(item.url)) return false
      if (filterNoSite && isSocialMedia(item.url)) return false
      return true
    })
    .map((item, index) => {
      const domain = extractDomain(item.url)
      const companyName = cleanCompanyName(item.title || domain)

      return {
        id: `result-${Date.now()}-${index}`,
        name: companyName,
        rawTitle: item.title || '',
        domain,
        url: item.url,
        description: item.description || '',
        hasSite: !isSocialMedia(item.url),
        isLinkedIn: item.url.includes('linkedin.com/company'),
        savedAt: null,
        status: 'Novo',
        notes: '',
      }
    })
}
