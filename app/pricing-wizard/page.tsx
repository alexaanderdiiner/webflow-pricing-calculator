'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Globe, BookOpen, User, HelpCircle, Loader2, ArrowRight } from 'lucide-react'

interface DomainAnalysis {
  websiteType: 'marketing' | 'blog' | 'portfolio' | 'saas' | 'ecommerce' | 'other'
  industry: string
  trafficTier: 'low' | 'medium' | 'high' | 'enterprise'
  estimatedVisitors: number
  suggestedAddOns: {
    optimize: boolean
    analyze: boolean
    localization: boolean
  }
  confidence: number
  isOnWebflow: boolean
  webflowIndicators?: string[]
}

const useCases = [
  {
    id: 'marketing',
    title: 'Marketing website',
    icon: Globe,
  },
  {
    id: 'blog',
    title: 'Blog',
    icon: BookOpen,
  },
  {
    id: 'portfolio',
    title: 'Portfolio',
    icon: User,
  },
  {
    id: 'other',
    title: 'Other',
    description: '(custom projects, unique requirements)',
    icon: HelpCircle,
  },
]

export default function PricingWizard() {
  const router = useRouter()
  const [url, setUrl] = useState('')
  const [email, setEmail] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [domainError, setDomainError] = useState<string | null>(null)

  const handleAnalyzeDomain = async () => {
    console.log('🔥 handleAnalyzeDomain called! URL:', url, 'Email:', email)
    if (!url.trim()) return

    setIsAnalyzing(true)
    setDomainError(null)
    
    try {
      const response = await fetch('/api/analyze-domain', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ domain: url }),
      })

      if (!response.ok) {
        throw new Error('Failed to analyze domain')
      }

      const analysis: DomainAnalysis = await response.json()
      
      // Navigate to result page with domain analysis data
      const params = new URLSearchParams({
        source: 'domain',
        domain: url,
        email: email,
        websiteType: analysis.websiteType,
        industry: analysis.industry,
        trafficTier: analysis.trafficTier,
        estimatedVisitors: analysis.estimatedVisitors.toString(),
        optimize: analysis.suggestedAddOns.optimize.toString(),
        analyze: analysis.suggestedAddOns.analyze.toString(),
        localization: analysis.suggestedAddOns.localization.toString(),
        confidence: analysis.confidence.toString(),
        isOnWebflow: analysis.isOnWebflow.toString(),
        ...(analysis.webflowIndicators && { webflowIndicators: analysis.webflowIndicators.join(',') })
      })
      
      router.push(`/pricing-wizard/result?${params.toString()}`)
    } catch (err) {
      setDomainError(err instanceof Error ? err.message : 'An error occurred while analyzing your domain')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleUseCaseSelect = (useCase: string) => {
    console.log('🚀 handleUseCaseSelect called! UseCase:', useCase)
    router.push(`/pricing-wizard/wizard?usecase=${useCase}`)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAnalyzeDomain()
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="w-full max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-display font-bold text-gray-900 mb-4">
            Find the right Webflow plan for you
          </h1>
          <p className="text-xl text-gray-600">
            Get personalized recommendations based on your website or needs
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Domain Analysis */}
          <Card className="bg-gray-100 border-gray-200">
            <CardContent className="p-8">
              <div className="space-y-6">
                <div className="space-y-4">
                  <h2 className="text-2xl font-display font-bold text-gray-900">
                    Based on your current website
                  </h2>
                  <p className="text-gray-600">
                    Enter your website URL and we'll analyze it to recommend the perfect Webflow plan.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <Input
                        type="url"
                        placeholder="Paste your website url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-gray-400"
                        disabled={isAnalyzing}
                      />
                      <Button
                        onClick={handleAnalyzeDomain}
                        disabled={!url.trim() || !email.trim() || isAnalyzing}
                        className="bg-gray-900 text-white hover:bg-gray-800 px-8"
                      >
                        {isAnalyzing ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Analyzing...
                          </>
                        ) : (
                          'Go'
                        )}
                      </Button>
                    </div>
                    
                    {/* Email field appears when user starts typing domain */}
                    {url.trim() && (
                      <div className="animate-in slide-in-from-top-2 duration-300">
                        <Input
                          type="email"
                          placeholder="Enter your email to get results"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-gray-400"
                          disabled={isAnalyzing}
                        />
                      </div>
                    )}
                  </div>

                  {domainError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                      <p className="text-red-700 text-sm">{domainError}</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Right Column - Use Case Selection */}
          <Card className="bg-gray-100 border-gray-200">
            <CardContent className="p-8">
              <div className="space-y-6">
                <div className="space-y-4">
                  <h2 className="text-2xl font-display font-bold text-gray-900">
                    Based on your needs
                  </h2>
                  <p className="text-gray-600">
                    Tell us what type of website you're building and we'll guide you through the process.
                  </p>
                </div>

                <div className="space-y-3">
                  {useCases.map((useCase) => {
                    const Icon = useCase.icon
                    return (
                      <button
                        key={useCase.id}
                        onClick={() => handleUseCaseSelect(useCase.id)}
                        className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-300 rounded-lg transition-all duration-200 group"
                      >
                        <div className="flex items-center space-x-4">
                          <Icon className="w-5 h-5 text-gray-600 group-hover:text-gray-900" />
                          <div className="text-left">
                            <div className="font-medium text-gray-900">
                              {useCase.title}
                            </div>
                            {useCase.description && (
                              <div className="text-sm text-gray-500">
                                {useCase.description}
                              </div>
                            )}
                          </div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                      </button>
                    )
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}