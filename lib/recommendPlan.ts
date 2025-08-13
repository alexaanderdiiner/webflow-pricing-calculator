import { WebflowPlan, PLAN_PRICING, ADD_ON_PRICING } from './pricing'

export interface WizardAnswers {
  siteType: 'marketing' | 'blog' | 'portfolio' | 'saas' | 'ecommerce' | 'other'
  monthlyVisitors: number
  contentUpdateFrequency: 'rarely' | 'weekly' | 'daily'
  languages: number
  workspaceType: 'team' | 'freelancer'
  features: {
    localization: boolean
    analytics: boolean
    abTesting: boolean
  }
}

export interface PlanRecommendation {
  plan: WebflowPlan
  rationale: string
  addOns: {
    optimize: boolean
    analyzeSessions: number
    localizationLocales: number
  }
  addOnRationale: string[]
}

export function recommendPlan(answers: WizardAnswers): PlanRecommendation {
  let recommendedPlan: WebflowPlan = 'Starter'
  let rationale = ''
  
  const addOns = {
    optimize: false,
    analyzeSessions: 0,
    localizationLocales: 0,
  }
  
  const addOnRationale: string[] = []

  // Plan recommendation logic
  if (answers.monthlyVisitors > 100000) {
    recommendedPlan = 'Enterprise'
    rationale = 'Enterprise plan recommended for high-traffic sites (100k+ visitors/month) with maximum bandwidth and performance.'
  } else if (answers.monthlyVisitors > 50000 || answers.siteType === 'saas') {
    recommendedPlan = 'Business'
    rationale = 'Business plan recommended for high-traffic sites or SaaS applications requiring advanced features and higher limits.'
  } else if (
    answers.monthlyVisitors > 10000 || 
    answers.contentUpdateFrequency !== 'rarely' ||
    ['blog', 'marketing', 'saas'].includes(answers.siteType)
  ) {
    recommendedPlan = 'CMS'
    rationale = 'CMS plan recommended for content-driven sites with regular updates and moderate traffic.'
  } else if (answers.monthlyVisitors > 5000 || answers.siteType === 'portfolio') {
    recommendedPlan = 'Basic'
    rationale = 'Basic plan recommended for growing sites with moderate traffic and basic hosting needs.'
  } else {
    recommendedPlan = 'Starter'
    rationale = 'Starter plan is perfect for new sites with low traffic and basic requirements.'
  }

  // Add-on recommendations
  if (answers.features.abTesting) {
    addOns.optimize = true
    addOnRationale.push('Optimize add-on for A/B testing and personalization features')
  }

  if (answers.features.analytics) {
    // Recommend tier based on traffic
    if (answers.monthlyVisitors > 25000) {
      addOns.analyzeSessions = 50000
      addOnRationale.push('Analyze 50k sessions tier for comprehensive analytics on high-traffic sites')
    } else if (answers.monthlyVisitors > 10000) {
      addOns.analyzeSessions = 25000
      addOnRationale.push('Analyze 25k sessions tier for detailed analytics on growing sites')
    } else {
      addOns.analyzeSessions = 10000
      addOnRationale.push('Analyze 10k sessions tier for essential analytics insights')
    }
  }

  if (answers.features.localization) {
    // Estimate 2-3 locales for most international sites
    addOns.localizationLocales = answers.siteType === 'ecommerce' ? 3 : 2
    addOnRationale.push(`Localization for ${addOns.localizationLocales} languages to reach international audiences`)
  }

  return {
    plan: recommendedPlan,
    rationale,
    addOns,
    addOnRationale,
  }
}

export function getEstimatedUsage(answers: WizardAnswers) {
  // Estimate bandwidth based on visitors (assuming 2MB per visitor on average)
  const estimatedBandwidth = Math.ceil(answers.monthlyVisitors * 2 / 1000) // Convert to GB
  
  // Estimate requests (assume 10 requests per visitor)
  const estimatedRequests = answers.monthlyVisitors * 10 / 1000000 // Convert to millions
  
  // Estimate CPU based on site complexity and update frequency
  let baseCPU = 5
  if (answers.siteType === 'saas' || answers.siteType === 'ecommerce') baseCPU = 20
  if (answers.contentUpdateFrequency === 'daily') baseCPU *= 2
  if (answers.contentUpdateFrequency === 'weekly') baseCPU *= 1.5
  
  return {
    bandwidth: Math.max(1, estimatedBandwidth),
    requests: Math.max(0.1, estimatedRequests),
    cpu: baseCPU,
  }
}
