import React from "react";

type LegalSection = {
  heading: string;
  paragraphs?: string[];
  list?: string[];
};

type LegalSectionGroup = {
  title?: string;
  sections: LegalSection[];
};

export default function LegalPage({
  title,
  subtitle,
  lastUpdated,
  groups,
}: {
  title: string;
  subtitle: string;
  lastUpdated: string;
  groups: LegalSectionGroup[];
}) {
  return (
    <div className="py-16 md:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-5xl">
            {title}
          </h1>
          <div className="h-1.5 w-16 bg-blue-600 rounded-full mx-auto" />
          <p className="text-lg text-slate-600 dark:text-slate-400">{subtitle}</p>
          <p className="text-sm text-slate-400 dark:text-slate-500">
            Last updated: {lastUpdated}
          </p>
        </div>

        {/* Content */}
        <div className="space-y-10">
          {groups.map((group, groupIndex) => (
            <div key={groupIndex} className="space-y-6">
              {group.title && (
                <h2 className="text-2xl font-bold text-slate-950 dark:text-white">
                  {group.title}
                </h2>
              )}
              {group.sections.map((section, sectionIndex) => (
                <div key={sectionIndex} className="glass-panel p-6 sm:p-8 rounded-2xl shadow-xs">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
                    {section.heading}
                  </h3>
                  {section.paragraphs?.map((paragraph, pIndex) => (
                    <p
                      key={pIndex}
                      className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed mb-3 last:mb-0"
                    >
                      {paragraph}
                    </p>
                  ))}
                  {section.list?.length ? (
                    <ul className="list-disc pl-6 space-y-2 text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                      {section.list.map((item, lIndex) => (
                        <li key={lIndex}>{item}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}