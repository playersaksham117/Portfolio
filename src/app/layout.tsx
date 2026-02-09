import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Saksham Arora | Security Analyst & Developer',
  description: 'Building secure, scalable digital experiences. Security Analyst, Full-Stack Developer, and UI/UX Designer.',
  keywords: ['Developer', 'Security Analyst', 'Flutter', 'Next.js', 'Python', 'Portfolio'],
  authors: [{ name: 'Saksham Arora' }],
  openGraph: {
    title: 'Saksham Arora | Security Analyst & Developer',
    description: 'Building secure, scalable digital experiences.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-[#0a0a0a] text-[#e5e5e5] antialiased">
        <div className="noise-overlay" />
        {children}
      </body>
    </html>
  );
}
