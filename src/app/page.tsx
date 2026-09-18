import Image from "next/image";
import Link from "next/link";
import { api, HydrateClient } from "~/trpc/server";
import TypingEffect from "~/components/typing-effect";
import ProjectVisuals from "~/components/project-screenshots";
import { Github } from "~/components/brand-icons";
import { 
  FileDown, 
  Mail, 
  ArrowRight, 
  GraduationCap, 
  Briefcase, 
  Code2, 
  Database, 
  Layers, 
  ChevronRight,
  Sparkles,
  Star,
  GitBranch,
  RefreshCw
} from "lucide-react";

const skillCategories = [
  {
    title: "Programming Languages",
    icon: <Code2 className="h-5 w-5 text-blue-500" />,
    skills: [
      { name: "PHP", level: 90 },
      { name: "JavaScript", level: 85 },
      { name: "SQL", level: 80 },
      { name: "HTML5", level: 95 },
      { name: "CSS3", level: 90 },
    ],
  },
  {
    title: "Frameworks & Libraries",
    icon: <Layers className="h-5 w-5 text-indigo-500" />,
    skills: [
      { name: "Bootstrap 5", level: 50 },
      { name: "jQuery", level: 55 },
      { name: "Tailwind CSS", level: 65 },
      { name: "Next.js & React", level: 65 },
    ],
  },
  {
    title: "Databases & Tools",
    icon: <Database className="h-5 w-5 text-cyan-500" />,
    skills: [
      { name: "MySQL", level: 85 },
      { name: "SQLite", level: 80 },
      { name: "Git & GitHub", level: 85 },
      { name: "VS Code", level: 90 },
      { name: "XAMPP", level: 80 },
    ],
  },
  {
    title: "Office & Admin Skills",
    icon: <Briefcase className="h-5 w-5 text-emerald-500" />,
    skills: [
      { name: "Documentation Management", level: 95 },
      { name: "Data Entry", level: 90 },
      { name: "Microsoft Word", level: 95 },
      { name: "Microsoft Excel", level: 85 },
      { name: "Microsoft PowerPoint", level: 90 },
    ],
  },
];

