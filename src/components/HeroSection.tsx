'use client';

import { useState, useEffect } from 'react';

interface HeroData {
  title: string;
  subtitle?: string;
  roles?: string[];
  description: string;
}

interface HeroSectionProps {
  data: HeroData;
  cvUrl?: string;
}

export default function HeroSection({ data, cvUrl }: HeroSectionProps) {
  const [currentRole, setCurrentRole] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  
  const roles = data.roles || ['Developer', 'Designer', 'Creator'];

  useEffect(() => {
    const role = roles[currentRole];
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (displayText.length < role.length) {
          setDisplayText(role.slice(0, displayText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(displayText.slice(0, -1));
        } else {
          setIsDeleting(false);
          setCurrentRole((prev) => (prev + 1) % roles.length);
        }
      }
    }, isDeleting ? 50 : 100);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, currentRole, roles]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated gradient orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-30">
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 blur-3xl animate-pulse-glow" />
        <div className="absolute inset-10 rounded-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-500 blur-3xl animate-float opacity-50" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Greeting badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
          <span className="text-sm font-mono text-[#a3a3a3]">Welcome to my portfolio</span>
        </div>

        {/* Main headline */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6">
          <span className="text-white">{data.title.split(' ').slice(0, -1).join(' ')} </span>
          <span className="gradient-text">{data.title.split(' ').slice(-1)}</span>
        </h1>

        {/* Typewriter subtitle */}
        <div className="h-12 flex items-center justify-center mb-8">
          <span className="text-xl sm:text-2xl font-mono text-[#a3a3a3]">
            {'<'}
            <span className="text-indigo-400">{displayText}</span>
            <span className="typewriter-cursor" />
            {' />'}
          </span>
        </div>

        {/* Description */}
        <p className="text-lg sm:text-xl text-[#a3a3a3] max-w-2xl mx-auto mb-12 leading-relaxed">
          {data.description}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#projects"
            className="group flex items-center gap-3 px-8 py-4 rounded-full btn-primary text-white font-medium"
          >
            <span>View Work</span>
            <svg
              className="w-5 h-5 transform group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
          <a
            href={cvUrl || '#contact'}
            target={cvUrl ? '_blank' : undefined}
            rel={cvUrl ? 'noopener noreferrer' : undefined}
            className="group flex items-center gap-3 px-8 py-4 rounded-full btn-glass text-white font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>{cvUrl ? 'View CV' : 'Contact Me'}</span>
          </a>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
          <div className="flex flex-col items-center gap-2 text-[#525252]">
            <span className="text-xs font-mono uppercase tracking-widest">Scroll</span>
            <div className="w-6 h-10 rounded-full border-2 border-[#525252] flex justify-center p-2">
              <div className="w-1 h-2 rounded-full bg-[#525252] animate-bounce" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
