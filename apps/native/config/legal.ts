import { appConfig } from "./app";

export type LegalSection = {
  title: string;
  paragraphs: string[];
  bullets?: string[];
  subsections?: { title: string; bullets: string[] }[];
};

const name = appConfig.name;

export function getPrivacyPolicySections(): LegalSection[] {
  return [
    {
      title: "1. Information We Collect",
      paragraphs: [
        `When you create a ${name} account and use the service, we may collect:`,
      ],
      bullets: [
        "Account information such as your email address and display name",
        "Profile information you provide during onboarding: country, city, and optionally your date of birth",
        "Your timezone, detected from your device and editable by you",
        "The prayer categories you select as interests",
        "Your prayer subscriptions, prayer confirmations, hearts, and comments",
        "Your notification preferences, including any phone number you provide for SMS reminders",
        "Device information and usage analytics",
      ],
    },
    {
      title: "2. How We Use Your Information",
      paragraphs: ["We use your information to:"],
      bullets: [
        "Show you prayer sessions at the correct time in your local timezone",
        "Send the prayer reminders you have asked for, on the channels you selected",
        "Recommend prayer requests based on your interests and country",
        "Show community participation counts for prayer sessions",
        "Keep the community safe by moderating reported content",
        "Improve the app and understand how the service is used",
      ],
    },
    {
      title: "3. Timezone and Location Data",
      paragraphs: [
        `${name} is a global service, so timezone handling is central to how it works:`,
      ],
      bullets: [
        "Your timezone is used to convert prayer schedules into your local time",
        "Your country and city are used for discovery (“In Your Country”) and for aggregate statistics",
        "We do not collect precise GPS location",
        "Aggregate country counts shown on prayer sessions never identify individual members",
      ],
    },
    {
      title: "4. Community Content",
      paragraphs: [
        "Comments, replies, and hearts you post are visible to other members of the community:",
      ],
      bullets: [
        "Your display name and country may be shown alongside your comments",
        "Prayer confirmations (“I Prayed”) are counted in aggregate and are not published as a per-member list",
        "You can delete your own comments at any time",
        "Moderators may hide or delete comments that violate our community standards",
      ],
    },
    {
      title: "5. Notifications, SMS, and Email",
      paragraphs: ["You control how we reach you:"],
      bullets: [
        "Push notifications, SMS, and email can each be enabled or disabled independently",
        "SMS requires explicit opt-in and can be turned off at any time",
        "Your phone number is used only to deliver the reminders you requested",
        "Transactional account emails may still be sent while your account is active",
      ],
    },
    {
      title: "6. Optional Contributions",
      paragraphs: [
        `${name} is supported by its community. Contributions are entirely optional and are never required to use any prayer functionality. Purchases are handled by the Apple App Store or Google Play Store. We do not collect, store, or have access to your payment information.`,
      ],
    },
    {
      title: "7. Data Sharing and Disclosure",
      paragraphs: [
        "We do not sell, trade, or otherwise transfer your personal information to third parties, except:",
      ],
      bullets: [
        "When required by law or legal process",
        "To protect our rights, property, or the safety of our members",
        "With service providers who deliver notifications, SMS, and email on our behalf, under confidentiality agreements",
      ],
    },
    {
      title: "8. Data Security",
      paragraphs: [
        "We implement appropriate security measures to protect your information:",
      ],
      bullets: [
        "Encryption in transit and at rest",
        "Secure servers with regular security updates",
        "Rate limiting and abuse detection on community features",
        "Regular security review and monitoring",
      ],
    },
    {
      title: "9. Your Rights",
      paragraphs: ["You have the right to:"],
      bullets: [
        "Access the information associated with your account",
        "Correct your profile, timezone, and interests at any time",
        "Delete your account and the data associated with it",
        "Opt out of analytics collection",
        "Withdraw consent for SMS or email communication",
      ],
    },
    {
      title: "10. Children's Privacy",
      paragraphs: [
        "Our service is not intended for children under 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately.",
      ],
    },
    {
      title: "11. International Users",
      paragraphs: [
        `${name} is designed for a global community. Your information may be transferred to, stored, and processed in countries other than your own, where our servers and service providers are located.`,
      ],
    },
    {
      title: "12. Changes to This Privacy Policy",
      paragraphs: [
        'We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.',
      ],
    },
    {
      title: "13. Contact Us",
      paragraphs: [
        "If you have any questions about this Privacy Policy or our data practices, please contact us at:",
      ],
    },
  ];
}

