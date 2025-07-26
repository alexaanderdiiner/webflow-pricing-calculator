import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface WizardStepProps {
  currentStep: number
  totalSteps: number
  onNext?: () => void
  onPrevious?: () => void
  nextDisabled?: boolean
  children: React.ReactNode
}

export default function WizardStep({
  currentStep,
  totalSteps,
  onNext,
  onPrevious,
  nextDisabled = false,
  children,
}: WizardStepProps) {
  return (
    <div 
      className="min-h-screen relative flex items-center justify-center px-4 sm:px-6 lg:px-8"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.85)), url('/webflow-pricing-bg.png'), linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)`,
        backgroundSize: 'auto, cover, auto',
        backgroundPosition: 'center, center, center',
        backgroundRepeat: 'no-repeat, no-repeat, no-repeat'
      }}
    >
      <div className="max-w-3xl w-full mx-auto relative z-10">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-paragraphSm text-white/90 mb-2">
            <span>Step {currentStep} of {totalSteps}</span>
            <span>{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-white/30 rounded-full h-2">
            <div
              className="bg-brand h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Main Content */}
        <Card className="w-full max-w-2xl mx-auto bg-white border border-gray-200 shadow-lg rounded-xl">
          <CardContent className="p-8 space-y-8">
            {children}
            
            {/* Navigation Buttons */}
            <div className="flex justify-between pt-4 border-t border-gray-100">
              <Button
                variant="outline"
                onClick={onPrevious}
                disabled={currentStep === 1}
                className="flex items-center gap-2 px-6 py-2 border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              
              <Button
                onClick={onNext}
                disabled={nextDisabled}
                className="flex items-center gap-2 px-6 py-2 bg-brand hover:bg-brand/90 text-white"
              >
                {currentStep === totalSteps ? 'View Pricing' : 'Next'}
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
