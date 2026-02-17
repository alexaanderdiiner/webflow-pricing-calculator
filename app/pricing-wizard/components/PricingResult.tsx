'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { Switch } from '../../../components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { CheckCircle, Search, ChevronDown, ChevronUp, BarChart2, Globe, Target, DollarSign } from 'lucide-react'
import { calculatePricing, UsageInputs, WebflowPlan, PricingConfig, FALLBACK_CONFIG, calculateTotalCost, WorkspaceConfig } from '../../../lib/pricing'
import { recommendPlan, PlanRecommendation, WizardAnswers, getEstimatedUsage } from '../../../lib/recommendPlan'
import { WorkspaceType, TeamWorkspacePlan, FreelancerWorkspacePlan } from '../../../lib/workspaceData'
import WorkspacePricingCard from './WorkspacePricingCard'

interface PricingResultProps {
  recommendation: PlanRecommendation
  wizardAnswers?: WizardAnswers
  source: 'wizard' | 'domain'
  domainData?: {
    domain: string
    email?: string
    industry: string
    confidence: number
    isOnWebflow: boolean
    webflowIndicators?: string[]
  }
  onCustomize?: () => void
}

export default function PricingResult({
  recommendation: initialRecommendation,
  wizardAnswers,
  source,
  domainData,
  onCustomize
}: PricingResultProps) {
  const router = useRouter()
  const [recommendation, setRecommendation] = useState(initialRecommendation)
  const [showCustomization, setShowCustomization] = useState(false)
  const [pricingConfig, setPricingConfig] = useState<PricingConfig>(FALLBACK_CONFIG)

  // Workspace configuration state
  const [workspaceConfig, setWorkspaceConfig] = useState<WorkspaceConfig>({
    type: 'team',
    plan: 'Core',
    seats: {
      full: 1,
      limited: 0,
      free: 0
    }
  })

  // Load live pricing config (Airtable via API) with fallback
  useEffect(() => {
    let cancelled = false
    async function loadConfig() {
      try {
        const res = await fetch('/api/pricing', { cache: 'no-store' })
        if (!res.ok) throw new Error('failed to load pricing config')
        const json = await res.json()
        if (!cancelled) setPricingConfig(json)
      } catch (e) {
        console.warn('[pricing] using fallback config', e)
        if (!cancelled) setPricingConfig(FALLBACK_CONFIG)
      }
    }
    loadConfig()
    return () => { cancelled = true }
  }, [])

  // Calculate realistic usage estimates from wizard answers
  const getInitialUsage = (): UsageInputs => {
    if (wizardAnswers) {
      const estimatedUsage = getEstimatedUsage(wizardAnswers)
      return {
        plan: initialRecommendation.plan,
        billingCycle: 'Yearly',
        bandwidth: estimatedUsage.bandwidth,
        requests: estimatedUsage.requests,
        cpu: estimatedUsage.cpu,
        addOns: {
          optimize: initialRecommendation.addOns.optimize,
          analyzeSessions: initialRecommendation.addOns.analyzeSessions,
          localizationLocales: initialRecommendation.addOns.localizationLocales,
        },
      }
    }

    // Fallback for cases without wizard answers
    return {
      plan: initialRecommendation.plan,
      billingCycle: 'Yearly',
      bandwidth: 10,
      requests: 0.5,
      cpu: 5,
      addOns: {
        optimize: initialRecommendation.addOns.optimize,
        analyzeSessions: initialRecommendation.addOns.analyzeSessions,
        localizationLocales: initialRecommendation.addOns.localizationLocales,
      },
    }
  }

  const [customUsage, setCustomUsage] = useState<UsageInputs>(getInitialUsage())

  const [pricingResults, setPricingResults] = useState(() => {
    const initialUsage = getInitialUsage()
    return calculatePricing(initialUsage, pricingConfig)
  })

  // Update pricing when usage changes
  useEffect(() => {
    const results = calculatePricing(customUsage, pricingConfig)
    setPricingResults(results)
  }, [customUsage, pricingConfig])

  const formatMoney = (value: number) => Math.round(value).toLocaleString()

  const updateUsage = (updates: Partial<UsageInputs>) => {
    setCustomUsage(prev => {
      const newUsage = { ...prev, ...updates }
      // Force Enterprise to always use Yearly billing
      if (newUsage.plan === 'Enterprise') {
        newUsage.billingCycle = 'Yearly'
      }
      return newUsage
    })
  }

  const updateAddOn = (addOn: string, value: boolean | number) => {
    setCustomUsage(prev => ({
      ...prev,
      addOns: {
        ...prev.addOns,
        [addOn]: value,
      },
    }))
  }

  const handleStartOver = () => {
    if (source === 'domain') {
      router.push('/pricing-wizard/domain')
    } else {
      router.push('/pricing-wizard/wizard')
    }
  }

  const getWebsiteTypeDisplay = () => {
    if (!wizardAnswers) return 'SaaS'
    const type = wizardAnswers.siteType
    return type.charAt(0).toUpperCase() + type.slice(1)
  }

  const getTrafficDisplay = () => {
    if (!wizardAnswers) return '100k+ monthly visitors'
    const visitors = wizardAnswers.monthlyVisitors
    if (visitors < 10000) return '< 10k monthly visitors'
    if (visitors < 50000) return '10k - 50k monthly visitors'
    if (visitors < 100000) return '50k - 100k monthly visitors'
    return '100k+ monthly visitors'
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA] py-8 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-3xl mx-auto">
        {/* Start Over Link */}
        <div className="mb-6">
          <button
            onClick={handleStartOver}
            className="text-[#4353FF] hover:text-[#3142E6] font-medium inline-flex items-center"
          >
            ← Start Over
          </button>
        </div>

        {/* Success Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
            <CheckCircle className="w-7 h-7 text-[#7C3AED]" />
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-display font-bold text-gray-900 mb-2">
            Analysis Complete
          </h1>
          <p className="text-gray-600">
            Here's what we recommend for your specific needs.
          </p>
        </div>

        {/* Main Results Card */}
        <Card className="bg-white border-none shadow-sm rounded-2xl mb-6">
          <CardContent className="p-8">
            {/* Migration Callout (if not on Webflow) */}
            {source === 'domain' && domainData && !domainData.isOnWebflow && (
              <div className="mb-8 p-6 bg-blue-50 border border-blue-200 rounded-xl">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Search className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Not on Webflow</h3>
                    <p className="text-sm text-gray-700">
                      This site could benefit from migrating to Webflow for better design flexibility and hosting.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Analysis Summary Grid */}
            {source === 'domain' && domainData && (
              <div className="grid grid-cols-2 gap-4 mb-8">
                {/* Website Type */}
                <div>
                  <Label className="text-xs uppercase tracking-wide text-gray-600 mb-2 block">
                    Website Type
                  </Label>
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-900 font-medium">{getWebsiteTypeDisplay()}</span>
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </div>

                {/* Industry */}
                <div>
                  <Label className="text-xs uppercase tracking-wide text-gray-600 mb-2 block">
                    Industry
                  </Label>
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-900 font-medium">{domainData.industry}</span>
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </div>

                {/* Estimated Traffic */}
                <div>
                  <Label className="text-xs uppercase tracking-wide text-gray-600 mb-2 block">
                    Estimated Traffic
                  </Label>
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-900 font-medium">{getTrafficDisplay()}</span>
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </div>

                {/* Analysis Confidence */}
                <div>
                  <Label className="text-xs uppercase tracking-wide text-gray-600 mb-2 block">
                    Analysis Confidence
                  </Label>
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 bg-[#4353FF] rounded-full transition-all duration-500"
                          style={{ width: `${domainData.confidence}%` }}
                        />
                      </div>
                      <span className="text-gray-900 font-medium text-sm">{domainData.confidence}%</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Plan Recommendation */}
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-display font-bold text-gray-900 mb-2">
                    Webflow {recommendation.plan} Plan{recommendation.addOnRationale.length > 0 && '+'}
                  </h2>
                  <p className="text-gray-600 text-sm max-w-md">
                    {recommendation.rationale}
                  </p>
                </div>
                {recommendation.plan !== 'Enterprise' && (
                  <div className="text-right">
                    <div className="text-3xl font-bold text-gray-900">
                      ${formatMoney(pricingResults.monthlyTotal)}<span className="text-lg font-normal text-gray-500">/mo</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      Billed {customUsage.billingCycle === 'Yearly' ? 'annually' : 'monthly'}
                    </div>
                  </div>
                )}
              </div>

              {/* Suggested Add-ons */}
              {recommendation.addOnRationale.length > 0 && (
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-gray-900">Suggested Add-ons</Label>
                  <div className="space-y-2">
                    {recommendation.addOnRationale.map((rationale, index) => {
                      // Determine icon based on rationale content
                      let icon = <BarChart2 className="w-5 h-5 text-orange-500" />
                      if (rationale.toLowerCase().includes('localiz')) {
                        icon = <Globe className="w-5 h-5 text-green-500" />
                      } else if (rationale.toLowerCase().includes('optim')) {
                        icon = <Target className="w-5 h-5 text-orange-500" />
                      }

                      return (
                        <div key={index} className="flex items-start space-x-3">
                          <div className="flex-shrink-0 mt-0.5">
                            {icon}
                          </div>
                          <p className="text-sm text-gray-700">{rationale}</p>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Customize Plan Toggle */}
              <div className="pt-4">
                <button
                  onClick={() => setShowCustomization(!showCustomization)}
                  className="w-full p-4 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors flex items-center justify-between"
                  aria-expanded={showCustomization}
                  aria-controls="customization-panel"
                >
                  <span className="font-medium text-gray-900">Customize Plan</span>
                  {showCustomization ? (
                    <ChevronUp className="w-5 h-5 text-gray-600" aria-hidden="true" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-600" aria-hidden="true" />
                  )}
                </button>
              </div>

              {/* Customization Panel */}
              {showCustomization && (
                <div id="customization-panel" className="space-y-6 pt-4">
                  {/* Base Plan */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <Label className="text-sm font-semibold text-gray-900">Base Plan</Label>
                      <div className="text-lg font-bold text-gray-900">
                        ${formatMoney(pricingResults.basePlanCost)}<span className="text-sm font-normal text-gray-500">/mo</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Select
                        value={customUsage.plan}
                        onValueChange={(value: WebflowPlan) => updateUsage({ plan: value })}
                      >
                        <SelectTrigger className="h-12">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.keys(pricingConfig.plans).map(plan => {
                            if (plan === 'Enterprise') {
                              return (
                                <SelectItem key={plan} value={plan}>
                                  {plan} - Contact Sales
                                </SelectItem>
                              )
                            }
                            return (
                              <SelectItem key={plan} value={plan}>
                                {plan} - ${pricingConfig.plans[plan as WebflowPlan].monthly}/month
                              </SelectItem>
                            )
                          })}
                        </SelectContent>
                      </Select>

                      <Select
                        value={customUsage.billingCycle}
                        onValueChange={(value: 'Monthly' | 'Yearly') => updateUsage({ billingCycle: value })}
                        disabled={customUsage.plan === 'Enterprise'}
                      >
                        <SelectTrigger className="h-12">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Monthly">Monthly</SelectItem>
                          <SelectItem value="Yearly">Annual</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Add-Ons */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <Label className="text-sm font-semibold text-gray-900">Add-Ons</Label>
                      <div className="text-lg font-bold text-gray-900">
                        ${formatMoney(pricingResults.addOnCosts.analyze + pricingResults.addOnCosts.localization + pricingResults.addOnCosts.optimize)}<span className="text-sm font-normal text-gray-500">/mo</span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      {/* Analyze */}
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <BarChart2 className="w-5 h-5 text-blue-500" />
                            <div>
                              <div className="font-medium text-gray-900">Analyze</div>
                              <div className="text-xs text-gray-600">Advanced analytics and insights</div>
                            </div>
                          </div>
                          <Switch
                            checked={customUsage.addOns.analyzeSessions > 0}
                            onCheckedChange={(checked) => updateAddOn('analyzeSessions', checked ? 10000 : 0)}
                          />
                        </div>
                        {customUsage.addOns.analyzeSessions > 0 && (
                          <div className="mt-3">
                            <Label className="text-xs uppercase tracking-wide text-gray-600 mb-2 block">
                              Sessions per month
                            </Label>
                            <Select
                              value={customUsage.addOns.analyzeSessions.toString()}
                              onValueChange={(value) => updateAddOn('analyzeSessions', parseInt(value))}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {pricingConfig.addOns.analyze.tiers.map(tier => (
                                  <SelectItem key={tier.sessions} value={String(tier.sessions)}>
                                    {Intl.NumberFormat().format(tier.sessions)} sessions
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      </div>

                      {/* Localization */}
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <Globe className="w-5 h-5 text-green-500" />
                            <div>
                              <div className="font-medium text-gray-900">Localization</div>
                              <div className="text-xs text-gray-600">Multi-language support</div>
                            </div>
                          </div>
                          <Switch
                            checked={customUsage.addOns.localizationLocales > 0}
                            onCheckedChange={(checked) => updateAddOn('localizationLocales', checked ? 2 : 0)}
                          />
                        </div>
                        {customUsage.addOns.localizationLocales > 0 && (
                          <div className="mt-3">
                            <Label className="text-xs uppercase tracking-wide text-gray-600 mb-2 block">
                              Number of locales
                            </Label>
                            <Input
                              type="number"
                              min="1"
                              max="10"
                              value={customUsage.addOns.localizationLocales}
                              onChange={(e) => updateAddOn('localizationLocales', parseInt(e.target.value) || 0)}
                              className="h-10"
                            />
                          </div>
                        )}
                      </div>

                      {/* Optimize */}
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Target className="w-5 h-5 text-orange-500" />
                            <div>
                              <div className="font-medium text-gray-900">Optimize</div>
                              <div className="text-xs text-gray-600">A/B testing and personalization</div>
                            </div>
                          </div>
                          <Switch
                            checked={customUsage.addOns.optimize}
                            onCheckedChange={(checked) => updateAddOn('optimize', checked)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Workspace Pricing */}
        <WorkspacePricingCard
          workspaceType={workspaceConfig.type}
          workspacePlan={workspaceConfig.plan}
          seats={workspaceConfig.seats || { full: 1, limited: 0, free: 0 }}
          billingCycle={customUsage.billingCycle}
          onWorkspaceTypeChange={(type) => setWorkspaceConfig({
            ...workspaceConfig,
            type,
            plan: type === 'team' ? 'Core' : 'Freelancer'
          })}
          onWorkspacePlanChange={(plan) => setWorkspaceConfig({
            ...workspaceConfig,
            plan
          })}
          onSeatsChange={(seats) => setWorkspaceConfig({
            ...workspaceConfig,
            seats
          })}
        />

        {/* Total Cost Breakdown */}
        <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-200">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Your Complete Pricing</h3>
                  <p className="text-xs text-gray-600">Total monthly cost for workspace + hosting + add-ons</p>
                </div>
              </div>

              {(() => {
                const totalCost = calculateTotalCost(
                  customUsage,
                  workspaceConfig,
                  pricingConfig
                )

                return (
                  <>
                    {/* Breakdown */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-700">
                          Workspace ({workspaceConfig.type === 'team' ? 'Team' : 'Freelancer/Agency'} - {workspaceConfig.plan})
                        </span>
                        <span className="font-medium text-gray-900">
                          ${formatMoney(totalCost.workspace.cost)}/mo
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-700">
                          Hosting ({customUsage.plan} Plan)
                        </span>
                        <span className="font-medium text-gray-900">
                          ${formatMoney(totalCost.hosting.baseCost)}/mo
                        </span>
                      </div>
                      {totalCost.addOns.total > 0 && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-700">Add-ons</span>
                          <span className="font-medium text-gray-900">
                            ${formatMoney(totalCost.addOns.total)}/mo
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Grand Total */}
                    <div className="pt-4 border-t-2 border-green-300">
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-gray-900">Grand Total</span>
                        <div className="text-right">
                          <div className="text-3xl font-bold text-gray-900">
                            ${formatMoney(totalCost.grandTotal)}
                            <span className="text-lg font-normal text-gray-500">/mo</span>
                          </div>
                          {customUsage.billingCycle === 'Yearly' && (
                            <div className="text-sm text-green-600 font-medium">
                              Billed annually (${formatMoney(totalCost.grandTotal * 12)}/year)
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                )
              })()}
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center">
          <Button
            size="lg"
            className="bg-[#4353FF] hover:bg-[#3142E6] text-white font-medium px-12 py-6 text-base h-auto"
            onClick={() => window.open('https://webflow.com/pricing', '_blank')}
          >
            Get Started with this plan
          </Button>
        </div>
      </div>
    </div>
  )
}
