export interface User {
  id: string;
  email: string;
  apple_id: string | null;
  scan_credits: number;
  created_at: string;
}

export interface Report {
  id: string;
  user_id: string;
  app_name: string;
  approval_score: number;
  approval_category: string;
  results_json: ReportResults;
  created_at: string;
}

export interface ReportResults {
  riskScore: number;
  approvalProbability: number;
  approvalCategory: string;
  issues: Issue[];
  suggestedFixes: string[];
  ocrDetectedWords: string[];
  descriptionFlags: string[];
  wizardData: WizardData;
}

export interface Issue {
  title: string;
  explanation: string;
  guideline: string;
  riskPoints: number;
}

export interface WizardData {
  appName: string;
  platform: string;
  isNewApp: boolean;
  hasCrashes: boolean;
  hasPlaceholderContent: boolean;
  requiresAccount: boolean;
  canDeleteAccount: boolean;
  loginMethods: string[];
  chargesForDigital: boolean;
  hasSubscriptions: boolean;
  usesIAP: boolean;
  usesExternalPayments: boolean;
  paymentLocation: string;
  allowsUserContent: boolean;
  hasReporting: boolean;
  hasBlocking: boolean;
  hasModeration: boolean;
  permissions: string[];
  hasPrivacyPolicy: boolean;
  hasAIContent: boolean;
  involvesFinance: boolean;
  involvesGambling: boolean;
  providesHealthAdvice: boolean;
  descriptionMentionsPricing: boolean;
  descriptionMentionsExternalSubs: boolean;
  appDescription: string;
  screenshots: string[];
}

export interface PricingOption {
  credits: number;
  price: number;
  priceId?: string;
}

export const PRICING_OPTIONS: PricingOption[] = [
  { credits: 1, price: 7 },
  { credits: 5, price: 25 },
  { credits: 15, price: 45 },
];

export const TRIGGER_WORDS = [
  "Free",
  "Free Trial",
  "$",
  "Subscribe",
  "Unlimited",
  "Best",
  "Official",
];
