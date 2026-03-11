import { Issue, ReportResults, WizardData } from "./types";

interface RiskRule {
  condition: (data: WizardData) => boolean;
  riskPoints: number;
  title: string;
  explanation: string;
  guideline: string;
}

const RULES: RiskRule[] = [
  {
    condition: (d) => d.usesExternalPayments && d.paymentLocation === "inside",
    riskPoints: 40,
    title: "Payment Compliance Risk",
    explanation:
      "External payment processor detected for in-app digital purchases. Apple requires all digital goods and services purchased within the app to use In-App Purchase.",
    guideline:
      "3.1.1 – In-App Purchase: If you want to unlock features or functionality within your app, you must use in-app purchase.",
  },
  {
    condition: (d) => d.hasSubscriptions && !d.usesIAP,
    riskPoints: 30,
    title: "Subscription Implementation Risk",
    explanation:
      "Subscriptions for digital content or features are not using Apple's In-App Purchase system. This is required for all auto-renewable subscriptions.",
    guideline:
      "3.1.2 – Subscriptions: Apps may offer auto-renewing in-app purchase subscriptions, but must do so through Apple's IAP.",
  },
  {
    condition: (d) => d.allowsUserContent && !d.hasModeration,
    riskPoints: 25,
    title: "User Generated Content Risk",
    explanation:
      "Your app allows user-generated content but does not implement content moderation. Apps with UGC must include filtering, reporting, and blocking capabilities.",
    guideline:
      "1.2 – User-Generated Content: Apps with user-generated content must include sufficient measures to filter objectionable material.",
  },
  {
    condition: (d) => d.requiresAccount && !d.canDeleteAccount,
    riskPoints: 20,
    title: "Account Deletion Risk",
    explanation:
      "Your app requires account creation but does not offer in-app account deletion. Apple requires all apps that offer account creation to also allow users to delete their account from within the app.",
    guideline:
      "5.1.1(v) – Account Deletion: Apps that support account creation must also offer account deletion.",
  },
  {
    condition: (d) =>
      d.allowsUserContent && (!d.hasReporting || !d.hasBlocking),
    riskPoints: 15,
    title: "Content Reporting & Blocking Risk",
    explanation:
      "User-generated content apps must include mechanisms for users to report offensive content and block abusive users.",
    guideline:
      "1.2 – User-Generated Content: Apps must include a method for filtering and reporting objectionable UGC.",
  },
  {
    condition: (d) => !d.hasPrivacyPolicy,
    riskPoints: 15,
    title: "Privacy Policy Missing",
    explanation:
      "No privacy policy is accessible within the app. All apps must include a link to their privacy policy in the App Store Connect metadata and within the app.",
    guideline:
      "5.1.1 – Data Collection and Storage: Apps must have a privacy policy and ensure user consent.",
  },
  {
    condition: (d) => d.hasCrashes,
    riskPoints: 25,
    title: "App Stability Risk",
    explanation:
      "Your app has reported crashes or errors. Apps must be stable and free of obvious bugs to be approved.",
    guideline:
      "2.1 – App Completeness: Apps that crash or exhibit obvious technical problems will be rejected.",
  },
  {
    condition: (d) => d.hasPlaceholderContent,
    riskPoints: 20,
    title: "Placeholder Content Detected",
    explanation:
      "Your app contains placeholder content. All content must be final before submission.",
    guideline:
      "2.1 – App Completeness: Submissions with placeholder content will be rejected.",
  },
  {
    condition: (d) =>
      d.requiresAccount &&
      d.loginMethods.length > 0 &&
      !d.loginMethods.includes("apple"),
    riskPoints: 15,
    title: "Sign in with Apple Missing",
    explanation:
      'Apps that use third-party login services (Google, Facebook, etc.) must also offer Sign in with Apple as an option.',
    guideline:
      "4.8 – Sign in with Apple: Apps that use third-party sign-in must also offer Sign in with Apple.",
  },
  {
    condition: (d) =>
      d.involvesGambling,
    riskPoints: 20,
    title: "Gambling Content Risk",
    explanation:
      "Apps involving real-money gambling require special licensing and are restricted to specific regions.",
    guideline:
      "5.3.4 – Gambling: Apps that facilitate real-money gambling must be restricted to appropriate jurisdictions.",
  },
  {
    condition: (d) => d.providesHealthAdvice,
    riskPoints: 10,
    title: "Health & Medical Content Risk",
    explanation:
      "Apps providing health advice must include appropriate disclaimers and accurate information.",
    guideline:
      "1.4.1 – Physical Harm: Medical apps must clearly disclaim that they do not provide medical advice.",
  },
  {
    condition: (d) =>
      d.permissions.length > 0 && !d.hasPrivacyPolicy,
    riskPoints: 15,
    title: "Permission Without Privacy Policy",
    explanation:
      "Your app requests device permissions but lacks a privacy policy explaining data usage.",
    guideline:
      "5.1.1 – Data Collection and Storage: Apps must clearly describe what data they collect and how it is used.",
  },
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
];

