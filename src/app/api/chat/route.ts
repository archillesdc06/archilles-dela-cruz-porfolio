import { type NextRequest, NextResponse } from "next/server";
import { env } from "~/env";
import nodemailer from "nodemailer";

// ─────────────────────────────────────────────
// ARCHILLES' FULL PORTFOLIO KNOWLEDGE BASE
// ─────────────────────────────────────────────
const PORTFOLIO_KNOWLEDGE = `
ABOUT ARCHILLES DELA CRUZ:
- Full Name: Archilles Dela Cruz
- Location: General Santos City, Philippines
- Email: archillesdelacruzemail@gmail.com
- Phone: 0975 077 3561
- GitHub: https://github.com/archillesdc06
- Facebook: https://facebook.com/archillesdc
- JobStreet: https://ph.jobstreet.com/profiles/archilles-delacruz-c1fvrLpmB4
- Resume/CV: https://drive.google.com/file/d/1P2_V0SEAAiAFUYLdcX4wmKENbdHYLLaB/view?usp=sharing

EDUCATION:
1. Bachelor of Science in Information Technology - Major in Business Analytics
   - School: South East Asian Institute of Technology Inc (SEAIT)
   - Graduated: Class of 2025
   - Achievements: Dean's Lister, Business Manager Officer (3rd Year)
2. High School: Dadiangas North High School - Class of 2019
3. Elementary: Jose P Laurel Elementary School - Class of 2016

CAREER OBJECTIVE:
To secure a professional position as a Software Developer, Web Developer, IT Staff, Data Analyst, or Office Staff. Aims to apply programming skills, office administration experience, database knowledge, and systematic document management protocols to deliver high-value results.

PERSONAL SUMMARY:
A motivated Software Developer with hands-on experience gained through personal projects and a virtual assistant role involving software development tasks, demonstrating strong understanding of development workflows, coding fundamentals, and system support, with the ability to quickly learn, adapt, and deliver functional and user-focused applications.

WORK EXPERIENCE:
1. Administrative Aide II
   - Company: Office of The Building Official City of General Santos
   - Period: Feb 2026 – June 2026
   - Responsibilities:
     * Released approved and pending building plans to clients with proper documentation
     * Scanned architectural/engineering plans and converted to digital softcopy files
     * Maintained organized electronic and physical filing systems

2. BAC Office Secretary (INTERN)
   - Company: Polomolok BAC Office
   - Period: Feb 2025 – June 2025
   - Responsibilities:
     * Distributed and routed official documents between departments
     * Handled printing and preparation of bidding documents
     * Organized document flows for bidding/procurement processes

3. SEO Support Specialist
   - Company: Novice VA Services (Remote)
   - Period: July 2023 – Feb 2025
   - Responsibilities:
     * Optimized website pages and Google Business Profiles via on-page SEO
     * Monitored SEO performance using Google Analytics, Search Console, Ahrefs, Semrush
     * Generated SEO reports and applied industry best practices

SKILLS:
Programming Languages: PHP (90%), JavaScript (85%), SQL (80%), HTML5 (95%), CSS3 (90%)
Frameworks & Libraries: Bootstrap 5 (50%), jQuery (55%), Tailwind CSS (65%), Next.js & React (65%)
Databases & Tools: MySQL (85%), SQLite (80%), Git & GitHub (85%), VS Code (90%), XAMPP (80%)
Office & Admin Skills: Documentation Management (95%), Data Entry (90%), Microsoft Word (95%), Microsoft Excel (85%), Microsoft PowerPoint (90%)

PROJECTS:
1. Budget Tracker App
   - Description: Cross-platform mobile app for tracking income, expenses, and savings goals in real time with AI-powered budgeting assistant analyzing spending patterns and delivering personalized financial recommendations.
   - Tech Stack: React Native, Expo, T3 Stack, AI Integration
   - GitHub: https://github.com/archillesdc06
   - Status: In development

2. Galor Dental Clinic Management System
   - Description: Full-featured web-based dental clinic management system handling patient records, appointment scheduling, treatment tracking, and billing.
   - Tech Stack: PHP, HTML, CSS, MySQL
   - GitHub: https://github.com/archillesdc06
   - Status: Completed

CERTIFICATIONS & ACHIEVEMENTS:
1. Academic Research / Capstone: "Evaluating The Impact of User Interface Design on the Effectiveness of the Entrance Exam System" (2025)
2. DICT Region XII and Mainland BARMM Training – DICT (2024)
3. DICT Hackathon 2024 IT Olympics Competitor – DICT Region XII (2024)
4. PSITS Region XII - InnoTech Gala Participant – PSITS (2024)
5. BAC Secretariat - Administrative & Procurement Support Certificate (2025)

CURRENTLY SEEKING:
- Software Developer positions
- Web Developer roles
- IT Staff / IT Support
- Data Analyst positions
- Office Administration Staff
- Open to both local (Philippines) and remote opportunities
`;

