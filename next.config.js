/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable standalone mode for production builds (required for Webflow deployment)
  // But disable it for local development to avoid build complexity
  ...(process.env.NODE_ENV === 'production' && {
    output: 'standalone',
  }),
  
  // Use basePath only for production deployment to Webflow
  // In local development, disable basePath for cleaner local URLs
  ...(process.env.NODE_ENV === 'production' && !process.env.DISABLE_BASEPATH && {
    basePath: '/pricing-exp',          
    assetPrefix: '/pricing-exp',
  }),
  
  // Exclude the pricing-exp directory from the build
  experimental: {
    outputFileTracingExcludes: {
      '*': ['./pricing-exp/**/*'],
    },
  },
  
  // App directory is enabled by default in Next.js 13+
  trailingSlash: false
}

module.exports = nextConfig 