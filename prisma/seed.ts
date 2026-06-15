import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.project.deleteMany();
  await prisma.experience.deleteMany();
  await prisma.achievement.deleteMany();

  console.log("Database cleared.");

  // Seed Projects
  const projects = [
    {
      name: "Budget Tracker App",
      description: "A cross-platform mobile app for tracking income, expenses, and savings goals in real time. Features an AI-powered budgeting assistant that analyzes user spending patterns and delivers personalized financial recommendations, integrated with a clean, intuitive dashboard and real-time data sync.",
      image: "/images/projects/budget-tracker.svg",
      techStack: "React Native, Expo, T3 Stack, AI Integration",
      liveUrl: null,
      githubUrl: "https://github.com/archillesdc-git",
      category: "system",
      featured: true,
    },
    {
      name: "Galor Dental Clinic Management System",
      description: "A full-featured web-based dental clinic management system handling patient records, appointment scheduling, treatment tracking, and billing. Designed a streamlined communication interface between dental staff and patients, reducing manual coordination overhead.",
      image: "/images/projects/dental-care.svg",
      techStack: "PHP, HTML, CSS, MySQL",
      liveUrl: null,
      githubUrl: "https://github.com/archillesdc-git",
      category: "system",
      featured: true,
    },
  ];

  for (const p of projects) {
    await prisma.project.create({ data: p });
  }
  console.log("Projects seeded.");

  // Seed Employment History / Experience
  const experiences = [
    {
      role: "Administrative Aide II",
      company: "Office of The Building Official City of General Santos",
      location: "General Santos City, Philippines",
      startDate: "Feb 2026",
      endDate: "June 2026",
      highlights: JSON.stringify([
        "Responsible for releasing approved and pending building plans to clients while ensuring proper documentation and tracking of all transactions.",
        "Handled the scanning of architectural and engineering plans, permits, and related items submitted by clients, converting them into softcopy files for digital archiving and record-keeping.",
        "Maintained organized electronic and physical filing systems to ensure efficient retrieval of documents and supported office operations by ensuring accuracy, completeness, and confidentiality of all records."
      ]),
    },
    {
      role: "BAC Office Secretary INTERN",
      company: "Polomolok BAC Office",
      location: "Polomolok, Philippines",
      startDate: "Feb 2025",
      endDate: "June 2025",
      highlights: JSON.stringify([
        "Responsible for distributing and routing official documents between different departments for receiving, processing, and release, ensuring all papers are properly signed and acknowledged by each concerned office.",
        "Handled the printing and preparation of bidding documents from various businesses, maintaining accuracy, completeness, and proper formatting of all procurement-related papers.",
        "Assisted in organizing and managing document flows within the office to support efficient and compliant bidding and procurement processes."
      ]),
    },
    {
      role: "Search Engine Optimization (SEO) Support",
      company: "Novice VA Services",
      location: "Remote",
      startDate: "July 2023",
      endDate: "Feb 2025",
      highlights: JSON.stringify([
        "Optimized website pages and Google Business Profile parity through on-page SEO, keyword research, and content optimization.",
        "Monitored SEO performance using Google Analytics, Search Console, Ahrefs, and Semrush to improve search rankings and visibility.",
        "Generated SEO reports, resolved optimization issues, and applied industry best practices to enhance performance."
      ]),
    },
  ];

  for (const exp of experiences) {
    await prisma.experience.create({ data: exp });
  }
  console.log("Experiences seeded.");

  // Seed Certifications & Licenses
  const achievements = [
    {
      title: "Evaluating The Impact of User Interface Design on the Effectiveness of the Entrance Exam System: A Design Analysis Approach",
      issuer: "Academic Research / Capstone Project",
      date: "2025",
      category: "academic",
      description: "Research work evaluating entrance exam UI/UX design parameters.",
    },
    {
      title: "DICT Region XII and Mainland BARMM Training",
      issuer: "Department of Information and Communications Technology",
      date: "2024",
      category: "certificate",
      description: "Completed regional technical capacity building programs.",
    },
    {
      title: "DICT - Hackathon 2024 IT Olympics Competitor",
      issuer: "DICT Region XII",
      date: "2024",
      category: "award",
      description: "Competed in the software development track of the IT Olympics regional hackathon.",
    },
    {
      title: "PSITS Region XII - InnoTech Gala Participant",
      issuer: "Philippine Society of Information Technology Students",
      date: "2024",
      category: "seminar",
      description: "Participated in conferences showcasing local tech innovations and systems development.",
    },
    {
      title: "BAC Secretariat - Administrative & Procurement Support",
      issuer: "BAC Secretariat",
      date: "2025",
      category: "certificate",
      description: "Completed administrative support and document routing certification workflows.",
    },
  ];

  for (const ach of achievements) {
    await prisma.achievement.create({ data: ach });
  }
  console.log("Achievements seeded.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
