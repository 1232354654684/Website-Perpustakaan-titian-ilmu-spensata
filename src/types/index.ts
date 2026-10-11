import { ColorThemeConfig } from '../lib/theme';

export interface LibraryProfile {
  name: string;
  shortName: string;
  tagline: string;
  schoolName: string;
  npsn: string;
  accreditation: string;
  about: string;
  history: string;
  vision: string;
  missions: string[];
  goals: string[];
  stats: {
    totalBooks: number;
    totalTitles: number;
    activeMembers: number;
    monthlyVisitors: number;
  };
  logoUrl?: string;
  homeStats?: HomeStatItem[];
  heroVisualDescription?: string;
  colorTheme?: ColorThemeConfig;
}

export interface HomeStatItem {
  id: string;
  label: string;
  value: string;
  suffix?: string;
  unit?: string;
}

export interface NewsItem {
  id: string;
  slug: string;
  title: string;
  category: 'Kegiatan' | 'Pengumuman' | 'Resensi Buku' | 'Literasi' | 'Prestasi';
  date: string;
  author: string;
  authorRole: string;
  excerpt: string;
  content: string[];
  imageUrl: string;
  readTime: string;
  featured?: boolean;
}

export interface SOPStep {
  stepNumber: number;
  title: string;
  description: string;
  duration?: string;
}

export interface SOPEntry {
  id: string;
  title: string;
  category: string;
  description: string;
  targetAudience: string;
  requirements: string[];
  steps: SOPStep[];
  notes?: string;
  processingTime: string;
}

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  positionCategory: 'Pimpinan' | 'Pengelola' | 'Layanan' | 'Teknis';
  nip?: string;
  education?: string;
  bio: string;
  tasks: string[];
  avatarUrl: string;
}

export interface OperatingHours {
  dayRange: string;
  hours: string;
  breakTime?: string;
  isOpen: boolean;
  notes?: string;
}

export interface ContactInfo {
  address: string;
  subdistrict: string;
  district: string;
  province: string;
  postalCode: string;
  phone: string;
  whatsapp: string;
  email: string;
  instagram: string;
  youtube: string;
  mapsEmbedUrl: string;
  mapsDirectUrl: string;
}
