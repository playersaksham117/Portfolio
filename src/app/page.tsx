import { getPortfolioData } from '@/lib/data';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import SkillsSection from '@/components/SkillsSection';
import ProjectsSection from '@/components/ProjectsSection';
import ContactSection from '@/components/ContactSection';
import Navigation from '@/components/Navigation';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const data = await getPortfolioData();

  return (
    <main className="min-h-screen bg-[#0a0a0a] relative">
      {/* Grid pattern background */}
      <div className="fixed inset-0 grid-pattern opacity-50 pointer-events-none" />
      
      {/* Navigation */}
      <Navigation />
      
      {/* Hero Section */}
      <HeroSection data={data.hero} cvUrl={(data.contact as any).cvUrl} />
      
      {/* About Section */}
      <AboutSection data={(data as any).about} />
      
      {/* Skills Bento Grid */}
      <SkillsSection skillCategories={(data as any).skillCategories} />
      
      {/* Projects Showcase */}
      <ProjectsSection projects={data.projects} />
      
      {/* Contact Section */}
      <ContactSection contact={data.contact} />
    </main>
  );
}
