import { Metadata } from 'next';
import { getPortfolioData } from '@/lib/data';
import DashboardContent from './DashboardContent';

export const metadata: Metadata = {
  title: 'Dashboard | Admin Panel',
  description: 'Manage your portfolio content',
  robots: 'noindex, nofollow',
};

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const portfolioData = await getPortfolioData();

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <header className="bg-[#111111] border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center">
                <span className="text-white text-sm font-bold">S</span>
              </div>
              <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <a 
                href="/" 
                target="_blank" 
                className="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors flex items-center gap-1"
              >
                View Site 
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <DashboardContent initialData={portfolioData as any} />
    </div>
  );
}
