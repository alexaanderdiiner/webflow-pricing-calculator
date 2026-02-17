'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'

export default function WebflowHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="w-full bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Navigation */}
          <div className="flex items-center space-x-8">
            {/* Webflow Logo */}
            <Link href="https://webflow.com" className="flex items-center space-x-2">
              <svg className="w-8 h-8 text-[#4353FF]" viewBox="0 0 200 200" fill="currentColor">
                <path d="M148.5 0C171.2 0 189.7 18.5 189.7 41.2V158.8C189.7 181.5 171.2 200 148.5 200H41.2C18.5 200 0 181.5 0 158.8V41.2C0 18.5 18.5 0 41.2 0H148.5ZM155.3 60L130.8 140H109.9L97.8 97.9L79.3 140H58.4L44.7 60H64.3L72.7 116.7L94.1 60H107.8L116.5 116.2L138.1 60H155.3Z" />
              </svg>
              <span className="text-xl font-semibold text-gray-900">Webflow</span>
            </Link>

            {/* Navigation Links - Desktop */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="https://webflow.com/platform" className="text-sm text-gray-700 hover:text-gray-900 transition-colors">
                Platform
              </Link>
              <Link href="https://webflow.com/solutions" className="text-sm text-gray-700 hover:text-gray-900 transition-colors">
                Solutions
              </Link>
              <Link href="https://webflow.com/resources" className="text-sm text-gray-700 hover:text-gray-900 transition-colors">
                Resources
              </Link>
              <Link href="https://webflow.com/enterprise" className="text-sm text-gray-700 hover:text-gray-900 transition-colors">
                Enterprise
              </Link>
              <Link href="https://webflow.com/pricing" className="text-sm text-gray-700 hover:text-gray-900 transition-colors">
                Pricing
              </Link>
            </nav>
          </div>

          {/* Right Side CTAs - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="https://webflow.com/contact-sales"
              className="text-sm text-gray-700 hover:text-gray-900 transition-colors"
            >
              Talk to sales
            </Link>
            <Link
              href="https://webflow.com/dashboard/login"
              className="text-sm text-gray-700 hover:text-gray-900 transition-colors"
            >
              Login
            </Link>
            <Button
              asChild
              className="bg-[#4353FF] hover:bg-[#3142E6] text-white font-medium transition-colors"
            >
              <Link href="https://webflow.com/dashboard/signup">
                Get started – it's free
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              <Link
                href="https://webflow.com/platform"
                className="text-base text-gray-700 hover:text-gray-900 hover:bg-gray-50 px-3 py-2 rounded-md transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Platform
              </Link>
              <Link
                href="https://webflow.com/solutions"
                className="text-base text-gray-700 hover:text-gray-900 hover:bg-gray-50 px-3 py-2 rounded-md transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Solutions
              </Link>
              <Link
                href="https://webflow.com/resources"
                className="text-base text-gray-700 hover:text-gray-900 hover:bg-gray-50 px-3 py-2 rounded-md transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Resources
              </Link>
              <Link
                href="https://webflow.com/enterprise"
                className="text-base text-gray-700 hover:text-gray-900 hover:bg-gray-50 px-3 py-2 rounded-md transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Enterprise
              </Link>
              <Link
                href="https://webflow.com/pricing"
                className="text-base text-gray-700 hover:text-gray-900 hover:bg-gray-50 px-3 py-2 rounded-md transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </Link>
              <div className="border-t border-gray-200 pt-4 mt-4 space-y-3">
                <Link
                  href="https://webflow.com/contact-sales"
                  className="block text-base text-gray-700 hover:text-gray-900 hover:bg-gray-50 px-3 py-2 rounded-md transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Talk to sales
                </Link>
                <Link
                  href="https://webflow.com/dashboard/login"
                  className="block text-base text-gray-700 hover:text-gray-900 hover:bg-gray-50 px-3 py-2 rounded-md transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Button
                  asChild
                  className="w-full bg-[#4353FF] hover:bg-[#3142E6] text-white font-medium transition-colors"
                >
                  <Link href="https://webflow.com/dashboard/signup" onClick={() => setMobileMenuOpen(false)}>
                    Get started – it's free
                  </Link>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
