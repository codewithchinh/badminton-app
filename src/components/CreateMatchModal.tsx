import React, { useState } from 'react';
import type { MatchPost, SkillLevel, UserProfile } from '../types';
import { X, Plus, Sparkles } from 'lucide-react';

interface CreateMatchModalProps {
  isOpen: boolean;
  currentUser: UserProfile;
  onClose: () => void;
  onCreate: (newMatch: MatchPost) => void;
}

const DISTRICTS = [
  'Quận 10',
  'Tân Bình',
  'Gò Vấp',
  'Bình Thạnh',
  'Phú Nhuận',
  'Quận 7',
  'Thủ Đức',
  'Quận 1',
  'Quận 3',
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
  const [district, setDistrict] = useState('Quận 10');
  const [address, setAddress] = useState('');
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
  const [notes, setNotes] = useState('Sân vui vẻ giao lưu, có nước đá miễn phí. Đến đúng giờ nhé cả nhà!');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courtName.trim()) {
      alert('Vui lòng nhập tên sân cầu!');
      return;
    }

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

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Tên sân cầu lông <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={courtName}
                onChange={(e) => setCourtName(e.target.value)}
                placeholder="VD: Sân Cầu Lông Viettel, Kỳ Hòa, Ga Trực Thăng..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-emerald-500"
              />
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
