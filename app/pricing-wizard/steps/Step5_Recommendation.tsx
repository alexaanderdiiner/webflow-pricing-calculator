import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Star, Lightbulb } from 'lucide-react'
import { PlanRecommendation } from '@/lib/recommendPlan'
import { PLAN_PRICING } from '@/lib/pricing'

interface Step5Props {
  recommendation: PlanRecommendation
}

export default function Step5Recommendation({ recommendation }: Step5Props) {
  const planData = PLAN_PRICING[recommendation.plan]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <h2 className="font-display text-2xl font-semibold text-gray-900">
          Here's our recommendation
        </h2>
        <p className="font-sans text-base text-gray-600">
          Based on your requirements, we've selected the perfect plan for your needs.
        </p>
      </div>

      {/* Recommended Plan */}
      <Card className="border-2 border-brand bg-gradient-to-br from-blue-50 to-blue-100/50">
        <CardHeader className="text-center pb-4">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Star className="h-6 w-6 text-brand" />
            <Badge className="bg-brand text-white hover:bg-brand/90">
              Recommended
            </Badge>
          </div>
          <CardTitle className="font-display text-3xl font-bold text-brand">
            {recommendation.plan} Plan
          </CardTitle>
          <CardDescription className="text-xl">
            <span className="font-display text-3xl font-bold text-gray-900">
              ${planData.monthly}
            </span>
            <span className="font-sans text-lg text-gray-700">/month</span>
            <div className="font-sans text-base text-gray-600 mt-1">
              ${planData.yearly}/year - save 15%
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-start gap-3 p-4 bg-white/60 rounded-lg">
            <Lightbulb className="h-6 w-6 text-brand mt-0.5 flex-shrink-0" />
            <p className="font-sans text-gray-800">{recommendation.rationale}</p>
          </div>

          <div>
            <h4 className="font-display text-lg font-semibold text-gray-900 mb-4">Plan includes:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="font-sans text-sm font-medium text-gray-800">
                  {planData.limits.bandwidth}GB bandwidth
                </span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="font-sans text-sm font-medium text-gray-800">
                  {planData.limits.requests}M requests
                </span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="font-sans text-sm font-medium text-gray-800">
                  {planData.limits.cpu}h CPU time
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommended Add-ons */}
      {recommendation.addOnRationale.length > 0 && (
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="font-display text-xl font-semibold text-gray-900">
              Recommended Add-ons
            </CardTitle>
            <CardDescription className="font-sans text-gray-600">
              Based on your requirements, we suggest these additional features:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recommendation.addOnRationale.map((rationale, index) => (
                <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="font-sans text-gray-700">{rationale}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Next Steps Info */}
      <Card className="bg-yellow-50 border-yellow-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <Lightbulb className="h-6 w-6 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-display font-semibold text-yellow-900 mb-2">What's next?</div>
              <div className="font-sans text-sm text-yellow-800">
                You can customize these recommendations and see the exact pricing breakdown in the next step.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
