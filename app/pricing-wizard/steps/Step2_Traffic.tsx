import React from 'react'
import { Input } from '@/components/ui/input'

interface Step2Props {
  currentStep: number
  totalSteps: number
  monthlyVisitors: number
  onUpdate: (visitors: number) => void
}

const trafficPresets = [
  { label: 'Just starting', range: '0 - 1k visitors', value: 500 },
  { label: 'Small site', range: '1k - 5k visitors', value: 2500 },
  { label: 'Growing site', range: '5k - 25 visitors', value: 12500 },
  { label: 'Popular site', range: '25k-100k visitors', value: 50000 },
  { label: 'High Traffic', range: '100k+ visitors', value: 200000 },
]

export default function Step2Traffic({ currentStep, totalSteps, monthlyVisitors, onUpdate }: Step2Props) {
  const progressPercentage = (currentStep / totalSteps) * 100

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <h1 className="font-display text-5xl font-bold text-gray-900">
          How much traffic do you expect?
        </h1>
        <p className="font-sans text-lg text-gray-600">
          This helps us recommend the right bandwidth and performance tier for your site
        </p>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-300 rounded-full h-1.5 mb-12">
        <div
          className="bg-[#4353FF] h-1.5 rounded-full transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
        {/* Left Column - Input and Presets */}
        <div className="space-y-6">
          <div className="space-y-3">
            <label htmlFor="visitors" className="font-display text-xl font-bold text-gray-900 block">
              Expected monthly visitors
            </label>
            <Input
              id="visitors"
              type="number"
              value={monthlyVisitors || ''}
              onChange={(e) => onUpdate(parseInt(e.target.value) || 0)}
              min="0"
              step="100"
              className="text-base py-3 px-4 border-gray-300 focus:border-[#4353FF] focus:ring-[#4353FF] h-12"
              placeholder="e.g. 2500"
            />
          </div>

          {/* Traffic Presets */}
          <div className="space-y-4">
            {/* First 2 presets */}
            <div className="grid grid-cols-2 gap-4">
              {trafficPresets.slice(0, 2).map((preset) => {
                const isSelected = monthlyVisitors === preset.value
                return (
                  <button
                    key={preset.value}
                    onClick={() => onUpdate(preset.value)}
                    className={`p-6 text-left border-2 rounded-xl transition-all duration-200 ${
                      isSelected
                        ? 'bg-white border-[#4353FF] shadow-lg'
                        : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-md'
                    }`}
                  >
                    <div className="font-display text-lg font-semibold text-gray-900">
                      {preset.label}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {preset.range}
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Next 2 presets */}
            <div className="grid grid-cols-2 gap-4">
              {trafficPresets.slice(2, 4).map((preset) => {
                const isSelected = monthlyVisitors === preset.value
                return (
                  <button
                    key={preset.value}
                    onClick={() => onUpdate(preset.value)}
                    className={`p-6 text-left border-2 rounded-xl transition-all duration-200 ${
                      isSelected
                        ? 'bg-white border-[#4353FF] shadow-lg'
                        : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-md'
                    }`}
                  >
                    <div className="font-display text-lg font-semibold text-gray-900">
                      {preset.label}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {preset.range}
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Last preset - Full width */}
            {(() => {
              const preset = trafficPresets[4]
              const isSelected = monthlyVisitors === preset.value
              return (
                <button
                  key={preset.value}
                  onClick={() => onUpdate(preset.value)}
                  className={`w-full p-6 text-left border-2 rounded-xl transition-all duration-200 ${
                    isSelected
                      ? 'bg-white border-[#4353FF] shadow-lg'
                      : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-md'
                  }`}
                >
                  <div className="font-display text-lg font-semibold text-gray-900">
                    {preset.label}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {preset.range}
                  </div>
                </button>
              )
            })()}
          </div>
        </div>

        {/* Right Column - Traffic Estimate */}
        <div className="flex items-start">
          <div className="w-full bg-white border-2 border-gray-200 rounded-xl p-8">
            <h3 className="font-display text-xl font-bold text-gray-900 mb-6">Traffic estimate:</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <span className="text-sm text-gray-600 uppercase tracking-wide">DAILY VISITORS</span>
                <span className="text-lg font-semibold text-gray-900">
                  ≈ {Math.round(monthlyVisitors / 30).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <span className="text-sm text-gray-600 uppercase tracking-wide">BANDWIDTH</span>
                <span className="text-lg font-semibold text-gray-900">
                  ≈ {Math.ceil(monthlyVisitors * 2 / 1000)}GB
                </span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-sm text-gray-600 uppercase tracking-wide">MONTHLY REQUESTS</span>
                <span className="text-lg font-semibold text-gray-900">
                  ≈ {(monthlyVisitors * 10 / 1000000).toFixed(1)}M
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
