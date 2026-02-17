'use client'

import React, { useState } from 'react'
import { Card, CardContent } from '../../../components/ui/card'
import { Label } from '../../../components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select'
import { Input } from '../../../components/ui/input'
import { Users, ChevronDown, ChevronUp } from 'lucide-react'
import {
  WorkspaceType,
  TeamWorkspacePlan,
  FreelancerWorkspacePlan,
  TEAM_WORKSPACE_PRICING,
  FREELANCER_WORKSPACE_PRICING,
  SEAT_PRICING
} from '../../../lib/workspaceData'
import { calculateWorkspaceCost } from '../../../lib/recommendWorkspace'

interface WorkspacePricingCardProps {
  workspaceType: WorkspaceType
  workspacePlan: TeamWorkspacePlan | FreelancerWorkspacePlan
  seats: {
    full: number
    limited: number
    free: number
  }
  billingCycle: 'Monthly' | 'Yearly'
  onWorkspaceTypeChange: (type: WorkspaceType) => void
  onWorkspacePlanChange: (plan: TeamWorkspacePlan | FreelancerWorkspacePlan) => void
  onSeatsChange: (seats: { full: number; limited: number; free: number }) => void
}

export default function WorkspacePricingCard({
  workspaceType,
  workspacePlan,
  seats,
  billingCycle,
  onWorkspaceTypeChange,
  onWorkspacePlanChange,
  onSeatsChange
}: WorkspacePricingCardProps) {
  const [expanded, setExpanded] = useState(false)

  const formatMoney = (value: number) => Math.round(value).toLocaleString()

  const workspaceCost = calculateWorkspaceCost(
    workspaceType,
    workspacePlan,
    seats,
    billingCycle
  )

  const getAvailablePlans = () => {
    if (workspaceType === 'team') {
      return Object.keys(TEAM_WORKSPACE_PRICING) as TeamWorkspacePlan[]
    } else {
      return Object.keys(FREELANCER_WORKSPACE_PRICING) as FreelancerWorkspacePlan[]
    }
  }

  const getPlanDescription = () => {
    if (workspaceType === 'team') {
      const planData = TEAM_WORKSPACE_PRICING[workspacePlan as TeamWorkspacePlan]
      return `${planData.features.length} features included`
    } else {
      const planData = FREELANCER_WORKSPACE_PRICING[workspacePlan as FreelancerWorkspacePlan]
      return `${planData.features.length} features included`
    }
  }

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Workspace Plan</h3>
                <p className="text-xs text-gray-600">Collaboration & team management</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">
                ${formatMoney(workspaceCost)}<span className="text-sm font-normal text-gray-500">/mo</span>
              </div>
            </div>
          </div>

          {/* Quick Summary */}
          <div className="p-3 bg-white rounded-lg border border-gray-200">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-700">
                {workspaceType === 'team' ? 'Team' : 'Freelancer/Agency'} Workspace - {workspacePlan}
              </span>
              <button
                onClick={() => setExpanded(!expanded)}
                className="text-[#4353FF] hover:text-[#3142E6] font-medium inline-flex items-center transition-colors"
                aria-expanded={expanded}
                aria-controls="workspace-config-panel"
              >
                {expanded ? (
                  <>
                    Collapse <ChevronUp className="w-4 h-4 ml-1" aria-hidden="true" />
                  </>
                ) : (
                  <>
                    Customize <ChevronDown className="w-4 h-4 ml-1" aria-hidden="true" />
                  </>
                )}
              </button>
            </div>
            {!expanded && (
              <p className="text-xs text-gray-500 mt-1">
                {seats.full} full seat{seats.full !== 1 ? 's' : ''}{seats.limited > 0 && `, ${seats.limited} limited`}{seats.free > 0 && `, ${seats.free} free`}
              </p>
            )}
          </div>

          {/* Expanded Configuration */}
          {expanded && (
            <div id="workspace-config-panel" className="space-y-4 pt-2">
              {/* Workspace Type Selection */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-900">Workspace Type</Label>
                <Select
                  value={workspaceType}
                  onValueChange={(value: WorkspaceType) => onWorkspaceTypeChange(value)}
                >
                  <SelectTrigger className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="team">Team - Internal collaboration</SelectItem>
                    <SelectItem value="freelancer">Freelancer/Agency - Client work</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Plan Selection */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-900">Plan</Label>
                <Select
                  value={workspacePlan}
                  onValueChange={onWorkspacePlanChange}
                >
                  <SelectTrigger className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailablePlans().map(plan => {
                      const pricing = workspaceType === 'team'
                        ? TEAM_WORKSPACE_PRICING[plan as TeamWorkspacePlan]
                        : FREELANCER_WORKSPACE_PRICING[plan as FreelancerWorkspacePlan]

                      return (
                        <SelectItem key={plan} value={plan}>
                          {plan} - {pricing.monthly === 0 ? 'Free' : `$${pricing.monthly}/mo`}
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-600">{getPlanDescription()}</p>
              </div>

              {/* Seat Configuration */}
              <div className="space-y-3 p-4 bg-white rounded-lg border border-gray-200">
                <Label className="text-sm font-medium text-gray-900">Seat Configuration</Label>

                {/* Full Seats */}
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">Full Seats</div>
                    <div className="text-xs text-gray-600">${SEAT_PRICING.full}/mo each - Design & admin access</div>
                  </div>
                  <Input
                    type="number"
                    min="1"
                    max="50"
                    value={seats.full}
                    onChange={(e) => onSeatsChange({ ...seats, full: parseInt(e.target.value) || 1 })}
                    className="w-20 h-9"
                  />
                </div>

                {/* Limited Seats */}
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">Limited Seats</div>
                    <div className="text-xs text-gray-600">${SEAT_PRICING.limited}/mo each - Content editing only</div>
                  </div>
                  <Input
                    type="number"
                    min="0"
                    max="50"
                    value={seats.limited}
                    onChange={(e) => onSeatsChange({ ...seats, limited: parseInt(e.target.value) || 0 })}
                    className="w-20 h-9"
                  />
                </div>

                {/* Free Seats */}
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">Free Seats</div>
                    <div className="text-xs text-gray-600">$0/mo - Reviewers & commenters</div>
                  </div>
                  <Input
                    type="number"
                    min="0"
                    max="50"
                    value={seats.free}
                    onChange={(e) => onSeatsChange({ ...seats, free: parseInt(e.target.value) || 0 })}
                    className="w-20 h-9"
                  />
                </div>

                {/* Seat Cost Breakdown */}
                <div className="pt-3 border-t border-gray-200 space-y-1">
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span>Base plan:</span>
                    <span>${workspaceType === 'team' ? TEAM_WORKSPACE_PRICING[workspacePlan as TeamWorkspacePlan].monthly : FREELANCER_WORKSPACE_PRICING[workspacePlan as FreelancerWorkspacePlan].monthly}/mo</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span>Seat costs:</span>
                    <span>${formatMoney((seats.full * SEAT_PRICING.full) + (seats.limited * SEAT_PRICING.limited))}/mo</span>
                  </div>
                  <div className="flex items-center justify-between text-sm font-semibold text-gray-900 pt-1">
                    <span>Total:</span>
                    <span>${formatMoney(workspaceCost)}/mo</span>
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
