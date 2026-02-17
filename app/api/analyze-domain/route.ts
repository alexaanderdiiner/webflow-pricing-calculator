import { NextRequest, NextResponse } from 'next/server'
import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime'

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
  reasoning?: string
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

    // Analyze domain using Claude via AWS Bedrock
    const analysis = await analyzeDomainWithBedrock(cleanDomain, webflowCheck)

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

async function analyzeDomainWithBedrock(domain: string, webflowCheck?: { isOnWebflow: boolean; indicators: string[] }): Promise<DomainAnalysis> {
  // Initialize AWS Bedrock Runtime client
  // AWS SDK automatically uses AWS_PROFILE and AWS_REGION from environment
  const bedrockClient = new BedrockRuntimeClient({
    region: process.env.AWS_REGION || 'us-west-2',
  })

  const webflowStatus = webflowCheck?.isOnWebflow
    ? `IMPORTANT: This site is already running on Webflow (indicators: ${webflowCheck.indicators.join(', ')}). Consider this when making recommendations.`
    : 'This site is not currently on Webflow. Consider migration benefits in your analysis.'

  const prompt = `You are an expert Webflow pricing consultant. Analyze the website domain "${domain}" and provide intelligent recommendations for the perfect Webflow hosting plan.

${webflowStatus}

Based on the domain name, keywords, and patterns, provide a detailed analysis in JSON format:

{
  "websiteType": "marketing|blog|portfolio|saas|ecommerce|other",
  "industry": "string (specific industry name)",
  "trafficTier": "low|medium|high|enterprise",
  "estimatedVisitors": number (monthly visitors estimate),
  "suggestedAddOns": {
    "optimize": boolean (needs A/B testing and personalization),
    "analyze": boolean (needs advanced analytics),
    "localization": boolean (needs multi-language support)
  },
  "confidence": number (0-100, your confidence in this analysis),
  "reasoning": "string (brief explanation of your analysis and recommendations)"
}

Analysis Guidelines:

**Website Type Detection:**
- "marketing": Corporate sites, landing pages, company websites, lead generation
- "blog": Content-focused sites, news sites, publishing platforms
- "portfolio": Designer portfolios, creative showcases, personal brands
- "saas": Software applications, platforms, app marketing sites
- "ecommerce": Online stores, product catalogs, shopping sites
- "other": Government, education, non-profit, or mixed-purpose sites

**Industry Analysis:**
- Look for industry-specific keywords in the domain
- Be specific (e.g., "Financial Technology" not just "Technology")
- Consider regulatory industries (Healthcare, Finance) that may need enterprise features

**Traffic Estimation:**
- "low" (< 10K monthly): Personal sites, small portfolios, early startups
- "medium" (10K-50K): Established small businesses, active blogs, growing companies
- "high" (50K-100K): Successful businesses, popular content sites, established brands
- "enterprise" (100K+): Major brands, high-traffic platforms, large organizations
- Consider domain authority signals (well-known companies should be "high" or "enterprise")

**Add-on Recommendations:**

1. **Optimize (A/B testing):** Recommend if:
   - Ecommerce or SaaS (conversion optimization critical)
   - High-traffic sites that benefit from testing
   - Marketing-focused sites with conversion goals
   - Enterprise-level traffic

2. **Analyze (Advanced analytics):** Recommend if:
   - Medium to enterprise traffic levels
   - Data-driven businesses (SaaS, ecommerce)
   - Content sites that need audience insights
   - Professional businesses needing detailed metrics

3. **Localization (Multi-language):** Recommend if:
   - Domain suggests international presence (global, international, world)
   - Travel, hospitality, or international business
   - Ecommerce with potential international customers
   - Enterprise companies serving multiple regions
   - Domain has country codes or regional indicators

**Confidence Scoring:**
- Start with base confidence of 75%
- Add 5-10% for clear industry indicators in domain
- Add 10% for obvious website type (shop, blog, app, portfolio in domain)
- Add 5% for well-known brand/company
- Reduce 10-20% for generic or ambiguous domains

**Reasoning:**
Provide a 1-2 sentence explanation of why you chose this plan and add-ons. Focus on the business value and how the recommendations match their likely needs.

Respond ONLY with valid JSON. No markdown formatting, no code blocks, just pure JSON.`

  try {
    // Claude 3.5 Sonnet model ID for AWS Bedrock
    const modelId = 'anthropic.claude-3-5-sonnet-20241022-v2:0'

    // Prepare the request body for Bedrock
    const requestBody = {
      anthropic_version: 'bedrock-2023-05-31',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    }

    // Create the InvokeModel command
    const command = new InvokeModelCommand({
      modelId,
      body: JSON.stringify(requestBody)
    })

    // Invoke the model
    const response = await bedrockClient.send(command)

    // Decode and parse the response
    const responseBody = JSON.parse(new TextDecoder().decode(response.body))

    // Extract the text content from Claude's response
    const content = responseBody.content[0]
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Claude')
    }

    const analysisText = content.text.trim()

    // Parse the JSON response
    const analysis = JSON.parse(analysisText)

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
      reasoning: analysis.reasoning || 'Based on domain analysis',
    }
  } catch (error) {
    console.error('AWS Bedrock error:', error)

    // Provide helpful error messages for common AWS issues
    if (error instanceof Error) {
      if (error.name === 'AccessDeniedException') {
        console.error('AWS Access Denied: Make sure you are logged in with AWS SSO (aws sso login --profile bedrock)')
      } else if (error.name === 'ResourceNotFoundException') {
        console.error('Model not found: Claude 3.5 Sonnet may not be available in your region')
      } else if (error.name === 'ThrottlingException') {
        console.error('Rate limited: Too many requests to AWS Bedrock')
      }
    }

    // Fallback to pattern-based analysis if Bedrock fails
    return fallbackAnalysis(domain, webflowCheck)
  }
}

