import React from 'react'
import { Switch } from '@/components/ui/switch'
import { Globe, BarChart3, TestTube2, Users, Briefcase } from 'lucide-react'
import { WorkspaceType } from '@/lib/workspaceData'

interface Step3Props {
  currentStep: number
  totalSteps: number
  updateFrequency: string
  onUpdate: (frequency: string) => void
  features?: {
    localization: boolean
    analytics: boolean
    abTesting: boolean
  }
  languages?: number
  workspaceType?: WorkspaceType
  onFeatureUpdate?: (key: string, value: boolean) => void
  onLanguagesUpdate?: (count: number) => void
  onWorkspaceTypeUpdate?: (type: WorkspaceType) => void
}

export default function Step3Content({
  currentStep,
  totalSteps,
  workspaceType = 'team',
  onWorkspaceTypeUpdate,
  features = { localization: false, analytics: false, abTesting: false },
  onFeatureUpdate
}: Step3Props) {
  const progressPercentage = (currentStep / totalSteps) * 100

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <h1 className="font-display text-5xl font-bold text-gray-900">
          What advanced features do you need?
        </h1>
        <p className="font-sans text-lg text-gray-600">
          Select any advanced features you need for your site. You can always add them later.
        </p>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-300 rounded-full h-1.5 mb-12">
        <div
          className="bg-[#4353FF] h-1.5 rounded-full transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Workspace Type Selection */}
        <div>
          <h3 className="font-display text-xl font-bold text-gray-900 mb-4">
            What type of work will you be doing?
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => onWorkspaceTypeUpdate?.('team')}
              className={`p-6 rounded-xl border-2 transition-all duration-200 text-left ${
                workspaceType === 'team'
                  ? 'border-[#4353FF] bg-white shadow-lg'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
              }`}
            >
              <div className="flex items-start gap-3">
                <Users className="h-8 w-8 text-[#4353FF] mt-1" />
                <div>
                  <div className="font-display text-lg font-semibold text-gray-900 mb-1">
                    Team Collaboration
                  </div>
                  <div className="text-sm text-gray-600">
                    Company, landing pages, lead generation
                  </div>
                </div>
              </div>
            </button>

            <button
              onClick={() => onWorkspaceTypeUpdate?.('freelancer')}
              className={`p-6 rounded-xl border-2 transition-all duration-200 text-left ${
                workspaceType === 'freelancer'
                  ? 'border-[#4353FF] bg-white shadow-lg'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
              }`}
            >
              <div className="flex items-start gap-3">
                <Briefcase className="h-8 w-8 text-[#4353FF] mt-1" />
                <div>
                  <div className="font-display text-lg font-semibold text-gray-900 mb-1">
                    Client Work
                  </div>
                  <div className="text-sm text-gray-600">
                    Content publishing, articles, news sites
                  </div>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Features Section */}
        <div>
          <h3 className="font-display text-xl font-bold text-gray-900 mb-2">
            Additional functionality:
          </h3>
          <p className="text-sm text-gray-600 mb-6">
            Don't worry, you can always or remove these features later. We'll show you the final cost in the next step.
          </p>

          <div className="space-y-4">
            {/* Multi-language Support */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Globe className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="font-display text-lg font-semibold text-gray-900">
                        Multi-language Support
                      </h4>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        Free with 1 language
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Translate your site content for international audiences
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      $9 per language per month
                    </p>
                  </div>
                </div>
                <Switch
                  checked={features.localization}
                  onCheckedChange={(checked) => onFeatureUpdate?.('localization', checked)}
                  className="ml-4"
                />
              </div>
            </div>

            {/* Built-in Analytics */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <BarChart3 className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-display text-lg font-semibold text-gray-900 mb-1">
                      Built-in Analytics
                    </h4>
                    <p className="text-sm text-gray-600 mb-2">
                      Track visitor behaviour, conversions, and site performance
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      Starting at $29/month
                    </p>
                  </div>
                </div>
                <Switch
                  checked={features.analytics}
                  onCheckedChange={(checked) => onFeatureUpdate?.('analytics', checked)}
                  className="ml-4"
                />
              </div>
            </div>

            {/* A/B Testing */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <TestTube2 className="h-6 w-6 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-display text-lg font-semibold text-gray-900 mb-1">
                      A/B Testing & Personalization
                    </h4>
                    <p className="text-sm text-gray-600 mb-2">
                      Optimize your site with experiments and personalized content
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      $299/month (25% yearly discount)
                    </p>
                  </div>
                </div>
                <Switch
                  checked={features.abTesting}
                  onCheckedChange={(checked) => onFeatureUpdate?.('abTesting', checked)}
                  className="ml-4"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
