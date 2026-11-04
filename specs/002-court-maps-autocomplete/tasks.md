# Task Breakdown & Implementation Tracking: 002-court-maps-autocomplete

- **Mã tính năng:** `002-court-maps-autocomplete`
- **Tài liệu tham chiếu:** [`spec.md`](./spec.md) | [`plan.md`](./plan.md)
- **Trạng thái:** `Converged (Hoàn thành 100%)`

---

## Danh Sách Nhiệm Vụ (Task List)

### Phase 1: Chuẩn Bị & Thiết Kế Hợp Đồng Dữ Liệu
- [x] **T001**: Cập nhật `src/types.ts`, thêm `googleMapsUrl?: string;` và `coverImage?: string;` vào interface `MatchPost`.
- [x] **T002**: Xây dựng kho dữ liệu sân cầu lông chuẩn hóa `src/data/badmintonCourts.ts` bao phủ các khu vực ưu tiên (**Tân Phú, Bình Tân, Tân Bình, Thủ Đức** và các quận lân cận), kèm hàm tìm kiếm `searchCourts(query)`.

### Phase 2: Ánh Xạ Tương Thích Ngược Cơ Sở Dữ Liệu
- [x] **T003**: Cập nhật `src/supabase.ts`, bổ sung logic đóng gói và giải nén tag `[MAP:url]` và `[IMG:url]` trong hàm `toMatchPost` và `toDbRow`.
- [x] **T004**: Cập nhật dữ liệu mẫu trong `src/mockData.ts` để 4 bài đăng demo có link Google Maps chuẩn.

### Phase 3: Giao Diện Form Tạo Kèo (CreateMatchModal)
- [x] **T005**: Tích hợp ô tìm kiếm Autocomplete trong `src/components/CreateMatchModal.tsx`:
  - Lắng nghe sự kiện gõ tên sân, mở dropdown gợi ý danh sách sân thực tế trên Google Maps.
  - Khi chọn sân: tự động điền Tên sân, Địa chỉ, Quận và lưu `googleMapsUrl`.
  - Hiển thị huy hiệu xác thực vị trí Google Maps và nút `✕` xóa nhanh.
  - Cập nhật danh sách quận ưu tiên lên đầu trong dropdown chọn quận.
  - **Tuân thủ quy tắc chống rác dữ liệu:** Không ghi dữ liệu nhập tay của Host vào danh bạ dùng chung.

### Phase 4: Giao Diện Chi Tiết Kèo & Bộ Lọc
- [x] **T006**: Cập nhật `src/components/MatchDetailModal.tsx`: thêm nút **"📍 Chỉ đường"** mở Google Maps trực tiếp từ địa chỉ sân.
- [x] **T007**: Cập nhật danh sách quận trong bộ lọc trang chủ `src/App.tsx`, đưa **Tân Phú** và **Bình Tân** lên nhóm ưu tiên hàng đầu.

### Phase 5: Kiểm Thử Chất Lượng & Triển Khai
- [x] **T008**: Chạy `npm run build` (`tsc -b && vite build`) xác nhận 0 lỗi TypeScript và bundle đóng gói chuẩn xác.
- [x] **T009**: Tự rà soát kiểm thử (Self-Audit & Quality Fixes):
  - Khắc phục lỗi chuẩn hóa chữ `đ`/`Đ` trong tìm kiếm tiếng Việt không dấu (`src/data/badmintonCourts.ts`).
  - Bổ sung Click Outside và phím Escape để tự đóng dropdown gợi ý (`CreateMatchModal.tsx`).
  - Khắc phục lỗi lệch link Maps: tự động reset link Maps khi Host thay đổi tên sân sau khi chọn (`CreateMatchModal.tsx`).
  - Tối ưu `min-w-0 flex-1 break-words` chống tràn layout nút "Chỉ đường" trên màn hình điện thoại nhỏ (`MatchDetailModal.tsx`).
  - Tích hợp Browser History API & Hardware Back Button (`popstate`): Cho phép người dùng bấm nút Quay về (Back) trên điện thoại để đóng modal xem kèo/tạo kèo/bộ lọc thay vì bị văng khỏi trang web (`App.tsx`).
- [x] **T010**: Commit và push lên nhánh `main` của repository GitHub.
- [x] **T011**: Kiểm tra Vercel CI/CD xác nhận production live đạt HTTP 200 tại `https://timvanglai.io.vn`.

