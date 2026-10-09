import { OperatingHours } from '../types';

/**
 * Mengambil ringkasan hari buka (misal: "Senin – Kamis & Jumat")
 */
export function getOpenDaysSummary(hours: OperatingHours[]): string {
  if (!hours || hours.length === 0) return 'Senin – Jumat';
  const openSlots = hours.filter((h) => h.isOpen);
  if (openSlots.length === 0) return 'Tutup Sementara';
  return openSlots.map((s) => s.dayRange).join(' & ');
}

/**
 * Mengambil ringkasan hari tutup (misal: "Sabtu & Minggu" atau "Sabtu, Minggu & Hari Libur Nasional")
 */
export function getClosedDaysSummary(hours: OperatingHours[]): string {
  if (!hours || hours.length === 0) return 'Sabtu & Minggu Tutup';
  const closedSlots = hours.filter((h) => !h.isOpen);
  if (closedSlots.length === 0) return 'Buka Setiap Hari';
  const names = closedSlots.map((s) => s.dayRange.replace(/ & Hari Libur Nasional/i, '').trim());
  return names.join(' & ') + ' Tutup';
}

/**
 * Ringkasan ringkas untuk badge / visual kartu (misal: "Senin – Jumat")
 */
export function getOperatingHoursBadge(hours: OperatingHours[]): string {
  if (!hours || hours.length === 0) return 'Senin – Jumat';
  const openSlots = hours.filter((h) => h.isOpen);
  if (openSlots.length === 0) return 'Tutup';

  // Jika rentang pertama mencakup hari buka
  const first = openSlots[0]?.dayRange || '';
  const last = openSlots[openSlots.length - 1]?.dayRange || '';
  
  if (openSlots.length === 1) return first;
  if (first.includes('Senin') && last.includes('Jumat')) {
    return 'Senin – Jumat';
  }
  return openSlots.map((s) => s.dayRange).join(' & ');
}

/**
 * Kalimat penjelasan komprehensif tanpa hardcode
 */
export function getOperatingHoursGeneralText(hours: OperatingHours[]): string {
  if (!hours || hours.length === 0) {
    return 'Buka setiap hari kerja untuk layanan sirkulasi dan baca. Sabtu & Minggu tutup.';
  }

  const openDays = hours.filter((h) => h.isOpen).map((h) => h.dayRange).join(', ');
  const closedDays = hours.filter((h) => !h.isOpen).map((h) => h.dayRange).join(' & ');

  if (openDays && closedDays) {
    return `Buka hari kerja (${openDays}) untuk layanan sirkulasi dan baca. ${closedDays} tutup.`;
  }
  if (openDays) {
    return `Buka hari kerja (${openDays}) untuk layanan sirkulasi dan baca.`;
  }
  return 'Layanan tatap muka sedang tutup.';
}
