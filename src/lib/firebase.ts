import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);

// CRITICAL: getFirestore must pass firebaseConfig.firestoreDatabaseId
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map((provider) => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error details: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export interface ImageUploadResult {
  url: string;
  source: 'storage' | 'base64_fallback';
  sizeKB: number;
  originalSizeKB: number;
  message?: string;
}

/**
 * Validasi ketat format file gambar (JPG, PNG, WebP)
 */
export function validateImageFile(file: File): void {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const hasValidType = validTypes.includes(file.type.toLowerCase());
  const hasValidExt = /\.(jpe?g|png|webp)$/i.test(file.name);

  if (!hasValidType && !hasValidExt) {
    throw new Error(
      `Format file "${file.name}" tidak didukung. Harap pilih gambar dengan format JPG, JPEG, PNG, atau WebP.`
    );
  }
}

/**
 * Kompresi gambar di browser:
 * - Validasi tipe gambar (JPG, PNG, WebP)
 * - Lebar maksimal 1280 px (proporsional)
 * - Kualitas target sekitar 80% (0.8)
 * - Target ukuran di bawah 300 KB
 */
export async function compressImageInBrowser(
  file: File,
  targetMaxKB = 300,
  maxDimension = 1280
): Promise<Blob> {
  // 1. Validasi tipe file gambar
  validateImageFile(file);

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;

      img.onload = async () => {
        try {
          let { width, height } = img;

          // Skala proporsional jika melebihi batas maksimal 1280px
          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            } else {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Gagal menginisialisasi kanvas gambar di browser.'));
            return;
          }

          // Gambar dengan latar belakang putih jika PNG transparan diubah ke JPEG
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);

          // Coba kompres bertahap dari kualitas 0.8 sampai ukuran < targetMaxKB
          const qualities = [0.8, 0.72, 0.65, 0.55, 0.45];
          let bestBlob: Blob | null = null;

          for (const quality of qualities) {
            const blob = await new Promise<Blob | null>((res) =>
              canvas.toBlob((b) => res(b), 'image/jpeg', quality)
            );

            if (blob) {
              bestBlob = blob;
              const kb = blob.size / 1024;
              if (kb <= targetMaxKB) {
                break;
              }
            }
          }

          if (bestBlob) {
            resolve(bestBlob);
          } else {
            reject(new Error('Gagal mengompresi gambar.'));
          }
        } catch (err) {
          reject(err);
        }
      };

      img.onerror = () => {
        reject(new Error('File gambar rusak atau tidak dapat dibuka.'));
      };
    };

    reader.onerror = () => {
      reject(new Error('Gagal membaca file gambar dari perangkat Anda.'));
    };
  });
}

/**
 * Mengubah Blob menjadi Data URL base64.
 */
export function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Alur pengunggahan foto utama:
 * 1. Kompres otomatis di browser (< 300 KB, lebar maks 1280 px).
 * 2. Coba unggah ke Firebase Storage (dengan timeout).
 * 3. Jika Storage gagal / tidak tersedia, secara otomatis beralih ke cadangan:
 *    kompres ke bawah 200 KB dan simpan sebagai data URL base64 di Firestore.
 */
export async function uploadAndProcessPhoto(
  file: File,
  folder = 'news_covers'
): Promise<ImageUploadResult> {
  const originalSizeKB = Math.round(file.size / 1024);
  console.log(`[Upload] Memulai proses gambar: ${file.name} (${originalSizeKB} KB)`);

  // 1. Kompresi browser (< 300 KB, max 1280px)
  const compressedBlob = await compressImageInBrowser(file, 300, 1280);
  const compressedSizeKB = Math.round(compressedBlob.size / 1024);
  console.log(`[Upload] Berhasil dikompresi menjadi ${compressedSizeKB} KB (Target < 300 KB)`);

  // 2. Coba unggah ke Firebase Storage
  try {
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const storagePath = `${folder}/${Date.now()}_${sanitizedName}`;
    const storageRef = ref(storage, storagePath);

    // Timeout guard 12 detik untuk Firebase Storage jika terblokir jaringan
    const uploadPromise = uploadBytes(storageRef, compressedBlob, {
      contentType: 'image/jpeg',
    });

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Waktu tunggu koneksi Firebase Storage habis')), 12000)
    );

    const snapshot = await Promise.race([uploadPromise, timeoutPromise]);
    const downloadUrl = await getDownloadURL(snapshot.ref);

    console.log('[Upload] Berhasil diunggah ke Firebase Storage:', downloadUrl);
    return {
      url: downloadUrl,
      source: 'storage',
      sizeKB: compressedSizeKB,
      originalSizeKB,
    };
  } catch (storageError: any) {
    console.warn(
      '[Upload] Firebase Storage tidak merespons atau gagal diakses. Mengaktifkan sistem cadangan Base64 Firestore:',
      storageError?.message || storageError
    );

    // 3. Fallback: Kompres lebih ramping (< 200 KB) dan buat Base64
    let fallbackBlob = compressedBlob;
    if (compressedSizeKB > 200) {
      try {
        fallbackBlob = await compressImageInBrowser(file, 200, 1000);
      } catch (e) {
        // Abaikan dan gunakan compressedBlob
      }
    }

    const base64Data = await blobToBase64(fallbackBlob);
    const finalKB = Math.round(fallbackBlob.size / 1024);

    console.log(`[Upload] Cadangan Base64 siap disimpan langsung di Firestore (${finalKB} KB)`);
    return {
      url: base64Data,
      source: 'base64_fallback',
      sizeKB: finalKB,
      originalSizeKB,
      message: 'Foto disimpan sebagai cadangan Base64 di Firestore.',
    };
  }
}

/**
 * Kompatibilitas mundur: mengunggah gambar dan mengembalikan URL (Storage / Base64 fallback)
 */
export async function uploadImageToStorage(file: File, folder = 'news_covers'): Promise<string> {
  const result = await uploadAndProcessPhoto(file, folder);
  return result.url;
}
