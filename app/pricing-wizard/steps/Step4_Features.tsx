import React from 'react'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Globe, BarChart3, TestTube } from 'lucide-react'

interface Step4Props {
  features: {
    localization: boolean
    analytics: boolean
    abTesting: boolean
  }
  onUpdate: (key: string, value: boolean) => void
}

const featureOptions = [
  {
    key: 'localization',
    title: 'Multi-language Support',
    description: 'Translate your site content for international audiences',
    icon: Globe,
    pricing: '$9 per language per month',
    color: 'text-green-600',
  },
  {
    key: 'analytics',
    title: 'Built-in Analytics',
    description: 'Track visitor behavior, conversions, and site performance',
    icon: BarChart3,
    pricing: 'Starting at $29/month',
    color: 'text-blue-600',
  },
  {
    key: 'abTesting',
    title: 'A/B Testing & Personalization',
    description: 'Optimize your site with experiments and personalized content',
    icon: TestTube,
    pricing: '$299/month (25% yearly discount)',
    color: 'text-purple-600',
  },
]

export default function Step4Features({ features, onUpdate }: Step4Props) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <h2 className="font-display text-2xl font-semibold text-gray-900">
          What advanced features do you need?
        </h2>
        <p className="font-sans text-base text-gray-600">
          Select any advanced features you need for your site. You can always add them later.
        </p>
      </div>

      {/* Features Section */}
      <div className="space-y-6">
        <div className="space-y-4">
          {featureOptions.map((feature) => {
            const Icon = feature.icon
            const isEnabled = features[feature.key as keyof typeof features]
            
            return (
              <Card
                key={feature.key}
                className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                  isEnabled 
                    ? 'bg-white border-brand border-2 shadow-md' 
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => onUpdate(feature.key, !isEnabled)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`p-2 rounded-lg ${isEnabled ? 'bg-brand/10' : 'bg-gray-50'}`}>
                        <Icon className={`h-6 w-6 ${isEnabled ? 'text-brand' : feature.color}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-display text-lg font-semibold text-gray-900">
                            {feature.title}
                          </h3>
                        </div>
                        <p className="font-sans text-gray-600 mb-3">{feature.description}</p>
                        <div className="text-sm font-medium text-gray-800">
                          {feature.pricing}
                        </div>
                      </div>
                    </div>
                    <Switch
                      checked={isEnabled}
                      onCheckedChange={(checked) => onUpdate(feature.key, checked)}
                      className="data-[state=checked]:bg-brand"
                    />
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Info Card */}
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <div className="text-2xl">💡</div>
              <div>
                <div className="font-display font-semibold text-yellow-900 mb-1">
                  Flexible Options
                </div>
                <div className="font-sans text-sm text-yellow-800">
                  Don't worry - you can always add or remove these features later. We'll show you the exact costs in the next step.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
