import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react'

interface WizardStepProps {
  currentStep: number
  totalSteps: number
  onNext?: () => void
  onPrevious?: () => void
  nextDisabled?: boolean
  nextButtonText?: string
  showBackToStart?: boolean
  onBackToStart?: () => void
  children: React.ReactNode
}

export default function WizardStep({
  currentStep,
  totalSteps,
  onNext,
  onPrevious,
  nextDisabled = false,
  nextButtonText,
  showBackToStart = false,
  onBackToStart,
  children,
}: WizardStepProps) {
  return (
    <div className="min-h-screen bg-white relative flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full mx-auto relative z-10">
        {/* Back to Start Button */}
        {showBackToStart && (
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={onBackToStart}
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Pricing Wizard
            </Button>
          </div>
        )}

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Step {currentStep} of {totalSteps}</span>
            <span>{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-brand h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Main Content */}
        <Card className="w-full max-w-4xl mx-auto bg-white border border-gray-200 shadow-lg rounded-xl max-h-[720px] flex flex-col">
          <CardContent className="p-8 flex flex-col flex-1 min-h-0">
            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto pr-2 -mr-2">
              <div className="space-y-8">
                {children}
              </div>
            </div>
            
            {/* Fixed Navigation Buttons */}
            <div className="flex justify-between pt-6 mt-6 border-t border-gray-100 flex-shrink-0">
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
                {nextButtonText || (currentStep === totalSteps ? 'Get Started' : 'Next')}
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
