import { promises as fs } from 'fs';
import path from 'path';
import type { PortfolioData } from '@/types/portfolio';

const DATA_FILE_PATH = path.join(process.cwd(), 'src', 'data', 'portfolio.json');

export async function getPortfolioData(): Promise<PortfolioData> {
  try {
    const fileContents = await fs.readFile(DATA_FILE_PATH, 'utf-8');
    return JSON.parse(fileContents) as PortfolioData;
  } catch (error) {
    console.error('Error reading portfolio data:', error);
    return getDefaultData();
  }
}

export async function savePortfolioData(data: PortfolioData): Promise<{ success: boolean; error?: string }> {
  try {
    const validationError = validatePortfolioData(data);
    if (validationError) {
      return { success: false, error: validationError };
    }
    const jsonContent = JSON.stringify(data, null, 2);
    await fs.writeFile(DATA_FILE_PATH, jsonContent, 'utf-8');
    return { success: true };
  } catch (error) {
    console.error('Error saving portfolio data:', error);
    return { success: false, error: 'Failed to save data. Please try again.' };
  }
}

function validatePortfolioData(data: PortfolioData): string | null {
  if (!data) return 'Data is required';
  if (!data.hero || typeof data.hero.title !== 'string' || typeof data.hero.description !== 'string') {
    return 'Invalid hero data';
  }
  if (data.hero.title.length > 200) return 'Hero title must be less than 200 characters';
  if (data.hero.description.length > 1000) return 'Hero description must be less than 1000 characters';
  if (!Array.isArray(data.skills)) return 'Skills must be an array';
  if (data.skills.length > 50) return 'Maximum 50 skills allowed';
  if (!Array.isArray(data.projects)) return 'Projects must be an array';
  if (data.projects.length > 20) return 'Maximum 20 projects allowed';
  if (!data.contact || typeof data.contact.email !== 'string') return 'Invalid contact data';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.contact.email)) return 'Invalid email address';
  return null;
}

function getDefaultData(): PortfolioData {
  return {
    hero: { title: 'Welcome to My Portfolio', description: 'I am a developer passionate about creating amazing experiences.' },
    skills: ['JavaScript', 'React', 'Node.js'],
    projects: [],
    contact: { email: 'hello@example.com' },
  };
}
