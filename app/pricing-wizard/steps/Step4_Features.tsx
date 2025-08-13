import React from 'react'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Globe, BarChart3, TestTube, Users, Briefcase } from 'lucide-react'
import { WorkspaceType } from '@/lib/workspaceData'

interface Step4Props {
  features: {
    localization: boolean
    analytics: boolean
    abTesting: boolean
  }
  languages: number
  workspaceType: WorkspaceType
  onUpdate: (key: string, value: boolean) => void
  onLanguagesUpdate: (count: number) => void
  onWorkspaceTypeUpdate: (type: WorkspaceType) => void
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

export default function Step4Features({ features, languages, workspaceType, onUpdate, onLanguagesUpdate, onWorkspaceTypeUpdate }: Step4Props) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <h2 className="font-display text-3xl font-bold text-gray-900">
          What advanced features do you need?
        </h2>
        <p className="font-sans text-base text-gray-600">
          Select any advanced features you need for your site. You can always add them later.
        </p>
      </div>

      {/* Workspace Type Selection */}
      <Card className="bg-white border-gray-200">
        <CardContent className="p-6">
          <h3 className="font-display text-lg font-semibold text-gray-900 mb-4">
            What type of work will you be doing?
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => onWorkspaceTypeUpdate('team')}
              className={`group p-4 rounded-lg border-2 transition-all duration-200 text-left hover:shadow-md ${
                workspaceType === 'team'
                  ? 'bg-white border-brand shadow-md'
                  : 'bg-white border-gray-200 hover:border-blue-500 hover:bg-blue-500'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <Users className={`h-5 w-5 transition-colors ${
                  workspaceType === 'team' 
                    ? 'text-brand' 
                    : 'text-brand group-hover:text-white'
                }`} />
                <span className={`font-display font-semibold transition-colors ${
                  workspaceType === 'team'
                    ? 'text-gray-900'
                    : 'text-gray-900 group-hover:text-white'
                }`}>Team Collaboration</span>
              </div>
              <p className={`text-sm transition-colors ${
                workspaceType === 'team' 
                  ? 'text-gray-600' 
                  : 'text-gray-600 group-hover:text-white/90'
              }`}>
                Internal team projects, company websites, collaboration with colleagues
              </p>
            </button>

            <button
              onClick={() => onWorkspaceTypeUpdate('freelancer')}
              className={`group p-4 rounded-lg border-2 transition-all duration-200 text-left hover:shadow-md ${
                workspaceType === 'freelancer'
                  ? 'bg-white border-brand shadow-md'
                  : 'bg-white border-gray-200 hover:border-blue-500 hover:bg-blue-500'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <Briefcase className={`h-5 w-5 transition-colors ${
                  workspaceType === 'freelancer' 
                    ? 'text-brand' 
                    : 'text-brand group-hover:text-white'
                }`} />
                <span className={`font-display font-semibold transition-colors ${
                  workspaceType === 'freelancer'
                    ? 'text-gray-900'
                    : 'text-gray-900 group-hover:text-white'
                }`}>Client Work</span>
              </div>
              <p className={`text-sm transition-colors ${
                workspaceType === 'freelancer' 
                  ? 'text-gray-600' 
                  : 'text-gray-600 group-hover:text-white/90'
              }`}>
                Freelance projects, agency work, client websites, multiple staging sites
              </p>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Features Section */}
      <div className="space-y-6">
        <div className="space-y-4">
          {featureOptions.map((feature) => {
            const Icon = feature.icon
            const isEnabled = features[feature.key as keyof typeof features]
            
            return (
              <Card
                key={feature.key}
                className={`transition-all duration-200 hover:shadow-md ${
                  isEnabled 
                    ? 'bg-white border-brand border-2 shadow-md' 
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                <CardContent className="p-6">
                  <div 
                    className="flex items-start justify-between cursor-pointer"
                    onClick={() => onUpdate(feature.key, !isEnabled)}
                  >
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`p-2 rounded-lg ${isEnabled ? 'bg-brand/10' : 'bg-gray-50'}`}>
                        <Icon className={`h-6 w-6 ${isEnabled ? 'text-brand' : feature.color}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-display text-lg font-semibold text-gray-900">
                            {feature.title}
                          </h3>
                          {feature.key === 'localization' && (
                            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                              Free with 1 language
                            </span>
                          )}
                        </div>
                        <p className="font-sans text-gray-600 mb-3">{feature.description}</p>
                        <div className="text-sm font-medium text-gray-800">
                          {feature.key === 'localization' && languages > 1
                            ? `$${(languages - 1) * 9}/month for ${languages - 1} additional language${languages > 2 ? 's' : ''}`
                            : feature.pricing
                          }
                        </div>
                      </div>
                    </div>
                    <Switch
                      checked={isEnabled}
                      onCheckedChange={(checked) => onUpdate(feature.key, checked)}
                      className="data-[state=checked]:bg-brand"
                    />
                  </div>

                  {/* Language Configuration - Only show when localization is enabled */}
                  {feature.key === 'localization' && isEnabled && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <h4 className="font-display text-lg font-semibold text-gray-900 mb-4">
                        Language Configuration
                      </h4>
                      
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <Label className="font-sans text-sm font-medium text-gray-700 min-w-0">
                            Total languages:
                          </Label>
                          <Input
                            type="number"
                            value={languages}
                            onChange={(e) => onLanguagesUpdate(parseInt(e.target.value) || 1)}
                            className="w-24 border-gray-300 focus:border-brand"
                            min="1"
                            max="20"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                        
                        <div className="pt-2">
                          <input
                            type="range"
                            value={languages}
                            onChange={(e) => onLanguagesUpdate(parseInt(e.target.value))}
                            max={10}
                            min={1}
                            step={1}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                            onClick={(e) => e.stopPropagation()}
                          />
                          <div className="flex justify-between text-xs text-gray-600 mt-1">
                            <span>1 language</span>
                            <span>10+ languages</span>
                          </div>
                        </div>
                        
                        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <p className="text-sm text-blue-800">
                            {languages === 1 
                              ? "Your primary language is included at no extra cost."
                              : `Additional ${languages - 1} language${languages > 2 ? 's' : ''} will cost $${(languages - 1) * 9}/month.`
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
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
