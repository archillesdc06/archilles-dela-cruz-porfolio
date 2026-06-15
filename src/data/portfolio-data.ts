export interface Project {
  id: number;
  name: string;
  description: string;
  image: string;
  techStack: string;
  liveUrl: string | null;
  githubUrl: string | null;
  category: string;
  featured: boolean;
}

export interface Experience {
  id: number;
  role: string;
  company: string;
  location: string | null;
  startDate: string;
  endDate: string;
  highlights: string[];
}

export interface Achievement {
  id: number;
  title: string;
  issuer: string;
  date: string;
  category: string;
  description: string | null;
  link?: string;
}

export const staticProjects: Project[] = [
  {
    id: 1,
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
    id: 2,
    name: "Galor Dental Clinic Management System",
    description: "A full-featured web-based dental clinic management system handling patient records, appointment scheduling, treatment tracking, and billing. Designed a streamlined communication interface between dental staff and patients, reducing manual coordination overhead.",
    image: "/images/projects/dental-care.svg",
    techStack: "PHP, HTML, CSS, MySQL",
    liveUrl: null,
    githubUrl: "https://github.com/archillesdc-git",
    category: "system",
    featured: true,
  },
  {
    id: 3,
    name: "Entrance Exam UI Design Analysis (Research)",
    description: "Co-authored and published academic research paper evaluating the impact of User Interface (UI) design on the usability and task efficiency of the digital entrance exam system at SEAIT. Published in the International Journal of Scientific and Applied Research (IJSAR, Vol. 4, No. 9).",
    image: "/images/projects/teachers-eval.svg",
    techStack: "UI/UX Design, Heuristic Evaluation, SUS Testing",
    liveUrl: "https://doi.org/10.54756/IJSAR.2024.20",
    githubUrl: null,
    category: "research",
    featured: true,
  },
];

export const staticExperiences: Experience[] = [
  {
    id: 1,
    role: "Administrative Aide II",
    company: "Office of The Building Official City of General Santos",
    location: "General Santos City, Philippines",
    startDate: "Feb 2026",
    endDate: "June 2026",
    highlights: [
      "Responsible for releasing approved and pending building plans to clients while ensuring proper documentation and tracking of all transactions.",
      "Handled the scanning of architectural and engineering plans, permits, and related items submitted by clients, converting them into softcopy files for digital archiving and record-keeping.",
      "Maintained organized electronic and physical filing systems to ensure efficient retrieval of documents and supported office operations by ensuring accuracy, completeness, and confidentiality of all records."
    ],
  },
  {
    id: 2,
    role: "BAC Office Secretary INTERN",
    company: "Polomolok BAC Office",
    location: "Polomolok, Philippines",
    startDate: "Feb 2025",
    endDate: "June 2025",
    highlights: [
      "Responsible for distributing and routing official documents between different departments for receiving, processing, and release, ensuring all papers are properly signed and acknowledged by each concerned office.",
      "Handled the printing and preparation of bidding documents from various businesses, maintaining accuracy, completeness, and proper formatting of all procurement-related papers.",
      "Assisted in organizing and managing document flows within the office to support efficient and compliant bidding and procurement processes."
    ],
  },
  {
    id: 3,
    role: "Search Engine Optimization (SEO) Support",
    company: "Novice VA Services",
    location: "Remote",
    startDate: "July 2023",
    endDate: "Feb 2025",
    highlights: [
      "Optimized website pages and Google Business Profile parity through on-page SEO, keyword research, and content optimization.",
      "Monitored SEO performance using Google Analytics, Search Console, Ahrefs, and Semrush to improve search rankings and visibility.",
      "Generated SEO reports, resolved optimization issues, and applied industry best practices to enhance performance."
    ],
  },
];

export const staticAchievements: Achievement[] = [
  {
    id: 1,
    title: "Evaluating The Impact of User Interface Design on the Effectiveness of the Entrance Exam System: A Design Analysis Approach",
    issuer: "IJSAR Journal Publication",
    date: "Dec 2024",
    category: "academic",
    description: "Published capstone research evaluating UI/UX design parameters in the International Journal of Scientific and Applied Research.",
    link: "https://doi.org/10.54756/IJSAR.2024.20",
  },
  {
    id: 2,
    title: "DICT Region XII and Mainland BARMM Training",
    issuer: "Department of Information and Communications Technology",
    date: "2024",
    category: "certificate",
    description: "Completed regional technical capacity building programs.",
  },
  {
    id: 3,
    title: "DICT - Hackathon 2024 IT Olympics Competitor",
    issuer: "DICT Region XII",
    date: "2024",
    category: "award",
    description: "Competed in the software development track of the IT Olympics regional hackathon.",
  },
  {
    id: 4,
    title: "PSITS Region XII - InnoTech Gala Participant",
    issuer: "Philippine Society of Information Technology Students",
    date: "2024",
    category: "seminar",
    description: "Participated in conferences showcasing local tech innovations and systems development.",
  },
  {
    id: 5,
    title: "BAC Secretariat - Administrative & Procurement Support",
    issuer: "BAC Secretariat",
    date: "2025",
    category: "certificate",
    description: "Completed administrative support and document routing certification workflows.",
  },
];