### Phase 6: Khắc Phục Dữ Liệu Sân Bình Tân, Trải Nghiệm Tải Ảnh & Loại Bỏ URL Input
- [x] **T012**: Bổ sung toàn diện danh bạ sân cầu lông chuẩn Google Maps tại khu vực ưu tiên Bình Tân & Tân Phú (`HAAN Badminton Club`, `Sân Cầu Lông Quang Huy`, `Aka Badminton Center`, `CLB Cầu Lông Bingo`, `Sân Cầu Lông Việt Phước`, `CLB Cầu Lông Minkyo`, `CLB Cầu Lông Hòa Bình (The B Hòa Bình)`, `CLB Cầu Lông T&T Hòa Bình`, `Sân Cầu Lông Thiên Khang`, v.v.).
- [x] **T013**: Cải tiến thuật toán tìm kiếm `searchCourts` với cơ chế xếp hạng (ranking) thông minh: Ưu tiên tuyệt đối các sân có tên trùng khớp từ khóa lên hàng đầu, xử lý triệt để ký tự đặc biệt, gõ không dấu/có dấu đều tìm thấy 100%.
- [x] **T014**: **Xóa bỏ hoàn toàn ô nhập URL ảnh (`<input type="url">`)** trong `CreateMatchModal.tsx`.
- [x] **T015**: Tích hợp tính năng **Tải ảnh trực tiếp từ điện thoại / máy tính** (`<input type="file" accept="image/*">`), tự động nén qua Canvas thành Base64 Data URL, có khung preview trực quan và 2 nút "Đổi ảnh" / "Xóa ảnh".
- [x] **T016**: Thêm mục **"Ảnh bạn đã dùng gần đây"** (Recent Images) được lưu trữ qua `localStorage`: Tự động ẩn hoàn toàn nếu Host chưa từng đăng bài (đúng như yêu cầu của người dùng), chỉ hiện khi đã có ảnh từng dùng.
- [x] **T017**: Làm mới bộ ảnh preset: Loại bỏ vĩnh viễn ảnh 404 (Kỳ Hòa) và ảnh tập gym (Bình Minh), chuẩn hóa 4 preset thể thao cầu lông chất lượng cao: Sân thảm xanh BWF, Sân trong nhà sáng đèn, VĐV bật nhảy đập cầu (Lin Dan style), Thi đấu đôi phong trào.

### Phase 7: Khắc Phục Triệt Để Nút Back Điện Thoại & Quét Toàn Diện 42 Sân Tân Phú
- [x] **T018**: Xử lý triệt để nút Back của điện thoại di động & cử chỉ vuốt trên tất cả các modal (`App.tsx`, `MatchDetailModal.tsx`, `CreateMatchModal.tsx`, `AuthModal.tsx`, `ProfileModal.tsx`, `OnboardingModal.tsx`):
  - Lắng nghe sự kiện `popstate` đóng modal an toàn, giữ người dùng ở lại trang chủ `timvanglai.io.vn`.
  - Hỗ trợ đóng modal khi bấm phím Escape và khi click vào vùng mờ (backdrop) bên ngoài khung modal.
- [x] **T019**: Loại bỏ 100% hình ảnh phòng tập gym nâng tạ (`photo-1534438327276`) và ảnh hỏng khỏi toàn bộ codebase (`MatchCard.tsx`, `MatchDetailModal.tsx`, `mockData.ts`, `supabase.ts`). Fallback mặc định về ảnh sân thảm thi đấu sắc nét.
- [x] **T020**: Nâng cấp danh bạ sân Tân Phú lên 42 sân chuẩn Google Maps (tổng danh bạ 140 sân): Bổ sung Sân 909 Trường Chinh, SD Badminton Club Kênh 19/5, Ecosport Gò Dầu, Ecosport Cách Mạng, SGB Vườn Lài, TTC Lương Minh Nguyệt, Nguyễn Trọng Quyền, Lan Minh Tô Hiệu, Bum Kênh Tân Hóa, Hồ Bơi Tây Thạnh, ĐH Công Thương (HUIT), Sân Thiên Vân Hẻm 19 Thoại Ngọc Hầu (19/41 & 19/57)...
- [x] **T021**: Nâng cấp thuật toán `searchCourts`: Tự động nhận diện token stop-words loại hình (`sân`, `clb`, `cầu lông`, `badminton`), chuẩn hóa tên có cả "Sân" và "CLB", hỗ trợ tìm theo số nhà, tên đường, hẻm, tên thương hiệu không phân biệt có/không dấu.
- [x] **T022**: Kiểm thử tự động 46 test cases tìm kiếm đạt 100% tỷ lệ đỗ (Pass rate: 100%), build production thành công 0 lỗi.

---

## Trạng Thái Đối Soát (Convergence Assessment)
- **Code vs Spec:** Khớp 100%. Toàn bộ phản hồi từ người dùng về dữ liệu sân và UI ảnh đã được giải quyết dứt điểm.
- **Tình trạng:** `CONVERGED`.
