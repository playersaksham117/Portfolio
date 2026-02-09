'use server';

import { revalidatePath } from 'next/cache';
import { getPortfolioData, savePortfolioData } from '@/lib/data';
import type { PortfolioData, Project } from '@/types/portfolio';

export interface ActionResult {
  success: boolean;
  error?: string;
}

// Auth disabled - direct access allowed
async function requireAuth(): Promise<boolean> {
  return true;
}

// ============================================
// HERO SECTION
// ============================================

export async function updateHero(heroData: {
  title: string;
  subtitle?: string;
  roles?: string[];
  description: string;
}): Promise<ActionResult> {
  try {
    await requireAuth();
    if (!heroData.title || heroData.title.length > 200) return { success: false, error: 'Title must be 1-200 characters' };
    if (!heroData.description || heroData.description.length > 1000) return { success: false, error: 'Description must be 1-1000 characters' };
    
    const data = await getPortfolioData() as any;
    data.hero = {
      title: heroData.title.trim(),
      subtitle: heroData.subtitle?.trim() || '',
      roles: heroData.roles || [],
      description: heroData.description.trim(),
    };
    const result = await savePortfolioData(data);
    if (result.success) {
      revalidatePath('/');
      revalidatePath('/admin/dashboard');
    }
    return result;
  } catch (error) {
    console.error('Error updating hero:', error);
    return { success: false, error: 'Failed to update hero section' };
  }
}

// ============================================
// ABOUT SECTION
// ============================================

export async function updateAbout(aboutData: {
  title: string;
  description: string;
  highlights?: string[];
  achievements?: { label: string; value: string }[];
  image?: string;
}): Promise<ActionResult> {
  try {
    await requireAuth();
    if (!aboutData || !aboutData.title || aboutData.title.length > 100) {
      return { success: false, error: 'Title must be 1-100 characters' };
    }
    if (!aboutData.description || aboutData.description.length > 2000) {
      return { success: false, error: 'Description must be 1-2000 characters' };
    }
    
    const data = await getPortfolioData() as any;
    
    // Safely process achievements
    let processedAchievements: { label: string; value: string }[] = [];
    if (aboutData.achievements && Array.isArray(aboutData.achievements)) {
      processedAchievements = aboutData.achievements
        .filter(a => a && a.label && a.value && a.label.trim() && a.value.trim())
        .map(a => ({
          label: a.label.trim(),
          value: a.value.trim(),
        }));
    }
    
    data.about = {
      title: aboutData.title.trim(),
      description: aboutData.description.trim(),
      highlights: aboutData.highlights?.map(h => h.trim()).filter(h => h.length > 0) || [],
      achievements: processedAchievements,
      image: aboutData.image?.trim() || '',
    };
    
    const result = await savePortfolioData(data);
    if (result.success) {
      revalidatePath('/');
      revalidatePath('/admin/dashboard');
    }
    return result;
  } catch (error) {
    console.error('Error updating about:', error);
    return { success: false, error: 'Failed to update about section' };
  }
}

// ============================================
// SKILL CATEGORIES
// ============================================

export async function updateSkillCategory(
  categoryKey: string,
  categoryData: { title: string; skills: string[]; icon: string }
): Promise<ActionResult> {
  try {
    await requireAuth();
    if (!categoryData.title || categoryData.title.length > 50) {
      return { success: false, error: 'Category title must be 1-50 characters' };
    }
    
    const data = await getPortfolioData() as any;
    if (!data.skillCategories) {
      data.skillCategories = {};
    }
    
    data.skillCategories[categoryKey] = {
      title: categoryData.title.trim(),
      skills: categoryData.skills.map(s => s.trim()).filter(s => s.length > 0),
      icon: categoryData.icon,
    };
    
    const result = await savePortfolioData(data);
    if (result.success) {
      revalidatePath('/');
      revalidatePath('/admin/dashboard');
    }
    return result;
  } catch (error) {
    console.error('Error updating skill category:', error);
    return { success: false, error: 'Failed to update skill category' };
  }
}

export async function deleteSkillCategory(categoryKey: string): Promise<ActionResult> {
  try {
    await requireAuth();
    const data = await getPortfolioData() as any;
    
    if (data.skillCategories && data.skillCategories[categoryKey]) {
      delete data.skillCategories[categoryKey];
    }
    
    const result = await savePortfolioData(data);
    if (result.success) {
      revalidatePath('/');
      revalidatePath('/admin/dashboard');
    }
    return result;
  } catch (error) {
    console.error('Error deleting skill category:', error);
    return { success: false, error: 'Failed to delete skill category' };
  }
}

export async function addSkill(skill: string): Promise<ActionResult> {
  try {
    await requireAuth();
    const trimmedSkill = skill.trim();
    if (!trimmedSkill || trimmedSkill.length > 50) return { success: false, error: 'Skill must be 1-50 characters' };
    const data = await getPortfolioData();
    if (data.skills.some(s => s.toLowerCase() === trimmedSkill.toLowerCase())) {
      return { success: false, error: 'Skill already exists' };
    }
    if (data.skills.length >= 50) return { success: false, error: 'Maximum 50 skills allowed' };
    data.skills.push(trimmedSkill);
    const result = await savePortfolioData(data);
    if (result.success) {
      revalidatePath('/');
      revalidatePath('/admin/dashboard');
    }
    return result;
  } catch (error) {
    console.error('Error adding skill:', error);
    return { success: false, error: 'Failed to add skill' };
  }
}

