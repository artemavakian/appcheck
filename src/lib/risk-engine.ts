import { Issue, HardFail, ReportResults, WizardData } from "./types";

interface HardFailRule {
  condition: (data: WizardData) => boolean;
  title: string;
  explanation: string;
  guideline: string;
  fix: string;
}

interface RiskRule {
  condition: (data: WizardData) => boolean;
  riskPoints: number;
  title: string;
  explanation: string;
  guideline: string;
}

const HARD_FAIL_RULES: HardFailRule[] = [
  {
    condition: (d) => d.permissions.length > 0 && !d.hasPrivacyPolicy,
    title: "Missing Privacy Policy with Data Collection",
    explanation:
      "Your app collects data through device permissions but does not have an accessible privacy policy. This is a requirement for all apps that collect any user data.",
    guideline:
      "5.1.1 – Data Collection and Storage: Apps that collect user data must have a privacy policy and ensure user consent.",
    fix: "Add a privacy policy link inside your app and in App Store Connect metadata before submission.",
  },
  {
    condition: (d) => d.permissions.length > 0 && !d.permissionsExplained,
    title: "Permissions Without Clear Explanation",
    explanation:
      "Your app requests device permissions but the purpose strings do not clearly explain why the data is needed. Apple requires clear, specific explanations.",
    guideline:
      "5.1.1 – Data Collection and Storage: Permission request purpose strings must clearly and completely describe the app's use of the data.",
    fix: "Update all permission prompts (NSCameraUsageDescription, etc.) to clearly state why your app needs each permission and how the data will be used.",
  },
  {
    condition: (d) =>
      d.chargesForDigital && d.usesExternalPayments && d.paymentLocation === "inside",
    title: "External Payment for Digital Goods Inside App",
    explanation:
      "Your app sells digital content or features using an external payment processor inside the app. Apple requires all digital goods sold within the app to use In-App Purchase.",
    guideline:
      "3.1.1 – In-App Purchase: If you want to unlock features or functionality within your app, you must use in-app purchase.",
    fix: "Implement Apple's In-App Purchase (StoreKit) for all digital goods and features sold within the app. External payment is only allowed for physical goods and services.",
  },
  {
    condition: (d) => d.chargesForDigital && d.hasSubscriptions && !d.usesIAP,
    title: "Digital Subscriptions Not Using Apple IAP",
    explanation:
      "Your app offers subscriptions for digital content but is not using Apple's In-App Purchase system. All auto-renewable subscriptions for digital content must go through Apple.",
    guideline:
      "3.1.2 – Subscriptions: Apps may offer auto-renewing subscriptions, but must do so through Apple's IAP system.",
    fix: "Migrate all digital content subscriptions to Apple's StoreKit / In-App Purchase system.",
  },
  {
    condition: (d) => d.requiresAccount && !d.canDeleteAccount,
    title: "Account Required but No In-App Deletion",
    explanation:
      "Your app requires account creation but does not allow users to delete their account from within the app. This has been strictly enforced since mid-2022.",
    guideline:
      "5.1.1(v) – Account Deletion: Apps that support account creation must also offer account deletion from within the app.",
    fix: "Add an account deletion option in your app's settings or account management section.",
  },
  {
    condition: (d) =>
      d.requiresAccount &&
      d.loginMethods.length > 0 &&
      (d.loginMethods.includes("Google") || d.loginMethods.includes("Facebook")) &&
      !d.loginMethods.includes("Apple"),
    title: "Missing Sign in with Apple",
    explanation:
      "Your app offers Google or Facebook login but does not include Sign in with Apple. When third-party login is used, Sign in with Apple must also be offered.",
    guideline:
      "4.8 – Sign in with Apple: Apps that use third-party sign-in services must also offer Sign in with Apple.",
    fix: "Add Sign in with Apple as a login option alongside your existing third-party login methods.",
  },
  {
    condition: (d) => d.hasCrashes,
    title: "App Crashes or Is Broken",
    explanation:
      "Your app has reported crashes or errors. Apps that crash during review are almost always rejected immediately.",
    guideline:
      "2.1 – App Completeness: Apps that crash or exhibit obvious technical problems will be rejected.",
    fix: "Fix all crashes and errors. Test thoroughly on multiple devices and OS versions before resubmitting.",
  },
  {
    condition: (d) => d.hasPlaceholderContent,
    title: "Placeholder or Incomplete Content",
    explanation:
      "Your app contains placeholder content (e.g. lorem ipsum, test data, coming soon sections). All content must be final.",
    guideline:
      "2.1 – App Completeness: Submissions with placeholder or incomplete content will be rejected.",
    fix: "Replace all placeholder content with final production content before submission.",
  },
  {
    condition: (d) => d.isWebviewOnly,
    title: "Webview-Only App Without Added Functionality",
    explanation:
      "Your app is primarily a webview wrapping a website without providing functionality beyond what the website already offers. Apple rejects apps that are essentially repackaged websites.",
    guideline:
      "4.2 – Minimum Functionality: Your app should include features, content, and UI that make it more than a repackaged website.",
    fix: "Add native functionality that goes beyond the website experience — push notifications, offline access, device integrations, etc.",
  },
  {
    condition: (d) =>
      d.allowsUserContent && (!d.hasModeration || !d.hasReporting || !d.hasBlocking),
    title: "User-Generated Content Without Moderation",
    explanation:
      "Your app allows user-generated content but is missing content moderation, reporting, or blocking capabilities. All three are required.",
    guideline:
      "1.2 – User-Generated Content: Apps with UGC must include filtering, reporting, and blocking to handle objectionable material.",
    fix: "Implement content moderation/filtering, user reporting, and user blocking features before submission.",
  },
  {
    condition: (d) => d.requiresAccount && !d.hasDemoCredentials,
    title: "No Demo Credentials for App Review",
    explanation:
      "Your app requires login but you have not provided demo/test credentials for the App Review team. Reviewers need to be able to access all features.",
    guideline:
      "2.1 – App Completeness: If your app requires login, you must provide valid demo credentials in the App Review notes.",
    fix: "Create a demo account and enter the credentials in the 'App Review Information' section in App Store Connect.",
  },
  {
    condition: (d) => !d.screenshotsMatchFeatures,
    title: "Misleading Screenshots or Description",
    explanation:
      "Your screenshots or description show features that are not actually implemented in the app. This is considered misleading metadata.",
    guideline:
      "2.3.1 – Accurate Metadata: Screenshots must accurately represent the app experience. Do not show features that are not available.",
    fix: "Update screenshots and description to only show features that are fully implemented and functional in the app.",
  },
  {
    condition: (d) => d.involvesGambling && !d.hasGamblingLicense,
    title: "Gambling Without Proper Licensing",
    explanation:
      "Your app includes gambling features but does not have proper licensing. Real-money gambling apps require verified licenses.",
    guideline:
      "5.3.4 – Gambling: Apps that facilitate real-money gambling must have appropriate licensing and be restricted to jurisdictions where it is legal.",
    fix: "Obtain proper gambling licenses and restrict the app to jurisdictions where gambling is legal. Provide documentation in App Store Connect.",
  },
  {
    condition: (d) => d.providesHealthAdvice && !d.hasMedicalDisclaimer,
    title: "Health Advice Without Medical Disclaimer",
    explanation:
      "Your app provides health advice but does not include a medical disclaimer. Apps that provide health information must clearly disclaim that they are not a substitute for professional medical advice.",
    guideline:
      "1.4.1 – Physical Harm: Medical apps must clearly disclaim that they do not provide medical advice.",
    fix: "Add a prominent medical disclaimer stating that the app does not provide professional medical advice and is not a substitute for consulting a healthcare professional.",
  },
];

