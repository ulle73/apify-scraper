export interface PricingPlan {
  id: string;
  name: string;
  credits: number;
  priceSEK: number;
  maxPerJob: number;
  stripePriceId: string;
}

export const PLANS: PricingPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    credits: 500,
    priceSEK: 499,
    maxPerJob: 500,
    stripePriceId: '', // Added via Stripe panel later or dynamically created
  },
  {
    id: 'pro',
    name: 'Pro',
    credits: 2500,
    priceSEK: 1499,
    maxPerJob: 2500,
    stripePriceId: '',
  },
  {
    id: 'growth',
    name: 'Growth',
    credits: 10000,
    priceSEK: 3999,
    maxPerJob: 1000, // V1 capped at 1000 for safety
    stripePriceId: '',
  },
];

export const V1_MAX_RESULTS = 1000;
export const FREE_MAX_RESULTS = 25;
