import React from 'react'

import { Globe, BookOpen, User, HelpCircle } from 'lucide-react'

interface Step1Props {
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

export default function Step1UseCase({ selectedUseCase, onSelect }: Step1Props) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <h2 className="font-display text-3xl font-bold text-gray-900">
          What type of site are you building?
        </h2>
        <p className="font-sans text-base text-gray-600">
          This helps us understand your site's requirements and recommend the best plan.
        </p>
      </div>



      {/* Grid of Options */}
      <div className="grid grid-cols-2 gap-8 p-4">
        {useCases.map((useCase) => {
          const Icon = useCase.icon
          const isSelected = selectedUseCase === useCase.id
          
          return (
            <button
              key={useCase.id}
              className={`w-full p-6 text-center border rounded-lg space-y-3 transition-all duration-200 group overflow-hidden ${
                isSelected 
                  ? 'bg-white text-gray-900 border-brand border-2 shadow-md' 
                  : 'bg-white text-gray-900 border-gray-200 hover:bg-brand hover:text-white hover:border-brand hover:shadow-lg'
              }`}
              onClick={() => onSelect(useCase.id)}
            >
                <div className="flex justify-center">
                  <Icon className={`h-8 w-8 transition-colors ${
                    isSelected 
                      ? 'text-brand' 
                      : 'text-gray-700 group-hover:text-white'
                  }`} />
                </div>
                <div className="space-y-2">
                  <h3 className={`font-display text-lg font-semibold transition-colors ${
                    isSelected 
                      ? 'text-gray-900' 
                      : 'text-gray-900 group-hover:text-white'
                  }`}>
                    {useCase.title}
                  </h3>
                  <p className={`font-sans text-sm transition-colors ${
                    isSelected 
                      ? 'text-gray-600' 
                      : 'text-gray-600 group-hover:text-white/90'
                  }`}>
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
