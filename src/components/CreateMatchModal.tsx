import React, { useState, useRef, useEffect } from 'react';
import type { MatchPost, SkillLevel, UserProfile } from '../types';
import { SKILL_LEVEL_SCORES } from '../types';
import { X, Plus, Sparkles, Image as ImageIcon, Check, MapPin, Navigation, Upload, Camera, Trash2, QrCode } from 'lucide-react';
import { getDefaultCourtImage } from '../supabase';
import { searchCourts, type CourtInfo } from '../data/badmintonCourts';

interface CreateMatchModalProps {
  isOpen: boolean;
  currentUser: UserProfile;
  onClose: () => void;
  onCreate: (newMatch: MatchPost) => void;
  onUpdate?: (updatedMatch: MatchPost) => void;
  editMatch?: MatchPost | null;
  cloneMatch?: MatchPost | null;
  prefilledMatch?: Partial<MatchPost> | null;
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

export const POPULAR_SHUTTLE_TYPES = [
  'VinaStar Đỏ',
  'VinaStar Xanh',
  'VinaStar Bạc',
  'Hải Yến Đỏ',
  'Hải Yến Xanh',
  'Hải Yến S70',
  'Hải Yến S80',
  'Hải Yến S90',
  'Thành Công 77',
  'Thành Công Xanh',
  'Thành Công Đỏ',
  'Ba Sao Pro-X',
  'Ba Sao Bạc',
  'Cầu Sao Mai',
  'Cầu 88',
  'Cầu VNB',
  'Cầu Taro',
  'Cầu Lê Quang',
  'Cầu LHT',
  'Cầu Yonex',
  'Cầu Victor',
  'Cầu RSL',
  'Cầu Li-Ning',
  'Cầu Kumpoo',
  'Cầu Kawasaki',
  'Cầu Pro Ace',
  'Cầu Nhựa',
];

const ALL_AMENITIES = [
  'Thảm chuẩn thi đấu',
  'Nước đá miễn phí',
  'Máy lạnh / Quạt công nghiệp',
  'Bãi đỗ xe ô tô',
  'Phòng tắm nóng lạnh',
  'Căng tin nước uống',
  'Dịch vụ căng vợt',
];

const VIETNAMESE_BANKS = [
  'MBBank',
  'Vietcombank',
  'Techcombank',
  'VPBank',
  'ACB',
  'BIDV',
  'VietinBank',
  'TPBank',
  'OCB',
  'VIB',
  'Sacombank',
];

export const CreateMatchModal: React.FC<CreateMatchModalProps> = ({
  isOpen,
  currentUser,
  onClose,
  onCreate,
  onUpdate,
  editMatch,
  cloneMatch,
  prefilledMatch,
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

  const [date, setDate] = useState('Hôm nay');
  const [isCustomDate, setIsCustomDate] = useState(false);
  const [customDateValue, setCustomDateValue] = useState('');
  const [startTime, setStartTime] = useState('18:00');
  const [endTime, setEndTime] = useState('20:00');
  const [courtNumber, setCourtNumber] = useState('');
  const [isCustomCourt, setIsCustomCourt] = useState(false);
  const [availableCourtsCount, setAvailableCourtsCount] = useState<number>(18);
  const [shuttleType, setShuttleType] = useState('VinaStar Đỏ');
  const [isCustomShuttle, setIsCustomShuttle] = useState(false);
  const [customShuttle, setCustomShuttle] = useState('');
  const [totalSlots, setTotalSlots] = useState(8);
  const [minLevel, setMinLevel] = useState<SkillLevel>('TB Yếu');
  const [maxLevel, setMaxLevel] = useState<SkillLevel>('TB+');
  const [priceMale, setPriceMale] = useState(60000);
  const [priceFemale, setPriceFemale] = useState(40000);
  const [coverImage, setCoverImage] = useState('');
  const [notes, setNotes] = useState('Sân vui vẻ giao lưu, có nước đá miễn phí. Đến đúng giờ nhé cả nhà!');

  // Extra metadata
  const [targetGender, setTargetGender] = useState<'all' | 'male' | 'female'>('all');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(['Thảm chuẩn thi đấu', 'Nước đá miễn phí']);
  const [hasBankInfo, setHasBankInfo] = useState(false);
  const [bankName, setBankName] = useState('MBBank');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [depositAmount, setDepositAmount] = useState<number>(30000);
  const [refundPolicy, setRefundPolicy] = useState('Hoàn cọc 100% nếu báo trước 2 tiếng');
  const [isUrgent, setIsUrgent] = useState(false);
  const [announcement, setAnnouncement] = useState('');

  // Sync state when opening or when editMatch / cloneMatch / prefilledMatch is passed
  useEffect(() => {
    const sourceMatch = editMatch || cloneMatch || prefilledMatch;
    if (sourceMatch) {
      setTitle(
        cloneMatch
          ? `Tuyển vãng lai tại ${sourceMatch.courtName} (Lịch mới)`
          : sourceMatch.title || (sourceMatch.courtName ? `Giao lưu vãng lai tại ${sourceMatch.courtName}` : '')
      );
      setCourtName(sourceMatch.courtName || '');
      setSelectedCourtName(sourceMatch.courtName || '');
      setDistrict(sourceMatch.district || 'Tân Phú');
      setAddress(sourceMatch.address || '');
      setGoogleMapsUrl(sourceMatch.googleMapsUrl || '');
      setDate(cloneMatch ? 'Ngày mai' : (sourceMatch.date || 'Hôm nay'));
      setStartTime(sourceMatch.startTime || '18:00');
      setEndTime(sourceMatch.endTime || '20:00');
      setCourtNumber(sourceMatch.courtNumber || '');
      if (sourceMatch.shuttleType) {
        if (POPULAR_SHUTTLE_TYPES.includes(sourceMatch.shuttleType)) {
          setShuttleType(sourceMatch.shuttleType);
          setIsCustomShuttle(false);
          setCustomShuttle('');
        } else {
          setShuttleType('custom');
          setIsCustomShuttle(true);
          setCustomShuttle(sourceMatch.shuttleType);
        }
      } else {
        setShuttleType('VinaStar Đỏ');
        setIsCustomShuttle(false);
        setCustomShuttle('');
      }
      setTotalSlots(sourceMatch.totalSlots || 8);
      setMinLevel(sourceMatch.minLevel || 'TB Yếu');
      setMaxLevel(sourceMatch.maxLevel || 'TB+');
      setPriceMale(sourceMatch.priceMale ?? 60000);
      setPriceFemale(sourceMatch.priceFemale ?? 40000);
      setCoverImage(sourceMatch.coverImage || '');
      setNotes(sourceMatch.notes || 'Sân vui vẻ giao lưu, có nước đá miễn phí. Đến đúng giờ nhé cả nhà!');
      setTargetGender(sourceMatch.targetGender || 'all');
      setSelectedAmenities(sourceMatch.amenities && sourceMatch.amenities.length > 0 ? sourceMatch.amenities : ['Thảm chuẩn thi đấu', 'Nước đá miễn phí']);
      setRefundPolicy(sourceMatch.refundPolicy || 'Hoàn cọc 100% nếu báo trước 2 tiếng');
      setIsUrgent(cloneMatch ? false : (sourceMatch.isUrgent || false));
      setAnnouncement(sourceMatch.announcement || '');
      if (sourceMatch.bankInfo) {
        setHasBankInfo(true);
        setBankName(sourceMatch.bankInfo.bankName || 'MBBank');
        setAccountNumber(sourceMatch.bankInfo.accountNumber || '');
        setAccountName(sourceMatch.bankInfo.accountName || '');
        setDepositAmount(sourceMatch.bankInfo.depositAmount || 30000);
      } else if (sourceMatch.depositAmount) {
        setHasBankInfo(true);
        setBankName('MBBank');
        setAccountNumber('');
        setAccountName('');
        setDepositAmount(sourceMatch.depositAmount);
      } else {
        setHasBankInfo(false);
        setAccountNumber('');
        setAccountName('');
      }
    } else {
      setTitle('');
      setCourtName('');
      setSelectedCourtName('');
      setDistrict('Tân Phú');
      setAddress('');
      setGoogleMapsUrl('');
      setDate('Hôm nay');
      setStartTime('18:00');
      setEndTime('20:00');
      setCourtNumber('');
      setIsCustomCourt(false);
      setShuttleType('VinaStar Đỏ');
      setIsCustomShuttle(false);
      setCustomShuttle('');
      setTotalSlots(8);
      setMinLevel('TB Yếu');
      setMaxLevel('TB+');
      setPriceMale(60000);
      setPriceFemale(40000);
      setCoverImage('');
      setNotes('Sân vui vẻ giao lưu, có nước đá miễn phí. Đến đúng giờ nhé cả nhà!');
      setTargetGender('all');
      setSelectedAmenities(['Thảm chuẩn thi đấu', 'Nước đá miễn phí']);
      setRefundPolicy('Hoàn cọc 100% nếu báo trước 2 tiếng');
      setIsUrgent(false);
      setAnnouncement('');
      setHasBankInfo(false);

      // Load remembered bank info if Host previously used one (Bug 10 Fix)
      try {
        const savedBank = localStorage.getItem('timvanglai_host_bank');
        if (savedBank) {
          const parsed = JSON.parse(savedBank);
          setBankName(parsed.bankName || 'MBBank');
          setAccountNumber(parsed.accountNumber || '');
          setAccountName(parsed.accountName || '');
          setDepositAmount(parsed.depositAmount || 30000);
        } else {
          setBankName('MBBank');
          setAccountNumber('');
          setAccountName('');
          setDepositAmount(30000);
        }
      } catch {
        setBankName('MBBank');
        setAccountNumber('');
        setAccountName('');
        setDepositAmount(30000);
      }

      // Load Host default preferences (Point 20)
      try {
        const savedDefaults = localStorage.getItem('timvanglai_host_defaults');
        if (savedDefaults) {
          const parsed = JSON.parse(savedDefaults);
          if (parsed.priceMale) setPriceMale(parsed.priceMale);
          if (parsed.priceFemale) setPriceFemale(parsed.priceFemale);
          if (parsed.shuttleType) setShuttleType(parsed.shuttleType);
          if (parsed.district) setDistrict(parsed.district);
          if (parsed.refundPolicy) setRefundPolicy(parsed.refundPolicy);
        }
      } catch {}
    }
  }, [isOpen, editMatch, cloneMatch]);

  const upcomingDatesList = React.useMemo(() => {
    const list = [
      { label: 'Hôm nay', value: 'Hôm nay' },
      { label: 'Ngày mai', value: 'Ngày mai' },
    ];
    const dayNames = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
    const now = new Date();
    for (let i = 2; i < 8; i++) {
      const d = new Date(now);
      d.setDate(now.getDate() + i);
      const dayStr = `${dayNames[d.getDay()]} (${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')})`;
      list.push({ label: dayStr, value: dayStr });
    }
    return list;
  }, []);

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
  }, [showSuggestions, onClose]);

