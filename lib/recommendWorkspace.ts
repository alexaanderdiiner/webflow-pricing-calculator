import { 
  WorkspaceType,
  TeamWorkspacePlan, 
  FreelancerWorkspacePlan,
  WorkspaceAnswers, 
  TeamWorkspaceRecommendation,
  FreelancerWorkspaceRecommendation,
  TEAM_WORKSPACE_PRICING,
  FREELANCER_WORKSPACE_PRICING,
  SEAT_PRICING,
  SeatType
} from './workspaceData'

// Determine workspace type based on user answers
export function determineWorkspaceType(answers: WorkspaceAnswers): WorkspaceType {
  // If explicitly set, use that
  if (answers.workspaceType) {
    return answers.workspaceType
  }

  // Heuristics to determine workspace type
  if (answers.clientWork || answers.numberOfSites > 5) {
    return 'freelancer'
  }

  // Default to team workspace for internal collaboration
  return 'team'
}

// Recommend team workspace plan
export function recommendTeamWorkspacePlan(answers: WorkspaceAnswers): TeamWorkspaceRecommendation {
  let recommendedPlan: TeamWorkspacePlan = 'Starter'
  let rationale = ''

  // Enterprise requirements
  if (answers.needsSSO || answers.needsAuditLogs) {
    recommendedPlan = 'Enterprise'
    rationale = 'Enterprise plan recommended for SSO, audit logs, and advanced security requirements.'
  }
  // Growth plan requirements
  else if (
    answers.teamSize > 5 || 
    answers.expectedGuests > 3 || 
    answers.needsAdvancedPermissions ||
    answers.numberOfSites > 10
  ) {
    recommendedPlan = 'Growth'
    rationale = 'Growth plan recommended for larger teams, unlimited staging sites, and advanced collaboration needs.'
  }
  // Core plan requirements
  else if (
    answers.teamSize > 1 || 
    answers.needsGuests || 
    answers.numberOfSites > 2
  ) {
    recommendedPlan = 'Core'
    rationale = 'Core plan recommended for team collaboration and enhanced staging capabilities.'
  }
  // Starter plan
  else {
    recommendedPlan = 'Starter'
    rationale = 'Starter plan is sufficient for individual use with basic hosting needs.'
  }

  const planData = TEAM_WORKSPACE_PRICING[recommendedPlan]
  
  // Recommend seat distribution
  const totalSeats = Math.max(1, answers.teamSize)
  const fullSeats = answers.fullSeats || Math.ceil(totalSeats * 0.6) // 60% full access
  const limitedSeats = answers.limitedSeats || Math.floor(totalSeats * 0.3) // 30% limited access
  const freeSeats = answers.freeSeats || Math.max(0, totalSeats - fullSeats - limitedSeats)

  const seats = {
    full: fullSeats,
    limited: limitedSeats,
    free: freeSeats
  }

  // Calculate estimated costs
  const basePlanCost = planData.monthly
  const seatCosts = (fullSeats * SEAT_PRICING.full) + 
                   (limitedSeats * SEAT_PRICING.limited) + 
                   (freeSeats * SEAT_PRICING.free)
  
  const monthlyCost = basePlanCost + seatCosts
  const yearlyCost = (planData.yearly + (seatCosts * 12 * 0.85)) // 15% discount on annual

  return {
    plan: recommendedPlan,
    rationale,
    seats,
    features: planData.features,
    estimatedCost: {
      monthly: monthlyCost,
      yearly: yearlyCost
    }
  }
}

// Recommend freelancer/agency workspace plan
export function recommendFreelancerWorkspacePlan(answers: WorkspaceAnswers): FreelancerWorkspaceRecommendation {
  let recommendedPlan: FreelancerWorkspacePlan = 'Starter'
  let rationale = ''

  // Agency plan requirements
  if (
    answers.numberOfSites > 10 || 
    answers.teamSize > 3 ||
    answers.needsAdvancedPermissions
  ) {
    recommendedPlan = 'Agency'
    rationale = 'Agency plan recommended for unlimited staging sites and advanced client management.'
  }
  // Freelancer plan requirements
  else if (
    answers.numberOfSites > 2 || 
    answers.teamSize > 1 ||
    answers.clientWork
  ) {
    recommendedPlan = 'Freelancer'
    rationale = 'Freelancer plan recommended for client work with enhanced staging capabilities.'
  }
  // Starter plan
  else {
    recommendedPlan = 'Starter'
    rationale = 'Starter plan is sufficient for getting started with basic client projects.'
  }

  const planData = FREELANCER_WORKSPACE_PRICING[recommendedPlan]

  return {
    plan: recommendedPlan,
    rationale,
    features: planData.features,
    estimatedCost: {
      monthly: planData.monthly,
      yearly: planData.yearly
    }
  }
}

// Main recommendation function that determines type and recommends accordingly
export function recommendWorkspacePlan(answers: WorkspaceAnswers): TeamWorkspaceRecommendation | FreelancerWorkspaceRecommendation {
  const workspaceType = determineWorkspaceType(answers)
  
  if (workspaceType === 'team') {
    return recommendTeamWorkspacePlan(answers)
  } else {
    return recommendFreelancerWorkspacePlan(answers)
  }
}

// Calculate workspace cost for team workspaces with seat types
export function calculateTeamWorkspaceCost(
  plan: TeamWorkspacePlan,
  seats: { full: number; limited: number; free: number },
  billingCycle: 'Monthly' | 'Yearly'
): number {
  if (plan === 'Enterprise') {
    return 0 // Custom pricing
  }

  const planData = TEAM_WORKSPACE_PRICING[plan]
  const baseCost = billingCycle === 'Monthly' ? planData.monthly : planData.yearly / 12
  
  const seatCosts = (seats.full * SEAT_PRICING.full) + 
                   (seats.limited * SEAT_PRICING.limited) + 
                   (seats.free * SEAT_PRICING.free)

  return baseCost + seatCosts
}

// Calculate workspace cost for freelancer/agency workspaces with seat types
export function calculateFreelancerWorkspaceCost(
  plan: FreelancerWorkspacePlan,
  seats: { full: number; limited: number; free: number },
  billingCycle: 'Monthly' | 'Yearly'
): number {
  const planData = FREELANCER_WORKSPACE_PRICING[plan]
  const baseCost = billingCycle === 'Monthly' ? planData.monthly : planData.yearly / 12
  
  const seatCosts = (seats.full * SEAT_PRICING.full) + 
                   (seats.limited * SEAT_PRICING.limited) + 
                   (seats.free * SEAT_PRICING.free)

  return baseCost + seatCosts
}

// Generic workspace cost calculation
export function calculateWorkspaceCost(
  workspaceType: WorkspaceType,
  plan: TeamWorkspacePlan | FreelancerWorkspacePlan,
  seats?: { full: number; limited: number; free: number },
  billingCycle: 'Monthly' | 'Yearly' = 'Monthly'
): number {
  if (workspaceType === 'team') {
    return calculateTeamWorkspaceCost(
      plan as TeamWorkspacePlan, 
      seats || { full: 1, limited: 0, free: 0 }, 
      billingCycle
    )
  } else {
    return calculateFreelancerWorkspaceCost(
      plan as FreelancerWorkspacePlan, 
      seats || { full: 1, limited: 0, free: 0 }, 
      billingCycle
    )
  }
}
