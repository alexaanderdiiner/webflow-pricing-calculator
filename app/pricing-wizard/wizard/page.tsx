'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import WizardStep from '../components/WizardStep'
import Step1UseCase from '../steps/Step1_UseCase'
import Step2Traffic from '../steps/Step2_Traffic'
import Step3Content from '../steps/Step3_Content'
import Step4Features from '../steps/Step4_Features'
import { recommendPlan, WizardAnswers } from '@/lib/recommendPlan'

function WizardContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  // Start at step 2 if usecase is provided, otherwise step 1
  const usecase = searchParams?.get('usecase')
  const hasUsecase = usecase && ['marketing', 'blog', 'portfolio', 'other'].includes(usecase)
  const [currentStep, setCurrentStep] = useState(hasUsecase ? 2 : 1)
  
  const [wizardAnswers, setWizardAnswers] = useState<WizardAnswers>({
    siteType: 'marketing',
    monthlyVisitors: 2500,
    contentUpdateFrequency: 'weekly',
    languages: 1,
    workspaceType: 'team',
    features: {
      localization: false,
      analytics: false,
      abTesting: false,
    },
  })

  // Handle initial usecase from URL params
  useEffect(() => {
    const usecase = searchParams?.get('usecase')
    if (usecase && ['marketing', 'blog', 'portfolio', 'other'].includes(usecase)) {
      console.log('🎯 Setting initial site type from URL:', usecase)
      setWizardAnswers(prev => ({
        ...prev,
        siteType: usecase as WizardAnswers['siteType'],
      }))
    }
  }, [searchParams])

  const handleNext = () => {
    console.log('🔥 Wizard handleNext called! Current step:', currentStep)
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
      console.log('📈 Moving to step:', currentStep + 1)
    } else {
      console.log('✅ Final step - generating recommendation')
      // Final step - generate recommendation and navigate to result
      const recommendation = recommendPlan(wizardAnswers)
      
      const params = new URLSearchParams({
        source: 'wizard',
        plan: recommendation.plan,
        siteType: wizardAnswers.siteType,
        monthlyVisitors: wizardAnswers.monthlyVisitors.toString(),
        contentUpdateFrequency: wizardAnswers.contentUpdateFrequency,
        languages: wizardAnswers.languages.toString(),
        workspaceType: wizardAnswers.workspaceType,
        localization: wizardAnswers.features.localization.toString(),
        analytics: wizardAnswers.features.analytics.toString(),
        abTesting: wizardAnswers.features.abTesting.toString(),
        optimize: recommendation.addOns.optimize.toString(),
        analyzeSessions: recommendation.addOns.analyzeSessions.toString(),
        localizationLocales: recommendation.addOns.localizationLocales.toString(),
      })
      
      router.push(`/pricing-wizard/result?${params.toString()}`)
    }
  }

  const handlePrevious = () => {
    console.log('⬅️ Wizard handlePrevious called! Current step:', currentStep)
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      console.log('📉 Moving to step:', currentStep - 1)
    } else {
      console.log('🏠 Going back to main page')
      // Go back to main page
      router.push('/pricing-wizard')
    }
  }

  const updateWizardAnswer = (key: keyof WizardAnswers, value: any) => {
    console.log('📝 updateWizardAnswer called:', key, '=', value)
    setWizardAnswers(prev => ({
      ...prev,
      [key]: value,
    }))
  }

  const updateFeature = (key: string, value: boolean) => {
    setWizardAnswers(prev => ({
      ...prev,
      features: {
        ...prev.features,
        [key]: value,
      },
    }))
  }

  const updateLanguages = (count: number) => {
    setWizardAnswers(prev => ({
      ...prev,
      languages: count,
    }))
  }

  const updateWorkspaceType = (type: 'team' | 'freelancer') => {
    console.log('🏢 updateWorkspaceType called:', type)
    setWizardAnswers(prev => ({
      ...prev,
      workspaceType: type,
    }))
  }

  const getStepValidation = () => {
    switch (currentStep) {
      case 1:
        return true // Always valid since we have defaults
      case 2:
        return wizardAnswers.monthlyVisitors > 0
      case 3:
        return true // Always valid since we have defaults
      case 4:
        return true // Features are optional
      default:
        return false
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1UseCase
            selectedUseCase={wizardAnswers.siteType}
            onSelect={(useCase) => updateWizardAnswer('siteType', useCase)}
          />
        )
      case 2:
        return (
          <Step2Traffic
            monthlyVisitors={wizardAnswers.monthlyVisitors}
            onUpdate={(visitors) => updateWizardAnswer('monthlyVisitors', visitors)}
          />
        )
      case 3:
        return (
          <Step3Content
            updateFrequency={wizardAnswers.contentUpdateFrequency}
            onUpdate={(frequency) => updateWizardAnswer('contentUpdateFrequency', frequency)}
          />
        )
      case 4:
        return (
          <Step4Features
            features={wizardAnswers.features}
            languages={wizardAnswers.languages}
            workspaceType={wizardAnswers.workspaceType}
            onUpdate={updateFeature}
            onLanguagesUpdate={updateLanguages}
            onWorkspaceTypeUpdate={updateWorkspaceType}
          />
        )
      default:
        return null
    }
  }

  const getNextButtonText = () => {
    return currentStep === 4 ? 'Get My Recommendation' : 'Next'
  }

  return (
    <WizardStep
      currentStep={currentStep}
      totalSteps={4}
      onNext={handleNext}
      onPrevious={handlePrevious}
      nextDisabled={!getStepValidation()}
      nextButtonText={getNextButtonText()}
      showBackToStart={currentStep === 1}
      onBackToStart={() => router.push('/pricing-wizard')}
    >
      {renderStep()}
    </WizardStep>
  )
}

export default function WizardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    }>
      <WizardContent />
    </Suspense>
  )
}