const RULES: RiskRule[] = [
  {
    condition: (d) => d.descriptionMentionsPricing,
    riskPoints: 10,
    title: "Description Pricing Language",
    explanation:
      "Your app description mentions pricing. This can cause issues if pricing changes or differs by region.",
    guideline:
      "2.3.1 – Accurate Metadata: Descriptions should not include specific pricing that may become inaccurate.",
  },
  {
    condition: (d) => d.descriptionMentionsExternalSubs,
    riskPoints: 15,
    title: "External Subscription Reference",
    explanation:
      "Your app description references external subscription services. This may conflict with App Store guidelines on directing users to external payment methods.",
    guideline:
      "3.1.1 – In-App Purchase: Apps must not direct users to a purchasing mechanism other than IAP.",
  },
  {
    condition: (d) => d.involvesGambling && d.hasGamblingLicense,
    riskPoints: 10,
    title: "Gambling Content (Licensed)",
    explanation:
      "Your app involves gambling. While you have licensing, gambling apps receive additional scrutiny during review.",
    guideline:
      "5.3.4 – Gambling: Apps that facilitate real-money gambling must be restricted to appropriate jurisdictions.",
  },
  {
    condition: (d) => d.providesHealthAdvice && d.hasMedicalDisclaimer,
    riskPoints: 5,
    title: "Health Content (With Disclaimer)",
    explanation:
      "Apps providing health advice receive additional review attention even with proper disclaimers.",
    guideline:
      "1.4.1 – Physical Harm: Medical apps must clearly disclaim that they do not provide medical advice.",
  },
  {
    condition: (d) => d.hasAIContent,
    riskPoints: 5,
    title: "AI-Generated Content",
    explanation:
      "Apps with AI-generated content may receive additional scrutiny regarding content accuracy and safety.",
    guideline:
      "1.4 – Physical Harm: Apps must not generate harmful content. AI features should include appropriate safeguards.",
  },
  {
    condition: (d) => d.involvesFinance,
    riskPoints: 5,
    title: "Finance/Cryptocurrency Content",
    explanation:
      "Financial apps receive extra review scrutiny, especially those involving cryptocurrency.",
    guideline:
      "3.1.5(a) – Cryptocurrencies: Apps may facilitate cryptocurrency transactions but must comply with all applicable laws.",
  },
];

