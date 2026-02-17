import type { Metadata } from 'next'
import '@/styles/globals.css'
import WebflowHeader from './components/WebflowHeader'

export const metadata: Metadata = {
  title: 'Webflow Pricing Calculator',
  description: 'Calculate your Webflow hosting costs with our interactive pricing wizard',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <WebflowHeader />
        {children}
      </body>
    </html>
  )
}
