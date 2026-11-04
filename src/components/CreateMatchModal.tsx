import React, { useState } from 'react';
import type { MatchPost, SkillLevel, UserProfile } from '../types';
import { X, Plus, Sparkles, Image as ImageIcon, Check, MapPin, Navigation } from 'lucide-react';
import { COURT_PRESET_IMAGES, getDefaultCourtImage } from '../supabase';
import { searchCourts, type CourtInfo } from '../data/badmintonCourts';

interface CreateMatchModalProps {
  isOpen: boolean;
  currentUser: UserProfile;
  onClose: () => void;
  onCreate: (newMatch: MatchPost) => void;
}

const DISTRICTS = [
  'Tân Phú',
  'Bình Tân',
  'Tân Bình',
  'Thủ Đức',
  'Quận 10',
  'Gò Vấp',
  'Bình Thạnh',
  'Phú Nhuận',
  'Quận 7',
  'Quận 1',
  'Quận 3',
  'Quận 5',
  'Quận 6',
  'Quận 8',
  'Quận 11',
  'Quận 12',
  'Bình Chánh',
  'Hóc Môn',
];

const SKILL_LEVELS: SkillLevel[] = [
  'Newbie',
  'Yếu',
  'Yếu+',
  'TB Yếu',
  'TB-',
  'Trung Bình',
  'TB+',
  'TB+++',
  'Khá (Bán chuyên)',
  'Tốt (Ăn tập)',
];

const SHUTTLE_TYPES = ['VinaStar Đỏ', 'VinaStar Xanh', 'Hải Yến Đỏ', 'Thành Công 77', 'Victor', 'Ba Sao'];

