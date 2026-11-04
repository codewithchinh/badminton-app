# Technical Plan: Kiến Trúc Autocomplete Sân & Google Maps Directions

- **Mã tính năng:** `002-court-maps-autocomplete`
- **Tài liệu đặc tả liên quan:** [`spec.md`](./spec.md)
- **Trạng thái:** `Implemented`

---

## 1. Quyết Định Kỹ Thuật (Architecture & Decisions)

### 1.1 Tại sao chọn Local Dataset Crawled thay vì Google Places API trực tiếp?
1. **Rào cản thẻ tín dụng:** Google Cloud Places API yêu cầu tài khoản thanh toán quốc tế (Billing Account) bắt buộc. Đối với dự án của sinh viên, việc yêu cầu thẻ Visa/Mastercard là rủi ro phát sinh chi phí ngoài ý muốn.
2. **Hiệu năng & Tốc độ:** Gọi API Google Maps ở client mỗi khi người dùng gõ phím gây độ trễ mạng (latency 300 - 800ms) và tiêu tốn quota. Trong khi đó, việc tìm kiếm trên bộ dữ liệu local được chuẩn hóa chỉ mất **dưới 1ms**, phản hồi tức thì 100%.
3. **Độ đặc thù:** Bộ dữ liệu chỉ tập trung vào các **sân cầu lông** (Badminton Courts), tránh việc trả về các địa điểm không liên quan (nhà hàng, quán cà phê trùng tên).

---

## 2. Hợp Đồng Dữ Liệu (Data Contracts & Interfaces)

### 2.1 Cấu trúc Sân Cầu Lông Chuẩn Hóa (`CourtInfo`)
Định nghĩa trong `src/data/badmintonCourts.ts`:
```typescript
export interface CourtInfo {
  id: string;              // Mã định danh duy nhất (vd: 'tp-celadon')
  name: string;            // Tên sân chuẩn (vd: 'CLB Cầu Lông Celadon Tân Phú')
  address: string;         // Số nhà, tên đường, phường (vd: 'Số 2 Đường D2, P. Sơn Kỳ')
  district: string;        // Quận chuẩn hóa theo bộ lọc (vd: 'Tân Phú')
  googleMapsUrl: string;   // Link dẫn đường chuẩn Google Maps
  image?: string;          // Ảnh sân thực tế chất lượng cao
  presetCourtCount?: number;// Số lượng sân mẫu
}
```

### 2.2 Cập nhật Interface `MatchPost`
Định nghĩa trong `src/types.ts`:
```typescript
export interface MatchPost {
  // ... các trường hiện có
  coverImage?: string;     // URL ảnh bìa bài đăng
  googleMapsUrl?: string;  // Link Google Maps dẫn đường
  // ...
}
```

---

## 3. Chiến Lược Tương Thích Ngược Database (Supabase Backward Compatibility)

- **Vấn đề:** Bảng `matches` trên Supabase Cloud hiện tại chỉ có các cột cố định và client sử dụng `anon key` không có quyền thực thi DDL (`ALTER TABLE`).
- **Giải pháp:** Sử dụng cơ chế đóng gói (Tag Packaging) an toàn trong cột `notes` (TEXT):
  - Khi lưu (`toDbRow`): 
    - Nếu có `googleMapsUrl`, gắn tiền tố: `[MAP:url]`.
    - Nếu có `coverImage`, gắn tiền tố: `[IMG:url]`.
  - Khi đọc (`toMatchPost`):
    - Dùng Regex bóc tách `[MAP:...]` để gán vào `match.googleMapsUrl`.
    - Dùng Regex bóc tách `[IMG:...]` để gán vào `match.coverImage`.
    - Làm sạch trường `notes` trước khi hiển thị cho người dùng.
    - Fallback: Nếu bài đăng cũ chưa có `googleMapsUrl`, tự động tạo URL tìm kiếm Google Maps từ:
      `https://www.google.com/maps/search/?api=1&query=${courtName}+${address}+${district}`.

---

## 4. Kiến Trúc Thành Phần Giao Diện (UI Component Flow)

```
[CreateMatchModal]
   │
   ├── Input `courtName` ───► onChange ───► searchCourts(query)
   │                                              │
   │                                        (normalize text)
   │                                              ▼
   ├── Dropdown List ◄──────────────────── Match Results (Top 6)
   │     │
   │     └── onClick Item ───► Auto-fill:
   │                             - courtName
   │                             - address
   │                             - district
   │                             - googleMapsUrl
   │                             - coverImage
   ▼
[Submit Match] ───► toDbRow ───► Supabase Cloud
   │
   ▼
[MatchDetailModal]
   │
   └── Địa chỉ sân ───► Nút "📍 Chỉ đường" (href={match.googleMapsUrl})
```
