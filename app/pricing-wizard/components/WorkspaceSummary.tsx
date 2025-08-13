'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, Crown, CheckCircle } from 'lucide-react'
import { TeamWorkspacePlan, FreelancerWorkspacePlan, WorkspaceBillingCycle } from '@/lib/workspaceData'

interface WorkspaceSummaryProps {
  plan: TeamWorkspacePlan | FreelancerWorkspacePlan
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
  // Simplified stub component - needs full implementation for new workspace structure
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{plan} Workspace</span>
          <Badge variant="secondary">{seats} seats</Badge>
        </CardTitle>
        <CardDescription>
          Workspace summary for {billingCycle.toLowerCase()} billing
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600">
          This component needs to be updated for the new workspace structure.
        </p>
      </CardContent>
    </Card>
  )
}
