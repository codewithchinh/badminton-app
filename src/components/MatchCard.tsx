import React from 'react';
import type { MatchPost, UserProfile } from '../types';
import { Clock, MapPin, Zap, CheckCircle, ShieldCheck } from 'lucide-react';

interface MatchCardProps {
  match: MatchPost;
  currentUser: UserProfile;
  onJoin: (matchId: string) => void;
  onSelect: (match: MatchPost) => void;
}

export const MatchCard: React.FC<MatchCardProps> = ({
  match,
  currentUser,
  onJoin,
  onSelect,
}) => {
  const isJoined = match.joinedPlayers.some((p) => p.userId === currentUser.id);
  const remainingSlots = match.totalSlots - match.joinedPlayers.length;
  const isFull = remainingSlots <= 0;

  // Format currency
  const formatMoney = (amount: number) => {
    return amount >= 1000 ? `${amount / 1000}k` : `${amount}đ`;
  };

  return (
    <div
      onClick={() => onSelect(match)}
      className="bg-white rounded-2xl p-4 shadow-xs border border-slate-100 hover:border-emerald-200 transition-all cursor-pointer relative overflow-hidden group"
    >
      {/* Top Banner: Time & Slot Status */}
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
          <Clock className="w-3.5 h-3.5 text-emerald-600" />
          <span>{match.date}</span>
          <span className="text-slate-300">•</span>
          <span className="text-emerald-700 font-bold">{match.startTime} - {match.endTime}</span>
        </div>

        {/* Slot badge */}
        {isFull ? (
          <span className="px-2.5 py-1 rounded-full bg-slate-200 text-slate-600 text-xs font-semibold">
            Đã đủ người
          </span>
        ) : remainingSlots <= 2 ? (
          <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold animate-pulse">
            Chỉ còn {remainingSlots} slot!
          </span>
        ) : (
          <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
            Còn {remainingSlots}/{match.totalSlots} slot
          </span>
        )}
      </div>

      {/* Title & Court */}
      <h3 className="font-bold text-slate-800 text-base leading-snug line-clamp-1 group-hover:text-emerald-700 transition-colors">
        {match.title}
      </h3>

      <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
        <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
        <span className="font-semibold text-slate-700">{match.courtName}</span>
        <span>•</span>
        <span>{match.district}</span>
      </div>

      {/* Match Meta: Level + Shuttle */}
      <div className="flex flex-wrap items-center gap-2 mt-3">
        <div className="px-2.5 py-1 rounded-lg bg-teal-50 border border-teal-100 text-teal-800 text-[11px] font-semibold flex items-center gap-1">
          <span>Trình:</span>
          <span className="font-bold text-teal-900">{match.minLevel} ➔ {match.maxLevel}</span>
        </div>

        <div className="px-2 py-1 rounded-lg bg-slate-50 text-slate-600 text-[11px] font-medium">
          {match.courtCount} sân ({match.courtNumber}) • {match.shuttleType}
        </div>
      </div>

      {/* Slot Progress Bar */}
      <div className="mt-3">
        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all rounded-full ${
              isFull ? 'bg-slate-400' : remainingSlots <= 2 ? 'bg-amber-500' : 'bg-emerald-500'
            }`}
            style={{ width: `${(match.joinedPlayers.length / match.totalSlots) * 100}%` }}
          />
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-slate-100 my-3" />

      {/* Footer: Host & Price + Action */}
      <div className="flex items-center justify-between">
        {/* Host Info */}
        <div className="flex items-center gap-2 min-w-0">
          <img
            src={match.hostAvatar}
            alt={match.hostName}
            className="w-8 h-8 rounded-full object-cover border border-slate-200"
          />
          <div className="min-w-0">
            <div className="text-xs font-bold text-slate-800 truncate flex items-center gap-1">
              {match.hostName}
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 inline" />
            </div>
            <div className="text-[10px] text-slate-400 truncate">{match.createdAt}</div>
          </div>
        </div>

        {/* Price & Action */}
        <div className="flex items-center gap-2.5">
          <div className="text-right">
            <div className="text-xs font-bold text-slate-800">
              {formatMoney(match.priceMale)} <span className="text-[10px] font-normal text-slate-400">/nam</span>
            </div>
            <div className="text-[10px] text-slate-500">
              {formatMoney(match.priceFemale)} /nữ
            </div>
          </div>

          {/* Quick Action Button */}
          {isJoined ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onJoin(match.id);
              }}
              className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold flex items-center gap-1 border border-emerald-200"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              Đã vào kèo
            </button>
          ) : isFull ? (
            <button
              type="button"
              disabled
              className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-400 text-xs font-semibold"
            >
              Hết chỗ
            </button>
          ) : (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onJoin(match.id);
              }}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 shadow-xs transition-all active:scale-95"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              Vào ngay
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
