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

export interface Player {
  userId: string;
  name: string;
  avatar: string;
  level: SkillLevel;
  phone: string;
  joinedAt: string;
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
  notes: string;
  createdAt: string;
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
}
