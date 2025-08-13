'use client'

import React, { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Users, Briefcase, Globe, Loader2, Zap, Check } from 'lucide-react'
import { PLAN_PRICING, calculatePricing } from '@/lib/pricing'
import { TEAM_WORKSPACE_PRICING, FREELANCER_WORKSPACE_PRICING, SEAT_PRICING } from '@/lib/workspaceData'
import { calculateWorkspaceCost, calculateTeamWorkspaceCost, calculateFreelancerWorkspaceCost } from '@/lib/recommendWorkspace'

interface DomainAnalysis {
  websiteType: 'marketing' | 'blog' | 'portfolio' | 'saas' | 'ecommerce' | 'other'
  industry: string
  trafficTier: 'low' | 'medium' | 'high' | 'enterprise'
  estimatedVisitors: number
  suggestedAddOns: {
    optimize: boolean
    analyze: boolean
    localization: boolean
  }
  confidence: number
  isOnWebflow: boolean
  webflowIndicators?: string[]
}

interface CalculatorState {
  selectedPlan: 'free' | 'starter' | 'cms' | 'business'
  monthlyVisitors: number
  languages: number
  teamSize: number
  workspaceType: 'team' | 'freelancer'
  seats: {
    full: number
    limited: number
    free: number
  }
  features: {
    localization: boolean
    analytics: boolean
    ab_personalization: boolean
  }
}

