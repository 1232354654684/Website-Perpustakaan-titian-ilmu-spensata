/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Profile } from './pages/Profile';
import { News } from './pages/News';
import { SOP } from './pages/SOP';
import { Organization } from './pages/Organization';
import { Contact } from './pages/Contact';

export default function App() {
  const [activePage, setActivePage] = useState<string>('beranda');
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);

  // Sync state with URL hash for browser history & bookmarking
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
        const validPages = ['beranda', 'profil', 'berita', 'sop', 'struktur', 'kontak'];
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
      default:
        return <Home onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-800 flex flex-col font-sans selection:bg-[#1B4332] selection:text-white">
      {/* Top Navigation */}
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
