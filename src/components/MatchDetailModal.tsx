import React, { useEffect } from 'react';
import type { MatchPost, UserProfile } from '../types';
import {
  X,
  MapPin,
  Users,
  ShieldCheck,
  Phone,
  MessageCircle,
  Share2,
  Trash2,
  Zap,
  CheckCircle,
  Navigation,
} from 'lucide-react';
import { getDefaultCourtImage } from '../supabase';

interface MatchDetailModalProps {
  match: MatchPost | null;
  currentUser: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onToggleJoin: (matchId: string) => void;
  onRemovePlayer?: (matchId: string, playerId: string) => void;
}

export const MatchDetailModal: React.FC<MatchDetailModalProps> = ({
  match,
  currentUser,
  isOpen,
  onClose,
  onToggleJoin,
  onRemovePlayer,
}) => {
  if (!isOpen || !match) return null;

  const isJoined = match.joinedPlayers.some((p) => p.userId === currentUser.id);
  const isHost = match.hostId === currentUser.id || match.hostPhone === currentUser.phone;
  const remainingSlots = match.totalSlots - match.joinedPlayers.length;
  const isFull = remainingSlots <= 0;

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const formatMoney = (amount: number) => {
    return amount.toLocaleString('vi-VN') + ' đ';
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: match.title,
        text: `Tham gia giao lưu cầu lông tại ${match.courtName} (${match.startTime} - ${match.endTime}) nhé!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(
        `Kèo cầu lông: ${match.courtName} - ${match.date} (${match.startTime}-${match.endTime}). Còn ${remainingSlots} slot!`
      );
      alert('Đã copy thông tin kèo để bạn gửi Zalo/Facebook!');
    }
  };

  const coverSrc = match.coverImage || getDefaultCourtImage(match.courtName, match.district);

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4"
    >
      <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-2xl max-h-[92vh] overflow-hidden shadow-2xl flex flex-col animate-in fade-in slide-in-from-bottom-6 duration-200">
        {/* Banner Cover Image */}
        <div className="relative h-44 sm:h-52 w-full overflow-hidden bg-slate-900 shrink-0">
          <img
            src={coverSrc}
            alt={match.courtName}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&auto=format&fit=crop&q=80';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/40 pointer-events-none" />

          {/* Top Actions: Share & Close */}
          <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
            <button
              type="button"
              onClick={handleShare}
              className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-black/60 transition-colors shadow-sm"
              title="Chia sẻ kèo"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-black/60 transition-colors shadow-sm"
              title="Đóng"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Bottom Info on Cover */}
          <div className="absolute bottom-4 left-4 right-4 text-white z-10">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/90 text-white text-xs font-bold shadow-xs">
                {match.date}
              </span>
              <span className="text-xs text-white/90 font-bold backdrop-blur-md bg-black/35 px-2.5 py-0.5 rounded-full border border-white/15">
                {match.startTime} - {match.endTime}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-white leading-tight drop-shadow-xs line-clamp-1">
              {match.courtName}
            </h2>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {/* Title & Court Info */}
          <div>
            <h2 className="text-lg font-bold text-slate-900 leading-snug">{match.title}</h2>
            <div className="mt-2.5 p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
              <div className="flex items-start justify-between gap-3 text-xs">
                <div className="flex items-start gap-2 min-w-0 flex-1">
                  <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-slate-800 break-words">{match.courtName}</div>
                    <div className="text-slate-500 break-words">{match.address}</div>
                  </div>
                </div>

                <a
                  href={
                    match.googleMapsUrl ||
                    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      `${match.courtName} ${match.address} ${match.district}`.trim()
                    )}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200/80 flex items-center gap-1.5 transition-all shadow-2xs active:scale-95"
                  title="Mở Google Maps dẫn đường tới sân"
                >
                  <Navigation className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
                  Chỉ đường
                </a>
              </div>

              <div className="flex items-center gap-4 pt-2 border-t border-slate-200/60 text-xs text-slate-600">
                <div>
                  <span className="text-slate-400">Số sân:</span>{' '}
                  <span className="font-bold text-slate-800">{match.courtNumber} ({match.courtCount} sân)</span>
                </div>
                <div>
                  <span className="text-slate-400">Cầu:</span>{' '}
                  <span className="font-bold text-emerald-700">{match.shuttleType}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Trình độ & Chi phí */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-teal-50/70 border border-teal-100">
              <div className="text-[11px] font-semibold text-teal-700 uppercase">Yêu cầu trình độ</div>
              <div className="text-sm font-bold text-teal-950 mt-1">
                {match.minLevel} ➔ {match.maxLevel}
              </div>
              <div className="text-[10px] text-teal-600 mt-0.5">Vui lòng đăng ký đúng trình</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-100">
              <div className="text-[11px] font-semibold text-amber-700 uppercase">Chi phí tham gia</div>
              <div className="text-sm font-bold text-amber-950 mt-1">
                Nam {formatMoney(match.priceMale)}
              </div>
              <div className="text-[10px] text-amber-700 mt-0.5">
                Nữ: {formatMoney(match.priceFemale)} (bao gồm cầu)
              </div>
            </div>
          </div>

          {/* Host Card */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={match.hostAvatar}
                  alt={match.hostName}
                  className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-xs"
                />
                <div>
                  <div className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                    {match.hostName}
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-xs text-emerald-700 font-medium">{match.hostBadge}</div>
                  <div className="text-[11px] text-slate-400">SĐT/Zalo: {match.hostPhone}</div>
                </div>
              </div>

              {/* Contact buttons */}
              <div className="flex items-center gap-1.5">
                <a
                  href={`tel:${match.hostPhone}`}
                  className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-emerald-600 hover:border-emerald-300 shadow-xs"
                  title="Gọi điện"
                >
                  <Phone className="w-4 h-4" />
                </a>
                <a
                  href={`https://zalo.me/${match.hostPhone}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold flex items-center gap-1 shadow-xs hover:bg-blue-700"
                >
                  <MessageCircle className="w-4 h-4" />
                  Chat Zalo
                </a>
              </div>
            </div>

            {/* Note from host */}
            {match.notes && (
              <div className="mt-3 pt-3 border-t border-slate-200/70 text-xs text-slate-600 italic">
                "{match.notes}"
              </div>
            )}
          </div>

          {/* Joined Players List */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                <Users className="w-4 h-4 text-emerald-600" />
                Danh sách người chơi ({match.joinedPlayers.length}/{match.totalSlots})
              </h3>
              {remainingSlots > 0 ? (
                <span className="text-xs font-bold text-emerald-700">
                  Còn trống {remainingSlots} chỗ
                </span>
              ) : (
                <span className="text-xs font-bold text-rose-600">Đã đủ quân số</span>
              )}
            </div>

            <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden bg-slate-50/50">
              {match.joinedPlayers.map((player, idx) => {
                const isMe = player.userId === currentUser.id;
                return (
                  <div key={player.userId + idx} className="p-3 flex items-center justify-between bg-white">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-6 text-center text-xs font-bold text-slate-400">
                        #{idx + 1}
                      </div>
                      <img
                        src={player.avatar}
                        alt={player.name}
                        className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-800 truncate flex items-center gap-1">
                          {player.name}
                          {isMe && (
                            <span className="px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-bold">
                              Bạn
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Trình:{' '}
                          <span className="font-semibold text-slate-700">{player.level}</span>
                          {isHost && (
                            <span className="text-slate-400 ml-1.5">• Zalo: {player.phone}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Host action: Remove player if mismatch */}
                    {isHost && !isMe && onRemovePlayer && (
                      <button
                        type="button"
                        onClick={() => onRemovePlayer(match.id, player.userId)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
                        title="Hủy slot nếu không hợp trình"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom CTA / Action Bar */}
        <div className="p-4 bg-white border-t border-slate-100">
          {isJoined ? (
            <div className="flex items-center gap-3">
              <div className="flex-1 text-xs text-emerald-700 font-semibold flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4" />
                Bạn đã đăng ký tham gia slot này
              </div>
              <button
                type="button"
                onClick={() => onToggleJoin(match.id)}
                className="px-4 py-2.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold"
              >
                Hủy tham gia
              </button>
            </div>
          ) : isFull ? (
            <button
              type="button"
              disabled
              className="w-full py-3 rounded-2xl bg-slate-200 text-slate-500 font-bold text-sm cursor-not-allowed"
            >
              Kèo này đã đủ người ({match.totalSlots}/{match.totalSlots})
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onToggleJoin(match.id)}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white font-bold text-sm shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 active:scale-98 transition-all"
            >
              <Zap className="w-4 h-4 fill-current" />
              Bấm tham gia ngay (Vào slot tức thì)
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
