import { useState, useMemo, useEffect } from 'react';
import type { MatchPost, UserProfile, SkillLevel } from './types';
import { SKILL_LEVEL_SCORES, isValidVietnamesePhone, formatPhoneNumber } from './types';
import { INITIAL_USER, MOCK_MATCHES } from './mockData';
import { MatchCard } from './components/MatchCard';
import { MatchDetailModal } from './components/MatchDetailModal';
import { CreateMatchModal } from './components/CreateMatchModal';
import { OnboardingModal } from './components/OnboardingModal';
import { ProfileModal } from './components/ProfileModal';
import { AuthModal } from './components/AuthModal';
import { ResetPasswordModal } from './components/ResetPasswordModal';
import { AIChatModal } from './components/AIChatModal';
import { FloatingAIMascot } from './components/FloatingAIMascot';
import { BadmintonMascotBot } from './components/BadmintonMascotBot';
import { supabase, toMatchPost, toDbRow, type DbMatchRow } from './supabase';
import { normalizeVietnamese } from './data/badmintonCourts';
import {
  Search,
  Plus,
  Compass,
  CalendarCheck,
  User,
  Sparkles,
  Zap,
  Filter,
  Wifi,
  LogIn,
  LogOut,
  AlertTriangle,
  X,
  ArrowUp,
  RotateCcw,
  MapPin,
  ChevronDown,
  Award,
  Users,
} from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile>(INITIAL_USER);
  const [session, setSession] = useState<any>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const [matches, setMatches] = useState<MatchPost[]>(MOCK_MATCHES);
  const [selectedMatch, setSelectedMatch] = useState<MatchPost | null>(null);
  const [isConnectedToDb, setIsConnectedToDb] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Modals state
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingMatch, setEditingMatch] = useState<MatchPost | null>(null);
  const [cloningMatch, setCloningMatch] = useState<MatchPost | null>(null);
  const [prefilledMatch, setPrefilledMatch] = useState<Partial<MatchPost> | null>(null);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);

  // Join confirmation dialog
  const [confirmJoinMatch, setConfirmJoinMatch] = useState<MatchPost | null>(null);
  const [joinPhoneInput, setJoinPhoneInput] = useState('');
  const [isJoining, setIsJoining] = useState(false);

  // Online / Offline monitor
  useEffect(() => {
    const onOnline = () => setIsOnline(true);
    const onOffline = () => setIsOnline(false);
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, []);

  // Bookmarks state (persisted to localStorage)
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('timvanglai_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const handleToggleBookmark = (matchId: string) => {
    setBookmarkedIds((prev) => {
      const updated = prev.includes(matchId)
        ? prev.filter((id) => id !== matchId)
        : [...prev, matchId];
      try {
        localStorage.setItem('timvanglai_bookmarks', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // Back to top floating button
  const [showBackToTop, setShowBackToTop] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 350);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Active Bottom Tab on mobile: 'feed' | 'my-matches' | 'profile'
  const [activeTab, setActiveTab] = useState<'feed' | 'my-matches' | 'bookmarks' | 'profile'>('feed');

  // Filters state with preferred district memory
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>(() => {
    try {
      return localStorage.getItem('timvanglai_preferred_district') || 'Tất cả';
    } catch {
      return 'Tất cả';
    }
  });
  const [selectedLevel, setSelectedLevel] = useState('Tất cả');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<'Tất cả' | 'morning' | 'afternoon' | 'evening'>('Tất cả');
  const [onlyAvailableSlots, setOnlyAvailableSlots] = useState(false);

  const handleSelectDistrict = (d: string) => {
    setSelectedDistrict(d);
    try {
      localStorage.setItem('timvanglai_preferred_district', d);
    } catch {}
  };

  const districts = [
    'Tất cả',
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

  const levels = ['Tất cả', 'Hợp trình của tôi', 'Newbie', 'Yếu', 'Trung Bình', 'Khá (Bán chuyên)'];

  // Count active filters
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedDistrict !== 'Tất cả') count++;
    if (selectedLevel !== 'Tất cả') count++;
    if (selectedTimeSlot !== 'Tất cả') count++;
    if (onlyAvailableSlots) count++;
    return count;
  }, [selectedDistrict, selectedLevel, selectedTimeSlot, onlyAvailableSlots]);

  // Reset all filters
  const handleResetFilters = () => {
    handleSelectDistrict('Tất cả');
    setSelectedLevel('Tất cả');
    setSelectedTimeSlot('Tất cả');
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
      setEditingMatch(null);
      setCloningMatch(null);
      setIsCreateOpen(true);
      openModalWithHash('#create', { modal: 'create-match' });
    }
  };

  const handleEditMatch = (match: MatchPost) => {
    setEditingMatch(match);
    setCloningMatch(null);
    setIsCreateOpen(true);
    openModalWithHash('#create', { modal: 'edit-match', matchId: match.id });
  };

  const handleCloneMatch = (match: MatchPost) => {
    setCloningMatch(match);
    setEditingMatch(null);
    setIsCreateOpen(true);
    openModalWithHash('#create', { modal: 'clone-match', matchId: match.id });
  };

  const handlePrefillCreateMatch = (draft: Partial<MatchPost>) => {
    setPrefilledMatch(draft);
    setEditingMatch(null);
    setCloningMatch(null);
    setIsCreateOpen(true);
    openModalWithHash('#create', { modal: 'create-match-ai' });
  };

  const handleCloseCreateMatch = () => {
    closeModalWithHash('#create', () => {
      setIsCreateOpen(false);
      setEditingMatch(null);
      setCloningMatch(null);
      setPrefilledMatch(null);
    });
  };

  const handleOpenAIChat = () => {
    if (!session || !currentUser || currentUser.id === 'guest' || !currentUser.name) {
      handleOpenAuth();
    } else {
      setIsAIChatOpen(true);
      openModalWithHash('#ai-chat', { modal: 'ai-chat' });
    }
  };

  const handleCloseAIChat = () => {
    closeModalWithHash('#ai-chat', () => setIsAIChatOpen(false));
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

  // Deep Link auto-open when matches finish loading (Bug 2)
  useEffect(() => {
    if (matches.length > 0 && window.location.hash.startsWith('#match-')) {
      const matchId = window.location.hash.replace('#match-', '');
      const target = matches.find((m) => m.id === matchId);
      if (target) {
        setSelectedMatch(target);
        setIsDetailOpen(true);
      }
    }
  }, [matches]);

  // Listen to browser Back button & popstate events
  useEffect(() => {
    const handlePopState = () => {
      const hash = window.location.hash;

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

      if (hash === '#create') {
        setIsCreateOpen(true);
      } else {
        setIsCreateOpen(false);
      }

      if (hash === '#filter') {
        setIsMobileFilterOpen(true);
      } else {
        setIsMobileFilterOpen(false);
      }

      if (hash === '#auth') {
        setIsAuthOpen(true);
      } else {
        setIsAuthOpen(false);
      }

      if (hash === '#profile') {
        setIsProfileOpen(true);
      } else {
        setIsProfileOpen(false);
      }

      if (hash === '#onboarding') {
        setIsOnboardingOpen(true);
      } else {
        setIsOnboardingOpen(false);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [matches]);

  // Handle User Logged In
  const handleUserLoggedIn = async (user: any) => {
    const meta = user.user_metadata || {};
    const identityData = user.identities?.[0]?.identity_data || {};

    const isKnownAccount = user.email === 'bachinh@gmail.com';
    const userLevel = meta.level || (isKnownAccount ? 'TB Yếu' : null);
    const userPhone = meta.phone || '';
    const userExp = meta.experience_years || (isKnownAccount ? '6 tháng - 1 năm' : '1 năm');
    const userPlayed = typeof meta.has_played_other_courts === 'boolean'
      ? meta.has_played_other_courts
      : (isKnownAccount ? true : false);
    const isOnboarded = !!(meta.is_onboarded || meta.level || isKnownAccount);

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

    if (!isOnboarded) {
      setIsOnboardingOpen(true);
    } else {
      setIsOnboardingOpen(false);
    }

    // Recover pending join after login (Bug 7)
    const pendingMatchId = sessionStorage.getItem('timvanglai_pending_join');
    if (pendingMatchId) {
      sessionStorage.removeItem('timvanglai_pending_join');
      setTimeout(() => {
        executeToggleJoin(pendingMatchId, updatedProfile);
      }, 400);
    }
  };

  // Save user profile from Onboarding & sync to Supabase Cloud
  const handleSaveUser = async (updated: UserProfile) => {
    setCurrentUser(updated);
    setIsOnboardingOpen(false);

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

  // Update profile from ProfileModal
  const handleUpdateProfile = async (updatedFields: Partial<UserProfile>) => {
    const updated = { ...currentUser, ...updatedFields };
    setCurrentUser(updated);
    try {
      await supabase.auth.updateUser({
        data: {
          full_name: updated.name,
          phone: updated.phone,
        },
      });
    } catch (err) {
      console.error('Failed to update user profile:', err);
    }
  };

  // Log Out cleanly
  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn('Sign out error:', e);
    } finally {
      if (currentUser?.id) {
        try {
          sessionStorage.removeItem(`timvanglai_chat_history_${currentUser.id}`);
        } catch {}
      }
      try {
        sessionStorage.removeItem('timvanglai_chat_history');
      } catch {}
      setIsAIChatOpen(false);
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
    const urlParams = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const err = urlParams.get('error_description') || hashParams.get('error_description');
    if (err) {
      setAuthError(decodeURIComponent(err.replace(/\+/g, ' ')));
    }

    if (window.location.hash.includes('reset-password') || hashParams.get('type') === 'recovery') {
      setIsResetPasswordOpen(true);
    }

    const code = urlParams.get('code');
    if (code) {
      supabase.auth.exchangeCodeForSession(code).then(({ data, error }) => {
        if (error) {
          console.error('PKCE exchange error:', error);
          setAuthError(error.message);
        } else if (data.session?.user) {
          setSession(data.session);
          handleUserLoggedIn(data.session.user);
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      });
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      setSession(currentSession);
      if (event === 'PASSWORD_RECOVERY') {
        setIsResetPasswordOpen(true);
      } else if (currentSession?.user) {
        handleUserLoggedIn(currentSession.user);
      } else if (event === 'SIGNED_OUT') {
        try {
          sessionStorage.removeItem('timvanglai_chat_history');
        } catch {}
        setIsAIChatOpen(false);
        setCurrentUser(INITIAL_USER);
        setSession(null);
        setIsOnboardingOpen(false);
        setIsProfileOpen(false);
        setIsCreateOpen(false);
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

  // Helper to execute Join without opening confirmation popup
  const executeToggleJoin = async (matchId: string, userToJoin = currentUser) => {
    const targetMatch = matches.find((m) => m.id === matchId);
    if (!targetMatch) return;

    const alreadyJoined = targetMatch.joinedPlayers.some((p) => p.userId === userToJoin.id);

    let updatedPlayers: any[];
    if (alreadyJoined) {
      updatedPlayers = targetMatch.joinedPlayers.filter((p) => p.userId !== userToJoin.id);
    } else {
      if (targetMatch.joinedPlayers.length >= targetMatch.totalSlots) {
        alert('Kèo này vừa đủ người rồi!');
        return;
      }
      updatedPlayers = [
        ...targetMatch.joinedPlayers,
        {
          userId: userToJoin.id,
          name: userToJoin.name,
          avatar: userToJoin.avatar,
          level: userToJoin.level,
          phone: userToJoin.phone,
          joinedAt: 'Vừa xong',
          isPaidDeposit: false,
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

  // Handle Instant Join / Leave (With Confirmation dialog to prevent misclicks)
  const handleToggleJoin = async (matchId: string) => {
    if (!session) {
      sessionStorage.setItem('timvanglai_pending_join', matchId);
      setIsAuthOpen(true);
      return;
    }

    const targetMatch = matches.find((m) => m.id === matchId);
    if (!targetMatch) return;

    const alreadyJoined = targetMatch.joinedPlayers.some((p) => p.userId === currentUser.id);

    if (alreadyJoined) {
      executeToggleJoin(matchId);
    } else {
      if (targetMatch.isLocked) {
        alert('Kèo này Host đã tạm ngưng nhận thêm người!');
        return;
      }

      // Gender warning check (Bug 8 Fix)
      if (targetMatch.targetGender === 'female' && currentUser.gender === 'male') {
        if (!window.confirm('⚠️ Chú ý: Bài đăng này Host ghi chú [🙋‍♀️ CHỈ TUYỂN NỮ]!\n\nBạn có chắc chắn muốn đăng ký giữ slot?')) return;
      } else if (targetMatch.targetGender === 'male' && currentUser.gender === 'female') {
        if (!window.confirm('⚠️ Chú ý: Bài đăng này Host ghi chú [🙋‍♂️ CHỈ TUYỂN NAM]!\n\nBạn có chắc chắn muốn đăng ký slot này?')) return;
      }

      setJoinPhoneInput(currentUser.phone || '');
      setConfirmJoinMatch(targetMatch);
    }
  };

  // Host toggles player's deposit status (Bug 6)
  const handleTogglePlayerDeposit = async (matchId: string, playerId: string) => {
    const target = matches.find((m) => m.id === matchId);
    if (!target) return;
    const updatedPlayers = target.joinedPlayers.map((p) =>
      p.userId === playerId ? { ...p, isPaidDeposit: !p.isPaidDeposit } : p
    );
    const updated = { ...target, joinedPlayers: updatedPlayers };
    setMatches((prev) => prev.map((m) => (m.id === matchId ? updated : m)));
    if (selectedMatch?.id === matchId) setSelectedMatch(updated);
    try {
      await supabase.from('matches').update({ joined_players: updatedPlayers }).eq('id', matchId);
    } catch (e) {
      console.error('Failed to sync deposit status to Supabase:', e);
    }
  };

  // Host removes a player
  const handleRemovePlayer = async (matchId: string, playerId: string) => {
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

  // Host locks 1 offline guest slot with custom name & level (Point 11 Fix)
  const handleAddGuest = async (matchId: string, customName?: string, customLevel?: any) => {
    const targetMatch = matches.find((m) => m.id === matchId);
    if (!targetMatch) return;
    if (targetMatch.joinedPlayers.length >= targetMatch.totalSlots) {
      alert('Kèo đã đủ người, không thể khóa thêm slot!');
      return;
    }

    const guestCount = targetMatch.joinedPlayers.filter((p) => p.name.includes('Khách')).length + 1;
    const guestPlayer = {
      userId: `guest-${Date.now()}`,
      name: customName || `Khách ngoài #${guestCount}`,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      level: customLevel || targetMatch.minLevel,
      phone: '',
      joinedAt: 'Vừa xong',
      isPaidDeposit: true,
    };

    const updatedPlayers = [...targetMatch.joinedPlayers, guestPlayer];
    const updatedMatch = { ...targetMatch, joinedPlayers: updatedPlayers };

    setMatches((prev) => prev.map((m) => (m.id === matchId ? updatedMatch : m)));
    if (selectedMatch?.id === matchId) setSelectedMatch(updatedMatch);

    try {
      await supabase
        .from('matches')
        .update({ joined_players: updatedPlayers })
        .eq('id', matchId);
    } catch (e) {
      console.error('Failed to add guest to Supabase:', e);
    }
  };

  // Host toggles lock match / roster (Point 16 Fix)
  const handleToggleLockMatch = async (matchId: string) => {
    const target = matches.find((m) => m.id === matchId);
    if (!target) return;
    const updatedMatch: MatchPost = { ...target, isLocked: !target.isLocked };
    setMatches((prev) => prev.map((m) => (m.id === matchId ? updatedMatch : m)));
    if (selectedMatch?.id === matchId) setSelectedMatch(updatedMatch);
    try {
      await supabase.from('matches').update(toDbRow(updatedMatch)).eq('id', matchId);
    } catch (e) {
      console.error('Failed to toggle lock match:', e);
    }
  };

  // Quick update announcement (Point 13 Fix)
  const handleQuickUpdateAnnouncement = async (matchId: string, text: string) => {
    const target = matches.find((m) => m.id === matchId);
    if (!target) return;
    const updatedMatch: MatchPost = { ...target, announcement: text || undefined };
    setMatches((prev) => prev.map((m) => (m.id === matchId ? updatedMatch : m)));
    if (selectedMatch?.id === matchId) setSelectedMatch(updatedMatch);
    try {
      await supabase.from('matches').update(toDbRow(updatedMatch)).eq('id', matchId);
    } catch (e) {
      console.error('Failed to update announcement:', e);
    }
  };

  // Register waitlist (Point 1 Fix)
  const handleJoinWaitlist = async (matchId: string, phone: string) => {
    const target = matches.find((m) => m.id === matchId);
    if (!target) return;
    const waitlistEntry = {
      userId: currentUser.id,
      name: currentUser.name || 'Người chơi',
      avatar: currentUser.avatar,
      phone: phone || currentUser.phone || '',
      joinedAt: 'Vừa xong',
      level: currentUser.level,
    };
    const updatedWaitlist = [...(target.waitlist || []), waitlistEntry];
    const updatedMatch: MatchPost = { ...target, waitlist: updatedWaitlist };
    setMatches((prev) => prev.map((m) => (m.id === matchId ? updatedMatch : m)));
    if (selectedMatch?.id === matchId) setSelectedMatch(updatedMatch);
    try {
      await supabase.from('matches').update(toDbRow(updatedMatch)).eq('id', matchId);
    } catch (e) {
      console.error('Failed to update waitlist:', e);
    }
  };

  // Host updates match
  const handleUpdateMatch = async (updatedMatch: MatchPost) => {
    setMatches((prev) => prev.map((m) => (m.id === updatedMatch.id ? updatedMatch : m)));
    setSelectedMatch(updatedMatch);

    try {
      await supabase.from('matches').update(toDbRow(updatedMatch)).eq('id', updatedMatch.id);
    } catch (e) {
      console.error('Failed to update match on Supabase:', e);
    }
  };

  // Host deletes match
  const handleDeleteMatch = async (matchId: string) => {
    setMatches((prev) => prev.filter((m) => m.id !== matchId));
    if (selectedMatch?.id === matchId) {
      setSelectedMatch(null);
      setIsDetailOpen(false);
    }

    try {
      await supabase.from('matches').delete().eq('id', matchId);
    } catch (e) {
      console.error('Failed to delete match on Supabase:', e);
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

  // Helper kiểm tra kèo đã kết thúc hay chưa (Bug 10 Fix)
  const isMatchExpired = (m: MatchPost) => {
    try {
      const now = new Date();
      let targetDate = new Date();
      if (m.date === 'Ngày mai') {
        targetDate.setDate(targetDate.getDate() + 1);
      } else if (m.date.includes('/')) {
        const parts = m.date.match(/(\d{1,2})\/(\d{1,2})/);
        if (parts) {
          targetDate.setDate(parseInt(parts[1], 10));
          targetDate.setMonth(parseInt(parts[2], 10) - 1);
        }
      }
      const [endHour, endMin] = m.endTime.split(':').map((n) => parseInt(n, 10));
      targetDate.setHours(endHour, endMin, 0, 0);
      return now.getTime() > targetDate.getTime();
    } catch {
      return false;
    }
  };

  // Filtered matches with Vietnamese normalization & Skill Level Score Range matching (Bug 1 Fix)
  const filteredMatches = useMemo(() => {
    const list = matches.filter((m) => {
      if (activeTab === 'my-matches') {
        const isJoined = m.joinedPlayers.some((p) => p.userId === currentUser.id);
        if (!isJoined) return false;
      }

      if (activeTab === 'bookmarks') {
        if (!bookmarkedIds.includes(m.id)) return false;
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

      if (selectedTimeSlot !== 'Tất cả') {
        const startHour = parseInt(m.startTime.split(':')[0], 10) || 0;
        if (selectedTimeSlot === 'morning' && startHour >= 12) return false;
        if (selectedTimeSlot === 'afternoon' && (startHour < 12 || startHour >= 17)) return false;
        if (selectedTimeSlot === 'evening' && startHour < 17) return false;
      }

      if (onlyAvailableSlots) {
        if (m.joinedPlayers.length >= m.totalSlots) return false;
      }

      // Trình độ so khớp theo thang điểm số chính xác (Bug 1)
      if (selectedLevel !== 'Tất cả') {
        if (selectedLevel === 'Hợp trình của tôi') {
          const userScore = SKILL_LEVEL_SCORES[currentUser.level] ?? 3;
          const minScore = SKILL_LEVEL_SCORES[m.minLevel] ?? 0;
          const maxScore = SKILL_LEVEL_SCORES[m.maxLevel] ?? 9;
          // Cho phép chênh lệch nhẹ ±1 bậc trình để người chơi dễ tìm được kèo giao lưu
          if (userScore < minScore - 1 || userScore > maxScore + 1) return false;
        } else {
          const targetScore = SKILL_LEVEL_SCORES[selectedLevel as SkillLevel];
          if (targetScore !== undefined) {
            const minScore = SKILL_LEVEL_SCORES[m.minLevel] ?? 0;
            const maxScore = SKILL_LEVEL_SCORES[m.maxLevel] ?? 9;
            if (targetScore < minScore || targetScore > maxScore) return false;
          } else {
            const matchesLevel =
              m.minLevel.includes(selectedLevel) ||
              m.maxLevel.includes(selectedLevel) ||
              (selectedLevel === 'Trung Bình' && (m.minLevel.includes('TB') || m.maxLevel.includes('TB')));
            if (!matchesLevel) return false;
          }
        }
      }

      // Full text search expanded (Point 9: Host name, Shuttle, Amenities)
      if (searchQuery.trim()) {
        const qNorm = normalizeVietnamese(searchQuery.trim());
        const matchFullNorm = normalizeVietnamese(
          `${m.title} ${m.courtName} ${m.district} ${m.address} ${m.hostName} ${m.shuttleType} ${(m.amenities || []).join(' ')}`
        );
        const tokens = qNorm.split(' ').filter(Boolean);
        const matchesAll = tokens.every((token) => matchFullNorm.includes(token));
        if (!matchesAll) return false;
      }

      return true;
    });

    // Sắp xếp feed thông minh (Kèo đã qua giờ xếp cuối, kèo gấp xếp đầu)
    return list.sort((a, b) => {
      const expiredA = isMatchExpired(a);
      const expiredB = isMatchExpired(b);
      if (expiredA !== expiredB) {
        return expiredA ? 1 : -1;
      }

      if (a.isUrgent !== b.isUrgent) {
        return a.isUrgent ? -1 : 1;
      }

      const fullA = a.joinedPlayers.length >= a.totalSlots;
      const fullB = b.joinedPlayers.length >= b.totalSlots;
      if (fullA !== fullB) {
        return fullA ? 1 : -1;
      }

      return 0;
    });
  }, [
    matches,
    activeTab,
    selectedDistrict,
    selectedTimeSlot,
    selectedLevel,
    onlyAvailableSlots,
    searchQuery,
    currentUser,
    bookmarkedIds,
  ]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans antialiased selection:bg-emerald-500 selection:text-white pb-28 sm:pb-0">
      {/* Offline Banner (Imp 32) */}
      {!isOnline && (
        <div className="bg-amber-500 text-slate-900 px-4 py-2 text-xs font-bold text-center flex items-center justify-center gap-1.5 shadow-sm">
          <span>📶 Bạn đang ngoại tuyến. Dữ liệu trên màn hình là bản lưu trữ cục bộ.</span>
        </div>
      )}

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
            className="text-white hover:text-slate-200 text-xs font-bold underline ml-2 cursor-pointer"
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
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => {
                setActiveTab('feed');
                handleResetFilters();
              }}
            >
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

            {/* Desktop Center Search with Clear Button (Bug 1 & 8) */}
            <div className="hidden md:flex flex-1 max-w-md mx-4">
              <div className="relative w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm theo tên sân, tên đường, quận (VD: Celadon, Mã Lò, Lê Văn Quới...)"
                  className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-slate-100/80 border border-slate-200 focus:border-emerald-500 focus:bg-white text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none transition-all"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs p-1 cursor-pointer"
                    title="Xóa tìm kiếm"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Desktop Navigation Tabs (Bug 1 & Point 21 Fix) */}
            <div className="hidden lg:flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200/80 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('feed');
                  handleResetFilters();
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'feed'
                    ? 'bg-white text-emerald-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🏸 Khám phá
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('my-matches')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'my-matches'
                    ? 'bg-white text-emerald-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                📅 Kèo của tôi
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('bookmarks')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'bookmarks'
                    ? 'bg-white text-emerald-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                ⭐ Đã lưu
              </button>
            </div>

            {/* Desktop Actions + Profile */}
            <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
              <button
                type="button"
                onClick={handleOpenAIChat}
                className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 text-emerald-800 font-bold text-xs border border-emerald-200/80 shadow-xs active:scale-95 transition-all cursor-pointer group h-10 shrink-0"
                title="Hỏi Bé Cầu AI (Tìm kèo, Soạn bài, Thẩm định)"
              >
                <div className="w-5 h-5 -my-1 shrink-0">
                  <BadmintonMascotBot size="xs" isAnimated={true} />
                </div>
                <span>Bé Cầu AI</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </button>

              <button
                type="button"
                onClick={handleOpenCreateMatch}
                className="hidden sm:flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 active:scale-95 transition-all cursor-pointer h-10 shrink-0"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                Host Đăng Kèo Mới
              </button>

              {/* Login or User Profile */}
              {session ? (
                <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleOpenProfile}
                    className="flex items-center gap-2 sm:gap-2.5 px-2 py-1 sm:py-1 sm:pl-3 sm:pr-1.5 rounded-2xl bg-slate-50 hover:bg-emerald-50/80 border border-slate-200 hover:border-emerald-300 transition-all cursor-pointer shadow-2xs group h-10 shrink-0"
                    title="Xem trang cá nhân"
                  >
                    <div className="text-right hidden sm:block min-w-0">
                      <div className="text-xs font-bold text-slate-800 leading-tight truncate max-w-[100px] md:max-w-[130px] lg:max-w-[160px] group-hover:text-emerald-700 transition-colors">
                        {currentUser.name}
                      </div>
                      <div className="text-[10px] font-black text-emerald-700 uppercase tracking-tight whitespace-nowrap">
                        Trình: {currentUser.level}
                      </div>
                    </div>

                    {/* Avatar with fallback initial */}
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-2xs overflow-hidden border border-slate-200 group-hover:border-emerald-400 transition-colors relative">
                      <span className="select-none">{currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}</span>
                      {currentUser.avatar && (
                        <img
                          src={currentUser.avatar}
                          alt={currentUser.name}
                          className="w-full h-full object-cover absolute inset-0"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      )}
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={handleSignOut}
                    title="Đăng xuất"
                    className="w-9 h-9 rounded-2xl flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer shrink-0 border border-transparent hover:border-rose-200"
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

          {/* Mobile search input with Clear button (Bug 8) */}
          <div className="md:hidden pb-3">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm sân, đường, quận (VD: Celadon, Mã Lò, Tân Phú...)"
                className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-100 border border-slate-200 focus:border-emerald-500 focus:bg-white text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs p-1"
                >
                  ✕
                </button>
              )}
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
                <div className="text-xl sm:text-3xl font-black text-yellow-300">10 Bậc</div>
                <div className="text-[11px] sm:text-xs text-emerald-200 font-medium">Thang đo phân trình</div>
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

            {/* Quick Time Slot: Ca Tối (Bug 8) */}
            <button
              type="button"
              onClick={() => setSelectedTimeSlot(selectedTimeSlot === 'evening' ? 'Tất cả' : 'evening')}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border shadow-2xs cursor-pointer ${
                selectedTimeSlot === 'evening'
                  ? 'bg-emerald-600 text-white border-emerald-600 font-bold'
                  : 'bg-white text-slate-700 border-slate-200 active:bg-slate-100'
              }`}
            >
              🌙 Ca Tối (&gt;17h)
            </button>

            {/* Quick Time Slot: Ca Sáng */}
            <button
              type="button"
              onClick={() => setSelectedTimeSlot(selectedTimeSlot === 'morning' ? 'Tất cả' : 'morning')}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border shadow-2xs cursor-pointer ${
                selectedTimeSlot === 'morning'
                  ? 'bg-emerald-600 text-white border-emerald-600 font-bold'
                  : 'bg-white text-slate-700 border-slate-200 active:bg-slate-100'
              }`}
            >
              ☀️ Ca Sáng (&lt;12h)
            </button>

            {/* Top Popular District Pills on Mobile Bar */}
            {['Tân Phú', 'Tân Bình', 'Gò Vấp', 'Bình Thạnh', 'Thủ Đức', 'Quận 10']
              .concat(
                selectedDistrict !== 'Tất cả' &&
                  !['Tân Phú', 'Tân Bình', 'Gò Vấp', 'Bình Thạnh', 'Thủ Đức', 'Quận 10'].includes(selectedDistrict)
                  ? [selectedDistrict]
                  : []
              )
              .map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => handleSelectDistrict(selectedDistrict === d ? 'Tất cả' : d)}
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
          <aside className="hidden lg:block lg:col-span-1 space-y-4 bg-white p-4.5 rounded-3xl border border-slate-200/80 shadow-xs sticky top-24">
            {/* Header: Title + Active Count Badge + Reset */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-100/80 text-emerald-700 flex items-center justify-center font-bold">
                  <Filter className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-xs tracking-tight flex items-center gap-1.5">
                    Bộ lọc tìm kèo
                    {activeFiltersCount > 0 && (
                      <span className="px-1.5 py-0.2 rounded-full bg-emerald-600 text-white text-[10px] font-bold">
                        {activeFiltersCount}
                      </span>
                    )}
                  </h3>
                </div>
              </div>
              {activeFiltersCount > 0 && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-[11px] font-bold text-rose-500 hover:text-rose-600 cursor-pointer flex items-center gap-1 hover:underline"
                >
                  <RotateCcw className="w-3 h-3" />
                  Đặt lại
                </button>
              )}
            </div>

            {/* 1. Khu vực (Quận / Huyện) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  Khu vực (TP.HCM)
                </label>
                {selectedDistrict !== 'Tất cả' && (
                  <button
                    type="button"
                    onClick={() => handleSelectDistrict('Tất cả')}
                    className="text-[10px] font-semibold text-slate-400 hover:text-rose-500 cursor-pointer"
                  >
                    Xóa lọc
                  </button>
                )}
              </div>

              {/* Select box bao quát tất cả 20 quận huyện */}
              <div className="relative">
                <select
                  value={selectedDistrict}
                  onChange={(e) => handleSelectDistrict(e.target.value)}
                  className="w-full pl-3 pr-8 py-2 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 focus:border-emerald-500 rounded-xl text-xs font-semibold text-slate-800 transition-all cursor-pointer appearance-none"
                >
                  <option value="Tất cả">Toàn bộ TP.HCM (Tất cả quận)</option>
                  {districts
                    .filter((d) => d !== 'Tất cả')
                    .map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Quick chips 5 quận hot nhất */}
              <div className="flex flex-wrap gap-1 pt-0.5">
                {['Tân Phú', 'Tân Bình', 'Bình Thạnh', 'Gò Vấp', 'Thủ Đức'].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => handleSelectDistrict(selectedDistrict === d ? 'Tất cả' : d)}
                    className={`px-2 py-0.8 rounded-lg text-[10px] font-medium transition-all cursor-pointer border ${
                      selectedDistrict === d
                        ? 'bg-emerald-600 text-white border-emerald-600 font-bold shadow-2xs'
                        : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-600'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Ca chơi trong ngày (2x2 cân xứng) */}
            <div className="pt-2.5 border-t border-slate-100 space-y-1.5">
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                Ca chơi trong ngày
              </label>
              <div className="grid grid-cols-2 gap-1">
                {[
                  { label: 'Tất cả ca', val: 'Tất cả' },
                  { label: 'Sáng (<12h)', val: 'morning' },
                  { label: 'Chiều (12-17h)', val: 'afternoon' },
                  { label: 'Tối (>17h)', val: 'evening' },
                ].map((item) => (
                  <button
                    key={item.val}
                    type="button"
                    onClick={() => setSelectedTimeSlot(item.val as any)}
                    className={`py-1.5 px-2 rounded-xl text-xs font-semibold text-center transition-all cursor-pointer border ${
                      selectedTimeSlot === item.val
                        ? 'bg-emerald-600 text-white border-emerald-600 font-bold shadow-2xs'
                        : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Trình độ yêu cầu */}
            <div className="pt-2.5 border-t border-slate-100 space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-emerald-600" />
                  Trình độ
                </label>
                {selectedLevel !== 'Tất cả' && (
                  <button
                    type="button"
                    onClick={() => setSelectedLevel('Tất cả')}
                    className="text-[10px] font-semibold text-slate-400 hover:text-rose-500 cursor-pointer"
                  >
                    Xóa lọc
                  </button>
                )}
              </div>

              {/* Select Trình độ */}
              <div className="relative">
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="w-full pl-3 pr-8 py-2 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 focus:border-emerald-500 rounded-xl text-xs font-semibold text-slate-800 transition-all cursor-pointer appearance-none"
                >
                  {levels.map((lvl) => (
                    <option key={lvl} value={lvl}>
                      {lvl === 'Tất cả' ? 'Tất cả trình độ' : lvl === 'Hợp trình của tôi' ? '⭐ Hợp trình của tôi' : `Trình: ${lvl}`}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Quick chip Hợp trình của tôi */}
              <button
                type="button"
                onClick={() => setSelectedLevel(selectedLevel === 'Hợp trình của tôi' ? 'Tất cả' : 'Hợp trình của tôi')}
                className={`w-full py-1.5 px-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 border ${
                  selectedLevel === 'Hợp trình của tôi'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                    : 'bg-emerald-50/70 hover:bg-emerald-100/80 text-emerald-800 border-emerald-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Kèo hợp trình của tôi ({currentUser.level})</span>
              </button>
            </div>

            {/* 6. Chỉ hiện kèo còn slot */}
            <div className="pt-2.5 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setOnlyAvailableSlots(!onlyAvailableSlots)}
                className={`w-full flex items-center justify-between p-2.5 rounded-2xl border transition-all cursor-pointer ${
                  onlyAvailableSlots
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-950 shadow-2xs'
                    : 'bg-slate-50/70 hover:bg-slate-100 border-slate-200 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center transition-colors ${
                      onlyAvailableSlots ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    <Users className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold leading-tight">Chỉ kèo còn slot</div>
                    <div className="text-[10px] text-slate-500">Ẩn sân đã đủ người</div>
                  </div>
                </div>
                <div
                  className={`w-9 h-5 rounded-full transition-colors p-0.5 flex items-center ${
                    onlyAvailableSlots ? 'bg-emerald-600 justify-end' : 'bg-slate-300 justify-start'
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-white shadow-xs" />
                </div>
              </button>
            </div>

            {/* 7. Quick guide card on left */}
            <div className="p-3 rounded-2xl bg-amber-50/60 border border-amber-200/50 text-[11px] text-amber-900 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong className="font-bold">Văn hóa vãng lai:</strong> Đăng ký đúng trình, đến sớm 5-10p khởi động nhé!
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

            {/* Grid of Matches with Context-Aware Empty State (Bug 2 & Point 22 Fix) */}
            {filteredMatches.length === 0 ? (
              activeTab === 'my-matches' && !session ? (
                <div className="text-center py-16 bg-white rounded-3xl p-8 border border-emerald-200/80 shadow-xs animate-in fade-in duration-200">
                  <div className="text-4xl mb-3">🏸</div>
                  <h4 className="text-base font-extrabold text-slate-800">Bạn chưa đăng nhập</h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
                    Vui lòng đăng nhập tài khoản để theo dõi danh sách các kèo giao lưu cầu lông mà bạn đã đăng ký giữ slot!
                  </p>
                  <div className="mt-4 flex items-center justify-center">
                    <button
                      type="button"
                      onClick={handleOpenAuth}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white text-xs font-bold shadow-md shadow-emerald-600/20 active:scale-95 transition-all cursor-pointer"
                    >
                      Đăng Nhập Ngay
                    </button>
                  </div>
                </div>
              ) : activeTab === 'my-matches' && session ? (
                <div className="text-center py-16 bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs animate-in fade-in duration-200">
                  <div className="text-4xl mb-3">📅</div>
                  <h4 className="text-base font-extrabold text-slate-800">Bạn chưa giữ slot kèo nào</h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
                    Hãy quay lại trang Khám phá để chọn sân gần bạn, đúng trình độ và bấm tham gia ngay nhé!
                  </p>
                  <div className="mt-4 flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('feed');
                        handleResetFilters();
                      }}
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
                    >
                      Khám Phá Kèo Ngay
                    </button>
                  </div>
                </div>
              ) : activeTab === 'bookmarks' ? (
                <div className="text-center py-16 bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs animate-in fade-in duration-200">
                  <div className="text-4xl mb-3">⭐</div>
                  <h4 className="text-base font-extrabold text-slate-800">Chưa có bài đăng nào được lưu</h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
                    Bấm vào biểu tượng bookmark trên các thẻ kèo ngoài trang chủ để lưu lại và theo dõi sau!
                  </p>
                  <div className="mt-4 flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('feed');
                        handleResetFilters();
                      }}
                      className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer transition-colors"
                    >
                      Quay lại trang chủ
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-20 bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs">
                  <div className="text-4xl mb-3">🏸</div>
                  <h4 className="text-base font-bold text-slate-800">Không tìm thấy kèo phù hợp</h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    Bạn có thể thử xóa bớt điều kiện lọc hoặc tự mình đứng ra làm Host đăng một kèo mới!
                  </p>
                  <div className="mt-4 flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={handleResetFilters}
                      className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 cursor-pointer transition-colors"
                    >
                      Xóa tất cả bộ lọc
                    </button>
                    <button
                      type="button"
                      onClick={handleOpenCreateMatch}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer transition-colors"
                    >
                      + Đăng kèo ngay
                    </button>
                  </div>
                </div>
              )
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4">
                {filteredMatches.map((m) => (
                  <MatchCard
                    key={m.id}
                    match={m}
                    currentUser={currentUser}
                    isBookmarked={bookmarkedIds.includes(m.id)}
                    onJoin={handleToggleJoin}
                    onSelect={handleOpenMatchDetail}
                    onToggleBookmark={handleToggleBookmark}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Cute Floating Mascot Bot Widget (Bé Cầu AI) */}
      <FloatingAIMascot
        onClick={handleOpenAIChat}
        showBackToTop={showBackToTop}
      />

      {/* Floating Back-to-Top Button (Imp 24) */}
      {showBackToTop && (
        <button
          type="button"
          onClick={scrollToTop}
          className="fixed bottom-36 sm:bottom-28 right-4 sm:right-6 z-30 w-11 h-11 rounded-full bg-white/95 hover:bg-white text-slate-700 hover:text-emerald-600 shadow-xl border border-slate-200 backdrop-blur-md flex items-center justify-center cursor-pointer transition-all active:scale-95 group"
          title="Cuộn lên đầu trang"
        >
          <ArrowUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      )}

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
            <span>Mã VietQR cọc slot</span>
            <span>•</span>
            <span>Kết nối Zalo Host</span>
          </div>
        </div>
      </footer>

      {/* ================= MOBILE BOTTOM NAVIGATION (HIDDEN ON DESKTOP) ================= */}
      <nav className="sm:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-200 px-6 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] flex items-center justify-around z-30 shadow-lg">
        <button
          type="button"
          onClick={() => setActiveTab('feed')}
          className={`flex flex-col items-center gap-1 transition-all cursor-pointer ${
            activeTab === 'feed' ? 'text-emerald-600 font-bold' : 'text-slate-400'
          }`}
        >
          <Compass className="w-5 h-5" />
          <span className="text-[10px]">Khám phá</span>
        </button>

        <button
          type="button"
          onClick={handleOpenCreateMatch}
          className="flex flex-col items-center -mt-6 group cursor-pointer"
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-lg shadow-emerald-600/30 active:scale-95 transition-all">
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </div>
          <span className="text-[10px] font-bold text-emerald-700 mt-0.5">Đăng kèo</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('my-matches')}
          className={`flex flex-col items-center gap-1 transition-all cursor-pointer ${
            activeTab === 'my-matches' ? 'text-emerald-600 font-bold' : 'text-slate-400'
          }`}
        >
          <CalendarCheck className="w-5 h-5" />
          <span className="text-[10px]">Kèo của tôi</span>
        </button>

        <button
          type="button"
          onClick={handleOpenProfile}
          className="flex flex-col items-center gap-1 text-slate-400 cursor-pointer"
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
            <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
              {/* 1. Khu vực (Quận / Huyện) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    Khu vực (TP.HCM)
                  </label>
                  {selectedDistrict !== 'Tất cả' && (
                    <button
                      type="button"
                      onClick={() => handleSelectDistrict('Tất cả')}
                      className="text-[11px] font-semibold text-rose-500 hover:text-rose-600 cursor-pointer"
                    >
                      Xóa lọc
                    </button>
                  )}
                </div>

                <div className="relative">
                  <select
                    value={selectedDistrict}
                    onChange={(e) => handleSelectDistrict(e.target.value)}
                    className="w-full pl-3 pr-8 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 focus:border-emerald-500 rounded-xl text-xs font-semibold text-slate-800 transition-all cursor-pointer appearance-none"
                  >
                    <option value="Tất cả">Toàn bộ TP.HCM (Tất cả quận)</option>
                    {districts
                      .filter((d) => d !== 'Tất cả')
                      .map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                <div className="flex flex-wrap gap-1 pt-0.5">
                  {['Tân Phú', 'Tân Bình', 'Bình Thạnh', 'Gò Vấp', 'Thủ Đức'].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => handleSelectDistrict(selectedDistrict === d ? 'Tất cả' : d)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer border ${
                        selectedDistrict === d
                          ? 'bg-emerald-600 text-white border-emerald-600 font-bold shadow-2xs'
                          : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-600'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Ca chơi trong ngày (2x2 cân xứng) */}
              <div className="pt-3 border-t border-slate-100 space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Ca chơi trong ngày
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { label: 'Tất cả ca', val: 'Tất cả' },
                    { label: 'Sáng (<12h)', val: 'morning' },
                    { label: 'Chiều (12-17h)', val: 'afternoon' },
                    { label: 'Tối (>17h)', val: 'evening' },
                  ].map((item) => (
                    <button
                      key={item.val}
                      type="button"
                      onClick={() => setSelectedTimeSlot(item.val as any)}
                      className={`py-2 px-2 rounded-xl text-xs font-semibold text-center transition-all cursor-pointer border ${
                        selectedTimeSlot === item.val
                          ? 'bg-emerald-600 text-white border-emerald-600 font-bold shadow-2xs'
                          : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Trình độ yêu cầu */}
              <div className="pt-3 border-t border-slate-100 space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-emerald-600" />
                    Trình độ yêu cầu
                  </label>
                  {selectedLevel !== 'Tất cả' && (
                    <button
                      type="button"
                      onClick={() => setSelectedLevel('Tất cả')}
                      className="text-[11px] font-semibold text-rose-500 hover:text-rose-600 cursor-pointer"
                    >
                      Xóa lọc
                    </button>
                  )}
                </div>

                <div className="relative">
                  <select
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                    className="w-full pl-3 pr-8 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 focus:border-emerald-500 rounded-xl text-xs font-semibold text-slate-800 transition-all cursor-pointer appearance-none"
                  >
                    {levels.map((lvl) => (
                      <option key={lvl} value={lvl}>
                        {lvl === 'Tất cả' ? 'Tất cả trình độ' : lvl === 'Hợp trình của tôi' ? '⭐ Hợp trình của tôi' : `Trình: ${lvl}`}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedLevel(selectedLevel === 'Hợp trình của tôi' ? 'Tất cả' : 'Hợp trình của tôi')}
                  className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 border ${
                    selectedLevel === 'Hợp trình của tôi'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                      : 'bg-emerald-50/70 hover:bg-emerald-100/80 text-emerald-800 border-emerald-200'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Kèo hợp trình của tôi ({currentUser.level})</span>
                </button>
              </div>

              {/* 6. Chỉ hiện kèo còn slot */}
              <div className="pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setOnlyAvailableSlots(!onlyAvailableSlots)}
                  className={`w-full flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer ${
                    onlyAvailableSlots
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-950 shadow-2xs'
                      : 'bg-slate-50/70 hover:bg-slate-100 border-slate-200 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center transition-colors ${
                        onlyAvailableSlots ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      <Users className="w-3.5 h-3.5" />
                    </div>
                    <div className="text-left">
                      <div className="text-xs font-bold leading-tight">Chỉ hiện kèo còn slot</div>
                      <div className="text-[11px] text-slate-500">Ẩn các sân đã nhận đủ người</div>
                    </div>
                  </div>
                  <div
                    className={`w-10 h-6 rounded-full transition-colors p-0.5 flex items-center ${
                      onlyAvailableSlots ? 'bg-emerald-600 justify-end' : 'bg-slate-300 justify-start'
                    }`}
                  >
                    <div className="w-5 h-5 rounded-full bg-white shadow-xs" />
                  </div>
                </button>
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

      {/* ================= CONFIRM JOIN DIALOG (Bug 4 / Imp 1) ================= */}
      {confirmJoinMatch && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setConfirmJoinMatch(null);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150"
        >
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl text-center space-y-4 animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-xl shadow-xs">
              🏸
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Xác nhận giữ slot tham gia</h3>
              <p className="text-xs text-slate-500 mt-1">
                Bạn sắp vào slot tại <strong>{confirmJoinMatch.courtName}</strong> ({confirmJoinMatch.startTime} - {confirmJoinMatch.endTime}, {confirmJoinMatch.date}).
              </p>
            </div>

            {/* Cảnh báo nếu trình độ của người chơi thấp hơn nhiều so với sân */}
            {(SKILL_LEVEL_SCORES[currentUser.level] ?? 3) < ((SKILL_LEVEL_SCORES[confirmJoinMatch.minLevel] ?? 0) - 1) && (
              <div className="p-2.5 bg-amber-50 rounded-xl text-[11px] text-amber-800 border border-amber-200 text-left flex items-start gap-1.5">
                <span className="text-sm">⚠️</span>
                <span>
                  Trình độ sân này ({confirmJoinMatch.minLevel} - {confirmJoinMatch.maxLevel}) cao hơn trình hiện tại của bạn ({currentUser.level}). Bạn hãy chắc chắn sẵn sàng để tránh bị ngộp trận nhé!
                </span>
              </div>
            )}

            <div className="p-3 bg-slate-50 rounded-2xl text-xs text-slate-600 space-y-1.5 text-left border border-slate-100">
              <div className="flex justify-between">
                <span className="text-slate-400">Chi phí:</span>
                <span className="font-bold text-slate-800">
                  Nam {confirmJoinMatch.priceMale.toLocaleString('vi-VN')} đ | Nữ {confirmJoinMatch.priceFemale.toLocaleString('vi-VN')} đ
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Yêu cầu trình:</span>
                <span className="font-bold text-teal-700">
                  {confirmJoinMatch.minLevel} ➔ {confirmJoinMatch.maxLevel}
                </span>
              </div>
              {confirmJoinMatch.bankInfo && (
                <div className="flex justify-between text-amber-700 font-semibold pt-1 border-t border-slate-200">
                  <span>Yêu cầu cọc trước:</span>
                  <span>{(confirmJoinMatch.bankInfo.depositAmount || 0).toLocaleString('vi-VN')} đ</span>
                </div>
              )}
            </div>

            {/* Yêu cầu cập nhật SĐT nếu tài khoản chưa có (Bug 9 / Imp 1) */}
            {!currentUser.phone && (
              <div className="p-3 bg-emerald-50/80 rounded-2xl text-left border border-emerald-200/80 space-y-1.5">
                <label className="text-[11px] font-bold text-emerald-950 block">
                  Số điện thoại / Zalo của bạn <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  value={joinPhoneInput}
                  onChange={(e) => setJoinPhoneInput(e.target.value)}
                  placeholder="VD: 0901234567..."
                  className="w-full px-3 py-2 rounded-xl bg-white border border-emerald-300 text-xs text-slate-800 focus:outline-emerald-500 font-medium"
                />
                <span className="text-[10px] text-emerald-700 block">
                  Host sẽ liên hệ qua Zalo số này để dặn dò giờ thi đấu.
                </span>
              </div>
            )}

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setConfirmJoinMatch(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                disabled={isJoining}
                onClick={async () => {
                  const mId = confirmJoinMatch.id;
                  let activeUser = currentUser;

                  if (!currentUser.phone) {
                    const clean = joinPhoneInput.trim().replace(/[^0-9]/g, '');
                    if (!isValidVietnamesePhone(clean)) {
                      alert('Vui lòng nhập đúng số điện thoại di động Việt Nam (10 số, bắt đầu 03, 05, 07, 08, 09) để Host liên hệ Zalo!');
                      return;
                    }
                    const formatted = formatPhoneNumber(clean);
                    activeUser = { ...currentUser, phone: formatted };
                    handleUpdateProfile({ phone: formatted });
                  }

                  setIsJoining(true);
                  setConfirmJoinMatch(null);
                  try {
                    await executeToggleJoin(mId, activeUser);
                  } finally {
                    setIsJoining(false);
                  }
                }}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold shadow-md shadow-emerald-600/20 active:scale-95 cursor-pointer disabled:opacity-50"
              >
                {isJoining ? 'Đang vào...' : 'Xác nhận giữ slot'}
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
        onEditMatch={handleEditMatch}
        onDeleteMatch={handleDeleteMatch}
        onAddGuest={handleAddGuest}
        onCloneMatch={handleCloneMatch}
        onTogglePlayerDeposit={handleTogglePlayerDeposit}
        onToggleLockMatch={handleToggleLockMatch}
        onQuickUpdateAnnouncement={handleQuickUpdateAnnouncement}
        onJoinWaitlist={handleJoinWaitlist}
      />

      <CreateMatchModal
        isOpen={isCreateOpen}
        currentUser={currentUser}
        editMatch={editingMatch}
        cloneMatch={cloningMatch}
        prefilledMatch={prefilledMatch}
        onClose={handleCloseCreateMatch}
        onCreate={handleCreateMatch}
        onUpdate={handleUpdateMatch}
      />

      <AIChatModal
        isOpen={isAIChatOpen}
        onClose={handleCloseAIChat}
        matches={matches}
        currentUser={currentUser}
        session={session}
        onOpenAuth={handleOpenAuth}
        onSelectMatch={handleOpenMatchDetail}
        onPrefillCreateMatch={handlePrefillCreateMatch}
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
        bookmarkedMatches={matches.filter((m) => bookmarkedIds.includes(m.id))}
        onClose={handleCloseProfile}
        onRetakeSurvey={() => {
          handleCloseProfile();
          handleOpenOnboarding();
        }}
        onSelectMatch={handleOpenMatchDetail}
        onUpdateProfile={handleUpdateProfile}
        onLogout={handleSignOut}
      />
    </div>
  );
}
