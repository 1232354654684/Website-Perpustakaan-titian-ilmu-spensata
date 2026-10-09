import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  User,
  ArrowLeft,
  Search,
  Share2,
  Bookmark,
  BookOpen,
  ArrowRight,
  Check,
} from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { newsData } from '../data/libraryData';
import { NewsItem } from '../types';
import { VisualFallback } from '../components/VisualFallback';

interface NewsPageProps {
  selectedArticleId?: string | null;
  onSelectArticle: (id: string | null) => void;
}

export const News: React.FC<NewsPageProps> = ({ selectedArticleId, onSelectArticle }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [copied, setCopied] = useState(false);

  // If an article is selected, display the detailed article view!
  const currentArticle = selectedArticleId
    ? newsData.find((item) => item.id === selectedArticleId)
    : null;

  const categories = ['Semua', 'Kegiatan', 'Pengumuman', 'Literasi'];

  const filteredNews = newsData.filter((item) => {
    const matchesCategory =
      selectedCategory === 'Semua' || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // ARTICLE DETAIL VIEW
  if (currentArticle) {
    const otherArticles = newsData
      .filter((item) => item.id !== currentArticle.id)
      .slice(0, 2);

    return (
      <div className="space-y-12 max-w-4xl mx-auto">
        {/* Back Button */}
        <div className="pt-6">
          <button
            onClick={() => onSelectArticle(null)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#1B4332] hover:text-[#122D21] transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Kembali ke Daftar Berita</span>
          </button>
        </div>

        {/* Article Header */}
        <article className="space-y-8 bg-white p-6 sm:p-10 lg:p-12 rounded-3xl border border-[#E6DFD3] shadow-xs">
          <div className="space-y-4">
            {/* Unboxed metadata per constitution */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500 font-sans">
              <span className="font-semibold text-[#1B4332] uppercase tracking-wider">
                {currentArticle.category}
              </span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-stone-400" />
                <span>{currentArticle.date}</span>
              </span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-stone-400" />
                <span>{currentArticle.readTime}</span>
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-4.5xl font-bold text-stone-900 leading-tight text-balance">
              {currentArticle.title}
            </h1>

            {/* Author Byline */}
            <div className="flex items-center justify-between pt-4 border-t border-[#E6DFD3] text-xs text-stone-600">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#1B4332] text-white flex items-center justify-center font-serif font-bold">
                  {currentArticle.author.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-stone-900">
                    {currentArticle.author}
                  </p>
                  <p className="text-stone-500">{currentArticle.authorRole}</p>
                </div>
              </div>

              <button
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200 hover:bg-[#FAF8F5] text-stone-600 hover:text-stone-900 text-xs font-medium transition-colors cursor-pointer"
                title="Salin tautan artikel"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Tersalin</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Bagikan</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Hero Visual for Article */}
          <div className="py-2">
            <VisualFallback
              type="reading-club"
              title={currentArticle.title}
              aspectRatio="video"
            />
            <p className="text-[11px] text-stone-500 italic mt-2 text-center">
              Dokumentasi agenda literasi dan layanan Perpustakaan Titian Ilmu SMPN 1 Tambak
            </p>
          </div>

          {/* Body Content */}
          <div className="prose prose-stone max-w-none text-stone-700 leading-relaxed sm:text-lg space-y-6 pt-2 font-sans">
            <p className="font-serif text-xl sm:text-2xl text-stone-900 font-medium leading-relaxed italic border-y border-[#E6DFD3] py-4 my-6">
              "{currentArticle.excerpt}"
            </p>

            {currentArticle.content.map((paragraph, idx) => (
              <p key={idx} className="leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Article Footer Note */}
          <div className="pt-8 border-t border-[#E6DFD3] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-stone-500">
            <p>
              Diterbitkan oleh Redaksi Publikasi Perpustakaan Titian Ilmu SMPN 1 Tambak.
            </p>
            <button
              onClick={() => onSelectArticle(null)}
              className="text-[#1B4332] font-semibold hover:underline"
            >
              ← Kembali ke Daftar Berita
            </button>
          </div>
        </article>

        {/* Berita Terkait Lainnya */}
        {otherArticles.length > 0 && (
          <div className="space-y-6 pt-6">
            <h3 className="font-serif text-2xl font-bold text-stone-900">
              Warta Literasi Lainnya
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {otherArticles.map((other) => (
                <div
                  key={other.id}
                  onClick={() => {
                    onSelectArticle(other.id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="bg-white p-5 rounded-2xl border border-[#E6DFD3] hover:border-[#1B4332]/50 cursor-pointer transition-all shadow-2xs group flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <span className="text-[11px] font-semibold text-[#1B4332] uppercase tracking-wider">
                      {other.category} · {other.date}
                    </span>
                    <h4 className="font-serif font-bold text-base text-stone-900 group-hover:text-[#1B4332] transition-colors line-clamp-2">
                      {other.title}
                    </h4>
                    <p className="text-xs text-stone-600 line-clamp-2">
                      {other.excerpt}
                    </p>
                  </div>
                  <div className="pt-3 mt-3 border-t border-[#F2ECE1] text-xs font-semibold text-[#1B4332] flex items-center justify-between">
                    <span>Baca Berita</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // NEWS ARCHIVE LIST VIEW
  return (
    <div className="space-y-12">
      <PageHeader
        kicker="Publikasi & Liputan"
        title="Berita & Kegiatan Literasi"
        description="Ikuti perkembangan koleksi terbaru, agenda pekan literasi, pengumuman layanan, serta inspirasi membaca warga SMP Negeri 1 Tambak."
      />

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-2">
        {/* Category Filter Tabs (Interactive Functional Controls per Section 1.A) */}
        <div className="flex items-center gap-1.5 p-1 bg-[#F4EFE6] rounded-xl self-start overflow-x-auto max-w-full">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-white text-[#1B4332] shadow-2xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari berita atau topik..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-white border border-[#E6DFD3] rounded-xl text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#1B4332] focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* News Grid */}
      {filteredNews.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E6DFD3] p-12 text-center space-y-3">
          <BookOpen className="w-10 h-10 text-stone-300 mx-auto" />
          <h3 className="font-serif text-lg font-bold text-stone-800">
            Tidak Ada Berita yang Cocok
          </h3>
          <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto">
            Tidak ditemukan warta dengan kata kunci "{searchQuery}". Silakan coba kata kunci lain atau pilih kategori Semua.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('Semua');
            }}
            className="text-xs font-semibold text-[#1B4332] hover:underline pt-2 cursor-pointer"
          >
            Reset Pencarian
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredNews.map((news, idx) => {
            const visualTypes: ('reading-club' | 'book-collection' | 'digital-library')[] = [
              'reading-club',
              'book-collection',
              'digital-library',
            ];
            const vType = visualTypes[idx % visualTypes.length];

            return (
              <article
                key={news.id}
                onClick={() => {
                  onSelectArticle(news.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="group bg-white rounded-2xl border border-[#E6DFD3] overflow-hidden hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="p-3">
                    <VisualFallback
                      type={vType}
                      title={news.title}
                      aspectRatio="video"
                    />
                  </div>
                  <div className="p-5 pt-2 space-y-3">
                    {/* Unboxed clean metadata */}
                    <div className="flex items-center gap-2 text-xs text-stone-500 font-sans">
                      <span className="font-semibold text-[#1B4332]">
                        {news.category}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-stone-400" />
                        <span>{news.date}</span>
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{news.readTime}</span>
                    </div>

                    <h3 className="font-serif text-lg font-bold text-stone-900 group-hover:text-[#1B4332] transition-colors leading-snug line-clamp-2">
                      {news.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-stone-600 leading-relaxed line-clamp-3">
                      {news.excerpt}
                    </p>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-3 flex items-center justify-between border-t border-[#F2ECE1] text-xs">
                  <span className="text-stone-500">{news.author}</span>
                  <span className="font-semibold text-[#1B4332] group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    <span>Baca Selengkapnya</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};
