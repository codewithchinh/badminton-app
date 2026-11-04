# Specification: Tự Động Gợi Ý Sân Cầu Lông & Liên Kết Chỉ Đường Google Maps

- **Mã tính năng:** `002-court-maps-autocomplete`
- **Trạng thái:** `Implemented & Verified`
- **Ngày hoàn thành:** 04/11/2026
- **Tác giả:** Người dùng & Antigravity Assistant

---

## 1. Bối cảnh & Mục tiêu (WHAT & WHY)

### 1.1 Vấn đề hiện tại
- Trước đây, khi Host tạo một kèo tuyển vãng lai mới trong `CreateMatchModal`, Host phải tự gõ thủ công toàn bộ: Tên sân, chọn Quận từ dropdown, và gõ Địa chỉ chi tiết.
- **Hệ quả tiêu cực:**
  1. Tốn nhiều thao tác nhập liệu trên điện thoại, làm giảm tỷ lệ Host đăng bài.
  2. Địa chỉ dễ bị sai chính tả hoặc thiếu thông tin (ví dụ chỉ ghi "Sân Viettel" mà không có số nhà, ngõ/hẻm, tên đường).
  3. Quận được chọn có thể không khớp với vị trí thực tế của sân, làm bộ lọc trang chủ hoạt động sai lệch.
  4. Người chơi khi xem bài đăng không có cách nào bấm 1 chạm để mở Google Maps dẫn đường đi tới sân.

### 1.2 Mục tiêu đề ra
- Cho phép Host chỉ cần gõ 1-2 ký tự tên sân, hệ thống sẽ tự động hiển thị gợi ý các sân cầu lông thực tế đã đăng ký trên Google Maps.
- Khi chọn một sân từ danh sách: **Tên sân, Địa chỉ chi tiết, và Quận / Huyện** sẽ được tự động điền đầy đủ.
- Tự động gắn kèm liên kết tọa độ/địa điểm Google Maps chuẩn xác vào bài đăng.
- Trong giao diện chi tiết kèo (`MatchDetailModal`), người chơi có thể bấm nút **"📍 Chỉ đường"** để mở ứng dụng Google Maps dẫn đường tức thì.
- **Chi phí & Ràng buộc:** Giải pháp phải hoạt động **miễn phí 100%**, không phụ thuộc vào thẻ tín dụng / Google Cloud Billing Account của sinh viên.

---

## 2. Quy Tắc Nghiệp Vụ Cốt Lõi (Business Rules & Constraints)

### 2.1 Quy Tắc Kiểm Soát Rác Dữ Liệu (Data Integrity & Anti-Spam)
- **Quy tắc tuyệt đối (Do Người dùng chỉ định):** 
  > **KHÔNG tự động nạp các sân do Host tự gõ tay vào danh bạ sân dùng chung của hệ thống.**
  - Host cũng chỉ là người dùng thông thường, có thể nhập sai chính tả, sai địa chỉ, hoặc nhập nội dung spam. Nếu hệ thống tự ý lưu sân mới vào DB chung mà chưa qua quy trình xác minh (Verification), dữ liệu sẽ nhanh chóng bị ô nhiễm.
  - Hệ thống CHỈ gợi ý các sân cầu lông đã được ban quản trị xác thực thực tế trên Google Maps.
  - Nếu Host gõ một sân mới ngoài danh bạ: Hệ thống vẫn cho phép tạo kèo bình thường (không chặn người dùng), nhưng dữ liệu đó CHỈ lưu riêng cho bài đăng của buổi giao lưu đó, TUYỆT ĐỐI KHÔNG ghi vào danh bạ sân chung.

### 2.2 Khu Vực Ưu Tiên (Priority Districts)
Tập trung nguồn dữ liệu chất lượng cao tại 4 khu vực trọng điểm theo yêu cầu:
1. **Quận Tân Phú**
2. **Quận Bình Tân**
3. **Quận Tân Bình**
4. **TP. Thủ Đức**
*(Kèm các quận thể thao lân cận: Quận 10, Gò Vấp, Bình Thạnh, Phú Nhuận, Quận 7, Quận 1, Quận 3).*

---

## 3. User Stories (Sắp xếp theo độ ưu tiên)

### User Story 1 (P1 - Host Tạo Kèo Nhanh)
> **Là một** Host muốn đăng tuyển người chơi vãng lai,  
> **Tôi muốn** khi gõ tên sân, hệ thống tự động gợi ý danh sách sân cầu lông có thật và tự điền địa chỉ + quận,  
> **Để** tôi có thể đăng bài trong vòng dưới 30 giây mà không cần nhớ số nhà hay tự chọn quận.

- **Tiêu chí kiểm thử độc lập (Acceptance Criteria):**
  - Gõ từ khóa không dấu hoặc có dấu (ví dụ: `cela`, `ten lua`, `tam binh`, `viettel`) -> Dropdown hiển thị các sân khớp.
  - Bấm chọn 1 sân -> Ô Tên sân, Địa chỉ, Quận nhảy giá trị chuẩn xác ngay lập tức.
  - Dropdown tự động đóng sau khi chọn.
  - Có nút `✕` để xóa và chọn lại nếu muốn.

### User Story 2 (P1 - Người Chơi Tìm Đường Đến Sân)
> **Là một** người chơi tìm được kèo phù hợp,  
> **Tôi muốn** bấm vào địa chỉ bài đăng để mở ứng dụng Google Maps dẫn đường,  
> **Để** tôi có thể di chuyển đến sân thi đấu đúng giờ mà không bị lạc.

- **Tiêu chí kiểm thử độc lập (Acceptance Criteria):**
  - Mở chi tiết bài đăng (`MatchDetailModal`) -> Thấy nút **"Chỉ đường"** bên cạnh địa chỉ sân.
  - Bấm vào nút -> Mở tab mới hoặc mở app Google Maps với tọa độ hoặc query tìm kiếm chính xác của sân đó.

### User Story 3 (P2 - Fallback Cho Sân Mới Ngoài Danh Bạ)
> **Là một** Host tổ chức đánh ở một sân mới mở chưa có trong danh bạ,  
> **Tôi muốn** vẫn có thể tự gõ tên sân và địa chỉ theo ý mình,  
> **Để** tôi không bị hệ thống chặn bài đăng.

- **Tiêu chí kiểm thử độc lập (Acceptance Criteria):**
  - Gõ tên sân không có trong gợi ý -> Vẫn điền các trường bình thường.
  - Tạo bài đăng thành công -> Hệ thống tự động sinh link Google Maps dạng Search Query (`query=court+address+district`).
  - Dữ liệu sân này không làm thay đổi danh bạ sân hệ thống.

---

## 4. Quality Checklist
- [x] Không làm gãy schema cơ sở dữ liệu `matches` trên Supabase Cloud.
- [x] Tìm kiếm linh hoạt tiếng Việt (hỗ trợ cả có dấu và không dấu).
- [x] Không yêu cầu thẻ thanh toán quốc tế (Visa/Mastercard) trên Google Cloud.
- [x] Kiểm tra tương thích giao diện trên cả Mobile (màn hình nhỏ) và Desktop.
- [x] `tsc -b` biên dịch 0 lỗi trước khi deploy production.
