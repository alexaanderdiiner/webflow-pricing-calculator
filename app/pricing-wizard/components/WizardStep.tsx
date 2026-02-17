import React from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

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
    <div className="min-h-screen bg-gray-50 relative px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-5xl w-full mx-auto">
        {/* Back Button - Top Left */}
        {showBackToStart && (
          <div className="mb-8">
            <button
              onClick={onBackToStart}
              className="text-[#4353FF] hover:underline flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          </div>
        )}

        {/* Step Indicator Badge - Centered */}
        <div className="flex justify-center mb-8">
          <div className="bg-blue-100 text-[#4353FF] px-4 py-2 rounded-full text-sm font-medium">
            Step {currentStep} of {totalSteps}
          </div>
        </div>

        {/* Main Content with Progress Bar */}
        <div>
          {children}
        </div>

        {/* Fixed Navigation Buttons - Bottom */}
        <div className="flex justify-between pt-8 max-w-5xl mx-auto">
          <Button
            variant="outline"
            onClick={onPrevious}
            className="px-8 py-3 border-gray-300 bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-lg font-medium"
          >
            Back
          </Button>

          <Button
            onClick={onNext}
            disabled={nextDisabled}
            className="px-8 py-3 bg-[#4353FF] hover:bg-[#3142E6] text-white rounded-lg font-medium"
          >
            {nextButtonText || 'Next'}
          </Button>
        </div>
      </div>
    </div>
  )
}
