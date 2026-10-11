/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ColorThemeConfig {
  presetId: 'hijau-teduh' | 'biru-samudra' | 'cokelat-klasik' | 'ungu-senja' | 'gelap' | 'custom';
  primary: string;
  primaryDark: string;
  primaryLight: string;
  primarySoft: string;
  accent: string;
  bg: string;
  surface: string;
  muted: string;
  border: string;
  text: string;
  textMuted: string;
  isDark?: boolean;
}

export interface ThemePreset {
  id: ColorThemeConfig['presetId'];
  name: string;
  tagline: string;
  theme: ColorThemeConfig;
}

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'hijau-teduh',
    name: 'Hijau Teduh',
    tagline: 'Nuansa asri & alami khas Titian Ilmu (Default)',
    theme: {
      presetId: 'hijau-teduh',
      primary: '#1B4332',
      primaryDark: '#122D21',
      primaryLight: '#2D6A4F',
      primarySoft: '#E8F0EB',
      accent: '#2D6A4F',
      bg: '#FAF8F5',
      surface: '#FFFFFF',
      muted: '#F4EFE6',
      border: '#E6DFD3',
      text: '#292524',
      textMuted: '#78716C',
      isDark: false,
    },
  },
  {
    id: 'biru-samudra',
    name: 'Biru Samudra',
    tagline: 'Modern, tenang, akademis, dan terpercaya',
    theme: {
      presetId: 'biru-samudra',
      primary: '#1E3A8A',
      primaryDark: '#0F172A',
      primaryLight: '#2563EB',
      primarySoft: '#EFF6FF',
      accent: '#0284C7',
      bg: '#F8FAFC',
      surface: '#FFFFFF',
      muted: '#F1F5F9',
      border: '#CBD5E1',
      text: '#0F172A',
      textMuted: '#64748B',
      isDark: false,
    },
  },
  {
    id: 'cokelat-klasik',
    name: 'Cokelat Klasik',
    tagline: 'Hangat, elegan, khas aroma kertas & kayu perpustakaan',
    theme: {
      presetId: 'cokelat-klasik',
      primary: '#5C2C16',
      primaryDark: '#361608',
      primaryLight: '#854222',
      primarySoft: '#FDF6EE',
      accent: '#B45309',
      bg: '#FAF5ED',
      surface: '#FFFFFF',
      muted: '#F0E5D3',
      border: '#DFD1BA',
      text: '#2C1810',
      textMuted: '#7C6A59',
      isDark: false,
    },
  },
  {
    id: 'ungu-senja',
    name: 'Ungu Senja',
    tagline: 'Imajinatif, artistik, berwibawa, dan anggun',
    theme: {
      presetId: 'ungu-senja',
      primary: '#4C1D95',
      primaryDark: '#2E1065',
      primaryLight: '#6D28D9',
      primarySoft: '#F5F3FF',
      accent: '#9333EA',
      bg: '#FAF7FC',
      surface: '#FFFFFF',
      muted: '#F3E8FF',
      border: '#E9D5FF',
      text: '#2E1065',
      textMuted: '#6B5B82',
      isDark: false,
    },
  },
  {
    id: 'gelap',
    name: 'Gelap (Dark Mode)',
    tagline: 'Latar gelap pekat dengan aksen hijau neon kontras & nyaman di mata',
    theme: {
      presetId: 'gelap',
      primary: '#10B981',
      primaryDark: '#042F2E',
      primaryLight: '#34D399',
      primarySoft: '#134E4A',
      accent: '#34D399',
      bg: '#111827',
      surface: '#1F2937',
      muted: '#374151',
      border: '#374151',
      text: '#F9FAFB',
      textMuted: '#9CA3AF',
      isDark: true,
    },
  },
];

export const DEFAULT_THEME = THEME_PRESETS[0].theme;

/**
 * Mengubah hex color menjadi RGB komponen
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const clean = hex.replace('#', '');
  if (clean.length === 3) {
    return {
      r: parseInt(clean[0] + clean[0], 16),
      g: parseInt(clean[1] + clean[1], 16),
      b: parseInt(clean[2] + clean[2], 16),
    };
  }
  if (clean.length === 6) {
    return {
      r: parseInt(clean.substring(0, 2), 16),
      g: parseInt(clean.substring(2, 4), 16),
      b: parseInt(clean.substring(4, 6), 16),
    };
  }
  return null;
}

/**
 * Menghasilkan variasi warna (gelap/terang/soft) dari hex input untuk tema kustom
 */
