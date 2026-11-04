import React, { useEffect, useState } from 'react';
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
  QrCode,
  Copy,
  Edit3,
  UserPlus,
  Clock,
  Check,
  Sparkles,
  Calendar,
} from 'lucide-react';
import { getDefaultCourtImage, SVG_BADMINTON_FALLBACK } from '../supabase';

interface MatchDetailModalProps {
  match: MatchPost | null;
  currentUser: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onToggleJoin: (matchId: string) => void;
  onRemovePlayer?: (matchId: string, playerId: string) => void;
  onEditMatch?: (match: MatchPost) => void;
  onDeleteMatch?: (matchId: string) => void;
  onAddGuest?: (matchId: string) => void;
  onCloneMatch?: (match: MatchPost) => void;
  onTogglePlayerDeposit?: (matchId: string, playerId: string) => void;
}

export const MatchDetailModal: React.FC<MatchDetailModalProps> = ({
  match,
  currentUser,
  isOpen,
  onClose,
  onToggleJoin,
  onRemovePlayer,
  onEditMatch,
  onDeleteMatch,
  onAddGuest,
  onCloneMatch,
  onTogglePlayerDeposit,
}) => {
  const [copiedBank, setCopiedBank] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

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

  if (!isOpen || !match) return null;

  const isJoined = match.joinedPlayers.some((p) => p.userId === currentUser.id);
  const isHost = match.hostId === currentUser.id || (match.hostPhone && match.hostPhone === currentUser.phone);
  const remainingSlots = match.totalSlots - match.joinedPlayers.length;
  const isFull = remainingSlots <= 0;

  const formatMoney = (amount: number) => {
    return amount.toLocaleString('vi-VN') + ' đ';
  };

  const cleanHostPhone = match.hostPhone ? match.hostPhone.replace(/[^0-9]/g, '') : '';

  // Tính trạng thái thời gian đếm ngược & hết hạn
  const getCountdownLabel = () => {
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
      const [startHour, startMin] = match.startTime.split(':').map((n) => parseInt(n, 10));
      targetDate.setHours(startHour, startMin, 0, 0);

      const [endHour, endMin] = match.endTime.split(':').map((n) => parseInt(n, 10));
      const endTargetDate = new Date(targetDate);
      endTargetDate.setHours(endHour, endMin, 0, 0);

      const diffMs = targetDate.getTime() - now.getTime();
      const diffMins = Math.round(diffMs / 60000);

      if (now.getTime() > endTargetDate.getTime()) {
        return { text: 'Kèo đã kết thúc', color: 'bg-slate-500', isExpired: true };
      }
      if (diffMins <= 0 && now.getTime() <= endTargetDate.getTime()) {
        return { text: 'Đang diễn ra', color: 'bg-emerald-600 animate-pulse', isExpired: false };
      }
      if (diffMins < 60) {
        return { text: `Sắp bắt đầu (${diffMins} phút nữa)`, color: 'bg-amber-600', isExpired: false };
      }
      const hours = Math.floor(diffMins / 60);
      const mins = diffMins % 60;
      return { text: `Diễn ra sau ${hours}h ${mins > 0 ? `${mins}p` : ''}`, color: 'bg-teal-600', isExpired: false };
    } catch {
      return null;
    }
  };

  const countdown = getCountdownLabel();
  const isExpired = countdown?.isExpired || false;

  // Link thêm vào Google Calendar
  const getGoogleCalendarUrl = () => {
    try {
      const startDate = new Date();
      if (match.date === 'Ngày mai') {
        startDate.setDate(startDate.getDate() + 1);
      }
      const [sH, sM] = match.startTime.split(':').map(Number);
      startDate.setHours(sH, sM, 0, 0);

      const endDate = new Date(startDate);
      const [eH, eM] = match.endTime.split(':').map(Number);
      endDate.setHours(eH, eM, 0, 0);

      const formatIsoTime = (d: Date) => d.toISOString().replace(/-|:|\.\d\d\d/g, '');
      const startIso = formatIsoTime(startDate);
      const endIso = formatIsoTime(endDate);

      return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`🏸 Giao lưu cầu lông: ${match.courtName}`)}&dates=${startIso}/${endIso}&details=${encodeURIComponent(`Kèo giao lưu cầu lông tại ${match.courtName}\nHost: ${match.hostName} (Zalo: ${match.hostPhone})\nChi phí: Nam ${formatMoney(match.priceMale)} - Nữ ${formatMoney(match.priceFemale)}`)}&location=${encodeURIComponent(`${match.courtName}, ${match.address}`)}`;
    } catch {
      return '#';
    }
  };

  // Sao chép nội dung bài đăng đẹp chuẩn Zalo/Facebook
  const handleCopyShareText = () => {
    const text = `🏸 KÈO GIAO LƯU CẦU LÔNG VÃNG LAI