function fallbackAnalysis(domain: string, webflowCheck?: { isOnWebflow: boolean; indicators: string[] }): DomainAnalysis {
  // Pattern-based analysis as fallback
  let websiteType: DomainAnalysis['websiteType'] = 'marketing'
  let industry = 'Technology'
  let trafficTier: DomainAnalysis['trafficTier'] = 'medium'
  let estimatedVisitors = 25000

  const suggestedAddOns = {
    optimize: false,
    analyze: false,
    localization: false,
  }

  const domainLower = domain.toLowerCase()

  // Website type detection
  if (domainLower.includes('blog') || domainLower.includes('news')) {
    websiteType = 'blog'
    industry = 'Media & Publishing'
    suggestedAddOns.analyze = true
  } else if (domainLower.includes('shop') || domainLower.includes('store') || domainLower.includes('ecommerce')) {
    websiteType = 'ecommerce'
    industry = 'E-commerce'
    estimatedVisitors = 50000
    trafficTier = 'high'
    suggestedAddOns.optimize = true
    suggestedAddOns.analyze = true
  } else if (domainLower.includes('app') || domainLower.includes('saas') || domainLower.includes('platform')) {
    websiteType = 'saas'
    industry = 'Software & Technology'
    estimatedVisitors = 75000
    trafficTier = 'high'
    suggestedAddOns.optimize = true
    suggestedAddOns.analyze = true
  } else if (domainLower.includes('portfolio') || domainLower.includes('design')) {
    websiteType = 'portfolio'
    industry = 'Design & Creative'
    estimatedVisitors = 5000
    trafficTier = 'low'
  }

  // Industry detection
  if (domainLower.includes('health') || domainLower.includes('medical')) {
    industry = 'Healthcare'
  } else if (domainLower.includes('finance') || domainLower.includes('bank')) {
    industry = 'Financial Services'
  } else if (domainLower.includes('edu') || domainLower.includes('school')) {
    industry = 'Education'
    suggestedAddOns.localization = true
  }

  // International indicators
  if (domainLower.includes('global') || domainLower.includes('international')) {
    suggestedAddOns.localization = true
  }

  // Enterprise indicators
  if (domainLower.includes('enterprise') || domainLower.includes('corp')) {
    trafficTier = 'enterprise'
    estimatedVisitors = 150000
    suggestedAddOns.optimize = true
    suggestedAddOns.analyze = true
  }

  return {
    websiteType,
    industry,
    trafficTier,
    estimatedVisitors,
    suggestedAddOns,
    confidence: 70,
    isOnWebflow: webflowCheck?.isOnWebflow || false,
    webflowIndicators: webflowCheck?.indicators || [],
    reasoning: 'Analysis based on domain patterns (Bedrock API fallback)',
  }
}
