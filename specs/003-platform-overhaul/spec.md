# SPEC-003: Platform Overhaul - 10 Bugs & 30 Improvements

## 1. Overview & Objective
Nâng cấp toàn diện nền tảng kết nối kèo cầu lông TimVangLai.io.vn nhằm giải quyết triệt để 10 lỗi kỹ thuật/nghiệp vụ và triển khai 30 điểm cải thiện đã được kiểm chứng qua đợt rà soát ngày 05/11/2026.
Mục tiêu: Đưa trải nghiệm của cả **Người chơi vãng lai** và **Host đăng kèo** lên mức mượt mà, tin cậy, không lo bùng slot và tối ưu 100% trên thiết bị di động.

---

## 2. User Stories & Acceptance Criteria

### P1: Core Fixes & Player Experience
* **US1 (Search & Filters)**:
  - Tìm kiếm toàn diện theo tên sân, quận, tiêu đề và **địa chỉ đường** (`m.address`).
  - Hỗ trợ tiếng Việt không dấu (gõ "mã lò", "le van quoi", "tran nao" đều tìm ra).
  - Có nút `✕` xóa nhanh từ khóa trên cả Desktop và Mobile.
  - Bộ lọc ngày linh hoạt: Hôm nay, Ngày mai, Thứ 6, Thứ 7, Chủ Nhật, Thứ 2... (ngày động).
  - Bộ lọc ca chơi: Ca Sáng (<12h), Ca Chiều (12h-17h), Ca Tối (>17h).
  - Bộ lọc mức giá: <50k, 50k-80k, >80k.
* **US2 (Safe Joining & Zalo Connection)**:
  - Khi bấm "Vào ngay", hiển thị Bottom Sheet / Dialog xác nhận giữ slot để chống bấm nhầm khi cuộn trang.
  - Khi người chưa đăng nhập bấm tham gia, hệ thống lưu ý định (`pendingJoinMatchId`), sau khi đăng nhập xong tự động join ngay vào kèo đó.
  - Chuẩn hóa số điện thoại Host khi mở Zalo: loại bỏ khoảng trắng, dấu chấm, dấu gạch nối để link `zalo.me/...` không bao giờ bị lỗi.
  - Thêm hiệu ứng rung nhẹ (Haptic Feedback) khi giữ slot thành công trên điện thoại.

### P2: Host Power & Anti-Ghosting (Chống Bùng Slot)
* **US3 (Host Control - Edit & Delete)**:
  - Host có nút "Chỉnh sửa kèo" (Edit Match) để cập nhật giờ đánh, số sân, loại cầu, mức giá, lời nhắn.
  - Host có nút "Đóng / Hủy kèo" (Cancel Match) với xác nhận an toàn.
  - Host có thể sao chép bài đăng dạng văn bản định dạng đẹp (Copy bài đăng Facebook/Zalo) kèm emoji chỉ trong 1 chạm.
* **US4 (VietQR Deposit & Offline Slots)**:
  - Host có thể cấu hình tài khoản nhận cọc (Ngân hàng, Số TK, Tên chủ TK).
  - Chi tiết kèo tự động sinh mã VietQR động để vãng lai quét chuyển cọc 20k-50k.
  - Host có thể bấm "Khóa slot / Thêm người ngoài đời" để giữ chỗ cho bạn bè gọi điện ngoài đời.
  - Hiển thị bảng tính thu chi mini (tổng tiền thu dự kiến từ vãng lai).

### P3: Mobile UX & Polish
* **US5 (Responsive & Profile)**:
  - ProfileModal cho phép sửa Họ tên và Số điện thoại / Zalo trực tiếp.
  - Empty State sinh động khi một bộ lọc không có kèo nào.
  - Nút "Cuộn lên đầu" (Back to Top) khi cuộn dài.
  - Nhận diện kèo đã qua giờ kết thúc để gắn nhãn "Đã kết thúc".
  - Lưu quận yêu thích của người dùng vào `localStorage` (`timvanglai_preferred_district`).
  - Bổ sung nút "Lưu kèo" (Bookmark) để xem lại trong tab Kèo đã lưu.
