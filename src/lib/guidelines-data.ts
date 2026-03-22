export interface Guideline {
  id: string;
  title: string;
  whatItMeans: string;
  commonRejections: string[];
  howToFix: string[];
}

export interface GuidelineCategory {
  id: string;
  name: string;
  guidelines: Guideline[];
}

export const MOST_COMMON_IDS = [
  "3.1.1",
  "5.1.1",
  "2.1",
  "2.3.1",
  "4.2",
  "4.8",
  "1.2",
];

export const GUIDELINE_CATEGORIES: GuidelineCategory[] = [
  {
    id: "1",
    name: "Safety",
    guidelines: [
      {
        id: "1.1",
        title: "1.1 – Objectionable Content",
        whatItMeans: "Apps must not include offensive, harmful, or inappropriate content.",
        commonRejections: [
          "Adult or sexual content",
          "Graphic violence",
          "Hate speech or discrimination",
          "Content promoting illegal activity",
        ],
        howToFix: [
          "Remove or restrict sensitive content",
          "Implement content filtering systems",
          "Follow age rating guidelines",
        ],
      },
      {
        id: "1.2",
        title: "1.2 – User Generated Content",
        whatItMeans: "Apps with user-generated content must include protections against abuse.",
        commonRejections: [
          "No reporting system",
          "No content moderation",
          "No user blocking features",
          "Inappropriate content visible to others",
        ],
        howToFix: [
          'Add "Report" functionality',
          "Add user blocking",
          "Implement moderation (manual or automated)",
        ],
      },
      {
        id: "1.3",
        title: "1.3 – Kids Category",
        whatItMeans: "Apps targeting children must meet stricter privacy and content rules.",
        commonRejections: [
          "Collecting personal data from children",
          "Ads not suitable for kids",
          "External links accessible without parental gates",
        ],
        howToFix: [
          "Avoid collecting personal data",
          "Use kid-safe ad networks",
          "Add parental gates for external links",
        ],
      },
      {
        id: "1.4",
        title: "1.4 – Physical Harm",
        whatItMeans: "Apps must not cause real-world harm or provide unsafe advice.",
        commonRejections: [
          "Medical advice without disclaimers",
          "Dangerous instructions (e.g., unsafe workouts)",
          "Encouraging risky behavior",
        ],
        howToFix: [
          "Add clear disclaimers",
          "Avoid presenting advice as professional guidance",
          "Limit harmful or dangerous content",
        ],
      },
      {
        id: "1.5",
        title: "1.5 – Developer Information",
        whatItMeans: "Apps must provide accurate developer and contact information.",
        commonRejections: [
          "Missing contact info",
          "Fake or misleading developer identity",
        ],
        howToFix: [
          "Provide valid contact details",
          "Ensure developer info is accurate",
        ],
      },
      {
        id: "1.6",
        title: "1.6 – Data Security",
        whatItMeans: "User data must be handled securely.",
        commonRejections: [
          "Transmitting sensitive data insecurely",
          "Storing data without protection",
        ],
        howToFix: [
          "Use HTTPS for all requests",
          "Secure stored data properly",
        ],
      },
      {
        id: "1.7",
        title: "1.7 – Reporting Criminal Activity",
        whatItMeans: "Apps must not be used to facilitate or promote illegal activity.",
        commonRejections: [
          "Apps enabling illegal transactions",
          "Content promoting criminal behavior",
        ],
        howToFix: [
          "Remove illegal content or features",
          "Implement safeguards",
        ],
      },
      {
        id: "1.8",
        title: "1.8 – Malware / Security Threats",
        whatItMeans: "Apps must not contain malicious code or harmful behavior.",
        commonRejections: [
          "Hidden functionality",
          "Unauthorized data access",
          "Exploitative behavior",
        ],
        howToFix: [
          "Ensure transparent functionality",
          "Avoid hidden or deceptive features",
        ],
      },
      {
        id: "1.9",
        title: "1.9 – Terrorist Content",
        whatItMeans: "Apps must not include or promote terrorist organizations.",
        commonRejections: [
          "Content supporting extremist groups",
          "Recruitment or propaganda",
        ],
        howToFix: [
          "Remove such content",
          "Moderate user-generated content",
        ],
      },
      {
        id: "1.10",
        title: "1.10 – Sensitive Events",
        whatItMeans: "Apps must not exploit sensitive real-world events.",
        commonRejections: [
          "Monetizing tragedies",
          "Misleading content about disasters",
        ],
        howToFix: [
          "Avoid exploitative messaging",
          "Provide accurate information",
        ],
      },
      {
        id: "1.11",
        title: "1.11 – Health and Research Data",
        whatItMeans: "Apps handling health data must follow strict privacy rules.",
        commonRejections: [
          "Improper handling of health data",
          "Missing disclosures",
        ],
        howToFix: [
          "Clearly explain data usage",
          "Follow health data guidelines",
        ],
      },
    ],
  },
  {
    id: "2",
    name: "Performance",
    guidelines: [
      {
        id: "2.1",
        title: "2.1 – App Completeness",
        whatItMeans: "Apps must be fully functional, complete, and ready for use at submission.",
        commonRejections: [
          "App crashes or fails to launch",
          "Broken links or non-working features",
          'Placeholder or "coming soon" content',
          "Missing required functionality",
        ],
        howToFix: [
          "Test the app thoroughly on real devices",
          "Remove all placeholder content",
          "Ensure all features work as described",
          "Only submit when the app is fully complete",
        ],
      },
      {
        id: "2.2",
        title: "2.2 – Beta Testing",
        whatItMeans: "Apps should be properly tested before submission.",
        commonRejections: [
          "Bugs that should have been caught in testing",
          "Incomplete features still in testing phase",
        ],
        howToFix: [
          "Use TestFlight for beta testing",
          "Ensure stability before submitting",
        ],
      },
      {
        id: "2.3",
        title: "2.3 – Accurate Metadata",
        whatItMeans: "All App Store metadata must accurately reflect the app's functionality.",
        commonRejections: [
          "Metadata doesn't match app functionality",
          "Misleading app name or category",
        ],
        howToFix: [
          "Ensure all metadata is accurate",
          "Match category to app's primary function",
        ],
      },
      {
        id: "2.3.1",
        title: "2.3.1 – Accurate Representation",
        whatItMeans: "Screenshots, previews, and descriptions must reflect real app features.",
        commonRejections: [
          "Showing features that don't exist",
          "Fake UI or misleading visuals",
          "Exaggerated claims",
        ],
        howToFix: [
          "Use real screenshots",
          "Only show implemented features",
          "Avoid misleading language",
        ],
      },
      {
        id: "2.3.2",
        title: "2.3.2 – Accurate Descriptions",
        whatItMeans: "Descriptions must clearly explain what the app does.",
        commonRejections: [
          "Vague or misleading descriptions",
          "Missing key functionality details",
        ],
        howToFix: [
          "Clearly describe core features",
          "Avoid marketing exaggeration",
        ],
      },
      {
        id: "2.3.3",
        title: "2.3.3 – Screenshots",
        whatItMeans: "Screenshots must accurately represent the app experience.",
        commonRejections: [
          'Including pricing language (e.g., "Free")',
          "Misleading UI elements",
          "Irrelevant images",
        ],
        howToFix: [
          "Use real in-app screenshots",
          "Avoid pricing or promotional claims",
          "Keep visuals accurate",
        ],
      },
      {
        id: "2.3.4",
        title: "2.3.4 – App Previews",
        whatItMeans: "Preview videos must show real app usage.",
        commonRejections: [
          "Edited or misleading previews",
          "Showing features not in app",
        ],
        howToFix: [
          "Record real app interactions",
          "Avoid exaggerated edits",
        ],
      },
      {
        id: "2.4",
        title: "2.4 – Hardware Compatibility",
        whatItMeans: "Apps must work properly on supported devices.",
        commonRejections: [
          "Features not working on certain devices",
          "Missing hardware compatibility",
        ],
        howToFix: [
          "Test on all supported devices",
          "Ensure compatibility across screen sizes",
        ],
      },
      {
        id: "2.5",
        title: "2.5 – Software Requirements",
        whatItMeans: "Apps must be compatible with supported OS versions.",
        commonRejections: [
          "Crashes on certain iOS versions",
          "Unsupported APIs",
        ],
        howToFix: [
          "Test across iOS versions",
          "Use supported APIs",
        ],
      },
      {
        id: "2.6",
        title: "2.6 – App Stability",
        whatItMeans: "Apps must be stable and responsive.",
        commonRejections: [
          "Frequent crashes",
          "Freezing or unresponsive UI",
        ],
        howToFix: [
          "Fix all crashes",
          "Optimize performance",
        ],
      },
      {
        id: "2.7",
        title: "2.7 – Third-Party Integrations",
        whatItMeans: "Third-party services must function correctly.",
        commonRejections: [
          "Broken integrations (login, payments, etc.)",
          "APIs not working",
        ],
        howToFix: [
          "Verify all integrations",
          "Ensure APIs are stable",
        ],
      },
      {
        id: "2.8",
        title: "2.8 – Demo Account Information",
        whatItMeans: "Apps requiring login must provide access for review.",
        commonRejections: [
          "No demo/test account provided",
          "Invalid login credentials",
        ],
        howToFix: [
          "Provide working demo credentials",
          "Include them in App Review Notes",
        ],
      },
      {
        id: "2.9",
        title: "2.9 – Version Updates",
        whatItMeans: "App updates must not break existing functionality.",
        commonRejections: [
          "New version introduces bugs",
          "Features removed without explanation",
        ],
        howToFix: [
          "Test updates thoroughly",
          "Ensure backward compatibility",
        ],
      },
      {
        id: "2.10",
        title: "2.10 – Platform Consistency",
        whatItMeans: "Apps must behave consistently across platforms.",
        commonRejections: [
          "Features missing on iPad vs iPhone",
          "Inconsistent UI/UX",
        ],
        howToFix: [
          "Ensure consistent experience",
          "Test across devices",
        ],
      },
    ],
  },
  {
    id: "3",
    name: "Business",
    guidelines: [
      {
        id: "3.1",
        title: "3.1 – Payments",
        whatItMeans: "Apps must follow Apple's rules for handling payments and monetization.",
        commonRejections: [
          "Using external payment for digital goods",
          "Not using Apple IAP where required",
        ],
        howToFix: [
          "Use Apple IAP for all digital purchases",
          "Follow Apple's payment guidelines",
        ],
      },
      {
        id: "3.1.1",
        title: "3.1.1 – In-App Purchases",
        whatItMeans: "Digital goods and services must use Apple's in-app purchase system.",
        commonRejections: [
          "Using external payment processors inside the app",
          "Linking users to external payment pages for digital purchases",
          "Unlocking digital features without Apple IAP",
        ],
        howToFix: [
          "Use Apple In-App Purchases for all digital goods",
          "Remove external payment links",
          "Configure subscriptions properly in App Store Connect",
        ],
      },
      {
        id: "3.1.2",
        title: "3.1.2 – Subscriptions",
        whatItMeans: "Auto-renewable subscriptions must follow Apple's subscription rules.",
        commonRejections: [
          "Missing subscription details (price, duration)",
          "No clear terms or conditions",
          "Confusing subscription flow",
        ],
        howToFix: [
          "Clearly display subscription terms",
          "Include pricing and renewal details",
          "Ensure transparent subscription UX",
        ],
      },
      {
        id: "3.1.3",
        title: "3.1.3 – Other Purchase Methods",
        whatItMeans: "Some types of purchases may use external payment methods under specific conditions.",
        commonRejections: [
          "Misclassifying digital goods to avoid IAP",
          "Not qualifying for external payment exceptions",
        ],
        howToFix: [
          "Understand which exceptions apply to your app",
          "Use IAP for all digital content",
        ],
      },
      {
        id: "3.1.3a",
        title: "3.1.3(a) – Reader Apps",
        whatItMeans: "Apps that provide previously purchased content (e.g., Netflix, Spotify) may link to external sign-in or purchase.",
        commonRejections: [
          "Offering purchase options inside the app",
          "Not qualifying as a reader app",
        ],
        howToFix: [
          "Only allow login to access existing content",
          "Do not include in-app purchase options",
        ],
      },
      {
        id: "3.1.3b",
        title: "3.1.3(b) – Multiplatform Services",
        whatItMeans: "Apps offering content across platforms must follow Apple's rules.",
        commonRejections: [
          "Allowing purchases outside Apple's system improperly",
        ],
        howToFix: [
          "Ensure compliance with Apple's payment rules",
          "Avoid directing users to external purchases improperly",
        ],
      },
      {
        id: "3.1.3c",
        title: "3.1.3(c) – Enterprise Services",
        whatItMeans: "Apps used internally by businesses may use external payments.",
        commonRejections: [
          "Misclassifying consumer apps as enterprise apps",
        ],
        howToFix: [
          "Ensure app qualifies for enterprise use",
          "Limit access appropriately",
        ],
      },
      {
        id: "3.1.3d",
        title: "3.1.3(d) – Person-to-Person Services",
        whatItMeans: "Payments for real-world services (e.g., Uber) can use external payment systems.",
        commonRejections: [
          "Misclassifying digital goods as real-world services",
        ],
        howToFix: [
          "Only use external payments for real-world services",
          "Ensure proper categorization",
        ],
      },
      {
        id: "3.1.3e",
        title: "3.1.3(e) – Goods and Services Outside the App",
        whatItMeans: "Physical goods and services can use external payments.",
        commonRejections: [
          "Treating digital goods as physical services",
        ],
        howToFix: [
          "Use external payments only for physical goods/services",
        ],
      },
      {
        id: "3.2",
        title: "3.2 – Other Business Model Issues",
        whatItMeans: "Apps must not use deceptive or unfair monetization practices.",
        commonRejections: [
          "Misleading pricing",
          "Hidden costs",
          "Unclear value proposition",
        ],
        howToFix: [
          "Be transparent about pricing",
          "Clearly explain what users are paying for",
        ],
      },
      {
        id: "3.3",
        title: "3.3 – Ads",
        whatItMeans: "Ads must be appropriate and not interfere with the app experience.",
        commonRejections: [
          "Excessive ads",
          "Ads that mimic app functionality",
          "Inappropriate ad content",
        ],
        howToFix: [
          "Limit ad frequency",
          "Clearly distinguish ads from UI",
          "Use appropriate ad networks",
        ],
      },
      {
        id: "3.4",
        title: "3.4 – App Bundles",
        whatItMeans: "Apps included in bundles must provide value.",
        commonRejections: [
          "Duplicate or low-value apps in bundles",
        ],
        howToFix: [
          "Ensure each app adds value",
          "Avoid duplication",
        ],
      },
      {
        id: "3.5",
        title: "3.5 – App Store Connect Information",
        whatItMeans: "All pricing and business information must be accurate.",
        commonRejections: [
          "Incorrect pricing info",
          "Missing subscription details",
        ],
        howToFix: [
          "Ensure all App Store Connect fields are accurate",
          "Double-check pricing and metadata",
        ],
      },
      {
        id: "3.6",
        title: "3.6 – Developer Code of Conduct",
        whatItMeans: "Developers must act honestly and not attempt to manipulate the App Store.",
        commonRejections: [
          "Attempting to bypass guidelines",
          "Misleading reviewers",
        ],
        howToFix: [
          "Follow guidelines honestly",
          "Provide accurate information",
        ],
      },
      {
        id: "3.7",
        title: "3.7 – Licensing and Compliance",
        whatItMeans: "Apps must comply with all applicable laws and regulations.",
        commonRejections: [
          "Missing required licenses (e.g., gambling, finance)",
          "Operating in restricted regions",
        ],
        howToFix: [
          "Obtain proper licenses",
          "Ensure legal compliance",
        ],
      },
    ],
  },
  {
    id: "4",
    name: "Design",
    guidelines: [
      {
        id: "4.1",
        title: "4.1 – Copycats",
        whatItMeans: "Apps must be original and not copy other apps.",
        commonRejections: [
          "Replicating another app's UI or concept",
          "Slight variations of existing popular apps",
        ],
        howToFix: [
          "Create unique functionality and design",
          "Avoid imitating existing apps",
        ],
      },
      {
        id: "4.2",
        title: "4.2 – Minimum Functionality",
        whatItMeans: "Apps must provide meaningful, lasting value.",
        commonRejections: [
          "App is just a website wrapper",
          "Very limited or trivial functionality",
          "Not enough content or features",
        ],
        howToFix: [
          "Add native functionality",
          "Ensure the app provides real value",
          "Avoid simple WebView-only apps",
        ],
      },
      {
        id: "4.3",
        title: "4.3 – Spam",
        whatItMeans: "Apps must not be repetitive, low-quality, or mass-produced.",
        commonRejections: [
          "Multiple similar apps from the same developer",
          "Template-based apps with little variation",
          "Low-quality or generic apps",
        ],
        howToFix: [
          "Consolidate apps into one",
          "Improve quality and uniqueness",
          "Avoid mass-producing similar apps",
        ],
      },
      {
        id: "4.4",
        title: "4.4 – Extensions",
        whatItMeans: "App extensions must provide useful functionality.",
        commonRejections: [
          "Extensions that don't add value",
          "Broken or non-functional extensions",
        ],
        howToFix: [
          "Ensure extensions are useful and functional",
        ],
      },
      {
        id: "4.5",
        title: "4.5 – Apple Sites and Services",
        whatItMeans: "Apps must not misuse Apple services.",
        commonRejections: [
          "Misusing Apple APIs",
          "Misleading use of Apple branding",
        ],
        howToFix: [
          "Follow Apple API usage guidelines",
          "Avoid misuse of Apple services",
        ],
      },
      {
        id: "4.6",
        title: "4.6 – Alternate App Icons",
        whatItMeans: "Alternate app icons must follow Apple rules.",
        commonRejections: [
          "Misleading or inappropriate icons",
          "Icons not matching app content",
        ],
        howToFix: [
          "Ensure icons are accurate and appropriate",
        ],
      },
      {
        id: "4.7",
        title: "4.7 – HTML5 Games, Bots, etc.",
        whatItMeans: "Apps that deliver content dynamically must follow guidelines.",
        commonRejections: [
          "Hosting multiple mini-apps or games without review",
          "Delivering unreviewed content",
        ],
        howToFix: [
          "Ensure all content complies with guidelines",
          "Avoid unreviewed dynamic content",
        ],
      },
      {
        id: "4.8",
        title: "4.8 – Sign in with Apple",
        whatItMeans: "Apps offering third-party login must also offer Sign in with Apple.",
        commonRejections: [
          "Google or Facebook login without Apple login",
          "Not complying with Apple sign-in requirements",
        ],
        howToFix: [
          "Add Sign in with Apple",
          "Ensure it meets Apple's requirements",
        ],
      },
      {
        id: "4.9",
        title: "4.9 – Streaming Games",
        whatItMeans: "Game streaming apps must follow specific rules.",
        commonRejections: [
          "Offering unreviewed game content",
          "Violating Apple's streaming policies",
        ],
        howToFix: [
          "Ensure compliance with Apple's game streaming rules",
        ],
      },
      {
        id: "4.10",
        title: "4.10 – Notifications",
        whatItMeans: "Push notifications must be used responsibly.",
        commonRejections: [
          "Sending spam notifications",
          "Using notifications for ads without consent",
        ],
        howToFix: [
          "Limit notifications to relevant content",
          "Avoid promotional spam",
        ],
      },
    ],
  },
  {
    id: "5",
    name: "Legal",
    guidelines: [
      {
        id: "5.1",
        title: "5.1 – Privacy",
        whatItMeans: "Apps must protect user data and clearly explain how it is collected and used.",
        commonRejections: [
          "Missing privacy policy",
          "Collecting data without consent",
          "Not explaining data usage",
        ],
        howToFix: [
          "Add a comprehensive privacy policy",
          "Get user consent for data collection",
          "Be transparent about data usage",
        ],
      },
      {
        id: "5.1.1",
        title: "5.1.1 – Data Collection and Storage",
        whatItMeans: "Apps must disclose what data they collect and how it is used.",
        commonRejections: [
          "Missing privacy policy",
          "Collecting data without user consent",
          "Not explaining how data is used",
          "Requesting permissions without justification",
        ],
        howToFix: [
          "Add a privacy policy (App Store + in-app)",
          "Clearly explain data usage",
          "Only collect necessary data",
          "Ensure transparency",
        ],
      },
      {
        id: "5.1.2",
        title: "5.1.2 – Data Use and Sharing",
        whatItMeans: "User data must not be misused or shared improperly.",
        commonRejections: [
          "Sharing data without user consent",
          "Using data for unrelated purposes",
        ],
        howToFix: [
          "Only use data for stated purposes",
          "Get explicit user consent",
        ],
      },
      {
        id: "5.1.3",
        title: "5.1.3 – Health and Health Research",
        whatItMeans: "Apps dealing with health data must follow strict rules.",
        commonRejections: [
          "Improper handling of health data",
          "Missing disclosures",
          "Collecting sensitive data without safeguards",
        ],
        howToFix: [
          "Clearly disclose data usage",
          "Follow health data standards",
          "Protect sensitive data",
        ],
      },
      {
        id: "5.1.4",
        title: "5.1.4 – Children's Privacy",
        whatItMeans: "Apps targeting children must comply with strict privacy laws.",
        commonRejections: [
          "Collecting personal data from children",
          "Lack of parental consent",
        ],
        howToFix: [
          "Avoid collecting personal data",
          "Implement parental controls",
        ],
      },
      {
        id: "5.1.5",
        title: "5.1.5 – Location Services",
        whatItMeans: "Apps must clearly explain use of location data.",
        commonRejections: [
          "Vague or misleading location permission prompts",
          "Collecting location data unnecessarily",
        ],
        howToFix: [
          "Clearly explain why location is needed",
          "Only request when necessary",
        ],
      },
      {
        id: "5.2",
        title: "5.2 – Intellectual Property",
        whatItMeans: "Apps must respect copyrights, trademarks, and other IP laws.",
        commonRejections: [
          "Using copyrighted content without permission",
          "Impersonating brands or individuals",
        ],
        howToFix: [
          "Use only licensed content",
          "Avoid impersonation",
        ],
      },
      {
        id: "5.3",
        title: "5.3 – Gaming, Gambling, and Lotteries",
        whatItMeans: "Apps involving gambling must follow strict regulations.",
        commonRejections: [
          "Missing proper licensing",
          "Operating in restricted regions",
          "Misleading gambling mechanics",
        ],
        howToFix: [
          "Obtain proper licenses",
          "Restrict regions if necessary",
          "Clearly explain mechanics",
        ],
      },
      {
        id: "5.4",
        title: "5.4 – VPN Apps",
        whatItMeans: "VPN apps must comply with specific requirements.",
        commonRejections: [
          "Misuse of VPN functionality",
          "Lack of transparency",
        ],
        howToFix: [
          "Clearly explain VPN usage",
          "Follow Apple's VPN rules",
        ],
      },
      {
        id: "5.5",
        title: "5.5 – MDM (Mobile Device Management)",
        whatItMeans: "Apps using device management must meet strict criteria.",
        commonRejections: [
          "Unauthorized device control",
          "Misuse of MDM features",
        ],
        howToFix: [
          "Ensure proper authorization",
          "Follow enterprise guidelines",
        ],
      },
      {
        id: "5.6",
        title: "5.6 – Developer Code of Conduct (Legal)",
        whatItMeans: "Developers must comply with all laws and regulations.",
        commonRejections: [
          "Violating local laws",
          "Non-compliant business practices",
        ],
        howToFix: [
          "Ensure full legal compliance",
          "Follow regional regulations",
        ],
      },
      {
        id: "5.7",
        title: "5.7 – Export Compliance",
        whatItMeans: "Apps must comply with export laws and regulations.",
        commonRejections: [
          "Missing export compliance information",
        ],
        howToFix: [
          "Provide accurate export compliance details",
        ],
      },
      {
        id: "5.8",
        title: "5.8 – Third-Party Content",
        whatItMeans: "Apps must properly handle third-party content and services.",
        commonRejections: [
          "Using third-party content without permission",
          "Improper integrations",
        ],
        howToFix: [
          "Ensure proper licensing",
          "Verify integrations",
        ],
      },
    ],
  },
];
