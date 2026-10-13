/**
 * Utilitas dan konstanta Google Maps untuk SMP Negeri 1 Tambak
 */

// Link embed resmi spesifik SMP Negeri 1 Tambak dengan format https://www.google.com/maps/embed?pb=...
// Lokasi: SMP NEGERI 1 TAMBAK, Jl. Watuagung, Kamulyan, Kec. Tambak, Kab. Banyumas, Jawa Tengah
export const DEFAULT_MAPS_EMBED_URL =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3954.2755866768393!2d109.42851427499694!3d-7.652193892364024!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e656ed611f71585%3A0x8544d6a1b24f5a3!2sSMP%20NEGERI%201%20TAMBAK!5e0!3m2!1sid!2sid!4v1718000000000!5m2!1sid!2sid';

// Link navigasi langsung membuka titik lokasi SMP Negeri 1 Tambak di aplikasi / web Google Maps
export const DEFAULT_MAPS_DIRECT_URL =
  'https://www.google.com/maps/place/SMP+NEGERI+1+TAMBAK/@-7.6521992,109.4310892,17z/data=!3m1!4b1!4m6!3m5!1s0x2e656ed611f71585:0x8544d6a1b24f5a3!8m2!3d-7.6521992!4d109.4310892!16s%2Fg%2F11b6_c2c1w';

/**
 * Membersihkan input link embed peta yang dimasukkan admin:
 * 1. Jika admin menempel seluruh kode <iframe>...</iframe>, otomatis ambil nilai attribute src="..." saja.
 * 2. Membersihkan spasi, tanda petik berlebih, atau tag html.
 * 3. Memvalidasi bahwa link merupakan url https valid (terutama google.com/maps/embed).
 * 4. Jika input kosong atau tidak valid, fallback ke DEFAULT_MAPS_EMBED_URL agar tidak pernah menampilkan peta kosong / error.
 */
export function sanitizeMapsEmbedUrl(input?: string | null): string {
  if (!input || typeof input !== 'string') {
    return DEFAULT_MAPS_EMBED_URL;
  }

  let cleaned = input.trim();
  if (!cleaned) return DEFAULT_MAPS_EMBED_URL;

  // Cek jika pengguna menempelkan tag iframe lengkap
  const iframeMatch = cleaned.match(/<iframe\b[^>]*\bsrc=["']([^"']+)["']/i);
  if (iframeMatch && iframeMatch[1]) {
    cleaned = iframeMatch[1].trim();
  }

  // Bersihkan tanda petik di awal/akhir jika ada
  cleaned = cleaned.replace(/^['"]|['"]$/g, '').trim();

  // Validasi URL: harus dimulai dengan https:// atau http:// dan mengarah ke domain Google Maps embed atau maps
  if (
    cleaned.startsWith('https://www.google.com/maps/embed') ||
    cleaned.startsWith('https://maps.google.com/maps') ||
    cleaned.startsWith('https://google.com/maps/embed') ||
    cleaned.startsWith('https://www.google.com/maps') ||
    cleaned.startsWith('http://www.google.com/maps/embed')
  ) {
    return cleaned;
  }

  // Jika berupa URL valid lainnya yang mengarah ke embed google maps
  try {
    const url = new URL(cleaned);
    if (url.hostname.includes('google.') && url.pathname.includes('/maps/embed')) {
      return cleaned;
    }
  } catch {
    // bukan URL valid
    return DEFAULT_MAPS_EMBED_URL;
  }

  // Jika tidak valid, fallback ke peta bawaan sekolah
  return DEFAULT_MAPS_EMBED_URL;
}

/**
 * Validasi apakah URL direct Google Maps valid atau gunakan link default sekolah
 */
export function sanitizeMapsDirectUrl(input?: string | null): string {
  if (!input || typeof input !== 'string') {
    return DEFAULT_MAPS_DIRECT_URL;
  }
  const cleaned = input.trim();
  if (!cleaned) return DEFAULT_MAPS_DIRECT_URL;

  try {
    const url = new URL(cleaned);
    if (url.hostname.includes('google.') || url.hostname.includes('goo.gl') || url.hostname.includes('maps.app.goo.gl')) {
      return cleaned;
    }
  } catch {
    return DEFAULT_MAPS_DIRECT_URL;
  }

  return cleaned;
}
