/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { LibraryProvider, useLibrary } from './context/LibraryContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Profile } from './pages/Profile';
import { News } from './pages/News';
import { SOP } from './pages/SOP';
import { Organization } from './pages/Organization';
import { Contact } from './pages/Contact';
import { Admin } from './pages/Admin';

function MainApp() {
  const { loading } = useLibrary();
  const [activePage, setActivePage] = useState<string>('beranda');
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);

  // Sync state with URL hash for browser history & direct links like #admin
  useEffect(() => {
    const handleHashChange = () => {
      const rawHash = window.location.hash.replace('#', '');
      if (!rawHash) {
        setActivePage('beranda');
        setSelectedArticleId(null);
        return;
      }

      if (rawHash.startsWith('berita/')) {
        const articleId = rawHash.replace('berita/', '');
        setActivePage('berita');
        setSelectedArticleId(articleId);
      } else {
        const validPages = ['beranda', 'profil', 'berita', 'sop', 'struktur', 'kontak', 'admin'];
        if (validPages.includes(rawHash)) {
          setActivePage(rawHash);
          setSelectedArticleId(null);
        }
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = (page: string, articleId?: string) => {
    if (page === 'berita' && articleId) {
      window.location.hash = `berita/${articleId}`;
      setActivePage('berita');
      setSelectedArticleId(articleId);
    } else {
      window.location.hash = page === 'beranda' ? '' : page;
      setActivePage(page);
      setSelectedArticleId(null);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderCurrentPage = () => {
    switch (activePage) {
      case 'beranda':
        return <Home onNavigate={handleNavigate} />;
      case 'profil':
        return <Profile />;
      case 'berita':
        return (
          <News
            selectedArticleId={selectedArticleId}
            onSelectArticle={(id) => {
              if (id) {
                handleNavigate('berita', id);
              } else {
                handleNavigate('berita');
              }
            }}
          />
        );
      case 'sop':
        return <SOP />;
      case 'struktur':
        return <Organization />;
      case 'kontak':
        return <Contact />;
      case 'admin':
        return <Admin />;
      default:
        return <Home onNavigate={handleNavigate} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] flex flex-col items-center justify-center p-6 text-[var(--color-text)] transition-colors duration-200">
        <div className="flex flex-col items-center space-y-4 max-w-sm text-center">
          <div className="w-14 h-14 rounded-2xl bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)] shadow-xs">
            <svg className="w-7 h-7 text-[var(--color-primary)] animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div className="space-y-1">
            <h2 className="font-serif font-bold text-lg text-stone-900 tracking-tight">Perpustakaan Titian Ilmu</h2>
            <p className="text-xs text-stone-500 font-sans">SMP Negeri 1 Tambak</p>
          </div>
          <div className="w-36 h-1 bg-stone-200/80 rounded-full overflow-hidden mt-2">
            <div className="w-1/2 h-full bg-[var(--color-primary)] animate-[indeterminate_1.2s_infinite_linear] rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] flex flex-col font-sans selection:bg-[var(--color-primary)] selection:text-white transition-colors duration-200">

      {/* Top Navigation Bar */}
      <Navbar activePage={activePage} onNavigate={handleNavigate} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {renderCurrentPage()}
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}

export default function App() {
  return (
    <LibraryProvider>
      <MainApp />
    </LibraryProvider>
  );
}
