import React from "react";
import { type Metadata } from "next";
import ContactForm from "./contact-form";
import { Mail, Phone, MapPin } from "lucide-react";
import { Github, Jobstreet, Facebook } from "~/components/brand-icons";

export const metadata: Metadata = {
  title: "Contact Me | Archilles Dela Cruz",
  description: "Get in touch with Archilles Dela Cruz for Software Developer, Web Developer, IT, or office administration vacancies in the Philippines.",
};

const contacts = [
  {
    icon: <Mail className="h-5 w-5 text-blue-600" />,
    label: "Email Address",
    value: "archillesdelacruzemail@gmail.com",
    href: "mailto:archillesdelacruzemail@gmail.com",
  },
  {
    icon: <Phone className="h-5 w-5 text-indigo-600" />,
    label: "Phone Number",
    value: "0975 077 3561",
    href: "tel:09750773561",
  },
  {
    icon: <MapPin className="h-5 w-5 text-cyan-600" />,
    label: "Location",
    value: "Philippines",
    href: "https://maps.google.com/?q=Philippines",
  },
];

const socials = [
  {
    name: "JobStreet",
    icon: <Jobstreet className="h-5 w-5" />,
    href: "https://ph.jobstreet.com/profiles/archilles-delacruz-c1fvrLpmB4",
    color: "bg-blue-900 hover:bg-blue-950",
  },
  {
    name: "GitHub",
    icon: <Github className="h-5 w-5" />,
    href: "https://github.com/archillesdc06",
    color: "bg-slate-800 hover:bg-slate-900",
  },
  {
    name: "Facebook",
    icon: <Facebook className="h-5 w-5" />,
    href: "https://facebook.com/archillesdc",
    color: "bg-blue-700 hover:bg-blue-800",
  },
];

export default function ContactPage() {
  return (
    <div className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-5xl">
            Get In Touch
          </h1>
          <div className="h-1.5 w-16 bg-blue-600 rounded-full mx-auto" />
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Let&apos;s discuss job openings, project collaborations, or general technical inquiries.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-12 items-start">
          
          {/* Contact Information Cards */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-950 dark:text-white">Contact Information</h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
                Feel free to reach out directly through any of these communication channels or use the contact form. I try my best to respond within 24 hours.
              </p>
            </div>
            
            {/* Grid of channels */}
            <div className="space-y-4">
              {contacts.map((contact) => (
                <a
                  key={contact.label}
                  href={contact.href}
                  target={contact.label === "Location" ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="glass-panel flex items-center space-x-4 p-5 rounded-2xl shadow-xs hover:scale-[1.01] transition-transform duration-200 group"
                >
                  <div className="rounded-xl bg-blue-50 p-3 dark:bg-slate-900 shrink-0">
                    {contact.icon}
                  </div>
                  <div>
                    <span className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      {contact.label}
                    </span>
                    <span className="block text-sm sm:text-base font-semibold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {contact.value}
                    </span>
                  </div>
                </a>
              ))}
            </div>

            {/* Social profiles */}
            <div className="space-y-4 pt-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Connect on Social Networks
              </h3>
              <div className="flex space-x-3">
                {socials.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center justify-center p-3 text-white rounded-xl shadow-xs transition-transform duration-200 hover:scale-110 ${social.color}`}
                    title={social.name}
                    aria-label={`Connect via ${social.name}`}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form Card */}
          <div className="lg:col-span-7">
            <ContactForm />
          </div>

        </div>
      </div>
    </div>
  );
}

