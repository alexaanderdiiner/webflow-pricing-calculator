import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Not Found</h2>
        <p className="text-gray-600">Could not find the requested resource.</p>
        <Link
          href="/pricing-wizard"
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Go to Pricing Wizard
        </Link>
      </div>
    </div>
  )
}

