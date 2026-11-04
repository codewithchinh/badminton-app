import { useState, useMemo, useEffect } from 'react';
import type { MatchPost, UserProfile } from './types';
import { INITIAL_USER, MOCK_MATCHES } from './mockData';
import { MatchCard } from './components/MatchCard';
import { MatchDetailModal } from './components/MatchDetailModal';
import { CreateMatchModal } from './components/CreateMatchModal';
import { OnboardingModal } from './components/OnboardingModal';
import { ProfileModal } from './components/ProfileModal';
import { AuthModal } from './components/AuthModal';
import { ResetPasswordModal } from './components/ResetPasswordModal';
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
  LogIn,
  LogOut,
  AlertTriangle,
  X,
} from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile>(INITIAL_USER);
  const [session, setSession] = useState<any>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const [matches, setMatches] = useState<MatchPost[]>(MOCK_MATCHES);
  const [selectedMatch, setSelectedMatch] = useState<MatchPost | null>(null);
  const [isConnectedToDb, setIsConnectedToDb] = useState(false);

  // Modals state
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);

  // Active Bottom Tab on mobile: 'feed' | 'my-matches' | 'profile'
  const [activeTab, setActiveTab] = useState<'feed' | 'my-matches' | 'profile'>('feed');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('Tất cả');
  const [selectedLevel, setSelectedLevel] = useState('Tất cả');
  const [selectedDate, setSelectedDate] = useState('Tất cả');
  const [onlyAvailableSlots, setOnlyAvailableSlots] = useState(false);

  const districts = ['Tất cả', 'Tân Phú', 'Bình Tân', 'Tân Bình', 'Thủ Đức', 'Quận 2', 'Quận 7', 'Quận 10', 'Gò Vấp', 'Bình Thạnh', 'Phú Nhuận'];
  const dates = ['Tất cả', 'Hôm nay', 'Ngày mai', 'Chủ Nhật'];
  const levels = ['Tất cả', 'Hợp trình của tôi', 'Newbie', 'Yếu', 'Trung Bình', 'Khá (Bán chuyên)'];

  // Count active filters
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedDistrict !== 'Tất cả') count++;
    if (selectedLevel !== 'Tất cả') count++;
    if (selectedDate !== 'Tất cả') count++;
    if (onlyAvailableSlots) count++;
    return count;
  }, [selectedDistrict, selectedLevel, selectedDate, onlyAvailableSlots]);

  // Reset all filters
  const handleResetFilters = () => {
    setSelectedDistrict('Tất cả');
    setSelectedLevel('Tất cả');
    setSelectedDate('Tất cả');
    setOnlyAvailableSlots(false);
    setSearchQuery('');
  };

  // ================= BROWSER HISTORY & MOBILE HARDWARE BACK NAVIGATION =================
  const openModalWithHash = (hash: string, stateObj: any = {}) => {
    if (window.location.hash !== hash) {
      window.history.pushState({ ...stateObj, modalHash: hash }, '', hash);
    }
  };

  const closeModalWithHash = (hash: string, closeAction: () => void) => {
    if (window.location.hash === hash || window.location.hash.startsWith(hash)) {
      window.history.back();
    } else {
      closeAction();
    }
  };

  const handleOpenMatchDetail = (match: MatchPost) => {
    setSelectedMatch(match);
    setIsDetailOpen(true);
    openModalWithHash(`#match-${match.id}`, { modal: 'match-detail', matchId: match.id });
  };

  const handleCloseMatchDetail = () => {
    closeModalWithHash('#match-', () => {
      setIsDetailOpen(false);
      setSelectedMatch(null);
    });
  };

  const handleOpenCreateMatch = () => {
    if (!session) {
      handleOpenAuth();
    } else {
      setIsCreateOpen(true);
      openModalWithHash('#create', { modal: 'create-match' });
    }
  };

  const handleCloseCreateMatch = () => {
    closeModalWithHash('#create', () => setIsCreateOpen(false));
  };

  const handleOpenMobileFilter = () => {
    setIsMobileFilterOpen(true);
    openModalWithHash('#filter', { modal: 'filter' });
  };

  const handleCloseMobileFilter = () => {
    closeModalWithHash('#filter', () => setIsMobileFilterOpen(false));
  };

  const handleOpenAuth = () => {
    setIsAuthOpen(true);
    openModalWithHash('#auth', { modal: 'auth' });
  };

  const handleCloseAuth = () => {
    closeModalWithHash('#auth', () => setIsAuthOpen(false));
  };

  const handleOpenProfile = () => {
    if (!session) {
      handleOpenAuth();
    } else {
      setIsProfileOpen(true);
      openModalWithHash('#profile', { modal: 'profile' });
    }
  };

  const handleCloseProfile = () => {
    closeModalWithHash('#profile', () => setIsProfileOpen(false));
  };

  const handleOpenOnboarding = () => {
    setIsOnboardingOpen(true);
    openModalWithHash('#onboarding', { modal: 'onboarding' });
  };

  const handleCloseOnboarding = () => {
    closeModalWithHash('#onboarding', () => setIsOnboardingOpen(false));
  };

  // Listen to browser Back button & popstate events
  useEffect(() => {
    const handlePopState = () => {
      const hash = window.location.hash;

      // 1. Match Detail Modal
      if (hash.startsWith('#match-')) {
        const matchId = hash.replace('#match-', '');
        const target = matches.find((m) => m.id === matchId);
        if (target) {
          setSelectedMatch(target);
          setIsDetailOpen(true);
        }
      } else {
        setIsDetailOpen(false);
        setSelectedMatch(null);
      }

      // 2. Create Match Modal
      if (hash === '#create') {
        setIsCreateOpen(true);
      } else {
        setIsCreateOpen(false);
      }

      // 3. Mobile Filter Drawer
      if (hash === '#filter') {
        setIsMobileFilterOpen(true);
      } else {
        setIsMobileFilterOpen(false);
      }

      // 4. Auth Modal
      if (hash === '#auth') {
        setIsAuthOpen(true);
      } else {
        setIsAuthOpen(false);
      }

      // 5. Profile Modal
      if (hash === '#profile') {
        setIsProfileOpen(true);
      } else {
        setIsProfileOpen(false);
      }

      // 6. Onboarding Modal
      if (hash === '#onboarding') {
        setIsOnboardingOpen(true);
      } else {
        setIsOnboardingOpen(false);
      }
    };

    // Check on initial load
    if (window.location.hash) {
      handlePopState();
    }

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [matches]);

  // Handle User Logged In
  const handleUserLoggedIn = async (user: any) => {
    const meta = user.user_metadata || {};
    const identityData = user.identities?.[0]?.identity_data || {};

    // Specific hydration for confirmed user to guarantee seamless cross-device state
    const isKnownAccount = user.email === 'bachinh@gmail.com';
    const userLevel = meta.level || (isKnownAccount ? 'TB Yếu' : null);
    const userPhone = meta.phone || '';
    const userExp = meta.experience_years || (isKnownAccount ? '6 tháng - 1 năm' : '1 năm');
    const userPlayed = typeof meta.has_played_other_courts === 'boolean'
      ? meta.has_played_other_courts
      : (isKnownAccount ? true : false);
    const isOnboarded = !!(meta.is_onboarded || meta.level || isKnownAccount);

    // Auto-detect real name from Google OAuth metadata, email metadata, or email prefix
    const realName =
      meta.full_name ||
      meta.name ||
      identityData.full_name ||
      identityData.name ||
      meta.preferred_username ||
      (user.email ? user.email.split('@')[0] : '') ||
      'Người chơi';

    const updatedProfile: UserProfile = {
      id: user.id,
      name: realName,
      phone: userPhone,
      avatar:
        meta.avatar_url ||
        meta.picture ||
        identityData.avatar_url ||
        identityData.picture ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      experienceYears: userExp,
      level: (userLevel as any) || 'TB-',
      hasPlayedOtherCourts: userPlayed,
      isOnboarded: isOnboarded,
      joinedMatchIds: [],
    };

    setCurrentUser(updatedProfile);

    // Persist verified user profile to Supabase Cloud Auth metadata if missing
    if ((isKnownAccount && !meta.is_onboarded) || (userLevel && !meta.level)) {
      supabase.auth
        .updateUser({
          data: {
            full_name: realName,
            phone: userPhone,
            level: userLevel,
            experience_years: userExp,
            has_played_other_courts: userPlayed,
            is_onboarded: true,
          },
        })
        .catch(console.warn);
    }

    // Only prompt onboarding if user has NEVER completed it on any device!
    if (!isOnboarded) {
      setIsOnboardingOpen(true);
    } else {
      setIsOnboardingOpen(false);
    }
  };

  // Save user profile from Onboarding & sync to Supabase Cloud
  const handleSaveUser = async (updated: UserProfile) => {
    setCurrentUser(updated);
    setIsOnboardingOpen(false);

    // Persist to Supabase Cloud User Metadata (syncs across Phone, Laptop, and all devices)
    try {
      await supabase.auth.updateUser({
        data: {
          full_name: updated.name,
          phone: updated.phone,
          level: updated.level,
          experience_years: updated.experienceYears,
          has_played_other_courts: updated.hasPlayedOtherCourts,
          is_onboarded: true,
        },
      });
    } catch (err) {
      console.error('Could not sync profile to Supabase cloud metadata:', err);
    }
  };

  // Log Out cleanly
  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn('Sign out error:', e);
    } finally {
      setCurrentUser(INITIAL_USER);
      setSession(null);
      setIsProfileOpen(false);
      setIsOnboardingOpen(false);
      setIsCreateOpen(false);
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

  // Check auth session on load & handle OAuth code exchange
  useEffect(() => {
    // 1. Check for errors or recovery hash in URL
    const urlParams = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const err = urlParams.get('error_description') || hashParams.get('error_description');
    if (err) {
      setAuthError(decodeURIComponent(err.replace(/\+/g, ' ')));
    }

    if (window.location.hash.includes('reset-password') || hashParams.get('type') === 'recovery') {
      setIsResetPasswordOpen(true);
    }

    // 2. Check for PKCE authorization code in URL
    const code = urlParams.get('code');
    if (code) {
      supabase.auth.exchangeCodeForSession(code).then(({ data, error }) => {
        if (error) {
          console.error('PKCE exchange error:', error);
          setAuthError(error.message);
        } else if (data.session?.user) {
          setSession(data.session);
          handleUserLoggedIn(data.session.user);
          // Clean the code from URL
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      });
    }

    // 3. Unified Auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      setSession(currentSession);
      if (event === 'PASSWORD_RECOVERY') {
        setIsResetPasswordOpen(true);
      } else if (currentSession?.user) {
        handleUserLoggedIn(currentSession.user);
      } else if (event === 'SIGNED_OUT') {
        setCurrentUser(INITIAL_USER);
        setIsOnboardingOpen(false);
        setIsProfileOpen(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

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

  // Handle Instant Join / Leave (Requires login)
  const handleToggleJoin = async (matchId: string) => {
    if (!session) {
      setIsAuthOpen(true);
      return;
    }

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

    const updatedMatch = { ...targetMatch, joinedPlayers: updatedPlayers };
    setMatches((prev) => prev.map((m) => (m.id === matchId ? updatedMatch : m)));
    if (selectedMatch?.id === matchId) setSelectedMatch(updatedMatch);

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

  // Create match (Requires login)
  const handleCreateMatch = async (newMatch: MatchPost) => {
    if (!session) {
      setIsAuthOpen(true);
      return;
    }

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

      if (selectedDistrict !== 'Tất cả') {
        const d = selectedDistrict;
        const matchD = m.district;
        const isMatch =
          matchD === d ||
          (d === 'Thủ Đức' && (matchD === 'Thủ Đức' || matchD === 'Quận 2')) ||
          (d === 'Quận 2' && (matchD === 'Quận 2' || matchD.includes('Quận 2')));
        if (!isMatch) return false;
      }

      if (selectedDate !== 'Tất cả' && !m.date.includes(selectedDate)) {
        return false;
      }

      if (onlyAvailableSlots) {
        if (m.joinedPlayers.length >= m.totalSlots) return false;
      }

      if (selectedLevel !== 'Tất cả') {
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
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans antialiased selection:bg-emerald-500 selection:text-white pb-24 sm:pb-0">
      {/* Auth Error Banner if present */}
      {authError && (
        <div className="bg-rose-600 text-white px-4 py-2.5 text-xs sm:text-sm font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
            <AlertTriangle className="w-4 h-4 shrink-0 text-yellow-300" />
            <span>Thông báo đăng nhập: {authError}</span>
          </div>
          <button
            type="button"
            onClick={() => setAuthError(null)}
            className="text-white hover:text-slate-200 text-xs font-bold underline ml-2"
          >
            Đóng
          </button>
        </div>
      )}

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
                onClick={handleOpenCreateMatch}
                className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 active:scale-95 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                Host Đăng Kèo Mới
              </button>

              {/* Login or User Profile */}
              {session ? (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleOpenProfile}
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

                  <button
                    type="button"
                    onClick={handleSignOut}
                    title="Đăng xuất"
                    className="p-2 sm:p-2.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleOpenAuth}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-300 hover:border-emerald-500 text-slate-800 font-bold text-xs sm:text-sm shadow-2xs hover:bg-slate-50 active:scale-95 transition-all cursor-pointer"
                >
                  <LogIn className="w-4 h-4 text-emerald-600" />
                  <span>Đăng Nhập</span>
                </button>
              )}
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

      {/* ================= HERO BANNER FOR WEBSITE (DESKTOP ONLY) ================= */}
      <section className="hidden md:block bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 text-white py-6 sm:py-10 border-b border-emerald-950/40">
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
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-8">
        {/* ================= MOBILE QUICK FILTER BAR (HORIZONTAL SCROLL) ================= */}
        <div className="lg:hidden mb-3">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 -mx-4 px-4 sm:mx-0 sm:px-0">
            {/* Filter Drawer Button */}
            <button
              type="button"
              onClick={handleOpenMobileFilter}
              className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all border shadow-2xs cursor-pointer ${
                activeFiltersCount > 0
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-white text-slate-700 border-slate-200 active:bg-slate-100'
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Bộ lọc</span>
              {activeFiltersCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-white text-emerald-700 text-[10px] font-black flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Quick Date: Hôm nay */}
            <button
              type="button"
              onClick={() => setSelectedDate(selectedDate === 'Hôm nay' ? 'Tất cả' : 'Hôm nay')}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border shadow-2xs cursor-pointer ${
                selectedDate === 'Hôm nay'
                  ? 'bg-teal-600 text-white border-teal-600 font-bold'
                  : 'bg-white text-slate-700 border-slate-200 active:bg-slate-100'
              }`}
            >
              📅 Hôm nay
            </button>

            {/* Quick Available Slots */}
            <button
              type="button"
              onClick={() => setOnlyAvailableSlots(!onlyAvailableSlots)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border shadow-2xs cursor-pointer ${
                onlyAvailableSlots
                  ? 'bg-emerald-600 text-white border-emerald-600 font-bold'
                  : 'bg-white text-slate-700 border-slate-200 active:bg-slate-100'
              }`}
            >
              ⚡ Còn slot
            </button>

            {/* Popular District Pills */}
            {districts.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setSelectedDistrict(selectedDistrict === d ? 'Tất cả' : d)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border shadow-2xs cursor-pointer ${
                  selectedDistrict === d
                    ? 'bg-emerald-600 text-white border-emerald-600 font-bold'
                    : 'bg-white text-slate-700 border-slate-200 active:bg-slate-100'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8 items-start">
          {/* ================= LEFT SIDEBAR: FILTERS ON DESKTOP ONLY ================= */}
          <aside className="hidden lg:block lg:col-span-1 space-y-5 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs sticky top-24">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Filter className="w-4 h-4 text-emerald-600" />
                Bộ lọc tìm kiếm
              </h3>
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 cursor-pointer"
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
          <div className="lg:col-span-3 space-y-4 sm:space-y-5">
            {/* Header toolbar */}
            <div className="flex items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm sm:text-lg flex items-center gap-2">
                  Danh sách kèo tuyển vãng lai
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                    {filteredMatches.length} kèo
                  </span>
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
                  Bấm vào thẻ bất kỳ để xem danh sách thành viên hoặc liên hệ Zalo Host
                </p>
              </div>

              {/* Host button on desktop */}
              <button
                type="button"
                onClick={handleOpenCreateMatch}
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white font-bold text-xs shadow-md shadow-emerald-600/20 active:scale-95 transition-all cursor-pointer"
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
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 cursor-pointer"
                  >
                    Xóa bộ lọc
                  </button>
                  <button
                    type="button"
                    onClick={handleOpenCreateMatch}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer"
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
                    onSelect={handleOpenMatchDetail}
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
          onClick={handleOpenCreateMatch}
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
          onClick={handleOpenProfile}
          className="flex flex-col items-center gap-1 text-slate-400"
        >
          <User className="w-5 h-5" />
          <span className="text-[10px]">{session ? 'Cá nhân' : 'Đăng nhập'}</span>
        </button>
      </nav>

      {/* ================= MOBILE FILTER BOTTOM SHEET ================= */}
      {isMobileFilterOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs p-0 animate-in fade-in duration-150">
          <div
            className="fixed inset-0"
            onClick={handleCloseMobileFilter}
          />
          <div className="relative bg-white w-full max-w-lg rounded-t-3xl max-h-[85vh] flex flex-col shadow-2xl z-10 overflow-hidden animate-in slide-in-from-bottom duration-200">
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-4 px-5 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <Filter className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Bộ lọc tìm kèo vãng lai</h3>
                  <p className="text-[11px] text-slate-500">Lọc theo quận, giờ chơi & trình độ</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCloseMobileFilter}
                className="w-8 h-8 rounded-full bg-slate-200/70 hover:bg-slate-300 flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="p-5 overflow-y-auto space-y-4 flex-1">
              {/* Filter by District */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Khu vực (Quận / Huyện)
                  </label>
                  {selectedDistrict !== 'Tất cả' && (
                    <span className="text-[11px] font-bold text-emerald-600">Đang chọn: {selectedDistrict}</span>
                  )}
                </div>
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
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Thời gian đánh
                  </label>
                  {selectedDate !== 'Tất cả' && (
                    <span className="text-[11px] font-bold text-teal-600">{selectedDate}</span>
                  )}
                </div>
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
                <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-slate-700 p-2.5 rounded-xl bg-slate-50">
                  <input
                    type="checkbox"
                    checked={onlyAvailableSlots}
                    onChange={(e) => setOnlyAvailableSlots(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                  />
                  <span>Chỉ hiện các kèo còn slot trống</span>
                </label>
              </div>
            </div>

            {/* Drawer Actions */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center gap-3">
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-800 text-xs font-bold transition-colors cursor-pointer"
              >
                Đặt lại
              </button>
              <button
                type="button"
                onClick={handleCloseMobileFilter}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold shadow-md shadow-emerald-600/20 active:scale-98 transition-all text-center cursor-pointer"
              >
                Xem {filteredMatches.length} kèo phù hợp
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODALS ================= */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={handleCloseAuth}
        onSuccess={handleCloseAuth}
      />

      <ResetPasswordModal
        isOpen={isResetPasswordOpen}
        onSuccess={() => {
          setIsResetPasswordOpen(false);
          window.history.replaceState({}, document.title, window.location.pathname);
        }}
      />

      <MatchDetailModal
        match={selectedMatch}
        currentUser={currentUser}
        isOpen={isDetailOpen}
        onClose={handleCloseMatchDetail}
        onToggleJoin={handleToggleJoin}
        onRemovePlayer={handleRemovePlayer}
      />

      <CreateMatchModal
        isOpen={isCreateOpen}
        currentUser={currentUser}
        onClose={handleCloseCreateMatch}
        onCreate={handleCreateMatch}
      />

      <OnboardingModal
        isOpen={isOnboardingOpen}
        user={currentUser}
        onSave={(updated) => {
          handleSaveUser(updated);
          handleCloseOnboarding();
        }}
        onClose={handleCloseOnboarding}
      />

      <ProfileModal
        isOpen={isProfileOpen}
        user={currentUser}
        matches={matches}
        onClose={handleCloseProfile}
        onRetakeSurvey={() => {
          handleCloseProfile();
          handleOpenOnboarding();
        }}
        onSelectMatch={handleOpenMatchDetail}
      />
    </div>
  );
}