// ─────────────────────────────────────────────
// WEATHER HELPER
// ─────────────────────────────────────────────
interface WeatherInfo {
  isRaining: boolean;
  condition: string;
  description: string;
}

async function getGeneralSantosWeather(): Promise<WeatherInfo> {
  try {
    const response = await fetch(
      "https://wttr.in/General+Santos+City,Philippines?format=j1",
      { next: { revalidate: 1800 } } // cache 30 mins
    );
    if (!response.ok) throw new Error("Weather fetch failed");
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const data = await response.json();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const weatherCode = Number(data?.current_condition?.[0]?.weatherCode ?? 800);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const conditionDesc = String(data?.current_condition?.[0]?.weatherDesc?.[0]?.value ?? "Clear");

    // WMO weather codes: 200-531 = thunderstorm/rain, 300-531 = drizzle/rain, 600-622 = snow
    const isRaining = weatherCode >= 200 && weatherCode <= 531;

    return {
      isRaining,
      condition: conditionDesc,
      description: isRaining
        ? `Currently ${conditionDesc.toLowerCase()} in General Santos City.`
        : `Weather in General Santos City is currently ${conditionDesc.toLowerCase()}.`,
    };
  } catch {
    return {
      isRaining: false,
      condition: "Unknown",
      description: "Weather data unavailable.",
    };
  }
}

// ─────────────────────────────────────────────
// SEND CONTACT EMAIL (for contact takeover)
// ─────────────────────────────────────────────
async function sendContactEmail(name: string, email: string, message: string): Promise<boolean> {
  if (!env.SMTP_USER || !env.SMTP_PASSWORD) return false;
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: env.SMTP_USER, pass: env.SMTP_PASSWORD },
    });
    await transporter.sendMail({
      from: `"${name}" <${env.SMTP_USER}>`,
      to: "archillesdelacruzemail@gmail.com",
      replyTo: email,
      subject: `[Portfolio AI Chat] Message from ${name}`,
      html: `
        <h3>📩 New Message via AI Chat Assistant</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <br/>
        <p><strong>Message:</strong></p>
        <p style="background:#f5f5f5;padding:15px;border-radius:8px;white-space:pre-wrap">${message}</p>
      `,
    });
    return true;
  } catch {
    return false;
  }
}

