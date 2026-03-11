import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error("STRIPE_SECRET_KEY is not set");
    }
    _stripe = new Stripe(key);
  }
  return _stripe;
}

export const PRICE_MAP: Record<number, number> = {
  1: 700,   // $7.00 in cents
  5: 2500,  // $25.00 in cents
  15: 4500, // $45.00 in cents
};
