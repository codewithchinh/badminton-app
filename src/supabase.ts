import { createClient } from '@supabase/supabase-js';
import type { MatchPost } from './types';

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || 'https://ypmiihpievhngjstnkpz.supabase.co';
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_wXtELtlMq-eZI-0LCTMPiA_WXhvUAub';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

export interface DbMatchRow {
  id: string;
  title: string;
  court_name: string;
  address: string | null;
  district: string;
  date: string;
  start_time: string;
  end_time: string;
  court_number: string;
  court_count: number;
  shuttle_type: string;
  total_slots: number;
  joined_players: any;
  min_level: string;
  max_level: string;
  price_male: number;
  price_female: number;
  host_id: string;
  host_name: string;
  host_avatar: string;
  host_phone: string;
  host_badge: string;
  notes: string | null;
  created_at: string;
}

export const COURT_PRESET_IMAGES: { id: string; name: string; url: string; matchKey: string }[] = [
  {
    id: 'viettel',
    name: 'Sân Viettel (Tân Bình)',
    matchKey: 'viettel',
    url: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'ky-hoa',
    name: 'Sân Kỳ Hòa (Quận 10)',
    matchKey: 'kỳ hòa',
    url: 'https://images.unsplash.com/photo-1613918431703-81816e87f654?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'khang-an',
    name: 'Sân Khang An (Gò Vấp)',
    matchKey: 'khang an',
    url: 'https://images.unsplash.com/photo-1521537634581-0dced2fee2ef?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'binh-minh',
    name: 'Sân Bình Minh (Bình Thạnh)',
    matchKey: 'bình minh',
    url: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'standard',
    name: 'Sân Tiêu Chuẩn Thảm Xanh',
    matchKey: 'standard',
    url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80',
  },
];

export function getDefaultCourtImage(courtName: string, district?: string): string {
  const normalized = (courtName + ' ' + (district || '')).toLowerCase();
  for (const preset of COURT_PRESET_IMAGES) {
    if (preset.matchKey !== 'standard' && normalized.includes(preset.matchKey)) {
      return preset.url;
    }
  }
  let hash = 0;
  for (let i = 0; i < courtName.length; i++) {
    hash = (hash + courtName.charCodeAt(i)) % COURT_PRESET_IMAGES.length;
  }
  return COURT_PRESET_IMAGES[hash].url;
}

export function toMatchPost(row: DbMatchRow): MatchPost {
  let coverImage = '';
  let googleMapsUrl = '';
  let cleanNotes = row.notes || '';

  const imgMatch = cleanNotes.match(/\[IMG:(https?:\/\/[^\]]+)\]/);
  if (imgMatch) {
    coverImage = imgMatch[1];
    cleanNotes = cleanNotes.replace(/\[IMG:https?:\/\/[^\]]+\]/, '').trim();
  } else {
    coverImage = getDefaultCourtImage(row.court_name, row.district);
  }

  const mapMatch = cleanNotes.match(/\[MAP:(https?:\/\/[^\]]+)\]/);
  if (mapMatch) {
    googleMapsUrl = mapMatch[1];
    cleanNotes = cleanNotes.replace(/\[MAP:https?:\/\/[^\]]+\]/, '').trim();
  } else {
    const query = encodeURIComponent(`${row.court_name} ${row.address || ''} ${row.district}`.trim());
    googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${query}`;
  }

  return {
    id: row.id,
    title: row.title,
    courtName: row.court_name,
    address: row.address || '',
    district: row.district,
    date: row.date,
    startTime: row.start_time,
    endTime: row.end_time,
    courtNumber: row.court_number || 'Sân 1',
    courtCount: row.court_count || 1,
    shuttleType: row.shuttle_type || 'VinaStar Đỏ',
    totalSlots: row.total_slots,
    joinedPlayers: Array.isArray(row.joined_players) ? row.joined_players : [],
    minLevel: row.min_level as any,
    maxLevel: row.max_level as any,
    priceMale: row.price_male,
    priceFemale: row.price_female,
    hostId: row.host_id,
    hostName: row.host_name,
    hostAvatar: row.host_avatar,
    hostPhone: row.host_phone,
    hostBadge: row.host_badge || 'Host uy tín ⭐ 5.0',
    coverImage,
    googleMapsUrl,
    notes: cleanNotes,
    createdAt: row.created_at,
  };
}

export function toDbRow(match: MatchPost): DbMatchRow {
  let formattedNotes = match.notes || '';
  if (match.googleMapsUrl && match.googleMapsUrl.startsWith('http')) {
    formattedNotes = `[MAP:${match.googleMapsUrl}] ${formattedNotes}`.trim();
  }
  if (match.coverImage && match.coverImage.startsWith('http')) {
    formattedNotes = `[IMG:${match.coverImage}] ${formattedNotes}`.trim();
  }

  return {
    id: match.id,
    title: match.title,
    court_name: match.courtName,
    address: match.address,
    district: match.district,
    date: match.date,
    start_time: match.startTime,
    end_time: match.endTime,
    court_number: match.courtNumber,
    court_count: match.courtCount,
    shuttle_type: match.shuttleType,
    total_slots: match.totalSlots,
    joined_players: match.joinedPlayers,
    min_level: match.minLevel,
    max_level: match.maxLevel,
    price_male: match.priceMale,
    price_female: match.priceFemale,
    host_id: match.hostId,
    host_name: match.hostName,
    host_avatar: match.hostAvatar,
    host_phone: match.hostPhone,
    host_badge: match.hostBadge,
    notes: formattedNotes,
    created_at: new Date().toISOString(),
  };
}
