import React, { useState, useEffect, useRef } from 'react';
import type { MatchPost, UserProfile } from '../types';
import {
  X,
  Send,
  Sparkles,
  User,
  Clock,
  ChevronRight,
  ArrowRight,
  Settings,
  Trash2,
  Key,
  Flame,
  Award,
} from 'lucide-react';
import { BadmintonMascotBot } from './BadmintonMascotBot';
import {
  type ChatMessage,
  sendChatMessageToAI,
  getStoredGeminiKey,
  setStoredGeminiKey,
} from '../services/aiChatService';
import { getDefaultCourtImage } from '../supabase';

interface AIChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  matches: MatchPost[];
  currentUser: UserProfile;
  session: any;
  onOpenAuth: () => void;
  onSelectMatch: (match: MatchPost) => void;
  onPrefillCreateMatch: (draft: Partial<MatchPost>) => void;
}

const INITIAL_WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome',
  sender: 'assistant',
  text: `🏸 **Hế lô bạn! Mình là Bé Cầu AI đây!**\n\nMình là trợ lý cầu lông phong trào siêu thân thiện của bạn. Cần gì cứ nói với mình nha:\n\n1. 🔍 **Tìm kèo thông minh:** *"Tìm kèo Tân Bình tối nay 19h-21h trình TB Yếu"*\n2. 📝 **Trợ lý soạn bài cho Host:** Cứ dán đoạn tin nhắn nháp từ Facebook/Zalo vào đây, mình tự bóc tách và điền thẳng vào Form Tạo Kèo cho bạn!\n3. 🎯 **Thẩm định trình độ:** Kể cho mình nghe bạn chơi bao lâu, đánh phông, đập, thủ thế nào... mình chấm điểm theo thang 10 bậc chuẩn Việt Nam liền!\n\nBạn muốn tìm kèo hay cần mình phụ việc gì trước nè?`,
  timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
  quickPrompts: [
    '🏸 Tìm kèo tối nay gần tui',
    '📝 Dán bài Zalo tui soạn cho',
    '🎯 Test xem tui trình gì nha',
    '⚡ Kèo hợp trình của tôi',
  ],
};

