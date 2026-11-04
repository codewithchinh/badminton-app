# Project Constitution: TimVangLai (Badminton Matchmaking App)

- **Dự án:** `badminton-app` (Tên miền chính thức: `https://timvanglai.io.vn`)
- **Phiên bản tài liệu:** 1.0.0
- **Ngày ban hành:** 04/11/2026

---

## 1. Nguyên Tắc Cốt Lõi (Core Principles)

### Điều 1: Code Phục Vụ Đặc Tả (Code Serves Specs)
- Đặc tả (`specs/NNN-<feature>/spec.md`) và Kế hoạch thực thi (`plan.md`) là chân lý duy nhất (Single Source of Truth).
- Code chỉ là kết quả phái sinh. Không tùy tiện chỉnh sửa code mà không làm rõ đặc tả và sự đồng ý của Product Owner (Người dùng).

### Điều 2: Tương Thích Ngược Cơ Sở Dữ Liệu (Backward Compatibility)
- Client ứng dụng giao tiếp với Supabase Cloud qua Anonymous Public Key, không có quyền thực thi DDL (`ALTER TABLE`).
- Mọi dữ liệu mở rộng mới phải có cơ chế fallback và đóng gói an toàn (ví dụ: tag `[IMG:...]`, `[MAP:...]` trong trường mở rộng) để đảm bảo không làm sập các bản ghi cũ hoặc các client khác.

### Điều 3: Kiểm Soát Rác Dữ Liệu & Chống Ô Nhiễm (Data Integrity & Anti-Pollution)
- **Tuyệt đối không tự động nạp dữ liệu do Host nhập tay vào danh mục dùng chung của hệ thống** (đặc biệt là danh bạ sân, địa chỉ, vị trí).
- Chỉ sử dụng dữ liệu đã được xác thực thực tế (Verified Google Maps places). Dữ liệu nhập tay của Host chỉ có hiệu lực cục bộ cho bài đăng cụ thể của họ.

### Điều 4: Minh Bạch Chi Phí & Rào Cản Kỹ Thuật (Zero Hidden Cost)
- Luôn ưu tiên các giải pháp tối ưu chi phí 0đ, không yêu cầu add thẻ tín dụng (Visa/Mastercard) quốc tế vào các nền tảng đám mây trừ khi có yêu cầu rõ ràng từ người dùng.
- Tránh các API tính phí theo lượt request (per-request charging) dễ bị khai thác hoặc vượt hạn mức.

### Điều 5: Cổng Kiểm Soát Chất Lượng Bắt Buộc (Mandatory Quality Gate)
- Trước khi thực hiện `git push` hoặc bàn giao: BẮT BUỘC phải chạy kiểm thử biên dịch `npm run build` (`tsc -b && vite build`) và đạt `0` lỗi TypeScript.
- Xác nhận trạng thái triển khai thực tế trên Production (Vercel HTTP 200, hash bundle khớp) trước khi tuyên bố hoàn thành.

### Điều 6: Toàn Diện Dữ Liệu Thực Tế (Comprehensive Real Data - Anti-Mocking)
- Tuyệt đối không hardcode dữ liệu mẫu (mock data) chắp vá vài mục mang tính tượng trưng khi xây dựng tính năng tìm kiếm, danh bạ hoặc định tuyến.
- Khi được giao xây dựng danh bạ theo khu vực ưu tiên: Bắt buộc phải thu thập đầy đủ, quét sạch theo từng địa bàn, từng trục đường giao thông thực tế.

### Điều 7: Nghiêm Cấm Sửa Lỗi Chắp Vá Đối Phó (Strict Ban on Reactive Patching)
- Khi người dùng phản ánh thiếu sót dữ liệu hoặc chỉ ra lỗi sót: NGHIÊM CẤM chỉ bổ sung đúng những mục người dùng nêu bằng miệng.
- Bắt buộc phải truy tìm nguyên nhân gốc rễ (Root Cause), mở rộng phạm vi và rà soát toàn diện 100% các mục còn lại của toàn bộ khu vực trước khi tuyên bố đã xử lý xong.
- Luôn xây dựng cơ chế Fallback thông minh để không bao giờ để người dùng rơi vào trạng thái kết quả trống rỗng hay tắc nghẽn luồng nghiệp vụ.

### Điều 8: Quy Trình Quét Lưới Địa Bàn Hành Chính (Administrative Grid Scan Protocol)
- Áp dụng bắt buộc cho mọi tác vụ thu thập danh bạ/địa điểm theo quận huyện:
  1. **Bóc tách theo danh sách tất cả các phường trực thuộc và các trục đường huyết mạch.** Tuyệt đối không search từ khóa chung chung.
  2. **Đối chiếu chéo đa nguồn:** Google Maps, diễn đàn thể thao, giải đấu phong trào địa phương.
  3. **Chuẩn hóa kép tên gọi & Từ khóa loại hình:** Chứa cả tiền tố `Sân Cầu Lông` và `CLB Cầu Lông`, địa chỉ chi tiết số nhà, hẻm, tên đường, tên phường.
  4. **Kiểm thử hồi quy tự động (Automated Regression Test):** Bắt buộc chạy script kiểm thử với hàng chục test cases thực tế (tên riêng, số nhà, tên đường, từ viết tắt) đạt tỷ lệ 100% pass trước khi báo cáo người dùng.
