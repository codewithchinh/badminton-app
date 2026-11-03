import { useState, useMemo } from 'react';
import type { MatchPost, UserProfile } from './types';
import { INITIAL_USER, MOCK_MATCHES } from './mockData';
import { MatchCard } from './components/MatchCard';
import { MatchDetailModal } from './components/MatchDetailModal';
import { CreateMatchModal } from './components/CreateMatchModal';
import { OnboardingModal } from './components/OnboardingModal';
import { ProfileModal } from './components/ProfileModal';
import {
  Search,
  Plus,
  Compass,
  CalendarCheck,
  User,
  Sparkles,
  Zap,
  Smartphone,
  Monitor,
} from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile>(INITIAL_USER);
  const [matches, setMatches] = useState<MatchPost[]>(MOCK_MATCHES);
  const [selectedMatch, setSelectedMatch] = useState<MatchPost | null>(null);

  // Modals state
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // View mode: smartphone container or full screen
  const [isPhoneFrame, setIsPhoneFrame] = useState(true);

  // Active Bottom Tab: 'feed' | 'my-matches' | 'profile'
  const [activeTab, setActiveTab] = useState<'feed' | 'my-matches' | 'profile'>('feed');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('Tất cả');
  const [onlyMyLevel, setOnlyMyLevel] = useState(false);
  const [selectedDate, setSelectedDate] = useState('Tất cả');

  const districts = ['Tất cả', 'Quận 10', 'Tân Bình', 'Gò Vấp', 'Bình Thạnh'];
  const dates = ['Tất cả', 'Hôm nay', 'Ngày mai'];

  // Handle Instant Join / Leave
  const handleToggleJoin = (matchId: string) => {
    setMatches((prev) =>
      prev.map((m) => {
        if (m.id !== matchId) return m;
        const alreadyJoined = m.joinedPlayers.some((p) => p.userId === currentUser.id);

        if (alreadyJoined) {
          // Leave
          const updatedPlayers = m.joinedPlayers.filter((p) => p.userId !== currentUser.id);
          const updatedMatch = { ...m, joinedPlayers: updatedPlayers };
          if (selectedMatch?.id === matchId) setSelectedMatch(updatedMatch);
          return updatedMatch;
        } else {
          // Join immediately
          if (m.joinedPlayers.length >= m.totalSlots) {
            alert('Kèo này vừa đủ người rồi!');
            return m;
          }
          const updatedPlayers = [
            ...m.joinedPlayers,
            {
              userId: currentUser.id,
              name: currentUser.name,
              avatar: currentUser.avatar,
              level: currentUser.level,
              phone: currentUser.phone,
              joinedAt: 'Vừa xong',
            },
          ];
          const updatedMatch = { ...m, joinedPlayers: updatedPlayers };
          if (selectedMatch?.id === matchId) setSelectedMatch(updatedMatch);
          return updatedMatch;
        }
      })
    );
  };

  // Host removes a player
  const handleRemovePlayer = (matchId: string, playerId: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn hủy slot của người chơi này?')) return;
    setMatches((prev) =>
      prev.map((m) => {
        if (m.id !== matchId) return m;
        const updatedPlayers = m.joinedPlayers.filter((p) => p.userId !== playerId);
        const updatedMatch = { ...m, joinedPlayers: updatedPlayers };
        if (selectedMatch?.id === matchId) setSelectedMatch(updatedMatch);
        return updatedMatch;
      })
    );
  };

  // Create match
  const handleCreateMatch = (newMatch: MatchPost) => {
    setMatches((prev) => [newMatch, ...prev]);
    setSelectedMatch(newMatch);
    setIsDetailOpen(true);
  };

  // Filtered matches
  const filteredMatches = useMemo(() => {
    return matches.filter((m) => {
      // Tab filter
      if (activeTab === 'my-matches') {
        const isJoined = m.joinedPlayers.some((p) => p.userId === currentUser.id);
        if (!isJoined) return false;
      }

      // District
      if (selectedDistrict !== 'Tất cả' && m.district !== selectedDistrict) {
        return false;
      }

      // Date
      if (selectedDate !== 'Tất cả' && !m.date.includes(selectedDate)) {
        return false;
      }

      // Search text
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = m.title.toLowerCase().includes(q);
        const matchCourt = m.courtName.toLowerCase().includes(q);
        const matchDist = m.district.toLowerCase().includes(q);
        if (!matchTitle && !matchCourt && !matchDist) return false;
      }

      return true;
    });
  }, [matches, activeTab, selectedDistrict, selectedDate, searchQuery, currentUser]);

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-start p-0 sm:py-6 sm:px-4">
      {/* Top Toggle for Developer / User viewing frame */}
      <div className="hidden sm:flex items-center justify-between w-full max-w-md mb-3 text-xs text-slate-400">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-semibold text-slate-200">Badminton Hub Vietnam (MVP)</span>
        </div>
        <button
          type="button"
          onClick={() => setIsPhoneFrame(!isPhoneFrame)}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
        >
          {isPhoneFrame ? <Monitor className="w-3.5 h-3.5" /> : <Smartphone className="w-3.5 h-3.5" />}
          {isPhoneFrame ? 'Toàn màn hình' : 'Dạng điện thoại'}
        </button>
      </div>

      {/* Main Container: Mobile phone mockup or responsive web */}
      <div
        className={`w-full bg-slate-100 flex flex-col relative overflow-hidden transition-all duration-300 ${
          isPhoneFrame
            ? 'max-w-md sm:rounded-[40px] sm:shadow-2xl sm:border-[8px] sm:border-slate-800 h-[100dvh] sm:h-[844px]'
            : 'max-w-4xl rounded-2xl min-h-[90vh]'
        }`}
      >
        {/* App Header */}
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 pt-3 pb-2.5">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-600/30 font-black text-lg">
                🏸
              </div>
              <div>
                <h1 className="font-extrabold text-sm text-slate-900 tracking-tight leading-none">
                  Badminton<span className="text-emerald-600">Hub</span>
                </h1>
                <span className="text-[10px] text-slate-600 font-semibold uppercase tracking-wider">
                  Kèo Vãng Lai VN
                </span>
              </div>
            </div>

            {/* Profile badge / Calibrate level button */}
            <button
              type="button"
              onClick={() => setIsProfileOpen(true)}
              className="flex items-center gap-2 p-1.5 pl-2.5 rounded-full bg-slate-100 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 transition-all"
            >
              <div className="text-right">
                <div className="text-[11px] font-bold text-slate-800 leading-tight">
                  {currentUser.name}
                </div>
                <div className="text-[9px] font-extrabold text-emerald-800 uppercase">
                  Trình: {currentUser.level}
                </div>
              </div>
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-7 h-7 rounded-full object-cover border border-slate-300"
              />
            </button>
          </div>

          {/* Search bar */}
          <div className="mt-2.5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo sân, quận (VD: Viettel, Kỳ Hòa, Q.10...)"
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-100/90 border border-transparent focus:border-emerald-500 focus:bg-white text-xs text-slate-800 placeholder-slate-400 focus:outline-none transition-all"
            />
          </div>

          {/* Quick Filter Pills */}
          <div className="flex items-center gap-1.5 mt-2 overflow-x-auto pb-1 no-scrollbar text-xs">
            {districts.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setSelectedDistrict(d)}
                className={`px-3 py-1 rounded-full whitespace-nowrap font-medium text-[11px] transition-all ${
                  selectedDistrict === d
                    ? 'bg-emerald-600 text-white font-bold shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {d}
              </button>
            ))}

            {dates.map((dt) => (
              <button
                key={dt}
                type="button"
                onClick={() => setSelectedDate(dt)}
                className={`px-3 py-1 rounded-full whitespace-nowrap font-medium text-[11px] transition-all ${
                  selectedDate === dt
                    ? 'bg-teal-600 text-white font-bold shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {dt}
              </button>
            ))}

            <button
              type="button"
              onClick={() => setOnlyMyLevel(!onlyMyLevel)}
              className={`px-3 py-1 rounded-full whitespace-nowrap text-[11px] transition-all flex items-center gap-1 ${
                onlyMyLevel
                  ? 'bg-teal-600 text-white font-bold shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Sparkles className="w-3 h-3 text-yellow-400" />
              Hợp trình ({currentUser.level})
            </button>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-3.5 space-y-3 pb-24">
          {/* Active Banner for Drop-in Matching */}
          {activeTab === 'feed' && (
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-sm flex items-center justify-between">
              <div>
                <div className="text-xs font-bold flex items-center gap-1 text-emerald-100">
                  <Zap className="w-3.5 h-3.5 fill-yellow-300 text-yellow-300" />
                  Tuyển vãng lai tức thì
                </div>
                <div className="text-sm font-extrabold mt-0.5">Bấm là vào slot - Không trôi bài</div>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateOpen(true)}
                className="px-3 py-2 rounded-xl bg-white text-emerald-800 text-xs font-bold hover:bg-emerald-50 active:scale-95 transition-all shadow-xs shrink-0"
              >
                + Host đăng kèo
              </button>
            </div>
          )}

          {/* Tab Subtitle */}
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-slate-700">
              {activeTab === 'feed'
                ? `Kèo đang mở tuyển (${filteredMatches.length})`
                : `Kèo bạn đã tham gia (${filteredMatches.length})`}
            </span>
            <span className="text-[11px] text-slate-500">Cập nhật liên tục</span>
          </div>

          {/* Matches List */}
          {filteredMatches.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl p-6 border border-slate-100">
              <div className="text-3xl mb-2">🏸</div>
              <div className="text-sm font-bold text-slate-700">Chưa tìm thấy kèo phù hợp</div>
              <p className="text-xs text-slate-600 mt-1">
                Hãy thử chọn "Tất cả quận" hoặc đổi từ khóa tìm kiếm.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedDistrict('Tất cả');
                  setSelectedDate('Tất cả');
                  setSearchQuery('');
                  setOnlyMyLevel(false);
                }}
                className="mt-3 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700"
              >
                Đặt lại bộ lọc
              </button>
            </div>
          ) : (
            filteredMatches.map((m) => (
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
            ))
          )}
        </main>

        {/* Bottom Navigation Bar */}
        <nav className="absolute bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-6 py-2 flex items-center justify-around z-30">
          <button
            type="button"
            onClick={() => setActiveTab('feed')}
            className={`flex flex-col items-center gap-1 transition-all ${
              activeTab === 'feed' ? 'text-emerald-600 font-bold' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Compass className="w-5 h-5" />
            <span className="text-[10px]">Khám phá</span>
          </button>

          {/* Quick Create Match button */}
          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="flex flex-col items-center -mt-5 group"
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-lg shadow-emerald-600/30 group-active:scale-95 transition-all">
              <Plus className="w-6 h-6 stroke-[2.5]" />
            </div>
            <span className="text-[10px] font-bold text-emerald-700 mt-0.5">Đăng kèo</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('my-matches')}
            className={`flex flex-col items-center gap-1 transition-all ${
              activeTab === 'my-matches' ? 'text-emerald-600 font-bold' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <CalendarCheck className="w-5 h-5" />
            <span className="text-[10px]">Kèo của tôi</span>
          </button>

          <button
            type="button"
            onClick={() => setIsProfileOpen(true)}
            className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600 transition-all"
          >
            <User className="w-5 h-5" />
            <span className="text-[10px]">Cá nhân</span>
          </button>
        </nav>

        {/* Modals */}
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
            setCurrentUser(updated);
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
    </div>
  );
}
