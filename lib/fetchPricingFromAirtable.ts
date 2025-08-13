import 'server-only'

type CacheEntry<T> = { data: T; at: number } | null

const AIRTABLE_API = 'https://api.airtable.com/v0'
const DEFAULT_TTL_MS = 1000 * 60 * 5 // 5 minutes

let tableCache: Record<string, CacheEntry<any[]>> = {}

export async function fetchPricingData(table: string, ttlMs: number = DEFAULT_TTL_MS): Promise<any[]> {
  const apiKey = process.env.AIRTABLE_API_KEY
  const baseId = process.env.AIRTABLE_BASE_ID

  // Serve from cache when fresh
  const cached = tableCache[table]
  if (cached && Date.now() - cached.at < ttlMs) {
    return cached.data
  }

  // If missing env vars, return mock data for dev
  if (!apiKey || !baseId) {
    console.warn(`[pricing] Airtable env missing; using mock data for table: ${table}`)
    const mock = getMockTable(table)
    tableCache[table] = { data: mock, at: Date.now() }
    return mock
  }

  const url = `${AIRTABLE_API}/${baseId}/${encodeURIComponent(table)}`
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${apiKey}` },
    // Route/cache on the server; clients should use our API endpoint
    next: { revalidate: ttlMs / 1000 },
  })

  if (!res.ok) {
    console.error(`[pricing] Airtable fetch failed for ${table}: ${res.status} ${res.statusText}`)
    const mock = getMockTable(table)
    tableCache[table] = { data: mock, at: Date.now() }
    return mock
  }

  const json = await res.json()
  const records: any[] = (json.records || []).map((r: any) => ({ id: r.id, ...r.fields }))
  tableCache[table] = { data: records, at: Date.now() }
  return records
}

function getMockTable(table: string): any[] {
  // Minimal, sensible defaults to keep the app functional in dev
  if (table === 'SitePlans') {
    return [
      { name: 'Starter', monthly: 14, yearly: 144, bandwidthGB: 50, requestsM: 1, cpuH: 10, overageBandwidthPerGB: 0.15, overageRequestsPerM: 2.0, overageCpuPerH: 0.5 },
      { name: 'Basic', monthly: 23, yearly: 228, bandwidthGB: 100, requestsM: 2, cpuH: 20, overageBandwidthPerGB: 0.15, overageRequestsPerM: 2.0, overageCpuPerH: 0.5 },
      { name: 'CMS', monthly: 29, yearly: 288, bandwidthGB: 200, requestsM: 5, cpuH: 40, overageBandwidthPerGB: 0.15, overageRequestsPerM: 2.0, overageCpuPerH: 0.5 },
      { name: 'Business', monthly: 39, yearly: 390, bandwidthGB: 400, requestsM: 10, cpuH: 80, overageBandwidthPerGB: 0.15, overageRequestsPerM: 2.0, overageCpuPerH: 0.5 },
      { name: 'Enterprise', monthly: 235, yearly: 2350, bandwidthGB: 1000, requestsM: 25, cpuH: 200, overageBandwidthPerGB: 0.15, overageRequestsPerM: 2.0, overageCpuPerH: 0.5 },
    ]
  }
  if (table === 'AddOns') {
    return [
      { name: 'Optimize', type: 'toggle', monthly: 299, yearly: 299 * 12 * 0.75, description: 'A/B testing & personalization' },
      { name: 'Analyze', type: 'tier', sessions: 10000, price: 19, description: 'Analytics sessions tier' },
      { name: 'Analyze', type: 'tier', sessions: 50000, price: 49, description: 'Analytics sessions tier' },
      { name: 'Analyze', type: 'tier', sessions: 200000, price: 79, description: 'Analytics sessions tier' },
      { name: 'Localization', type: 'perLocale', pricePerLocale: 9, description: 'Per additional language' },
    ]
  }
  if (table === 'WorkspacePlans') {
    return [
      { name: 'Team', seatMonthly: 19, seatYearly: 180, features: 'collaboration' },
      { name: 'Freelancer', seatMonthly: 0, seatYearly: 0, features: 'solo' },
    ]
  }
  return []
}



