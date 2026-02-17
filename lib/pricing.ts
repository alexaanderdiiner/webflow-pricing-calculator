export type WebflowPlan = 'Starter' | 'Basic' | 'CMS' | 'Business' | 'Enterprise';
export type BillingCycle = 'Monthly' | 'Yearly';

export interface PlanLimits {
  bandwidth: number; // GB
  requests: number; // millions
  cpu: number; // hours
}

export interface PlanPricing {
  monthly: number;
  yearly: number;
  limits: PlanLimits;
}

export interface AddOnPricing {
  optimize: {
    monthly: number;
    yearly: number;
  };
  analyze: {
    tiers: Array<{
      sessions: number;
      price: number;
    }>;
  };
  localization: {
    pricePerLocale: number;
  };
}

export interface OverageRates {
  bandwidth: number; // per GB
  requests: number; // per million requests
  cpu: number; // per hour
}

export interface PricingConfig {
  plans: Record<WebflowPlan, PlanPricing>;
  addOns: AddOnPricing;
  overage: OverageRates;
}

export interface UsageInputs {
  plan: WebflowPlan;
  billingCycle: BillingCycle;
  bandwidth: number;
  requests: number;
  cpu: number;
  addOns: {
    optimize: boolean;
    analyzeSessions: number;
    localizationLocales: number;
  };
}

export interface PricingResult {
  basePlanCost: number;
  overageCosts: {
    bandwidth: number;
    requests: number;
    cpu: number;
  };
  addOnCosts: {
    optimize: number;
    analyze: number;
    localization: number;
  };
  monthlyTotal: number;
  yearlyTotal: number;
  savings: number;
}

// Plan pricing data
// Fallback static config (used if Airtable unavailable). Keep exported for legacy usages.
export const PLAN_PRICING: Record<WebflowPlan, PlanPricing> = {
  Starter: {
    monthly: 14,
    yearly: 144, // 15% discount
    limits: {
      bandwidth: 50,
      requests: 1,
      cpu: 10,
    },
  },
  Basic: {
    monthly: 23,
    yearly: 228, // 15% discount
    limits: {
      bandwidth: 100,
      requests: 2,
      cpu: 20,
    },
  },
  CMS: {
    monthly: 29,
    yearly: 288, // 15% discount
    limits: {
      bandwidth: 200,
      requests: 5,
      cpu: 40,
    },
  },
  Business: {
    monthly: 39,
    yearly: 390, // 15% discount
    limits: {
      bandwidth: 400,
      requests: 10,
      cpu: 80,
    },
  },
  Enterprise: {
    monthly: 235,
    yearly: 2350, // 15% discount
    limits: {
      bandwidth: 1000,
      requests: 25,
      cpu: 200,
    },
  },
};

// Add-on pricing
export const ADD_ON_PRICING: AddOnPricing = {
  optimize: {
    monthly: 299,
    yearly: 299 * 12 * 0.75, // 25% discount
  },
  analyze: {
    tiers: [
      { sessions: 10000, price: 29 },
      { sessions: 25000, price: 49 },
      { sessions: 50000, price: 79 },
    ],
  },
  localization: {
    pricePerLocale: 9,
  },
};

// Overage rates per unit
export const OVERAGE_RATES: OverageRates = {
  bandwidth: 0.15,
  requests: 2.0,
  cpu: 0.5,
};

export const FALLBACK_CONFIG: PricingConfig = {
  plans: PLAN_PRICING,
  addOns: ADD_ON_PRICING,
  overage: OVERAGE_RATES,
}

