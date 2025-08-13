export type WorkspaceType = 'team' | 'freelancer';
export type TeamWorkspacePlan = 'Starter' | 'Core' | 'Growth' | 'Enterprise';
export type FreelancerWorkspacePlan = 'Starter' | 'Freelancer' | 'Agency';
export type SeatType = 'full' | 'limited' | 'free';
export type WorkspaceBillingCycle = 'Monthly' | 'Yearly';

export interface SeatPricing {
  full: number    // $39/mo for full design access
  limited: number // $15/mo for content editing
  free: number    // $0/mo for reviewers
}

export interface TeamWorkspacePlanData {
  monthly: number
  yearly: number
  guests: number
  features: string[]
  limitations?: string[]
}

export interface FreelancerWorkspacePlanData {
  monthly: number
  yearly: number
  stagingSites: number | 'unlimited'
  features: string[]
  limitations?: string[]
}

export interface WorkspaceAnswers {
  workspaceType: WorkspaceType
  teamSize: number
  needsGuests: boolean
  expectedGuests: number
  needsSSO: boolean
  needsAuditLogs: boolean
  needsAdvancedPermissions: boolean
  numberOfSites: number
  clientWork: boolean
  fullSeats: number
  limitedSeats: number
  freeSeats: number
}

export interface TeamWorkspaceRecommendation {
  plan: TeamWorkspacePlan
  rationale: string
  seats: {
    full: number
    limited: number
    free: number
  }
  features: string[]
  estimatedCost: {
    monthly: number
    yearly: number
  }
}

export interface FreelancerWorkspaceRecommendation {
  plan: FreelancerWorkspacePlan
  rationale: string
  features: string[]
  estimatedCost: {
    monthly: number
    yearly: number
  }
}

// Seat pricing for team workspaces
export const SEAT_PRICING: SeatPricing = {
  full: 39,    // Full access: design sites, manage admin
  limited: 15, // Limited access: edit content, build with components  
  free: 0      // Free access: reviewers and commenters
}

// Team workspace pricing data
export const TEAM_WORKSPACE_PRICING: Record<TeamWorkspacePlan, TeamWorkspacePlanData> = {
  Starter: {
    monthly: 0,
    yearly: 0,
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
      '10 staging sites',
      '300 pages per staged site',
      '50 CMS items per staged site',
      'Custom code',
      'Code export',
      'Shared Libraries'
    ]
  },
  Growth: {
    monthly: 49,
    yearly: 49 * 12 * 0.85, // 15% discount
    guests: 999,
    features: [
      'Unlimited seats',
      'Unlimited guests',
      'Advanced team permissions',
      'Unlimited staging sites',
      '300 pages per staged site', 
      '50 CMS items per staged site',
      'Custom code',
      'Site password protection',
      '301 redirects',
      'Site-specific access',
      'Site-level roles',
      'Publishing permissions',
      'Code export',
      'Shared Libraries'
    ]
  },
  Enterprise: {
    monthly: 0, // Custom pricing
    yearly: 0,  // Custom pricing
    guests: 999,
    features: [
      'Enterprise-ready scale',
      'Advanced collaboration',
      'Guaranteed SLA',
      'Enterprise security',
      'Customer success',
      'Enterprise support'
    ]
  }
}

// Freelancer/Agency workspace pricing data  
export const FREELANCER_WORKSPACE_PRICING: Record<FreelancerWorkspacePlan, FreelancerWorkspacePlanData> = {
  Starter: {
    monthly: 0,
    yearly: 0,
    stagingSites: 2,
    features: [
      '2 staging sites on webflow.io domains',
      '2 Agency/Freelancer guests',
      'Includes 1 full seat'
    ],
    limitations: [
      'Limited staging sites',
      'Basic collaboration only'
    ]
  },
  Freelancer: {
    monthly: 16,
    yearly: 16 * 12 * 0.85, // 15% discount
    stagingSites: 10,
    features: [
      '10 staging sites on webflow.io domains',
      'Free guest access in client Workspaces',
      'Includes 1 full seat',
      'Full CMS access on staging sites',
      'Client payments',
      'Shared Libraries'
    ]
  },
  Agency: {
    monthly: 35,
    yearly: 35 * 12 * 0.85, // 15% discount
    stagingSites: 'unlimited',
    features: [
      'Unlimited staging sites on webflow.io domains',
      'Free guest access in client Workspaces',
      'Includes 1 full seat',
      'Full CMS access on staging sites',
      'Client payments',
      'Advanced roles and permissions',
      'Shared Libraries'
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
