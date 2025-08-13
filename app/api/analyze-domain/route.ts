import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

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

export async function POST(request: NextRequest) {
  try {
    const { domain } = await request.json()

    if (!domain) {
      return NextResponse.json(
        { error: 'Domain is required' },
        { status: 400 }
      )
    }

    // Clean and validate the domain
    const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/\/$/, '')
    
    // First check if the domain is on Webflow
    const webflowCheck = await checkIfOnWebflow(cleanDomain)
    
    // Analyze domain using real OpenAI GPT API
    const analysis = await analyzeDomainWithGPT(cleanDomain, webflowCheck)

    return NextResponse.json(analysis)
  } catch (error) {
    console.error('Domain analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze domain' },
      { status: 500 }
    )
  }
}

async function checkIfOnWebflow(domain: string): Promise<{ isOnWebflow: boolean; indicators: string[] }> {
  try {
    // Try both http and https
    const urls = [`https://${domain}`, `http://${domain}`]
    
    for (const url of urls) {
      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; WebflowChecker/1.0)',
          },
          // Don't follow redirects indefinitely
          redirect: 'follow',
          // Timeout after 10 seconds
          signal: AbortSignal.timeout(10000),
        })

        if (response.ok) {
          const html = await response.text()
          const headers = Object.fromEntries(response.headers.entries())
          
          const indicators = []
          
          // Check for common Webflow indicators
          if (html.includes('webflow.js') || html.includes('webflow.io')) {
            indicators.push('Webflow JavaScript detected')
          }
          
          if (html.includes('data-wf-page') || html.includes('data-wf-site')) {
            indicators.push('Webflow data attributes found')
          }
          
          if (html.includes('<meta name="generator" content="Webflow"')) {
            indicators.push('Webflow meta generator tag')
          }
          
          if (html.includes('.webflow.io') || html.includes('webflow-style')) {
            indicators.push('Webflow CSS/assets detected')
          }
          
          if (headers['server']?.includes('Webflow') || headers['x-powered-by']?.includes('Webflow')) {
            indicators.push('Webflow server headers')
          }
          
          // Check for Webflow hosting patterns
          if (html.includes('assets.website-files.com') || html.includes('uploads-ssl.webflow.com')) {
            indicators.push('Webflow asset hosting detected')
          }
          
          return {
            isOnWebflow: indicators.length > 0,
            indicators
          }
        }
      } catch (error) {
        // Try next URL
        continue
      }
    }
    
    return { isOnWebflow: false, indicators: [] }
  } catch (error) {
    console.error('Error checking Webflow status:', error)
    return { isOnWebflow: false, indicators: [] }
  }
}

async function analyzeDomainWithMockGPT(domain: string, webflowCheck?: { isOnWebflow: boolean; indicators: string[] }): Promise<DomainAnalysis> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000))

  // Mock analysis based on domain patterns
  let websiteType: DomainAnalysis['websiteType'] = 'marketing'
  let industry = 'Technology'
  let trafficTier: DomainAnalysis['trafficTier'] = 'medium'
  let estimatedVisitors = 25000
  
  const suggestedAddOns = {
    optimize: false,
    analyze: false,
    localization: false,
  }

  // Analyze domain for patterns
  const domainLower = domain.toLowerCase()

  // Website type detection
  if (domainLower.includes('blog') || domainLower.includes('news') || domainLower.includes('medium')) {
    websiteType = 'blog'
    industry = 'Media & Publishing'
    suggestedAddOns.analyze = true
  } else if (domainLower.includes('shop') || domainLower.includes('store') || domainLower.includes('buy') || domainLower.includes('cart')) {
    websiteType = 'ecommerce'
    industry = 'E-commerce'
    estimatedVisitors = 50000
    trafficTier = 'high'
    suggestedAddOns.optimize = true
    suggestedAddOns.analyze = true
    suggestedAddOns.localization = true
  } else if (domainLower.includes('app') || domainLower.includes('saas') || domainLower.includes('api') || domainLower.includes('platform')) {
    websiteType = 'saas'
    industry = 'Software & Technology'
    estimatedVisitors = 75000
    trafficTier = 'high'
    suggestedAddOns.optimize = true
    suggestedAddOns.analyze = true
  } else if (domainLower.includes('portfolio') || domainLower.includes('design') || domainLower.includes('creative')) {
    websiteType = 'portfolio'
    industry = 'Design & Creative'
    estimatedVisitors = 5000
    trafficTier = 'low'
  }

  // Industry detection patterns
  if (domainLower.includes('health') || domainLower.includes('medical') || domainLower.includes('clinic')) {
    industry = 'Healthcare'
  } else if (domainLower.includes('finance') || domainLower.includes('bank') || domainLower.includes('invest')) {
    industry = 'Financial Services'
  } else if (domainLower.includes('edu') || domainLower.includes('school') || domainLower.includes('university')) {
    industry = 'Education'
    suggestedAddOns.localization = true
  } else if (domainLower.includes('travel') || domainLower.includes('hotel') || domainLower.includes('booking')) {
    industry = 'Travel & Hospitality'
    suggestedAddOns.localization = true
    suggestedAddOns.optimize = true
  } else if (domainLower.includes('food') || domainLower.includes('restaurant') || domainLower.includes('recipe')) {
    industry = 'Food & Beverage'
  } else if (domainLower.includes('real') || domainLower.includes('property') || domainLower.includes('estate')) {
    industry = 'Real Estate'
    suggestedAddOns.optimize = true
  }

  // Global/international indicators
  if (domainLower.includes('global') || domainLower.includes('international') || domainLower.includes('world')) {
    suggestedAddOns.localization = true
  }

  // High-traffic indicators
  if (domainLower.includes('enterprise') || domainLower.includes('corp') || domainLower.includes('inc')) {
    trafficTier = 'enterprise'
    estimatedVisitors = 150000
    suggestedAddOns.optimize = true
    suggestedAddOns.analyze = true
  }

  // Calculate confidence based on how many patterns we matched
  let confidence = 75 // Base confidence
  if (websiteType !== 'marketing') confidence += 10 // We detected a specific type
  if (Object.values(suggestedAddOns).some(v => v)) confidence += 10 // We suggested add-ons
  if (industry !== 'Technology') confidence += 5 // We detected a specific industry

      return {
      websiteType,
      industry,
      trafficTier,
      estimatedVisitors,
      suggestedAddOns,
      confidence: Math.min(confidence, 95), // Cap at 95%
      isOnWebflow: webflowCheck?.isOnWebflow || false,
      webflowIndicators: webflowCheck?.indicators || [],
    }
}

