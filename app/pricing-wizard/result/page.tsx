'use client'

import React, { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import PricingResult from '../components/PricingResult'
import { recommendPlan, WizardAnswers, PlanRecommendation } from '@/lib/recommendPlan'
import { WebflowPlan } from '@/lib/pricing'

function ResultContent() {
  const searchParams = useSearchParams()

  if (!searchParams) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    )
  }

  const source = searchParams.get('source') as 'wizard' | 'domain'

  if (source === 'domain') {
    // Handle domain analysis result
    const domain = searchParams.get('domain') || ''
    const email = searchParams.get('email') || ''
    const websiteType = searchParams.get('websiteType') as WizardAnswers['siteType'] || 'marketing'
    const industry = searchParams.get('industry') || 'Technology'
    const trafficTier = searchParams.get('trafficTier') || 'medium'
    const estimatedVisitors = parseInt(searchParams.get('estimatedVisitors') || '25000')
    const optimize = searchParams.get('optimize') === 'true'
    const analyze = searchParams.get('analyze') === 'true'
    const localization = searchParams.get('localization') === 'true'
    const confidence = parseInt(searchParams.get('confidence') || '75')
    const isOnWebflow = searchParams.get('isOnWebflow') === 'true'
    const webflowIndicators = searchParams.get('webflowIndicators')?.split(',') || []

    // Create wizard answers from domain analysis
    const wizardAnswers: WizardAnswers = {
      siteType: websiteType,
      monthlyVisitors: estimatedVisitors,
      contentUpdateFrequency: websiteType === 'blog' ? 'daily' : 'weekly',
      languages: localization ? 2 : 1,
      workspaceType: 'team', // Default for domain analysis
      features: {
        localization,
        analytics: analyze,
        abTesting: optimize,
      },
    }

    const recommendation = recommendPlan(wizardAnswers)

    const domainData = {
      domain,
      email,
      industry,
      confidence,
      isOnWebflow,
      webflowIndicators,
    }

    return (
      <PricingResult
        recommendation={recommendation}
        wizardAnswers={wizardAnswers}
        source="domain"
        domainData={domainData}
      />
    )
  } else if (source === 'wizard') {
    // Handle wizard result
    const plan = searchParams.get('plan') as WebflowPlan || 'Starter'
    const siteType = searchParams.get('siteType') as WizardAnswers['siteType'] || 'marketing'
    const monthlyVisitors = parseInt(searchParams.get('monthlyVisitors') || '2500')
    const contentUpdateFrequency = searchParams.get('contentUpdateFrequency') as WizardAnswers['contentUpdateFrequency'] || 'weekly'
    const languages = parseInt(searchParams.get('languages') || '1')
    const workspaceType = searchParams.get('workspaceType') as 'team' | 'freelancer' || 'team'
    const localization = searchParams.get('localization') === 'true'
    const analytics = searchParams.get('analytics') === 'true'
    const abTesting = searchParams.get('abTesting') === 'true'
    const optimize = searchParams.get('optimize') === 'true'
    const analyzeSessions = parseInt(searchParams.get('analyzeSessions') || '0')
    const localizationLocales = parseInt(searchParams.get('localizationLocales') || '0')

    const wizardAnswers: WizardAnswers = {
      siteType,
      monthlyVisitors,
      contentUpdateFrequency,
      languages,
      workspaceType,
      features: {
        localization,
        analytics,
        abTesting,
      },
    }

    const recommendation: PlanRecommendation = {
      plan,
      rationale: getRecommendationRationale(plan, wizardAnswers),
      addOns: {
        optimize,
        analyzeSessions,
        localizationLocales,
      },
      addOnRationale: getAddOnRationale(optimize, analyzeSessions, localizationLocales),
    }

    return (
      <PricingResult
        recommendation={recommendation}
        wizardAnswers={wizardAnswers}
        source="wizard"
      />
    )
  }

  // Fallback - redirect to main page
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="text-white text-lg">Invalid parameters</div>
        <a href="/pricing-wizard" className="text-blue-400 hover:text-blue-300 underline">
          Go back to pricing wizard
        </a>
      </div>
    </div>
  )
}

function getRecommendationRationale(plan: WebflowPlan, answers: WizardAnswers): string {
  switch (plan) {
    case 'Starter':
      return 'Starter plan is perfect for new sites with low traffic and basic requirements.'
    case 'Basic':
      return 'Basic plan recommended for growing sites with moderate traffic and basic hosting needs.'
    case 'CMS':
      return 'CMS plan recommended for content-driven sites with regular updates and moderate traffic.'
    case 'Business':
      return 'Business plan recommended for high-traffic sites or SaaS applications requiring advanced features and higher limits.'
    case 'Enterprise':
      return 'Enterprise plan recommended for high-traffic sites (100k+ visitors/month) with maximum bandwidth and performance.'
    default:
      return 'Recommended plan based on your requirements.'
  }
}

function getAddOnRationale(optimize: boolean, analyzeSessions: number, localizationLocales: number): string[] {
  const rationale: string[] = []
  
  if (optimize) {
    rationale.push('Optimize add-on for A/B testing and personalization features')
  }
  
  if (analyzeSessions > 0) {
    if (analyzeSessions >= 50000) {
      rationale.push('Analyze 50k sessions tier for comprehensive analytics on high-traffic sites')
    } else if (analyzeSessions >= 25000) {
      rationale.push('Analyze 25k sessions tier for detailed analytics on growing sites')
    } else {
      rationale.push('Analyze 10k sessions tier for essential analytics insights')
    }
  }
  
  if (localizationLocales > 0) {
    rationale.push(`Localization for ${localizationLocales} languages to reach international audiences`)
  }
  
  return rationale
}

export default function ResultPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-lg">Loading your results...</div>
      </div>
    }>
      <ResultContent />
    </Suspense>
  )
}
