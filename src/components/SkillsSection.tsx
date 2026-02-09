'use client';

interface SkillCategory {
  title: string;
  skills: string[];
  icon: string;
}

interface SkillCategories {
  coreStack: SkillCategory;
  security: SkillCategory;
  tools: SkillCategory;
  ai: SkillCategory;
  databases: SkillCategory;
  languages: SkillCategory;
}

const iconMap: Record<string, JSX.Element> = {
  code: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  ),
  shield: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  tools: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  brain: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  ),
  database: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
    </svg>
  ),
  terminal: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
};

export default function SkillsSection({ skillCategories }: { skillCategories: SkillCategories }) {
  if (!skillCategories) return null;

  return (
    <section id="skills" className="py-32 px-6 relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-500/10 text-indigo-400 text-sm font-mono mb-4">
            {'<skills />'}
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Tech Arsenal
          </h2>
          <p className="text-[#a3a3a3] max-w-2xl mx-auto">
            A carefully curated toolkit spanning development, security, and automation.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-fr">
          {/* Core Stack - Large */}
          <BentoCard
            category={skillCategories.coreStack}
            className="md:col-span-2 lg:row-span-2"
            size="large"
          />

          {/* Security - Medium */}
          <BentoCard
            category={skillCategories.security}
            className="lg:col-span-2"
            size="medium"
            accentColor="cyan"
          />

          {/* AI & Automation */}
          <BentoCard
            category={skillCategories.ai}
            className=""
            size="small"
            accentColor="purple"
          />

          {/* Tools */}
          <BentoCard
            category={skillCategories.tools}
            className=""
            size="small"
          />

          {/* Databases */}
          <BentoCard
            category={skillCategories.databases}
            className=""
            size="small"
            accentColor="green"
          />

          {/* Languages */}
          <BentoCard
            category={skillCategories.languages}
            className=""
            size="small"
            accentColor="orange"
          />
        </div>
      </div>
    </section>
  );
}

function BentoCard({
  category,
  className = '',
  size = 'small',
  accentColor = 'indigo',
}: {
  category: SkillCategory;
  className?: string;
  size?: 'small' | 'medium' | 'large';
  accentColor?: 'indigo' | 'cyan' | 'purple' | 'green' | 'orange';
}) {
  const colors = {
    indigo: 'from-indigo-500/20 to-indigo-500/5 border-indigo-500/20 hover:border-indigo-500/50',
    cyan: 'from-cyan-500/20 to-cyan-500/5 border-cyan-500/20 hover:border-cyan-500/50',
    purple: 'from-purple-500/20 to-purple-500/5 border-purple-500/20 hover:border-purple-500/50',
    green: 'from-emerald-500/20 to-emerald-500/5 border-emerald-500/20 hover:border-emerald-500/50',
    orange: 'from-orange-500/20 to-orange-500/5 border-orange-500/20 hover:border-orange-500/50',
  };

  const iconColors = {
    indigo: 'text-indigo-400',
    cyan: 'text-cyan-400',
    purple: 'text-purple-400',
    green: 'text-emerald-400',
    orange: 'text-orange-400',
  };

  return (
    <div
      className={`bento-item rounded-2xl bg-gradient-to-br ${colors[accentColor]} border backdrop-blur-sm p-6 ${className}`}
    >
      <div className="h-full flex flex-col">
        {/* Icon */}
        <div className={`${iconColors[accentColor]} mb-4`}>
          {iconMap[category.icon]}
        </div>

        {/* Title */}
        <h3 className={`font-semibold text-white mb-3 ${size === 'large' ? 'text-2xl' : 'text-lg'}`}>
          {category.title}
        </h3>

        {/* Skills */}
        <div className={`flex flex-wrap gap-2 ${size === 'large' ? 'mt-auto' : ''}`}>
          {category.skills.map((skill) => (
            <span
              key={skill}
              className="px-3 py-1.5 rounded-lg bg-white/5 text-[#e5e5e5] text-sm font-mono border border-white/5 hover:border-white/20 transition-colors"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
