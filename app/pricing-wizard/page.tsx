'use client'

import React, { useState, useEffect } from 'react'
import WizardStep from './components/WizardStep'
import Step1UseCase from './steps/Step1_UseCase'
import Step2Traffic from './steps/Step2_Traffic'
import Step3Content from './steps/Step3_Content'
import Step4Features from './steps/Step4_Features'
import Step5Recommendation from './steps/Step5_Recommendation'
import Step6Workspace from './steps/Step6_Workspace'
import CustomizeForm from './components/CustomizeForm'
import PricingSummary from './components/PricingSummary'
import WorkspaceSummary from './components/WorkspaceSummary'
import { recommendPlan, getEstimatedUsage, WizardAnswers } from '@/lib/recommendPlan'
import { calculatePricing, UsageInputs } from '@/lib/pricing'
import { recommendWorkspacePlan, calculateWorkspaceCost } from '@/lib/recommendWorkspace'
import { WorkspaceAnswers, WorkspacePlan, WorkspaceBillingCycle } from '@/lib/workspaceData'

export default function PricingWizard() {
  const [currentStep, setCurrentStep] = useState(1)
  const [showFinalPricing, setShowFinalPricing] = useState(false)
  
  const [wizardAnswers, setWizardAnswers] = useState<WizardAnswers>({
    siteType: 'marketing',
    monthlyVisitors: 2500,
    contentUpdateFrequency: 'weekly',
    features: {
      localization: false,
      analytics: false,
      abTesting: false,
    },
  })

  const [workspaceAnswers, setWorkspaceAnswers] = useState<WorkspaceAnswers>({
    teamSize: 1,
    needsGuests: false,
    expectedGuests: 0,
    needsSSO: false,
    needsAuditLogs: false,
    needsAdvancedPermissions: false,
    numberOfSites: 1,
  })

  const [workspaceInputs, setWorkspaceInputs] = useState<{
    plan: WorkspacePlan
    seats: number
    billingCycle: WorkspaceBillingCycle
  }>({
    plan: 'Free',
    seats: 1,
    billingCycle: 'Monthly',
  })

  const [usageInputs, setUsageInputs] = useState<UsageInputs>({
    plan: 'Starter',
    billingCycle: 'Monthly',
    bandwidth: 10,
    requests: 0.5,
    cpu: 5,
    addOns: {
      optimize: false,
      analyzeSessions: 0,
      localizationLocales: 0,
    },
  })

  const [pricingResults, setPricingResults] = useState(calculatePricing(usageInputs))

  // Update pricing when inputs change
  useEffect(() => {
    const results = calculatePricing(usageInputs)
    setPricingResults(results)
  }, [usageInputs])

  // Generate recommendations when going to final pricing
  useEffect(() => {
    if (showFinalPricing) {
      const recommendation = recommendPlan(wizardAnswers)
      const estimatedUsage = getEstimatedUsage(wizardAnswers)
      
      setUsageInputs({
        plan: recommendation.plan,
        billingCycle: 'Monthly',
        bandwidth: estimatedUsage.bandwidth,
        requests: estimatedUsage.requests,
        cpu: estimatedUsage.cpu,
        addOns: recommendation.addOns,
      })

      const workspaceRecommendation = recommendWorkspacePlan(workspaceAnswers)
      setWorkspaceInputs({
        plan: workspaceRecommendation.plan,
        seats: workspaceRecommendation.recommendedSeats,
        billingCycle: 'Monthly',
      })
    }
  }, [showFinalPricing, wizardAnswers, workspaceAnswers])

  const handleNext = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1)
    } else {
      // After step 6, go to final pricing
      setShowFinalPricing(true)
    }
  }

  const handlePrevious = () => {
    if (showFinalPricing) {
      setShowFinalPricing(false)
    } else if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const updateWizardAnswer = (key: keyof WizardAnswers, value: any) => {
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

  const updateWorkspaceAnswer = (key: string, value: any) => {
    setWorkspaceAnswers(prev => ({
      ...prev,
      [key]: value,
    }))
  }

  const updateUsageInputs = (updates: Partial<UsageInputs>) => {
    setUsageInputs(prev => ({
      ...prev,
      ...updates,
    }))
  }

  const updateWorkspaceInputs = (updates: Partial<typeof workspaceInputs>) => {
    setWorkspaceInputs(prev => ({
      ...prev,
      ...updates,
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
      case 5:
      case 6:
        return true
      default:
        return false
    }
  }

  if (showFinalPricing) {
    const workspaceCost = calculateWorkspaceCost(workspaceInputs.plan, workspaceInputs.seats, workspaceInputs.billingCycle)
    const combinedMonthlyTotal = pricingResults.monthlyTotal + workspaceCost
    const combinedYearlyTotal = pricingResults.yearlyTotal + (workspaceCost * 12)

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
          <div className="max-w-7xl w-full mx-auto relative z-10">
            <div className="text-center mb-8">
              <h1 className="font-display text-h2 font-bold text-white mb-4">
                Your Webflow Pricing
              </h1>
              <p className="font-sans text-paragraphXl text-white/90 max-w-2xl mx-auto">
                Customize your configuration and see the exact costs for both site hosting and workspace collaboration.
              </p>
            </div>

          {/* Combined Total */}
          <div className="mb-8">
            <div className="text-center p-8 bg-gradient-to-r from-brand to-brand-dark text-white rounded-xl shadow-lg">
              <h2 className="font-display text-h4 font-semibold mb-3">Total Estimated Cost</h2>
              <div className="font-display text-h1 font-bold mb-2">
                ${combinedMonthlyTotal.toFixed(2)}<span className="text-h5 opacity-80">/month</span>
              </div>
              <div className="font-sans text-paragraphLg opacity-90 mb-2">
                ${combinedYearlyTotal.toFixed(2)}/year
              </div>
              <div className="font-sans text-paragraphSm opacity-80 bg-white/10 rounded-full px-4 py-1 inline-block">
                Site Plan + Workspace Plan
              </div>
            </div>
          </div>

          {/* Site and Workspace Configuration */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
            <CustomizeForm 
              inputs={usageInputs}
              onUpdate={updateUsageInputs}
            />
            <PricingSummary 
              results={pricingResults}
              billingCycle={usageInputs.billingCycle}
            />
            <div className="space-y-6">
              <WorkspaceSummary 
                plan={workspaceInputs.plan}
                seats={workspaceInputs.seats}
                billingCycle={workspaceInputs.billingCycle}
              />
              {/* Workspace Customization */}
              <div className="p-4 bg-white/95 backdrop-blur-sm rounded-lg border shadow-lg">
                <h3 className="font-medium mb-4">Customize Workspace</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Plan</label>
                    <select 
                      value={workspaceInputs.plan}
                      onChange={(e) => updateWorkspaceInputs({ plan: e.target.value as WorkspacePlan })}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="Free">Free</option>
                      <option value="Core">Core - $19/seat</option>
                      <option value="Growth">Growth - $49/seat</option>
                      <option value="Enterprise">Enterprise - Custom</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Seats</label>
                    <input
                      type="number"
                      value={workspaceInputs.seats}
                      onChange={(e) => updateWorkspaceInputs({ seats: parseInt(e.target.value) || 1 })}
                      min="1"
                      max="100"
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Billing</label>
                    <select 
                      value={workspaceInputs.billingCycle}
                      onChange={(e) => updateWorkspaceInputs({ billingCycle: e.target.value as WorkspaceBillingCycle })}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="Monthly">Monthly</option>
                      <option value="Yearly">Yearly (15% off)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enterprise CTA */}
          <div className="mt-8">
            <div className="bg-gray-900/95 backdrop-blur-sm text-white rounded-xl p-8 shadow-2xl border border-gray-700">
              <div className="text-center mb-6">
                <div className="inline-block bg-brand text-white px-4 py-2 rounded-lg font-sans text-caption font-semibold tracking-wider mb-4">
                  ENTERPRISE
                </div>
                <h2 className="font-display text-h3 font-bold mb-4">Get a demo</h2>
                <p className="font-sans text-paragraphXl text-gray-300 mb-6">
                  For those who need a scalable custom solution.
                </p>
                <button className="bg-brand hover:bg-brand-dark text-white font-sans font-semibold py-3 px-8 rounded-lg text-paragraphLg transition-colors">
                  Talk to us
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full border-2 border-gray-400 flex items-center justify-center">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  </div>
                  <span className="text-gray-300">Enterprise-ready scale</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full border-2 border-gray-400 flex items-center justify-center">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  </div>
                  <span className="text-gray-300">Advanced collaboration</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full border-2 border-gray-400 flex items-center justify-center">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  </div>
                  <span className="text-gray-300">Guaranteed SLA</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full border-2 border-gray-400 flex items-center justify-center">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  </div>
                  <span className="text-gray-300">Enterprise security</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full border-2 border-gray-400 flex items-center justify-center">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  </div>
                  <span className="text-gray-300">Customer success</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full border-2 border-gray-400 flex items-center justify-center">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  </div>
                  <span className="text-gray-300">Enterprise support</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={handlePrevious}
              className="text-blue-600 hover:text-blue-800 underline"
            >
              ← Back to recommendations
            </button>
          </div>
        </div>
      </div>
    )
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
            onUpdate={updateFeature}
          />
        )
      case 5:
        const recommendation = recommendPlan(wizardAnswers)
        return <Step5Recommendation recommendation={recommendation} />
      case 6:
        return (
          <Step6Workspace
            workspaceAnswers={workspaceAnswers}
            onUpdate={updateWorkspaceAnswer}
          />
        )
      default:
        return null
    }
  }

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "What type of site are you building?"
      case 2:
        return "How much traffic do you expect?"
      case 3:
        return "How often will you update content?"
      case 4:
        return "Do you need any of these features?"
      case 5:
        return "Here's what we recommend"
      case 6:
        return "How many people will use Webflow?"
      default:
        return ""
    }
  }

  const getStepDescription = () => {
    switch (currentStep) {
      case 1:
        return "This helps us understand your site's requirements and recommend the best plan."
      case 2:
        return "We'll use this to calculate bandwidth and performance needs."
      case 3:
        return "This affects CMS requirements and compute resources."
      case 4:
        return "Select any advanced features you need for your site."
      case 5:
        return "Based on your answers, here's the best plan and add-ons for your needs."
      case 6:
        return "Tell us about your team size and collaboration needs for workspace pricing."
      default:
        return ""
    }
  }

  return (
    <WizardStep
      currentStep={currentStep}
      totalSteps={6}
      onNext={handleNext}
      onPrevious={handlePrevious}
      nextDisabled={!getStepValidation()}
    >
      {renderStep()}
    </WizardStep>
  )
}
