"use client";

import React, { useState } from "react";
import { api } from "~/trpc/react";
import { Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  const sendMessageMutation = api.portfolio.sendContactMessage.useMutation({
    onSuccess: () => {
      setFormData({ name: "", email: "", subject: "", message: "" });
      setFormErrors({});
    },
    onError: (error) => {
      const fieldErrors: Record<string, string> = {};
      if (error.data?.zodError?.fieldErrors) {
        Object.entries(error.data.zodError.fieldErrors).forEach(([field, msgs]) => {
          if (msgs?.[0]) {
            fieldErrors[field] = msgs[0];
          }
        });
      } else {
        fieldErrors.global = error.message || "Something went wrong. Please try again.";
      }
      setFormErrors(fieldErrors);
    },
  });

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = "Name is required.";
    else if (formData.name.length < 2) errors.name = "Name must be at least 2 characters.";
    
    if (!formData.email.trim()) errors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = "Please enter a valid email address.";
    
    if (!formData.subject.trim()) errors.subject = "Subject is required.";
    else if (formData.subject.length < 5) errors.subject = "Subject must be at least 5 characters.";
    
    if (!formData.message.trim()) errors.message = "Message is required.";
    else if (formData.message.length < 10) errors.message = "Message must be at least 10 characters.";
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    sendMessageMutation.mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear validation error for field when typing
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-2xl shadow-xs">
      <h2 className="text-xl font-bold text-slate-950 dark:text-white mb-6">Send a Message</h2>
      
      {sendMessageMutation.isSuccess ? (
        <div className="rounded-xl bg-emerald-50 p-6 text-center text-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-400 space-y-3">
          <CheckCircle2 className="h-12 w-12 text-emerald-600 dark:text-emerald-400 mx-auto animate-bounce" />
          <h3 className="text-lg font-bold">Message Sent!</h3>
          <p className="text-sm">
            Thank you for reaching out, Archilles has received your message and will reply shortly.
          </p>
          <button
            onClick={() => sendMessageMutation.reset()}
            className="mt-4 text-xs font-semibold underline hover:text-emerald-700 dark:hover:text-emerald-300"
          >
            Send another message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {formErrors.global && (
            <div className="rounded-lg bg-rose-50 p-3 flex items-center space-x-2 text-rose-800 dark:bg-rose-950/20 dark:text-rose-400 text-sm">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{formErrors.global}</span>
            </div>
          )}

          {/* Name Field */}
          <div className="space-y-1.5">
            <label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Your Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={sendMessageMutation.isPending}
              placeholder="Recruiter or Employer Name"
              className={`w-full rounded-xl border px-4 py-3 text-sm focus:outline-hidden focus:ring-2 bg-white/50 dark:bg-slate-900/50 dark:text-white ${
                formErrors.name 
                  ? "border-rose-500 focus:ring-rose-500/20" 
                  : "border-slate-200 focus:ring-blue-500/20 dark:border-slate-800"
              }`}
            />
            {formErrors.name && (
              <span className="text-xs text-rose-500 font-semibold">{formErrors.name}</span>
            )}
          </div>

          {/* Email Field */}
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={sendMessageMutation.isPending}
              placeholder="name@company.com"
              className={`w-full rounded-xl border px-4 py-3 text-sm focus:outline-hidden focus:ring-2 bg-white/50 dark:bg-slate-900/50 dark:text-white ${
                formErrors.email 
                  ? "border-rose-500 focus:ring-rose-500/20" 
                  : "border-slate-200 focus:ring-blue-500/20 dark:border-slate-800"
              }`}
            />
            {formErrors.email && (
              <span className="text-xs text-rose-500 font-semibold">{formErrors.email}</span>
            )}
          </div>

          {/* Subject Field */}
          <div className="space-y-1.5">
            <label htmlFor="subject" className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Subject
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              disabled={sendMessageMutation.isPending}
              placeholder="Inquiry / Job Opportunity"
              className={`w-full rounded-xl border px-4 py-3 text-sm focus:outline-hidden focus:ring-2 bg-white/50 dark:bg-slate-900/50 dark:text-white ${
                formErrors.subject 
                  ? "border-rose-500 focus:ring-rose-500/20" 
                  : "border-slate-200 focus:ring-blue-500/20 dark:border-slate-800"
              }`}
            />
            {formErrors.subject && (
              <span className="text-xs text-rose-500 font-semibold">{formErrors.subject}</span>
            )}
          </div>

          {/* Message Field */}
          <div className="space-y-1.5">
            <label htmlFor="message" className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              value={formData.message}
              onChange={handleChange}
              disabled={sendMessageMutation.isPending}
              placeholder="Hello Archilles, we reviewed your portfolio and we would love to discuss..."
              className={`w-full rounded-xl border px-4 py-3 text-sm focus:outline-hidden focus:ring-2 bg-white/50 dark:bg-slate-900/50 dark:text-white ${
                formErrors.message 
                  ? "border-rose-500 focus:ring-rose-500/20" 
                  : "border-slate-200 focus:ring-blue-500/20 dark:border-slate-800"
              }`}
            />
            {formErrors.message && (
              <span className="text-xs text-rose-500 font-semibold">{formErrors.message}</span>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={sendMessageMutation.isPending}
            className="flex w-full items-center justify-center space-x-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-md hover:bg-blue-700 hover:shadow-lg focus:outline-hidden disabled:bg-blue-400 transition-all duration-200 cursor-pointer"
          >
            {sendMessageMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Sending Message...</span>
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                <span>Send Message</span>
              </>
            )}
          </button>

        </form>
      )}
    </div>
  );
}
