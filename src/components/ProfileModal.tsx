import React from 'react';
import type { MatchPost, UserProfile } from '../types';
import { X, Award, Phone, Calendar, RefreshCw } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  user: UserProfile;
  matches: MatchPost[];
  onClose: () => void;
  onRetakeSurvey: () => void;
  onSelectMatch: (match: MatchPost) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  user,
  matches,
  onClose,
  onRetakeSurvey,
  onSelectMatch,
}) => {
  if (!isOpen) return null;

  const joinedMatches = matches.filter((m) =>
    m.joinedPlayers.some((p) => p.userId === user.id)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-3xl w-full max-w-md max-h-[92vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-emerald-600 to-teal-700 text-white relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-4">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
            />
            <div>
              <h2 className="text-lg font-bold">{user.name}</h2>
              <div className="text-xs text-emerald-100 flex items-center gap-1.5 mt-0.5">
                <Phone className="w-3.5 h-3.5" />
                Zalo: {user.phone}
              </div>
              <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold text-yellow-300">
                <Award className="w-3.5 h-3.5" />
                Trình độ: {user.level}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* Skill card */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex items-center justify-between">
            <div>
              <div className="text-xs text-emerald-800 font-semibold">Kinh nghiệm thi đấu</div>
              <div className="text-sm font-bold text-emerald-950 mt-0.5">
                {user.experienceYears} • {user.hasPlayedOtherCourts ? 'Đã từng đi nhiều sân' : 'Mới đi giao lưu'}
              </div>
            </div>
            <button
              type="button"
              onClick={onRetakeSurvey}
              className="px-3 py-1.5 rounded-xl bg-white border border-emerald-200 text-emerald-700 hover:bg-emerald-100/50 text-xs font-bold flex items-center gap-1 shadow-2xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Đo lại trình
            </button>
          </div>

          {/* Joined Matches history */}
          <div>
            <h3 className="font-bold text-slate-800 text-sm mb-2.5 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-emerald-600" />
              Kèo bạn đã đăng ký ({joinedMatches.length})
            </h3>

            {joinedMatches.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400 bg-slate-50 rounded-2xl">
                Bạn chưa tham gia kèo nào. Hãy lướt trang chủ để chọn kèo phù hợp nhé!
              </div>
            ) : (
              <div className="space-y-2">
                {joinedMatches.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => {
                      onSelectMatch(m);
                      onClose();
                    }}
                    className="p-3 bg-white border border-slate-100 hover:border-emerald-200 rounded-2xl cursor-pointer transition-all flex items-center justify-between shadow-2xs"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-800">{m.courtName}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {m.date} • {m.startTime} - {m.endTime}
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-600 px-2 py-1 rounded-lg bg-emerald-50">
                      Đã giữ slot
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
