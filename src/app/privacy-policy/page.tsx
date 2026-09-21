import React from "react";
import { type Metadata } from "next";
import LegalPage from "~/components/legal-page";

export const metadata: Metadata = {
  title: "Privacy Policy | Archilles Dela Cruz",
  description: "Privacy policy for the Archilles Dela Cruz portfolio website, explaining how personal data is collected, used, and protected.",
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      subtitle="How I collect, use, and protect your personal information when you use this website."
      lastUpdated="September 21, 2026"
      groups={[
        {
          title: "Overview",
          sections: [
            {
              heading: "Who I am",
              paragraphs: [
                "This website (the \"Site\") is owned and operated by Archilles Dela Cruz, an aspiring software developer and IT specialist based in the Philippines.",
                "This Privacy Policy explains what information this Site collects when you visit or interact with it, and how that information is used and protected. By using the Site, you agree to the practices described in this policy.",
              ],
            },
            {
              heading: "Scope",
              paragraphs: [
                "This policy applies to information collected through this portfolio website only. External websites, such as GitHub, JobStreet, or Facebook, are governed by their own privacy policies, which I encourage you to review.",
              ],
            },
          ],
        },
        {
          title: "Information I Collect",
          sections: [
            {
              heading: "Information you provide directly",
              paragraphs: [
                "When you use the contact form or send me an email, you provide your name, email address, and any details included in your message. I use this information solely to respond to your inquiry.",
              ],
            },
            {
              heading: "Information collected automatically",
              list: [
                "Usage data such as pages visited, time spent, and referring sources.",
                "Technical data such as browser type, device type, and approximate region.",
                "Analytics data collected through cookies — see my Cookies Policy for more detail.",
              ],
            },
          ],
        },
        {
          title: "How I Use Your Information",
          sections: [
            {
              heading: "Purpose of processing",
              list: [
                "To respond to inquiries and messages you send through the contact form.",
                "To improve the content, performance, and usability of the Site.",
                "To understand visitor patterns so I can make the portfolio more useful to employers and collaborators.",
              ],
            },
            {
              heading: "No selling of data",
              paragraphs: [
                "I do not sell, rent, or trade your personal information to third parties. Your data is used only for the purposes described in this policy.",
              ],
            },
          ],
        },
        {
          title: "Cookies and Tracking",
          sections: [
            {
              heading: "Cookies",
              paragraphs: [
                "This Site may use cookies and similar technologies to remember preferences, analyze traffic, and improve your experience. You can control or disable cookies through your browser settings.",
                "For full details, please read my ",
              ],
            },
            {
              heading: "Analytics",
              paragraphs: [
                "The Site may use analytics tools that collect aggregated, anonymized usage data. This data cannot be used to personally identify you.",
              ],
            },
          ],
        },
        {
          title: "Data Sharing and Security",
          sections: [
            {
              heading: "Third-party services",
              paragraphs: [
                "Certain features rely on trusted third-party services such as hosting providers, analytics platforms, and the messaging service backing the contact form. These providers only receive the information required to perform their services and are obligated to keep it confidential.",
              ],
            },
            {
              heading: "Data security",
              paragraphs: [
                "I apply reasonable technical and organizational measures to protect your information. However, no method of transmission over the internet is fully secure, so I cannot guarantee absolute security.",
              ],
            },
            {
              heading: "Retention",
              paragraphs: [
                "Inquiries and correspondence are kept only as long as needed to respond to and follow up on your message, after which they are removed when no longer required.",
              ],
            },
          ],
        },
        {
          title: "Your Rights and Contact",
          sections: [
            {
              heading: "Your choices",
              list: [
                "Request a copy of the personal information I hold about you.",
                "Request correction or deletion of your personal information.",
                "Limit or opt out of non-essential cookies through your browser.",
                "Withdraw consent for any future processing at any time.",
              ],
            },
            {
              heading: "Contact me",
              paragraphs: [
                "If you have any questions about this Privacy Policy or how your data is handled, you can reach me at archillesdelacruzemail@gmail.com.",
              ],
            },
          ],
        },
      ]}
    />
  );
}