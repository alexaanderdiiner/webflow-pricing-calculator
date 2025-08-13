import { NextRequest } from 'next/server'
import { fetchPricingData } from '@/lib/fetchPricingFromAirtable'
import { FALLBACK_CONFIG, PricingConfig, WebflowPlan, PlanPricing, AddOnPricing, OverageRates } from '@/lib/pricing'

export async function GET(_req: NextRequest) {
  try {
    const [sitePlans, addOnsRaw] = await Promise.all([
      fetchPricingData('SitePlans'),
      fetchPricingData('AddOns'),
    ])

    // Normalize plans
    const plans = sitePlans.reduce((acc: Record<WebflowPlan, PlanPricing>, row: any) => {
      const name = String(row.name) as WebflowPlan
      if (!name) return acc
      acc[name] = {
        monthly: Number(row.monthly),
        yearly: Number(row.yearly),
        limits: {
          bandwidth: Number(row.bandwidthGB),
          requests: Number(row.requestsM),
          cpu: Number(row.cpuH),
        },
      }
      return acc
    }, {} as Record<WebflowPlan, PlanPricing>)

    // Normalize add-ons
    const addOns: AddOnPricing = {
      optimize: { monthly: 0, yearly: 0 },
      analyze: { tiers: [] },
      localization: { pricePerLocale: 0 },
    }

    for (const row of addOnsRaw) {
      const type = String(row.type || '').toLowerCase()
      if (row.name === 'Optimize' && (type === 'toggle' || type === 'optimize')) {
        addOns.optimize.monthly = Number(row.monthly || row.price || 0)
        addOns.optimize.yearly = Number(row.yearly || row.annual || row.priceAnnual || addOns.optimize.monthly * 12 * 0.85)
      } else if (row.name === 'Analyze' && (type === 'tier' || type === 'analyze')) {
        addOns.analyze.tiers.push({ sessions: Number(row.sessions), price: Number(row.price) })
      } else if (row.name === 'Localization' && (type === 'perLocale' || type === 'localization' || type === 'perlocale')) {
        addOns.localization.pricePerLocale = Number(row.pricePerLocale || row.price)
      }
    }
    // Ensure analyze tiers sorted
    addOns.analyze.tiers.sort((a, b) => a.sessions - b.sessions)

    // Overage rates: can be included per plan row or separate table; prefer per-plan if present, else fallback
    const anyPlan = sitePlans[0] || {}
    const overage: OverageRates = {
      bandwidth: Number(anyPlan.overageBandwidthPerGB ?? 0.15),
      requests: Number(anyPlan.overageRequestsPerM ?? 2.0),
      cpu: Number(anyPlan.overageCpuPerH ?? 0.5),
    }

    const config: PricingConfig = { plans, addOns, overage }
    return Response.json(config, { headers: { 'Cache-Control': 's-maxage=300, stale-while-revalidate=60' } })
  } catch (err) {
    console.error('[pricing] API error, serving fallback', err)
    return Response.json(FALLBACK_CONFIG, { status: 200 })
  }
}