  const fileInputRef = useRef<HTMLInputElement>(null);

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
    if (court.presetCourtCount) {
      setAvailableCourtsCount(court.presetCourtCount);
    } else {
      setAvailableCourtsCount(18);
    }
    setShowSuggestions(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courtName.trim()) {
      alert('Vui lòng nhập tên sân cầu!');
      return;
    }

    if (!startTime || !endTime) {
      alert('Vui lòng chọn giờ bắt đầu và giờ kết thúc!');
      return;
    }

    if (startTime === endTime) {
      alert('Giờ bắt đầu và kết thúc không được trùng nhau!');
      return;
    }

    if ((SKILL_LEVEL_SCORES[minLevel] ?? 0) > (SKILL_LEVEL_SCORES[maxLevel] ?? 9)) {
      alert('Trình độ tối thiểu không được cao hơn trình độ tối đa!');
      return;
    }

    let finalDate = date;
    if (isCustomDate) {
      if (!customDateValue) {
        alert('Vui lòng chọn ngày đánh từ lịch!');
        return;
      }
      const [y, m, d] = customDateValue.split('-');
      const dayObj = new Date(Number(y), Number(m) - 1, Number(d));
      const dayNames = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
      finalDate = `${dayNames[dayObj.getDay()]} (${d}/${m})`;
    }

