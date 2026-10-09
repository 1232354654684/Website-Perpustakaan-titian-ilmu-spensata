import { storage } from './firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { ImageUploadResult } from './firebase';

/**
 * Mengubah Blob / File menjadi Data URL base64.
 */
export function blobToDataURL(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Menghapus latar putih atau hampir putih dari kanvas secara otomatis.
 * Mempertahankan kehalusan tepian (feathering / anti-aliasing).
 *
 * @param canvas Kanvas sumber yang berisi gambar logo
 * @param tolerance Nilai toleransi (misal 5 - 80). Semakin tinggi, warna abu-abu/krem muda ikut transparan.
 */
export function removeWhiteBackgroundFromCanvas(
  canvas: HTMLCanvasElement,
  tolerance = 30
): HTMLCanvasElement {
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  const width = canvas.width;
  const height = canvas.height;
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;

  // Toleransi 0-100 dikonversi ke rentang jarak RGB
  // Jarak maksimum dari putih (255, 255, 255)
  const maxThreshold = Math.max(5, Math.min(100, tolerance));

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];

    if (a === 0) continue;

    // Selisih tiap kanal terhadap putih murni (255)
    const rDiff = 255 - r;
    const gDiff = 255 - g;
    const bDiff = 255 - b;

    // Jarak warna dari putih
    const maxDiff = Math.max(rDiff, gDiff, bDiff);

    if (maxDiff <= maxThreshold) {
      // Piksel putih / hampir putih: jadikan transparan penuh
      data[i + 3] = 0;
    } else if (maxDiff <= maxThreshold + 12) {
      // Area transisi: buat gradasi transparansi halus (anti-aliasing)
      const factor = (maxDiff - maxThreshold) / 12;
      data[i + 3] = Math.min(a, Math.round(a * factor));
    }
  }

  ctx.putImageData(imgData, 0, 0);
  return canvas;
}

/**
 * Mengompres logo sambil MEMPERTAHANKAN transparansi (alpha channel).
 * - Tidak pernah mengubah ke JPEG atau mengisi background putih/hitam.
 * - Untuk PNG & WebP: mempertahankan transparansi alpha.
 * - Dimensi proporsional (maks 512px, sangat tajam untuk logo navbar, footer & favicon).
 * - Target ukuran di bawah targetMaxKB (default 200 KB).
 */
export async function compressLogoPreservingTransparency(
  source: File | HTMLCanvasElement,
  targetMaxKB = 200,
  maxDimension = 512
): Promise<{ blob: Blob; mimeType: string }> {
  // 1. Jika sumber adalah SVG, pertahankan SVG apa adanya
  if (source instanceof File) {
    const isSvg = source.type === 'image/svg+xml' || source.name.toLowerCase().endsWith('.svg');
    if (isSvg) {
      return { blob: source, mimeType: 'image/svg+xml' };
    }
  }

  // 2. Dapatkan elemen kanvas
  let workingCanvas: HTMLCanvasElement;

  if (source instanceof HTMLCanvasElement) {
    workingCanvas = source;
  } else {
    // Muat File ke Image dan gambar ke canvas
    const img = new Image();
    const objectUrl = URL.createObjectURL(source);

    try {
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Gagal memuat file gambar logo.'));
        img.src = objectUrl;
      });
    } finally {
      URL.revokeObjectURL(objectUrl);
    }

    let { width, height } = img;

    // Skala proporsional ke maxDimension
    if (width > maxDimension || height > maxDimension) {
      if (width > height) {
        height = Math.round((height * maxDimension) / width);
        width = maxDimension;
      } else {
        width = Math.round((width * maxDimension) / height);
        height = maxDimension;
      }
    }

    workingCanvas = document.createElement('canvas');
    workingCanvas.width = width;
    workingCanvas.height = height;

    const ctx = workingCanvas.getContext('2d');
    if (!ctx) throw new Error('Kanvas browser tidak tersedia.');

    // PENTING: Bersihkan kanvas agar transparan sepenuhnya (tanpa fill putih/hitam)
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(img, 0, 0, width, height);
  }

  // 3. Ekspor ke PNG transparan terlebih dahulu
  let pngBlob = await new Promise<Blob | null>((res) =>
    workingCanvas.toBlob((b) => res(b), 'image/png')
  );

  if (pngBlob && pngBlob.size / 1024 <= targetMaxKB) {
    return { blob: pngBlob, mimeType: 'image/png' };
  }

  // 4. Jika PNG > 200KB, coba WebP (dengan transparansi dipertahankan)
  const webpQualities = [0.92, 0.85, 0.75];
  for (const q of webpQualities) {
    const webpBlob = await new Promise<Blob | null>((res) =>
      workingCanvas.toBlob((b) => res(b), 'image/webp', q)
    );
    if (webpBlob && webpBlob.size / 1024 <= targetMaxKB) {
      return { blob: webpBlob, mimeType: 'image/webp' };
    }
  }

  // 5. Jika masih > targetMaxKB, turunkan dimensi canvas secara proporsional ke 360px
  const scaledCanvas = document.createElement('canvas');
  const scale = 360 / Math.max(workingCanvas.width, workingCanvas.height);
  scaledCanvas.width = Math.round(workingCanvas.width * scale);
  scaledCanvas.height = Math.round(workingCanvas.height * scale);

  const scaledCtx = scaledCanvas.getContext('2d');
  if (scaledCtx) {
    scaledCtx.clearRect(0, 0, scaledCanvas.width, scaledCanvas.height);
    scaledCtx.drawImage(workingCanvas, 0, 0, scaledCanvas.width, scaledCanvas.height);
    const scaledPng = await new Promise<Blob | null>((res) =>
      scaledCanvas.toBlob((b) => res(b), 'image/png')
    );
    if (scaledPng) {
      return { blob: scaledPng, mimeType: 'image/png' };
    }
  }

  // Fallback ke hasil awal
  if (pngBlob) {
    return { blob: pngBlob, mimeType: 'image/png' };
  }

  throw new Error('Gagal menghasilkan logo transparan terkompresi.');
}

