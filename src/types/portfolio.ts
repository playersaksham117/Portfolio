export interface HeroData {
  title: string;
  description: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  liveUrl?: string;
  githubUrl?: string;
}

export interface ContactData {
  email: string;
  cvUrl?: string;
  certificatesUrl?: string;
}

export interface PortfolioData {
  hero: HeroData;
  skills: string[];
  projects: Project[];
  contact: ContactData;
}
