import React from 'react';
import type { MatchPost, UserProfile } from '../types';
import { Clock, MapPin, Zap, CheckCircle, ShieldCheck } from 'lucide-react';
import { getDefaultCourtImage } from '../supabase';

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

  const coverSrc = match.coverImage || getDefaultCourtImage(match.courtName, match.district);

  return (
    <div
      onClick={() => onSelect(match)}
      className="bg-white rounded-3xl shadow-xs hover:shadow-md border border-slate-200/80 hover:border-emerald-400 transition-all cursor-pointer relative overflow-hidden group flex flex-col justify-between"
    >
      {/* Court Cover Image with Status Overlay */}
      <div className="relative h-36 sm:h-40 w-full overflow-hidden bg-slate-100">
        <img
          src={coverSrc}
          alt={match.courtName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&auto=format&fit=crop&q=80';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

        {/* Top-left: Time Badge */}
        <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/55 backdrop-blur-md text-white text-xs font-semibold shadow-xs">
          <Clock className="w-3.5 h-3.5 text-emerald-400" />
          <span>{match.date}</span>
          <span className="text-white/40">•</span>
          <span className="text-emerald-300 font-bold">{match.startTime} - {match.endTime}</span>
        </div>

        {/* Top-right: Slot Status Badge */}
        <div className="absolute top-3 right-3">
          {isFull ? (
            <span className="px-2.5 py-1 rounded-full bg-black/65 backdrop-blur-md text-slate-300 text-xs font-semibold">
              Đã đủ người
            </span>
          ) : remainingSlots <= 2 ? (
            <span className="px-2.5 py-1 rounded-full bg-amber-500/95 backdrop-blur-md text-white text-xs font-bold shadow-xs animate-pulse">
              Chỉ còn {remainingSlots} slot!
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-full bg-emerald-600/90 backdrop-blur-md text-white text-xs font-bold shadow-xs">
              Còn {remainingSlots}/{match.totalSlots} slot
            </span>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Title & Court */}
          <h3 className="font-extrabold text-slate-900 text-base sm:text-lg leading-snug line-clamp-2 group-hover:text-emerald-700 transition-colors">
            {match.title}
          </h3>

          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-2">
            <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
            <span className="font-bold text-slate-800">{match.courtName}</span>
            <span>•</span>
            <span className="text-slate-600 font-medium">{match.district}</span>
          </div>

          {/* Match Meta: Level + Shuttle */}
          <div className="flex flex-wrap items-center gap-2 mt-3.5">
            <div className="px-3 py-1 rounded-xl bg-teal-50 border border-teal-200/70 text-teal-900 text-xs font-semibold flex items-center gap-1">
              <span className="text-teal-600">Trình:</span>
              <span className="font-bold">{match.minLevel} ➔ {match.maxLevel}</span>
            </div>

            <div className="px-2.5 py-1 rounded-xl bg-slate-100 text-slate-700 text-xs font-medium">
              {match.courtCount} sân ({match.courtNumber}) • {match.shuttleType}
            </div>
          </div>

          {/* Slot Progress Bar */}
          <div className="mt-4">
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all rounded-full ${
                  isFull ? 'bg-slate-400' : remainingSlots <= 2 ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${(match.joinedPlayers.length / match.totalSlots) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-slate-100 my-4" />

        {/* Footer: Host & Price + Action */}
        <div className="flex items-center justify-between">
          {/* Host Info */}
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src={match.hostAvatar}
              alt={match.hostName}
              className="w-9 h-9 rounded-full object-cover border border-slate-200 shadow-2xs"
            />
            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-900 truncate flex items-center gap-1">
                {match.hostName}
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 inline" />
              </div>
              <div className="text-[10px] text-slate-400 truncate">{match.createdAt}</div>
            </div>
          </div>

          {/* Price & Action */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-xs sm:text-sm font-extrabold text-slate-900">
                {formatMoney(match.priceMale)} <span className="text-[10px] font-normal text-slate-500">/nam</span>
              </div>
              <div className="text-[11px] text-slate-500 font-medium">
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
                className="px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold flex items-center gap-1.5 border border-emerald-300"
              >
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                Đã giữ slot
              </button>
            ) : isFull ? (
              <button
                type="button"
                disabled
                className="px-3.5 py-2 rounded-xl bg-slate-100 text-slate-400 text-xs font-semibold cursor-not-allowed"
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
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
              >
                <Zap className="w-3.5 h-3.5 fill-current" />
                Vào ngay
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