async function analyzeDomainWithGPT(domain: string, webflowCheck?: { isOnWebflow: boolean; indicators: string[] }): Promise<DomainAnalysis> {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })

  const webflowStatus = webflowCheck?.isOnWebflow ? `IMPORTANT: This site is already running on Webflow (indicators: ${webflowCheck.indicators.join(', ')})` : 'This site is not currently on Webflow'

  const prompt = `Analyze the website domain "${domain}" and provide a JSON response with the following structure:

${webflowStatus}

{
  "websiteType": "marketing|blog|portfolio|saas|ecommerce|other",
  "industry": "string (industry name)",
  "trafficTier": "low|medium|high|enterprise",
  "estimatedVisitors": number (monthly visitors estimate),
  "suggestedAddOns": {
    "optimize": boolean (A/B testing needs),
    "analyze": boolean (analytics needs),
    "localization": boolean (multi-language needs)
  },
  "confidence": number (0-100, your confidence in this analysis)
}

Consider:
- Domain name patterns and keywords
- Likely website purpose and target audience
- Expected traffic levels for this type of site
- Whether they'd benefit from A/B testing (optimize)
- Whether they'd need detailed analytics (analyze)
- Whether they might serve international audiences (localization)

Be realistic with traffic estimates:
- low (< 10K monthly): personal sites, small portfolios
- medium (10K-50K): established blogs, small business sites
- high (50K-100K): successful businesses, popular content sites
- enterprise (100K+): major brands, high-traffic platforms

Respond only with valid JSON.`

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 500,
    })

    const content = response.choices[0]?.message?.content
    if (!content) {
      throw new Error('No response from GPT')
    }

    // Parse and validate the JSON response, handling markdown code blocks
    let jsonContent = content.trim()
    
    // Remove markdown code blocks if present
    if (jsonContent.startsWith('```json')) {
      jsonContent = jsonContent.replace(/^```json\s*/, '').replace(/\s*```$/, '')
    } else if (jsonContent.startsWith('```')) {
      jsonContent = jsonContent.replace(/^```\s*/, '').replace(/\s*```$/, '')
    }
    
    const analysis = JSON.parse(jsonContent)
    
    // Ensure all required fields are present with fallbacks
          return {
        websiteType: analysis.websiteType || 'marketing',
        industry: analysis.industry || 'Technology',
        trafficTier: analysis.trafficTier || 'medium',
        estimatedVisitors: analysis.estimatedVisitors || 25000,
        suggestedAddOns: {
          optimize: Boolean(analysis.suggestedAddOns?.optimize),
          analyze: Boolean(analysis.suggestedAddOns?.analyze),
          localization: Boolean(analysis.suggestedAddOns?.localization),
        },
        confidence: Math.min(Math.max(analysis.confidence || 75, 0), 100),
        isOnWebflow: webflowCheck?.isOnWebflow || false,
        webflowIndicators: webflowCheck?.indicators || [],
      }
  } catch (error) {
    console.error('OpenAI API error:', error)
    
    // Fallback to mock analysis if API fails
    return await analyzeDomainWithMockGPT(domain, webflowCheck)
  }
} 