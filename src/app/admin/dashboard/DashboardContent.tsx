'use client';

import { useState, useTransition } from 'react';
import type { PortfolioData, Project } from '@/types/portfolio';
import { updateHero, addSkill, removeSkill, addProject, updateProject, deleteProject, updateContact, updateSkillCategory, updateAbout } from './actions';

interface SkillCategory {
  title: string;
  skills: string[];
  icon: string;
}

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

interface ExtendedPortfolioData extends PortfolioData {
  hero: {
    title: string;
    subtitle?: string;
    roles?: string[];
    description: string;
  };
  about?: AboutData;
  skillCategories?: Record<string, SkillCategory>;
  contact: {
    email: string;
    socials?: {
      github?: string;
      linkedin?: string;
      twitter?: string;
    };
  };
}

interface DashboardContentProps {
  initialData: ExtendedPortfolioData;
}

export default function DashboardContent({ initialData }: DashboardContentProps) {
  const [data, setData] = useState<ExtendedPortfolioData>(initialData as ExtendedPortfolioData);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [activeTab, setActiveTab] = useState('hero');

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const tabs = [
    { id: 'hero', label: 'Hero Section', icon: '✨' },
    { id: 'about', label: 'About Me', icon: '👤' },
    { id: 'skills', label: 'Skill Categories', icon: '🛠️' },
    { id: 'projects', label: 'Projects', icon: '📁' },
    { id: 'contact', label: 'Contact & Social', icon: '📧' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Toast Notification */}
      {message && (
        <div className={`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-2xl z-50 backdrop-blur-sm border ${
          message.type === 'success' 
            ? 'bg-green-500/20 border-green-500/50 text-green-400' 
            : 'bg-red-500/20 border-red-500/50 text-red-400'
        }`}>
          {message.text}
        </div>
      )}

      {/* Tab Navigation */}
      <div className="border-b border-white/10 bg-[#111111]">
        <div className="max-w-6xl mx-auto px-6">
          <nav className="flex gap-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-4 text-sm font-medium whitespace-nowrap transition-all border-b-2 ${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-white bg-white/5'
                    : 'border-transparent text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {activeTab === 'hero' && (
          <HeroEditor
            hero={data.hero}
            isPending={isPending}
            onSave={(heroData) => {
              startTransition(async () => {
                const result = await updateHero(heroData);
                if (result.success) {
                  setData(prev => ({ ...prev, hero: heroData }));
                  showMessage('success', 'Hero section updated!');
                } else {
                  showMessage('error', result.error || 'Failed to update');
                }
              });
            }}
          />
        )}

        {activeTab === 'about' && (
          <AboutEditor
            about={data.about || { title: 'About Me', description: '', highlights: [], achievements: [] }}
            isPending={isPending}
            onSave={(aboutData) => {
              startTransition(async () => {
                const result = await updateAbout(aboutData);
                if (result?.success) {
                  setData(prev => ({ ...prev, about: aboutData }));
                  showMessage('success', 'About section updated!');
                } else {
                  showMessage('error', result?.error || 'Failed to update');
                }
              });
            }}
          />
        )}

        {activeTab === 'skills' && (
          <SkillCategoriesEditor
            skillCategories={data.skillCategories || {}}
            isPending={isPending}
            onUpdateCategory={(key, categoryData) => {
              startTransition(async () => {
                const result = await updateSkillCategory(key, categoryData);
                if (result.success) {
                  setData(prev => ({
                    ...prev,
                    skillCategories: {
                      ...prev.skillCategories,
                      [key]: categoryData,
                    },
                  }));
                  showMessage('success', 'Skill category updated!');
                } else {
                  showMessage('error', result.error || 'Failed to update');
                }
              });
            }}
          />
        )}

        {activeTab === 'projects' && (
          <ProjectsEditor
            projects={data.projects}
            isPending={isPending}
            onAdd={(project) => {
              startTransition(async () => {
                const result = await addProject(project);
                if (result.success) {
                  const newProject = { ...project, id: Date.now().toString() };
                  setData(prev => ({ ...prev, projects: [...prev.projects, newProject] }));
                  showMessage('success', 'Project added!');
                } else {
                  showMessage('error', result.error || 'Failed to add project');
                }
              });
            }}
            onUpdate={(project) => {
              startTransition(async () => {
                const result = await updateProject(project);
                if (result.success) {
                  setData(prev => ({ ...prev, projects: prev.projects.map(p => p.id === project.id ? project : p) }));
                  showMessage('success', 'Project updated!');
                } else {
                  showMessage('error', result.error || 'Failed to update project');
                }
              });
            }}
            onDelete={(projectId) => {
              startTransition(async () => {
                const result = await deleteProject(projectId);
                if (result.success) {
                  setData(prev => ({ ...prev, projects: prev.projects.filter(p => p.id !== projectId) }));
                  showMessage('success', 'Project deleted!');
                } else {
                  showMessage('error', result.error || 'Failed to delete project');
                }
              });
            }}
          />
        )}

        {activeTab === 'contact' && (
          <ContactEditor
            contact={data.contact}
            isPending={isPending}
            onSave={(contactData) => {
              startTransition(async () => {
                const result = await updateContact(contactData);
                if (result.success) {
                  setData(prev => ({ ...prev, contact: contactData }));
                  showMessage('success', 'Contact info updated!');
                } else {
                  showMessage('error', result.error || 'Failed to update contact');
                }
              });
            }}
          />
        )}
      </div>
    </div>
  );
}