export default function CalculatorView() {
  // Domain analysis state
  const [url, setUrl] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<DomainAnalysis | null>(null)
  const [domainError, setDomainError] = useState<string | null>(null)

  const [state, setState] = useState<CalculatorState>({
    selectedPlan: 'cms',
    monthlyVisitors: 1000,
    languages: 1,
    teamSize: 1,
    workspaceType: 'team',
    seats: {
      full: 1,
      limited: 0,
      free: 0
    },
    features: {
      localization: false,
      analytics: false,
      ab_personalization: false
    }
  })

  const planOptions = [
    {
      id: 'free' as const,
      name: 'Free',
      price: 0,
      description: 'For those getting started with Webflow.',
      features: 'Build and test your site with Webflow branding'
    },
    {
      id: 'starter' as const,
      name: 'Starter',
      price: 14,
      description: 'For relatively simple, static sites.',
      features: 'Perfect for portfolios, landing pages, and basic business sites'
    },
    {
      id: 'cms' as const,
      name: 'CMS Plan',
      price: 23,
      description: 'For blogs or other content-driven sites.',
      features: 'Includes CMS, blog functionality, and dynamic content management'
    },
    {
      id: 'business' as const,
      name: 'Business',
      price: 39,
      description: 'For larger sites that need more flexibility.',
      features: 'Advanced interactions, form handling, and team collaboration'
    }
  ]

  const enterprisePlan = {
    name: 'Enterprise',
    description: 'For those who need a scalable custom solution.',
    features: [
      'Enterprise-ready scale',
      'Advanced collaboration',
      'Guaranteed SLA', 
      'Enterprise security',
      'Customer success',
      'Enterprise support'
    ]
  }

  const addOns = [
    {
      key: 'localization' as const,
      name: 'Multi-language Support',
      description: 'Translate your site content for international audiences',
      price: 9
    },
    {
      key: 'analytics' as const,
      name: 'Built-in Analytics',
      description: 'Track visitor behavior, conversions, and site performance',
      price: 29
    },
    {
      key: 'ab_personalization' as const,
      name: 'A/B Testing & Personalization',
      description: 'Optimize your site with experiments and personalized content',
      price: 299
    }
  ]

  const calculateTotal = () => {
    const basePlan = planOptions.find(p => p.id === state.selectedPlan)
    const basePrice = basePlan?.price || 0
    
    const addOnCosts = Object.entries(state.features).reduce((total, [key, enabled]) => {
      if (enabled) {
        const addOn = addOns.find(a => a.key === key)
        if (key === 'localization') {
          // Localization costs $9 per additional language (first language is free)
          return total + ((addOn?.price || 0) * Math.max(0, state.languages - 1))
        }
        return total + (addOn?.price || 0)
      }
      return total
    }, 0)
    
    // Calculate workspace cost based on type using seat-based pricing
    let workspaceCost = 0
    if (state.workspaceType === 'team') {
      workspaceCost = calculateTeamWorkspaceCost('Core', state.seats, 'Monthly')
    } else if (state.workspaceType === 'freelancer') {
      // Determine freelancer plan based on total seats
      const totalSeats = state.seats.full + state.seats.limited + state.seats.free
      const freelancerPlan = totalSeats > 3 ? 'Agency' : totalSeats > 1 ? 'Freelancer' : 'Starter'
      workspaceCost = calculateFreelancerWorkspaceCost(freelancerPlan, state.seats, 'Monthly')
    }
    
    return basePrice + addOnCosts + workspaceCost
  }

  const updatePlan = (planId: typeof state.selectedPlan) => {
    setState(prev => ({ ...prev, selectedPlan: planId }))
  }

  const updateFeature = (key: keyof typeof state.features, value: boolean) => {
    setState(prev => ({
      ...prev,
      features: { ...prev.features, [key]: value },
      // Reset languages to 1 when localization is disabled
      languages: key === 'localization' && !value ? 1 : prev.languages
    }))
  }

  const updateVisitors = (value: number) => {
    const recommendedPlan = getRecommendedPlan(value)
    setState(prev => ({ 
      ...prev, 
      monthlyVisitors: value,
      selectedPlan: recommendedPlan
    }))
  }

  const updateLanguages = (value: number) => {
    setState(prev => ({ ...prev, languages: value }))
  }

  const updateTeamSize = (value: number) => {
    setState(prev => ({ 
      ...prev, 
      teamSize: value,
      // Update full seats to match team size (defaulting new members to full seats)
      seats: {
        ...prev.seats,
        full: Math.max(1, value) // At least 1 full seat
      }
    }))
  }

  const updateSeat = (seatType: 'full' | 'limited' | 'free', value: number) => {
    setState(prev => ({
      ...prev,
      seats: { ...prev.seats, [seatType]: Math.max(0, value) },
      // Update team size to reflect total seats
      teamSize: Math.max(1, 
        (seatType === 'full' ? Math.max(0, value) : prev.seats.full) +
        (seatType === 'limited' ? Math.max(0, value) : prev.seats.limited) +
        (seatType === 'free' ? Math.max(0, value) : prev.seats.free)
      )
    }))
  }

  const updateWorkspaceType = (type: 'team' | 'freelancer') => {
    setState(prev => ({ ...prev, workspaceType: type }))
  }

  // Domain analysis functions
  const handleAnalyze = async () => {
    if (!url.trim()) return

    setIsAnalyzing(true)
    setDomainError(null)
    
    try {
      const response = await fetch('/api/analyze-domain', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ domain: url }),
      })

      if (!response.ok) {
        throw new Error('Failed to analyze domain')
      }

      const result = await response.json()
      setAnalysis(result)
      
      // Auto-populate calculator inputs based on analysis
      populateFromAnalysis(result)
    } catch (err) {
      setDomainError(err instanceof Error ? err.message : 'An error occurred while analyzing your domain')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const populateFromAnalysis = (analysis: DomainAnalysis) => {
    // Map website types to plans
    const getPlanFromWebsiteType = (type: string) => {
      switch (type) {
        case 'ecommerce':
        case 'saas':
          return 'business'
        case 'blog':
        case 'marketing':
          return 'cms'
        default:
          return 'starter'
      }
    }

    setState(prev => ({
      ...prev,
      selectedPlan: getPlanFromWebsiteType(analysis.websiteType),
      monthlyVisitors: analysis.estimatedVisitors,
      languages: analysis.suggestedAddOns.localization ? 2 : 1,
      features: {
        localization: analysis.suggestedAddOns.localization,
        analytics: analysis.suggestedAddOns.analyze,
        ab_personalization: analysis.suggestedAddOns.optimize,
      },
    }))
  }

  // Auto-select plan based on visitor thresholds (same logic as wizard)
  const getRecommendedPlan = (visitors: number): typeof state.selectedPlan => {
    if (visitors > 25000) return 'business'
    if (visitors > 10000) return 'cms'
    if (visitors > 5000) return 'starter'
    return 'starter'
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 pt-24">
      <Card className="w-full max-w-6xl mx-auto bg-white border border-gray-200 shadow-lg rounded-xl">
        <CardContent className="p-8">
          <div className="mb-8 text-center">
            <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">
              Calculate Your Price
            </h1>
            <p className="font-sans text-gray-600">
              Customize your plan and see pricing in real-time
            </p>
          </div>

          {/* Domain Analysis Section */}
          <Card className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-dashed border-blue-200">
            <CardContent className="p-6">
              <div className="text-center mb-4">
                <h2 className="font-display text-xl font-semibold text-gray-900 mb-2">
                  🚀 Auto-populate from your website
                </h2>
                <p className="text-gray-600">
                  Enter your website URL to automatically configure the calculator based on your current setup
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
                <Input
                  type="url"
                  placeholder="https://yourwebsite.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="flex-1"
                  disabled={isAnalyzing}
                />
                <Button
                  onClick={handleAnalyze}
                  disabled={!url.trim() || isAnalyzing}
                  className="bg-brand hover:bg-brand/90 text-white px-6"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    'Analyze & Fill'
                  )}
                </Button>
              </div>

              {/* Error State */}
              {domainError && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm text-center">{domainError}</p>
                </div>
              )}

              {/* Analysis Results */}
              {analysis && (
                <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-3 h-3 rounded-full ${
                      analysis.isOnWebflow ? 'bg-green-400' : 'bg-blue-400'
                    }`} />
                    <span className="font-semibold text-gray-900">
                      {analysis.isOnWebflow ? '✅ Already on Webflow!' : '🔍 Analysis Complete'}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                    <div>
                      <span className="text-gray-500">Type:</span>
                      <div className="font-medium capitalize">{analysis.websiteType}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Industry:</span>
                      <div className="font-medium">{analysis.industry}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Traffic:</span>
                      <div className="font-medium">{analysis.estimatedVisitors.toLocaleString()}/mo</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Confidence:</span>
                      <div className="font-medium">{analysis.confidence}%</div>
                    </div>
                  </div>

                  {/* Suggested Add-ons */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {Object.entries(analysis.suggestedAddOns).map(([key, enabled]) => {
                      if (!enabled) return null
                      const labels = {
                        optimize: 'A/B Testing',
                        analyze: 'Analytics',
                        localization: 'Multi-language'
                      }
                      return (
                        <Badge key={key} variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                          <Check className="w-3 h-3 mr-1" />
                          {labels[key as keyof typeof labels]}
                        </Badge>
                      )
                    })}
                  </div>

                  <div className="mt-4 text-center">
                    <span className="text-xs text-gray-500">
                      Calculator inputs have been automatically updated based on this analysis
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Plan Selection & Options */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Plan Selection */}
            <Card className="bg-white">
              <CardContent className="p-6">
                <div className="mb-6">
                  <h2 className="font-display text-xl font-semibold text-gray-900 mb-2">
                    Select a Webflow plan:
                  </h2>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {planOptions.map((plan) => (
                    <button
                      key={plan.id}
                      onClick={() => updatePlan(plan.id)}
                      className={`p-4 border rounded-lg text-left transition-all duration-200 ${
                        state.selectedPlan === plan.id
                          ? 'border-brand border-2 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-3 h-3 rounded-full ${
                          state.selectedPlan === plan.id ? 'bg-brand' : 'bg-gray-300'
                        }`} />
                        <span className="font-display font-semibold text-gray-900">
                          {plan.name}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        {plan.description}
                      </div>
                      <div className="text-xs text-gray-500 mb-3 leading-relaxed">
                        {plan.features}
                      </div>
                      <div className="font-semibold text-gray-900">
                        {plan.price === 0 ? 'Free' : `$${plan.price}/month`}
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Enterprise Plan */}
            <Card className="bg-gradient-to-r from-gray-900 to-blue-900 text-white">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                  <div>
                    <h3 className="font-display text-xl font-semibold mb-2">
                      {enterprisePlan.name}
                    </h3>
                    <p className="text-gray-300 mb-4">
                      {enterprisePlan.description}
                    </p>
                    <Button className="bg-brand hover:bg-brand/90 text-white">
                      Talk to us
                    </Button>
                  </div>
                  
                  <div className="lg:col-span-2">
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                      {enterprisePlan.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <div className="w-2 h-2 bg-brand rounded-full flex-shrink-0" />
                          <span className="text-gray-200">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Monthly Visitors */}
            <Card className="bg-white">
              <CardContent className="p-6">
                <h3 className="font-display text-lg font-semibold text-gray-900 mb-4">
                  Monthly Visitors
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Label className="font-sans text-sm font-medium text-gray-700 min-w-0">
                      Expected monthly visitors:
                    </Label>
                    <Input
                      type="number"
                      value={state.monthlyVisitors}
                      onChange={(e) => updateVisitors(parseInt(e.target.value) || 0)}
                      className="w-32"
                      min="0"
                    />
                  </div>
                  
                  <div className="pt-2">
                    <input
                      type="range"
                      value={state.monthlyVisitors}
                      onChange={(e) => updateVisitors(parseInt(e.target.value))}
                      max={100000}
                      min={1000}
                      step={1000}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>1k</span>
                      <span className="text-xs">5k (Starter)</span>
                      <span className="text-xs">10k (CMS)</span>
                      <span className="text-xs">25k (Business)</span>
                      <span>100k+</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    Your plan automatically adjusts based on visitor thresholds. Higher traffic requires more robust hosting and performance features.
                  </p>
                </div>
              </CardContent>
            </Card>



            {/* Workspace Type */}
            <Card className="bg-white">
              <CardContent className="p-6">
                <h3 className="font-display text-lg font-semibold text-gray-900 mb-4">
                  Workspace Type
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <button
                    onClick={() => updateWorkspaceType('team')}
                    className={`group p-4 rounded-lg border-2 transition-all duration-200 text-left hover:shadow-md ${
                      state.workspaceType === 'team'
                        ? 'bg-white border-brand shadow-md'
                        : 'bg-white border-gray-200 hover:border-blue-500 hover:bg-blue-500'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <Users className={`h-5 w-5 transition-colors ${
                        state.workspaceType === 'team' 
                          ? 'text-brand' 
                          : 'text-brand group-hover:text-white'
                      }`} />
                      <div className={`font-display font-semibold transition-colors ${
                        state.workspaceType === 'team'
                          ? 'text-gray-900'
                          : 'text-gray-900 group-hover:text-white'
                      }`}>Team Collaboration</div>
                    </div>
                    <p className={`text-sm transition-colors ${
                      state.workspaceType === 'team' ? 'text-gray-600' : 'text-gray-600 group-hover:text-white/90'
                    }`}>
                      Internal team projects, company websites, collaboration with colleagues
                    </p>
                  </button>

                  <button
                    onClick={() => updateWorkspaceType('freelancer')}
                    className={`group p-4 rounded-lg border-2 transition-all duration-200 text-left hover:shadow-md ${
                      state.workspaceType === 'freelancer'
                        ? 'bg-white border-brand shadow-md'
                        : 'bg-white border-gray-200 hover:border-blue-500 hover:bg-blue-500'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <Briefcase className={`h-5 w-5 transition-colors ${
                        state.workspaceType === 'freelancer' 
                          ? 'text-brand' 
                          : 'text-brand group-hover:text-white'
                      }`} />
                      <div className={`font-display font-semibold transition-colors ${
                        state.workspaceType === 'freelancer'
                          ? 'text-gray-900'
                          : 'text-gray-900 group-hover:text-white'
                      }`}>Client Work</div>
                    </div>
                    <p className={`text-sm transition-colors ${
                      state.workspaceType === 'freelancer' ? 'text-gray-600' : 'text-gray-600 group-hover:text-white/90'
                    }`}>
                      Freelance projects, agency work, client websites, multiple staging sites
                    </p>
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Seat Configuration */}
            <Card className="bg-white">
              <CardContent className="p-6">
                <h3 className="font-display text-lg font-semibold text-gray-900 mb-4">
                  Add seats
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                  Add unlimited team members to your workspace.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Full Seats */}
                  <div className="p-4 border-2 border-blue-500 rounded-lg bg-blue-50">
                    <div className="mb-3">
                      <Badge className="bg-blue-500 text-white text-xs font-medium mb-2">FULL</Badge>
                      <div className="text-2xl font-bold text-gray-900">
                        ${SEAT_PRICING.full}
                        <span className="text-sm font-normal text-gray-600">/mo</span>
                      </div>
                      <div className="text-xs text-gray-600 mb-3">per seat, billed yearly</div>
                    </div>
                    <p className="text-sm text-gray-700 mb-4">
                      Design full sites or manage admin settings.
                    </p>
                    <div className="flex items-center gap-2 mb-3">
                      <Label className="text-sm font-medium">Seats:</Label>
                      <Input
                        type="number"
                        value={state.seats.full}
                        onChange={(e) => updateSeat('full', parseInt(e.target.value) || 0)}
                        className="w-20 text-center"
                        min="0"
                      />
                    </div>
                  </div>

                  {/* Limited Seats */}
                  <div className="p-4 border-2 border-blue-500 rounded-lg bg-blue-50">
                    <div className="mb-3">
                      <Badge className="bg-blue-500 text-white text-xs font-medium mb-2">LIMITED</Badge>
                      <div className="text-2xl font-bold text-gray-900">
                        ${SEAT_PRICING.limited}
                        <span className="text-sm font-normal text-gray-600">/mo</span>
                      </div>
                      <div className="text-xs text-gray-600 mb-3">per seat, billed yearly</div>
                    </div>
                    <p className="text-sm text-gray-700 mb-4">
                      Edit content or build pages with components.
                    </p>
                    <div className="flex items-center gap-2 mb-3">
                      <Label className="text-sm font-medium">Seats:</Label>
                      <Input
                        type="number"
                        value={state.seats.limited}
                        onChange={(e) => updateSeat('limited', parseInt(e.target.value) || 0)}
                        className="w-20 text-center"
                        min="0"
                      />
                    </div>
                  </div>

                  {/* Free Seats */}
                  <div className="p-4 border-2 border-blue-500 rounded-lg bg-blue-50">
                    <div className="mb-3">
                      <Badge className="bg-blue-500 text-white text-xs font-medium mb-2">FREE</Badge>
                      <div className="text-2xl font-bold text-gray-900">
                        ${SEAT_PRICING.free}
                        <span className="text-sm font-normal text-gray-600">/mo</span>
                      </div>
                      <div className="text-xs text-gray-600 mb-3">per seat</div>
                    </div>
                    <p className="text-sm text-gray-700 mb-4">
                      Invite reviewers and commenters from the team page.
                    </p>
                    <div className="flex items-center gap-2 mb-3">
                      <Label className="text-sm font-medium">Seats:</Label>
                      <Input
                        type="number"
                        value={state.seats.free}
                        onChange={(e) => updateSeat('free', parseInt(e.target.value) || 0)}
                        className="w-20 text-center"
                        min="0"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    Total seats: {state.seats.full + state.seats.limited + state.seats.free} | 
                    Monthly cost: ${(state.seats.full * SEAT_PRICING.full) + (state.seats.limited * SEAT_PRICING.limited)} 
                    {state.workspaceType === 'freelancer' && (
                      <span className="ml-1">
                        (using {state.seats.full + state.seats.limited + state.seats.free > 3 ? 'Agency' : state.seats.full + state.seats.limited + state.seats.free > 1 ? 'Freelancer' : 'Starter'} plan)
                      </span>
                    )}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Add-ons */}
            <Card className="bg-white">
              <CardContent className="p-6">
                <h3 className="font-display text-lg font-semibold text-gray-900 mb-4">
                  Add-ons
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                  Customize and enhance your plan with additional features.
                </p>
                
                <div className="space-y-4">
                  {addOns.map((addOn) => {
                    const isLocalization = addOn.key === 'localization'
                    const localizationCost = isLocalization ? Math.max(0, state.languages - 1) * addOn.price : 0
                    const displayPrice = isLocalization && state.languages > 1 
                      ? `$${localizationCost}/month` 
                      : `$${addOn.price}/month`
                    
                    return (
                      <div key={addOn.key} className="flex items-start justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-display font-semibold text-gray-900">
                              {addOn.name}
                            </h4>
                            <Badge variant="outline" className="text-xs">
                              {isLocalization && state.languages === 1 ? 'Free with 1 language' : displayPrice}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">
                            {addOn.description}
                            {isLocalization && state.languages > 1 && (
                              <span className="block mt-1 text-brand font-medium">
                                ${state.languages - 1} additional language{state.languages > 2 ? 's' : ''} × $9/month
                              </span>
                            )}
                          </p>
                          
                          {/* Language selection - only show for localization when enabled */}
                          {isLocalization && state.features[addOn.key] && (
                            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                              <h5 className="font-display font-semibold text-blue-900 mb-3">
                                Language Configuration
                              </h5>
                              
                              <div className="space-y-3">
                                <div className="flex items-center gap-4">
                                  <Label className="font-sans text-sm font-medium text-blue-800 min-w-0">
                                    Total languages:
                                  </Label>
                                  <Input
                                    type="number"
                                    value={state.languages}
                                    onChange={(e) => updateLanguages(parseInt(e.target.value) || 1)}
                                    className="w-24 border-blue-300 focus:border-blue-500"
                                    min="1"
                                    max="20"
                                  />
                                </div>
                                
                                <div className="pt-2">
                                  <input
                                    type="range"
                                    value={state.languages}
                                    onChange={(e) => updateLanguages(parseInt(e.target.value))}
                                    max={10}
                                    min={1}
                                    step={1}
                                    className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                                  />
                                  <div className="flex justify-between text-xs text-blue-600 mt-1">
                                    <span>1 language</span>
                                    <span>10+ languages</span>
                                  </div>
                                </div>
                                
                                <div className="p-3 bg-blue-100 rounded-lg">
                                  <p className="text-xs text-blue-800">
                                    {state.languages === 1 
                                      ? "Your primary language is included at no extra cost."
                                      : `Additional ${state.languages - 1} language${state.languages > 2 ? 's' : ''} at $9/month each.`
                                    }
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                        <Switch
                          checked={state.features[addOn.key]}
                          onCheckedChange={(checked) => updateFeature(addOn.key, checked)}
                          className="ml-4"
                        />
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Pricing Summary */}
          <div className="lg:col-span-1">
            <Card className="bg-white sticky top-8">
              <CardContent className="p-6">
                                 <div className="text-center mb-6">
                   <div className="text-3xl font-bold text-gray-900 mb-1">
                     {calculateTotal() === 0 ? 'Free' : `$${calculateTotal()}`}
                     {calculateTotal() > 0 && <span className="text-lg font-normal text-gray-600">/mo</span>}
                   </div>
                   {calculateTotal() > 0 && (
                     <p className="text-sm text-gray-600">
                       billed at ${calculateTotal()}/mo • ${(calculateTotal() * 12 * 0.9).toFixed(0)}/yr with annual billing
                     </p>
                   )}
                 </div>

                <div className="space-y-3 mb-6">
                  <div className="font-display font-semibold text-gray-900">
                    {planOptions.find(p => p.id === state.selectedPlan)?.name}
                  </div>
                                     <div className="text-sm text-gray-600">
                     {planOptions.find(p => p.id === state.selectedPlan)?.price === 0 
                       ? 'Free plan' 
                       : `$${planOptions.find(p => p.id === state.selectedPlan)?.price} per month`
                     } | {state.monthlyVisitors.toLocaleString()} visitors
                   </div>
                </div>

                                 {Object.entries(state.features).some(([_, enabled]) => enabled) && (
                   <div className="border-t pt-4 mb-6">
                     <h4 className="font-display font-semibold text-gray-900 mb-3">Add-ons:</h4>
                     <div className="space-y-2">
                       {addOns.map((addOn) => {
                         if (state.features[addOn.key]) {
                           const isLocalization = addOn.key === 'localization'
                           const localizationCost = isLocalization ? Math.max(0, state.languages - 1) * addOn.price : 0
                           const displayCost = isLocalization && state.languages > 1 ? localizationCost : addOn.price
                           
                           return (
                             <div key={addOn.key} className="text-sm">
                               <div className="flex justify-between">
                                 <span className="text-gray-600">{addOn.name}</span>
                                 <span className="text-gray-900">
                                   {isLocalization && state.languages === 1 ? 'Free' : `$${displayCost}/mo`}
                                 </span>
                               </div>
                               {isLocalization && state.languages > 1 && (
                                 <div className="text-xs text-gray-500 mt-1">
                                   {state.languages - 1} additional language{state.languages > 2 ? 's' : ''} × $9/mo
                                 </div>
                               )}
                             </div>
                           )
                         }
                         return null
                       })}
                     </div>
                   </div>
                 )}

                 {/* Workspace Cost */}
                 {(state.seats.full + state.seats.limited + state.seats.free > 0) && (
                   <div className="border-t pt-4 mb-6">
                     <h4 className="font-display font-semibold text-gray-900 mb-3">Workspace:</h4>
                     <div className="text-sm space-y-2">
                       {/* Base Plan Cost */}
                       {state.workspaceType === 'team' && (
                         <div className="flex justify-between">
                           <span className="text-gray-600">Core Workspace Plan</span>
                           <span className="text-gray-900">${TEAM_WORKSPACE_PRICING.Core.monthly}/mo</span>
                         </div>
                       )}
                       {state.workspaceType === 'freelancer' && (
                         <div className="flex justify-between">
                           <span className="text-gray-600">
                             {state.seats.full + state.seats.limited + state.seats.free > 3 ? 'Agency' : 
                              state.seats.full + state.seats.limited + state.seats.free > 1 ? 'Freelancer' : 'Starter'} Plan
                           </span>
                           <span className="text-gray-900">
                             ${state.workspaceType === 'freelancer' ? (() => {
                               const totalSeats = state.seats.full + state.seats.limited + state.seats.free
                               const plan = totalSeats > 3 ? 'Agency' : totalSeats > 1 ? 'Freelancer' : 'Starter'
                               return FREELANCER_WORKSPACE_PRICING[plan].monthly
                             })() : 0}/mo
                           </span>
                         </div>
                       )}
                       
                       {/* Seat Costs */}
                       {state.seats.full > 0 && (
                         <div className="flex justify-between">
                           <span className="text-gray-600">{state.seats.full} Full seat{state.seats.full > 1 ? 's' : ''}</span>
                           <span className="text-gray-900">${state.seats.full * SEAT_PRICING.full}/mo</span>
                         </div>
                       )}
                       {state.seats.limited > 0 && (
                         <div className="flex justify-between">
                           <span className="text-gray-600">{state.seats.limited} Limited seat{state.seats.limited > 1 ? 's' : ''}</span>
                           <span className="text-gray-900">${state.seats.limited * SEAT_PRICING.limited}/mo</span>
                         </div>
                       )}
                       {state.seats.free > 0 && (
                         <div className="flex justify-between">
                           <span className="text-gray-600">{state.seats.free} Free seat{state.seats.free > 1 ? 's' : ''}</span>
                           <span className="text-gray-900">$0/mo</span>
                         </div>
                       )}
                     </div>
                   </div>
                 )}

                <Button className="w-full bg-brand hover:bg-brand/90 text-white py-3">
                  Get Started
                </Button>
              </CardContent>
            </Card>
          </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 