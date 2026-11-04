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
- [x] **T009**: Commit (`8213822`) và push lên nhánh `main` của repository GitHub.
- [x] **T010**: Kiểm tra Vercel CI/CD xác nhận production live đạt HTTP 200 tại `https://timvanglai.io.vn`.

---

## Trạng Thái Đối Soát (Convergence Assessment)
- **Code vs Spec:** Khớp 100%. Không có tính năng thừa thãi hoặc vi phạm nguyên tắc kiểm soát rác dữ liệu.
- **Tình trạng:** `CONVERGED`.
