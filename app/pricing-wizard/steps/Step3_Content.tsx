import React from 'react'
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
    recommendation: 'Perfect for static sites and portfolios',
  },
  {
    value: 'weekly',
    label: 'Weekly',
    description: 'Regular blog posts, news updates, product changes',
    icon: Edit,
    color: 'text-blue-600',
    recommendation: 'We\'ll recommend a CMS plan for easier content management',
  },
  {
    value: 'daily',
    label: 'Daily',
    description: 'Frequent content updates, active blog, dynamic content',
    icon: Zap,
    color: 'text-green-600',
    recommendation: 'CMS plan + additional compute resources recommended',
  },
]

export default function Step3Content({ updateFrequency, onUpdate }: Step3Props) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <h2 className="font-display text-3xl font-bold text-gray-900">
          How often will you update content?
        </h2>
        <p className="font-sans text-base text-gray-600">
          This helps us recommend the right CMS features and compute resources.
        </p>
      </div>

      {/* Frequency Cards */}
      <div className="flex flex-col space-y-4">
        {frequencies.map((freq) => {
          const Icon = freq.icon
          const isSelected = updateFrequency === freq.value
          
          return (
            <Card
              key={freq.value}
              className={`cursor-pointer transition-all duration-200 group rounded-lg overflow-hidden ${
                isSelected 
                  ? 'bg-white border-brand border-2 text-gray-900 shadow-md' 
                  : 'bg-white border-gray-200 text-gray-900 hover:bg-brand hover:border-brand hover:text-white hover:shadow-lg'
              }`}
              onClick={() => onUpdate(freq.value)}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg transition-colors ${
                    isSelected ? 'bg-brand/10' : 'bg-gray-50 group-hover:bg-brand/20'
                  }`}>
                    <Icon className={`h-6 w-6 transition-colors ${
                      isSelected 
                        ? 'text-brand' 
                        : `${freq.color} group-hover:text-white`
                    }`} />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className={`font-display text-xl font-semibold mb-2 transition-colors ${
                      isSelected 
                        ? 'text-gray-900' 
                        : 'text-gray-900 group-hover:text-white'
                    }`}>
                      {freq.label}
                    </h3>
                    
                    <p className={`font-sans text-gray-600 mb-3 transition-colors ${
                      isSelected 
                        ? 'text-gray-600' 
                        : 'text-gray-600 group-hover:text-white/90'
                    }`}>
                      {freq.description}
                    </p>
                    
                    <div className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                      isSelected 
                        ? 'text-blue-700' 
                        : 'text-gray-500 group-hover:text-white/90'
                    }`}>
                      <div className="text-base">💡</div>
                      <span>{freq.recommendation}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