export function buildCustomTheme(primaryHex: string, accentHex: string): ColorThemeConfig {
  const rgb = hexToRgb(primaryHex) || { r: 27, g: 67, b: 50 };
  
  // Hitung gelap (kurangi 35%)
  const darkR = Math.max(0, Math.floor(rgb.r * 0.65));
  const darkG = Math.max(0, Math.floor(rgb.g * 0.65));
  const darkB = Math.max(0, Math.floor(rgb.b * 0.65));
  const primaryDark = `#${darkR.toString(16).padStart(2, '0')}${darkG.toString(16).padStart(2, '0')}${darkB.toString(16).padStart(2, '0')}`;

  // Hitung terang (tambah 25%)
  const lightR = Math.min(255, Math.floor(rgb.r + (255 - rgb.r) * 0.25));
  const lightG = Math.min(255, Math.floor(rgb.g + (255 - rgb.g) * 0.25));
  const lightB = Math.min(255, Math.floor(rgb.b + (255 - rgb.b) * 0.25));
  const primaryLight = `#${lightR.toString(16).padStart(2, '0')}${lightG.toString(16).padStart(2, '0')}${lightB.toString(16).padStart(2, '0')}`;

  // Hitung soft tint (92% putih + 8% warna utama)
  const softR = Math.min(255, Math.floor(255 - (255 - rgb.r) * 0.12));
  const softG = Math.min(255, Math.floor(255 - (255 - rgb.g) * 0.12));
  const softB = Math.min(255, Math.floor(255 - (255 - rgb.b) * 0.12));
  const primarySoft = `#${softR.toString(16).padStart(2, '0')}${softG.toString(16).padStart(2, '0')}${softB.toString(16).padStart(2, '0')}`;

  return {
    presetId: 'custom',
    primary: primaryHex,
    primaryDark,
    primaryLight,
    primarySoft,
    accent: accentHex,
    bg: '#FAF8F5',
    surface: '#FFFFFF',
    muted: '#F4EFE6',
    border: '#E6DFD3',
    text: '#292524',
    textMuted: '#78716C',
    isDark: false,
  };
}

/**
 * Menyelesaikan tema dari data yang disimpan di Firestore
 */
export function resolveTheme(config?: Partial<ColorThemeConfig> | null): ColorThemeConfig {
  if (!config) return DEFAULT_THEME;

  if (config.presetId && config.presetId !== 'custom') {
    const matched = THEME_PRESETS.find((p) => p.id === config.presetId);
    if (matched) return matched.theme;
  }

  // Jika preset custom atau ada override properti
  return {
    presetId: config.presetId || 'custom',
    primary: config.primary || DEFAULT_THEME.primary,
    primaryDark: config.primaryDark || DEFAULT_THEME.primaryDark,
    primaryLight: config.primaryLight || DEFAULT_THEME.primaryLight,
    primarySoft: config.primarySoft || DEFAULT_THEME.primarySoft,
    accent: config.accent || DEFAULT_THEME.accent,
    bg: config.bg || DEFAULT_THEME.bg,
    surface: config.surface || DEFAULT_THEME.surface,
    muted: config.muted || DEFAULT_THEME.muted,
    border: config.border || DEFAULT_THEME.border,
    text: config.text || DEFAULT_THEME.text,
    textMuted: config.textMuted || DEFAULT_THEME.textMuted,
    isDark: Boolean(config.isDark),
  };
}

export function loadCachedTheme(): ColorThemeConfig {
  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem('titian_theme');
      if (cached) {
        return resolveTheme(JSON.parse(cached));
      }
    } catch {
      // ignore
    }
  }
  return DEFAULT_THEME;
}

/**
 * Menerapkan variabel CSS ke :root documentElement
 */
export function applyThemeToDOM(config?: Partial<ColorThemeConfig> | null) {
  if (typeof document === 'undefined') return;
  const theme = resolveTheme(config);
  const root = document.documentElement;

  root.style.setProperty('--color-primary', theme.primary);
  root.style.setProperty('--color-primary-dark', theme.primaryDark);
  root.style.setProperty('--color-primary-light', theme.primaryLight);
  root.style.setProperty('--color-primary-soft', theme.primarySoft);
  root.style.setProperty('--color-accent', theme.accent);
  root.style.setProperty('--color-bg', theme.bg);
  root.style.setProperty('--color-surface', theme.surface);
  root.style.setProperty('--color-muted', theme.muted);
  root.style.setProperty('--color-border', theme.border);
  root.style.setProperty('--color-text', theme.text);
  root.style.setProperty('--color-text-muted', theme.textMuted);

  if (theme.isDark) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }

  try {
    localStorage.setItem('titian_theme', JSON.stringify(theme));
  } catch {
    // ignore
  }
}

// Terapkan tema tersimpan segera saat modul dimuat agar tidak berkedip
if (typeof window !== 'undefined') {
  applyThemeToDOM(loadCachedTheme());
}