/**
 * Alur pengunggahan logo dengan prioritas Firebase Storage dan cadangan Base64 Firestore:
 * - Menjamin transparansi alpha channel terjaga penuh.
 */
export async function uploadAndProcessLogo(
  source: File | HTMLCanvasElement,
  folder = 'logos'
): Promise<ImageUploadResult> {
  const originalSizeKB =
    source instanceof File ? Math.round(source.size / 1024) : 0;

  // 1. Kompres dengan penjagaan transparansi
  const { blob, mimeType } = await compressLogoPreservingTransparency(source, 200, 512);
  const compressedKB = Math.round(blob.size / 1024);

  // Jika SVG asli, langsung ubah ke base64 data URL atau unggah ke storage
  const isSvg = mimeType === 'image/svg+xml';
  const fileExtension = isSvg ? 'svg' : mimeType === 'image/webp' ? 'webp' : 'png';

  // 2. Coba unggah ke Firebase Storage dengan timeout 4,5 detik
  try {
    const timestamp = Date.now();
    const storagePath = `${folder}/logo_${timestamp}.${fileExtension}`;
    const storageRef = ref(storage, storagePath);

    const uploadPromise = uploadBytes(storageRef, blob, {
      contentType: mimeType,
    }).then(async (snap) => {
      const downloadUrl = await getDownloadURL(snap.ref);
      return downloadUrl;
    });

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Firebase Storage timeout')), 4500)
    );

    const downloadUrl = await Promise.race([uploadPromise, timeoutPromise]);

    return {
      url: downloadUrl,
      source: 'storage',
      sizeKB: compressedKB,
      originalSizeKB,
      message: `Logo berhasil diunggah ke Firebase Storage (${compressedKB} KB, transparan).`,
    };
  } catch (storageErr) {
    console.warn(
      '[LogoUpload] Firebase Storage tidak aktif / timeout, menggunakan cadangan Data URL:',
      storageErr
    );

    // 3. Cadangan: Simpan sebagai Data URL transparan langsung di dokumen Firestore
    const base64Data = await blobToDataURL(blob);
    const finalKB = Math.round(base64Data.length / 1024);

    return {
      url: base64Data,
      source: 'base64_fallback',
      sizeKB: finalKB,
      originalSizeKB,
      message: `Logo transparan disimpan sebagai Data URL di database (${finalKB} KB).`,
    };
  }
}
