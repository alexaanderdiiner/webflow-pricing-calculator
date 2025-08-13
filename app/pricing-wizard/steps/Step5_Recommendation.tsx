import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Star, Users, Info } from 'lucide-react'
import { PlanRecommendation } from '@/lib/recommendPlan'
import { PLAN_PRICING } from '@/lib/pricing'
import { recommendWorkspacePlan, determineWorkspaceType } from '@/lib/recommendWorkspace'
import { WorkspaceAnswers, TEAM_WORKSPACE_PRICING, FREELANCER_WORKSPACE_PRICING, SEAT_PRICING, TeamWorkspacePlan, FreelancerWorkspacePlan } from '@/lib/workspaceData'

interface Step5Props {
  recommendation: PlanRecommendation
  workspaceAnswers: WorkspaceAnswers
  wizardAnswers: any
  onWorkspaceUpdate: (key: string, value: any) => void
}

export default function Step5Recommendation({ 
  recommendation, 
  workspaceAnswers, 
  wizardAnswers,
  onWorkspaceUpdate 
}: Step5Props) {
  const planData = PLAN_PRICING[recommendation.plan]
  const workspaceRecommendation = recommendWorkspacePlan(workspaceAnswers)
  
  // Calculate total pricing
  const sitePlanCost = planData.monthly
  const workspaceType = determineWorkspaceType(workspaceAnswers)
  
  // Calculate workspace cost based on type using seat-based pricing
  let workspaceCost = 0
  if (workspaceType === 'team') {
    const teamRec = workspaceRecommendation as any // TeamWorkspaceRecommendation
    if (teamRec.plan !== 'Starter' && teamRec.plan !== 'Enterprise') {
      const basePlanCost = TEAM_WORKSPACE_PRICING[teamRec.plan as keyof typeof TEAM_WORKSPACE_PRICING].monthly
      const seatCosts = (teamRec.seats?.full || 1) * SEAT_PRICING.full + 
                       (teamRec.seats?.limited || 0) * SEAT_PRICING.limited + 
                       (teamRec.seats?.free || 0) * SEAT_PRICING.free
      workspaceCost = basePlanCost + seatCosts
    }
  } else {
    const freelancerRec = workspaceRecommendation as any // FreelancerWorkspaceRecommendation
    const seats = {
      full: workspaceAnswers.fullSeats || 1,
      limited: workspaceAnswers.limitedSeats || 0,
      free: workspaceAnswers.freeSeats || 0
    }
    const basePlanCost = FREELANCER_WORKSPACE_PRICING[freelancerRec.plan as keyof typeof FREELANCER_WORKSPACE_PRICING].monthly
    const seatCosts = seats.full * SEAT_PRICING.full + seats.limited * SEAT_PRICING.limited + seats.free * SEAT_PRICING.free
    workspaceCost = basePlanCost + seatCosts
  }
  
  // Add-on costs
  const localizationCost = wizardAnswers.features?.localization ? 
                          Math.max(0, (wizardAnswers.languages || 1) - 1) * 9 : 0
  const analyticsCost = wizardAnswers.features?.analytics ? 29 : 0
  const abTestingCost = wizardAnswers.features?.abTesting ? 49 : 0
  
  const totalMonthly = sitePlanCost + workspaceCost + localizationCost + analyticsCost + abTestingCost

  // Key features based on selections
  const keyFeatures = [
    `${recommendation.plan} Site Plan`,
    `${planData.limits?.bandwidth || 'Unlimited'} bandwidth`,
    `${planData.limits?.requests || 'Unlimited'} requests/month`,
    workspaceAnswers.teamSize > 1 ? `${workspaceRecommendation.plan} Workspace (${workspaceAnswers.teamSize} seats)` : 'Free Workspace',
    ...(wizardAnswers.features.analytics ? ['Built-in Analytics'] : []),
    ...(wizardAnswers.features.localization ? ['Multi-language Support'] : []),
    ...(wizardAnswers.features.abTesting ? ['A/B Testing & Personalization'] : [])
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <h2 className="font-display text-3xl font-bold text-gray-900">
          Your Perfect Webflow Setup
        </h2>
        <p className="font-sans text-base text-gray-600 max-w-2xl mx-auto">
          Here's everything you need to get started, including workspace setup for your team.
        </p>
      </div>

      {/* Final Pricing Display */}
      <div className="text-center space-y-4">
        <div className="inline-block">
          <div className="bg-brand text-white px-3 py-1 rounded-lg text-xs font-medium mb-3">
            RECOMMENDED
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="font-display text-5xl font-bold text-gray-900">
            ${totalMonthly}
            <span className="text-xl font-normal text-gray-600">/mo</span>
          </div>
          <div className="font-sans text-base text-gray-600">
            billed monthly • ${(totalMonthly * 12 * 0.85).toFixed(0)}/year with annual billing
          </div>
        </div>

        {/* Selected Plans */}
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          <Badge variant="secondary" className="px-3 py-1 text-sm font-medium">
            {recommendation.plan} Site Plan
          </Badge>
          {workspaceAnswers.teamSize > 1 && (
            <Badge variant="secondary" className="px-3 py-1 text-sm font-medium">
              {workspaceRecommendation.plan} Workspace
            </Badge>
          )}
        </div>

        <p className="font-sans text-lg text-gray-700 max-w-2xl mx-auto">
          For {wizardAnswers.siteType === 'marketing' ? 'marketing websites' : 
              wizardAnswers.siteType === 'blog' ? 'blogs and content sites' :
              wizardAnswers.siteType === 'portfolio' ? 'portfolios and creative work' : 
              'custom projects'} with {workspaceAnswers.teamSize > 1 ? 'team collaboration' : 'individual use'}.
        </p>
      </div>

      {/* Team Size Selection */}
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="font-display text-lg font-semibold text-gray-900 mb-2">Team Size</h3>
          <p className="font-sans text-sm text-gray-600">
            Choose your team size to see workspace pricing
          </p>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-3xl mx-auto">
          {[1, 2, 5, 10].map((size) => {
            const isSelected = workspaceAnswers.teamSize === size
            const workspacePlan = size === 1 ? 'Free' : size <= 3 ? 'Core' : 'Growth'
            const workspaceCostForSize = size === 1 ? 0 : workspacePlan === 'Core' ? 19 * size : 49 * size
            
            return (
              <Card
                key={size}
                className={`cursor-pointer transition-all duration-200 ${
                  isSelected 
                    ? 'bg-brand border-brand text-white shadow-lg' 
                    : 'bg-white border-gray-200 text-gray-900 hover:border-gray-300 hover:shadow-md'
                }`}
                onClick={() => onWorkspaceUpdate('teamSize', size)}
              >
                <CardContent className="p-4 text-center">
                  <div className={`text-xs font-medium mb-2 ${isSelected ? 'text-white/90' : 'text-gray-800'}`}>
                    {workspaceCostForSize === 0 ? 'Free' : `+$${workspaceCostForSize}/mo`}
                  </div>
                  <div className={`text-2xl font-bold ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                    {size}
                  </div>
                  <div className={`text-xs ${isSelected ? 'text-white/90' : 'text-gray-600'}`}>
                    {size === 1 ? 'Just me' : `${size} people`}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
        
        {workspaceAnswers.teamSize > 10 && (
          <div className="text-center">
            <Input
              type="number"
              value={workspaceAnswers.teamSize}
              onChange={(e) => onWorkspaceUpdate('teamSize', parseInt(e.target.value) || 1)}
              min="11"
              className="w-32 mx-auto text-center"
              placeholder="Team size"
            />
            <Button
              onClick={() => onWorkspaceUpdate('teamSize', 10)}
              variant="ghost"
              size="sm"
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              Need more than 10? Click here
            </Button>
          </div>
        )}
      </div>

      {/* Pricing Breakdown */}
      <Card className="bg-gray-50 border-gray-200">
        <CardContent className="p-6">
          <h3 className="font-display text-lg font-semibold text-gray-900 text-center mb-4">
            Pricing Breakdown
          </h3>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-sans text-gray-700">{recommendation.plan} Site Plan</span>
              <span className="font-medium text-gray-900">${sitePlanCost}/mo</span>
            </div>
            
            {workspaceAnswers.teamSize > 1 && (
              <div className="flex justify-between items-center">
                <span className="font-sans text-gray-700">
                  {workspaceRecommendation.plan} Workspace ({workspaceAnswers.teamSize} seats)
                </span>
                <span className="font-medium text-gray-900">${workspaceCost}/mo</span>
              </div>
            )}
            
            {/* Add-ons if any */}
            {wizardAnswers.features?.localization && localizationCost > 0 && (
              <div className="flex justify-between items-center">
                <span className="font-sans text-gray-700">
                  Multi-language Support ({wizardAnswers.languages || 1} languages)
                </span>
                <span className="font-medium text-gray-900">
                  ${localizationCost}/mo
                </span>
              </div>
            )}
            
            {wizardAnswers.features?.analytics && (
              <div className="flex justify-between items-center">
                <span className="font-sans text-gray-700">Analytics</span>
                <span className="font-medium text-gray-900">${analyticsCost}/mo</span>
              </div>
            )}
            
            {wizardAnswers.features?.abTesting && (
              <div className="flex justify-between items-center">
                <span className="font-sans text-gray-700">A/B Testing</span>
                <span className="font-medium text-gray-900">${abTestingCost}/mo</span>
              </div>
            )}
            
            <div className="border-t pt-3 mt-3">
              <div className="flex justify-between items-center text-lg font-semibold">
                <span className="font-display text-gray-900">Total</span>
                <span className="font-display text-gray-900">${totalMonthly}/mo</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Features List */}
      <div className="space-y-4">
        <h3 className="font-display text-lg font-semibold text-gray-900 text-center">
          What's included:
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {keyFeatures.map((feature, index) => (
            <div key={index} className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
              <span className="font-sans text-gray-700">{feature}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div className="flex items-center gap-3">
            <Info className="h-5 w-5 text-blue-500 flex-shrink-0" />
            <span className="font-sans text-gray-700">Free 14-day trial included</span>
          </div>
          
          <div className="flex items-center gap-3">
            <Info className="h-5 w-5 text-blue-500 flex-shrink-0" />
            <span className="font-sans text-gray-700">Cancel anytime</span>
          </div>
        </div>
      </div>

      {/* Why This Plan Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <Star className="h-6 w-6 text-brand mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-display font-semibold text-blue-900 mb-2">Why this plan?</div>
              <div className="font-sans text-sm text-blue-800">
                {recommendation.rationale}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CTA Button */}
      <div className="text-center pt-4">
        <Button 
          onClick={() => window.open('https://webflow.com/pricing', '_blank')}
          className="w-full max-w-md bg-brand hover:bg-brand/90 text-white text-lg py-6 rounded-xl font-medium transition-all duration-200"
        >
          Get Started with Webflow
        </Button>
        
        <p className="font-sans text-sm text-gray-500 mt-3">
          Start your free trial • No credit card required
        </p>
      </div>
    </div>
  )
}
