import React, { useState, useRef, useEffect } from 'react';
import type { MatchPost, SkillLevel, UserProfile } from '../types';
import { X, Plus, Sparkles, Image as ImageIcon, Check, MapPin, Navigation, Upload, Camera, Trash2 } from 'lucide-react';
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
  'Quận 2',
  'Quận 7',
  'Quận 10',
  'Gò Vấp',
  'Bình Thạnh',
  'Phú Nhuận',
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
  const [selectedCourtName, setSelectedCourtName] = useState('');
  const [suggestions, setSuggestions] = useState<CourtInfo[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const autocompleteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (autocompleteRef.current && !autocompleteRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (showSuggestions) {
          setShowSuggestions(false);
        } else {
          onClose();
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

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
  const [recentImages, setRecentImages] = useState<string[]>([]);
  const [notes, setNotes] = useState('Sân vui vẻ giao lưu, có nước đá miễn phí. Đến đúng giờ nhé cả nhà!');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load recently used images by Host if any
  useEffect(() => {
    try {
      const stored = localStorage.getItem('timvanglai_host_recent_images');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setRecentImages(parsed);
        }
      }
    } catch (e) {
      // ignore
    }
  }, []);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn một tệp hình ảnh hợp lệ!');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 800;
        let width = img.width;
        let height = img.height;
        if (width > height && width > maxDim) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else if (height > maxDim) {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setCoverImage(compressedDataUrl);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleCourtNameChange = (val: string) => {
    setCourtName(val);
    // Nếu người dùng sửa khác với tên sân đã chọn từ gợi ý, hủy liên kết Google Maps cũ
    if (selectedCourtName && val.trim() !== selectedCourtName) {
      setGoogleMapsUrl('');
      setSelectedCourtName('');
    }
    if (val.trim().length >= 1) {
      const results = searchCourts(val);
      setSuggestions(results);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSelectCourt = (court: CourtInfo) => {
    setCourtName(court.name);
    setSelectedCourtName(court.name);
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

    // Save uploaded or selected image to Host's recent images
    const chosenImage = coverImage.trim() || getDefaultCourtImage(courtName.trim(), district);
    if (chosenImage) {
      try {
        const updatedRecent = [chosenImage, ...recentImages.filter((img) => img !== chosenImage)].slice(0, 4);
        setRecentImages(updatedRecent);
        localStorage.setItem('timvanglai_host_recent_images', JSON.stringify(updatedRecent));
      } catch (err) {
        // ignore
      }
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
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
    >
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
            <div className="relative" ref={autocompleteRef}>
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
                      setSelectedCourtName('');
                      setSuggestions([]);
                      setShowSuggestions(false);
                      setGoogleMapsUrl('');
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                    title="Xóa để chọn lại"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Suggestions Dropdown */}
              {showSuggestions && (suggestions.length > 0 || (courtName.trim().length >= 2 && !selectedCourtName)) && (
                <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-40 divide-y divide-slate-100 max-h-64 overflow-y-auto">
                  <div className="px-3 py-1.5 bg-slate-50 text-[10px] font-bold text-slate-500 flex items-center justify-between">
                    <span>DANH BẠ SÂN GOOGLE MAPS ({suggestions.length} sân khớp)</span>
                    <span className="text-emerald-700">Tự điền 1-chạm</span>
                  </div>
                  {suggestions.map((court) => (
                    <button
                      key={court.id}
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleSelectCourt(court);
                      }}
                      className="w-full px-3 py-2.5 text-left hover:bg-emerald-50/80 transition-colors flex items-start gap-2.5 group cursor-pointer"
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

                  {/* Mục tiện ích: Nếu sân gõ vào chưa có trong danh bạ hoặc muốn dùng tên riêng */}
                  {courtName.trim().length >= 2 && !selectedCourtName && (
                    <button
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setSelectedCourtName(courtName.trim());
                        const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                          `${courtName.trim()} ${address.trim()} ${district}`.trim()
                        )}`;
                        setGoogleMapsUrl(mapsLink);
                        setShowSuggestions(false);
                      }}
                      className="w-full px-3 py-2.5 text-left bg-emerald-50/80 hover:bg-emerald-100 transition-colors flex items-center justify-between text-xs text-emerald-900 font-semibold cursor-pointer border-t border-emerald-100"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <Navigation className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="truncate">
                          Dùng tên sân: <strong>"{courtName}"</strong> (Tự tạo link Google Maps)
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-200/80 px-2 py-0.5 rounded-md shrink-0">
                        Áp dụng
                      </span>
                    </button>
                  )}
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

          {/* Ảnh bìa sân cầu lông / ảnh nhóm */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-emerald-600" />
                Ảnh sân hoặc ảnh nhóm
              </label>
              <span className="text-[11px] text-slate-400 font-medium">Tự động gán nếu bỏ trống</span>
            </div>

            {/* Input file ẩn để chọn từ điện thoại / máy tính */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />

            {/* Khung hiển thị ảnh đã chọn HOẶC Nút tải ảnh trực tiếp */}
            {coverImage ? (
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 mb-3 bg-slate-900 shadow-sm">
                <img
                  src={coverImage}
                  alt="Ảnh sân đã chọn"
                  className="w-full h-40 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end justify-between p-3">
                  <div className="text-white text-xs font-medium truncate flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Ảnh đã chọn sẵn sàng hiển thị</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-2.5 py-1.5 rounded-xl bg-white/95 hover:bg-white text-slate-800 text-[11px] font-bold shadow-md flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                    >
                      <Camera className="w-3.5 h-3.5 text-emerald-600" />
                      Đổi ảnh
                    </button>
                    <button
                      type="button"
                      onClick={() => setCoverImage('')}
                      className="px-2.5 py-1.5 rounded-xl bg-rose-600/90 hover:bg-rose-600 text-white text-[11px] font-bold shadow-md flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Xóa
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-3 px-4 rounded-2xl border-2 border-dashed border-emerald-300 hover:border-emerald-500 bg-emerald-50/50 hover:bg-emerald-50 transition-all flex items-center justify-center gap-2.5 text-emerald-700 font-bold text-xs cursor-pointer mb-3 group active:scale-[0.99]"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Upload className="w-4 h-4 text-emerald-600" />
                </div>
                <span>Tải ảnh từ điện thoại / máy tính</span>
              </button>
            )}

            {/* 1. Ảnh bạn đã từng đăng (Chỉ hiện khi Host đã có ảnh từng dùng) */}
            {recentImages.length > 0 && (
              <div className="mb-3">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                  Ảnh bạn đã dùng gần đây
                </span>
                <div className="grid grid-cols-4 gap-2">
                  {recentImages.slice(0, 4).map((imgUrl, idx) => {
                    const isSelected = coverImage === imgUrl;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setCoverImage(isSelected ? '' : imgUrl)}
                        className={`relative rounded-xl overflow-hidden h-14 border-2 transition-all cursor-pointer group ${
                          isSelected
                            ? 'border-emerald-600 ring-2 ring-emerald-500/30'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <img
                          src={imgUrl}
                          alt="Ảnh đã dùng"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        {isSelected && (
                          <div className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                            <Check className="w-2 h-2" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 2. Ảnh mẫu thể thao cầu lông chuẩn */}
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                Hoặc chọn ảnh mẫu sân & VĐV Lin Dan
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {COURT_PRESET_IMAGES.slice(0, 4).map((preset) => {
                  const isSelected = coverImage === preset.url;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setCoverImage(isSelected ? '' : preset.url)}
                      className={`relative rounded-xl overflow-hidden h-16 border-2 transition-all text-left cursor-pointer group ${
                        isSelected
                          ? 'border-emerald-600 ring-2 ring-emerald-500/30'
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
            </div>
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
