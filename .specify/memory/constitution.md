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
