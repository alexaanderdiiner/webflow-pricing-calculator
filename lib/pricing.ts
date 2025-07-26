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
export const OVERAGE_RATES = {
  bandwidth: 0.15, // per GB
  requests: 2.0, // per million requests
  cpu: 0.50, // per hour
};

export function calculatePricing(inputs: UsageInputs): PricingResult {
  const planData = PLAN_PRICING[inputs.plan];
  const basePlanCost = inputs.billingCycle === 'Monthly' ? planData.monthly : planData.yearly / 12;

  // Calculate overages
  const bandwidthOverage = Math.max(0, inputs.bandwidth - planData.limits.bandwidth);
  const requestsOverage = Math.max(0, inputs.requests - planData.limits.requests);
  const cpuOverage = Math.max(0, inputs.cpu - planData.limits.cpu);

  const overageCosts = {
    bandwidth: bandwidthOverage * OVERAGE_RATES.bandwidth,
    requests: requestsOverage * OVERAGE_RATES.requests,
    cpu: cpuOverage * OVERAGE_RATES.cpu,
  };

  // Calculate add-on costs
  const addOnCosts = {
    optimize: inputs.addOns.optimize
      ? inputs.billingCycle === 'Monthly'
        ? ADD_ON_PRICING.optimize.monthly
        : ADD_ON_PRICING.optimize.yearly / 12
      : 0,
    analyze: calculateAnalyzeCost(inputs.addOns.analyzeSessions),
    localization: inputs.addOns.localizationLocales * ADD_ON_PRICING.localization.pricePerLocale,
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
    ? (PLAN_PRICING[inputs.plan].monthly * 12) + 
      (overageCosts.bandwidth + overageCosts.requests + overageCosts.cpu) * 12 +
      (ADD_ON_PRICING.optimize.monthly * 12 * (inputs.addOns.optimize ? 1 : 0)) +
      (addOnCosts.analyze + addOnCosts.localization) * 12
    : yearlyTotal;

  const yearlyBillingYearlyTotal = 
    PLAN_PRICING[inputs.plan].yearly +
    (overageCosts.bandwidth + overageCosts.requests + overageCosts.cpu) * 12 +
    (ADD_ON_PRICING.optimize.yearly * (inputs.addOns.optimize ? 1 : 0)) +
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

function calculateAnalyzeCost(sessions: number): number {
  if (sessions === 0) return 0;
  
  const tier = ADD_ON_PRICING.analyze.tiers.find(t => sessions <= t.sessions);
  return tier ? tier.price : 79; // Default to highest tier if custom
}
