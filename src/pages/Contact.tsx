import React, { useState } from 'react';
import {
  MapPin,
  Clock,
  Mail,
  Phone,
  MessageSquare,
  Send,
  ExternalLink,
  Instagram,
  Youtube,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { useLibrary } from '../context/LibraryContext';
import { sanitizeMapsEmbedUrl } from '../lib/mapUtils';

export const Contact: React.FC = () => {
  const { contactInfo, operatingHours } = useLibrary();
  const [formData, setFormData] = useState({
    name: '',
    emailOrWa: '',
    status: 'Siswa',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.message) return;
    setSubmitted(true);
    // User can reset or see success confirmation
  };

  return (
    <div className="space-y-16">
      <PageHeader
        kicker="Informasi & Layanan Aspirasi"
        title="Kontak & Lokasi Perpustakaan"
        description="Hubungi petugas kami untuk pertanyaan layanan sirkulasi, reservasi ruang baca kelompok, usulan pengadaan buku baru, atau kunjungan resmi."
      />

      {/* Grid: Info Detail (Kiri) & Formulir Pesan/Buku Tamu (Kanan) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Kolom Kiri: Detail Kontak & Jam Buka */}
        <div className="lg:col-span-5 space-y-8">
          {/* Alamat & Kontak Utama */}
          <div className="bg-[var(--color-surface)] rounded-3xl border border-[var(--color-border)] p-6 sm:p-8 shadow-xs space-y-6">
            <h3 className="font-serif text-xl font-bold text-[var(--color-text)] border-b border-[var(--color-border)] pb-4">
              Sekretariat Pustaka
            </h3>

            <div className="space-y-4 text-sm text-[var(--color-text-muted)]">
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-primary)] flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[var(--color-text)] uppercase tracking-wider">
                    Alamat Lengkap
                  </p>
                  <p className="mt-0.5 leading-relaxed text-[var(--color-text)]">
                    {contactInfo.address}
                  </p>
                  <p className="text-xs text-[var(--color-text-muted)]">
                    {contactInfo.district}, {contactInfo.province} {contactInfo.postalCode}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-primary)] flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[var(--color-text)] uppercase tracking-wider">
                    Telepon Sekolah
                  </p>
                  <p className="mt-0.5 font-mono text-[var(--color-text)]">{contactInfo.phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-primary)] flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[var(--color-text)] uppercase tracking-wider">
                    Pos-el (Email)
                  </p>
                  <p className="mt-0.5 font-mono text-[var(--color-text)]">{contactInfo.email}</p>
                </div>
              </div>

              {/* WhatsApp Quick Chat Action */}
              <div className="pt-2">
                <a
                  href={`https://wa.me/${contactInfo.whatsapp}?text=Halo%20Admin%20Perpustakaan%20Titian%20Ilmu%20SMPN%201%20Tambak,%20saya%20ingin%20bertanya:`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[var(--color-primary)] text-white text-xs sm:text-sm font-semibold hover:bg-[var(--color-primary-dark)] transition-all shadow-xs"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Kirim Pesan WhatsApp Langsung</span>
                  <ExternalLink className="w-3.5 h-3.5 ml-1 text-white/80" />
                </a>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="pt-4 border-t border-[var(--color-border)] space-y-3">
              <p className="text-xs font-bold text-[var(--color-text)] uppercase tracking-wider">
                Media Sosial Resmi
              </p>
              <div className="flex items-center gap-3">
                <a
                  href={contactInfo.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] text-xs font-medium text-[var(--color-text)] hover:bg-[var(--color-muted)] transition-colors"
                >
                  <Instagram className="w-4 h-4 text-rose-600" />
                  <span>Instagram</span>
                </a>
                <a
                  href={contactInfo.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] text-xs font-medium text-[var(--color-text)] hover:bg-[var(--color-muted)] transition-colors"
                >
                  <Youtube className="w-4 h-4 text-red-600" />
                  <span>YouTube</span>
                </a>
              </div>
            </div>
          </div>

          {/* Jam Buka Ringkas */}
          <div className="bg-[var(--color-bg)] rounded-3xl border border-[var(--color-border)] p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2.5">
              <Clock className="w-5 h-5 text-[var(--color-primary)]" />
              <h4 className="font-serif text-lg font-bold text-[var(--color-text)]">
                Jadwal Kunjungan & Sirkulasi
              </h4>
            </div>

            <div className="space-y-2.5 text-xs">
              {operatingHours.map((h, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-2 border-b border-[var(--color-border)] last:border-0"
                >
                  <div className="space-y-0.5">
                    <span className="font-semibold text-[var(--color-text)] block">{h.dayRange}</span>
                    {h.notes && <span className="text-[10px] text-[var(--color-text-muted)] italic block">{h.notes}</span>}
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full mb-0.5 ${
                        h.isOpen ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {h.isOpen ? 'Buka' : 'Tutup'}
                    </span>
                    <p className="font-mono font-bold text-[var(--color-text)]">{h.hours}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Buku Tamu / Formulir Aspirasi & Usulan Buku */}
        <div className="lg:col-span-7">
          <div className="bg-[var(--color-surface)] rounded-3xl border border-[var(--color-border)] p-6 sm:p-10 shadow-xs space-y-6">
            <div>
              <span className="text-xs font-semibold text-[var(--color-primary)] uppercase tracking-widest">
                Layanan Interaktif
              </span>
              <h3 className="font-serif text-2xl font-bold text-[var(--color-text)] mt-1">
                Buku Tamu & Usulan Buku Baru
              </h3>
              <p className="text-xs sm:text-sm text-[var(--color-text-muted)] mt-2">
                Sampaikan pesan, masukan peningkatan layanan, atau usulkan judul buku yang ingin Anda baca di Titian Ilmu.
              </p>
            </div>

            {submitted ? (
              <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-4">
                <CheckCircle className="w-12 h-12 text-[var(--color-primary)] mx-auto" />
                <h4 className="font-serif text-xl font-bold text-emerald-950">
                  Terima Kasih, Pesan Terkirim!
                </h4>
                <p className="text-xs sm:text-sm text-emerald-900 max-w-md mx-auto leading-relaxed">
                  Pesan Anda telah diterima oleh tim pengelola Perpustakaan Titian Ilmu SMP Negeri 1 Tambak. Masukan Anda sangat berharga bagi peningkatan mutu layanan kami.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({
                      name: '',
                      emailOrWa: '',
                      status: 'Siswa',
                      subject: '',
                      message: '',
                    });
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[var(--color-primary)] text-white text-xs font-semibold hover:bg-[var(--color-primary-dark)] transition-colors cursor-pointer"
                >
                  Kirim Pesan Lainnya
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[var(--color-text)]">
                      Nama Lengkap <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Anindya Putri"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] text-xs sm:text-sm text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:bg-[var(--color-surface)] transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[var(--color-text)]">
                      Nomor WhatsApp / Pos-el
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: 08123456789 atau email"
                      value={formData.emailOrWa}
                      onChange={(e) =>
                        setFormData({ ...formData, emailOrWa: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] text-xs sm:text-sm text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:bg-[var(--color-surface)] transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[var(--color-text)]">
                      Status Pemustaka
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] text-xs sm:text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:bg-[var(--color-surface)] transition-all"
                    >
                      <option value="Siswa">Siswa SMPN 1 Tambak</option>
                      <option value="Guru">Guru / Pendidik</option>
                      <option value="Karyawan">Tenaga Kependidikan</option>
                      <option value="Alumni">Alumni</option>
                      <option value="Umum">Masyarakat Umum / Tamu</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[var(--color-text)]">
                      Topik Pesan <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Usulan Judul Buku Cerita"
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData({ ...formData, subject: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] text-xs sm:text-sm text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:bg-[var(--color-surface)] transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[var(--color-text)]">
                    Isi Pesan / Saran / Judul Buku <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tuliskan pesan Anda secara jelas dan santun di sini..."
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] text-xs sm:text-sm text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:bg-[var(--color-surface)] transition-all"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[var(--color-primary)] text-white text-xs sm:text-sm font-semibold hover:bg-[var(--color-primary-dark)] transition-all shadow-xs cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Kirimkan Formulir</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Peta Lokasi Sekolah & Perpustakaan */}
      <section className="bg-[var(--color-surface)] rounded-3xl border border-[var(--color-border)] p-6 sm:p-10 shadow-xs space-y-6">
        <div>
          <span className="text-xs font-semibold text-[var(--color-primary)] uppercase tracking-widest">
            Denah & Navigasi
          </span>
          <h3 className="font-serif text-2xl font-bold text-[var(--color-text)] mt-1">
            Peta Lokasi SMP Negeri 1 Tambak
          </h3>
          <p className="text-xs text-[var(--color-text-muted)] mt-1">
            Terletak strategis di jalur utama Kecamatan Tambak, Kabupaten Banyumas.
          </p>
        </div>

        {/* Interactive Map Embed */}
        <div className="w-full h-80 sm:h-96 md:h-[420px] rounded-2xl overflow-hidden border border-[var(--color-border)] relative bg-[var(--color-bg)] shadow-inner">
          <iframe
            src={sanitizeMapsEmbedUrl(contactInfo.mapsEmbedUrl)}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer"
            title="Peta Lokasi SMP Negeri 1 Tambak"
            className="w-full h-full"
          />
        </div>

        {/* Keterangan Lokasi di Bawah Peta */}
        <div className="pt-3 flex items-center gap-2 text-xs text-[var(--color-text-muted)] border-t border-[var(--color-border)]">
          <MapPin className="w-4 h-4 text-[var(--color-primary)] shrink-0" />
          <span>SMP Negeri 1 Tambak · Jl. Watuagung, Kamulyan, Kec. Tambak, Kab. Banyumas 53196</span>
        </div>
      </section>
    </div>
  );
};
