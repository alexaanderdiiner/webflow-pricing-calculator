import { WorkspacePlan, WorkspaceAnswers, WorkspaceRecommendation, WORKSPACE_PRICING } from './workspaceData'

export function recommendWorkspacePlan(answers: WorkspaceAnswers): WorkspaceRecommendation {
  let recommendedPlan: WorkspacePlan = 'Free'
  let rationale = ''
  let recommendedSeats = Math.max(1, answers.teamSize)

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
    rationale = 'Growth plan recommended for larger teams, multiple guests, or advanced collaboration needs.'
  }
  // Core plan requirements
  else if (
    answers.teamSize > 1 || 
    answers.needsGuests || 
    answers.numberOfSites > 2
  ) {
    recommendedPlan = 'Core'
    rationale = 'Core plan recommended for team collaboration and guest access needs.'
  }
  // Free plan
  else {
    recommendedPlan = 'Free'
    rationale = 'Free plan is sufficient for individual use with basic site hosting needs.'
  }

  const planData = WORKSPACE_PRICING[recommendedPlan]
  const features = planData.features

  // Calculate estimated costs
  let monthlyCost = 0
  let yearlyCost = 0

  if (recommendedPlan !== 'Free' && recommendedPlan !== 'Enterprise') {
    monthlyCost = planData.monthly * recommendedSeats
    yearlyCost = planData.yearly * recommendedSeats
  }

  return {
    plan: recommendedPlan,
    rationale,
    recommendedSeats,
    features,
    estimatedCost: {
      monthly: monthlyCost,
      yearly: yearlyCost
    }
  }
}

export function calculateWorkspaceCost(
  plan: WorkspacePlan,
  seats: number,
  billingCycle: WorkspaceBillingCycle
): number {
  if (plan === 'Free' || plan === 'Enterprise') {
    return 0 // Free or custom pricing
  }

  const planData = WORKSPACE_PRICING[plan]
  const pricePerSeat = billingCycle === 'Monthly' ? planData.monthly : planData.yearly / 12

  return pricePerSeat * seats
}

export function getWorkspacePlanFeatures(plan: WorkspacePlan): string[] {
  return WORKSPACE_PRICING[plan].features
}

export function getGuestLimit(plan: WorkspacePlan): number {
  const planData = WORKSPACE_PRICING[plan]
  return planData.guests
}
