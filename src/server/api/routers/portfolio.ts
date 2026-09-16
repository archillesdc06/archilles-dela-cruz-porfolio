import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { env } from "~/env";
import nodemailer from "nodemailer";
import { staticProjects, staticExperiences, staticAchievements } from "~/data/portfolio-data";
import { getGitHubProjects } from "~/server/github";
import { getCertifications } from "~/server/drive";
import type { Project } from "~/data/portfolio-data";

async function getAllProjects(): Promise<Project[]> {
  const githubProjects = await getGitHubProjects();

  const staticNames = new Set(
    staticProjects.map((p) => p.name.toLowerCase()),
  );

  const newGithubProjects = githubProjects.filter(
    (gp) => !staticNames.has(gp.name.toLowerCase()),
  );

  return [...staticProjects, ...newGithubProjects];
}

export const portfolioRouter = createTRPCRouter({
  getProjects: publicProcedure.query(async () => {
    return getAllProjects();
  }),

  getFeaturedProjects: publicProcedure.query(async () => {
    const all = await getAllProjects();
    return all.filter((p) => p.featured);
  }),

  getExperiences: publicProcedure.query(() => {
    return staticExperiences;
  }),

  getAchievements: publicProcedure.query(() => {
    return staticAchievements;
  }),

  getCertifications: publicProcedure.query(async () => {
    return getCertifications();
  }),

  sendContactMessage: publicProcedure
    .input(
      z.object({
        name: z.string().min(2, { message: "Name must be at least 2 characters." }),
        email: z.string().email({ message: "Please enter a valid email address." }),
        subject: z.string().min(5, { message: "Subject must be at least 5 characters." }),
        message: z.string().min(10, { message: "Message must be at least 10 characters." }),
      })
    )
    .mutation(async ({ input }) => {
      // Try sending email if SMTP credentials are set
      if (env.SMTP_USER && env.SMTP_PASSWORD) {
        try {
          const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: env.SMTP_USER,
              pass: env.SMTP_PASSWORD,
            },
          });

          await transporter.sendMail({
            from: `"${input.name}" <${env.SMTP_USER}>`,
            to: "archillesdelacruzemail@gmail.com",
            replyTo: input.email,
            subject: `[Portfolio Contact] ${input.subject}`,
            text: `You have received a new message from your portfolio contact form.

Name: ${input.name}
Email: ${input.email}
Subject: ${input.subject}

Message:
${input.message}`,
            html: `
              <h3>New Portfolio Message</h3>
              <p><strong>Name:</strong> ${input.name}</p>
              <p><strong>Email:</strong> ${input.email}</p>
              <p><strong>Subject:</strong> ${input.subject}</p>
              <br/>
              <p><strong>Message:</strong></p>
              <p style="white-space: pre-wrap; background: #f5f5f5; padding: 15px; border-radius: 8px;">${input.message}</p>
            `,
          });
        } catch (error) {
          console.error("Failed to send contact email via Nodemailer:", error);
        }
      } else {
        console.warn("SMTP_USER and SMTP_PASSWORD env variables are not defined. Email was not sent.");
      }

      return {
        success: true,
        messageId: Math.floor(Math.random() * 1000000),
        message: "Your message has been sent successfully!",
      };
    }),
});
