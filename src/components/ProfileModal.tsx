import React, { useState, useEffect } from 'react';
import type { MatchPost, UserProfile } from '../types';
import { isValidVietnamesePhone, formatPhoneNumber } from '../types';
import { X, Award, Phone, Calendar, RefreshCw, Bookmark, Edit2, Check, LogOut } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  user: UserProfile;
  matches: MatchPost[];
  bookmarkedMatches?: MatchPost[];
  onClose: () => void;
  onRetakeSurvey: () => void;
  onSelectMatch: (match: MatchPost) => void;
  onUpdateProfile?: (updatedUser: Partial<UserProfile>) => void;
  onLogout?: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  user,
  matches,
  bookmarkedMatches = [],
  onClose,
  onRetakeSurvey,
  onSelectMatch,
  onUpdateProfile,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<'joined' | 'bookmarked'>('joined');
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone || '');
  const [gender, setGender] = useState<'male' | 'female'>(user.gender || 'male');

  useEffect(() => {
    setName(user.name);
    setPhone(user.phone || '');
    setGender(user.gender || 'male');
    setIsEditing(false);
  }, [user, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const joinedMatches = matches.filter((m) =>
    m.joinedPlayers.some((p) => p.userId === user.id)
  );

  const handleSaveProfile = () => {
    if (!name.trim()) {
      alert('Vui lòng nhập họ tên!');
      return;
    }
    const cleanPhone = phone.trim().replace(/[^0-9]/g, '');
    if (cleanPhone && !isValidVietnamesePhone(cleanPhone)) {
      alert('Số điện thoại không hợp lệ! Vui lòng nhập đúng số điện thoại di động Việt Nam (10 số, đầu 03, 05, 07, 08, 09).');
      return;
    }
    if (onUpdateProfile) {
      onUpdateProfile({
        name: name.trim(),
        phone: cleanPhone ? formatPhoneNumber(cleanPhone) : '',
        gender,
      });
    }
    setIsEditing(false);
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
    >
      <div className="bg-white rounded-3xl w-full max-w-md max-h-[92vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-emerald-600 to-teal-700 text-white relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-start gap-4">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md shrink-0"
            />
            <div className="min-w-0 flex-1">
              {isEditing ? (
                <div className="space-y-1.5 pr-6">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Họ và tên"
                    className="w-full px-2.5 py-1 text-xs font-bold text-slate-800 bg-white rounded-lg focus:outline-emerald-500"
                  />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Số điện thoại / Zalo"
                    className="w-full px-2.5 py-1 text-xs text-slate-800 bg-white rounded-lg focus:outline-emerald-500"
                  />
                  <div className="flex items-center gap-2 pt-0.5">
                    <span className="text-[11px] text-white/90 font-medium">Giới tính:</span>
                    <button
                      type="button"
                      onClick={() => setGender('male')}
                      className={`px-2 py-0.5 rounded text-[11px] font-bold cursor-pointer transition-all ${
                        gender === 'male' ? 'bg-white text-emerald-800 shadow-2xs' : 'bg-white/20 text-white hover:bg-white/30'
                      }`}
                    >
                      🙋‍♂️ Nam
                    </button>
                    <button
                      type="button"
                      onClick={() => setGender('female')}
                      className={`px-2 py-0.5 rounded text-[11px] font-bold cursor-pointer transition-all ${
                        gender === 'female' ? 'bg-white text-pink-700 shadow-2xs' : 'bg-white/20 text-white hover:bg-white/30'
                      }`}
                    >
                      🙋‍♀️ Nữ
                    </button>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={handleSaveProfile}
                      className="px-2.5 py-1 rounded-md bg-white text-emerald-800 font-bold text-xs flex items-center gap-1 cursor-pointer shadow-xs"
                    >
                      <Check className="w-3 h-3" /> Lưu
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-2 py-1 rounded-md bg-white/20 hover:bg-white/30 text-white text-xs cursor-pointer"
                    >
                      Hủy
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold truncate">{user.name}</h2>
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="p-1 rounded-full hover:bg-white/20 text-white/80 hover:text-white cursor-pointer"
                      title="Sửa họ tên & số điện thoại"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="text-xs text-emerald-100 flex items-center gap-1.5 mt-0.5">
                    <Phone className="w-3.5 h-3.5" />
                    Zalo: {user.phone || 'Chưa cập nhật'}
                  </div>
                  <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold text-yellow-300">
                    <Award className="w-3.5 h-3.5" />
                    Trình độ: {user.level}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* Skill card */}
          <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex items-center justify-between">
            <div>
              <div className="text-xs text-emerald-800 font-semibold">Kinh nghiệm thi đấu</div>
              <div className="text-xs sm:text-sm font-bold text-emerald-950 mt-0.5">
                {user.experienceYears} • {user.hasPlayedOtherCourts ? 'Đã từng đi nhiều sân' : 'Mới đi giao lưu'}
              </div>
            </div>
            <button
              type="button"
              onClick={onRetakeSurvey}
              className="px-3 py-1.5 rounded-xl bg-white border border-emerald-200 text-emerald-700 hover:bg-emerald-100/50 text-xs font-bold flex items-center gap-1 shadow-2xs cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Đo lại trình
            </button>
          </div>

          {/* Tabs: Kèo đã tham gia vs Kèo đã lưu */}
          <div>
            <div className="flex border-b border-slate-200 mb-3">
              <button
                type="button"
                onClick={() => setActiveTab('joined')}
                className={`flex-1 pb-2.5 text-xs font-bold text-center border-b-2 transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === 'joined'
                    ? 'border-emerald-600 text-emerald-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                Đã tham gia ({joinedMatches.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('bookmarked')}
                className={`flex-1 pb-2.5 text-xs font-bold text-center border-b-2 transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === 'bookmarked'
                    ? 'border-emerald-600 text-emerald-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                Đã lưu ({bookmarkedMatches.length})
              </button>
            </div>

            {activeTab === 'joined' && (
              <div>
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
            )}

            {activeTab === 'bookmarked' && (
              <div>
                {bookmarkedMatches.length === 0 ? (
                  <div className="text-center py-8 text-xs text-slate-400 bg-slate-50 rounded-2xl">
                    Chưa có kèo nào được lưu. Bấm biểu tượng Bookmark ở góc mỗi thẻ kèo để lưu lại!
                  </div>
                ) : (
                  <div className="space-y-2">
                    {bookmarkedMatches.map((m) => (
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
                            {m.district} • {m.startTime} - {m.endTime}
                          </div>
                        </div>
                        <span className="text-[11px] font-bold text-amber-600 px-2 py-1 rounded-lg bg-amber-50">
                          Đã lưu
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Logout button */}
          {onLogout && (
            <div className="pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Bạn có chắc chắn muốn đăng xuất tài khoản?')) {
                    onLogout();
                    onClose();
                  }
                }}
                className="w-full py-2.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Đăng xuất tài khoản
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
