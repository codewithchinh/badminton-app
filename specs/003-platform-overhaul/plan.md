# PLAN-003: Technical Implementation Plan for Platform Overhaul

## 1. Technical Architecture & Modifications

### A. Data Structures (`src/types.ts`)
* Extend `MatchPost`:
  - `status?: 'active' | 'completed' | 'cancelled'`
  - `amenities?: string[]`
  - `targetGender?: 'all' | 'male' | 'female'`
  - `bankInfo?: { bankName: string; accountNumber: string; accountName: string; depositAmount?: number }`
* Extend `UserProfile`:
  - `savedMatchIds?: string[]`

### B. Supabase Adapter (`src/supabase.ts`)
* Support encoding & decoding `bankInfo`, `amenities`, `targetGender`, `status` safely inside `notes` field tag format:
  `[META:json]` alongside existing `[IMG:...]` and `[MAP:...]`.

### C. Search & Filter Algorithm (`src/App.tsx`)
* Replace naive substring checks with `normalizeVietnamese`:
  Check against `m.title`, `m.courtName`, `m.district`, and `m.address`.
* Add Dynamic Date list generation:
  Generate array of upcoming 7 days with day-of-week: `Hôm nay`, `Ngày mai`, `Thứ 6 (06/11)`, etc.
* Add Time Slot filter (Sáng: <12h, Chiều: 12-17h, Tối: >=17h).
* Add Budget filter (<50k, 50k-80k, >80k).

### D. Component Refactoring & Extensions:
1. `MatchCard.tsx`:
   - Quick action button triggers Confirmation Modal instead of immediate join.
   - Bookmark toggle button.
   - Clean Zalo link phone format.
   - Status badge for past matches.
2. `MatchDetailModal.tsx`:
   - Host Actions: Edit Match button, Delete/Cancel Match button.
   - VietQR Deposit section (if Host provided bank info).
   - Copy Facebook/Zalo post text button.
   - Offline slot addition for Host.
   - Court amenities tags.
   - Cleaned Zalo phone link.
   - Live Countdown timer to match start time.
3. `CreateMatchModal.tsx` & `EditMatchModal.tsx`:
   - Support editing mode (passing existing match to edit).
   - Support adding Bank Info for VietQR deposits.
   - Amenities checkboxes (Thảm chuẩn, Máy lạnh/quạt, Giữ xe ô tô, Nước miễn phí).
   - Target gender selector (Cả Nam & Nữ, Chỉ tuyển Nữ, Chỉ tuyển Nam).
4. `ProfileModal.tsx`:
   - Editable Full Name and Phone/Zalo with Save button.
   - Displays user stats & saved matches.
5. `App.tsx`:
   - Back to top button.
   - Empty state illustration with CTA.
   - Preserves pending join match ID across login.
   - Safe area padding for mobile navigation.