export function getTermsOfServiceSections(): LegalSection[] {
  return [
    {
      title: "1. Acceptance of Terms",
      paragraphs: [
        `By accessing and using ${name} ("the Service"), you accept and agree to be bound by these terms. If you do not agree to abide by them, please do not use this service.`,
      ],
    },
    {
      title: "2. Description of Service",
      paragraphs: [
        `${name} is a community prayer platform that helps people around the world pray together for shared causes at scheduled times. The service includes:`,
      ],
      bullets: [
        "Prayer requests and scheduled prayer sessions created by moderators",
        "Timezone-aware schedules and reminders",
        "Prayer subscriptions and participation confirmation",
        "Community comments, replies, and hearts",
        "Optional contributions to support the mission",
      ],
    },
    {
      title: "3. Accounts",
      paragraphs: [
        "Registration is required to use the service. You agree to:",
      ],
      bullets: [
        "Provide accurate registration and profile information",
        "Keep your account credentials secure",
        "Be responsible for activity that occurs under your account",
        "Notify us promptly of any unauthorized use",
      ],
    },
    {
      title: "4. Community Standards",
      paragraphs: [
        "Prayer requests often concern disasters, illness, bereavement, conflict, and other sensitive situations. The community feed exists for prayer and encouragement. You agree not to post:",
      ],
      bullets: [
        "Harassment, hatred, bullying, threats, or incitement to violence",
        "Content that mocks or exploits the people a prayer request concerns",
        "Sexually explicit content",
        "Personal or private information about others without their consent",
        "Spam, solicitations, scams, phishing, or fundraising appeals",
        "Impersonation of another person, a moderator, or an organization",
        "Medical, legal, or financial advice presented as professional guidance",
      ],
    },
    {
      title: "5. Moderator-Created Content",
      paragraphs: [
        "Official prayer requests are created and maintained by moderators:",
      ],
      bullets: [
        "Moderators define prayer requests, categories, regions, and schedules",
        "Moderator-created information is clearly distinguished from community comments",
        "Moderators may edit, close, archive, or feature prayer requests",
        "Moderators may hide or delete comments, lock discussion, and review reports",
      ],
    },
    {
      title: "6. Participation Data",
      paragraphs: ["Regarding prayer participation:"],
      bullets: [
        'Confirming "I Prayed" records your participation for that prayer occurrence',
        "Confirmation is idempotent — repeated taps do not increase the count",
        "An unconfirmed session is only recorded as unconfirmed; it is never recorded as a member not having prayed",
        "Participation totals are shown in aggregate to the community and to moderators",
      ],
    },
    {
      title: "7. Prayer Commitments",
      paragraphs: [
        `To keep commitments meaningful, a member may commit to at most ${appConfig.prayer.maxConcurrentCommitments} prayer sessions occurring at the same time. This limit applies to overlapping occurrences, not to the total number of subscriptions. We may adjust this limit with reasonable notice.`,
      ],
    },
    {
      title: "8. Contributions",
      paragraphs: [
        "Contributions are optional and support the operation of the platform:",
      ],
      bullets: [
        "No prayer functionality is gated behind a contribution",
        "All billing, renewals, and cancellations are managed by Apple or Google",
        "To manage or cancel a recurring contribution, use your device's App Store or Play Store settings",
      ],
    },
    {
      title: "9. Your Content",
      paragraphs: ["Regarding content you post:"],
      bullets: [
        "You retain ownership of the comments and replies you write",
        "You grant us permission to display your content within the service",
        `The ${name} name, design, and software are protected by copyright`,
        "You may not scrape, redistribute, or resell content from the service",
      ],
    },
    {
      title: "10. Reminders and Delivery",
      paragraphs: [
        "We make a reasonable effort to deliver reminders at the correct local time, but:",
      ],
      bullets: [
        "Delivery depends on your device, network, operating system, and carrier",
        "Push, SMS, and email delivery cannot be guaranteed",
        "Timezone changes while travelling may take effect on the next scheduled occurrence",
        "You remain responsible for your own participation",
      ],
    },
    {
      title: "11. Disclaimer of Warranties",
      paragraphs: [
        'The service is provided "as is" without warranties of any kind:',
      ],
      bullets: [
        "We do not guarantee uninterrupted or error-free operation",
        "We do not provide medical, legal, financial, or professional advice",
        "Prayer requests describe events as reported to moderators and may be incomplete",
        "The service may have technical limitations or interruptions",
      ],
    },
    {
      title: "12. Limitation of Liability",
      paragraphs: ["To the fullest extent permitted by law:"],
      bullets: [
        "We are not liable for any indirect, incidental, or consequential damages",
        "Our total liability shall not exceed the amount you paid us, if any",
        "We are not responsible for decisions made on the basis of content in the service",
      ],
    },
    {
      title: "13. Reporting and Enforcement",
      paragraphs: ["To keep the community safe:"],
      bullets: [
        "Any member can report a comment for review",
        "Members can block other members",
        "Automated spam detection and rate limiting apply to community features",
        "Repeated violations may result in restricted access or account removal",
        "Appeals can be submitted through our support channel",
      ],
    },
    {
      title: "14. Service Access",
      paragraphs: [
        "We reserve the right to restrict access for members who violate these terms. You may stop using the service and delete your account at any time.",
      ],
    },
    {
      title: "15. Age Restrictions",
      paragraphs: [
        "Members must be at least 13 years old to use this service. Members under 18 should have parental supervision.",
      ],
    },
    {
      title: "16. Changes to Terms",
      paragraphs: [
        "We reserve the right to modify these terms at any time. Members will be notified of significant changes, and continued use of the service constitutes acceptance of the modified terms.",
      ],
    },
    {
      title: "17. Governing Law",
      paragraphs: [
        "These terms shall be governed by and construed in accordance with applicable law, without regard to conflict of law provisions.",
      ],
    },
    {
      title: "18. Contact Information",
      paragraphs: [
        "If you have any questions about these Terms of Service, please contact us at:",
      ],
    },
  ];
}
