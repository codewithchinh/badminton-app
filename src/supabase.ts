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

export function toMatchPost(row: DbMatchRow): MatchPost {
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
    notes: row.notes || '',
    createdAt: row.created_at,
  };
}

export function toDbRow(match: MatchPost): DbMatchRow {
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
    notes: match.notes,
    created_at: new Date().toISOString(),
  };
}