export default async function Home() {
  // Fetch featured projects from database using tRPC server-side caller
  const featuredProjects = (await api.portfolio.getFeaturedProjects())
    .slice()
    .sort(
      (a, b) =>
        new Date(b.lastUpdated ?? 0).getTime() -
        new Date(a.lastUpdated ?? 0).getTime(),
    )
    .slice(0, 6);
  const certifications = await api.portfolio.getCertifications();

  return (
    <HydrateClient>
      <div className="w-full">
        {/* HERO SECTION */}
        <section className="relative py-20 md:py-28 overflow-hidden">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
              
              {/* Left Column: Bio / Info */}
              <div className="md:col-span-7 space-y-6 text-center md:text-left">
                <div className="inline-flex items-center space-x-2 rounded-full border border-blue-200 bg-blue-50/50 px-3 py-1 text-xs font-semibold text-blue-600 dark:border-blue-900/30 dark:bg-blue-950/30 dark:text-blue-400">
                  <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                  <span>Available for Opportunities</span>
                </div>
                
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-950 dark:text-white font-sans">
                  Hi, I am <br />
                  <span className="bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400">
                    Archilles Dela Cruz
                  </span>
                </h1>
                
                <h2 className="text-xl sm:text-2xl font-semibold text-slate-700 dark:text-slate-200">
                  Aspiring <TypingEffect words={["Software Developer", "Web Developer", "IT Specialist", "Office Admin Staff"]} />
                </h2>
                
                <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto md:mx-0 leading-relaxed">
                  Passionate about building scalable systems, tracking database actions, and streamlining office administration workflows. Combining developer logic with robust IT infrastructure support.
                </p>
                
                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4 pt-2">
                  <Link
                    href="/resume"
                    className="flex items-center justify-center space-x-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-md hover:bg-blue-700 hover:shadow-lg transition-all duration-200"
                  >
                    <FileDown className="h-4 w-4" />
                    <span>Download CV / Resume</span>
                  </Link>
                  
                  <Link
                    href="/contact"
                    className="flex items-center justify-center space-x-2 rounded-xl border border-slate-300 bg-white/80 px-6 py-3.5 text-sm font-semibold text-slate-700 shadow-xs hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-200 dark:hover:bg-slate-800 transition-all duration-200"
                  >
                    <Mail className="h-4 w-4" />
                    <span>Contact Me</span>
                  </Link>
                </div>
              </div>
              
              {/* Right Column: Avatar Graphic */}
              <div className="md:col-span-5 flex justify-center">
                <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96">
                  {/* Decorative ambient gradient backdrop */}
                  <div className="absolute inset-0 rounded-full bg-linear-to-tr from-blue-600 to-indigo-500 opacity-20 blur-2xl animate-pulse" />
                  
                  {/* Glassmorphic border ring */}
                  <div className="absolute inset-0 rounded-full border border-white/20 dark:border-slate-800/50 p-3 bg-white/10 dark:bg-slate-900/10 backdrop-blur-xs">
                    <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white dark:border-slate-900 shadow-xl">
                      <Image
                        src="/images/profile-avatar.jpg"
                        alt="Archilles Dela Cruz"
                        fill
                        className="object-cover"
                        priority
                      />
                    </div>
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        </section>

        {/* ABOUT ME SECTION */}
        <section id="about" className="py-20 bg-white/40 dark:bg-slate-950/20 border-y border-slate-200 dark:border-slate-900">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <h2 className="text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">About Me</h2>
              <div className="h-1.5 w-16 bg-blue-600 rounded-full mx-auto" />
              <p className="text-lg text-slate-600 dark:text-slate-400">
                A brief overview of my profile, career objective, and academic milestones.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-16">
              
              {/* Text Area */}
              <div className="lg:col-span-7 space-y-6">
                <div className="glass-panel rounded-2xl p-6 sm:p-8 space-y-4 shadow-xs">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Personal Summary</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm sm:text-base">
                    A motivated Software Developer with hands-on experience gained through personal projects and a 2-month virtual assistant role involving software development tasks, demonstrating strong understanding of development workflows, coding fundamentals, and system support, with the ability to quickly learn, adapt, and deliver functional and user-focused applications.
                  </p>
                </div>
                
                <div className="glass-panel rounded-2xl p-6 sm:p-8 space-y-4 shadow-xs">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Career Objective</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm sm:text-base">
                    To secure a professional position as a Software Developer, Web Developer, IT Staff, Data Analyst, or Office Staff. I aim to apply my programming skills, office administration experience, database knowledge, and systematic document management protocols to deliver high-value results.
                  </p>
                </div>
              </div>

              {/* Education & Achievements Card */}
              <div className="lg:col-span-5 space-y-6">
                <div className="glass-panel rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs border-blue-500/10">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                    <GraduationCap className="h-5 w-5 text-blue-600" />
                    <span>Education & Highlights</span>
                  </h3>
                  
                  <div className="space-y-6">
                    {/* College */}
                    <div className="relative pl-6 border-l-2 border-blue-500/30 space-y-2">
                      <div className="absolute -left-[7px] top-1.5 h-3 w-3 rounded-full bg-blue-600" />
                      <h4 className="text-base font-bold text-slate-900 dark:text-white">South East Asian Institute of Technology Inc</h4>
                      <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                        Bachelor of Science in Information Technology Major in Business Analytics
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Class of 2025</p>
                      <ul className="text-xs text-slate-600 dark:text-slate-400 list-disc pl-4 space-y-1 mt-1">
                        <li>Business Manager Officer (3rd Year College)</li>
                        <li>Dean&apos;s Lister</li>
                        <li>
                          Published Research Paper (IJSAR Dec 2024):{" "}
                          <a 
                            href="https://doi.org/10.54756/IJSAR.2024.20" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            Evaluating UI Design Impact
                          </a>
                        </li>
                      </ul>
                    </div>

                    {/* High School */}
                    <div className="relative pl-6 border-l-2 border-blue-500/30 space-y-2">
                      <div className="absolute -left-[7px] top-1.5 h-3 w-3 rounded-full bg-blue-600" />
                      <h4 className="text-base font-bold text-slate-900 dark:text-white">Dadiangas North High School</h4>
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Graduated Class of 2019</p>
                    </div>

                    {/* Elementary */}
                    <div className="relative pl-6 border-l-2 border-blue-500/30 space-y-2">
                      <div className="absolute -left-[7px] top-1.5 h-3 w-3 rounded-full bg-blue-600" />
                      <h4 className="text-base font-bold text-slate-900 dark:text-white">Jose P Laurel Elementary School</h4>
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Graduated Class of 2016</p>
                    </div>
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        </section>

        {/* SKILLS & TECHNOLOGIES SECTION */}
        <section id="skills" className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <h2 className="text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">Skills & Technologies</h2>
              <div className="h-1.5 w-16 bg-blue-600 rounded-full mx-auto" />
              <p className="text-lg text-slate-600 dark:text-slate-400">
                A structured overview of my technology stack, tools, and general office capabilities.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
              {skillCategories.map((category) => (
                <div key={category.title} className="glass-panel rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-3">
                    <span className="rounded-lg bg-blue-50 p-2 dark:bg-slate-900">{category.icon}</span>
                    <span>{category.title}</span>
                  </h3>
                  
                  <div className="space-y-4">
                    {category.skills.map((skill) => (
                      <div key={skill.name} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-semibold text-slate-700 dark:text-slate-300">{skill.name}</span>
                          <span className="font-medium text-slate-500 dark:text-slate-400">{skill.level}%</span>
                        </div>
                        {/* Progress Bar Container */}
                        <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                          <div 
                            className="h-full rounded-full bg-linear-to-r from-blue-600 to-indigo-500 transition-all duration-1000 ease-out" 
                            style={{ width: `${skill.level}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURED PROJECTS SECTION */}
        <section id="projects" className="py-20 bg-white/40 dark:bg-slate-950/20 border-y border-slate-200 dark:border-slate-900">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div className="space-y-3">
                <h2 className="text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">Featured Projects</h2>
                <div className="h-1.5 w-16 bg-blue-600 rounded-full" />
                <p className="text-slate-600 dark:text-slate-400 max-w-xl">
                  Take a look at the selected applications and management systems I developed.
                </p>
                <div className="inline-flex items-center space-x-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  <RefreshCw className="h-3 w-3 animate-spin [animation-duration:4s]" />
                  <span>Synced from GitHub</span>
                </div>
              </div>
              <Link
                href="/projects"
                className="inline-flex items-center space-x-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 group"
              >
                <span>View All Projects</span>
                <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
              {featuredProjects.map((project) => (
                <article key={project.id} className="glass-panel relative flex flex-col h-full rounded-2xl overflow-hidden shadow-xs hover:shadow-md hover:scale-[1.01] transition-all duration-300 group">
                  <ProjectVisuals
                    image={project.image}
                    screenshots={project.screenshots}
                    fullScreenshots={project.fullScreenshots}
                    projectName={project.name}
                  >
                  {/* Card Body */}
                  <div className="flex-1 p-6 space-y-4 flex flex-col justify-between">
                    <div className="space-y-2">
                      <span className="inline-block rounded-md bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-600 uppercase tracking-wider dark:bg-blue-950/40 dark:text-blue-400">
                        {project.category}
                      </span>
                      <h3 className="text-lg font-bold text-slate-950 dark:text-white leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {project.name}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3">
                        {project.description}
                      </p>
                    </div>
                    
                    <div className="space-y-4">
                      {/* Tech Badges */}
                      <div className="flex flex-wrap gap-1.5">
                        {project.techStack.split(",").map((tech) => (
                          <span 
                            key={tech.trim()} 
                            className="rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-xs text-slate-600 dark:text-slate-300"
                          >
                            {tech.trim()}
                          </span>
                        ))}
                      </div>

                      {/* GitHub Metadata */}
                      {project.source === "github" && (
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                          {project.language && (
                            <span className="inline-flex items-center space-x-1">
                              <span className="h-2 w-2 rounded-full bg-blue-500" />
                              <span>{project.language}</span>
                            </span>
                          )}
                          {typeof project.stars === "number" && (
                            <span className="inline-flex items-center space-x-1">
                              <Star className="h-3 w-3" />
                              <span>{project.stars}</span>
                            </span>
                          )}
                          {project.lastUpdated && (
                            <span className="inline-flex items-center space-x-1">
                              <GitBranch className="h-3 w-3" />
                              <span>{new Date(project.lastUpdated).toLocaleDateString()}</span>
                            </span>
                          )}
                        </div>
                      )}

                      {/* Buttons */}
                      <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-4 text-sm font-semibold">
                        <div className="flex items-center space-x-3">
                          <Link 
                            href="/projects" 
                            className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center space-x-1"
                          >
                            <span>Details</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                          </Link>
                          {project.liveUrl && (
                            <a 
                              href={project.liveUrl} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-emerald-600 dark:text-emerald-400 hover:underline"
                            >
                              Live Demo
                            </a>
                          )}
                        </div>
                        {project.githubUrl && (
                          <a 
                            href={project.githubUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white inline-flex items-center space-x-1.5"
                          >
                            <Github className="h-4 w-4" />
                            <span>GitHub</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                  </ProjectVisuals>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* CERTIFICATIONS SECTION */}
        {certifications.length > 0 && (
        <section id="certifications" className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div className="space-y-3">
                <h2 className="text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
                  Certifications
                </h2>
                <div className="h-1.5 w-16 bg-blue-600 rounded-full" />
                <p className="text-slate-600 dark:text-slate-400 max-w-xl">
                  Trainings, certificates, and recognitions I have earned.
                </p>
              </div>
              <Link
                href="/certifications"
                className="inline-flex items-center space-x-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 group"
              >
                <span>View All Certifications</span>
                <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
              {certifications.slice(0, 6).map((cert) => (
                <article key={cert.id} className="glass-panel flex flex-col h-full rounded-2xl overflow-hidden shadow-xs hover:shadow-md hover:scale-[1.01] transition-all duration-300 group">
                  <a
                    href={cert.driveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative w-full aspect-video bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800"
                  >
                    <Image
                      src={cert.image}
                      alt={cert.title}
                      fill
                      className="object-cover"
                    />
                    {cert.year && (
                      <span className="absolute bottom-3 right-3 rounded-full bg-blue-600/90 backdrop-blur-xs px-2.5 py-1 text-xs font-bold text-white shadow-xs">
                        {cert.year}
                      </span>
                    )}
                  </a>

                  <div className="flex-1 p-6 space-y-4 flex flex-col justify-between">
                    <div className="space-y-2">
                      <h3 className="text-lg font-bold text-slate-950 dark:text-white leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {cert.title}
                      </h3>
                      {cert.issuer && (
                        <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                          {cert.issuer}
                        </p>
                      )}
                      {cert.description && (
                        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                          {cert.description}
                        </p>
                      )}
                    </div>
                    <a
                      href={cert.driveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1.5 border-t border-slate-100 dark:border-slate-800 pt-4 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      <span>Open in Drive</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
        )}

        {/* CALL TO ACTION SECTION */}
        <section className="py-20 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-b from-blue-600/5 to-indigo-600/5 dark:from-blue-600/2 dark:to-indigo-600/2 pointer-events-none" />
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-6 relative z-10">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Interested in collaborating or hiring me?
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              I am open to Software Developer, Web Developer, IT Staff, Data Analyst, or Office Staff positions. Let&apos;s discuss how my skills can help your organization.
            </p>
            <div className="flex justify-center space-x-4 pt-4">
              <Link
                href="/contact"
                className="flex items-center space-x-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-md hover:bg-blue-700 hover:shadow-lg transition-all duration-200"
              >
                <span>Hire Me / Contact</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Archilles Dela Cruz",
              "jobTitle": ["Software Developer", "Web Developer", "IT Specialist"],
              "url": "https://archilles-dela-cruz-portfolio.vercel.app",
              "sameAs": [
                "https://github.com/archillesdc06",
                "https://facebook.com/archillesdc",
                "https://ph.jobstreet.com/profiles/archilles-delacruz-c1fvrLpmB4"
              ],
              "description": "Graduate of BS in Information Technology specializing in full-stack web and database development.",
              "knowsAbout": [
                "PHP",
                "JavaScript",
                "HTML",
                "CSS",
                "SQL",
                "MySQL",
                "Bootstrap 5",
                "jQuery",
                "Tailwind CSS",
                "Next.js",
                "React",
                "Git",
                "GitHub",
                "VS Code",
                "Systems Administration",
                "Document Management"
              ]
            })
          }}
        />
      </div>
    </HydrateClient>
  );
}

