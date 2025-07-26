import React from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, UserPlus, Shield, FileText, Settings, Building } from 'lucide-react'

interface Step6Props {
  workspaceAnswers: {
    teamSize: number
    needsGuests: boolean
    expectedGuests: number
    needsSSO: boolean
    needsAuditLogs: boolean
    needsAdvancedPermissions: boolean
    numberOfSites: number
  }
  onUpdate: (key: string, value: any) => void
}

export default function Step6Workspace({ workspaceAnswers, onUpdate }: Step6Props) {
  const enterpriseFeatures = [
    {
      key: 'needsSSO',
      title: 'Single Sign-On (SSO)',
      description: 'Allow team members to log in with company credentials',
      icon: Shield,
    },
    {
      key: 'needsAuditLogs',
      title: 'Audit Logs',
      description: 'Track all user actions for compliance and security',
      icon: FileText,
    },
    {
      key: 'needsAdvancedPermissions',
      title: 'Advanced Permissions',
      description: 'Custom roles and granular access controls',
      icon: Settings,
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <h2 className="font-display text-2xl font-semibold text-gray-900">
          Tell us about your team
        </h2>
        <p className="font-sans text-base text-gray-600">
          Help us recommend the right workspace plan for your team size and collaboration needs.
        </p>
      </div>

      {/* Team Size */}
      <Card className="bg-white border-gray-200">
        <CardHeader className="pb-4">
          <CardTitle className="font-display text-lg font-semibold text-gray-900 flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            Team Size
          </CardTitle>
          <CardDescription className="font-sans text-gray-600">
            How many people will be working in your Webflow workspace?
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Label htmlFor="team-size" className="font-display text-base font-medium text-gray-900">
              Number of team members
            </Label>
            <Input
              id="team-size"
              type="number"
              value={workspaceAnswers.teamSize}
              onChange={(e) => onUpdate('teamSize', parseInt(e.target.value) || 1)}
              min="1"
              max="100"
              className="text-lg py-3 border-gray-300 focus:border-brand focus:ring-brand"
            />
            <p className="font-sans text-sm text-gray-600">
              Include yourself and anyone who needs to design, edit, or manage sites
            </p>
          </div>
          
          {workspaceAnswers.teamSize > 1 && (
            <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-xl">💡</div>
              <div className="font-sans text-sm text-blue-800">
                Teams of 2+ will need at least the Core workspace plan ($19/seat/month)
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Guest Access */}
      <Card className="bg-white border-gray-200">
        <CardHeader className="pb-4">
          <CardTitle className="font-display text-lg font-semibold text-gray-900 flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <UserPlus className="h-5 w-5 text-green-600" />
            </div>
            Guest Collaborators
          </CardTitle>
          <CardDescription className="font-sans text-gray-600">
            Do you need clients or external partners to review or comment on sites?
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <Label htmlFor="needs-guests" className="font-display text-base font-medium text-gray-900">
                Enable guest access
              </Label>
              <p className="font-sans text-sm text-gray-600 mt-1">
                Guests can view and comment but can't edit designs
              </p>
            </div>
            <Switch
              id="needs-guests"
              checked={workspaceAnswers.needsGuests}
              onCheckedChange={(checked) => onUpdate('needsGuests', checked)}
              className="data-[state=checked]:bg-brand"
            />
          </div>

          {workspaceAnswers.needsGuests && (
            <div className="space-y-3">
              <Label htmlFor="guest-count" className="font-display text-base font-medium text-gray-900">
                Expected number of guests
              </Label>
              <Input
                id="guest-count"
                type="number"
                value={workspaceAnswers.expectedGuests}
                onChange={(e) => onUpdate('expectedGuests', parseInt(e.target.value) || 0)}
                min="0"
                max="50"
                className="text-lg py-3 border-gray-300 focus:border-brand focus:ring-brand"
              />
              <p className="font-sans text-sm text-gray-600">
                Core plan includes 3 guests, Growth plan includes 10 guests
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Number of Sites */}
      <Card className="bg-white border-gray-200">
        <CardHeader className="pb-4">
          <CardTitle className="font-display text-lg font-semibold text-gray-900 flex items-center gap-3">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Building className="h-5 w-5 text-purple-600" />
            </div>
            Multiple Sites
          </CardTitle>
          <CardDescription className="font-sans text-gray-600">
            How many sites do you plan to host and manage?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Label htmlFor="site-count" className="font-display text-base font-medium text-gray-900">
              Number of hosted sites
            </Label>
            <Input
              id="site-count"
              type="number"
              value={workspaceAnswers.numberOfSites}
              onChange={(e) => onUpdate('numberOfSites', parseInt(e.target.value) || 1)}
              min="1"
              max="50"
              className="text-lg py-3 border-gray-300 focus:border-brand focus:ring-brand"
            />
            <p className="font-sans text-sm text-gray-600">
              Each site will need its own hosting plan. Free workspace allows 2 unhosted sites only.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Enterprise Features */}
      <Card className="bg-white border-gray-200">
        <CardHeader className="pb-4">
          <CardTitle className="font-display text-lg font-semibold text-gray-900">
            Enterprise Features
          </CardTitle>
          <CardDescription className="font-sans text-gray-600">
            Select any advanced features your organization requires
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {enterpriseFeatures.map((feature) => {
            const Icon = feature.icon
            const isEnabled = workspaceAnswers[feature.key as keyof typeof workspaceAnswers] as boolean
            
            return (
              <div
                key={feature.key}
                className={`cursor-pointer transition-all duration-200 flex items-start justify-between p-4 border rounded-lg hover:shadow-md ${
                  isEnabled 
                    ? 'border-brand border-2 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => onUpdate(feature.key, !isEnabled)}
              >
                <div className="flex items-start gap-3 flex-1">
                  <div className={`p-2 rounded-lg ${isEnabled ? 'bg-brand/10' : 'bg-gray-50'}`}>
                    <Icon className={`h-5 w-5 ${isEnabled ? 'text-brand' : 'text-gray-600'}`} />
                  </div>
                  <div>
                    <h4 className="font-display font-medium text-gray-900">{feature.title}</h4>
                    <p className="font-sans text-sm text-gray-600 mt-1">{feature.description}</p>
                  </div>
                </div>
                <Switch
                  checked={isEnabled}
                  onCheckedChange={(checked) => onUpdate(feature.key, checked)}
                  className="data-[state=checked]:bg-brand"
                />
              </div>
            )
          })}
          
          {(workspaceAnswers.needsSSO || workspaceAnswers.needsAuditLogs || workspaceAnswers.needsAdvancedPermissions) && (
            <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="text-xl">🏢</div>
              <div>
                <div className="font-display font-medium text-orange-900 mb-1">
                  Enterprise Required
                </div>
                <div className="font-sans text-sm text-orange-800">
                  These features require Webflow Enterprise with custom pricing
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