export function calculatePricing(inputs: UsageInputs, config: PricingConfig = FALLBACK_CONFIG): PricingResult {
  const planData = config.plans[inputs.plan];
  const basePlanCost = inputs.billingCycle === 'Monthly' ? planData.monthly : planData.yearly / 12;

  // Calculate overages
  const bandwidthOverage = Math.max(0, inputs.bandwidth - planData.limits.bandwidth);
  const requestsOverage = Math.max(0, inputs.requests - planData.limits.requests);
  const cpuOverage = Math.max(0, inputs.cpu - planData.limits.cpu);

  const overageCosts = {
    bandwidth: bandwidthOverage * config.overage.bandwidth,
    requests: requestsOverage * config.overage.requests,
    cpu: cpuOverage * config.overage.cpu,
  };

  // Calculate add-on costs
  const addOnCosts = {
    optimize: inputs.addOns.optimize
      ? inputs.billingCycle === 'Monthly'
        ? config.addOns.optimize.monthly
        : config.addOns.optimize.yearly / 12
      : 0,
    analyze: calculateAnalyzeCost(inputs.addOns.analyzeSessions, config),
    localization: inputs.addOns.localizationLocales * config.addOns.localization.pricePerLocale,
  };

  const monthlyTotal =
    basePlanCost +
    overageCosts.bandwidth +
    overageCosts.requests +
    overageCosts.cpu +
    addOnCosts.optimize +
    addOnCosts.analyze +
    addOnCosts.localization;

  const yearlyTotal = monthlyTotal * 12;
  
  // Calculate potential savings with yearly billing
  const monthlyBillingYearlyTotal = inputs.billingCycle === 'Monthly' 
    ? (config.plans[inputs.plan].monthly * 12) + 
      (overageCosts.bandwidth + overageCosts.requests + overageCosts.cpu) * 12 +
      (config.addOns.optimize.monthly * 12 * (inputs.addOns.optimize ? 1 : 0)) +
      (addOnCosts.analyze + addOnCosts.localization) * 12
    : yearlyTotal;

  const yearlyBillingYearlyTotal = 
    config.plans[inputs.plan].yearly +
    (overageCosts.bandwidth + overageCosts.requests + overageCosts.cpu) * 12 +
    (config.addOns.optimize.yearly * (inputs.addOns.optimize ? 1 : 0)) +
    (addOnCosts.analyze + addOnCosts.localization) * 12;

  const savings = monthlyBillingYearlyTotal - yearlyBillingYearlyTotal;

  return {
    basePlanCost,
    overageCosts,
    addOnCosts,
    monthlyTotal,
    yearlyTotal,
    savings,
  };
}

function calculateAnalyzeCost(sessions: number, config: PricingConfig): number {
  if (sessions === 0) return 0;
  const tier = config.addOns.analyze.tiers.find(t => sessions <= t.sessions);
  return tier ? tier.price : 79; // Default to highest tier if custom
}

// Workspace-related types and functions
import {
  WorkspaceType,
  TeamWorkspacePlan,
  FreelancerWorkspacePlan
} from './workspaceData'
import { calculateWorkspaceCost } from './recommendWorkspace'

export interface WorkspaceConfig {
  type: WorkspaceType
  plan: TeamWorkspacePlan | FreelancerWorkspacePlan
  seats?: {
    full: number
    limited: number
    free: number
  }
}

export interface TotalCostResult {
  workspace: {
    cost: number
    plan: string
    type: WorkspaceType
  }
  hosting: {
    baseCost: number
    overageCosts: number
    total: number
  }
  addOns: {
    optimize: number
    analyze: number
    localization: number
    total: number
  }
  grandTotal: number
  breakdown: string[]
}

/**
 * Calculate the total cost including workspace, hosting, and add-ons
 */
export function calculateTotalCost(
  hostingInputs: UsageInputs,
  workspaceConfig: WorkspaceConfig,
  pricingConfig: PricingConfig = FALLBACK_CONFIG
): TotalCostResult {
  // Calculate hosting costs
  const hostingResult = calculatePricing(hostingInputs, pricingConfig)

  // Calculate workspace costs
  const workspaceCost = calculateWorkspaceCost(
    workspaceConfig.type,
    workspaceConfig.plan,
    workspaceConfig.seats || { full: 1, limited: 0, free: 0 },
    hostingInputs.billingCycle
  )

  const hostingTotal = hostingResult.basePlanCost +
    hostingResult.overageCosts.bandwidth +
    hostingResult.overageCosts.requests +
    hostingResult.overageCosts.cpu

  const addOnsTotal = hostingResult.addOnCosts.optimize +
    hostingResult.addOnCosts.analyze +
    hostingResult.addOnCosts.localization

  const grandTotal = workspaceCost + hostingTotal + addOnsTotal

  // Build breakdown array
  const breakdown: string[] = []
  if (workspaceCost > 0) {
    breakdown.push(`${workspaceConfig.type === 'team' ? 'Team' : 'Freelancer/Agency'} Workspace (${workspaceConfig.plan}): $${Math.round(workspaceCost)}/mo`)
  }
  breakdown.push(`${hostingInputs.plan} Hosting Plan: $${Math.round(hostingResult.basePlanCost)}/mo`)
  if (addOnsTotal > 0) {
    breakdown.push(`Add-ons: $${Math.round(addOnsTotal)}/mo`)
  }

  return {
    workspace: {
      cost: workspaceCost,
      plan: workspaceConfig.plan,
      type: workspaceConfig.type
    },
    hosting: {
      baseCost: hostingResult.basePlanCost,
      overageCosts: hostingResult.overageCosts.bandwidth +
        hostingResult.overageCosts.requests +
        hostingResult.overageCosts.cpu,
      total: hostingTotal
    },
    addOns: {
      optimize: hostingResult.addOnCosts.optimize,
      analyze: hostingResult.addOnCosts.analyze,
      localization: hostingResult.addOnCosts.localization,
      total: addOnsTotal
    },
    grandTotal,
    breakdown
  }
}
