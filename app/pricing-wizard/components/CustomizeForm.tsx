'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { UsageInputs, WebflowPlan, BillingCycle, PLAN_PRICING, ADD_ON_PRICING } from '@/lib/pricing'

interface CustomizeFormProps {
  inputs: UsageInputs
  onUpdate: (updates: Partial<UsageInputs>) => void
}

export default function CustomizeForm({ inputs, onUpdate }: CustomizeFormProps) {
  const updateInput = (key: keyof UsageInputs, value: any) => {
    onUpdate({ [key]: value })
  }

  const updateAddOn = (key: keyof UsageInputs['addOns'], value: any) => {
    onUpdate({
      addOns: {
        ...inputs.addOns,
        [key]: value,
      },
    })
  }

  const planLimits = PLAN_PRICING[inputs.plan].limits

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Customize Your Configuration</CardTitle>
        <CardDescription>
          Adjust the recommended settings to match your specific needs.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Plan Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="plan">Plan</Label>
            <Select value={inputs.plan} onValueChange={(value: WebflowPlan) => updateInput('plan', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Starter">Starter - $14/month</SelectItem>
                <SelectItem value="Basic">Basic - $23/month</SelectItem>
                <SelectItem value="CMS">CMS - $29/month</SelectItem>
                <SelectItem value="Business">Business - $39/month</SelectItem>
                <SelectItem value="Enterprise">Enterprise - $235/month</SelectItem>
              </SelectContent>
            </Select>
            <div className="text-xs text-gray-500">
              Includes: {planLimits.bandwidth}GB bandwidth, {planLimits.requests}M requests, {planLimits.cpu}h CPU
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="billing">Billing Cycle</Label>
            <Select value={inputs.billingCycle} onValueChange={(value: BillingCycle) => updateInput('billingCycle', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select billing cycle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Monthly">Monthly</SelectItem>
                <SelectItem value="Yearly">Yearly (15% discount)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Usage Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="bandwidth">Bandwidth (GB/month)</Label>
            <Input
              id="bandwidth"
              type="number"
              value={inputs.bandwidth}
              onChange={(e) => updateInput('bandwidth', parseFloat(e.target.value) || 0)}
              min="0"
              step="1"
            />
            {inputs.bandwidth > planLimits.bandwidth && (
              <div className="text-xs text-orange-600">
                +{(inputs.bandwidth - planLimits.bandwidth).toFixed(1)}GB overage
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="requests">Requests (millions/month)</Label>
            <Input
              id="requests"
              type="number"
              value={inputs.requests}
              onChange={(e) => updateInput('requests', parseFloat(e.target.value) || 0)}
              min="0"
              step="0.1"
            />
            {inputs.requests > planLimits.requests && (
              <div className="text-xs text-orange-600">
                +{(inputs.requests - planLimits.requests).toFixed(1)}M overage
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="cpu">CPU (hours/month)</Label>
            <Input
              id="cpu"
              type="number"
              value={inputs.cpu}
              onChange={(e) => updateInput('cpu', parseFloat(e.target.value) || 0)}
              min="0"
              step="1"
            />
            {inputs.cpu > planLimits.cpu && (
              <div className="text-xs text-orange-600">
                +{(inputs.cpu - planLimits.cpu).toFixed(1)}h overage
              </div>
            )}
          </div>
        </div>

        {/* Add-ons */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Add-ons</h3>
          
          {/* Optimize */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-1">
              <div className="font-medium">Optimize</div>
              <div className="text-sm text-gray-500">
                ${ADD_ON_PRICING.optimize.monthly}/month (25% yearly discount)
              </div>
            </div>
            <Switch
              checked={inputs.addOns.optimize}
              onCheckedChange={(checked) => updateAddOn('optimize', checked)}
            />
          </div>

          {/* Analyze */}
          <div className="space-y-3 p-4 border rounded-lg">
            <div className="font-medium">Analyze</div>
            <div className="space-y-2">
              <Label htmlFor="analyze-sessions">Sessions (thousands/month)</Label>
              <Select 
                value={inputs.addOns.analyzeSessions.toString()} 
                onValueChange={(value) => updateAddOn('analyzeSessions', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select sessions tier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">None</SelectItem>
                  <SelectItem value="10000">10k sessions - $29/month</SelectItem>
                  <SelectItem value="25000">25k sessions - $49/month</SelectItem>
                  <SelectItem value="50000">50k sessions - $79/month</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Localization */}
          <div className="space-y-3 p-4 border rounded-lg">
            <div className="font-medium">Localization</div>
            <div className="space-y-2">
              <Label htmlFor="locales">Number of Locales</Label>
              <Input
                id="locales"
                type="number"
                value={inputs.addOns.localizationLocales}
                onChange={(e) => updateAddOn('localizationLocales', parseInt(e.target.value) || 0)}
                min="0"
                step="1"
              />
              <div className="text-xs text-gray-500">
                $9 per locale per month
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
