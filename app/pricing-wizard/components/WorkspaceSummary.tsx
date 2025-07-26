'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, Crown, CheckCircle } from 'lucide-react'
import { WorkspacePlan, WorkspaceBillingCycle, WORKSPACE_PRICING } from '@/lib/workspaceData'
import { calculateWorkspaceCost } from '@/lib/recommendWorkspace'

interface WorkspaceSummaryProps {
  plan: WorkspacePlan
  seats: number
  billingCycle: WorkspaceBillingCycle
  showFeatures?: boolean
}

export default function WorkspaceSummary({ 
  plan, 
  seats, 
  billingCycle, 
  showFeatures = true 
}: WorkspaceSummaryProps) {
  const planData = WORKSPACE_PRICING[plan]
  const monthlyCost = calculateWorkspaceCost(plan, seats, billingCycle)
  const yearlyCost = monthlyCost * 12
  const yearlyDiscount = billingCycle === 'Yearly' && plan !== 'Free' && plan !== 'Enterprise'

  const getPlanColor = (plan: WorkspacePlan) => {
    switch (plan) {
      case 'Free': return 'bg-gray-100 text-gray-800'
      case 'Core': return 'bg-blue-100 text-blue-800'
      case 'Growth': return 'bg-green-100 text-green-800'
      case 'Enterprise': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Users className="h-5 w-5 text-blue-600" />
            <CardTitle>Workspace Plan</CardTitle>
          </div>
          <Badge className={getPlanColor(plan)}>
            {plan}
          </Badge>
        </div>
        <CardDescription>
          Collaboration and team management features
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Pricing Summary */}
          <div className="text-center p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg">
            {plan === 'Free' ? (
              <div className="text-2xl font-bold">Free</div>
            ) : plan === 'Enterprise' ? (
              <div>
                <div className="text-2xl font-bold">Custom Pricing</div>
                <div className="text-sm opacity-90 mt-1">Contact sales for quote</div>
              </div>
            ) : (
              <div>
                <div className="text-2xl font-bold">
                  ${monthlyCost.toFixed(2)}/month
                </div>
                <div className="text-sm opacity-90">
                  ${planData.monthly}/seat × {seats} seat{seats !== 1 ? 's' : ''}
                </div>
                {yearlyDiscount && (
                  <div className="text-sm mt-1 bg-white/20 rounded px-2 py-1 inline-block">
                    Save 15% with yearly billing
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Plan Details */}
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b">
              <span>Plan</span>
              <span className="font-medium">{plan}</span>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b">
              <span>Seats</span>
              <span className="font-medium">{seats}</span>
            </div>
            
            {plan !== 'Free' && (
              <div className="flex justify-between items-center py-2 border-b">
                <span>Guest Limit</span>
                <span className="font-medium">
                  {planData.guests === -1 ? 'Unlimited' : planData.guests}
                </span>
              </div>
            )}
            
            <div className="flex justify-between items-center py-2 border-b">
              <span>Billing Cycle</span>
              <span className="font-medium">{billingCycle}</span>
            </div>
          </div>

          {/* Features */}
          {showFeatures && (
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">What's included:</h4>
              <div className="space-y-2">
                {planData.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
              
              {plan === 'Enterprise' && (
                <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Crown className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-medium text-purple-800">Enterprise Benefits</span>
                  </div>
                  <p className="text-xs text-purple-700">
                    Custom features, dedicated support, and pricing tailored to your organization's needs.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Billing Comparison */}
          {plan !== 'Free' && plan !== 'Enterprise' && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-3">Billing Comparison</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-600">Monthly Billing</div>
                  <div className="font-medium">${(planData.monthly * seats * 12).toFixed(2)}/year</div>
                </div>
                <div>
                  <div className="text-gray-600">Yearly Billing</div>
                  <div className="font-medium text-green-600">
                    ${(planData.yearly * seats).toFixed(2)}/year
                    <div className="text-xs">Save ${((planData.monthly * seats * 12) - (planData.yearly * seats)).toFixed(2)}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
