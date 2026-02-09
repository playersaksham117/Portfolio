'use client';

interface Achievement {
  label: string;
  value: string;
}

interface AboutData {
  title: string;
  description: string;
  highlights?: string[];
  achievements?: Achievement[];
  image?: string;
}

export default function AboutSection({ data }: { data?: AboutData }) {
  if (!data) return null;

  const defaultAchievements: Achievement[] = [
    { label: 'Years Experience', value: '3+' },
    { label: 'Projects Completed', value: '15+' },
    { label: 'Technologies', value: '20+' },
    { label: 'Certifications', value: '5+' },
  ];

  const achievements = data.achievements && data.achievements.length > 0 
    ? data.achievements 
    : defaultAchievements;

  return (
    <section id="about" className="py-24 relative">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex items-center gap-4 mb-16">
          <span className="text-indigo-500 font-mono text-sm">01.</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white">{data.title}</h2>
          <div className="flex-1 h-px bg-gradient-to-r from-white/20 to-transparent" />
        </div>

        <div className="grid md:grid-cols-5 gap-12 items-start">
          {/* Text Content */}
          <div className="md:col-span-3 space-y-6">
            <p className="text-gray-400 text-lg leading-relaxed">
              {data.description}
            </p>

            {data.highlights && data.highlights.length > 0 && (
              <div className="space-y-3 pt-4">
                <h3 className="text-white font-semibold text-sm uppercase tracking-wider">Highlights</h3>
                <ul className="space-y-3">
                  {data.highlights.map((highlight, index) => (
                    <li key={index} className="flex items-start gap-3 group">
                      <span className="text-cyan-500 mt-1.5 group-hover:text-indigo-400 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                      <span className="text-gray-300 group-hover:text-white transition-colors">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Image / Visual */}
          <div className="md:col-span-2">
            <div className="relative group">
              {/* Decorative border */}
              <div className="absolute -inset-2 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 opacity-20 blur-lg group-hover:opacity-40 transition-opacity" />
              <div className="absolute inset-0 rounded-xl border-2 border-indigo-500/50 translate-x-4 translate-y-4 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform" />
              
              {/* Image container */}
              <div className="relative aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 border border-white/10">
                {data.image ? (
                  <img 
                    src={data.image} 
                    alt="Profile"
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center mb-4">
                        <span className="text-4xl font-bold text-white">S</span>
                      </div>
                      <p className="text-gray-500 text-sm">Saksham Arora</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Achievements Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 pt-16 border-t border-white/10">
          {achievements.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent group-hover:from-cyan-400 group-hover:to-indigo-400 transition-all">
                {stat.value}
              </div>
              <div className="text-gray-500 text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
