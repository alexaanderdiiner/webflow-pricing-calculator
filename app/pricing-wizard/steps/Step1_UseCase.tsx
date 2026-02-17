import React from 'react'

import { Globe, BookOpen, User, HelpCircle } from 'lucide-react'

interface Step1Props {
  currentStep: number
  totalSteps: number
  selectedUseCase: string
  onSelect: (useCase: string) => void
}

const useCases = [
  {
    id: 'marketing',
    title: 'Marketing Website',
    description: 'Company, landing pages, lead generation',
    icon: Globe,
  },
  {
    id: 'blog',
    title: 'Blog',
    description: 'Content publishing, articles, news sites',
    icon: BookOpen,
  },
  {
    id: 'portfolio',
    title: 'Portfolio',
    description: 'Showcase work, personal brand, creativity',
    icon: User,
  },
  {
    id: 'other',
    title: 'Other',
    description: 'Custom project, unique requirements',
    icon: HelpCircle,
  },
]

export default function Step1UseCase({ currentStep, totalSteps, selectedUseCase, onSelect }: Step1Props) {
  const progressPercentage = (currentStep / totalSteps) * 100

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <h1 className="font-display text-5xl font-bold text-gray-900">
          What type of site are you building?
        </h1>
        <p className="font-sans text-lg text-gray-600">
          This helps us understand your site's requirements and recommend the best plan.
        </p>
      </div>

      {/* Progress Bar - Appears after heading */}
      <div className="w-full bg-gray-300 rounded-full h-1.5 mb-12">
        <div
          className="bg-[#4353FF] h-1.5 rounded-full transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Grid of Options */}
      <div className="grid grid-cols-2 gap-6 max-w-4xl mx-auto">
        {useCases.map((useCase) => {
          const Icon = useCase.icon
          const isSelected = selectedUseCase === useCase.id

          return (
            <button
              key={useCase.id}
              className={`p-8 text-left border-2 rounded-xl space-y-4 transition-all duration-200 ${
                isSelected
                  ? 'bg-white border-[#4353FF] shadow-lg'
                  : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-md'
              }`}
              onClick={() => onSelect(useCase.id)}
            >
              <div className="flex items-start">
                <Icon className="h-10 w-10 text-[#4353FF]" />
              </div>
              <div className="space-y-2">
                <h3 className="font-display text-xl font-semibold text-gray-900">
                  {useCase.title}
                </h3>
                <p className="font-sans text-sm text-gray-600">
                  {useCase.description}
                </p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
