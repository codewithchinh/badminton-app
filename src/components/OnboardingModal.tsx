import React, { useState, useEffect } from 'react';
import type { SkillLevel, UserProfile } from '../types';
import { Award, CheckCircle2, ChevronRight, Sparkles, User, X } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  user: UserProfile;
  onSave: (updated: UserProfile) => void;
  onClose?: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  user,
  onSave,
  onClose,
}) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState(user.name && user.name !== 'Khách' ? user.name : '');
  const [phone, setPhone] = useState(user.phone || '');
  const [experience, setExperience] = useState(user.experienceYears || '6 tháng - 1 năm');
  const [level, setLevel] = useState<SkillLevel>(user.level || 'TB Yếu');
  const [hasPlayedOthers, setHasPlayedOthers] = useState<boolean>(user.hasPlayedOtherCourts ?? false);

  // Sync state whenever modal is opened or user prop updates (e.g. from Google login)
  useEffect(() => {
    if (isOpen) {
      if (user.name && user.name !== 'Khách') {
        setName(user.name);
      } else {
        setName('');
      }
      setPhone(user.phone || '');
      if (user.experienceYears) {
        setExperience(user.experienceYears);
      }
      if (user.level) {
        setLevel(user.level);
      }
      if (typeof user.hasPlayedOtherCourts === 'boolean') {
        setHasPlayedOthers(user.hasPlayedOtherCourts);
      }
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const experienceOptions = [
    { label: 'Dưới 6 tháng', desc: 'Mới tập chơi, làm quen cầm vợt', suggestedLevel: 'Newbie' as SkillLevel },
    { label: '6 tháng - 1 năm', desc: 'Đã đánh qua lại được, đang tập phông & đập', suggestedLevel: 'TB Yếu' as SkillLevel },
    { label: '1 - 3 năm', desc: 'Bộ chân ổn, phản tạt và đập cầu tương đối', suggestedLevel: 'TB-' as SkillLevel },
    { label: '3 - 5 năm', desc: 'Kinh nghiệm dày dặn, thể lực và chiến thuật tốt', suggestedLevel: 'Trung Bình' as SkillLevel },
    { label: 'Trên 5 năm / Bán chuyên', desc: 'Lực tốt, di chuyển mượt mà, bao sân tốt', suggestedLevel: 'TB+' as SkillLevel },
  ];

  const levelCategories: { group: string; levels: SkillLevel[] }[] = [
    { group: '1. Newbie', levels: ['Newbie'] },
    { group: '2. Yếu', levels: ['Yếu', 'Yếu+'] },
    { group: '3. Trung Bình (Phổ biến nhất)', levels: ['TB Yếu', 'TB-', 'Trung Bình', 'TB+', 'TB+++'] },
    { group: '4. Bán chuyên & Chuyên nghiệp', levels: ['Khá (Bán chuyên)', 'Tốt (Ăn tập)'] },
  ];

  const handleSelectExperience = (exp: string, suggested: SkillLevel) => {
    setExperience(exp);
    setLevel(suggested);
  };

  const handleFinish = () => {
    const finalName = name.trim() || user.name || 'Người chơi';
    onSave({
      ...user,
      name: finalName,
      phone: phone.trim(),
      experienceYears: experience,
      level: level,
      hasPlayedOtherCourts: hasPlayedOthers,
      isOnboarded: true,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 p-6 text-white text-center relative">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <div className="inline-flex items-center justify-center w-12 h-12 bg-white/15 rounded-2xl mb-3 backdrop-blur-md">
            <Sparkles className="w-6 h-6 text-yellow-300" />
          </div>
          <h2 className="text-xl font-bold">Khảo Sát Phân Trình Cầu Lông</h2>
          <p className="text-xs text-emerald-100 mt-1">
            Chỉ mất 30 giây để tìm kèo ghép đúng trình, không lo bị "ngộp" hay lệch kèo
          </p>
          {/* Progress dots */}
          <div className="flex justify-center gap-2 mt-4">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all ${
                  step === s ? 'w-6 bg-white' : 'w-2 bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto flex-1">
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 text-xs flex items-center justify-center font-bold">1</span>
                Bạn đã chơi cầu lông được bao lâu rồi?
              </h3>
              <div className="space-y-2">
                {experienceOptions.map((opt) => (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => handleSelectExperience(opt.label, opt.suggestedLevel)}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-start justify-between ${
                      experience === opt.label
                        ? 'border-emerald-500 bg-emerald-50/70 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-sm text-slate-800">{opt.label}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{opt.desc}</div>
                    </div>
                    {experience === opt.label && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    )}
                  </button>
                ))}
              </div>

              <div className="pt-2">
                <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2 mb-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 text-xs flex items-center justify-center font-bold">2</span>
                  Bạn từng tham gia sân vãng lai nào trước đây chưa?
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setHasPlayedOthers(false)}
                    className={`p-3 rounded-xl border text-xs font-semibold text-center ${
                      !hasPlayedOthers
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    Chưa, đây là lần đầu
                  </button>
                  <button
                    type="button"
                    onClick={() => setHasPlayedOthers(true)}
                    className={`p-3 rounded-xl border text-xs font-semibold text-center ${
                      hasPlayedOthers
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    Đã từng tham gia nhiều sân
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                  <Award className="w-5 h-5 text-emerald-600" />
                  Bạn tự đánh giá mình ở trình nào?
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Dựa vào thời gian chơi, hệ thống tạm đề xuất trình <span className="font-bold text-emerald-700">{level}</span>. Bạn có thể chọn lại cho chuẩn nhất:
                </p>
              </div>

              <div className="space-y-3">
                {levelCategories.map((cat) => (
                  <div key={cat.group} className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                      {cat.group}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {cat.levels.map((lvl) => (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => setLevel(lvl)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                            level === lvl
                              ? 'bg-emerald-600 text-white shadow-xs scale-102'
                              : 'bg-white text-slate-700 border border-slate-200 hover:border-emerald-300'
                          }`}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <User className="w-5 h-5 text-emerald-600" />
                Thông tin để Host liên hệ Zalo khi vào kèo
              </h3>
              <p className="text-xs text-slate-500">
                Khi bấm tham gia kèo, Host sẽ liên hệ Zalo số này để dặn dò sân hoặc xác nhận giữ chỗ.
              </p>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">
                    Tên hiển thị của bạn
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="VD: Nguyễn Bá Chinh, Dương Đình Trọng..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-emerald-500 font-medium"
                  />
                  <p className="text-[11px] text-emerald-600 mt-1 flex items-center gap-1 font-medium">
                    ✓ Tự động điền theo tài khoản của bạn. Bạn có thể sửa lại nếu muốn.
                  </p>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">
                    Số điện thoại có đăng ký Zalo
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Nhập số điện thoại để Host liên hệ Zalo..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-emerald-500 font-medium"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Host sẽ liên hệ qua Zalo số này khi bạn bấm tham gia kèo.
                  </p>
                </div>

                <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-sm">
                    {level}
                  </div>
                  <div className="text-xs">
                    <div className="font-bold text-emerald-900">Trình độ đã chốt: {level}</div>
                    <div className="text-emerald-700 mt-0.5">
                      Chơi được {experience} • {hasPlayedOthers ? 'Đã từng đi vãng lai' : 'Người mới đi vãng lai'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
            >
              Quay lại
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm"
            >
              Tiếp tục <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white font-bold text-xs shadow-md"
            >
              Bắt đầu tìm kèo ngay
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