export async function removeSkill(skill: string): Promise<ActionResult> {
  try {
    await requireAuth();
    const data = await getPortfolioData();
    data.skills = data.skills.filter(s => s !== skill);
    const result = await savePortfolioData(data);
    if (result.success) {
      revalidatePath('/');
      revalidatePath('/admin/dashboard');
    }
    return result;
  } catch (error) {
    console.error('Error removing skill:', error);
    return { success: false, error: 'Failed to remove skill' };
  }
}

export async function addProject(project: Omit<Project, 'id'>): Promise<ActionResult> {
  try {
    await requireAuth();
    if (!project.title || project.title.length > 100) return { success: false, error: 'Project title must be 1-100 characters' };
    if (!project.description || project.description.length > 500) return { success: false, error: 'Project description must be 1-500 characters' };
    if (!Array.isArray(project.techStack) || project.techStack.length > 10) return { success: false, error: 'Tech stack must have 1-10 items' };
    const data = await getPortfolioData();
    if (data.projects.length >= 20) return { success: false, error: 'Maximum 20 projects allowed' };
    const newProject: Project = {
      id: Date.now().toString(),
      title: project.title.trim(),
      description: project.description.trim(),
      techStack: project.techStack.map(t => t.trim()).filter(t => t.length > 0),
      liveUrl: (project as any).liveUrl?.trim() || '',
      githubUrl: (project as any).githubUrl?.trim() || '',
    };
    data.projects.push(newProject);
    const result = await savePortfolioData(data);
    if (result.success) {
      revalidatePath('/');
      revalidatePath('/admin/dashboard');
    }
    return result;
  } catch (error) {
    console.error('Error adding project:', error);
    return { success: false, error: 'Failed to add project' };
  }
}

export async function updateProject(project: Project): Promise<ActionResult> {
  try {
    await requireAuth();
    if (!project.id) return { success: false, error: 'Project ID is required' };
    if (!project.title || project.title.length > 100) return { success: false, error: 'Project title must be 1-100 characters' };
    if (!project.description || project.description.length > 500) return { success: false, error: 'Project description must be 1-500 characters' };
    const data = await getPortfolioData();
    const projectIndex = data.projects.findIndex(p => p.id === project.id);
    if (projectIndex === -1) return { success: false, error: 'Project not found' };
    data.projects[projectIndex] = {
      id: project.id,
      title: project.title.trim(),
      description: project.description.trim(),
      techStack: project.techStack.map(t => t.trim()).filter(t => t.length > 0),
      liveUrl: (project as any).liveUrl?.trim() || '',
      githubUrl: (project as any).githubUrl?.trim() || '',
    };
    const result = await savePortfolioData(data);
    if (result.success) {
      revalidatePath('/');
      revalidatePath('/admin/dashboard');
    }
    return result;
  } catch (error) {
    console.error('Error updating project:', error);
    return { success: false, error: 'Failed to update project' };
  }
}

export async function deleteProject(projectId: string): Promise<ActionResult> {
  try {
    await requireAuth();
    const data = await getPortfolioData();
    const originalLength = data.projects.length;
    data.projects = data.projects.filter(p => p.id !== projectId);
    if (data.projects.length === originalLength) return { success: false, error: 'Project not found' };
    const result = await savePortfolioData(data);
    if (result.success) {
      revalidatePath('/');
      revalidatePath('/admin/dashboard');
    }
    return result;
  } catch (error) {
    console.error('Error deleting project:', error);
    return { success: false, error: 'Failed to delete project' };
  }
}

export async function updateContact(contactData: {
  email: string;
  cvUrl?: string;
  certificatesUrl?: string;
  socials?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
  };
}): Promise<ActionResult> {
  try {
    await requireAuth();
    const trimmedEmail = contactData.email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) return { success: false, error: 'Invalid email address' };
    
    const data = await getPortfolioData() as any;
    data.contact = { 
      email: trimmedEmail,
      cvUrl: contactData.cvUrl?.trim() || '',
      certificatesUrl: contactData.certificatesUrl?.trim() || '',
      socials: {
        github: contactData.socials?.github?.trim() || '',
        linkedin: contactData.socials?.linkedin?.trim() || '',
        twitter: contactData.socials?.twitter?.trim() || '',
      }
    };
    const result = await savePortfolioData(data);
    if (result.success) {
      revalidatePath('/');
      revalidatePath('/admin/dashboard');
    }
    return result;
  } catch (error) {
    console.error('Error updating contact:', error);
    return { success: false, error: 'Failed to update contact' };
  }
}

export async function getPortfolio(): Promise<PortfolioData> {
  await requireAuth();
  return getPortfolioData();
}
