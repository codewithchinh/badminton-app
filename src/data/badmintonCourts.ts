export interface CourtInfo {
  id: string;
  name: string;
  address: string;
  district: string;
  googleMapsUrl: string;
  image?: string;
  presetCourtCount?: number;
}

export const BADMINTON_COURTS: CourtInfo[] = [
  // --- TÂN PHÚ ---
  {
    id: 'tp-celadon',
    name: 'CLB Cầu Lông Celadon Tân Phú',
    address: 'Số 2 Đường D2, P. Sơn Kỳ',
    district: 'Tân Phú',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=CLB+Cầu+Lông+Celadon+Tân+Phú',
    image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&auto=format&fit=crop&q=80',
    presetCourtCount: 6,
  },
  {
    id: 'tp-dsport',
    name: 'Sân Cầu Lông D-Sport Tân Phú',
    address: '62 Thoại Ngọc Hầu, P. Phú Thọ Hòa',
    district: 'Tân Phú',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+D-Sport+Tân+Phú+Thoại+Ngọc+Hầu',
    image: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=800&auto=format&fit=crop&q=80',
    presetCourtCount: 4,
  },
  {
    id: 'tp-thienvan',
    name: 'Sân Cầu Lông Thiên Vân',
    address: '19/41 Thoại Ngọc Hầu, P. Hòa Thạnh',
    district: 'Tân Phú',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Thiên+Vân+Tân+Phú',
    image: 'https://images.unsplash.com/photo-1521537634581-0dced2fee2ef?w=800&auto=format&fit=crop&q=80',
    presetCourtCount: 5,
  },
  {
    id: 'tp-tanviet',
    name: 'Sân Cầu Lông Tân Việt',
    address: '234 Bình Long, P. Phú Thạnh',
    district: 'Tân Phú',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Tân+Việt+Bình+Long+Tân+Phú',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80',
    presetCourtCount: 6,
  },
  {
    id: 'tp-hoangkim',
    name: 'Sân Cầu Lông Hoàng Kim',
    address: '111 Kênh 19/5, P. Sơn Kỳ',
    district: 'Tân Phú',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Hoàng+Kim+Kênh+19+5+Tân+Phú',
    image: 'https://images.unsplash.com/photo-1613918431703-81816e87f654?w=800&auto=format&fit=crop&q=80',
    presetCourtCount: 4,
  },
  {
    id: 'tp-tanphuc',
    name: 'Sân Cầu Lông Tấn Phúc',
    address: '118/22 Lũy Bán Bích, P. Tân Thới Hòa',
    district: 'Tân Phú',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Tấn+Phúc+Lũy+Bán+Bích+Tân+Phú',
    presetCourtCount: 3,
  },
  {
    id: 'tp-chelanvien',
    name: 'Sân Cầu Lông Chế Lan Viên',
    address: '108 Chế Lan Viên, P. Tây Thạnh',
    district: 'Tân Phú',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Chế+Lan+Viên+Tây+Thạnh+Tân+Phú',
    presetCourtCount: 4,
  },

  // --- BÌNH TÂN ---
  {
    id: 'bt-tenlua',
    name: 'Sân Cầu Lông Tên Lửa',
    address: '142 Đường Số 7, P. An Lạc A',
    district: 'Bình Tân',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Tên+Lửa+Bình+Tân',
    image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&auto=format&fit=crop&q=80',
    presetCourtCount: 6,
  },
  {
    id: 'bt-anlac',
    name: 'Sân Cầu Lông An Lạc',
    address: '520 Kinh Dương Vương, P. An Lạc',
    district: 'Bình Tân',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+An+Lạc+Kinh+Dương+Vương+Bình+Tân',
    image: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=800&auto=format&fit=crop&q=80',
    presetCourtCount: 5,
  },
  {
    id: 'bt-letrongtan',
    name: 'Sân Cầu Lông Lê Trọng Tấn',
    address: '450 Lê Trọng Tấn, P. Bình Hưng Hòa',
    district: 'Bình Tân',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Lê+Trọng+Tấn+Bình+Tân',
    presetCourtCount: 4,
  },
  {
    id: 'bt-tantao',
    name: 'Sân Cầu Lông Tân Tạo',
    address: 'Đường Số 53, P. Tân Tạo',
    district: 'Bình Tân',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Tân+Tạo+Bình+Tân',
    presetCourtCount: 4,
  },
  {
    id: 'bt-hoangyen',
    name: 'Sân Cầu Lông Hoàng Yến',
    address: 'Đường 18B, P. Bình Hưng Hòa A',
    district: 'Bình Tân',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Hoàng+Yến+18B+Bình+Tân',
    presetCourtCount: 4,
  },
  {
    id: 'bt-bahoam',
    name: 'Sân Cầu Lông Bà Hom',
    address: 'Tỉnh Lộ 10, P. Tân Tạo',
    district: 'Bình Tân',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Bà+Hom+Bình+Tân',
    presetCourtCount: 4,
  },

  // --- TÂN BÌNH ---
  {
    id: 'tb-viettel',
    name: 'Sân Cầu Lông Viettel',
    address: 'Hẻm 158 Hoàng Hoa Thám, P.12',
    district: 'Tân Bình',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Viettel+158+Hoàng+Hoa+Thám+Tân+Bình',
    image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&auto=format&fit=crop&q=80',
    presetCourtCount: 8,
  },
  {
    id: 'tb-gatructhang',
    name: 'Sân Cầu Lông Ga Trực Thăng',
    address: 'Hẻm 158 Hoàng Hoa Thám, P.12',
    district: 'Tân Bình',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Ga+Trực+Thăng+Tân+Bình',
    image: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=800&auto=format&fit=crop&q=80',
    presetCourtCount: 10,
  },
  {
    id: 'tb-a41',
    name: 'Sân Cầu Lông A41',
    address: 'Đường A41, Phường 2',
    district: 'Tân Bình',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+A41+Tân+Bình',
    presetCourtCount: 6,
  },
  {
    id: 'tb-haiau',
    name: 'Sân Cầu Lông Hải Âu',
    address: '39B Trường Sơn, P.4',
    district: 'Tân Bình',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Hải+Âu+Trường+Sơn+Tân+Bình',
    presetCourtCount: 5,
  },
  {
    id: 'tb-hongha',
    name: 'Sân Cầu Lông Hồng Hà',
    address: 'Hẻm 43 Hồng Hà, P.2',
    district: 'Tân Bình',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Hồng+Hà+Tân+Bình',
    presetCourtCount: 4,
  },
  {
    id: 'tb-tanson',
    name: 'Sân Cầu Lông Tân Sơn',
    address: '698/1 Tân Sơn, P.15',
    district: 'Tân Bình',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Tân+Sơn+P15+Tân+Bình',
    presetCourtCount: 6,
  },

  // --- THỦ ĐỨC (TP. THỦ ĐỨC) ---
  {
    id: 'td-tambinh',
    name: 'Sân Cầu Lông Tam Bình',
    address: '68 Đường Tam Bình, P. Tam Phú',
    district: 'Thủ Đức',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Tam+Bình+Thủ+Đức',
    image: 'https://images.unsplash.com/photo-1521537634581-0dced2fee2ef?w=800&auto=format&fit=crop&q=80',
    presetCourtCount: 6,
  },
  {
    id: 'td-binhtrieu',
    name: 'Sân Cầu Lông Bình Triệu',
    address: 'Quốc Lộ 13, P. Hiệp Bình Chánh',
    district: 'Thủ Đức',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Bình+Triệu+Thủ+Đức',
    presetCourtCount: 5,
  },
  {
    id: 'td-linhtrung',
    name: 'Sân Cầu Lông Linh Trung',
    address: 'Đường số 16, P. Linh Trung',
    district: 'Thủ Đức',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Linh+Trung+Thủ+Đức',
    presetCourtCount: 4,
  },
  {
    id: 'td-hiepbinhchanh',
    name: 'Sân Cầu Lông Hiệp Bình Chánh',
    address: 'Đường Số 25, P. Hiệp Bình Chánh',
    district: 'Thủ Đức',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Hiệp+Bình+Chánh+Thủ+Đức',
    presetCourtCount: 6,
  },
  {
    id: 'td-lananh',
    name: 'Sân Cầu Lông Lan Anh',
    address: 'Đường Số 9, P. Linh Tây',
    district: 'Thủ Đức',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Lan+Anh+Linh+Tây+Thủ+Đức',
    presetCourtCount: 4,
  },
  {
    id: 'td-tuonganh',
    name: 'Sân Cầu Lông Tường Anh',
    address: '52 Đỗ Xuân Hợp, P. Phước Long B',
    district: 'Thủ Đức',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Tường+Anh+Đỗ+Xuân+Hợp+Thủ+Đức',
    presetCourtCount: 7,
  },
  {
    id: 'td-thaodien',
    name: 'Sân Cầu Lông Thảo Điền',
    address: 'Quốc Hương, P. Thảo Điền',
    district: 'Thủ Đức',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Thảo+Điền+Quốc+Hương',
    presetCourtCount: 4,
  },

  // --- CÁC QUẬN TRỌNG ĐIỂM KHÁC TẠI TP.HCM ---
  {
    id: 'q10-kyhoa',
    name: 'CLB Cầu Lông Kỳ Hòa',
    address: 'Sư Vạn Hạnh, Phường 12',
    district: 'Quận 10',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=CLB+Cầu+Lông+Kỳ+Hòa+Quận+10',
    image: 'https://images.unsplash.com/photo-1613918431703-81816e87f654?w=800&auto=format&fit=crop&q=80',
    presetCourtCount: 12,
  },
  {
    id: 'q10-bachai',
    name: 'Sân Cầu Lông Bắc Hải',
    address: 'Thất Sơn, Phường 15',
    district: 'Quận 10',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Bắc+Hải+Quận+10',
    presetCourtCount: 5,
  },
  {
    id: 'gv-khangan',
    name: 'Sân Cầu Lông Khang An',
    address: '18A Phan Văn Trị, P.10',
    district: 'Gò Vấp',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Khang+An+Gò+Vấp',
    image: 'https://images.unsplash.com/photo-1521537634581-0dced2fee2ef?w=800&auto=format&fit=crop&q=80',
    presetCourtCount: 8,
  },
  {
    id: 'gv-datduc',
    name: 'Sân Cầu Lông Đạt Đức',
    address: '5A Bến Cát, P.17',
    district: 'Gò Vấp',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Đạt+Đức+Gò+Vấp',
    presetCourtCount: 8,
  },
  {
    id: 'bt-binhminh',
    name: 'Sân Cầu Lông Bình Minh',
    address: 'Bùi Đình Túy, P.12',
    district: 'Bình Thạnh',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Bình+Minh+Bình+Thạnh',
    image: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=800&auto=format&fit=crop&q=80',
    presetCourtCount: 4,
  },
  {
    id: 'q7-longvien',
    name: 'Sân Cầu Lông Long Viên',
    address: '414/29 Nguyễn Thị Thập, P. Tân Quy',
    district: 'Quận 7',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Long+Viên+Quận+7',
    presetCourtCount: 6,
  },
  {
    id: 'pn-daoduyanh',
    name: 'Sân Cầu Lông Đào Duy Anh',
    address: '21 Đào Duy Anh, P.9',
    district: 'Phú Nhuận',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Đào+Duy+Anh+Phú+Nhuận',
    presetCourtCount: 4,
  },
  {
    id: 'q1-cungvanhoa',
    name: 'Sân Cầu Lông Cung Văn Hóa Lao Động',
    address: '55B Nguyễn Thị Minh Khai, P. Bến Thành',
    district: 'Quận 1',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Cung+Văn+Hóa+Lao+Động+Quận+1',
    presetCourtCount: 4,
  },
  {
    id: 'q3-hoxuanhuong',
    name: 'Sân Cầu Lông Hồ Xuân Hương',
    address: '2 Hồ Xuân Hương, P. Võ Thị Sáu',
    district: 'Quận 3',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Hồ+Xuân+Hương+Quận+3',
    presetCourtCount: 4,
  },
];

// Hàm tìm kiếm sân theo từ khóa không dấu / có dấu
export function searchCourts(query: string): CourtInfo[] {
  if (!query || query.trim().length === 0) return [];

  const clean = query
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();

  return BADMINTON_COURTS.filter((court) => {
    const rawMatch = (court.name + ' ' + court.address + ' ' + court.district)
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
    return rawMatch.includes(clean);
  }).slice(0, 6);
}
