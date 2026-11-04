export type SkillLevel =
  | 'Newbie'
  | 'Yếu'
  | 'Yếu+'
  | 'TB Yếu'
  | 'TB-'
  | 'Trung Bình'
  | 'TB+'
  | 'TB+++'
  | 'Khá (Bán chuyên)'
  | 'Tốt (Ăn tập)';

export const SKILL_LEVEL_SCORES: Record<SkillLevel, number> = {
  'Newbie': 0,
  'Yếu': 1,
  'Yếu+': 2,
  'TB Yếu': 3,
  'TB-': 4,
  'Trung Bình': 5,
  'TB+': 6,
  'TB+++': 7,
  'Khá (Bán chuyên)': 8,
  'Tốt (Ăn tập)': 9,
};

export interface Player {
  userId: string;
  name: string;
  avatar: string;
  level: SkillLevel;
  phone: string;
  joinedAt: string;
  isPaidDeposit?: boolean;
  gender?: 'male' | 'female';
}

export interface MatchPost {
  id: string;
  title: string;
  courtName: string;
  address: string;
  district: string;
  date: string;
  startTime: string;
  endTime: string;
  courtNumber: string; // ví dụ "Sân 3"
  courtCount: number;
  shuttleType: string;
  totalSlots: number;
  joinedPlayers: Player[];
  minLevel: SkillLevel;
  maxLevel: SkillLevel;
  priceMale: number;
  priceFemale: number;
  hostId: string;
  hostName: string;
  hostAvatar: string;
  hostPhone: string;
  hostBadge: string;
  coverImage?: string;
  googleMapsUrl?: string;
  notes: string;
  createdAt: string;
  updatedAt?: string;
  status?: 'active' | 'completed' | 'cancelled';
  targetGender?: 'all' | 'male' | 'female';
  amenities?: string[];
  refundPolicy?: string;
  isUrgent?: boolean;
  bankInfo?: {
    bankName: string;
    accountNumber: string;
    accountName: string;
    depositAmount?: number;
  };
}

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  experienceYears: string;
  level: SkillLevel;
  hasPlayedOtherCourts: boolean;
  isOnboarded: boolean;
  joinedMatchIds: string[];
  savedMatchIds?: string[];
  playedMatchesCount?: number;
  gender?: 'male' | 'female';
}
