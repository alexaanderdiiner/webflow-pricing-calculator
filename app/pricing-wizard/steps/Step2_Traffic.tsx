import React from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface Step2Props {
  monthlyVisitors: number
  onUpdate: (visitors: number) => void
}

const trafficPresets = [
  { label: 'Just starting (0-1k)', value: 500 },
  { label: 'Small site (1k-5k)', value: 2500 },
  { label: 'Growing site (5k-25k)', value: 12500 },
  { label: 'Popular site (25k-100k)', value: 50000 },
  { label: 'High traffic (100k+)', value: 200000 },
]

export default function Step2Traffic({ monthlyVisitors, onUpdate }: Step2Props) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <h2 className="font-display text-2xl font-semibold text-gray-900">
          How much traffic do you expect?
        </h2>
        <p className="font-sans text-base text-gray-600">
          This helps us recommend the right bandwidth and performance tier for your site.
        </p>
      </div>

      {/* Input Section */}
      <div className="space-y-6">
        <div className="space-y-3">
          <Label htmlFor="visitors" className="font-display text-lg font-medium text-gray-900">
            Expected monthly visitors
          </Label>
          <Input
            id="visitors"
            type="number"
            value={monthlyVisitors || ''}
            onChange={(e) => onUpdate(parseInt(e.target.value) || 0)}
            min="0"
            step="100"
            className="text-lg py-4 border-gray-300 focus:border-brand focus:ring-brand"
            placeholder="Enter number of monthly visitors"
          />
        </div>

        {/* Quick Presets */}
        <div className="space-y-4">
          <Label className="font-display text-lg font-medium text-gray-900">Quick estimates:</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {trafficPresets.map((preset) => (
              <Button
                key={preset.value}
                variant="outline"
                onClick={() => onUpdate(preset.value)}
                className={`h-auto p-4 justify-start text-left hover:bg-brand hover:text-white hover:border-brand transition-all duration-200 ${
                  monthlyVisitors === preset.value 
                    ? 'bg-white border-brand border-2 text-gray-900' 
                    : 'bg-white border-gray-200 text-gray-900'
                }`}
              >
                <div>
                  <div className="font-medium">{preset.label}</div>
                  <div className="text-sm opacity-75">{preset.value.toLocaleString()} visitors</div>
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* Traffic Estimate Card */}
        {monthlyVisitors > 0 && (
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <h4 className="font-display text-lg font-semibold text-blue-900 mb-4">Traffic estimate:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div className="text-blue-800">
                  <div className="font-medium">Daily visitors</div>
                  <div className="text-lg font-semibold">~{Math.round(monthlyVisitors / 30).toLocaleString()}</div>
                </div>
                <div className="text-blue-800">
                  <div className="font-medium">Bandwidth needed</div>
                  <div className="text-lg font-semibold">~{Math.ceil(monthlyVisitors * 2 / 1000)}GB</div>
                </div>
                <div className="text-blue-800">
                  <div className="font-medium">Monthly requests</div>
                  <div className="text-lg font-semibold">~{(monthlyVisitors * 10 / 1000000).toFixed(1)}M</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
