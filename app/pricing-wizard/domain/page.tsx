'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Loader2, Globe, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react'

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

function DomainAnalysisContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [url, setUrl] = useState('')
  const [email, setEmail] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<DomainAnalysis | null>(null)
  const [domainError, setDomainError] = useState<string | null>(null)

  // Auto-run analysis if domain is provided in URL
  useEffect(() => {
    const domain = searchParams?.get('domain')
    if (domain) {
      setUrl(domain)
      handleAnalyze(domain)
    }
  }, [searchParams])

  const handleAnalyze = async (domainToAnalyze?: string) => {
    const targetUrl = domainToAnalyze || url
    if (!targetUrl.trim()) return

    setIsAnalyzing(true)
    setDomainError(null)
    setAnalysis(null)
    
    try {
      const response = await fetch('/api/analyze-domain', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ domain: targetUrl }),
      })

      if (!response.ok) {
        throw new Error('Failed to analyze domain')
      }

      const result: DomainAnalysis = await response.json()
      setAnalysis(result)
    } catch (err) {
      setDomainError(err instanceof Error ? err.message : 'An error occurred while analyzing your domain')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleGetRecommendation = () => {
    if (!analysis) return

    // Pass all analysis data and user email to results page for lead capture
    const params = new URLSearchParams({
      source: 'domain',
      domain: url,
      email: email, // Used for lead generation and follow-up
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
  }

  const getTrafficLabel = (tier: string) => {
    switch (tier) {
      case 'low': return '< 10K monthly visitors'
      case 'medium': return '10K - 50K monthly visitors'
      case 'high': return '50K - 100K monthly visitors'
      case 'enterprise': return '100K+ monthly visitors'
      default: return 'Unknown traffic'
    }
  }

  const getTrafficColor = (tier: string) => {
    switch (tier) {
      case 'low': return 'bg-gray-100 text-gray-800'
      case 'medium': return 'bg-blue-100 text-blue-800'
      case 'high': return 'bg-purple-100 text-purple-800'
      case 'enterprise': return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isAnalyzing) {
      handleAnalyze()
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="w-full max-w-2xl mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push('/pricing-wizard')}
            className="text-[#4353FF] hover:text-[#3142E6] hover:bg-white/50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-block text-sm font-medium text-[#7C3AED] mb-4">
            Domain Analysis
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4">
            Analyze your current website
          </h1>
          <p className="text-base sm:text-lg text-gray-600">
            Enter your website URL and we'll analyze it to recommend the perfect Webflow plan
          </p>
        </div>

        <Card className="bg-white border-none shadow-md rounded-2xl">
          <CardContent className="p-8">

            {/* URL Input */}
            <div className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="url" className="text-sm font-semibold text-gray-900">
                  Your Website URL
                </Label>
                <Input
                  id="url"
                  type="url"
                  placeholder="http://www.example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="h-12 text-base border-gray-300"
                  disabled={isAnalyzing}
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="email" className="text-sm font-semibold text-gray-900">
                  Email address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="h-12 text-base border-gray-300"
                  disabled={isAnalyzing}
                />
              </div>

              <div className="pt-2">
                <Button
                  onClick={() => handleAnalyze()}
                  disabled={!url.trim() || !email.trim() || isAnalyzing}
                  className="w-full h-12 bg-[#4353FF] hover:bg-[#3142E6] text-white font-medium text-base"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    'Analyze Website'
                  )}
                </Button>
              </div>
            </div>

          </CardContent>
        </Card>

        {/* Error State */}
        {domainError && (
          <Card className="mt-6 bg-red-50 border-red-200">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <p className="text-red-700">{domainError}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {isAnalyzing && (
          <Card className="mt-6 bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                <p className="text-blue-700">Analyzing your website...</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Analysis Results */}
        {analysis && (
          <Card className="mt-6 bg-white border-none shadow-md rounded-2xl" role="region" aria-live="polite" aria-label="Analysis results">
            <CardContent className="p-8">
                  <div className="space-y-8">
                    {/* Header */}
                    <div className="text-center">
                      <div className="flex justify-center mb-4">
                        <CheckCircle className="w-12 h-12 text-green-500" />
                      </div>
                      <h2 className="text-xl sm:text-2xl font-display font-bold text-gray-900 mb-2">
                        Analysis Complete
                      </h2>
                      <p className="text-sm sm:text-base text-gray-600">
                        Here's what we found about your website
                      </p>
                    </div>

                    {/* Webflow Status */}
                    <div className="mb-8">
                      <div className={`p-6 rounded-lg border-2 transition-all ${
                        analysis.isOnWebflow 
                          ? 'bg-green-50 border-green-200' 
                          : 'bg-blue-50 border-blue-200'
                      }`}>
                        <div className="flex items-center space-x-3 mb-3">
                          <div className={`w-3 h-3 rounded-full ${
                            analysis.isOnWebflow ? 'bg-green-400' : 'bg-blue-400'
                          }`} />
                          <Label className="text-gray-900 font-semibold text-lg">
                            {analysis.isOnWebflow ? '✅ Already on Webflow!' : '🔍 Not on Webflow'}
                          </Label>
                        </div>
                        
                        {analysis.isOnWebflow ? (
                          <div className="space-y-2">
                            <p className="text-gray-700">
                              Great news! This website is already using Webflow.
                            </p>
                            {analysis.webflowIndicators && analysis.webflowIndicators.length > 0 && (
                              <div className="mt-3">
                                <p className="text-gray-600 text-sm mb-2">Detected indicators:</p>
                                <div className="flex flex-wrap gap-2">
                                  {analysis.webflowIndicators.map((indicator, index) => (
                                    <Badge key={index} variant="secondary" className="text-xs bg-green-100 text-green-800 border-green-200">
                                      {indicator}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <p className="text-gray-700">
                            This website could benefit from migrating to Webflow for better design flexibility and hosting.
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Analysis Results Grid */}
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Website Type */}
                      <div className="space-y-3">
                        <Label className="text-gray-900 font-medium">Website Type</Label>
                        <div className="p-4 bg-gray-100 rounded-lg">
                          <Badge variant="secondary" className="capitalize">
                            {analysis.websiteType}
                          </Badge>
                        </div>
                      </div>

                      {/* Industry */}
                      <div className="space-y-3">
                        <Label className="text-gray-900 font-medium">Industry</Label>
                        <div className="p-4 bg-gray-100 rounded-lg">
                          <span className="text-gray-900">{analysis.industry}</span>
                        </div>
                      </div>

                      {/* Traffic Tier */}
                      <div className="space-y-3">
                        <Label className="text-gray-900 font-medium">Estimated Traffic</Label>
                        <div className="p-4 bg-gray-100 rounded-lg">
                          <Badge className={getTrafficColor(analysis.trafficTier)}>
                            {getTrafficLabel(analysis.trafficTier)}
                          </Badge>
                        </div>
                      </div>

                      {/* Confidence */}
                      <div className="space-y-3">
                        <Label className="text-gray-900 font-medium">Analysis Confidence</Label>
                        <div className="p-4 bg-gray-100 rounded-lg">
                          <div className="flex items-center">
                            <div className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
                              <div 
                                className="h-2 bg-brand rounded-full transition-all duration-500"
                                style={{ width: `${analysis.confidence}%` }}
                              />
                            </div>
                            <span className="text-gray-900 font-medium">{analysis.confidence}%</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Suggested Add-ons */}
                    <div className="space-y-4">
                      <Label className="text-gray-900 font-medium">Suggested Add-ons</Label>
                      <div className="space-y-3">
                        {[
                          { key: 'optimize', label: 'Optimize', description: 'A/B testing and personalization', icon: '⚡' },
                          { key: 'analyze', label: 'Analyze', description: 'Advanced analytics and insights', icon: '📊' },
                          { key: 'localization', label: 'Localization', description: 'Multi-language support', icon: '🌍' },
                        ].map(({ key, label, description, icon }) => (
                          <div
                            key={key}
                            className={`p-4 rounded-lg border-2 transition-all ${
                              analysis.suggestedAddOns[key as keyof typeof analysis.suggestedAddOns]
                                ? 'bg-brand/10 border-brand/30'
                                : 'bg-gray-50 border-gray-200'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <span className="text-lg">{icon}</span>
                                <div>
                                  <div className="font-medium text-gray-900">{label}</div>
                                  <div className="text-sm text-gray-600">{description}</div>
                                </div>
                              </div>
                              {analysis.suggestedAddOns[key as keyof typeof analysis.suggestedAddOns] && (
                                <CheckCircle className="w-5 h-5 text-brand" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="text-center pt-4">
                      <Button
                        onClick={handleGetRecommendation}
                        size="lg"
                        className="bg-[#4353FF] hover:bg-[#3142E6] text-white font-medium px-8 py-3"
                      >
                        {analysis.isOnWebflow ? 'Optimize This Webflow Setup' : 'Get Custom Webflow Recommendation'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
      </div>
    </div>
  )
}

export default function DomainPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    }>
      <DomainAnalysisContent />
    </Suspense>
  )
}
