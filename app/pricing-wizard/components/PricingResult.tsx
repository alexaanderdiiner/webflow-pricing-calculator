'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { Badge } from '../../../components/ui/badge'
import { Switch } from '../../../components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { CheckCircle, Star, Info, Globe, Users, Zap, Check, Settings, ArrowLeft, RefreshCw } from 'lucide-react'
import { calculatePricing, UsageInputs, WebflowPlan, PricingConfig, FALLBACK_CONFIG } from '../../../lib/pricing'
import { recommendPlan, PlanRecommendation, WizardAnswers, getEstimatedUsage } from '../../../lib/recommendPlan'

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
      console.log('📊 Estimated usage from wizard answers:', estimatedUsage)
      return {
        plan: initialRecommendation.plan,
        billingCycle: 'Monthly',
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
      billingCycle: 'Monthly',
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
    console.log('💰 Initial pricing calculation with usage:', initialUsage)
    return calculatePricing(initialUsage, pricingConfig)
  })

  // Update pricing when usage changes
  useEffect(() => {
    const results = calculatePricing(customUsage, pricingConfig)
    setPricingResults(results)
  }, [customUsage, pricingConfig])

  const formatMoney = (value: number) => Math.round(value).toLocaleString()

  // Update recommendation when customization changes
  useEffect(() => {
    if (wizardAnswers) {
      const updatedAnswers: WizardAnswers = {
        ...wizardAnswers,
        features: {
          localization: customUsage.addOns.localizationLocales > 0,
          analytics: customUsage.addOns.analyzeSessions > 0,
          abTesting: customUsage.addOns.optimize,
        }
      }
      const newRecommendation = recommendPlan(updatedAnswers)
      setRecommendation(newRecommendation)
    }
  }, [customUsage, wizardAnswers])

  const updateUsage = (updates: Partial<UsageInputs>) => {
    console.log('🔄 updateUsage called with:', updates)
    setCustomUsage(prev => {
      const newUsage = { ...prev, ...updates }
      console.log('📝 New usage state:', newUsage)
      return newUsage
    })
  }

  const updateAddOn = (addOn: string, value: boolean | number) => {
    console.log('🔧 updateAddOn called:', addOn, '=', value)
    setCustomUsage(prev => ({
      ...prev,
      addOns: {
        ...prev.addOns,
        [addOn]: value,
      },
    }))
  }

  const getPlanColor = (plan: WebflowPlan) => {
    switch (plan) {
      case 'Starter': return 'bg-gray-100 text-gray-800'
      case 'Basic': return 'bg-blue-100 text-blue-800'
      case 'CMS': return 'bg-purple-100 text-purple-800'
      case 'Business': return 'bg-green-100 text-green-800'
      case 'Enterprise': return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getSourceBadge = () => {
    if (source === 'domain') {
      return (
        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
          <Globe className="w-3 h-3 mr-1" />
          Domain Analysis
        </Badge>
      )
    }
    return (
      <Badge variant="secondary" className="bg-green-100 text-green-800">
        <Star className="w-3 h-3 mr-1" />
        Wizard Recommendation
      </Badge>
    )
  }

  const handleToggleMode = () => {
    if (source === 'domain') {
      router.push('/pricing-wizard/wizard')
    } else {
      router.push('/pricing-wizard/domain')
    }
  }

  const handleStartOver = () => {
    router.push('/pricing-wizard')
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="w-full max-w-4xl mx-auto">
        {/* Back and Toggle Controls */}
        <div className="flex justify-between items-center mb-6">
          <Button
            variant="ghost"
            onClick={handleStartOver}
            className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Start Over
          </Button>
          
          <Button
            variant="ghost"
            onClick={handleToggleMode}
            className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try {source === 'domain' ? 'Wizard' : 'Domain Analysis'}
          </Button>
        </div>

        <Card className="bg-white border border-gray-200 shadow-lg rounded-xl">
          <CardContent className="p-8">
            <div className="space-y-8">
              {/* Header */}
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  {getSourceBadge()}
                </div>
                <h1 className="text-3xl font-display font-bold text-gray-900">
                  {source === 'domain' ? 'Perfect plan for your website' : 'Here\'s what we recommend'}
                </h1>
                {source === 'domain' && domainData && (
                  <div className="space-y-1">
                    <p className="text-gray-600">
                      Based on analysis of <strong>{domainData.domain}</strong> 
                      {domainData.isOnWebflow && ' (already on Webflow!)'}
                    </p>
                    {domainData.email && (
                      <p className="text-sm text-gray-500">
                        Results will be sent to: <strong>{domainData.email}</strong>
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Domain Analysis Summary */}
              {source === 'domain' && domainData && (
                <Card className="bg-gray-50 border-gray-200">
                  <CardContent className="p-6">
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <Label className="text-gray-700 font-medium">Industry</Label>
                        <div className="text-gray-900">{domainData.industry}</div>
                      </div>
                      <div>
                        <Label className="text-gray-700 font-medium">Analysis Confidence</Label>
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className="h-2 bg-brand rounded-full transition-all duration-500"
                              style={{ width: `${domainData.confidence}%` }}
                            />
                          </div>
                          <span className="text-gray-900 font-medium">{domainData.confidence}%</span>
                        </div>
                      </div>
                      <div>
                        <Label className="text-gray-700 font-medium">Current Status</Label>
                        <div className={`text-sm ${domainData.isOnWebflow ? 'text-green-700' : 'text-blue-700'}`}>
                          {domainData.isOnWebflow ? '✅ On Webflow' : '🔄 Not on Webflow'}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Enterprise Recommendation for Business Plan */}
              {recommendation.plan === 'Business' && (
                <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-300">
                  <CardContent className="p-8">
                    <div className="space-y-6">
                      <div className="text-center space-y-4">
                        <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-base px-4 py-2">
                          ⭐ Consider Enterprise
                        </Badge>
                        <h2 className="text-2xl font-display font-bold text-gray-900">
                          Your needs may be better served by Enterprise
                        </h2>
                        <p className="text-gray-700 max-w-2xl mx-auto">
                          Based on your requirements, the Enterprise plan offers advanced features, dedicated support, 
                          enhanced security, and custom solutions tailored to your business needs.
                        </p>
                      </div>
                      
                      <div className="flex justify-center">
                        <Button
                          size="lg"
                          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-10 py-4 text-lg shadow-lg"
                          onClick={() => window.open('https://webflow.com/enterprise/contact', '_blank')}
                        >
                          Contact Sales
                        </Button>
                      </div>

                      <div className="grid md:grid-cols-3 gap-4 pt-4">
                        <div className="text-center p-4">
                          <div className="text-purple-600 font-semibold mb-1">Unlimited Scale</div>
                          <div className="text-sm text-gray-600">No limits on bandwidth or requests</div>
                        </div>
                        <div className="text-center p-4">
                          <div className="text-purple-600 font-semibold mb-1">Dedicated Support</div>
                          <div className="text-sm text-gray-600">Priority assistance and account manager</div>
                        </div>
                        <div className="text-center p-4">
                          <div className="text-purple-600 font-semibold mb-1">Custom Solutions</div>
                          <div className="text-sm text-gray-600">Tailored to your specific needs</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Recommended Plan */}
              <Card className="bg-gradient-to-r from-gray-50 to-blue-50 border-2 border-brand/30">
                <CardContent className="p-8">
                  <div className="space-y-6">
                    <div className={`flex items-center ${recommendation.plan === 'Enterprise' ? 'justify-center' : 'justify-between'}`}>
                      <div className={`space-y-2 ${recommendation.plan === 'Enterprise' ? 'text-center' : ''}`}>
                        <div className={`flex items-center space-x-3 ${recommendation.plan === 'Enterprise' ? 'justify-center' : ''}`}>
                          <Badge className={getPlanColor(recommendation.plan)}>
                            {recommendation.plan}
                          </Badge>
                          <Badge variant="secondary" className="bg-brand/10 text-brand">
                            {recommendation.plan === 'Business' ? 'Alternative Option' : 'Recommended'}
                          </Badge>
                        </div>
                        <h2 className="text-2xl font-display font-bold text-gray-900">
                          Webflow {recommendation.plan} Plan
                        </h2>
                        <p className="text-gray-600">{recommendation.rationale}</p>
                      </div>
                      {recommendation.plan !== 'Enterprise' && (
                        <div className="text-right">
                          <div className="text-3xl font-bold text-gray-900">
                            ${customUsage.billingCycle === 'Yearly' ? formatMoney(pricingResults.yearlyTotal) : formatMoney(pricingResults.monthlyTotal)}
                            <span className="text-lg font-normal text-gray-500">/{customUsage.billingCycle === 'Yearly' ? 'year' : 'month'}</span>
                          </div>
                          <div className="text-sm text-gray-500">
                            {customUsage.billingCycle === 'Yearly'
                              ? `${formatMoney(pricingConfig.plans[customUsage.plan].monthly)}/month equivalent`
                              : `${formatMoney(Math.round(pricingConfig.plans[customUsage.plan].yearly / 12))}/month billed annually`}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Add-ons */}
                    {recommendation.addOnRationale.length > 0 && (
                      <div className="space-y-4">
                        <Label className="text-gray-900 font-medium">Suggested Add-ons</Label>
                        <div className="space-y-3">
                          {recommendation.addOnRationale.map((rationale, index) => (
                            <div key={index} className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200">
                              <Check className="w-4 h-4 text-green-500" />
                              <span className="text-gray-700">{rationale}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Customization Toggle */}
              <div className="flex items-center justify-center space-x-3">
                <Label htmlFor="customize-toggle" className="text-gray-700">
                  Want to customize your configuration?
                </Label>
                <Switch
                  id="customize-toggle"
                  checked={showCustomization}
                  onCheckedChange={(checked) => {
                    console.log('⚙️ Toggle clicked! New state:', checked)
                    setShowCustomization(checked)
                  }}
                />
                <Settings className="w-4 h-4 text-gray-500" />
              </div>

              {/* Customization Panel */}
              {showCustomization && (
                <Card className="bg-gray-50 border-gray-200">
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      <h3 className="text-lg font-display font-semibold text-gray-900">
                        Customize Your Plan
                      </h3>

                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Plan Selection */}
                        <div className="space-y-3">
                          <Label className="text-gray-700 font-medium">Plan</Label>
                          <Select
                            value={customUsage.plan}
                            onValueChange={(value: WebflowPlan) => updateUsage({ plan: value })}
                          >
                            <SelectTrigger>
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
                        </div>

                        {/* Billing Cycle */}
                        <div className="space-y-3">
                          <Label className="text-gray-700 font-medium">Billing Cycle</Label>
                          <Select
                            value={customUsage.billingCycle}
                            onValueChange={(value: 'Monthly' | 'Yearly') => updateUsage({ billingCycle: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Monthly">Monthly</SelectItem>
                              <SelectItem value="Yearly">Annual (Save 16%)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Add-ons */}
                      <div className="space-y-4">
                        <Label className="text-gray-700 font-medium">Add-ons</Label>
                        
                        {/* Optimize */}
                        <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                          <div className="flex items-center space-x-3">
                            <Zap className="w-5 h-5 text-orange-500" />
                            <div>
                              <div className="font-medium text-gray-900">Optimize</div>
                              <div className="text-sm text-gray-600">A/B testing and personalization</div>
                            </div>
                          </div>
                          <Switch
                            checked={customUsage.addOns.optimize}
                            onCheckedChange={(checked) => updateAddOn('optimize', checked)}
                          />
                        </div>

                        {/* Analyze */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                            <div className="flex items-center space-x-3">
                              <Users className="w-5 h-5 text-blue-500" />
                              <div>
                                <div className="font-medium text-gray-900">Analyze</div>
                                <div className="text-sm text-gray-600">Advanced analytics and insights</div>
                              </div>
                            </div>
                            <Switch
                              checked={customUsage.addOns.analyzeSessions > 0}
                              onCheckedChange={(checked) => updateAddOn('analyzeSessions', checked ? 10000 : 0)}
                            />
                          </div>
                          {customUsage.addOns.analyzeSessions > 0 && (
                            <div className="ml-8">
                              <Label className="text-sm text-gray-600">Sessions per month</Label>
                              <Select
                                value={customUsage.addOns.analyzeSessions.toString()}
                                onValueChange={(value) => updateAddOn('analyzeSessions', parseInt(value))}
                              >
                                <SelectTrigger className="w-48">
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
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                            <div className="flex items-center space-x-3">
                              <Globe className="w-5 h-5 text-green-500" />
                              <div>
                                <div className="font-medium text-gray-900">Localization</div>
                                <div className="text-sm text-gray-600">Multi-language support</div>
                              </div>
                            </div>
                            <Switch
                              checked={customUsage.addOns.localizationLocales > 0}
                              onCheckedChange={(checked) => updateAddOn('localizationLocales', checked ? 2 : 0)}
                            />
                          </div>
                          {customUsage.addOns.localizationLocales > 0 && (
                            <div className="ml-8">
                              <Label className="text-sm text-gray-600">Number of locales</Label>
                              <div className="flex items-center space-x-2 mt-1">
                                <Input
                                  type="number"
                                  min="1"
                                  max="10"
                                  value={customUsage.addOns.localizationLocales}
                                  onChange={(e) => updateAddOn('localizationLocales', parseInt(e.target.value) || 0)}
                                  className="w-20"
                                />
                                <span className="text-sm text-gray-500">locales</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Updated Pricing */}
                      {customUsage.plan === 'Enterprise' ? (
                        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-300">
                          <CardContent className="p-6">
                            <div className="text-center space-y-3">
                              <div className="font-semibold text-gray-900 text-lg">Enterprise Plan</div>
                              <div className="text-sm text-gray-600">
                                Custom pricing based on your specific needs
                              </div>
                              <Button
                                size="sm"
                                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium"
                                onClick={() => window.open('https://webflow.com/enterprise/contact', '_blank')}
                              >
                                Contact Sales for Pricing
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ) : (
                        <Card className="bg-white border-2 border-brand/30">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-medium text-gray-900">Custom Configuration Total</div>
                                <div className="text-sm text-gray-600">
                                  {customUsage.plan} plan + add-ons
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-2xl font-bold text-gray-900">
                                  ${customUsage.billingCycle === 'Yearly' ? pricingResults.yearlyTotal : pricingResults.monthlyTotal}
                                  <span className="text-lg font-normal text-gray-500">
                                    /{customUsage.billingCycle === 'Yearly' ? 'year' : 'month'}
                                  </span>
                                </div>
                                {customUsage.billingCycle === 'Yearly' && (
                                  <div className="text-sm text-green-600">
                                    Save ${pricingResults.savings}/year
                                  </div>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* CTA */}
              <div className="text-center space-y-4">
                <Button
                  size="lg"
                  className="bg-brand hover:bg-brand/90 text-white font-medium px-8 py-3"
                  onClick={() => window.open('https://webflow.com/pricing', '_blank')}
                >
                  Get Started with Webflow
                </Button>
                <p className="text-sm text-gray-500">
                  Ready to build your website? Sign up for your recommended plan.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