export function analyzeRisk(
  wizardData: WizardData,
  ocrWords: string[],
  descriptionFlags: string[]
): ReportResults {
  const issues: Issue[] = [];
  let totalRisk = 0;

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
    issues,
    suggestedFixes,
    ocrDetectedWords: ocrWords,
    descriptionFlags,
    wizardData,
  };
}

function riskToApproval(risk: number): number {
  if (risk <= 20) return Math.max(90, 100 - risk);
  if (risk <= 40) return Math.max(70, 89 - (risk - 20));
  if (risk <= 60) return Math.max(50, 69 - (risk - 40));
  if (risk <= 80) return Math.max(30, 49 - (risk - 60));
  return Math.max(5, 29 - (risk - 80));
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
      case "Payment Compliance Risk":
        fixes.push(
          "Implement Apple's In-App Purchase for all digital goods and services sold within the app."
        );
        break;
      case "Subscription Implementation Risk":
        fixes.push(
          "Migrate all auto-renewable subscriptions to Apple's StoreKit / In-App Purchase system."
        );
        break;
      case "User Generated Content Risk":
        fixes.push(
          "Add content moderation tools including automated filtering, user reporting, and content review workflows."
        );
        break;
      case "Account Deletion Risk":
        fixes.push(
          "Add an account deletion option in the app's settings or account management screen."
        );
        break;
      case "Content Reporting & Blocking Risk":
        fixes.push(
          "Implement user reporting and blocking features accessible from content and profile views."
        );
        break;
      case "Privacy Policy Missing":
        fixes.push(
          "Add a privacy policy link accessible from within the app and in App Store Connect metadata."
        );
        break;
      case "App Stability Risk":
        fixes.push(
          "Fix all crashes and errors before submission. Test on multiple devices and OS versions."
        );
        break;
      case "Placeholder Content Detected":
        fixes.push(
          "Replace all placeholder content with final production content before submission."
        );
        break;
      case "Sign in with Apple Missing":
        fixes.push(
          "Add Sign in with Apple as a login option alongside existing third-party login methods."
        );
        break;
      case "Screenshot Metadata Risk":
        fixes.push(
          "Review screenshots and remove any misleading pricing language or exaggerated claims."
        );
        break;
      case "Description Metadata Risk":
        fixes.push(
          "Review app description and ensure all claims about pricing and features are accurate."
        );
        break;
      case "Gambling Content Risk":
        fixes.push(
          "Ensure proper licensing for gambling features and restrict availability to approved regions."
        );
        break;
      case "Health & Medical Content Risk":
        fixes.push(
          "Add appropriate medical disclaimers and ensure health information is sourced from qualified professionals."
        );
        break;
      case "Description Pricing Language":
        fixes.push(
          "Remove specific pricing mentions from description to avoid regional inaccuracies."
        );
        break;
      case "External Subscription Reference":
        fixes.push(
          "Remove references to external subscription services from your app description."
        );
        break;
      default:
        fixes.push(`Address: ${issue.title}`);
    }
  }

  return fixes;
}