export const CreateMatchModal: React.FC<CreateMatchModalProps> = ({
  isOpen,
  currentUser,
  onClose,
  onCreate,
}) => {
  const [title, setTitle] = useState('');
  const [courtName, setCourtName] = useState('');
  const [district, setDistrict] = useState('Tân Phú');
  const [address, setAddress] = useState('');
  const [googleMapsUrl, setGoogleMapsUrl] = useState('');
  const [suggestions, setSuggestions] = useState<CourtInfo[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [date, setDate] = useState('Hôm nay');
  const [startTime, setStartTime] = useState('18:00');
  const [endTime, setEndTime] = useState('20:00');
  const [courtNumber, setCourtNumber] = useState('Sân 3');
  const [shuttleType, setShuttleType] = useState('VinaStar Đỏ');
  const [totalSlots, setTotalSlots] = useState(8);
  const [minLevel, setMinLevel] = useState<SkillLevel>('TB Yếu');
  const [maxLevel, setMaxLevel] = useState<SkillLevel>('TB+');
  const [priceMale, setPriceMale] = useState(60000);
  const [priceFemale, setPriceFemale] = useState(40000);
  const [coverImage, setCoverImage] = useState('');
  const [notes, setNotes] = useState('Sân vui vẻ giao lưu, có nước đá miễn phí. Đến đúng giờ nhé cả nhà!');

  if (!isOpen) return null;

  const handleCourtNameChange = (val: string) => {
    setCourtName(val);
    if (val.trim().length >= 1) {
      const results = searchCourts(val);
      setSuggestions(results);
      setShowSuggestions(results.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSelectCourt = (court: CourtInfo) => {
    setCourtName(court.name);
    setAddress(court.address);
    setDistrict(court.district);
    setGoogleMapsUrl(court.googleMapsUrl);
    if (court.image) {
      setCoverImage(court.image);
    }
    setShowSuggestions(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courtName.trim()) {
      alert('Vui lòng nhập tên sân cầu!');
      return;
    }

    const finalMapsUrl =
      googleMapsUrl.trim() ||
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        `${courtName.trim()} ${address.trim()} ${district}`.trim()
      )}`;

    const newMatch: MatchPost = {
      id: `match-${Date.now()}`,
      title: title.trim() || `Tuyển vãng lai tại ${courtName} (${startTime} - ${endTime})`,
      courtName: courtName.trim(),
      district,
      address: address.trim() || `${courtName}, ${district}`,
      date,
      startTime,
      endTime,
      courtNumber,
      courtCount: 1,
      shuttleType,
      totalSlots: Number(totalSlots) || 8,
      joinedPlayers: [
        {
          userId: currentUser.id,
          name: `${currentUser.name} (Host)`,
          avatar: currentUser.avatar,
          level: currentUser.level,
          phone: currentUser.phone,
          joinedAt: 'Vừa xong',
        },
      ],
      minLevel,
      maxLevel,
      priceMale: Number(priceMale) || 60000,
      priceFemale: Number(priceFemale) || 40000,
      hostId: currentUser.id,
      hostName: currentUser.name,
      hostAvatar: currentUser.avatar,
      hostPhone: currentUser.phone,
      hostBadge: 'Host mới ⭐ 5.0',
      coverImage: coverImage.trim() || getDefaultCourtImage(courtName.trim(), district),
      googleMapsUrl: finalMapsUrl,
      notes: notes.trim(),
      createdAt: 'Vừa xong',
    };

    onCreate(newMatch);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[92vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-300" />
            <h2 className="text-base sm:text-lg font-bold">Đăng Tuyển Kèo Vãng Lai Mới</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* Tiêu đề & Tên sân */}
          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Tiêu đề bài đăng (Tùy chọn)
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="VD: Tuyển 2 bạn giao lưu vui vẻ không quạu..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-emerald-500"
              />
            </div>

            {/* Tên sân cầu lông kèm Autocomplete */}
            <div className="relative">
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  Tên sân cầu lông <span className="text-rose-500">*</span>
                </label>
                <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                  <Navigation className="w-3 h-3" />
                  Gõ để tự điền Quận & Địa chỉ
                </span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={courtName}
                  onChange={(e) => handleCourtNameChange(e.target.value)}
                  onFocus={() => {
                    if (suggestions.length > 0) setShowSuggestions(true);
                  }}
                  placeholder="Gõ tên sân: Celadon, Tên Lửa, Viettel, Tam Bình..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-emerald-500 bg-white"
                />
                {courtName && (
                  <button
                    type="button"
                    onClick={() => {
                      setCourtName('');
                      setSuggestions([]);
                      setShowSuggestions(false);
                      setGoogleMapsUrl('');
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Suggestions Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-40 divide-y divide-slate-100 max-h-60 overflow-y-auto">
                  <div className="px-3 py-1.5 bg-slate-50 text-[10px] font-bold text-slate-500 flex items-center justify-between">
                    <span>SÂN GỢI Ý TRÊN GOOGLE MAPS</span>
                    <span className="text-emerald-700">Bấm để tự điền 1-chạm</span>
                  </div>
                  {suggestions.map((court) => (
                    <button
                      key={court.id}
                      type="button"
                      onClick={() => handleSelectCourt(court)}
                      className="w-full px-3 py-2.5 text-left hover:bg-emerald-50/80 transition-colors flex items-start gap-2.5 group"
                    >
                      <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-slate-900 truncate">
                          {court.name}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate">
                          {court.address} • <span className="font-semibold text-emerald-700">{court.district}</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md shrink-0">
                        Chọn
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* Badge thông báo đã liên kết Google Maps */}
              {googleMapsUrl && (
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-medium mt-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Đã tự động lấy vị trí & link dẫn đường Google Maps cho sân này</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Quận / Huyện</label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-emerald-500 bg-white"
                >
                  {DISTRICTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Số sân</label>
                <input
                  type="text"
                  value={courtNumber}
                  onChange={(e) => setCourtNumber(e.target.value)}
                  placeholder="VD: Sân 3"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Địa chỉ chi tiết</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="VD: 158 Hoàng Hoa Thám, P.12"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-emerald-500"
              />
            </div>
          </div>

          {/* Ngày & Giờ */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Ngày đánh</label>
              <select
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-2.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-emerald-500 bg-white"
              >
                <option value="Hôm nay">Hôm nay</option>
                <option value="Ngày mai">Ngày mai</option>
                <option value="Thứ Bảy">Thứ Bảy</option>
                <option value="Chủ Nhật">Chủ Nhật</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Bắt đầu</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-2.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Kết thúc</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-2.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-emerald-500"
              />
            </div>
          </div>

          {/* Loại cầu & Số người cần tuyển */}
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Loại cầu sử dụng</label>
              <select
                value={shuttleType}
                onChange={(e) => setShuttleType(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-emerald-500 bg-white"
              >
                {SHUTTLE_TYPES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Tổng slot cần (Người)</label>
              <input
                type="number"
                min={2}
                max={20}
                value={totalSlots}
                onChange={(e) => setTotalSlots(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-emerald-500"
              />
            </div>
          </div>

          {/* Trình độ tuyển */}
          <div className="pt-2 border-t border-slate-100">
            <label className="text-xs font-bold text-slate-700 block mb-2">
              Khoảng trình độ mong muốn
            </label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[10px] text-slate-500">Từ trình:</span>
                <select
                  value={minLevel}
                  onChange={(e) => setMinLevel(e.target.value as SkillLevel)}
                  className="w-full mt-0.5 px-2.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-emerald-500 bg-white"
                >
                  {SKILL_LEVELS.map((lvl) => (
                    <option key={lvl} value={lvl}>
                      {lvl}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <span className="text-[10px] text-slate-500">Đến trình:</span>
                <select
                  value={maxLevel}
                  onChange={(e) => setMaxLevel(e.target.value as SkillLevel)}
                  className="w-full mt-0.5 px-2.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-emerald-500 bg-white"
                >
                  {SKILL_LEVELS.map((lvl) => (
                    <option key={lvl} value={lvl}>
                      {lvl}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Chi phí */}
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Giá Nam (VNĐ)</label>
              <input
                type="number"
                step={5000}
                value={priceMale}
                onChange={(e) => setPriceMale(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Giá Nữ (VNĐ)</label>
              <input
                type="number"
                step={5000}
                value={priceFemale}
                onChange={(e) => setPriceFemale(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-emerald-500"
              />
            </div>
          </div>

          {/* Ảnh bìa sân cầu lông (Tùy chọn) */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-emerald-600" />
                Ảnh sân cầu lông (Tùy chọn)
              </label>
              <span className="text-[11px] text-slate-400 font-medium">Tự động gán nếu bỏ trống</span>
            </div>

            {/* Gợi ý chọn ảnh mẫu 1 chạm */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
              {COURT_PRESET_IMAGES.slice(0, 4).map((preset) => {
                const isSelected = coverImage === preset.url;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setCoverImage(isSelected ? '' : preset.url)}
                    className={`relative rounded-xl overflow-hidden h-16 border-2 transition-all text-left group ${
                      isSelected
                        ? 'border-emerald-600 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <img
                      src={preset.url}
                      alt={preset.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-end p-1.5">
                      <span className="text-[10px] text-white font-semibold truncate leading-tight">
                        {preset.name.split(' (')[0]}
                      </span>
                    </div>
                    {isSelected && (
                      <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                        <Check className="w-2.5 h-2.5" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Hoặc nhập link ảnh tùy chỉnh */}
            <input
              type="url"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="Hoặc dán link ảnh sân/ảnh nhóm của bạn..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-emerald-500"
            />
          </div>

          {/* Ghi chú */}
          <div className="pt-2 border-t border-slate-100">
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Lời nhắn / Ghi chú của Host
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="VD: Bao nước đá, nhóm hòa đồng vui vẻ, có tủ đồ gửi..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-emerald-500"
            />
          </div>

          {/* Submit button */}
          <div className="pt-3">
            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white font-bold text-sm shadow-lg shadow-emerald-600/20 active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Đăng Tuyển Kèo Ngay
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