// ============================================
// HERO SECTION EDITOR
// ============================================

interface HeroData {
  title: string;
  subtitle?: string;
  roles?: string[];
  description: string;
}

function HeroEditor({ hero, isPending, onSave }: { 
  hero: HeroData; 
  isPending: boolean; 
  onSave: (data: HeroData) => void;
}) {
  const [title, setTitle] = useState(hero.title);
  const [subtitle, setSubtitle] = useState(hero.subtitle || '');
  const [roles, setRoles] = useState<string[]>(hero.roles || []);
  const [description, setDescription] = useState(hero.description);
  const [newRole, setNewRole] = useState('');

  const handleAddRole = () => {
    if (newRole.trim() && roles.length < 10) {
      setRoles([...roles, newRole.trim()]);
      setNewRole('');
    }
  };

  const handleRemoveRole = (index: number) => {
    setRoles(roles.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    onSave({ title, subtitle, roles, description });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Hero Section</h2>
        <span className="text-xs text-gray-500 font-mono">Typewriter effect uses roles array</span>
      </div>

      <div className="grid gap-6">
        {/* Title */}
        <div className="bg-[#111111] border border-white/10 rounded-xl p-6">
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Main Title <span className="text-gray-600">({title.length}/200)</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={200}
            className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
            placeholder="Hi, I'm Saksham"
          />
        </div>

        {/* Subtitle */}
        <div className="bg-[#111111] border border-white/10 rounded-xl p-6">
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Subtitle <span className="text-gray-600">(displayed below roles)</span>
          </label>
          <input
            type="text"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            maxLength={200}
            className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
            placeholder="Building the future, one line at a time"
          />
        </div>

        {/* Roles (Typewriter) */}
        <div className="bg-[#111111] border border-white/10 rounded-xl p-6">
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Roles <span className="text-gray-600">(Typewriter Animation - max 10)</span>
          </label>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddRole()}
              maxLength={50}
              className="flex-1 bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
              placeholder="Full Stack Developer"
            />
            <button
              onClick={handleAddRole}
              disabled={!newRole.trim() || roles.length >= 10}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-lg font-medium transition-all"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {roles.map((role, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-2 bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-3 py-1.5 rounded-full text-sm"
              >
                <span className="font-mono text-xs text-indigo-600">{index + 1}</span>
                {role}
                <button
                  onClick={() => handleRemoveRole(index)}
                  className="text-indigo-400 hover:text-red-400 transition-colors ml-1"
                  aria-label={`Remove ${role}`}
                >
                  ×
                </button>
              </span>
            ))}
            {roles.length === 0 && (
              <p className="text-gray-500 text-sm">No roles added. Add roles for the typewriter effect.</p>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="bg-[#111111] border border-white/10 rounded-xl p-6">
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Description <span className="text-gray-600">({description.length}/1000)</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={1000}
            rows={4}
            className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all resize-none"
            placeholder="Write a brief introduction about yourself..."
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={isPending}
          className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 disabled:from-gray-700 disabled:to-gray-700 text-white rounded-lg font-medium transition-all shadow-lg shadow-indigo-500/20"
        >
          {isPending ? 'Saving...' : 'Save Hero Section'}
        </button>
      </div>
    </div>
  );
}

