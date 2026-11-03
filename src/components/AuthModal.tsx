import React, { useState } from 'react';
import { X, Mail, Lock, User, Sparkles, AlertCircle, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';
import { supabase } from '../supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showResend, setShowResend] = useState(false);
  const [resendStatus, setResendStatus] = useState('');

  if (!isOpen) return null;

  const resetForm = () => {
    setErrorMsg('');
    setSuccessMsg('');
    setShowResend(false);
    setResendStatus('');
  };

  const translateAuthError = (errMessage: string): string => {
    const msg = (errMessage || '').toLowerCase();
    if (msg.includes('invalid login credentials')) {
      return 'Email hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại.';
    }
    if (msg.includes('email not confirmed')) {
      setShowResend(true);
      return 'Tài khoản chưa được kích hoạt qua email. Vui lòng kiểm tra hộp thư (hoặc thư mục Spam) để bấm xác nhận.';
    }
    if (msg.includes('user already registered') || msg.includes('already exists')) {
      return 'Email này đã được đăng ký tài khoản trước đó. Vui lòng chuyển sang tab Đăng Nhập.';
    }
    if (msg.includes('password should be at least 6 characters')) {
      return 'Mật khẩu phải có độ dài từ 6 ký tự trở lên.';
    }
    if (msg.includes('invalid format') || msg.includes('unable to validate email')) {
      return 'Định dạng địa chỉ Email không đúng chuẩn.';
    }
    if (msg.includes('too many requests')) {
      return 'Bạn đã thử quá nhiều lần. Vui lòng đợi 1-2 phút rồi thao tác lại.';
    }
    return errMessage;
  };

  // 1-Click Google Sign In
  const handleGoogleSignIn = async () => {
    try {
      setGoogleLoading(true);
      setErrorMsg('');
      setSuccessMsg('');
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setErrorMsg(translateAuthError(err.message || 'Không thể kết nối đến Google. Vui lòng thử lại.'));
      setGoogleLoading(false);
    }
  };

  // Handle Resend Confirmation Email
  const handleResendConfirmation = async () => {
    if (!email) {
      setErrorMsg('Vui lòng nhập email để gửi lại liên kết kích hoạt.');
      return;
    }
    try {
      setResendStatus('Đang gửi lại...');
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email.trim(),
      });
      if (error) throw error;
      setResendStatus('✓ Đã gửi lại email kích hoạt! Vui lòng kiểm tra hộp thư.');
    } catch (err: any) {
      setResendStatus('Không thể gửi lại email: ' + (err.message || 'Thử lại sau.'));
    }
  };

  // Email / Password Form Submit
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setShowResend(false);
    setResendStatus('');

    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      setErrorMsg('Vui lòng nhập đầy đủ Email và Mật khẩu.');
      return;
    }

    if (cleanPassword.length < 6) {
      setErrorMsg('Mật khẩu phải có tối thiểu 6 ký tự.');
      return;
    }

    if (isSignUp) {
      const cleanName = fullName.trim();
      if (!cleanName) {
        setErrorMsg('Vui lòng nhập Họ và tên hiển thị.');
        return;
      }
      if (cleanPassword !== confirmPassword.trim()) {
        setErrorMsg('Mật khẩu xác nhận không khớp. Vui lòng kiểm tra lại.');
        return;
      }

      try {
        setLoading(true);
        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password: cleanPassword,
          options: {
            data: {
              full_name: cleanName,
            },
          },
        });

        if (error) throw error;

        // If email confirmation is disabled on Supabase, session is created immediately
        if (data.session) {
          onClose();
        } else if (data.user) {
          // Email confirmation is required
          setSuccessMsg(
            `Đăng ký thành công! Một liên kết kích hoạt đã được gửi tới ${cleanEmail}. Vui lòng mở hộp thư (kiểm tra cả mục Thư rác/Spam) và bấm xác nhận để kích hoạt tài khoản.`
          );
          setIsSignUp(false);
        }
      } catch (err: any) {
        setErrorMsg(translateAuthError(err.message || 'Đã có lỗi xảy ra khi đăng ký.'));
      } finally {
        setLoading(false);
      }
    } else {
      // Sign In
      try {
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: cleanPassword,
        });

        if (error) throw error;
        onClose();
      } catch (err: any) {
        setErrorMsg(translateAuthError(err.message || 'Đăng nhập không thành công.'));
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-100 flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 p-6 text-white text-center relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="inline-flex items-center justify-center w-12 h-12 bg-white/15 rounded-2xl mb-2 backdrop-blur-md">
            <Sparkles className="w-6 h-6 text-yellow-300" />
          </div>
          <h2 className="text-xl font-bold">
            {isSignUp ? 'Đăng Ký Tài Khoản Mới' : 'Đăng Nhập Badminton Hub'}
          </h2>
          <p className="text-xs text-emerald-100 mt-1">
            Kết nối cộng đồng cầu lông, giữ slot vãng lai và giao lưu cùng Host
          </p>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Error Message */}
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
              <div className="flex-1">
                <span>{errorMsg}</span>
                {showResend && (
                  <div className="mt-2">
                    <button
                      type="button"
                      onClick={handleResendConfirmation}
                      className="text-xs font-bold text-emerald-700 underline hover:text-emerald-800 cursor-pointer"
                    >
                      Bấm vào đây để gửi lại email kích hoạt
                    </button>
                    {resendStatus && (
                      <div className="text-[11px] text-slate-600 mt-1">{resendStatus}</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Success Message */}
          {successMsg && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Primary Action: Google 1-Click Login */}
          <button
            type="button"
            disabled={googleLoading || loading}
            onClick={handleGoogleSignIn}
            className="w-full py-3 px-4 rounded-2xl border-2 border-slate-200 hover:border-emerald-500 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs sm:text-sm flex items-center justify-center gap-3 transition-all shadow-xs active:scale-98 cursor-pointer disabled:opacity-60"
          >
            {googleLoading ? (
              <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
            ) : (
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.15z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.36 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
            )}
            <span>Tiếp tục bằng tài khoản Google (Gmail)</span>
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-2">
            <div className="h-px bg-slate-200 flex-1" />
            <span className="text-[11px] text-slate-400 font-medium">hoặc dùng Email & Mật khẩu</span>
            <div className="h-px bg-slate-200 flex-1" />
          </div>

          {/* Email / Password Form */}
          <form onSubmit={handleEmailAuth} className="space-y-3">
            {/* Full Name only on Sign Up */}
            {isSignUp && (
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Họ và tên của bạn
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="VD: Nguyễn Bá Chinh, Dương Đình Trọng..."
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-emerald-500 font-medium"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Địa chỉ Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Mật khẩu</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Tối thiểu 6 ký tự"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-emerald-500"
                />
              </div>
            </div>

            {/* Confirm Password only on Sign Up */}
            {isSignUp && (
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Xác nhận lại mật khẩu
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Nhập lại mật khẩu ở trên"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-emerald-500"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || googleLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white font-bold text-xs shadow-md shadow-emerald-600/20 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Đang xử lý...</span>
                </>
              ) : (
                <>
                  <span>{isSignUp ? 'Đăng Ký Tài Khoản' : 'Đăng Nhập'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Switch Login / SignUp */}
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                resetForm();
              }}
              className="text-xs text-emerald-700 font-bold hover:underline cursor-pointer"
            >
              {isSignUp
                ? 'Đã có tài khoản? Bấm Đăng nhập'
                : 'Chưa có tài khoản? Bấm Đăng ký ngay'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
