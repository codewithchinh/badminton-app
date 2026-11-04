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
  // ==================== BÌNH TÂN (ƯU TIÊN HÀNG ĐẦU) ====================
  {
    id: 'bt-haan',
    name: 'HAAN Badminton Club (Sân Cầu Lông Haan)',
    address: '31A Đường số 4, P. Bình Hưng Hòa A',
    district: 'Bình Tân',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=HAAN+Badminton+Club+31A+Đường+số+4+Bình+Tân',
    presetCourtCount: 7,
  },
  {
    id: 'bt-quanghuy',
    name: 'Sân Cầu Lông Quang Huy',
    address: '110/2 Miếu Gò Xoài, P. Bình Hưng Hòa A',
    district: 'Bình Tân',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Quang+Huy+110+2+Miếu+Gò+Xoài+Bình+Tân',
    presetCourtCount: 7,
  },
  {
    id: 'bt-aka',
    name: 'Aka Badminton Center (Sân Cầu Lông Aka)',
    address: '730/4 Hương Lộ 2, P. Bình Trị Đông A',
    district: 'Bình Tân',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Aka+Badminton+Center+Hương+Lộ+2+Bình+Tân',
    presetCourtCount: 8,
  },
  {
    id: 'bt-tth',
    name: 'Sân Cầu Lông TTH',
    address: '137/203 Phan Anh, P. Bình Trị Đông',
    district: 'Bình Tân',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+TTH+Phan+Anh+Bình+Tân',
    presetCourtCount: 6,
  },
  {
    id: 'bt-bingo',
    name: 'Sân Cầu Lông Bingo',
    address: '1095 Tỉnh Lộ 10, P. Tân Tạo',
    district: 'Bình Tân',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Bingo+1095+Tỉnh+Lộ+10+Bình+Tân',
    presetCourtCount: 6,
  },
  {
    id: 'bt-binhhung',
    name: 'Sân Cầu Lông Bình Hưng',
    address: '548/80 Tân Kỳ Tân Quý, P. Bình Hưng Hòa A',
    district: 'Bình Tân',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Bình+Hưng+Tân+Kỳ+Tân+Quý+Bình+Tân',
    presetCourtCount: 6,
  },
  {
    id: 'bt-hoangphuc',
    name: 'Sân Cầu Lông Hoàng Phúc',
    address: 'Hẻm 132 Mã Lò, P. Bình Trị Đông A',
    district: 'Bình Tân',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Hoàng+Phúc+Mã+Lò+Bình+Tân',
    presetCourtCount: 4,
  },
  {
    id: 'bt-tenlua',
    name: 'Sân Cầu Lông Tên Lửa',
    address: '142 Đường Số 7, P. An Lạc A',
    district: 'Bình Tân',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Tên+Lửa+Đường+Số+7+Bình+Tân',
    presetCourtCount: 6,
  },
  {
    id: 'bt-anlac',
    name: 'Sân Cầu Lông An Lạc',
    address: '520 Kinh Dương Vương, P. An Lạc',
    district: 'Bình Tân',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+An+Lạc+Kinh+Dương+Vương+Bình+Tân',
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
    name: 'Sân Cầu Lông Tân Tạo (Bờ Tuyến)',
    address: '89 Bờ Tuyến, P. Tân Tạo A',
    district: 'Bình Tân',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Tân+Tạo+Bờ+Tuyến+Bình+Tân',
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
  {
    id: 'bt-vietphuoc',
    name: 'Sân Cầu Lông Việt Phước',
    address: '1A Liên Khu 1-6, P. Bình Trị Đông',
    district: 'Bình Tân',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Việt+Phước+Bình+Tân',
    presetCourtCount: 4,
  },

  // ==================== TÂN PHÚ (ƯU TIÊN HÀNG ĐẦU) ====================
  {
    id: 'tp-minkyo',
    name: 'CLB Cầu Lông Minkyo (Sân Cầu Lông Minkyo)',
    address: '262/26/2 Lũy Bán Bích, P. Hòa Thạnh',
    district: 'Tân Phú',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=CLB+Cầu+Lông+Minkyo+Lũy+Bán+Bích+Tân+Phú',
    presetCourtCount: 4,
  },
  {
    id: 'tp-hoabinh',
    name: 'CLB Cầu Lông Hòa Bình (The B Hòa Bình)',
    address: '316 Hòa Bình, P. Phú Thạnh (Giáp ranh Bình Tân, ngã 4 Bốn Xã, Lê Văn Quới)',
    district: 'Tân Phú',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=CLB+Cầu+Lông+Hòa+Bình+316+Hòa+Bình+Tân+Phú',
    presetCourtCount: 8,
  },
  {
    id: 'tp-tthoabinh',
    name: 'CLB Cầu Lông T&T Hòa Bình',
    address: '237/2/3 Hòa Bình, P. Hiệp Tân (Giáp ranh Bình Tân)',
    district: 'Tân Phú',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=CLB+Cầu+Lông+TT+Hòa+Bình+237+Hòa+Bình',
    presetCourtCount: 9,
  },
  {
    id: 'tp-thienkhang',
    name: 'Sân Cầu Lông Thiên Khang',
    address: '369 Thoại Ngọc Hầu, P. Phú Thạnh (Giáp ranh Bình Tân, ngã 4 Bốn Xã, Lê Văn Quới)',
    district: 'Tân Phú',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Thiên+Khang+369+Thoại+Ngọc+Hầu+Tân+Phú',
    presetCourtCount: 8,
  },
  {
    id: 'tp-celadon',
    name: 'CLB Cầu Lông Celadon Tân Phú',
    address: 'Số 2 Đường D2, P. Sơn Kỳ',
    district: 'Tân Phú',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=CLB+Cầu+Lông+Celadon+Tân+Phú',
    presetCourtCount: 6,
  },
  {
    id: 'tp-dsport',
    name: 'Sân Cầu Lông D-Sport Tân Phú',
    address: '62 Thoại Ngọc Hầu, P. Phú Thọ Hòa',
    district: 'Tân Phú',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+D-Sport+Tân+Phú+Thoại+Ngọc+Hầu',
    presetCourtCount: 4,
  },
  {
    id: 'tp-thienvan',
    name: 'Sân Cầu Lông Thiên Vân',
    address: '19/41 Thoại Ngọc Hầu, P. Hòa Thạnh',
    district: 'Tân Phú',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Thiên+Vân+Tân+Phú',
    presetCourtCount: 5,
  },
  {
    id: 'tp-tanviet',
    name: 'Sân Cầu Lông Tân Việt',
    address: '234 Bình Long, P. Phú Thạnh',
    district: 'Tân Phú',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Tân+Việt+Bình+Long+Tân+Phú',
    presetCourtCount: 6,
  },
  {
    id: 'tp-hoangkim',
    name: 'Sân Cầu Lông Hoàng Kim',
    address: '111 Kênh 19/5, P. Sơn Kỳ',
    district: 'Tân Phú',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Hoàng+Kim+Kênh+19+5+Tân+Phú',
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
  {
    id: 'tp-vuonlai',
    name: 'Sân Cầu Lông Vườn Lài',
    address: '124 Vườn Lài, P. Tân Thành',
    district: 'Tân Phú',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Vườn+Lài+Tân+Phú',
    presetCourtCount: 4,
  },
  {
    id: 'tp-taythanh',
    name: 'Sân Cầu Lông Tây Thạnh',
    address: 'Hẻm 30 Chế Lan Viên, P. Tây Thạnh',
    district: 'Tân Phú',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Tây+Thạnh+Tân+Phú',
    presetCourtCount: 6,
  },

  // ==================== TÂN BÌNH (ƯU TIÊN) ====================
  {
    id: 'tb-viettel',
    name: 'Sân Cầu Lông Viettel',
    address: 'Hẻm 158 Hoàng Hoa Thám, P.12',
    district: 'Tân Bình',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Viettel+158+Hoàng+Hoa+Thám+Tân+Bình',
    presetCourtCount: 8,
  },
  {
    id: 'tb-gatructhang',
    name: 'Sân Cầu Lông Ga Trực Thăng',
    address: 'Hẻm 158 Hoàng Hoa Thám, P.12',
    district: 'Tân Bình',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Ga+Trực+Thăng+Tân+Bình',
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
  {
    id: 'tb-songda',
    name: 'Sân Cầu Lông Sông Đà',
    address: '14 Lam Sơn, Phường 2',
    district: 'Tân Bình',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Sông+Đà+Tân+Bình',
    presetCourtCount: 5,
  },

  // ==================== THỦ ĐỨC (ƯU TIÊN) ====================
  {
    id: 'td-tambinh',
    name: 'Sân Cầu Lông Tam Bình',
    address: '68 Đường Tam Bình, P. Tam Phú',
    district: 'Thủ Đức',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Tam+Bình+Thủ+Đức',
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
    id: 'td-rangdong',
    name: 'Sân Cầu Lông Rạng Đông',
    address: '7 Đường Einstein, P. Bình Thọ',
    district: 'Thủ Đức',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Rạng+Đông+Thủ+Đức',
    presetCourtCount: 5,
  },

  // ==================== CÁC QUẬN TRỌNG ĐIỂM KHÁC ====================
  {
    id: 'q10-kyhoa',
    name: 'CLB Cầu Lông Kỳ Hòa',
    address: 'Sư Vạn Hạnh, Phường 12',
    district: 'Quận 10',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=CLB+Cầu+Lông+Kỳ+Hòa+Quận+10',
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

// Hàm chuẩn hóa tiếng Việt: xóa dấu thanh, mũ, chuyển đ/Đ thành d và loại bỏ ký tự đặc biệt
export function normalizeVietnamese(str: string): string {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Hàm tìm kiếm sân theo từ khóa không dấu / có dấu và xếp hạng thông minh
export function searchCourts(query: string): CourtInfo[] {
  if (!query || query.trim().length === 0) return [];

  const cleanQuery = normalizeVietnamese(query);
  const queryTokens = cleanQuery.split(' ').filter(Boolean);

  const matched = BADMINTON_COURTS.filter((court) => {
    const rawMatch = normalizeVietnamese(court.name + ' ' + court.address + ' ' + court.district);
    // Khớp nếu chứa toàn bộ các token gõ vào (vd gõ: "haan binh tan" hay "minkyo tan phu")
    return queryTokens.every((token) => rawMatch.includes(token));
  });

  // Ranking: Ưu tiên sân mà tên khớp với từ khóa lên đầu (tránh trường hợp từ khóa chỉ xuất hiện trong tên Phường)
  return matched
    .sort((a, b) => {
      const aName = normalizeVietnamese(a.name);
      const bName = normalizeVietnamese(b.name);
      const aNameMatch = queryTokens.every((t) => aName.includes(t));
      const bNameMatch = queryTokens.every((t) => bName.includes(t));
      if (aNameMatch && !bNameMatch) return -1;
      if (!aNameMatch && bNameMatch) return 1;
      return 0;
    })
    .slice(0, 8);
}