// ============================================
// ABOUT SECTION EDITOR
// ============================================

function AboutEditor({ about, isPending, onSave }: {
  about: AboutData;
  isPending: boolean;
  onSave: (data: AboutData) => void;
}) {
  const [title, setTitle] = useState(about.title);
  const [description, setDescription] = useState(about.description);
  const [highlights, setHighlights] = useState<string[]>(about.highlights || []);
  const [achievements, setAchievements] = useState<Achievement[]>(about.achievements || [
    { label: 'Years Experience', value: '3+' },
    { label: 'Projects Completed', value: '15+' },
    { label: 'Technologies', value: '20+' },
    { label: 'Certifications', value: '5+' },
  ]);
  const [image, setImage] = useState(about.image || '');
  const [newHighlight, setNewHighlight] = useState('');

  const handleAddHighlight = () => {
    if (newHighlight.trim() && highlights.length < 10) {
      setHighlights([...highlights, newHighlight.trim()]);
      setNewHighlight('');
    }
  };

  const handleRemoveHighlight = (index: number) => {
    setHighlights(highlights.filter((_, i) => i !== index));
  };

  const handleAddAchievement = () => {
    if (achievements.length < 8) {
      setAchievements([...achievements, { label: '', value: '' }]);
    }
  };

  const handleUpdateAchievement = (index: number, field: 'label' | 'value', newValue: string) => {
    const updated = [...achievements];
    updated[index][field] = newValue;
    setAchievements(updated);
  };

  const handleRemoveAchievement = (index: number) => {
    setAchievements(achievements.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    onSave({ title, description, highlights, achievements, image });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">About Section</h2>
        <span className="text-xs text-gray-500 font-mono">Tell visitors about yourself</span>
      </div>

      <div className="grid gap-6">
        {/* Title */}
        <div className="bg-[#111111] border border-white/10 rounded-xl p-6">
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Section Title <span className="text-gray-600">({title.length}/100)</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={100}
            className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
            placeholder="About Me"
          />
        </div>

        {/* Description */}
        <div className="bg-[#111111] border border-white/10 rounded-xl p-6">
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Description <span className="text-gray-600">({description.length}/2000)</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={2000}
            rows={6}
            className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all resize-none"
            placeholder="Write about yourself, your background, interests, and what drives you..."
          />
        </div>

        {/* Highlights */}
        <div className="bg-[#111111] border border-white/10 rounded-xl p-6">
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Highlights <span className="text-gray-600">(Key achievements or facts - max 10)</span>
          </label>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newHighlight}
              onChange={(e) => setNewHighlight(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddHighlight()}
              maxLength={150}
              className="flex-1 bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
              placeholder="3+ years of development experience"
            />
            <button
              onClick={handleAddHighlight}
              disabled={!newHighlight.trim() || highlights.length >= 10}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-lg font-medium transition-all"
            >
              Add
            </button>
          </div>
          <div className="space-y-2">
            {highlights.map((highlight, index) => (
              <div
                key={index}
                className="flex items-center gap-3 bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 group"
              >
                <span className="text-cyan-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
                <span className="flex-1 text-gray-300">{highlight}</span>
                <button
                  onClick={() => handleRemoveHighlight(index)}
                  className="text-gray-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                  aria-label={`Remove highlight`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
            {highlights.length === 0 && (
              <p className="text-gray-500 text-sm">No highlights added. Add key facts about yourself.</p>
            )}
          </div>
        </div>

        {/* Achievements / Stats */}
        <div className="bg-[#111111] border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-medium text-gray-400">
              Achievements <span className="text-gray-600">(Stats displayed at bottom - max 8)</span>
            </label>
            <button
              onClick={handleAddAchievement}
              disabled={achievements.length >= 8}
              className="text-sm text-indigo-400 hover:text-indigo-300 disabled:text-gray-600 transition-colors"
            >
              + Add Achievement
            </button>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-[#0a0a0a] border border-white/10 rounded-lg p-3 group"
              >
                <div className="flex-1 grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={achievement.value}
                    onChange={(e) => handleUpdateAchievement(index, 'value', e.target.value)}
                    maxLength={20}
                    className="bg-transparent border border-white/10 rounded px-3 py-2 text-white text-lg font-bold placeholder-gray-600 focus:border-indigo-500 outline-none"
                    placeholder="3+"
                  />
                  <input
                    type="text"
                    value={achievement.label}
                    onChange={(e) => handleUpdateAchievement(index, 'label', e.target.value)}
                    maxLength={30}
                    className="bg-transparent border border-white/10 rounded px-3 py-2 text-gray-400 text-sm placeholder-gray-600 focus:border-indigo-500 outline-none"
                    placeholder="Years Experience"
                  />
                </div>
                <button
                  onClick={() => handleRemoveAchievement(index)}
                  className="text-gray-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 p-1"
                  aria-label="Remove achievement"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
          {achievements.length === 0 && (
            <p className="text-gray-500 text-sm mt-2">No achievements added. Click &quot;+ Add Achievement&quot; to add stats.</p>
          )}
        </div>

        {/* Profile Image URL */}
        <div className="bg-[#111111] border border-white/10 rounded-xl p-6">
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Profile Image URL <span className="text-gray-600">(optional)</span>
          </label>
          <input
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
            placeholder="/about/profile.jpg or https://..."
          />
          <p className="text-gray-600 text-xs mt-2">Leave empty to show a placeholder with your initials</p>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={isPending}
          className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 disabled:from-gray-700 disabled:to-gray-700 text-white rounded-lg font-medium transition-all shadow-lg shadow-indigo-500/20"
        >
          {isPending ? 'Saving...' : 'Save About Section'}
        </button>
      </div>
    </div>
  );
}

// ============================================
// SKILL CATEGORIES EDITOR
// ============================================

function SkillCategoriesEditor({ skillCategories, isPending, onUpdateCategory }: {
  skillCategories: Record<string, SkillCategory>;
  isPending: boolean;
  onUpdateCategory: (key: string, data: SkillCategory) => void;
}) {
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editData, setEditData] = useState<SkillCategory | null>(null);
  const [newSkillInput, setNewSkillInput] = useState('');

  const iconOptions = ['💻', '🔐', '🔧', '🤖', '🗄️', '📝', '🎨', '📊', '🌐', '⚡'];

  const handleEdit = (key: string) => {
    setEditingKey(key);
    setEditData({ ...skillCategories[key] });
    setNewSkillInput('');
  };

  const handleAddSkillToCategory = () => {
    if (newSkillInput.trim() && editData) {
      setEditData({
        ...editData,
        skills: [...editData.skills, newSkillInput.trim()],
      });
      setNewSkillInput('');
    }
  };

  const handleRemoveSkillFromCategory = (index: number) => {
    if (editData) {
      setEditData({
        ...editData,
        skills: editData.skills.filter((_, i) => i !== index),
      });
    }
  };

  const handleSave = () => {
    if (editingKey && editData) {
      onUpdateCategory(editingKey, editData);
      setEditingKey(null);
      setEditData(null);
    }
  };

  const handleCancel = () => {
    setEditingKey(null);
    setEditData(null);
  };

  const categories = Object.entries(skillCategories);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Skill Categories</h2>
        <span className="text-xs text-gray-500 font-mono">Bento Grid Layout</span>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {categories.map(([key, category]) => (
          <div
            key={key}
            className={`bg-[#111111] border rounded-xl p-5 transition-all ${
              editingKey === key ? 'border-indigo-500' : 'border-white/10 hover:border-white/20'
            }`}
          >
            {editingKey === key && editData ? (
              /* Edit Mode */
              <div className="space-y-4">
                <div className="flex gap-3">
                  <select
                    value={editData.icon}
                    onChange={(e) => setEditData({ ...editData, icon: e.target.value })}
                    className="bg-[#0a0a0a] border border-white/10 rounded-lg px-3 py-2 text-2xl focus:border-indigo-500 outline-none"
                  >
                    {iconOptions.map((icon) => (
                      <option key={icon} value={icon}>{icon}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={editData.title}
                    onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                    className="flex-1 bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2 text-white focus:border-indigo-500 outline-none"
                    placeholder="Category Title"
                  />
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSkillInput}
                    onChange={(e) => setNewSkillInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddSkillToCategory()}
                    className="flex-1 bg-[#0a0a0a] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-indigo-500 outline-none"
                    placeholder="Add skill..."
                  />
                  <button
                    onClick={handleAddSkillToCategory}
                    disabled={!newSkillInput.trim()}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-700 text-white rounded-lg text-sm transition-all"
                  >
                    +
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {editData.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center bg-[#0a0a0a] border border-white/10 text-gray-300 px-2 py-1 rounded text-xs"
                    >
                      {skill}
                      <button
                        onClick={() => handleRemoveSkillFromCategory(idx)}
                        className="ml-1.5 text-gray-500 hover:text-red-400"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={handleSave}
                    disabled={isPending}
                    className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-all"
                  >
                    {isPending ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-400 rounded-lg text-sm transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              /* View Mode */
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{category.icon}</span>
                    <h3 className="font-semibold text-white">{category.title}</h3>
                  </div>
                  <button
                    onClick={() => handleEdit(key)}
                    className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    Edit
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {category.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="bg-white/5 text-gray-400 px-2 py-1 rounded text-xs"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-gray-600 mt-3 font-mono">Key: {key}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No skill categories found. Add them in your portfolio.json file.
        </div>
      )}
    </div>
  );
}

// ============================================
// PROJECTS EDITOR
// ============================================

function ProjectsEditor({ projects, isPending, onAdd, onUpdate, onDelete }: {
  projects: Project[];
  isPending: boolean;
  onAdd: (project: Omit<Project, 'id'>) => void;
  onUpdate: (project: Project) => void;
  onDelete: (projectId: string) => void;
}) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Projects</h2>
        <button
          onClick={() => setIsAdding(true)}
          disabled={isAdding}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-700 text-white rounded-lg text-sm font-medium transition-all"
        >
          + Add Project
        </button>
      </div>

      {isAdding && (
        <ProjectForm
          isPending={isPending}
          onSave={(project) => {
            onAdd(project);
            setIsAdding(false);
          }}
          onCancel={() => setIsAdding(false)}
        />
      )}

      <div className="grid gap-4">
        {projects.map((project) => (
          <div key={project.id}>
            {editingId === project.id ? (
              <ProjectForm
                project={project}
                isPending={isPending}
                onSave={(updatedProject) => {
                  onUpdate({ ...updatedProject, id: project.id });
                  setEditingId(null);
                }}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <div className="bg-[#111111] border border-white/10 rounded-xl p-5 hover:border-white/20 transition-all">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-white text-lg">{project.title}</h3>
                    <p className="text-gray-400 text-sm mt-1 line-clamp-2">{project.description}</p>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {project.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded text-xs font-mono"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-3 ml-4">
                    <button
                      onClick={() => setEditingId(project.id)}
                      className="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Delete this project?')) onDelete(project.id);
                      }}
                      disabled={isPending}
                      className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
        {projects.length === 0 && !isAdding && (
          <div className="text-center py-12 text-gray-500">
            No projects yet. Click &quot;Add Project&quot; to create one.
          </div>
        )}
      </div>
    </div>
  );
}

function ProjectForm({ project, isPending, onSave, onCancel }: {
  project?: Project;
  isPending: boolean;
  onSave: (project: Omit<Project, 'id'>) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(project?.title || '');
  const [description, setDescription] = useState(project?.description || '');
  const [techStack, setTechStack] = useState(project?.techStack.join(', ') || '');
  const [liveUrl, setLiveUrl] = useState(project?.liveUrl || '');
  const [githubUrl, setGithubUrl] = useState(project?.githubUrl || '');

  const handleSubmit = () => {
    const techArray = techStack.split(',').map(t => t.trim()).filter(t => t.length > 0);
    onSave({ title, description, techStack: techArray, liveUrl, githubUrl });
  };

  return (
    <div className="bg-[#111111] border border-indigo-500/50 rounded-xl p-5">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1.5">Project Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={100}
            className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-indigo-500 outline-none transition-all"
            placeholder="My Awesome Project"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1.5">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={500}
            rows={3}
            className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-indigo-500 outline-none transition-all resize-none"
            placeholder="Describe what this project does..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1.5">Tech Stack <span className="text-gray-600">(comma-separated)</span></label>
          <input
            type="text"
            value={techStack}
            onChange={(e) => setTechStack(e.target.value)}
            className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-indigo-500 outline-none transition-all"
            placeholder="React, Node.js, MongoDB, Tailwind"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">Live URL <span className="text-gray-600">(optional)</span></label>
            <input
              type="url"
              value={liveUrl}
              onChange={(e) => setLiveUrl(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-indigo-500 outline-none transition-all"
              placeholder="https://project-demo.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">GitHub URL <span className="text-gray-600">(optional)</span></label>
            <input
              type="url"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-indigo-500 outline-none transition-all"
              placeholder="https://github.com/user/repo"
            />
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <button
            onClick={handleSubmit}
            disabled={isPending || !title.trim() || !description.trim()}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-700 text-white rounded-lg text-sm font-medium transition-all"
          >
            {project ? 'Update' : 'Add'} Project
          </button>
          <button
            onClick={onCancel}
            className="px-6 py-2.5 bg-white/5 hover:bg-white/10 text-gray-400 rounded-lg text-sm font-medium transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// CONTACT EDITOR
// ============================================

interface ContactData {
  email: string;
  cvUrl?: string;
  certificatesUrl?: string;
  socials?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
  };
}

function ContactEditor({ contact, isPending, onSave }: {
  contact: ContactData;
  isPending: boolean;
  onSave: (data: ContactData) => void;
}) {
  const [email, setEmail] = useState(contact.email);
  const [cvUrl, setCvUrl] = useState((contact as any).cvUrl || '');
  const [certificatesUrl, setCertificatesUrl] = useState((contact as any).certificatesUrl || '');
  const [github, setGithub] = useState(contact.socials?.github || '');
  const [linkedin, setLinkedin] = useState(contact.socials?.linkedin || '');
  const [twitter, setTwitter] = useState(contact.socials?.twitter || '');

  const handleSave = () => {
    onSave({
      email,
      cvUrl,
      certificatesUrl,
      socials: { github, linkedin, twitter },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Contact & Social Links</h2>
      </div>

      <div className="grid gap-6">
        {/* Email */}
        <div className="bg-[#111111] border border-white/10 rounded-xl p-6">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-2">
            <span className="text-lg">📧</span> Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
            placeholder="your@email.com"
          />
        </div>

        {/* CV & Certificates Links */}
        <div className="bg-[#111111] border border-white/10 rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-semibold text-white mb-4">Documents</h3>
          
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-2">
              <span className="text-lg">📄</span> CV / Resume Link
            </label>
            <input
              type="url"
              value={cvUrl}
              onChange={(e) => setCvUrl(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:border-indigo-500 outline-none transition-all"
              placeholder="https://drive.google.com/your-cv"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-2">
              <span className="text-lg">🏆</span> Certificates Link
            </label>
            <input
              type="url"
              value={certificatesUrl}
              onChange={(e) => setCertificatesUrl(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:border-indigo-500 outline-none transition-all"
              placeholder="https://drive.google.com/certificates-folder"
            />
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-[#111111] border border-white/10 rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-semibold text-white mb-4">Social Links</h3>
          
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              GitHub
            </label>
            <input
              type="url"
              value={github}
              onChange={(e) => setGithub(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:border-indigo-500 outline-none transition-all"
              placeholder="https://github.com/username"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              LinkedIn
            </label>
            <input
              type="url"
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:border-indigo-500 outline-none transition-all"
              placeholder="https://linkedin.com/in/username"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              X (Twitter)
            </label>
            <input
              type="url"
              value={twitter}
              onChange={(e) => setTwitter(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:border-indigo-500 outline-none transition-all"
              placeholder="https://x.com/username"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={isPending}
          className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 disabled:from-gray-700 disabled:to-gray-700 text-white rounded-lg font-medium transition-all shadow-lg shadow-indigo-500/20"
        >
          {isPending ? 'Saving...' : 'Save Contact Info'}
        </button>
      </div>
    </div>
  );
}