// ─────────────────────────────────────────────
// MAIN POST HANDLER
// ─────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const body = await request.json();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const messages: { role: string; content: string }[] = body.messages ?? [];
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const contactData: { name?: string; email?: string; message?: string } | null = body.contactData ?? null;

    // Handle contact message sending
    if (contactData?.name && contactData?.email && contactData?.message) {
      const sent = await sendContactEmail(contactData.name, contactData.email, contactData.message);
      return NextResponse.json({ sent });
    }

    // Get weather
    const weather = await getGeneralSantosWeather();

    const weatherContext = weather.isRaining
      ? `IMPORTANT WEATHER NOTE: It is currently ${weather.condition} (rainy/stormy) in General Santos City where Archilles lives. If clients ask about response time or email replies, mention that due to heavy rain, Archilles may experience delays in checking email and may not be able to respond immediately. Suggest they leave a message anyway and he will reply as soon as the weather clears.`
      : `Current weather in General Santos City: ${weather.condition}. No weather-related delays expected.`;

    const systemPrompt = `You are Archilles Dela Cruz's AI Portfolio Assistant — a smart, professional, and friendly chatbot embedded in Archilles' personal portfolio website.

YOUR IDENTITY:
- You are the AI assistant for Archilles Dela Cruz's portfolio
- You represent Archilles professionally
- You are NOT a general-purpose AI — you ONLY discuss topics related to Archilles' portfolio, resume, skills, experience, projects, and how to contact or hire him

CURRENT WEATHER CONTEXT:
${weatherContext}

ARCHILLES' PORTFOLIO INFORMATION:
${PORTFOLIO_KNOWLEDGE}

LANGUAGE RULES (VERY IMPORTANT):
- If the user writes in TAGALOG → respond fully in Tagalog
- If the user writes in ENGLISH → respond fully in English  
- If the user writes in TAGLISH (mix of Tagalog + English) → respond in Taglish
- If the user writes in BISAYA/CEBUANO → respond fully in Bisaya
- Always mirror the user's language naturally and conversationally
- Never switch languages unless the user does first

TOPIC RESTRICTION RULES:
- ONLY answer questions about: Archilles' resume, education, work experience, skills, projects, certifications, contact info, availability, and how to hire him
- If asked about ANYTHING ELSE (general coding help, news, other people, math, random questions, etc.) politely decline and redirect back to portfolio topics
- Example redirect: "Pasensya na, limited lang ang aking kaalaman sa portfolio ni Archilles. May gusto ka bang malaman tungkol sa kanya?"

CONTACT/HIRE TAKEOVER RULES:
- If a client expresses interest in hiring, working with, or contacting Archilles:
  1. Warmly acknowledge their interest
  2. Ask for their: Full Name, Email Address, and Message/what they need
  3. Once you have all three, tell them you will forward the message to Archilles
  4. Include in your response a JSON block like this (hidden in the response structure) — the system will detect it and send the email
  5. Alternatively, direct them to: archillesdelacruzemail@gmail.com or phone 0975 077 3561 or the Contact page

TONE & PERSONALITY:
- Professional yet warm and approachable
- Concise but helpful answers
- Use bullet points for lists
- Add relevant emojis occasionally to make it feel friendly (not excessive)
- Never make up information about Archilles that isn't in the knowledge base

Remember: You are here to help potential employers, clients, and collaborators learn about Archilles and connect with him!`;

    if (!env.GROQ_API_KEY) {
      // Return a placeholder response when no API key is set yet
      return NextResponse.json({
        message: "Hi! I'm Archilles' AI assistant. The Groq API key hasn't been configured yet. Please add your GROQ_API_KEY to the .env file to activate me! 🤖",
      });
    }

    // Call Groq API (OpenAI-compatible)
    const groqMessages = [
      { role: "system", content: systemPrompt },
      ...messages.map((m) => ({ role: m.role, content: m.content })),
    ];

    const groqResponse = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: groqMessages,
          temperature: 0.7,
          max_tokens: 1024,
        }),
      }
    );

    if (!groqResponse.ok) {
      const errText = await groqResponse.text();
      console.error("Groq API error:", errText);
      throw new Error("Groq API call failed");
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const groqData = await groqResponse.json();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const aiText = String(groqData?.choices?.[0]?.message?.content ?? "Sorry, I couldn't generate a response. Please try again.");

    return NextResponse.json({ message: aiText });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { message: "Sorry, something went wrong. Please try again in a moment." },
      { status: 500 }
    );
  }
}

