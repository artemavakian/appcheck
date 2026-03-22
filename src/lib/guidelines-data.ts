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
        whatItMeans:
          "Apps must not include content that is offensive, insensitive, upsetting, intended to disgust, or in exceptionally poor taste.",
        commonRejections: [
          "Including graphic violence or gore without context",
          "Displaying sexually explicit material",
          "Using content that targets a specific group in a harmful way",
        ],
        howToFix: [
          "Review all in-app content for potentially offensive material",
          "Add content filters for user-generated content",
          "Include content warnings where appropriate",
        ],
      },
      {
        id: "1.1.6",
        title: "1.1.6 – False Information & Features",
        whatItMeans:
          "Apps should not contain false information or features that do not function as described.",
        commonRejections: [
          "Marketing the app as capable of something it cannot do",
          "Including fake reviews or testimonials",
          "Claiming features that don't exist in the app",
        ],
        howToFix: [
          "Ensure all marketed features are fully functional",
          "Remove any exaggerated claims from metadata",
          "Accurately describe all features in screenshots and descriptions",
        ],
      },
      {
        id: "1.2",
        title: "1.2 – User Generated Content",
        whatItMeans:
          "Apps with user-generated content must include features to filter, report, and block objectionable material and users.",
        commonRejections: [
          "No reporting mechanism for inappropriate content",
          "Missing content moderation or filtering",
          "No ability to block abusive users",
          "No system to handle objectionable content",
        ],
        howToFix: [
          "Add a content reporting feature accessible from every piece of UGC",
          "Implement real-time or manual content moderation",
          "Add user blocking functionality",
          "Create clear community guidelines visible to users",
        ],
      },
      {
        id: "1.3",
        title: "1.3 – Kids Category",
        whatItMeans:
          "Apps in the Kids category must follow strict rules for privacy, advertising, and content appropriateness.",
        commonRejections: [
          "Including third-party ads in a Kids app",
          "Collecting personal data from children without parental consent",
          "Linking out to external websites or apps",
          "Including social features without parental gates",
        ],
        howToFix: [
          "Remove all third-party advertising SDKs",
          "Implement parental gates for any external links or purchases",
          "Ensure COPPA compliance for data collection",
          "Review Apple's specific Kids category requirements",
        ],
      },
      {
        id: "1.4",
        title: "1.4 – Physical Harm",
        whatItMeans:
          "Apps must not encourage or facilitate physical harm to the user or others.",
        commonRejections: [
          "Health apps providing inaccurate medical advice",
          "Apps encouraging dangerous physical challenges",
          "Fitness apps without proper safety disclaimers",
        ],
        howToFix: [
          "Add medical disclaimers where health advice is provided",
          "Include safety warnings for physical activities",
          "Ensure medical data is sourced from qualified providers",
        ],
      },
      {
        id: "1.4.1",
        title: "1.4.1 – Medical & Health",
        whatItMeans:
          "Medical and health apps must clearly state they are not a replacement for professional medical advice and must provide accurate data.",
        commonRejections: [
          "No medical disclaimer present",
          "Providing diagnoses or treatment recommendations without proper sourcing",
          "Using non-validated health algorithms",
        ],
        howToFix: [
          "Add a prominent medical disclaimer throughout the app",
          "Source all health information from qualified medical professionals",
          "Clearly label any AI-generated health insights",
          "Include links to professional medical resources",
        ],
      },
      {
        id: "1.5",
        title: "1.5 – Developer Information",
        whatItMeans:
          "Apps must have a publicly available way for users to contact the developer.",
        commonRejections: [
          "No support URL provided in App Store Connect",
          "Support email or URL is invalid or broken",
          "No way for users to report issues",
        ],
        howToFix: [
          "Provide a valid support URL in App Store Connect",
          "Ensure the support email is monitored and functional",
          "Include an in-app support or feedback mechanism",
        ],
      },
      {
        id: "1.6",
        title: "1.6 – Data Security",
        whatItMeans:
          "Apps must implement appropriate security measures to protect user data.",
        commonRejections: [
          "Transmitting sensitive data over unencrypted connections",
          "Storing passwords in plain text",
          "Not implementing App Transport Security (ATS)",
        ],
        howToFix: [
          "Use HTTPS for all network connections",
          "Encrypt sensitive data at rest",
          "Implement App Transport Security properly",
          "Follow iOS Keychain best practices for credentials",
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
        whatItMeans:
          "Apps submitted for review must be final versions with all features functional. Incomplete apps, crashes, or broken links will be rejected.",
        commonRejections: [
          "App crashes on launch or during basic use",
          "Placeholder content like lorem ipsum or test data",
          "Features marked as 'coming soon' or behind broken buttons",
          "Dead links or missing assets",
          "Broken login or registration flows",
        ],
        howToFix: [
          "Test thoroughly on all supported devices and OS versions",
          "Replace all placeholder content with final production content",
          "Remove or hide any unfinished features",
          "Verify all links, buttons, and navigation paths work correctly",
          "Provide demo credentials if login is required",
        ],
      },
      {
        id: "2.2",
        title: "2.2 – Beta Testing",
        whatItMeans:
          "Beta versions of apps should be tested through TestFlight, not submitted to the App Store.",
        commonRejections: [
          "Submitting a beta or pre-release version to the App Store",
          "Including 'beta' or 'test' in the app name or metadata",
          "Clearly unfinished features present in the build",
        ],
        howToFix: [
          "Use TestFlight for all beta testing",
          "Remove any beta labeling before App Store submission",
          "Ensure the submitted build is production-ready",
        ],
      },
      {
        id: "2.3",
        title: "2.3 – Accurate Metadata",
        whatItMeans:
          "All app metadata including name, description, screenshots, and previews must accurately reflect the app's content and functionality.",
        commonRejections: [
          "App name doesn't match the app's function",
          "Keywords stuffing or irrelevant keywords",
          "Category doesn't match the app's primary function",
        ],
        howToFix: [
          "Choose a name that clearly represents your app",
          "Use only relevant keywords in the keyword field",
          "Select the most accurate primary and secondary categories",
        ],
      },
      {
        id: "2.3.1",
        title: "2.3.1 – Accurate Screenshots & Metadata",
        whatItMeans:
          "Screenshots and app previews must accurately show the app in use. They should not include misleading images, pricing, or features that don't exist.",
        commonRejections: [
          "Screenshots showing features not in the app",
          "Using stock photos instead of actual app screenshots",
          "Screenshots from a different device or platform",
          "Including pricing that may vary by region",
          "Misleading app preview videos",
        ],
        howToFix: [
          "Capture screenshots directly from the current build",
          "Only show features that are fully implemented",
          "Remove any specific pricing from screenshots",
          "Ensure previews accurately demonstrate real app functionality",
        ],
      },
      {
        id: "2.3.3",
        title: "2.3.3 – Screenshots Size & Format",
        whatItMeans:
          "Screenshots must meet Apple's specific size requirements for each device type.",
        commonRejections: [
          "Wrong screenshot dimensions for the device type",
          "Missing required device sizes",
          "Screenshots contain excessive bezels or borders",
        ],
        howToFix: [
          "Use Apple's recommended screenshot dimensions",
          "Provide screenshots for all required device sizes",
          "Use actual device screenshots rather than mocked frames",
        ],
      },
      {
        id: "2.3.7",
        title: "2.3.7 – Accurate App Ratings",
        whatItMeans:
          "The app's content rating must accurately reflect the content within the app.",
        commonRejections: [
          "Rating too low for the content present",
          "Not updating rating after adding mature content",
          "Gambling content without proper age rating",
        ],
        howToFix: [
          "Honestly complete the age rating questionnaire",
          "Update ratings when adding new content types",
          "Err on the side of a higher rating if unsure",
        ],
      },
      {
        id: "2.3.8",
        title: "2.3.8 – Privacy Policy URL",
        whatItMeans:
          "All apps must have a privacy policy URL that is accessible and clearly describes data practices.",
        commonRejections: [
          "Missing privacy policy URL in App Store Connect",
          "Privacy policy page is broken or returns 404",
          "Privacy policy doesn't cover the app's actual data practices",
        ],
        howToFix: [
          "Add a valid, accessible privacy policy URL",
          "Ensure the policy covers all data your app collects",
          "Keep the policy up to date with any app changes",
        ],
      },
      {
        id: "2.4",
        title: "2.4 – Hardware Compatibility",
        whatItMeans:
          "Apps must work on the devices they claim to support and should not reference hardware that doesn't exist on the target device.",
        commonRejections: [
          "iPad app doesn't work properly on all supported iPad models",
          "App requires hardware features not present on all supported devices",
          "UI doesn't adapt to different screen sizes",
        ],
        howToFix: [
          "Test on all device types listed in your support matrix",
          "Use capability checks before accessing hardware features",
          "Implement responsive layouts for all screen sizes",
        ],
      },
      {
        id: "2.4.5",
        title: "2.4.5 – Multitasking Support",
        whatItMeans:
          "iPad apps must support multitasking (Split View and Slide Over) unless there is a justified reason not to.",
        commonRejections: [
          "iPad app doesn't support Split View",
          "App crashes or breaks during multitasking",
          "Layout doesn't adapt to split-screen sizes",
        ],
        howToFix: [
          "Enable multitasking support in your app's capabilities",
          "Test Split View and Slide Over on iPad",
          "Ensure layouts adapt to all multitasking configurations",
        ],
      },
      {
        id: "2.5.1",
        title: "2.5.1 – Software Requirements",
        whatItMeans:
          "Apps must use public APIs and must not use private or undocumented APIs.",
        commonRejections: [
          "Using private or undocumented Apple APIs",
          "Including deprecated APIs that have been removed",
          "Using APIs in ways not intended by Apple",
        ],
        howToFix: [
          "Audit all API usage and replace private APIs with public alternatives",
          "Stay updated with Apple's API deprecation notices",
          "Use only documented, public APIs from the iOS SDK",
        ],
      },
      {
        id: "2.5.2",
        title: "2.5.2 – App Bundles",
        whatItMeans:
          "Apps must be self-contained and should not install or execute other code beyond what is in the approved bundle.",
        commonRejections: [
          "Downloading and executing code after review",
          "Including hidden features that activate post-review",
          "Side-loading additional executables",
        ],
        howToFix: [
          "Include all functionality in the submitted app bundle",
          "Use approved methods for dynamic content (like web views for HTML content)",
          "Don't hide features that activate after App Store approval",
        ],
      },
      {
        id: "2.5.4",
        title: "2.5.4 – Background Processes",
        whatItMeans:
          "Multitasking apps may only use background services for their intended purposes (audio, location, VoIP, etc.).",
        commonRejections: [
          "Using background audio mode for non-audio features",
          "Continuous background location tracking without justification",
          "Excessive battery drain from background processes",
        ],
        howToFix: [
          "Only enable background modes your app genuinely needs",
          "Provide justification for background location use",
          "Optimize background tasks to minimize battery impact",
        ],
      },
    ],
  },
  {
    id: "3",
    name: "Business",
    guidelines: [
      {
        id: "3.1.1",
        title: "3.1.1 – In-App Purchases",
        whatItMeans:
          "Digital goods and services sold within the app must use Apple's in-app purchase system. External payment methods are not allowed for digital content.",
        commonRejections: [
          "Using external payment processors for digital content",
          "Linking users to a website to make purchases",
          "Unlocking digital features without Apple IAP",
          "Directing users to avoid Apple's payment system",
        ],
        howToFix: [
          "Use Apple In-App Purchases (StoreKit) for all digital goods",
          "Remove external payment links for digital content",
          "Ensure subscriptions are configured through App Store Connect",
          "Physical goods and services may use external payment",
        ],
      },
      {
        id: "3.1.2",
        title: "3.1.2 – Subscriptions",
        whatItMeans:
          "Auto-renewable subscriptions must use Apple's subscription system and clearly communicate pricing, duration, and cancellation terms.",
        commonRejections: [
          "Subscription terms not clearly presented before purchase",
          "No mention of auto-renewal in the UI",
          "Missing link to Apple's subscription management",
          "Free trial terms not clearly explained",
        ],
        howToFix: [
          "Display subscription price, duration, and renewal terms before purchase",
          "Include a link to manage/cancel subscriptions in app settings",
          "Clearly communicate free trial length and what happens after",
          "Follow Apple's subscription best practices for UI",
        ],
      },
      {
        id: "3.1.3",
        title: "3.1.3 – Other Purchase Methods",
        whatItMeans:
          "Physical goods, real-world services, and certain reader apps may use external payment methods.",
        commonRejections: [
          "Misclassifying digital goods as physical goods to avoid IAP",
          "Not clearly distinguishing between digital and physical offerings",
          "Using reader app exemptions incorrectly",
        ],
        howToFix: [
          "Clearly separate physical goods from digital goods in your app",
          "Use IAP for all digital content regardless of delivery method",
          "Apply for reader app entitlements if applicable",
        ],
      },
      {
        id: "3.1.5",
        title: "3.1.5 – Cryptocurrencies",
        whatItMeans:
          "Apps may facilitate cryptocurrency transactions but must comply with all applicable laws and regulations in supported regions.",
        commonRejections: [
          "Facilitating initial coin offerings (ICOs)",
          "Enabling cryptocurrency mining on device",
          "Not complying with financial regulations in target regions",
        ],
        howToFix: [
          "Ensure compliance with financial regulations in all target markets",
          "Don't include crypto mining functionality",
          "Provide clear disclosures about cryptocurrency risks",
        ],
      },
      {
        id: "3.1.7",
        title: "3.1.7 – Advertising",
        whatItMeans:
          "Ads in apps must be appropriate and should not interfere with the user experience.",
        commonRejections: [
          "Fullscreen ads that can't be dismissed",
          "Ads that mimic system alerts or notifications",
          "Ads displayed in Kids category apps using prohibited SDKs",
        ],
        howToFix: [
          "Ensure all ads have a visible close/dismiss button",
          "Don't disguise ads as system alerts",
          "Use Apple-approved ad networks in Kids apps",
          "Limit ad frequency to maintain a good user experience",
        ],
      },
      {
        id: "3.2",
        title: "3.2 – Other Business Model Issues",
        whatItMeans:
          "Apps must not create a store within the App Store or offer products for sale that don't clearly belong to the developer.",
        commonRejections: [
          "Creating a marketplace for other apps",
          "Reselling digital content from third parties without authorization",
          "Offering products that are essentially app stores",
        ],
        howToFix: [
          "Ensure your business model doesn't replicate the App Store",
          "Have proper licensing for any third-party content",
          "Focus on your app's unique value proposition",
        ],
      },
      {
        id: "3.2.1",
        title: "3.2.1 – Acceptable Business Models",
        whatItMeans:
          "Apps should not be designed primarily to make the developer money through trickery or manipulation.",
        commonRejections: [
          "Subscription traps with misleading free trial UI",
          "Dark patterns that trick users into purchases",
          "Bait-and-switch pricing tactics",
        ],
        howToFix: [
          "Make pricing and subscription terms crystal clear",
          "Don't use dark patterns to drive purchases",
          "Provide genuine value proportional to the price",
        ],
      },
      {
        id: "3.2.2",
        title: "3.2.2 – Unacceptable Business Models",
        whatItMeans:
          "Certain business models are not allowed, including apps that serve as storefronts for other apps or that manipulate reviews.",
        commonRejections: [
          "Incentivizing users to leave positive reviews",
          "Creating fake or manipulated review counts",
          "Apps whose sole purpose is to promote other apps",
        ],
        howToFix: [
          "Use Apple's standard SKStoreReviewController for review prompts",
          "Don't offer incentives for reviews",
          "Focus on organic user engagement",
        ],
      },
    ],
  },
  {
    id: "4",
    name: "Design",
    guidelines: [
      {
        id: "4.0",
        title: "4.0 – Design Overview",
        whatItMeans:
          "Apple places high value on clean, refined, and intuitive design. Apps must meet a minimum quality bar.",
        commonRejections: [
          "Extremely basic UI that doesn't meet quality expectations",
          "Inconsistent design language throughout the app",
          "Non-native UI elements that look out of place on iOS",
        ],
        howToFix: [
          "Follow Apple's Human Interface Guidelines",
          "Maintain a consistent design system throughout the app",
          "Use native iOS components where appropriate",
        ],
      },
      {
        id: "4.1",
        title: "4.1 – Copycats",
        whatItMeans:
          "Apps must be original and should not copy other popular apps' UI, features, or content.",
        commonRejections: [
          "Cloning the UI of a well-known app",
          "Using another app's branding or visual identity",
          "Repackaging someone else's app with minor changes",
        ],
        howToFix: [
          "Create an original design for your app",
          "If inspired by another app, make substantial differentiation",
          "Ensure your app has its own unique identity and value",
        ],
      },
      {
        id: "4.2",
        title: "4.2 – Minimum Functionality",
        whatItMeans:
          "Apps must provide real value beyond a repackaged website, a simple wrapper, or a trivially basic tool. The app must offer features that justify its existence as a standalone application.",
        commonRejections: [
          "WebView-only app that just wraps a website",
          "App with no meaningful functionality",
          "Simple web clip or bookmark-style app",
          "App that duplicates built-in iOS functionality without improvement",
          "Marketing-only apps with no interactive features",
        ],
        howToFix: [
          "Add native features like push notifications, offline access, or device integrations",
          "Ensure the app provides a better experience than the mobile website",
          "Include substantial functionality that justifies a native app",
          "Add at least several screens of unique, valuable content or interaction",
        ],
      },
      {
        id: "4.2.3",
        title: "4.2.3 – App Previews",
        whatItMeans:
          "App preview videos must only show content from the app itself, captured on the device.",
        commonRejections: [
          "Using footage not captured from the actual app",
          "Including stock video or animations not in the app",
          "Preview doesn't match the current version of the app",
        ],
        howToFix: [
          "Record app previews directly from the app",
          "Keep previews updated with each major version",
          "Only show real functionality in preview videos",
        ],
      },
      {
        id: "4.3",
        title: "4.3 – Spam",
        whatItMeans:
          "Don't submit multiple versions of the same app or apps that are very similar. Quality over quantity.",
        commonRejections: [
          "Submitting near-identical apps with different themes or skins",
          "Creating multiple apps that could be one app with sections",
          "Template apps with minimal unique content",
        ],
        howToFix: [
          "Consolidate similar functionality into a single app",
          "Use in-app themes or customization instead of separate apps",
          "Ensure each app has a genuinely unique purpose",
        ],
      },
      {
        id: "4.4",
        title: "4.4 – Extensions",
        whatItMeans:
          "App extensions must provide functionality and should not be used just for marketing or advertising.",
        commonRejections: [
          "Extensions that don't function independently",
          "Using extensions purely for advertising the main app",
          "Keyboard extensions that access the network without good reason",
        ],
        howToFix: [
          "Ensure extensions provide standalone value",
          "Follow extension-specific guidelines for each extension type",
          "Only request network access in keyboard extensions if truly needed",
        ],
      },
      {
        id: "4.5",
        title: "4.5 – Apple Sites & Services",
        whatItMeans:
          "Apps should not misuse Apple services like iCloud, Game Center, or Apple Pay.",
        commonRejections: [
          "Using iCloud for unrelated data storage beyond intended use",
          "Misusing Game Center achievements or leaderboards",
          "Implementing Apple Pay incorrectly",
        ],
        howToFix: [
          "Use Apple services as they're intended",
          "Follow Apple's implementation guides for each service",
          "Test all Apple service integrations thoroughly",
        ],
      },
      {
        id: "4.7",
        title: "4.7 – HTML5 Games & Apps",
        whatItMeans:
          "HTML5-based apps and games distributed through the App Store must follow all App Store guidelines.",
        commonRejections: [
          "HTML5 app that could simply be a website",
          "Poor performance or non-native feel",
          "Loading content from servers that changes app functionality",
        ],
        howToFix: [
          "Optimize HTML5 content for mobile performance",
          "Add native wrapper functionality beyond the HTML5 content",
          "Don't dynamically change core app functionality via remote content",
        ],
      },
      {
        id: "4.8",
        title: "4.8 – Sign in with Apple",
        whatItMeans:
          "Apps that offer third-party sign-in (Google, Facebook, etc.) must also offer Sign in with Apple as an option.",
        commonRejections: [
          "Offering Google/Facebook login without Sign in with Apple",
          "Sign in with Apple button is hidden or hard to find",
          "Not following Apple's Sign in with Apple UI guidelines",
          "Sign in with Apple flow is broken or incomplete",
        ],
        howToFix: [
          "Add Sign in with Apple whenever third-party login is available",
          "Give Sign in with Apple equal or greater prominence than other options",
          "Follow Apple's Human Interface Guidelines for the button design",
          "Test the full Sign in with Apple flow end-to-end",
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
        whatItMeans:
          "Apps must respect user privacy and handle personal data in accordance with applicable laws and Apple's guidelines.",
        commonRejections: [
          "Collecting data without user consent",
          "Not providing a privacy policy",
          "Sharing user data with third parties without disclosure",
        ],
        howToFix: [
          "Implement clear consent flows for data collection",
          "Provide a comprehensive, accessible privacy policy",
          "Disclose all data sharing with third parties",
        ],
      },
      {
        id: "5.1.1",
        title: "5.1.1 – Data Collection and Storage",
        whatItMeans:
          "Apps that collect user data must have a privacy policy, request only necessary data, and handle it securely. Permission purpose strings must clearly explain why data is needed.",
        commonRejections: [
          "No privacy policy provided",
          "Collecting data not needed for the app's functionality",
          "Permission purpose strings are vague or missing",
          "Accessing contacts, photos, or location without clear explanation",
          "Not implementing App Tracking Transparency when required",
        ],
        howToFix: [
          "Add a privacy policy URL in App Store Connect and in the app",
          "Only request data that is essential to the app's functionality",
          "Write clear, specific permission purpose strings (NSCameraUsageDescription, etc.)",
          "Implement ATT framework if tracking users across apps/websites",
          "Allow the app to function (in limited capacity) even if permissions are denied",
        ],
      },
      {
        id: "5.1.1v",
        title: "5.1.1(v) – Account Deletion",
        whatItMeans:
          "Apps that allow account creation must also allow users to initiate deletion of their account from within the app.",
        commonRejections: [
          "No account deletion option in the app",
          "Account deletion requires emailing support",
          "Deletion option is buried or hidden",
          "Account is 'deactivated' instead of deleted",
        ],
        howToFix: [
          "Add a clear account deletion option in app settings",
          "Make deletion accessible within 2-3 taps from settings",
          "Actually delete user data, not just deactivate the account",
          "Confirm deletion with the user before proceeding",
        ],
      },
      {
        id: "5.1.2",
        title: "5.1.2 – Data Use and Sharing",
        whatItMeans:
          "Apps must not share user data with third parties without user consent and must not sell data to data brokers.",
        commonRejections: [
          "Sharing user data with ad networks without proper consent",
          "Privacy nutrition label doesn't match actual data practices",
          "Using data for purposes beyond what was disclosed",
        ],
        howToFix: [
          "Accurately complete the privacy nutrition labels in App Store Connect",
          "Get explicit consent before sharing data with third parties",
          "Audit all SDKs for data collection and sharing practices",
        ],
      },
      {
        id: "5.1.3",
        title: "5.1.3 – Health & Fitness Data",
        whatItMeans:
          "Health and fitness data collected by the app must not be shared with third parties for advertising or data mining.",
        commonRejections: [
          "Sharing HealthKit data with advertising services",
          "Using health data for purposes beyond health management",
          "Not encrypting health data in transit and at rest",
        ],
        howToFix: [
          "Never share HealthKit data with advertisers",
          "Use health data only for health and fitness purposes",
          "Encrypt all health data both in transit and at rest",
        ],
      },
      {
        id: "5.1.4",
        title: "5.1.4 – Kids Data",
        whatItMeans:
          "Apps in the Kids category or that collect data from children must comply with COPPA and other relevant laws.",
        commonRejections: [
          "Collecting personal information from children without parental consent",
          "Including analytics SDKs that track children",
          "Sending data to third parties from a Kids app",
        ],
        howToFix: [
          "Implement age verification or parental consent mechanisms",
          "Remove analytics SDKs that collect personal data from children",
          "Review COPPA requirements thoroughly",
        ],
      },
      {
        id: "5.1.5",
        title: "5.1.5 – Location Services",
        whatItMeans:
          "Apps must only request location data when necessary and must clearly explain why location is needed.",
        commonRejections: [
          "Requesting 'Always' location when 'While Using' would suffice",
          "No clear explanation for why location is needed",
          "Continuous background location without justification",
        ],
        howToFix: [
          "Request the minimum location permission needed",
          "Write a clear purpose string explaining location use",
          "Only use background location if essential to the app's core function",
        ],
      },
      {
        id: "5.2",
        title: "5.2 – Intellectual Property",
        whatItMeans:
          "Apps must not infringe on third-party intellectual property rights including trademarks, copyrights, and patents.",
        commonRejections: [
          "Using copyrighted content without permission",
          "Infringing on another company's trademark",
          "Using third-party code without proper licensing",
        ],
        howToFix: [
          "Ensure you have rights to all content in your app",
          "Don't use trademarked names or logos without permission",
          "Properly license all third-party code and assets",
        ],
      },
      {
        id: "5.2.1",
        title: "5.2.1 – Generally",
        whatItMeans:
          "Don't use protected third-party material in your app without documented permission.",
        commonRejections: [
          "Using celebrity likenesses without authorization",
          "Including copyrighted music or media",
          "Using protected brand names in marketing",
        ],
        howToFix: [
          "Obtain written permission for any third-party content",
          "Use royalty-free or properly licensed assets",
          "Remove any unauthorized copyrighted material",
        ],
      },
      {
        id: "5.2.3",
        title: "5.2.3 – Audio/Video Downloading",
        whatItMeans:
          "Apps must not facilitate unauthorized downloading of copyrighted audio or video content.",
        commonRejections: [
          "Allowing download of copyrighted YouTube or music content",
          "Providing tools to circumvent DRM",
          "Caching copyrighted streaming content for offline use without rights",
        ],
        howToFix: [
          "Only allow downloading of content you have rights to distribute",
          "Don't build tools that circumvent content protection",
          "Use official APIs for any streaming service integration",
        ],
      },
      {
        id: "5.3",
        title: "5.3 – Gaming, Gambling, and Lotteries",
        whatItMeans:
          "Apps involving real-money gambling must have proper licensing and be restricted to jurisdictions where it's legal.",
        commonRejections: [
          "Real-money gambling without proper licenses",
          "Not restricting gambling features to legal jurisdictions",
          "Simulated gambling targeting minors",
        ],
        howToFix: [
          "Obtain and verify proper gambling licenses",
          "Implement geo-restriction for gambling features",
          "Set appropriate age ratings and restrictions",
        ],
      },
      {
        id: "5.3.4",
        title: "5.3.4 – Gambling",
        whatItMeans:
          "Real-money gambling apps require verified gambling licenses and must be geo-restricted to legal jurisdictions.",
        commonRejections: [
          "No gambling license provided in App Review notes",
          "Gambling features available in jurisdictions where it's illegal",
          "No age verification for gambling features",
        ],
        howToFix: [
          "Provide gambling license documentation to App Review",
          "Implement geofencing to restrict to licensed jurisdictions",
          "Add age verification before allowing gambling",
          "Include responsible gambling resources",
        ],
      },
      {
        id: "5.4",
        title: "5.4 – VPN Apps",
        whatItMeans:
          "VPN apps must use the NEVPNManager API and must not sell or share user data.",
        commonRejections: [
          "Not using NEVPNManager for VPN functionality",
          "Collecting and selling VPN traffic data",
          "VPN app that is primarily used to circumvent geo-restrictions for piracy",
        ],
        howToFix: [
          "Use NEVPNManager API for all VPN functionality",
          "Have a clear no-logging policy",
          "Be transparent about your VPN's data handling practices",
        ],
      },
      {
        id: "5.5",
        title: "5.5 – Mobile Device Management",
        whatItMeans:
          "MDM capabilities must not be used for purposes other than legitimate enterprise device management.",
        commonRejections: [
          "Using MDM profiles for consumer apps",
          "MDM functionality used for tracking or surveillance",
          "Distributing MDM profiles outside of enterprise use",
        ],
        howToFix: [
          "Only use MDM for legitimate enterprise management",
          "Don't include MDM profiles in consumer-facing apps",
          "Follow Apple's enterprise distribution guidelines",
        ],
      },
      {
        id: "5.6",
        title: "5.6 – Developer Code of Conduct",
        whatItMeans:
          "Developers must act with integrity and not manipulate the App Store through fake reviews, paid installs, or deceptive practices.",
        commonRejections: [
          "Purchasing fake reviews or ratings",
          "Using paid install services to manipulate rankings",
          "Creating fraudulent accounts for reviews",
        ],
        howToFix: [
          "Focus on genuine user engagement and organic growth",
          "Use SKStoreReviewController for review prompts",
          "Never pay for reviews, ratings, or installs",
        ],
      },
    ],
  },
];
