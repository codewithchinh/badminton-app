# TASKS-003: Platform Overhaul Implementation Breakdown

## Phase 1: Data Model & Core Helper Upgrades
- [ ] **T001**: Extend `src/types.ts` with `MatchPost` and `UserProfile` metadata (status, bankInfo, amenities, targetGender, savedMatchIds).
- [ ] **T002**: Update `src/supabase.ts` with `toMatchPost` and `toDbRow` metadata serialization (`[META:json]`).

## Phase 2: Search, Filters & Algorithm Fixes
- [ ] **T003**: Fix search in `src/App.tsx` using `normalizeVietnamese` and adding `m.address`.
- [ ] **T004**: Add Topbar search clear button (`✕`) on Desktop & Mobile in `src/App.tsx`.
- [ ] **T005**: Add dynamic upcoming 7-day date filter in `src/App.tsx`.
- [ ] **T006**: Add time-of-day filter (Sáng, Chiều, Tối) and budget filter (<50k, 50k-80k, >80k).
- [ ] **T007**: Add session persistence for preferred district in `localStorage`.

## Phase 3: Player Experience & Safety (Anti-Misclick & Intent)
- [ ] **T008**: Add Join Confirmation Dialog in `src/components/MatchCard.tsx` and `src/App.tsx`.
- [ ] **T009**: Preserve `pendingJoinMatchId` on AuthModal login to resume joining automatically.
- [ ] **T010**: Sanitize Zalo phone link in `MatchDetailModal.tsx` and `MatchCard.tsx`.
- [ ] **T011**: Add Bookmark (Lưu kèo) functionality with local storage persistence.
- [ ] **T012**: Add Haptic feedback (`navigator.vibrate`) on action triggers.

## Phase 4: Host Capabilities & Anti-Ghosting (VietQR & Management)
- [ ] **T013**: Enable Edit Match Modal (reusing or extending CreateMatchModal) for Host in `MatchDetailModal.tsx`.
- [ ] **T014**: Enable Cancel / Delete Match for Host with confirmation in `MatchDetailModal.tsx`.
- [ ] **T015**: Add VietQR Deposit Card generator in `MatchDetailModal.tsx`.
- [ ] **T016**: Add "Sao chép bài đăng Facebook / Zalo" button in `MatchDetailModal.tsx`.
- [ ] **T017**: Add "Thêm slot ngoài đời (Khóa slot)" for Host in `MatchDetailModal.tsx`.
- [ ] **T018**: Add countdown timer to match start time in `MatchDetailModal.tsx`.

## Phase 5: Mobile UX, Profile & Polish
- [ ] **T019**: Make Phone & Full Name editable in `src/components/ProfileModal.tsx`.
- [ ] **T020**: Add lively Empty State when no matches match filters in `src/App.tsx`.
- [ ] **T021**: Add floating Back-to-Top button in `src/App.tsx`.
- [ ] **T022**: Add iOS Safe Area insets padding to bottom navigation in `src/App.tsx`.
- [ ] **T023**: Mark past matches as "Đã kết thúc" based on date and time.
- [ ] **T024**: Full compilation check, automated tests, git commit, push, and production verification.
