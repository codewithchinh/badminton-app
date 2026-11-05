import React from 'react';
import type { MatchPost, UserProfile } from '../types';
import { Clock, MapPin, Zap, CheckCircle, ShieldCheck, Bookmark, QrCode, Share2 } from 'lucide-react';
import { getDefaultCourtImage, SVG_BADMINTON_FALLBACK } from '../supabase';

interface MatchCardProps {
  match: MatchPost;
  currentUser: UserProfile;
  isBookmarked?: boolean;
  onJoin: (matchId: string) => void;
  onSelect: (match: MatchPost) => void;
  onToggleBookmark?: (matchId: string) => void;
}

export const MatchCard: React.FC<MatchCardProps> = ({
  match,
  currentUser,
  isBookmarked = false,
  onJoin,
  onSelect,
  onToggleBookmark,
}) => {
  const isJoined = match.joinedPlayers.some((p) => p.userId === currentUser.id);
  const remainingSlots = match.totalSlots - match.joinedPlayers.length;
  const isFull = remainingSlots <= 0;

  // Tính trạng thái kết thúc (Bug 3 Fix)
  const isExpired = (() => {
    try {
      const now = new Date();
      let targetDate = new Date();
      if (match.date === 'Ngày mai') {
        targetDate.setDate(targetDate.getDate() + 1);
      } else if (match.date.includes('/')) {
        const parts = match.date.match(/(\d{1,2})\/(\d{1,2})/);
        if (parts) {
          targetDate.setDate(parseInt(parts[1], 10));
          targetDate.setMonth(parseInt(parts[2], 10) - 1);
        }
      }
      const [endHour, endMin] = match.endTime.split(':').map((n) => parseInt(n, 10));
      targetDate.setHours(endHour, endMin, 0, 0);
      return now.getTime() > targetDate.getTime();
    } catch {
      return false;
    }
  })();

  // Format currency
  const formatMoney = (amount: number) => {
    return amount >= 1000 ? `${amount / 1000}k` : `${amount}đ`;
  };

  const handleQuickShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.vibrate) try { navigator.vibrate(20); } catch {}
    const text = `🏸 Kèo cầu lông: ${match.courtName} (${match.startTime} - ${match.endTime}, ${match.date})\nTrình: ${match.minLevel} - ${match.maxLevel}\nCòn ${remainingSlots} slot! Link: ${window.location.origin}/#match-${match.id}`;
    if (navigator.share) {
      navigator.share({ title: match.title, text, url: `${window.location.origin}/#match-${match.id}` }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      alert('Đã sao chép link kèo để bạn gửi Zalo rủ bạn bè!');
    }
  };

  const coverSrc = match.coverImage || getDefaultCourtImage(match.courtName, match.district);

  return (
    <div
      onClick={() => onSelect(match)}
      className={`bg-white rounded-3xl shadow-xs hover:shadow-md border border-slate-200/80 hover:border-emerald-400 transition-all cursor-pointer relative overflow-hidden group flex flex-col justify-between ${
        isExpired ? 'opacity-70 bg-slate-50/70 border-slate-300' : ''
      }`}
    >
      {/* Court Cover Image with Status Overlay */}
      <div className="relative h-36 sm:h-40 w-full overflow-hidden bg-slate-100">
        <img
          src={coverSrc}
          alt={match.courtName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = SVG_BADMINTON_FALLBACK;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

        {/* Top-left: Time Badge & Urgent & Expired */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
          {isExpired ? (
            <span className="px-2.5 py-1 rounded-full bg-slate-800/90 text-slate-300 text-xs font-bold shadow-xs">
              Đã kết thúc
            </span>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/55 backdrop-blur-md text-white text-xs font-semibold shadow-xs">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span>{match.date}</span>
              <span className="text-white/40">•</span>
              <span className="text-emerald-300 font-bold">{match.startTime} - {match.endTime}</span>
            </div>
          )}

          {match.isLocked && !isExpired && (
            <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-900 text-[11px] font-extrabold shadow-xs">
              🔒 Tạm ngưng nhận
            </span>
          )}

          {match.isUrgent && !isExpired && (
            <span className="px-2 py-0.5 rounded-full bg-rose-600/90 text-white text-[11px] font-extrabold animate-pulse shadow-xs">
              ⚡ Tuyển Gấp
            </span>
          )}
          {match.announcement && !isExpired && (
            <span className="px-2 py-0.5 rounded-full bg-amber-500/90 text-slate-900 text-[11px] font-extrabold shadow-xs">
              📢 Có thông báo
            </span>
          )}
        </div>

        {/* Top-right: Slot Status Badge, Quick Share & Bookmark */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          {/* Quick Share Button (Point 6) */}
          <button
            type="button"
            onClick={handleQuickShare}
            className="w-7 h-7 rounded-full backdrop-blur-md bg-black/50 text-white hover:bg-black/70 flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95"
            title="Chia sẻ nhanh link kèo"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>

          {onToggleBookmark && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleBookmark(match.id);
              }}
              className={`w-7 h-7 rounded-full backdrop-blur-md flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95 ${
                isBookmarked
                  ? 'bg-amber-400 text-slate-900 shadow-amber-500/30'
                  : 'bg-black/50 text-white hover:bg-black/70'
              }`}
              title={isBookmarked ? 'Bỏ lưu kèo' : 'Lưu lại để xem sau'}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>
          )}

          {isExpired ? (
            <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-slate-400 text-xs font-semibold">
              Hết hạn
            </span>
          ) : match.isLocked ? (
            <span className="px-2.5 py-1 rounded-full bg-amber-600/90 backdrop-blur-md text-white text-xs font-semibold">
              Đã đóng
            </span>
          ) : isFull ? (
            <span className="px-2.5 py-1 rounded-full bg-black/65 backdrop-blur-md text-slate-300 text-xs font-semibold">
              Đã đủ
            </span>
          ) : remainingSlots <= 2 ? (
            <span className="px-2.5 py-1 rounded-full bg-amber-500/95 backdrop-blur-md text-white text-xs font-bold shadow-xs animate-pulse">
              Còn {remainingSlots} slot!
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

          {/* Match Meta: Level + Shuttle + Gender/Deposit */}
          <div className="flex flex-wrap items-center gap-1.5 mt-3.5">
            <div className="px-2.5 py-1 rounded-xl bg-teal-50 border border-teal-200/70 text-teal-900 text-xs font-semibold flex items-center gap-1">
              <span className="text-teal-600">Trình:</span>
              <span className="font-bold">{match.minLevel} ➔ {match.maxLevel}</span>
            </div>

            <div className="px-2.5 py-1 rounded-xl bg-slate-100 text-slate-700 text-xs font-medium">
              {match.courtCount} sân{match.courtNumber ? ` (${match.courtNumber})` : ''} • {match.shuttleType}
            </div>

            {match.targetGender === 'female' && (
              <span className="px-2 py-1 rounded-xl bg-pink-50 border border-pink-200 text-pink-700 text-[11px] font-bold">
                🙋‍♀️ Chỉ Nữ
              </span>
            )}
            {match.targetGender === 'male' && (
              <span className="px-2 py-1 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 text-[11px] font-bold">
                🙋‍♂️ Chỉ Nam
              </span>
            )}

            {match.bankInfo && (
              <span className="px-2 py-1 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold flex items-center gap-1">
                <QrCode className="w-3 h-3 text-emerald-600" />
                Cọc {formatMoney(match.bankInfo.depositAmount || 0)}
              </span>
            )}

            {/* Tiện ích nổi bật (Point 5) */}
            {match.amenities && match.amenities.slice(0, 2).map((amenity) => (
              <span
                key={amenity}
                className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-600 text-[10px] font-medium hidden sm:inline-block"
              >
                ✨ {amenity}
              </span>
            ))}
          </div>

          {/* Slot Progress Bar */}
          <div className="mt-4">
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all rounded-full ${
                  isExpired ? 'bg-slate-300' : isFull ? 'bg-slate-400' : remainingSlots <= 2 ? 'bg-amber-500' : 'bg-emerald-500'
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
              {match.priceMale === 0 && match.priceFemale === 0 ? (
                <div className="text-xs sm:text-sm font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
                  Miễn phí
                </div>
              ) : (
                <>
                  <div className="text-xs sm:text-sm font-extrabold text-slate-900">
                    {formatMoney(match.priceMale)} <span className="text-[10px] font-normal text-slate-500">/nam</span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium">
                    {formatMoney(match.priceFemale)} /nữ
                  </div>
                </>
              )}
            </div>

            {/* Quick Action Button (Bug 3 Fix) */}
            {isExpired ? (
              <button
                type="button"
                disabled
                className="px-3 py-2 rounded-xl bg-slate-100 text-slate-400 text-xs font-semibold cursor-not-allowed"
              >
                Đã xong
              </button>
            ) : match.isLocked ? (
              <button
                type="button"
                disabled
                className="px-3 py-2 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold cursor-not-allowed"
              >
                Tạm ngưng
              </button>
            ) : isJoined ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (navigator.vibrate) try { navigator.vibrate(20); } catch {}
                  onJoin(match.id);
                }}
                className="px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold flex items-center gap-1.5 border border-emerald-300 cursor-pointer active:scale-95"
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
                  if (navigator.vibrate) try { navigator.vibrate(30); } catch {}
                  onJoin(match.id);
                }}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
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
