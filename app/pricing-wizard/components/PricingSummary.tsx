'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PricingResult } from '@/lib/pricing'

interface PricingSummaryProps {
  results: PricingResult
  billingCycle: string
}

export default function PricingSummary({ results, billingCycle }: PricingSummaryProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Pricing Summary</CardTitle>
        <CardDescription>
          Cost breakdown based on your configuration.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Main Totals */}
          <div className="text-center p-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg">
            <div className="text-3xl font-bold">
              ${results.monthlyTotal.toFixed(2)}/month
            </div>
            <div className="text-lg opacity-90">
              ${results.yearlyTotal.toFixed(2)}/year
            </div>
            {results.savings > 0 && (
              <div className="text-sm mt-2 bg-white/20 rounded px-3 py-1 inline-block">
                Save ${results.savings.toFixed(2)}/year with yearly billing
              </div>
            )}
          </div>

          {/* Cost Breakdown */}
          <div className="space-y-3">
            <h4 className="font-display font-medium text-lg">Cost Breakdown</h4>
            
            {/* Base Plan */}
            <div className="flex justify-between items-center py-2 border-b">
              <span>Base Plan</span>
              <span className="font-medium">${results.basePlanCost.toFixed(2)}</span>
            </div>

            {/* Overages */}
            {(results.overageCosts.bandwidth > 0 || results.overageCosts.requests > 0 || results.overageCosts.cpu > 0) && (
              <>
                <div className="text-sm font-medium text-orange-600 mt-4">Overage Charges</div>
                {results.overageCosts.bandwidth > 0 && (
                  <div className="flex justify-between items-center py-1 text-sm">
                    <span className="text-orange-600">Bandwidth Overage</span>
                    <span>${results.overageCosts.bandwidth.toFixed(2)}</span>
                  </div>
                )}
                {results.overageCosts.requests > 0 && (
                  <div className="flex justify-between items-center py-1 text-sm">
                    <span className="text-orange-600">Requests Overage</span>
                    <span>${results.overageCosts.requests.toFixed(2)}</span>
                  </div>
                )}
                {results.overageCosts.cpu > 0 && (
                  <div className="flex justify-between items-center py-1 text-sm">
                    <span className="text-orange-600">CPU Overage</span>
                    <span>${results.overageCosts.cpu.toFixed(2)}</span>
                  </div>
                )}
              </>
            )}

            {/* Add-ons */}
            {(results.addOnCosts.optimize > 0 || results.addOnCosts.analyze > 0 || results.addOnCosts.localization > 0) && (
              <>
                <div className="text-sm font-medium text-blue-600 mt-4">Add-ons</div>
                {results.addOnCosts.optimize > 0 && (
                  <div className="flex justify-between items-center py-1 text-sm">
                    <span className="text-blue-600">Optimize</span>
                    <span>${results.addOnCosts.optimize.toFixed(2)}</span>
                  </div>
                )}
                {results.addOnCosts.analyze > 0 && (
                  <div className="flex justify-between items-center py-1 text-sm">
                    <span className="text-blue-600">Analyze</span>
                    <span>${results.addOnCosts.analyze.toFixed(2)}</span>
                  </div>
                )}
                {results.addOnCosts.localization > 0 && (
                  <div className="flex justify-between items-center py-1 text-sm">
                    <span className="text-blue-600">Localization</span>
                    <span>${results.addOnCosts.localization.toFixed(2)}</span>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Billing Comparison */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-display font-medium mb-3">Billing Comparison</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-gray-600">Monthly Billing</div>
                <div className="font-medium">${(results.monthlyTotal * 12).toFixed(2)}/year</div>
              </div>
              <div>
                <div className="text-gray-600">Yearly Billing</div>
                <div className="font-medium text-green-600">
                  ${results.yearlyTotal.toFixed(2)}/year
                  {results.savings > 0 && (
                    <div className="text-xs">Save ${results.savings.toFixed(2)}</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
