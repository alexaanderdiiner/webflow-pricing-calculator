'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { HelpCircle, Loader2, ArrowRight } from 'lucide-react'

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
        <div className="mb-12">
          <h1 className="text-7xl font-display font-bold text-gray-900 mb-8">
            Our pricing
          </h1>
          <h2 className="text-4xl font-display font-bold text-gray-900 mb-4">
            Personalized pricing
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Domain Analysis */}
          <Card className="bg-gradient-to-br from-gray-900 via-orange-700 to-purple-600 border-none text-white">
            <CardContent className="p-8">
              <div className="space-y-6">
                <div className="space-y-4">
                  <h2 className="text-2xl font-display font-bold text-white">
                    Based on your current website
                  </h2>
                  <p className="text-white/90">
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
                        className="bg-black/30 border-white/20 text-white placeholder:text-white/60 focus:border-white/40 h-12"
                        disabled={isAnalyzing}
                      />
                      <Button
                        onClick={handleAnalyzeDomain}
                        disabled={!url.trim() || !email.trim() || isAnalyzing}
                        className="bg-white text-gray-900 hover:bg-gray-100 px-8 h-12 font-medium"
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
                          className="bg-black/30 border-white/20 text-white placeholder:text-white/60 focus:border-white/40 h-12"
                          disabled={isAnalyzing}
                        />
                      </div>
                    )}
                  </div>

                  <p className="text-sm text-white/70">
                    We will analyze your domain <span className="text-orange-300">(industry, website type, estimated traffic etc.)</span> to recommend you the best options. We do not keep these information.
                  </p>

                  {domainError && (
                    <div className="p-3 bg-red-900/50 border border-red-500/50 rounded-md">
                      <p className="text-red-200 text-sm">{domainError}</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Right Column - Use Case Selection */}
          <Card className="bg-white border-gray-200">
            <CardContent className="p-8">
              <div className="space-y-6">
                <div className="space-y-4">
                  <h2 className="text-2xl font-display font-bold text-gray-900">
                    Based on your needs
                  </h2>
                  <p className="text-gray-600">
                    We'll recommend you the best plans and add-ons based on your requirements
                  </p>
                </div>

                <div className="space-y-4">
                  <button
                    onClick={() => handleUseCaseSelect('marketing')}
                    className="w-full flex items-center justify-between py-4 border-b border-gray-200 hover:border-[#4353FF] transition-colors duration-200 group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-[#4353FF] font-medium group-hover:underline">
                        Marketing website
                      </span>
                      <HelpCircle className="w-4 h-4 text-gray-400" />
                    </div>
                    <ArrowRight className="w-5 h-5 text-[#4353FF]" />
                  </button>

                  <button
                    onClick={() => handleUseCaseSelect('blog')}
                    className="w-full flex items-center justify-between py-4 border-b border-gray-200 hover:border-[#4353FF] transition-colors duration-200 group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-[#4353FF] font-medium group-hover:underline">
                        Blog
                      </span>
                      <HelpCircle className="w-4 h-4 text-gray-400" />
                    </div>
                    <ArrowRight className="w-5 h-5 text-[#4353FF]" />
                  </button>

                  <button
                    onClick={() => handleUseCaseSelect('portfolio')}
                    className="w-full flex items-center justify-between py-4 border-b border-gray-200 hover:border-[#4353FF] transition-colors duration-200 group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-[#4353FF] font-medium group-hover:underline">
                        Portfolio
                      </span>
                      <HelpCircle className="w-4 h-4 text-gray-400" />
                    </div>
                    <ArrowRight className="w-5 h-5 text-[#4353FF]" />
                  </button>

                  <button
                    onClick={() => handleUseCaseSelect('other')}
                    className="w-full flex items-center justify-between py-4 border-b border-gray-200 hover:border-[#4353FF] transition-colors duration-200 group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-[#4353FF] font-medium group-hover:underline">
                        Other
                      </span>
                      <span className="text-gray-500 text-sm">(custom projects, unique requirements)</span>
                    </div>
                    <ArrowRight className="w-5 h-5 text-[#4353FF]" />
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}