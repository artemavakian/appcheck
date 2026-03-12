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
  1: 700,
  5: 2500,
  15: 4500,
};

export const PRODUCT_MAP: Record<number, string> = {
  1: "prod_U8G0a4JlHhAxMy",
  5: "prod_U8G01iBzheDQ37",
  15: "prod_U8G0NMjKEVFg8m",
};
