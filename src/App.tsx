import { useState, useMemo, useEffect } from 'react';
import type { MatchPost, UserProfile } from './types';
import { INITIAL_USER, MOCK_MATCHES } from './mockData';
import { MatchCard } from './components/MatchCard';
import { MatchDetailModal } from './components/MatchDetailModal';
import { CreateMatchModal } from './components/CreateMatchModal';
import { OnboardingModal } from './components/OnboardingModal';
import { ProfileModal } from './components/ProfileModal';
import { supabase, toMatchPost, toDbRow, type DbMatchRow } from './supabase';
import {
  Search,
  Plus,
  Compass,
  CalendarCheck,
  User,
  Sparkles,
  Zap,
  Filter,
  CheckCircle2,
  Wifi,
} from 'lucide-react';

export default function App() {
  // Load user from localStorage or fallback
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('badminton_user');
      return saved ? JSON.parse(saved) : INITIAL_USER;
    } catch {
      return INITIAL_USER;
    }
  });

  const [matches, setMatches] = useState<MatchPost[]>(MOCK_MATCHES);
  const [selectedMatch, setSelectedMatch] = useState<MatchPost | null>(null);
  const [isConnectedToDb, setIsConnectedToDb] = useState(false);

  // Modals state
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Active Bottom Tab on mobile: 'feed' | 'my-matches' | 'profile'
  const [activeTab, setActiveTab] = useState<'feed' | 'my-matches' | 'profile'>('feed');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('Tất cả');
  const [selectedLevel, setSelectedLevel] = useState('Tất cả');
  const [selectedDate, setSelectedDate] = useState('Tất cả');
  const [onlyAvailableSlots, setOnlyAvailableSlots] = useState(false);

  const districts = ['Tất cả', 'Quận 10', 'Tân Bình', 'Gò Vấp', 'Bình Thạnh', 'Phú Nhuận', 'Quận 7', 'Thủ Đức'];
  const dates = ['Tất cả', 'Hôm nay', 'Ngày mai', 'Chủ Nhật'];
  const levels = ['Tất cả', 'Hợp trình của tôi', 'Newbie', 'Yếu', 'Trung Bình', 'Khá (Bán chuyên)'];

  // Save user profile to localStorage
  const handleSaveUser = (updated: UserProfile) => {
    setCurrentUser(updated);
    try {
      localStorage.setItem('badminton_user', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  // Seed mock matches to Supabase if table empty
  const seedMatchesToDb = async () => {
    try {
      const dbRows = MOCK_MATCHES.map(toDbRow);
      await supabase.from('matches').upsert(dbRows);
    } catch (e) {
      console.warn('Could not seed matches:', e);
    }
  };

  // Fetch matches from Supabase & Listen to Realtime changes
  useEffect(() => {
    let isMounted = true;

    const fetchMatches = async () => {
      try {
        const { data, error } = await supabase
          .from('matches')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          if (isMounted) {
            setMatches(data.map((r: any) => toMatchPost(r as DbMatchRow)));
            setIsConnectedToDb(true);
          }
        } else if (!error && data && data.length === 0) {
          await seedMatchesToDb();
          const { data: seeded } = await supabase
            .from('matches')
            .select('*')
            .order('created_at', { ascending: false });
          if (seeded && isMounted) {
            setMatches(seeded.map((r: any) => toMatchPost(r as DbMatchRow)));
            setIsConnectedToDb(true);
          }
        }
      } catch (err) {
        console.warn('Using local mock data:', err);
      }
    };

    fetchMatches();

    // Subscribe to Realtime postgres changes
    const channel = supabase
      .channel('matches_realtime_web')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'matches' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newMatch = toMatchPost(payload.new as DbMatchRow);
            setMatches((prev) => [newMatch, ...prev.filter((m) => m.id !== newMatch.id)]);
          } else if (payload.eventType === 'UPDATE') {
            const updated = toMatchPost(payload.new as DbMatchRow);
            setMatches((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
            setSelectedMatch((curr) => (curr?.id === updated.id ? updated : curr));
          } else if (payload.eventType === 'DELETE') {
            const deletedId = (payload.old as any).id;
            setMatches((prev) => prev.filter((m) => m.id !== deletedId));
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setIsConnectedToDb(true);
        }
      });

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  // Handle Instant Join / Leave (Syncs with Supabase)
  const handleToggleJoin = async (matchId: string) => {
    const targetMatch = matches.find((m) => m.id === matchId);
    if (!targetMatch) return;

    const alreadyJoined = targetMatch.joinedPlayers.some((p) => p.userId === currentUser.id);

    let updatedPlayers: any[];
    if (alreadyJoined) {
      updatedPlayers = targetMatch.joinedPlayers.filter((p) => p.userId !== currentUser.id);
    } else {
      if (targetMatch.joinedPlayers.length >= targetMatch.totalSlots) {
        alert('Kèo này vừa đủ người rồi!');
        return;
      }
      updatedPlayers = [
        ...targetMatch.joinedPlayers,
        {
          userId: currentUser.id,
          name: currentUser.name,
          avatar: currentUser.avatar,
          level: currentUser.level,
          phone: currentUser.phone,
          joinedAt: 'Vừa xong',
        },
      ];
    }

    // Optimistic UI update
    const updatedMatch = { ...targetMatch, joinedPlayers: updatedPlayers };
    setMatches((prev) => prev.map((m) => (m.id === matchId ? updatedMatch : m)));
    if (selectedMatch?.id === matchId) setSelectedMatch(updatedMatch);

    // Sync to Supabase
    try {
      await supabase
        .from('matches')
        .update({ joined_players: updatedPlayers })
        .eq('id', matchId);
    } catch (e) {
      console.error('Failed to sync join to Supabase:', e);
    }
  };

  // Host removes a player
  const handleRemovePlayer = async (matchId: string, playerId: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn hủy slot của người chơi này?')) return;

    const targetMatch = matches.find((m) => m.id === matchId);
    if (!targetMatch) return;

    const updatedPlayers = targetMatch.joinedPlayers.filter((p) => p.userId !== playerId);
    const updatedMatch = { ...targetMatch, joinedPlayers: updatedPlayers };

    setMatches((prev) => prev.map((m) => (m.id === matchId ? updatedMatch : m)));
    if (selectedMatch?.id === matchId) setSelectedMatch(updatedMatch);

    try {
      await supabase
        .from('matches')
        .update({ joined_players: updatedPlayers })
        .eq('id', matchId);
    } catch (e) {
      console.error('Failed to sync remove to Supabase:', e);
    }
  };

  // Create match (Syncs to Supabase)
  const handleCreateMatch = async (newMatch: MatchPost) => {
    setMatches((prev) => [newMatch, ...prev]);
    setSelectedMatch(newMatch);
    setIsDetailOpen(true);

    try {
      await supabase.from('matches').insert(toDbRow(newMatch));
    } catch (e) {
      console.error('Failed to create match on Supabase:', e);
    }
  };

  // Filtered matches
  const filteredMatches = useMemo(() => {
    return matches.filter((m) => {
      if (activeTab === 'my-matches') {
        const isJoined = m.joinedPlayers.some((p) => p.userId === currentUser.id);
        if (!isJoined) return false;
      }

      if (selectedDistrict !== 'Tất cả' && m.district !== selectedDistrict) {
        return false;
      }

      if (selectedDate !== 'Tất cả' && !m.date.includes(selectedDate)) {
        return false;
      }

      if (onlyAvailableSlots) {
        if (m.joinedPlayers.length >= m.totalSlots) return false;
      }

      if (selectedLevel === 'Hợp trình của tôi') {
        // Simple match with current user level
      } else if (selectedLevel !== 'Tất cả') {
        const matchesLevel =
          m.minLevel.includes(selectedLevel) ||
          m.maxLevel.includes(selectedLevel) ||
          (selectedLevel === 'Trung Bình' && (m.minLevel.includes('TB') || m.maxLevel.includes('TB')));
        if (!matchesLevel) return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = m.title.toLowerCase().includes(q);
        const matchCourt = m.courtName.toLowerCase().includes(q);
        const matchDist = m.district.toLowerCase().includes(q);
        if (!matchTitle && !matchCourt && !matchDist) return false;
      }

      return true;
    });
  }, [matches, activeTab, selectedDistrict, selectedDate, selectedLevel, onlyAvailableSlots, searchQuery, currentUser]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans antialiased selection:bg-emerald-500 selection:text-white">
      {/* ================= DESKTOP & MOBILE RESPONSIVE TOPBAR ================= */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 text-xl sm:text-2xl font-black">
                🏸
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-lg sm:text-2xl tracking-tight text-slate-900 leading-none">
                    TimVangLai<span className="text-emerald-600">.io.vn</span>
                  </span>
                  {isConnectedToDb && (
                    <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                      <Wifi className="w-3 h-3 text-emerald-500" /> Realtime
                    </span>
                  )}
                </div>
                <p className="text-[11px] sm:text-xs text-slate-500 font-medium hidden sm:block mt-0.5">
                  Cộng đồng kết nối kèo & tuyển vãng lai cầu lông Việt Nam
                </p>
              </div>
            </div>

            {/* Desktop Center Search */}
            <div className="hidden md:flex flex-1 max-w-md mx-4">
              <div className="relative w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm sân cầu, quận huyện (VD: Viettel, Kỳ Hòa, Tân Bình...)"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-100/80 border border-slate-200 focus:border-emerald-500 focus:bg-white text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Desktop Actions + Profile */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              <button
                type="button"
                onClick={() => setIsCreateOpen(true)}
                className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 active:scale-95 transition-all"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                Host Đăng Kèo Mới
              </button>

              {/* User Profile Pill */}
              <button
                type="button"
                onClick={() => setIsProfileOpen(true)}
                className="flex items-center gap-2.5 p-1 sm:p-1.5 sm:pl-3 rounded-full bg-slate-100 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 transition-all cursor-pointer"
              >
                <div className="text-right hidden sm:block">
                  <div className="text-xs font-bold text-slate-800 leading-tight">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] font-extrabold text-emerald-700 uppercase">
                    Trình: {currentUser.level}
                  </div>
                </div>
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover border border-slate-300 shadow-2xs"
                />
              </button>
            </div>
          </div>

          {/* Mobile search input */}
          <div className="md:hidden pb-3">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm sân cầu, quận (VD: Viettel, Kỳ Hòa, Q.10...)"
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-100 border border-slate-200 focus:border-emerald-500 focus:bg-white text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </header>

      {/* ================= HERO BANNER FOR WEBSITE ================= */}
      <section className="bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 text-white py-6 sm:py-10 border-b border-emerald-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="max-w-2xl space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold">
                <Zap className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                Giải pháp ghép kèo cầu lông #1 Việt Nam
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                Không lo thiếu người – <span className="text-emerald-400">Tuyển vãng lai tức thì</span>
              </h2>
              <p className="text-xs sm:text-base text-slate-300 leading-relaxed">
                Thay thế các bài đăng Facebook bị trôi và spam. Tìm sân gần nhà, biết chính xác số slot trống, đúng trình độ và kết nối Zalo với Host chỉ trong 1 chạm.
              </p>
            </div>

            {/* Quick stats on Web */}
            <div className="flex items-center gap-3 sm:gap-6 shrink-0 bg-white/10 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/10">
              <div className="text-center px-2 sm:px-4">
                <div className="text-xl sm:text-3xl font-black text-white">{matches.length}</div>
                <div className="text-[11px] sm:text-xs text-emerald-200 font-medium">Kèo mở tuyển</div>
              </div>
              <div className="w-px h-10 bg-white/20" />
              <div className="text-center px-2 sm:px-4">
                <div className="text-xl sm:text-3xl font-black text-emerald-400">1-Chạm</div>
                <div className="text-[11px] sm:text-xs text-emerald-200 font-medium">Vào slot ngay</div>
              </div>
              <div className="w-px h-10 bg-white/20" />
              <div className="text-center px-2 sm:px-4">
                <div className="text-xl sm:text-3xl font-black text-yellow-300">5 Cấp</div>
                <div className="text-[11px] sm:text-xs text-emerald-200 font-medium">Chuẩn phân trình</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= MAIN CONTENT (TWO-COLUMN WEB LAYOUT) ================= */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8 items-start">
          {/* ================= LEFT SIDEBAR: FILTERS ON DESKTOP ================= */}
          <aside className="lg:col-span-1 space-y-5 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Filter className="w-4 h-4 text-emerald-600" />
                Bộ lọc tìm kiếm
              </h3>
              <button
                type="button"
                onClick={() => {
                  setSelectedDistrict('Tất cả');
                  setSelectedLevel('Tất cả');
                  setSelectedDate('Tất cả');
                  setOnlyAvailableSlots(false);
                  setSearchQuery('');
                }}
                className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-700"
              >
                Đặt lại
              </button>
            </div>

            {/* Filter by District */}
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                Khu vực (Quận / Huyện)
              </label>
              <div className="flex flex-wrap gap-1.5">
                {districts.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setSelectedDistrict(d)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                      selectedDistrict === d
                        ? 'bg-emerald-600 text-white font-bold shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter by Date */}
            <div className="pt-3 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                Thời gian đánh
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {dates.map((dt) => (
                  <button
                    key={dt}
                    type="button"
                    onClick={() => setSelectedDate(dt)}
                    className={`px-3 py-2 rounded-xl text-xs font-medium text-center transition-all ${
                      selectedDate === dt
                        ? 'bg-teal-600 text-white font-bold shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {dt}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter by Skill Level */}
            <div className="pt-3 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                Trình độ yêu cầu
              </label>
              <div className="space-y-1">
                {levels.map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setSelectedLevel(lvl)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-between ${
                      selectedLevel === lvl
                        ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200'
                        : 'hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <span>{lvl}</span>
                    {selectedLevel === lvl && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Only Available Slots checkbox */}
            <div className="pt-3 border-t border-slate-100">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={onlyAvailableSlots}
                  onChange={(e) => setOnlyAvailableSlots(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
                Chỉ hiện kèo còn slot trống
              </label>
            </div>

            {/* Quick guide card on left */}
            <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/60 text-xs space-y-1.5">
              <div className="font-bold text-amber-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-600" />
                Văn hóa đi vãng lai
              </div>
              <p className="text-amber-800 leading-relaxed text-[11px]">
                Đăng ký đúng trình độ, có mặt trước 5-10 phút để khởi động và chào hỏi Host vui vẻ nhé!
              </p>
            </div>
          </aside>

          {/* ================= RIGHT MAIN AREA: MATCHES GRID ================= */}
          <div className="lg:col-span-3 space-y-5">
            {/* Header toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base sm:text-lg flex items-center gap-2">
                  Danh sách kèo tuyển vãng lai
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                    {filteredMatches.length} kèo
                  </span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Bấm vào thẻ bất kỳ để xem danh sách thành viên hoặc liên hệ Zalo Host
                </p>
              </div>

              {/* View switch button on mobile */}
              <button
                type="button"
                onClick={() => setIsCreateOpen(true)}
                className="sm:hidden w-full py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Đăng Kèo Mới
              </button>
            </div>

            {/* Grid of Matches */}
            {filteredMatches.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs">
                <div className="text-4xl mb-3">🏸</div>
                <h4 className="text-base font-bold text-slate-800">Không tìm thấy kèo phù hợp</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Bạn có thể thử chọn "Tất cả quận" hoặc tự mình đứng ra làm Host đăng một kèo mới!
                </p>
                <div className="mt-4 flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedDistrict('Tất cả');
                      setSelectedLevel('Tất cả');
                      setSelectedDate('Tất cả');
                      setOnlyAvailableSlots(false);
                      setSearchQuery('');
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700"
                  >
                    Xóa bộ lọc
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsCreateOpen(true)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
                  >
                    + Đăng kèo ngay
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4">
                {filteredMatches.map((m) => (
                  <MatchCard
                    key={m.id}
                    match={m}
                    currentUser={currentUser}
                    onJoin={handleToggleJoin}
                    onSelect={(match) => {
                      setSelectedMatch(match);
                      setIsDetailOpen(true);
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ================= DESKTOP FOOTER ================= */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-900 text-sm">TimVangLai.io.vn</span>
            <span>•</span>
            <span>Ứng dụng kết nối cộng đồng cầu lông phong trào Việt Nam</span>
          </div>
          <div className="flex items-center gap-4 text-slate-600">
            <span>Sân cầu TP.HCM</span>
            <span>•</span>
            <span>Phân trình tự động</span>
            <span>•</span>
            <span>Kết nối Zalo Host</span>
          </div>
        </div>
      </footer>

      {/* ================= MOBILE BOTTOM NAVIGATION (HIDDEN ON DESKTOP) ================= */}
      <nav className="sm:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-200 px-6 py-2 flex items-center justify-around z-30 shadow-lg">
        <button
          type="button"
          onClick={() => setActiveTab('feed')}
          className={`flex flex-col items-center gap-1 transition-all ${
            activeTab === 'feed' ? 'text-emerald-600 font-bold' : 'text-slate-400'
          }`}
        >
          <Compass className="w-5 h-5" />
          <span className="text-[10px]">Khám phá</span>
        </button>

        <button
          type="button"
          onClick={() => setIsCreateOpen(true)}
          className="flex flex-col items-center -mt-6 group"
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-lg shadow-emerald-600/30 active:scale-95 transition-all">
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </div>
          <span className="text-[10px] font-bold text-emerald-700 mt-0.5">Đăng kèo</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('my-matches')}
          className={`flex flex-col items-center gap-1 transition-all ${
            activeTab === 'my-matches' ? 'text-emerald-600 font-bold' : 'text-slate-400'
          }`}
        >
          <CalendarCheck className="w-5 h-5" />
          <span className="text-[10px]">Kèo của tôi</span>
        </button>

        <button
          type="button"
          onClick={() => setIsProfileOpen(true)}
          className="flex flex-col items-center gap-1 text-slate-400"
        >
          <User className="w-5 h-5" />
          <span className="text-[10px]">Cá nhân</span>
        </button>
      </nav>

      {/* ================= MODALS ================= */}
      <MatchDetailModal
        match={selectedMatch}
        currentUser={currentUser}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onToggleJoin={handleToggleJoin}
        onRemovePlayer={handleRemovePlayer}
      />

      <CreateMatchModal
        isOpen={isCreateOpen}
        currentUser={currentUser}
        onClose={() => setIsCreateOpen(false)}
        onCreate={handleCreateMatch}
      />

      <OnboardingModal
        isOpen={isOnboardingOpen}
        user={currentUser}
        onSave={(updated) => {
          handleSaveUser(updated);
          setIsOnboardingOpen(false);
        }}
        onClose={() => setIsOnboardingOpen(false)}
      />

      <ProfileModal
        isOpen={isProfileOpen}
        user={currentUser}
        matches={matches}
        onClose={() => setIsProfileOpen(false)}
        onRetakeSurvey={() => {
          setIsProfileOpen(false);
          setIsOnboardingOpen(true);
        }}
        onSelectMatch={(match) => {
          setSelectedMatch(match);
          setIsDetailOpen(true);
        }}
      />
    </div>
  );
}