export const AIChatModal: React.FC<AIChatModalProps> = ({
  isOpen,
  onClose,
  matches,
  currentUser,
  session,
  onOpenAuth,
  onSelectMatch,
  onPrefillCreateMatch,
}) => {
  const isLoggedIn = !!session && currentUser?.id && currentUser.id !== 'guest' && !!currentUser.name;
  const userStorageKey = isLoggedIn ? `timvanglai_chat_history_${currentUser.id}` : null;

  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_WELCOME_MESSAGE]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [streamingMsgId, setStreamingMsgId] = useState<string | null>(null);
  const streamTimerRef = useRef<any>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(() => getStoredGeminiKey());
  const [keySavedToast, setKeySavedToast] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Clear timer on unmount
  useEffect(() => {
    return () => {
      if (streamTimerRef.current) {
        clearInterval(streamTimerRef.current);
      }
    };
  }, []);

  // Sync messages when user logs in, logs out, or switches accounts
  useEffect(() => {
    if (!userStorageKey) {
      setMessages([INITIAL_WELCOME_MESSAGE]);
      return;
    }
    try {
      const saved = sessionStorage.getItem(userStorageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
          return;
        }
      }
    } catch {}
    setMessages([INITIAL_WELCOME_MESSAGE]);
  }, [userStorageKey]);

  // Persist messages to user-specific sessionStorage key (only when not streaming)
  useEffect(() => {
    if (userStorageKey && !streamingMsgId && !isTyping) {
      try {
        sessionStorage.setItem(userStorageKey, JSON.stringify(messages));
      } catch {}
    }
  }, [messages, userStorageKey, streamingMsgId, isTyping]);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && isLoggedIn) {
      setTimeout(() => {
        scrollToBottom();
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, isLoggedIn, messages, isTyping, streamingMsgId]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isTyping || streamingMsgId !== null) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      const startTime = Date.now();
      const response = await sendChatMessageToAI(text, messages, matches);

      // 1. Giả lập độ trễ suy nghĩ tự nhiên (~850ms - 1000ms) để hiện Mascot Thinking
      const elapsed = Date.now() - startTime;
      const minThinkingDelay = 850;
      if (elapsed < minThinkingDelay) {
        await new Promise((resolve) => setTimeout(resolve, minThinkingDelay - elapsed));
      }

      // 2. Chuyển sang hiệu ứng gõ chữ (Typewriter Streaming)
      setIsTyping(false);

      const assistantMsgId = (Date.now() + 1).toString();
      setStreamingMsgId(assistantMsgId);

      // Thêm message ban đầu với text rỗng
      const initialAssistantMsg: ChatMessage = {
        id: assistantMsgId,
        sender: 'assistant',
        text: '',
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, initialAssistantMsg]);

      // Tốc độ typewriter: chunk 2-4 ký tự mỗi 18ms
      const fullText = response.text;
      let charIndex = 0;
      const chunkSize = fullText.length > 350 ? 5 : fullText.length > 150 ? 3 : 2;
      const intervalMs = 18;

      await new Promise<void>((resolve) => {
        streamTimerRef.current = setInterval(() => {
          charIndex += chunkSize;
          if (charIndex >= fullText.length) {
            clearInterval(streamTimerRef.current);
            streamTimerRef.current = null;
            // Hoàn tất: Gán đủ text và gắn các action payload (kèo, nháp, prompt)
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantMsgId
                  ? {
                      ...m,
                      text: fullText,
                      matches: response.matches,
                      draftMatch: response.draftMatch,
                      suggestedLevel: response.suggestedLevel,
                      quickPrompts: response.quickPrompts,
                    }
                  : m
              )
            );
            setStreamingMsgId(null);
            resolve();
          } else {
            const partialText = fullText.slice(0, charIndex);
            setMessages((prev) =>
              prev.map((m) => (m.id === assistantMsgId ? { ...m, text: partialText } : m))
            );
            scrollToBottom();
          }
        }, intervalMs);
      });
    } catch (err) {
      console.error('Chat error:', err);
      setIsTyping(false);
      setStreamingMsgId(null);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          text: 'Xin lỗi bạn, kết nối đang bị gián đoạn đôi chút. Bạn thử gửi lại câu hỏi nhé!',
          timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  };

  const handleClearHistory = () => {
    if (window.confirm('Bạn có chắc chắn muốn xoá toàn bộ lịch sử trò chuyện với AI không?')) {
      setMessages([INITIAL_WELCOME_MESSAGE]);
      if (userStorageKey) {
        try {
          sessionStorage.removeItem(userStorageKey);
        } catch {}
      }
      try {
        sessionStorage.removeItem('timvanglai_chat_history');
      } catch {}
    }
  };

  const handleSaveApiKey = () => {
    setStoredGeminiKey(apiKeyInput);
    setKeySavedToast(true);
    setTimeout(() => {
      setKeySavedToast(false);
      setShowSettings(false);
    }, 1200);
  };

  const handleApplyDraft = (draft: Partial<MatchPost>) => {
    onPrefillCreateMatch(draft);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200">
      {/* Main Container */}
      <div className="w-full sm:max-w-xl h-[88vh] sm:h-[680px] bg-white sm:rounded-3xl rounded-t-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-100 animate-in slide-in-from-bottom duration-300">
        
        {/* Chat Header */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 px-4 py-3 sm:px-5 sm:py-3.5 flex items-center justify-between text-white shrink-0 shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-inner overflow-hidden p-0.5">
                <BadmintonMascotBot size="sm" isAnimated={true} />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-emerald-700 rounded-full animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-extrabold text-base tracking-tight leading-tight flex items-center gap-1">
                  <span>Bé Cầu AI</span>
                  <span className="text-amber-300 text-xs">🏸</span>
                </h3>
                <span className="px-1.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-100 text-[10px] font-bold uppercase tracking-wider border border-emerald-300/30">
                  Online 24/7
                </span>
              </div>
              <p className="text-xs text-emerald-100/90 font-medium leading-tight">
                Trợ lý Cầu Lông siêu dễ thương • Sẵn sàng hỗ trợ
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-1.5">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 rounded-xl text-emerald-100 hover:text-white hover:bg-white/10 transition-colors"
              title="Cài đặt API Key"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              onClick={handleClearHistory}
              className="p-2 rounded-xl text-emerald-100 hover:text-white hover:bg-white/10 transition-colors"
              title="Xoá lịch sử chat"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-emerald-100 hover:text-white hover:bg-white/20 transition-colors ml-1"
              title="Đóng"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* API Settings Panel (Expandable) */}
        {showSettings && (
          <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 shrink-0 animate-in slide-in-from-top duration-200 text-xs">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-emerald-600" /> Cài đặt Gemini AI API Key
              </span>
              <span className="text-[10px] text-slate-500">Mặc định: Hybrid Built-in NLP</span>
            </div>
            <p className="text-slate-600 mb-2 leading-relaxed text-[11px]">
              Hệ thống đã tích hợp sẵn <strong>Engine NLP Cầu Lông chuyên sâu chạy trực tiếp</strong> không tốn phí. Nếu muốn trải nghiệm mô hình ngôn ngữ lớn Google Gemini 1.5/2.0 Flash của riêng bạn, hãy dán API Key vào đây:
            </p>
            <div className="flex gap-2">
              <input
                type="password"
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                placeholder="AIzaSy... (Để trống để dùng Engine NLP miễn phí)"
                className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs focus:outline-emerald-500"
              />
              <button
                onClick={handleSaveApiKey}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-xs transition-colors shrink-0"
              >
                {keySavedToast ? 'Đã lưu ✓' : 'Lưu Key'}
              </button>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        {!isLoggedIn ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-emerald-50/40 via-white to-slate-50">
            <div className="mb-4 transform hover:scale-105 transition-transform">
              <BadmintonMascotBot size="xl" expression="thinking" isAnimated={true} />
            </div>
            <h4 className="text-base font-extrabold text-slate-900 mb-1.5 flex items-center gap-1.5 justify-center">
              <span>Hế lô bạn! Đăng nhập để chơi cùng Bé Cầu nha! 🏸</span>
            </h4>
            <p className="text-xs text-slate-500 mb-6 max-w-xs leading-relaxed">
              Bé Cầu AI sẽ giúp bạn tìm kèo chuẩn trình độ, bóc tách bài Zalo trong 1 giây và bảo mật lịch sử chat của riêng bạn.
            </p>
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenAuth();
              }}
              className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-xl shadow-emerald-700/25 active:scale-95 transition-all cursor-pointer flex items-center gap-2 hover:scale-105"
            >
              <User className="w-4 h-4" />
              <span>Đăng nhập / Đăng ký ngay</span>
            </button>
          </div>
        ) : (
          <>
            {/* Chat Messages Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-slate-50/50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'assistant' && (
                <div className="shrink-0 -mt-0.5">
                  <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-200/80 flex items-center justify-center shadow-xs overflow-hidden">
                    <BadmintonMascotBot size="xs" isAnimated={false} />
                  </div>
                </div>
              )}

              <div
                className={`max-w-[88%] sm:max-w-[80%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-emerald-600 text-white rounded-br-none'
                    : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'
                }`}
              >
                {/* Message Text with simple Markdown formatting */}
                <div className="whitespace-pre-line space-y-1">
                  {msg.text.split('\n').map((line, idx) => {
                    // Bold styling
                    const formatted = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                    return (
                      <p
                        key={idx}
                        className={line.startsWith('•') || line.startsWith('-') ? 'pl-2' : ''}
                        dangerouslySetInnerHTML={{ __html: formatted }}
                      />
                    );
                  })}
                  {streamingMsgId === msg.id && (
                    <span className="inline-block w-1.5 h-3.5 bg-emerald-600 ml-1 translate-y-0.5 animate-pulse rounded-xs" />
                  )}
                </div>

                {/* SUGGESTED LEVEL BADGE */}
                {msg.suggestedLevel && (
                  <div className="mt-3 p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                      <Award className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider">
                        Đánh giá trình độ phù hợp
                      </div>
                      <div className="text-base font-black text-emerald-950">
                        {msg.suggestedLevel}
                      </div>
                    </div>
                  </div>
                )}

                {/* DRAFT MATCH PREVIEW (POST PARSER ACTION) */}
                {msg.draftMatch && (
                  <div className="mt-3.5 bg-slate-50 border border-emerald-200 rounded-2xl p-3 sm:p-3.5 text-xs text-slate-700 space-y-2 shadow-inner">
                    <div className="flex items-center justify-between pb-1.5 border-b border-slate-200/80">
                      <span className="font-bold text-emerald-800 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Bản nháp bài đăng tự động
                      </span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
                        Sẵn sàng điền form
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <span className="text-slate-400 block">Sân thi đấu:</span>
                        <strong className="text-slate-900 truncate block">
                          {msg.draftMatch.courtName}
                        </strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Khu vực:</span>
                        <strong className="text-slate-900 block">{msg.draftMatch.district}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Thời gian:</span>
                        <strong className="text-slate-900 block">
                          {msg.draftMatch.startTime} - {msg.draftMatch.endTime} ({msg.draftMatch.date})
                        </strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Cầu sử dụng:</span>
                        <strong className="text-slate-900 block truncate">
                          {msg.draftMatch.shuttleType}
                        </strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Chi phí:</span>
                        <strong className="text-emerald-700 block">
                          Nam {msg.draftMatch.priceMale?.toLocaleString('vi-VN')}đ | Nữ{' '}
                          {msg.draftMatch.priceFemale?.toLocaleString('vi-VN')}đ
                        </strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Trình độ:</span>
                        <strong className="text-slate-900 block">
                          {msg.draftMatch.minLevel} ➔ {msg.draftMatch.maxLevel}
                        </strong>
                      </div>
                    </div>

                    {/* Action Button: Prefill & Open CreateMatchModal */}
                    <button
                      onClick={() => handleApplyDraft(msg.draftMatch!)}
                      className="w-full mt-2 py-2.5 px-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-xs"
                    >
                      <span>🚀 Mở Form & Điền Thông Tin Ngay</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* MATCH CARDS LIST (SEARCH RESULTS) */}
                {msg.matches && msg.matches.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-amber-500" /> Kèo phù hợp trong hệ thống:
                    </div>
                    {msg.matches.map((m) => {
                      const joinedCount = m.joinedPlayers ? m.joinedPlayers.length : 0;
                      const remaining = Math.max(0, m.totalSlots - joinedCount);
                      const courtImg = m.coverImage || getDefaultCourtImage(m.district);

                      return (
                        <div
                          key={m.id}
                          className="bg-white border border-slate-200 hover:border-emerald-400 rounded-xl p-2.5 flex items-center gap-3 transition-all hover:shadow-md cursor-pointer group"
                          onClick={() => {
                            onSelectMatch(m);
                            onClose();
                          }}
                        >
                          <img
                            src={courtImg}
                            alt={m.courtName}
                            className="w-14 h-14 rounded-lg object-cover shrink-0 border border-slate-100"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-xs text-slate-900 truncate group-hover:text-emerald-700 transition-colors">
                              {m.courtName}
                            </h4>
                            <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3 text-slate-400" />
                                {m.startTime}-{m.endTime} ({m.date})
                              </span>
                              <span>•</span>
                              <span className="text-emerald-700 font-semibold">{m.district}</span>
                            </div>
                            <div className="flex items-center justify-between mt-1 text-[11px]">
                              <span className="font-bold text-emerald-600">
                                {m.priceMale.toLocaleString('vi-VN')}đ
                              </span>
                              <span
                                className={`font-semibold px-1.5 py-0.2 rounded text-[10px] ${
                                  remaining > 0
                                    ? 'bg-emerald-50 text-emerald-700'
                                    : 'bg-rose-50 text-rose-600'
                                }`}
                              >
                                {remaining > 0 ? `Còn ${remaining} slot` : 'Hết chỗ'}
                              </span>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all shrink-0" />
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Quick prompts suggested by this turn */}
                {msg.quickPrompts && msg.quickPrompts.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-slate-100 flex flex-wrap gap-1.5">
                    {msg.quickPrompts.map((prompt, pIdx) => (
                      <button
                        key={pIdx}
                        onClick={() => handleSendMessage(prompt)}
                        className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 text-slate-600 text-[11px] font-medium border border-slate-200 transition-all text-left"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                )}

                <div
                  className={`text-[9px] mt-1.5 text-right ${
                    msg.sender === 'user' ? 'text-emerald-200' : 'text-slate-400'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>

              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-slate-200 flex items-center justify-center text-slate-600 shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {/* Typing / Thinking animation */}
          {isTyping && (
            <div className="flex gap-2.5 items-end animate-in fade-in duration-200">
              <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-200/80 flex items-center justify-center shadow-xs overflow-hidden shrink-0">
                <BadmintonMascotBot size="xs" expression="thinking" isAnimated={true} />
              </div>
              <div className="bg-white border border-emerald-100 rounded-2xl rounded-bl-none px-4 py-2.5 shadow-xs flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="text-[11px] text-emerald-800 font-bold ml-1">Bé Cầu đang suy nghĩ nè...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips Bar */}
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0 text-xs">
          <span className="text-[11px] text-emerald-700 font-bold shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" /> Bé Cầu gợi ý:
          </span>
          <button
            disabled={isTyping || streamingMsgId !== null}
            onClick={() => handleSendMessage('Tìm kèo tối nay gần tui trình TB Yếu')}
            className="px-2.5 py-1 rounded-full bg-white hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 font-medium border border-slate-200 hover:border-emerald-300 transition-all shrink-0 text-[11px] shadow-xs active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            🏸 Kèo tối nay
          </button>
          <button
            disabled={isTyping || streamingMsgId !== null}
            onClick={() =>
              handleSendMessage(
                'Tuyển 2 nam tối nay sân Minkyo Tân Phú 19h-21h, cầu VinaStar Đỏ, giá 60k nam 40k nữ, cọc 20k'
              )
            }
            className="px-2.5 py-1 rounded-full bg-white hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 font-medium border border-slate-200 hover:border-emerald-300 transition-all shrink-0 text-[11px] shadow-xs active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            📝 Thử bóc bài Zalo
          </button>
          <button
            disabled={isTyping || streamingMsgId !== null}
            onClick={() =>
              handleSendMessage('Mình mới chơi được 1 năm, biết đập nhưng thủ còn yếu thì là trình gì?')
            }
            className="px-2.5 py-1 rounded-full bg-white hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 font-medium border border-slate-200 hover:border-emerald-300 transition-all shrink-0 text-[11px] shadow-xs active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            🎯 Đo trình độ
          </button>
          <button
            disabled={isTyping || streamingMsgId !== null}
            onClick={() => handleSendMessage('Giải thích luật giao cầu dưới 1.15m và cách tính điểm')}
            className="px-2.5 py-1 rounded-full bg-white hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 font-medium border border-slate-200 hover:border-emerald-300 transition-all shrink-0 text-[11px] shadow-xs active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ⚖️ Luật giao cầu
          </button>
        </div>

        {/* Chat Input Bar */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-100 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Nói với Bé Cầu: tìm kèo, quăng bài Zalo, hoặc hỏi luật nha..."
              disabled={isTyping || streamingMsgId !== null}
              className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-100/80 focus:bg-white border border-transparent focus:border-emerald-500 text-xs sm:text-sm focus:outline-none transition-all placeholder:text-slate-400 font-medium disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isTyping || streamingMsgId !== null}
              className="w-10 h-10 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white flex items-center justify-center shrink-0 shadow-md hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </>
    )}
  </div>
</div>
  );
};
