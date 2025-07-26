export type WorkspacePlan = 'Free' | 'Core' | 'Growth' | 'Enterprise';
export type WorkspaceBillingCycle = 'Monthly' | 'Yearly';

export interface WorkspacePlanData {
  monthly: number
  yearly: number
  maxSeats?: number
  guests: number
  features: string[]
  limitations?: string[]
}

export interface WorkspaceAnswers {
  teamSize: number
  needsGuests: boolean
  expectedGuests: number
  needsSSO: boolean
  needsAuditLogs: boolean
  needsAdvancedPermissions: boolean
  numberOfSites: number
}

export interface WorkspaceRecommendation {
  plan: WorkspacePlan
  rationale: string
  recommendedSeats: number
  features: string[]
  estimatedCost: {
    monthly: number
    yearly: number
  }
}

// Workspace pricing data
export const WORKSPACE_PRICING: Record<WorkspacePlan, WorkspacePlanData> = {
  Free: {
    monthly: 0,
    yearly: 0,
    maxSeats: 1,
    guests: 0,
    features: [
      '1 seat included',
      '2 unhosted sites',
      'Basic design tools',
      'Community support'
    ],
    limitations: [
      'No guest access',
      'Limited to 2 unhosted sites',
      'No advanced permissions'
    ]
  },
  Core: {
    monthly: 19,
    yearly: 19 * 12 * 0.85, // 15% discount
    guests: 3,
    features: [
      'Unlimited seats',
      '3 guests per workspace',
      'Basic team permissions',
      'Email support',
      'Site transfer',
      'Client billing'
    ]
  },
  Growth: {
    monthly: 49,
    yearly: 49 * 12 * 0.85, // 15% discount
    guests: 10,
    features: [
      'Everything in Core',
      '10 guests per workspace',
      'Advanced team permissions',
      'Priority support',
      'Advanced site settings',
      'White-label client billing'
    ]
  },
  Enterprise: {
    monthly: 0, // Custom pricing
    yearly: 0, // Custom pricing
    guests: -1, // Unlimited
    features: [
      'Everything in Growth',
      'Unlimited guests',
      'Single Sign-On (SSO)',
      'Audit logs',
      'Advanced security',
      'Custom permissions',
      'Dedicated support',
      'SLA guarantee'
    ]
  }
}

export const WORKSPACE_FEATURES = {
  sso: 'Single Sign-On (SSO)',
  auditLogs: 'Audit logs and compliance',
  advancedPermissions: 'Custom team permissions',
  guestAccess: 'Guest collaborator access',
  clientBilling: 'Client billing and transfer',
  whiteLabel: 'White-label client experience'
}