export function analyzeRisk(
  wizardData: WizardData,
  ocrWords: string[],
  descriptionFlags: string[]
): ReportResults {
  const hardFails: HardFail[] = [];
  const issues: Issue[] = [];
  let totalRisk = 0;

  for (const rule of HARD_FAIL_RULES) {
    if (rule.condition(wizardData)) {
      hardFails.push({
        title: rule.title,
        explanation: rule.explanation,
        guideline: rule.guideline,
        fix: rule.fix,
      });
    }
  }

  for (const rule of RULES) {
    if (rule.condition(wizardData)) {
      issues.push({
        title: rule.title,
        explanation: rule.explanation,
        guideline: rule.guideline,
        riskPoints: rule.riskPoints,
      });
      totalRisk += rule.riskPoints;
    }
  }

  if (ocrWords.length > 0) {
    issues.push({
      title: "Screenshot Metadata Risk",
      explanation: `Detected trigger words in screenshots: ${ocrWords.join(", ")}. Screenshots should not contain misleading claims about pricing or features.`,
      guideline:
        "2.3.1 – Accurate Metadata: Screenshots must accurately represent the app experience.",
      riskPoints: 15,
    });
    totalRisk += 15;
  }

  if (descriptionFlags.length > 0) {
    issues.push({
      title: "Description Metadata Risk",
      explanation: `Detected trigger words in description: ${descriptionFlags.join(", ")}. Ensure all claims in your description are accurate.`,
      guideline:
        "2.3.1 – Accurate Metadata: App descriptions must be accurate and not misleading.",
      riskPoints: 10,
    });
    totalRisk += 10;
  }

  const approvalProbability = riskToApproval(totalRisk);
  const approvalCategory = getApprovalCategory(approvalProbability);
  const suggestedFixes = generateFixes(issues);

  return {
    riskScore: totalRisk,
    approvalProbability,
    approvalCategory,
    hardFails,
    issues,
    suggestedFixes,
    ocrDetectedWords: ocrWords,
    descriptionFlags,
    wizardData,
  };
}

function riskToApproval(risk: number): number {
  if (risk <= 10) return Math.max(90, 100 - risk);
  if (risk <= 25) return Math.max(70, 89 - (risk - 10));
  if (risk <= 40) return Math.max(50, 69 - (risk - 25));
  return Math.max(30, 49 - (risk - 40));
}

function getApprovalCategory(probability: number): string {
  if (probability >= 90) return "Low Risk";
  if (probability >= 70) return "Moderate Risk";
  if (probability >= 50) return "Elevated Risk";
  return "High Rejection Risk";
}

function generateFixes(issues: Issue[]): string[] {
  const fixes: string[] = [];

  for (const issue of issues) {
    switch (issue.title) {
      case "Description Pricing Language":
        fixes.push("Remove specific pricing mentions from description to avoid regional inaccuracies.");
        break;
      case "External Subscription Reference":
        fixes.push("Remove references to external subscription services from your app description.");
        break;
      case "Screenshot Metadata Risk":
        fixes.push("Review screenshots and remove any misleading pricing language or exaggerated claims.");
        break;
      case "Description Metadata Risk":
        fixes.push("Review app description and ensure all claims about pricing and features are accurate.");
        break;
      default:
        fixes.push(`Address: ${issue.title}`);
    }
  }

  return fixes;
}