    const finalImage = coverImage.trim() || getDefaultCourtImage(courtName.trim(), district);

    const finalMapsUrl =
      googleMapsUrl.trim() ||
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        `${courtName.trim()} ${address.trim()} ${district}`.trim()
      )}`;

    const bankData = hasBankInfo && accountNumber.trim() ? {
      bankName,
      accountNumber: accountNumber.trim(),
      accountName: accountName.trim().toUpperCase(),
      depositAmount: Number(depositAmount) || 30000,
    } : undefined;

    if (hasBankInfo && accountNumber.trim()) {
      try {
        localStorage.setItem(
          'timvanglai_host_bank',
          JSON.stringify({
            bankName,
            accountNumber: accountNumber.trim(),
            accountName: accountName.trim().toUpperCase(),
            depositAmount: Number(depositAmount) || 30000,
          })
        );
      } catch {}
    }

    const finalShuttleType = isCustomShuttle ? (customShuttle.trim() || 'VinaStar Đỏ') : shuttleType;

    // Lưu cấu hình tạo kèo mặc định của Host (Point 20)
    try {
      localStorage.setItem(
        'timvanglai_host_defaults',
        JSON.stringify({
          priceMale: Number(priceMale) || 60000,
          priceFemale: Number(priceFemale) || 40000,
          shuttleType: finalShuttleType,
          district,
          refundPolicy,
        })
      );
    } catch {}

    if (editMatch && onUpdate) {
      const updatedMatch: MatchPost = {
        ...editMatch,
        title: title.trim() || `Tuyển vãng lai tại ${courtName} (${startTime} - ${endTime})`,
        courtName: courtName.trim(),
        district,
        address: address.trim() || `${courtName}, ${district}`,
        date: finalDate,
        startTime,
        endTime,
        courtNumber,
        shuttleType: finalShuttleType,
        totalSlots: Number(totalSlots) || 8,
        minLevel,
        maxLevel,
        priceMale: Number(priceMale) || 0,
        priceFemale: Number(priceFemale) || 0,
        coverImage: finalImage,
        googleMapsUrl: finalMapsUrl,
        notes: notes.trim(),
        targetGender,
        amenities: selectedAmenities,
        bankInfo: bankData,
        refundPolicy: hasBankInfo ? refundPolicy : undefined,
        isUrgent,
        announcement: announcement.trim() || undefined,
        updatedAt: new Date().toISOString(),
      };
      onUpdate(updatedMatch);
      onClose();
      return;
    }

    const newMatch: MatchPost = {
      id: `match-${Date.now()}`,
      title: title.trim() || `Tuyển vãng lai tại ${courtName} (${startTime} - ${endTime})`,
      courtName: courtName.trim(),
      district,
      address: address.trim() || `${courtName}, ${district}`,
      date: finalDate,
      startTime,
      endTime,
      courtNumber,
      courtCount: 1,
      shuttleType: finalShuttleType,
      totalSlots: Number(totalSlots) || 8,
      joinedPlayers: [
        {
          userId: currentUser.id,
          name: `${currentUser.name} (Host)`,
          avatar: currentUser.avatar,
          level: currentUser.level,
          phone: currentUser.phone,
          joinedAt: 'Vừa xong',
          isPaidDeposit: true,
        },
      ],
      minLevel,
      maxLevel,
      priceMale: Number(priceMale) || 0,
      priceFemale: Number(priceFemale) || 0,
      hostId: currentUser.id,
      hostName: currentUser.name,
      hostAvatar: currentUser.avatar,
      hostPhone: currentUser.phone,
      hostBadge: 'Host mới ⭐ 5.0',
      coverImage: finalImage,
      googleMapsUrl: finalMapsUrl,
      notes: notes.trim(),
      createdAt: 'Vừa xong',
      status: 'active',
      targetGender,
      amenities: selectedAmenities,
      refundPolicy: hasBankInfo ? refundPolicy : undefined,
      isUrgent,
      announcement: announcement.trim() || undefined,
      bankInfo: bankData,
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
            <h2 className="text-base sm:text-lg font-bold">
              {editMatch ? 'Chỉnh Sửa Thông Tin Kèo' : 'Đăng Tuyển Kèo Vãng Lai Mới'}
            </h2>
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
                      setAvailableCourtsCount(18);
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
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Số sân <span className="text-slate-400 font-normal">(Tùy chọn)</span>
                </label>
                <select
                  value={isCustomCourt ? 'custom' : courtNumber}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === 'custom') {
                      setIsCustomCourt(true);
                      setCourtNumber('');
                    } else {
                      setIsCustomCourt(false);
                      setCourtNumber(val);
                    }
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-emerald-500 bg-white"
                >
                  <option value="">Chưa đặt (Để trống)</option>
                  {Array.from({ length: availableCourtsCount }, (_, i) => i + 1).map((num) => (
                    <option key={num} value={`Sân ${num}`}>
                      Sân {num}
                    </option>
                  ))}
                  <option value="custom">Khác (Tự nhập số sân...)</option>
                </select>

                {isCustomCourt && (
                  <input
                    type="text"
                    autoFocus
                    value={courtNumber}
                    onChange={(e) => setCourtNumber(e.target.value)}
                    placeholder="VD: Sân 1 & 2, Sân VIP..."
                    className="w-full mt-2 px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-emerald-500 bg-white"
                  />
                )}
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
          <div className="pt-2 border-t border-slate-100">
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Ngày đánh</label>
                <select
                  value={isCustomDate ? 'custom' : date}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === 'custom') {
                      setIsCustomDate(true);
                    } else {
                      setIsCustomDate(false);
                      setDate(val);
                    }
                  }}
                  className="w-full px-2 py-2 rounded-xl border border-slate-200 text-xs focus:outline-emerald-500 bg-white"
                >
                  {upcomingDatesList.map((d) => (
                    <option key={d.value} value={d.value}>
                      {d.label}
                    </option>
                  ))}
                  <option value="custom">📅 Chọn ngày khác...</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Bắt đầu</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-2 py-2 rounded-xl border border-slate-200 text-xs focus:outline-emerald-500 bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Kết thúc</label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full px-2 py-2 rounded-xl border border-slate-200 text-xs focus:outline-emerald-500 bg-white"
                />
              </div>
            </div>

            {/* Custom Date Input if selected (Bug 6 Fix) */}
            {isCustomDate && (
              <div className="mt-2 p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200">
                <label className="text-[11px] font-bold text-emerald-900 block mb-1">
                  Chọn ngày đánh cụ thể từ lịch:
                </label>
                <input
                  type="date"
                  autoFocus
                  min={new Date().toISOString().split('T')[0]}
                  value={customDateValue}
                  onChange={(e) => setCustomDateValue(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl border border-emerald-300 text-xs bg-white focus:outline-emerald-500 font-medium"
                />
              </div>
            )}

            {/* Overnight match badge (Bug 5 Fix) */}
            {startTime && endTime && startTime > endTime && (
              <div className="mt-2 px-2.5 py-1.5 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 text-[11px] font-medium flex items-center gap-1.5">
                <span>🌙</span>
                <span>Ca đánh đêm (kết thúc vào rạng sáng hôm sau)</span>
              </div>
            )}
          </div>

          {/* Loại cầu & Số người cần tuyển */}
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Loại cầu sử dụng</label>
              <select
                value={isCustomShuttle ? 'custom' : shuttleType}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === 'custom') {
                    setIsCustomShuttle(true);
                  } else {
                    setIsCustomShuttle(false);
                    setShuttleType(val);
                  }
                }}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-emerald-500 bg-white"
              >
                {POPULAR_SHUTTLE_TYPES.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
                <option value="custom">Khác (Tự nhập loại cầu...)</option>
              </select>

              {isCustomShuttle && (
                <input
                  type="text"
                  autoFocus
                  value={customShuttle}
                  onChange={(e) => setCustomShuttle(e.target.value)}
                  placeholder="VD: Cầu Lining D9, Cầu tự làm..."
                  className="w-full mt-2 px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-emerald-500 bg-white font-medium"
                />
              )}
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

            {/* Dự toán doanh thu cho Host (Point 20) */}
            <div className="col-span-2 py-2 px-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
              <span>Doanh thu dự kiến ({totalSlots} slot):</span>
              <span className="font-bold text-emerald-700 text-xs">
                ~{(Number(priceMale) * Math.ceil(totalSlots * 0.6) + Number(priceFemale) * Math.floor(totalSlots * 0.4)).toLocaleString('vi-VN')} đ
                <span className="text-[10px] text-slate-400 font-normal ml-1">(tính theo 60% nam + 40% nữ)</span>
              </span>
            </div>
          </div>

          {/* Đối tượng tuyển */}
          <div className="pt-2 border-t border-slate-100">
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              Đối tượng tuyển
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setTargetGender('all')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all text-center cursor-pointer ${
                  targetGender === 'all'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                👥 Cả Nam & Nữ
              </button>
              <button
                type="button"
                onClick={() => setTargetGender('male')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all text-center cursor-pointer ${
                  targetGender === 'male'
                    ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                🙋‍♂️ Chỉ tuyển Nam
              </button>
              <button
                type="button"
                onClick={() => setTargetGender('female')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all text-center cursor-pointer ${
                  targetGender === 'female'
                    ? 'bg-pink-50 border-pink-500 text-pink-700 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                🙋‍♀️ Chỉ tuyển Nữ
              </button>
            </div>
          </div>

          {/* Tiện ích sân */}
          <div className="pt-2 border-t border-slate-100">
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              Tiện ích sân & dịch vụ
            </label>
            <div className="flex flex-wrap gap-1.5">
              {ALL_AMENITIES.map((amenity) => {
                const isSelected = selectedAmenities.includes(amenity);
                return (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => {
                      if (isSelected) {
                        setSelectedAmenities(selectedAmenities.filter((a) => a !== amenity));
                      } else {
                        setSelectedAmenities([...selectedAmenities, amenity]);
                      }
                    }}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer flex items-center gap-1 ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-semibold'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 text-emerald-600" />}
                    {amenity}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Nhận cọc VietQR chống bùng slot */}
          <div className="pt-2 border-t border-slate-100">
            <div className="p-3 rounded-2xl border border-emerald-200 bg-emerald-50/40">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                    <QrCode className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">
                      Yêu cầu cọc slot qua VietQR
                    </span>
                    <span className="text-[11px] text-slate-500 block">
                      Chống bùng slot giờ chót, tạo mã QR chuyển khoản tự động
                    </span>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasBankInfo}
                    onChange={(e) => setHasBankInfo(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              {hasBankInfo && (
                <div className="mt-3 pt-3 border-t border-emerald-100 space-y-2.5">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        Ngân hàng
                      </label>
                      <select
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs bg-white focus:outline-emerald-500"
                      >
                        {VIETNAMESE_BANKS.map((b) => (
                          <option key={b} value={b}>
                            {b}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        Số tài khoản <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value.replace(/[^0-9]/g, ''))}
                        placeholder="VD: 0987654321"
                        className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs bg-white focus:outline-emerald-500"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        Tên chủ tài khoản <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={accountName}
                        onChange={(e) => setAccountName(e.target.value.toUpperCase())}
                        placeholder="VD: NGUYEN VAN A"
                        className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs bg-white uppercase focus:outline-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        Tiền cọc / slot (VNĐ)
                      </label>
                      <input
                        type="number"
                        step={5000}
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs bg-white focus:outline-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      Quy định hoàn cọc
                    </label>
                    <select
                      value={refundPolicy}
                      onChange={(e) => setRefundPolicy(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs bg-white focus:outline-emerald-500 font-medium"
                    >
                      <option value="Hoàn cọc 100% nếu báo trước 1 tiếng">Hoàn cọc 100% nếu báo trước 1 tiếng</option>
                      <option value="Hoàn cọc 100% nếu báo trước 2 tiếng">Hoàn cọc 100% nếu báo trước 2 tiếng</option>
                      <option value="Hoàn cọc nếu báo trước 3 tiếng">Hoàn cọc nếu báo trước 3 tiếng</option>
                      <option value="Hoàn cọc nếu báo trước 4 tiếng">Hoàn cọc nếu báo trước 4 tiếng</option>
                      <option value="Hoàn cọc nếu báo trước 6 tiếng">Hoàn cọc nếu báo trước 6 tiếng</option>
                      <option value="Chỉ hoàn cọc khi tìm được người thay thế">Chỉ hoàn cọc khi tìm được người thay thế</option>
                      <option value="Không hoàn cọc nếu hủy sát giờ">Không hoàn cọc nếu hủy sát giờ</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Cần tuyển gấp */}
            <div className="mt-2 flex items-center justify-between p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/80">
              <div className="text-xs">
                <span className="font-bold text-amber-900 block">⚡ Cần tuyển gấp trong ngày</span>
                <span className="text-[11px] text-amber-700 block">Gắn huy hiệu nổi bật & đẩy lên đầu danh sách</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isUrgent}
                  onChange={(e) => setIsUrgent(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-8 h-4 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-amber-500"></div>
              </label>
            </div>
          </div>

          {/* Ảnh bìa sân cầu lông / ảnh nhóm */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-emerald-600" />
                Ảnh sân hoặc ảnh nhóm <span className="text-slate-400 font-normal">(Tùy chọn)</span>
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

            {/* Nếu đã tải ảnh lên: hiển thị khung ảnh đã chọn kèm nút Đổi ảnh & Xóa */}
            {coverImage ? (
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 shadow-sm">
                <img
                  src={coverImage}
                  alt="Ảnh sân đã chọn"
                  className="w-full h-44 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end justify-between p-3">
                  <div className="text-white text-xs font-medium truncate flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Ảnh đã tải lên sẵn sàng</span>
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
              /* Khung trống duy nhất để Host bấm tải ảnh từ máy lên */
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-8 px-4 rounded-2xl border-2 border-dashed border-slate-200 hover:border-emerald-500 bg-slate-50/70 hover:bg-emerald-50/40 transition-all flex flex-col items-center justify-center gap-2 text-slate-600 hover:text-emerald-700 cursor-pointer group active:scale-[0.99]"
              >
                <div className="w-12 h-12 rounded-full bg-white shadow-sm border border-slate-200 flex items-center justify-center group-hover:scale-110 group-hover:border-emerald-300 transition-all">
                  <Upload className="w-5 h-5 text-slate-500 group-hover:text-emerald-600" />
                </div>
                <div className="text-center">
                  <span className="text-xs font-bold block text-slate-800 group-hover:text-emerald-700">
                    Bấm để tải ảnh từ điện thoại / máy tính lên
                  </span>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    Hỗ trợ file JPG, PNG, WebP (Tùy chọn)
                  </span>
                </div>
              </button>
            )}
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

          {/* Ghim thông báo khẩn từ Host (Point 13) */}
          <div className="pt-2 border-t border-slate-100">
            <label className="text-xs font-bold text-amber-800 flex items-center justify-between mb-1">
              <span>📢 Ghim thông báo khẩn của Host (Tùy chọn)</span>
              <span className="text-[10px] text-amber-600 font-normal">Hiển thị banner nổi bật cho người chơi</span>
            </label>
            <input
              type="text"
              value={announcement}
              onChange={(e) => setAnnouncement(e.target.value)}
              placeholder="VD: Đổi qua sân số 5 do sân 3 bảo trì, mang theo 2 áo sáng/tối nhé..."
              className="w-full px-3 py-2 rounded-xl border border-amber-200 bg-amber-50/40 text-xs focus:outline-amber-500 text-amber-950 font-medium"
            />
          </div>

          {/* Submit button */}
          <div className="pt-3">
            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white font-bold text-sm shadow-lg shadow-emerald-600/20 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              {editMatch ? 'Lưu Cập Nhật Kèo' : 'Đăng Tuyển Kèo Ngay'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