📍 Sân: ${match.courtName} - ${match.address} (${match.district})
⏰ Thời gian: ${match.startTime} - ${match.endTime} (${match.date})
🏸 Số sân: ${match.courtNumber || 'Chưa cố định'} | Cầu: ${match.shuttleType}
👥 Slot: Còn trống ${remainingSlots}/${match.totalSlots} chỗ
🎯 Trình độ: ${match.minLevel} ➔ ${match.maxLevel}
💰 Chi phí: Nam ${formatMoney(match.priceMale)} | Nữ ${formatMoney(match.priceFemale)}
📞 Liên hệ Host: ${match.hostName} - ${match.hostPhone}
🔗 Link tham gia nhanh: ${window.location.origin}/#match-${match.id}`;

    navigator.clipboard.writeText(text);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2500);
  };

  const handleCopyBankAccount = () => {
    if (!match.bankInfo) return;
    navigator.clipboard.writeText(match.bankInfo.accountNumber);
    setCopiedBank(true);
    setTimeout(() => setCopiedBank(false), 2000);
  };

  const handleCopyAllPhones = () => {
    const phones = match.joinedPlayers
      .map((p) => (p.phone ? p.phone.replace(/[^0-9]/g, '') : ''))
      .filter(Boolean);
    if (phones.length === 0) {
      alert('Chưa có số điện thoại nào từ người chơi.');
      return;
    }
    navigator.clipboard.writeText(phones.join(', '));
    alert(`Đã sao chép ${phones.length} số điện thoại để bạn tạo nhóm Zalo hoặc gọi dặn dò!`);
  };

  const handleDeleteWithConfirm = () => {
    if (window.confirm('Bạn có chắc chắn muốn hủy / xóa kèo giao lưu này? Các thành viên sẽ thấy kèo bị đóng.')) {
      if (onDeleteMatch) {
        onDeleteMatch(match.id);
        onClose();
      }
    }
  };

  const handleCancelJoinWithConfirm = () => {
    if (window.confirm('Bạn có chắc chắn muốn hủy giữ slot này? Hành động này sẽ nhường chỗ cho người khác.')) {
      onToggleJoin(match.id);
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
              (e.target as HTMLImageElement).src = SVG_BADMINTON_FALLBACK;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/40 pointer-events-none" />

          {/* Top Actions: Copy Post, Share & Close */}
          <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
            <a
              href={getGoogleCalendarUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex items-center gap-1.5 text-white hover:bg-black/70 transition-all text-xs font-semibold shadow-sm cursor-pointer"
              title="Thêm lịch hẹn vào Google Calendar"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Lịch Google</span>
            </a>
            <button
              type="button"
              onClick={handleCopyShareText}
              className="px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex items-center gap-1.5 text-white hover:bg-black/70 transition-all text-xs font-semibold shadow-sm cursor-pointer"
              title="Sao chép bài đăng Zalo/Facebook"
            >
              {copiedShare ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Đã chép</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Sao chép</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-black/70 transition-colors shadow-sm cursor-pointer"
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
              <span className="text-xs text-white/90 font-bold backdrop-blur-md bg-black/40 px-2.5 py-0.5 rounded-full border border-white/15">
                {match.startTime} - {match.endTime}
              </span>
              {countdown && (
                <span
                  className={`text-[11px] text-white font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs ${countdown.color}`}
                >
                  <Clock className="w-3 h-3" />
                  {countdown.text}
                </span>
              )}
              {match.isUrgent && !isExpired && (
                <span className="text-[11px] text-white font-extrabold px-2 py-0.5 rounded-full bg-rose-600 animate-pulse shadow-xs">
                  ⚡ Tuyển Gấp
                </span>
              )}
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-white leading-tight drop-shadow-xs line-clamp-1">
              {match.courtName}
            </h2>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {/* Host Management Toolbar */}
          {isHost && (
            <div className="p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Bạn là Host của kèo này</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyAllPhones}
                  className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1 shadow-2xs cursor-pointer active:scale-95 transition-all"
                  title="Sao chép toàn bộ SĐT để tạo nhóm Zalo"
                >
                  <Phone className="w-3.5 h-3.5 text-blue-600" />
                  Chép DS SĐT
                </button>
                {onCloneMatch && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onCloneMatch(match);
                    }}
                    className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1 shadow-2xs cursor-pointer active:scale-95 transition-all"
                    title="Nhân bản bài đăng này cho ngày đánh tiếp theo"
                  >
                    <Copy className="w-3.5 h-3.5 text-emerald-600" />
                    Nhân bản kèo
                  </button>
                )}
                {onAddGuest && remainingSlots > 0 && (
                  <button
                    type="button"
                    onClick={() => onAddGuest(match.id)}
                    className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-emerald-100/60 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-1 shadow-2xs cursor-pointer active:scale-95 transition-all"
                    title="Khóa 1 slot cho bạn bè hoặc khách ngoài đời"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    + Thêm khách ngoài
                  </button>
                )}
                {onEditMatch && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onEditMatch(match);
                    }}
                    className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1 shadow-2xs cursor-pointer active:scale-95 transition-all"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-slate-600" />
                    Sửa kèo
                  </button>
                )}
                {onDeleteMatch && (
                  <button
                    type="button"
                    onClick={handleDeleteWithConfirm}
                    className="px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-1 shadow-2xs cursor-pointer active:scale-95 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                    Đóng kèo
                  </button>
                )}
              </div>
            </div>
          )}

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
                  <span className="font-bold text-slate-800">
                    {match.courtNumber ? `${match.courtNumber}` : 'Host sẽ báo khi đến'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400">Cầu:</span>{' '}
                  <span className="font-bold text-emerald-700">{match.shuttleType}</span>
                </div>
                {match.targetGender && match.targetGender !== 'all' && (
                  <div>
                    <span className="text-slate-400">Đối tượng:</span>{' '}
                    <span className="font-bold text-emerald-700">
                      {match.targetGender === 'female' ? 'Chỉ tuyển Nữ' : 'Chỉ tuyển Nam'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tiện ích sân */}
          {match.amenities && match.amenities.length > 0 && (
            <div>
              <div className="text-xs font-bold text-slate-700 mb-2">Tiện ích tại sân</div>
              <div className="flex flex-wrap gap-1.5">
                {match.amenities.map((item) => (
                  <span
                    key={item}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium flex items-center gap-1"
                  >
                    <Check className="w-3 h-3 text-emerald-600" />
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

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

          {/* VietQR Chuyển Cọc Giữ Slot (Nếu Host yêu cầu) */}
          {match.bankInfo && (
            <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 via-teal-50/30 to-white border border-emerald-200">
              <div className="flex items-center gap-2 mb-2 text-xs font-bold text-emerald-900">
                <QrCode className="w-4 h-4 text-emerald-600" />
                <span>YÊU CẦU CỌC GIỮ CHỖ ({formatMoney(match.bankInfo.depositAmount || 0)} / slot)</span>
              </div>
              <div className="text-[11px] text-slate-600 mb-3">
                Kèo này yêu cầu cọc trước để Host khóa sân và chống bùng slot giờ chót.
                {match.refundPolicy && (
                  <span className="block mt-1 text-emerald-800 font-semibold">
                    🛡️ {match.refundPolicy}
                  </span>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-3.5 rounded-xl border border-emerald-100">
                <img
                  src={`https://img.vietqr.io/image/${match.bankInfo.bankName}-${match.bankInfo.accountNumber}-compact2.png?amount=${match.bankInfo.depositAmount}&addInfo=${encodeURIComponent(`Coc keo ${match.courtName.slice(0, 15)}`)}&accountName=${encodeURIComponent(match.bankInfo.accountName)}`}
                  alt="Mã QR chuyển khoản cọc"
                  className="w-36 h-36 object-contain rounded-lg border border-slate-200 shadow-2xs"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(`Chuyen khoan ${match.bankInfo?.bankName} STK ${match.bankInfo?.accountNumber} Tien ${match.bankInfo?.depositAmount}`)}`;
                  }}
                />
                <div className="flex-1 space-y-1.5 text-xs w-full">
                  <div>
                    <span className="text-slate-400">Ngân hàng:</span>{' '}
                    <span className="font-bold text-slate-800">{match.bankInfo.bankName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Số tài khoản:</span>{' '}
                    <span className="font-mono font-bold text-emerald-700 text-sm">
                      {match.bankInfo.accountNumber}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyBankAccount}
                      className="ml-2 px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-semibold inline-flex items-center gap-1"
                    >
                      {copiedBank ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      {copiedBank ? 'Đã chép' : 'Sao chép'}
                    </button>
                  </div>
                  <div>
                    <span className="text-slate-400">Chủ tài khoản:</span>{' '}
                    <span className="font-bold text-slate-800 uppercase">
                      {match.bankInfo.accountName}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400">Số tiền cọc:</span>{' '}
                    <span className="font-bold text-rose-600">
                      {formatMoney(match.bankInfo.depositAmount || 0)}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 italic pt-1">
                    Nội dung CK: <span className="font-semibold text-slate-700">Coc keo {match.courtName}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

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
                  href={`tel:${cleanHostPhone}`}
                  className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-emerald-600 hover:border-emerald-300 shadow-xs cursor-pointer"
                  title="Gọi điện"
                >
                  <Phone className="w-4 h-4" />
                </a>
                <a
                  href={`https://zalo.me/${cleanHostPhone}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold flex items-center gap-1 shadow-xs hover:bg-blue-700 cursor-pointer"
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
                          {isHost && player.phone && (
                            <span className="text-slate-400 ml-1.5">• Zalo: {player.phone}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Deposit Status Badge / Toggle */}
                      {match.bankInfo && (
                        isHost ? (
                          <button
                            type="button"
                            onClick={() => onTogglePlayerDeposit && onTogglePlayerDeposit(match.id, player.userId)}
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                              player.isPaidDeposit
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : 'bg-slate-100 text-slate-500 hover:bg-emerald-50 hover:text-emerald-700 border border-slate-200'
                            }`}
                            title="Bấm để đánh dấu Đã cọc / Chưa cọc"
                          >
                            {player.isPaidDeposit ? '✓ Đã cọc' : 'Chưa cọc'}
                          </button>
                        ) : player.isPaidDeposit ? (
                          <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                            ✓ Đã cọc
                          </span>
                        ) : null
                      )}

                      {/* Host action: Remove player if mismatch */}
                      {isHost && !isMe && onRemovePlayer && (
                        <button
                          type="button"
                          onClick={() => onRemovePlayer(match.id, player.userId)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg cursor-pointer"
                          title="Hủy slot nếu không hợp trình"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
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
                onClick={handleCancelJoinWithConfirm}
                className="px-4 py-2.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold cursor-pointer transition-colors"
              >
                Hủy tham gia
              </button>
            </div>
          ) : isExpired ? (
            <button
              type="button"
              disabled
              className="w-full py-3 rounded-2xl bg-slate-200 text-slate-500 font-bold text-sm cursor-not-allowed"
            >
              Kèo này đã kết thúc
            </button>
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
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white font-bold text-sm shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 active:scale-98 transition-all cursor-pointer"
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
