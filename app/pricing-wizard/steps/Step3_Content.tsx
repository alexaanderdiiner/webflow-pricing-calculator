import React from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Clock, Edit, Zap } from 'lucide-react'

interface Step3Props {
  updateFrequency: string
  onUpdate: (frequency: string) => void
}

const frequencies = [
  {
    value: 'rarely',
    label: 'Rarely',
    description: 'Static content, maybe a few updates per year',
    icon: Clock,
    color: 'text-gray-600',
  },
  {
    value: 'weekly',
    label: 'Weekly',
    description: 'Regular blog posts, news updates, product changes',
    icon: Edit,
    color: 'text-blue-600',
  },
  {
    value: 'daily',
    label: 'Daily',
    description: 'Frequent content updates, active blog, dynamic content',
    icon: Zap,
    color: 'text-green-600',
  },
]

export default function Step3Content({ updateFrequency, onUpdate }: Step3Props) {
  const selectedFreq = frequencies.find(f => f.value === updateFrequency)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <h2 className="font-display text-2xl font-semibold text-gray-900">
          How often will you update content?
        </h2>
        <p className="font-sans text-base text-gray-600">
          This helps us recommend the right CMS features and compute resources.
        </p>
      </div>

      {/* Selection Section */}
      <div className="space-y-6">
        <div className="space-y-4">
          <Label className="font-display text-lg font-medium text-gray-900">
            Content update frequency
          </Label>
          <Select value={updateFrequency} onValueChange={onUpdate}>
            <SelectTrigger className="text-lg py-4 border-gray-300 focus:border-brand focus:ring-brand">
              <SelectValue placeholder="Select content update frequency" />
            </SelectTrigger>
            <SelectContent>
              {frequencies.map((freq) => {
                const Icon = freq.icon
                return (
                  <SelectItem key={freq.value} value={freq.value} className="py-3">
                    <div className="flex items-center gap-3">
                      <Icon className={`h-5 w-5 ${freq.color}`} />
                      <div>
                        <div className="font-medium text-base">{freq.label}</div>
                        <div className="text-sm text-gray-500">{freq.description}</div>
                      </div>
                    </div>
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
        </div>

        {/* Selected Frequency Info */}
        {selectedFreq && (
          <Card className="bg-gray-50 border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <selectedFreq.icon className={`h-6 w-6 ${selectedFreq.color}`} />
                <h4 className="font-display text-lg font-semibold text-gray-900">
                  {selectedFreq.label} Updates
                </h4>
              </div>
              <p className="font-sans text-gray-600 mb-4">{selectedFreq.description}</p>
              
              {updateFrequency !== 'rarely' && (
                <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl">💡</div>
                  <div>
                    <div className="font-medium text-blue-900 mb-1">CMS Recommendation</div>
                    <div className="text-sm text-blue-800">
                      We'll recommend a CMS plan for easier content management and collaboration.
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
