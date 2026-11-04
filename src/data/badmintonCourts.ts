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
  // ==================== TÂN PHÚ (ƯU TIÊN HÀNG ĐẦU - 42 SÂN TOÀN DIỆN) ====================
  {
    id: 'tp-minkyo',
    name: 'Sân Cầu Lông Minkyo (CLB Cầu Lông Minkyo)',
    address: '262/26/2 Lũy Bán Bích, P. Hòa Thạnh',
    district: 'Tân Phú',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=CLB+Cầu+Lông+Minkyo+262+Lũy+Bán+Bích+Tân+Phú',
    presetCourtCount: 4,
  },
  {
    id: 'tp-tuanhue',
    name: 'Sân Cầu Lông Tuấn Huệ (CLB Cầu Lông Tuấn Huệ)',
    address: '262/13 Lũy Bán Bích, P. Hòa Thạnh',
    district: 'Tân Phú',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=CLB+Cầu+Lông+Tuấn+Huệ+262+13+Lũy+Bán+Bích+Tân+Phú',
    presetCourtCount: 12,
  },
  {
    id: 'tp-dbadminton',
    name: 'Sân Cầu Lông D-Badminton (CLB D-Badminton Lũy Bán Bích)',
    address: '450 Lũy Bán Bích, P. Hòa Thạnh',
    district: 'Tân Phú',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+D-Badminton+450+Lũy+Bán+Bích+Tân+Phú',
    presetCourtCount: 5,
  },
  {
    id: 'tp-jardin',
    name: 'Sân Cầu Lông Jardin (CLB Cầu Lông Jardin)',
    address: '501/9 Lũy Bán Bích, P. Phú Thạnh',
    district: 'Tân Phú',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Jardin+501+9+Lũy+Bán+Bích+Tân+Phú',
    presetCourtCount: 4,
  },
  {
    id: 'tp-abc',
    name: 'Sân Cầu Lông ABC (CLB Cầu Lông ABC Lũy Bán Bích)',
    address: '710/53/2 Lũy Bán Bích (53/2 Lũy Bán Bích), P. Tân Thạnh',
    district: 'Tân Phú',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+ABC+Lũy+Bán+Bích+Tân+Phú',
    presetCourtCount: 3,
  },
  {
    id: 'tp-phuthinh',
    name: 'Sân Cầu Lông Phú Thịnh (CLB Cầu Lông Phú Thịnh)',
    address: '23C Lũy Bán Bích, P. Tân Thới Hòa',
    district: 'Tân Phú',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Phú+Thịnh+23C+Lũy+Bán+Bích+Tân+Phú',
    presetCourtCount: 6,
  },
  {
    id: 'tp-tanphuc',
    name: 'Sân Cầu Lông Tấn Phúc (CLB Cầu Lông Tấn Phúc)',
    address: '36/48 Huỳnh Thiện Lộc (118/22 Lũy Bán Bích), P. Hòa Thạnh',
    district: 'Tân Phú',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Tấn+Phúc+Huỳnh+Thiện+Lộc+Tân+Phú',
    presetCourtCount: 4,
  },
  {
    id: 'tp-hoabinh',
    name: 'Sân Cầu Lông Hòa Bình (CLB Cầu Lông The B Hòa Bình)',
    address: '314 - 316 Hòa Bình, P. Phú Thạnh (Giáp ranh Bình Tân, ngã 4 Bốn Xã, Lê Văn Quới)',
    district: 'Tân Phú',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=CLB+Cầu+Lông+Hòa+Bình+316+Hòa+Bình+Tân+Phú',
    presetCourtCount: 12,
  },
  {
    id: 'tp-tthoabinh',
    name: 'Sân Cầu Lông T&T Hòa Bình (CLB Cầu Lông T&T - TT Badminton)',
    address: '237/2/3 Hòa Bình, P. Hiệp Tân (Giáp ranh Bình Tân)',
    district: 'Tân Phú',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=CLB+Cầu+Lông+TT+Hòa+Bình+237+Hòa+Bình',
    presetCourtCount: 9,
  },
  {
    id: 'tp-thienkhang',
    name: 'Sân Cầu Lông Thiên Khang (CLB Cầu Lông Thiên Khang Thoại Ngọc Hầu)',
    address: '369 Thoại Ngọc Hầu, P. Phú Thạnh (Giáp ranh Bình Tân, ngã 4 Bốn Xã, Lê Văn Quới)',
    district: 'Tân Phú',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Thiên+Khang+369+Thoại+Ngọc+Hầu+Tân+Phú',
    presetCourtCount: 8,
  },
  {
    id: 'tp-thoainngochau',
    name: 'Sân Cầu Lông Thoại Ngọc Hầu (CLB Cầu Lông Thoại Ngọc Hầu 377)',
    address: '377 Thoại Ngọc Hầu, P. Hiệp Tân',
    district: 'Tân Phú',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Thoại+Ngọc+Hầu+377+Thoại+Ngọc+Hầu+Tân+Phú',
    presetCourtCount: 7,
  },
  {
    id: 'tp-nhomban',
    name: 'Sân Cầu Lông Nhóm Bạn (Cụm Sân Cầu Lông & Pickleball Nhóm Bạn)',
    address: '370 Thoại Ngọc Hầu, P. Phú Thạnh',
    district: 'Tân Phú',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Nhóm+Bạn+370+Thoại+Ngọc+Hầu+Tân+Phú',
    presetCourtCount: 6,
  },
  {
    id: 'tp-dsport',
    name: 'Sân Cầu Lông D-Sport Tân Phú (CLB D-Sport Thoại Ngọc Hầu)',
    address: '62 Thoại Ngọc Hầu, P. Phú Thọ Hòa',
    district: 'Tân Phú',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+D-Sport+Tân+Phú+Thoại+Ngọc+Hầu',
    presetCourtCount: 4,
  },
  {
    id: 'tp-thienvan1',
    name: 'Sân Cầu Lông Thiên Vân 1 (CLB Cầu Lông Thiên Vân - Hẻm 19 Thoại Ngọc Hầu)',
    address: '19/41 Thoại Ngọc Hầu (19/57 Thoại Ngọc Hầu), P. Hòa Thạnh',
    district: 'Tân Phú',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Thiên+Vân+19+Thoại+Ngọc+Hầu+Tân+Phú',
    presetCourtCount: 6,
  },
  {
    id: 'tp-thienvan2',
    name: 'Sân Cầu Lông Thiên Vân 2 (CLB Cầu Lông Thiên Vân Nguyễn Nghiêm)',
    address: '57 Nguyễn Nghiêm, P. Phú Trung',
    district: 'Tân Phú',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Thiên+Vân+57+Nguyễn+Nghiêm+Tân+Phú',
    presetCourtCount: 6,
  },
  {
    id: 'tp-celadon',
    name: 'Sân Cầu Lông Celadon (CLB Celadon Sports & Resort Club)',
    address: 'Số 2 Đường D2, Khu đô thị Celadon City, P. Sơn Kỳ',
    district: 'Tân Phú',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=CLB+Cầu+Lông+Celadon+Sports+Resort+Club+Tân+Phú',
    presetCourtCount: 10,
  },
  {
    id: 'tp-tanviet',
    name: 'Sân Cầu Lông Tân Việt (CLB Cầu Lông Tân Việt Bình Long)',
    address: '234 Bình Long, P. Phú Thạnh',
    district: 'Tân Phú',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Tân+Việt+Bình+Long+Tân+Phú',
    presetCourtCount: 4,
  },
  {
    id: 'tp-hoangkim',
    name: 'Sân Cầu Lông Hoàng Kim (CLB Cầu Lông Hoàng Kim)',
    address: '60 Nguyễn Háo Vĩnh (111 Kênh 19/5), P. Tân Quý',
    district: 'Tân Phú',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Hoàng+Kim+Nguyễn+Háo+Vĩnh+Tân+Phú',
    presetCourtCount: 3,
  },
  {
    id: 'tp-daphico',
    name: 'Sân Cầu Lông Dạ Phi Cơ (CLB Cầu Lông Dạ Phi Cơ Phạm Ngọc Thảo)',
    address: '86 Phạm Ngọc Thảo, P. Tây Thạnh',
    district: 'Tân Phú',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Dạ+Phi+Cơ+86+Phạm+Ngọc+Thảo+Tân+Phú',
    presetCourtCount: 4,
  },
  {
    id: 'tp-chelanvien',
    name: 'Sân Cầu Lông Chế Lan Viên (CLB Cầu Lông Chế Lan Viên)',
    address: '108 Chế Lan Viên, P. Tây Thạnh',
    district: 'Tân Phú',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Chế+Lan+Viên+Tân+Phú',
    presetCourtCount: 4,
  },
  {
    id: 'tp-titan',
    name: 'Sân Cầu Lông & Pickleball Titan Chế Lan Viên',
    address: 'Đường Chế Lan Viên, P. Tây Thạnh',
    district: 'Tân Phú',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Titan+Chế+Lan+Viên+Tân+Phú',
    presetCourtCount: 9,
  },
  {
    id: 'tp-taythanh',
    name: 'Sân Cầu Lông Tây Thạnh (Hồ Bơi Tây Thạnh - Khu Thể Thao Tây Thạnh)',
    address: '87 Chế Lan Viên & Dương Đức Hiền (Hẻm 30 Chế Lan Viên), P. Tây Thạnh',
    district: 'Tân Phú',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Hồ+Bơi+Tây+Thạnh+Chế+Lan+Viên+Tân+Phú',
    presetCourtCount: 9,
  },
  {
    id: 'tp-hbbadminton',
    name: 'Sân Cầu Lông HB Badminton (CLB HB Badminton Dương Văn Dương)',
    address: '29D Dương Văn Dương, P. Tân Sơn Nhì',
    district: 'Tân Phú',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+HB+Badminton+Dương+Văn+Dương+Tân+Phú',
    presetCourtCount: 5,
  },
  {
    id: 'tp-phongson',
    name: 'Sân Cầu Lông Phong Sơn (Nhà thi đấu THPT Tân Bình)',
    address: '19 Hoa Bằng, P. Tân Sơn Nhì',
    district: 'Tân Phú',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Phong+Sơn+19+Hoa+Bằng+Tân+Phú',
    presetCourtCount: 6,
  },
  {
    id: 'tp-sc252',
    name: 'Sân Cầu Lông SC252 (CLB Cầu Lông Phan Anh)',
    address: '252/18AC Phan Anh, P. Hiệp Tân',
    district: 'Tân Phú',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+SC252+Phan+Anh+Tân+Phú',
    presetCourtCount: 6,
  },
  {
    id: 'tp-vuonlai',
    name: 'Sân Cầu Lông Vườn Lài (CLB Cầu Lông Vườn Lài)',
    address: '124 Vườn Lài, P. Tân Thành',
    district: 'Tân Phú',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Vườn+Lài+Tân+Phú',
    presetCourtCount: 4,
  },
  {
    id: 'tp-tanphuclub',
    name: 'CLB Sân Cầu Lông Tân Phú',
    address: 'Huỳnh Văn Chính, P. Phú Trung',
    district: 'Tân Phú',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=CLB+Cầu+Lông+Tân+Phú+Huỳnh+Văn+Chính',
    presetCourtCount: 4,
  },
  {
    id: 'tp-phuthohoa',
    name: 'Sân Cầu Lông Phú Thọ Hòa (CLB Cầu Lông Lê Thúc Hoạch)',
    address: '110 Lê Thúc Hoạch, P. Phú Thọ Hòa',
    district: 'Tân Phú',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Lê+Thúc+Hoạch+Phú+Thọ+Hòa+Tân+Phú',
    presetCourtCount: 4,
  },
  {
    id: 'tp-909truongchinh',
    name: 'Sân Cầu Lông 909 Trường Chinh (CLB Cầu Lông Trường Chinh 909)',
    address: '909/6 Trường Chinh, P. Tây Thạnh',
    district: 'Tân Phú',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+909+Trường+Chinh+Tây+Thạnh+Tân+Phú',
    presetCourtCount: 10,
  },
  {
    id: 'tp-sdbadminton',
    name: 'Sân Cầu Lông SD (SD Badminton Club Kênh 19/5)',
    address: '93 Đường Kênh 19/5, P. Sơn Kỳ',
    district: 'Tân Phú',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+SD+93+Kênh+19+5+Sơn+Kỳ+Tân+Phú',
    presetCourtCount: 8,
  },
  {
    id: 'tp-ecosport-godau',
    name: 'Sân Cầu Lông Ecosport Gò Dầu (CLB Cầu Lông Ecosport)',
    address: '185/22 Gò Dầu, P. Tân Quý (Phú Thọ Hòa)',
    district: 'Tân Phú',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Ecosport+185+22+Gò+Dầu+Tân+Phú',
    presetCourtCount: 8,
  },
  {
    id: 'tp-ecosport-cachmang',
    name: 'Sân Cầu Lông Ecosport Tân Phú (CLB Ecosport Cách Mạng)',
    address: '15 Cách Mạng, P. Tân Sơn Nhì',
    district: 'Tân Phú',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Ecosport+15+Cách+Mạng+Tân+Sơn+Nhì+Tân+Phú',
    presetCourtCount: 7,
  },
  {
    id: 'tp-sgb-vuonlai',
    name: 'Sân Cầu Lông SGB Vườn Lài (CLB SGB Badminton Tân Hương)',
    address: '218/20 Vườn Lài (Hẻm 49A Tân Hương), P. Phú Thọ Hòa (Tân Quý)',
    district: 'Tân Phú',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+SGB+218+20+Vườn+Lài+Tân+Phú',
    presetCourtCount: 10,
  },
  {
    id: 'tp-ttc-badminton',
    name: 'Sân Cầu Lông - Pickleball TTC (CLB Cầu Lông Titan TTC Lương Minh Nguyệt)',
    address: '17/5/15 Lương Minh Nguyệt (Hẻm 58 Lũy Bán Bích), P. Tân Thới Hòa',
    district: 'Tân Phú',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=CLB+Cầu+Lông+TTC+17+5+15+Lương+Minh+Nguyệt+Tân+Thới+Hòa+Tân+Phú',
    presetCourtCount: 8,
  },
  {
    id: 'tp-nguyentrongquyen',
    name: 'Sân Cầu Lông Nguyễn Trọng Quyền (CLB Cầu Lông Nguyễn Trọng Quyền)',
    address: 'Số 1 Nguyễn Trọng Quyền, P. Tân Thới Hòa',
    district: 'Tân Phú',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Nguyễn+Trọng+Quyền+Tân+Thới+Hòa+Tân+Phú',
    presetCourtCount: 12,
  },
  {
    id: 'tp-lanminh',
    name: 'Sân Cầu Lông Lan Minh (CLB Cầu Lông Lan Minh Tô Hiệu)',
    address: '126 Tô Hiệu, P. Hiệp Tân',
    district: 'Tân Phú',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=CLB+Cầu+Lông+Lan+Minh+126+Tô+Hiệu+Hiệp+Tân+Tân+Phú',
    presetCourtCount: 6,
  },
  {
    id: 'tp-bumbadminton',
    name: 'Sân Cầu Lông Bum (Bum Badminton Kênh Tân Hóa)',
    address: '47/6 Kênh Tân Hóa, P. Tân Thới Hòa',
    district: 'Tân Phú',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Bum+Badminton+47+6+Kênh+Tân+Hóa+Tân+Phú',
    presetCourtCount: 3,
  },
  {
    id: 'tp-dhcongthuong',
    name: 'Sân Cầu Lông ĐH Công Thương TP.HCM (HUIT - ĐH Công Nghiệp Thực Phẩm)',
    address: '140 Lê Trọng Tấn & 86 Phạm Ngọc Thảo, P. Tây Thạnh',
    district: 'Tân Phú',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Trường+Đại+Học+Công+Thương+Lê+Trọng+Tấn+Tân+Phú',
    presetCourtCount: 4,
  },
  {
    id: 'tp-doclap',
    name: 'Sân Cầu Lông Độc Lập (CLB Cầu Lông Độc Lập)',
    address: 'Đường Độc Lập, P. Tân Thành',
    district: 'Tân Phú',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Độc+Lập+Tân+Thành+Tân+Phú',
    presetCourtCount: 4,
  },
  {
    id: 'tp-tanhuong',
    name: 'Sân Cầu Lông Tân Hương (Chợ Tân Hương)',
    address: 'Đường Tân Hương, P. Tân Quý',
    district: 'Tân Phú',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Tân+Hương+Tân+Quý+Tân+Phú',
    presetCourtCount: 4,
  },
  {
    id: 'tp-bobaotanthang',
    name: 'Sân Cầu Lông Bờ Bao Tân Thắng (Gần Aeon Mall Celadon)',
    address: 'Đường Bờ Bao Tân Thắng, P. Sơn Kỳ',
    district: 'Tân Phú',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Bờ+Bao+Tân+Thắng+Sơn+Kỳ+Tân+Phú',
    presetCourtCount: 6,
  },
  {
    id: 'tp-letrongtan',
    name: 'Sân Cầu Lông Lê Trọng Tấn Tân Phú',
    address: 'Đường Lê Trọng Tấn, P. Tây Thạnh',
    district: 'Tân Phú',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Lê+Trọng+Tấn+Tân+Phú',
    presetCourtCount: 6,
  },

  // ==================== BÌNH TÂN (ƯU TIÊN HÀNG ĐẦU - 23 SÂN) ====================
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
    id: 'bt-trungkien',
    name: 'Sân Cầu Lông Trung Kiên',
    address: '984 Tỉnh Lộ 10, P. Tân Tạo',
    district: 'Bình Tân',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Trung+Kiên+984+Tỉnh+Lộ+10+Bình+Tân',
    presetCourtCount: 5,
  },
  {
    id: 'bt-binhhung',
    name: 'Sân Cầu Lông Bình Hưng',
    address: '548/80 Tân Kỳ Tân Quý, P. Bình Hưng Hòa A',
    district: 'Bình Tân',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Bình+Hưng+Tân+Kỳ+Tân+Quý+Bình+Tân',
    presetCourtCount: 4,
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
    id: 'bt-ttvh',
    name: 'Sân Cầu Lông TTVH TDTT Quận Bình Tân',
    address: '565 Kinh Dương Vương, P. An Lạc',
    district: 'Bình Tân',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+TTVH+TDTT+Bình+Tân+565+Kinh+Dương+Vương',
    presetCourtCount: 3,
  },
  {
    id: 'bt-phulam',
    name: 'Sân Cầu Lông THPT Phú Lâm',
    address: 'Số 2 Đường số 2D, P. An Lạc',
    district: 'Bình Tân',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+THPT+Phú+Lâm+Bình+Tân',
    presetCourtCount: 4,
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
    presetCourtCount: 3,
  },
  {
    id: 'bt-pandabadminton',
    name: 'Sân Cầu Lông Panda Badminton',
    address: '65A Đường Lô Tư, P. Bình Hưng Hòa A',
    district: 'Bình Tân',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Panda+Badminton+Lô+Tư+Bình+Tân',
    presetCourtCount: 4,
  },
  {
    id: 'bt-huyphu',
    name: 'Sân Cầu Lông Huy Phú',
    address: 'Hẻm 413/41/4 Lê Văn Quới, P. Bình Trị Đông A',
    district: 'Bình Tân',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Huy+Phú+Lê+Văn+Quới+Bình+Tân',
    presetCourtCount: 4,
  },
  {
    id: 'bt-dannguyen88',
    name: 'Sân Cầu Lông Đan Nguyên 88',
    address: '85/92/8 Bình Thành, P. Bình Hưng Hòa B',
    district: 'Bình Tân',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Đan+Nguyên+88+Bình+Thành+Bình+Tân',
    presetCourtCount: 4,
  },
  {
    id: 'bt-namhoa',
    name: 'Sân Cầu Lông Nam Hòa',
    address: 'Liên Khu 8-9, P. Bình Hưng Hòa A',
    district: 'Bình Tân',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Nam+Hòa+Bình+Tân',
    presetCourtCount: 4,
  },
  {
    id: 'bt-tanhoadong',
    name: 'Sân Cầu Lông Tân Hòa Đông',
    address: 'Tân Hòa Đông, P. Bình Trị Đông',
    district: 'Bình Tân',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Tân+Hòa+Đông+Bình+Tân',
    presetCourtCount: 4,
  },
  {
    id: 'bt-khuongviet',
    name: 'Sân Cầu Lông Khương Việt',
    address: 'Lê Văn Quới, P. Bình Hưng Hòa A',
    district: 'Bình Tân',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Khương+Việt+Lê+Văn+Quới+Bình+Tân',
    presetCourtCount: 4,
  },

  // ==================== TÂN BÌNH (ƯU TIÊN - 16 SÂN) ====================
  {
    id: 'tb-viettel',
    name: 'Sân Cầu Lông Viettel',
    address: '158 Hoàng Hoa Thám, P.12',
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
    id: 'tb-k334',
    name: 'Sân Cầu Lông K334 (K34)',
    address: 'A75/6B/50 Bạch Đằng / K34 Hoàng Hoa Thám, P.2',
    district: 'Tân Bình',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+K334+K34+Tân+Bình',
    presetCourtCount: 8,
  },
  {
    id: 'tb-a41',
    name: 'Sân Cầu Lông A41',
    address: '18B Bạch Đằng / Đường A41, P.2',
    district: 'Tân Bình',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+A41+Bạch+Đằng+Tân+Bình',
    presetCourtCount: 6,
  },
  {
    id: 'tb-tanson',
    name: 'Sân Cầu Lông Tân Sơn',
    address: '698 Đường Tân Sơn, P.15',
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
  {
    id: 'tb-320truongchinh',
    name: 'Sân Cầu Lông 320 Trường Chinh',
    address: '320/2 Trường Chinh, P.13',
    district: 'Tân Bình',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+320+Trường+Chinh+Tân+Bình',
    presetCourtCount: 3,
  },
  {
    id: 'tb-buithixuan',
    name: 'Sân Cầu Lông Bùi Thị Xuân',
    address: 'Bùi Thị Xuân, Phường 2',
    district: 'Tân Bình',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Bùi+Thị+Xuân+Tân+Bình',
    presetCourtCount: 7,
  },
  {
    id: 'tb-dxp',
    name: 'Sân Cầu Lông DXP Tân Bình',
    address: 'Phường 14, Tân Bình',
    district: 'Tân Bình',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+DXP+Tân+Bình',
    presetCourtCount: 4,
  },
  {
    id: 'tb-29tdtt',
    name: 'Sân Cầu Lông 2/9 TDTT Tân Bình',
    address: 'Phường 1, Tân Bình',
    district: 'Tân Bình',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+2+9+TDTT+Tân+Bình',
    presetCourtCount: 8,
  },
  {
    id: 'tb-18bconghoa',
    name: 'Sân Cầu Lông 18B Cộng Hòa',
    address: '18B Cộng Hòa, Phường 4',
    district: 'Tân Bình',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+18B+Cộng+Hòa+Tân+Bình',
    presetCourtCount: 4,
  },
  {
    id: 'tb-632truongchinh',
    name: 'Sân Cầu Lông 632 Trường Chinh',
    address: '632 Trường Chinh, Phường 15',
    district: 'Tân Bình',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+632+Trường+Chinh+Tân+Bình',
    presetCourtCount: 4,
  },
  {
    id: 'tb-skybadminton',
    name: 'Sân Cầu Lông Sky Badminton Tân Bình',
    address: '58 Bạch Đằng, Phường 2',
    district: 'Tân Bình',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Sky+Badminton+Tân+Bình',
    presetCourtCount: 6,
  },
  {
    id: 'tb-quankhu7',
    name: 'Sân Cầu Lông Quân Khu 7',
    address: '202 Hoàng Văn Thụ, Phường 9',
    district: 'Tân Bình',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Quân+Khu+7+Hoàng+Văn+Thụ',
    presetCourtCount: 6,
  },
  {
    id: 'tb-hoangvanco',
    name: 'Sân Cầu Lông Hoàng Văn Cò',
    address: '14 Phan Thúc Duyện, Phường 4',
    district: 'Tân Bình',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Hoàng+Văn+Cò+Tân+Bình',
    presetCourtCount: 4,
  },
  {
    id: 'tb-hongha',
    name: 'Sân Cầu Lông Hồng Hà',
    address: 'Hồng Hà, Phường 2',
    district: 'Tân Bình',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Hồng+Hà+Tân+Bình',
    presetCourtCount: 4,
  },

  // ==================== THỦ ĐỨC (TP. THỦ ĐỨC - 22 SÂN) ====================
  {
    id: 'td-shbbadminton',
    name: 'Sân Cầu Lông SHB Badminton',
    address: '127 Lê Văn Chí, P. Linh Trung',
    district: 'Thủ Đức',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+SHB+Badminton+Lê+Văn+Chí+Thủ+Đức',
    presetCourtCount: 18,
  },
  {
    id: 'td-vanphuc',
    name: 'Sân Cầu Lông Vạn Phúc',
    address: 'Khu đô thị Vạn Phúc, P. Hiệp Bình Phước',
    district: 'Thủ Đức',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Vạn+Phúc+Khu+Đô+Thị+Vạn+Phúc+Thủ+Đức',
    presetCourtCount: 12,
  },
  {
    id: 'td-tadabinhloi',
    name: 'Sân Cầu Lông Tada Bình Lợi',
    address: '42 Kha Vạn Cân, P. Hiệp Bình Chánh',
    district: 'Thủ Đức',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Tada+Bình+Lợi+Kha+Vạn+Cân+Thủ+Đức',
    presetCourtCount: 10,
  },
  {
    id: 'td-68khavancan',
    name: 'Sân Cầu Lông 68',
    address: '230A Kha Vạn Cân, P. Linh Trung',
    district: 'Thủ Đức',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+68+Kha+Vạn+Cân+Thủ+Đức',
    presetCourtCount: 3,
  },
  {
    id: 'td-tambinh',
    name: 'Sân Cầu Lông Tam Bình',
    address: '68 Đường Tam Bình, P. Tam Phú',
    district: 'Thủ Đức',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Tam+Bình+Thủ+Đức',
    presetCourtCount: 6,
  },
  {
    id: 'td-rangdong',
    name: 'Sân Cầu Lông Rạng Đông',
    address: '7 Đường Einstein, P. Bình Thọ',
    district: 'Thủ Đức',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Rạng+Đông+Thủ+Đức',
    presetCourtCount: 5,
  },
  {
    id: 'td-tuonganh',
    name: 'Sân Cầu Lông Tường Anh',
    address: '56/1 Đường số 2, P. Trường Thọ',
    district: 'Thủ Đức',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Tường+Anh+Đường+số+2+Thủ+Đức',
    presetCourtCount: 6,
  },
  {
    id: 'td-langthieunien',
    name: 'Sân Cầu Lông Làng Thiếu Niên',
    address: '249 Đặng Văn Bi, P. Bình Thọ',
    district: 'Thủ Đức',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Làng+Thiếu+Niên+Đặng+Văn+Bi+Thủ+Đức',
    presetCourtCount: 4,
  },
  {
    id: 'td-ankhanh',
    name: 'Sân Cầu Lông An Khánh',
    address: '26 Lương Định Của, P. An Khánh (Quận 2 cũ)',
    district: 'Thủ Đức',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+An+Khánh+26+Lương+Định+Của+Thủ+Đức',
    presetCourtCount: 11,
  },
  {
    id: 'td-khanhhong',
    name: 'Sân Cầu Lông Khánh Hồng',
    address: '34/9 Đường số 34, P. Bình An (Quận 2 cũ)',
    district: 'Thủ Đức',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Khánh+Hồng+Đường+34+Thủ+Đức',
    presetCourtCount: 6,
  },
  {
    id: 'td-binhan',
    name: 'Sân Cầu Lông Bình An',
    address: '11B Đường số 29, P. Bình An (Quận 2 cũ)',
    district: 'Thủ Đức',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Bình+An+Đường+29+Thủ+Đức',
    presetCourtCount: 5,
  },
  {
    id: 'td-lavie2',
    name: 'Sân Cầu Lông Lavie 2',
    address: '40 Lương Định Của, P. An Khánh (Quận 2 cũ)',
    district: 'Thủ Đức',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Lavie+2+Lương+Định+Của+Thủ+Đức',
    presetCourtCount: 6,
  },
  {
    id: 'td-thaodien',
    name: 'Sân Cầu Lông Thảo Điền',
    address: 'Quốc Hương, P. Thảo Điền (Quận 2 cũ)',
    district: 'Thủ Đức',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Thảo+Điền+Quốc+Hương',
    presetCourtCount: 4,
  },
  {
    id: 'td-limited',
    name: 'Sân Cầu Lông Limited Badminton',
    address: '992 Nguyễn Duy Trinh, P. Phú Hữu (Quận 9 cũ)',
    district: 'Thủ Đức',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Limited+Badminton+Nguyễn+Duy+Trinh+Thủ+Đức',
    presetCourtCount: 9,
  },
  {
    id: 'td-skynguyenxien',
    name: 'Sân Cầu Lông Sky Badminton Nguyễn Xiển',
    address: '462/9 Nguyễn Xiển, P. Long Thạnh Mỹ (Quận 9 cũ)',
    district: 'Thủ Đức',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Sky+Badminton+Nguyễn+Xiển+Thủ+Đức',
    presetCourtCount: 8,
  },
  {
    id: 'td-hita',
    name: 'Sân Cầu Lông HITA',
    address: '44/8 Hoàng Hữu Nam, P. Long Thạnh Mỹ (Quận 9 cũ)',
    district: 'Thủ Đức',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+HITA+Hoàng+Hữu+Nam+Thủ+Đức',
    presetCourtCount: 6,
  },
  {
    id: 'td-lanh',
    name: 'Sân Cầu Lông Lanh',
    address: '14 Đường số 359, P. Phước Long (Quận 9 cũ)',
    district: 'Thủ Đức',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Lanh+Đường+359+Thủ+Đức',
    presetCourtCount: 6,
  },
  {
    id: 'td-tamkhoe',
    name: 'Sân Cầu Lông Tám Khỏe',
    address: '270 Bưng Ông Thoàn, P. Tăng Nhơn Phú B (Quận 9 cũ)',
    district: 'Thủ Đức',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Tám+Khỏe+Bưng+Ông+Thoàn+Thủ+Đức',
    presetCourtCount: 4,
  },
  {
    id: 'td-longtruong',
    name: 'Sân Cầu Lông Long Trường',
    address: '1381 Nguyễn Duy Trinh, P. Long Trường',
    district: 'Thủ Đức',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Long+Trường+Thủ+Đức',
    presetCourtCount: 4,
  },
  {
    id: 'td-linhdong',
    name: 'Sân Cầu Lông Linh Đông',
    address: '22 Kha Vạn Cân, P. Linh Đông',
    district: 'Thủ Đức',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Linh+Đông+Thủ+Đức',
    presetCourtCount: 4,
  },
  {
    id: 'td-hiepbinh',
    name: 'Sân Cầu Lông Hiệp Bình',
    address: 'Hiệp Bình, P. Hiệp Bình Chánh',
    district: 'Thủ Đức',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Hiệp+Bình+Thủ+Đức',
    presetCourtCount: 4,
  },
  {
    id: 'td-tangnhonphu',
    name: 'Sân Cầu Lông Tăng Nhơn Phú',
    address: 'Lê Văn Việt, P. Tăng Nhơn Phú A',
    district: 'Thủ Đức',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Tăng+Nhơn+Phú+Thủ+Đức',
    presetCourtCount: 4,
  },

  // ==================== GÒ VẤP (10 SÂN) ====================
  {
    id: 'gv-khangan',
    name: 'Sân Cầu Lông Khang An',
    address: '18A Phan Văn Trị, P.10',
    district: 'Gò Vấp',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Khang+An+Gò+Vấp',
    presetCourtCount: 11,
  },
  {
    id: 'gv-daiphat',
    name: 'Sân Cầu Lông Đại Phát',
    address: '313/17 Phan Huy Ích, P.14',
    district: 'Gò Vấp',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Đại+Phát+Phan+Huy+Ích+Gò+Vấp',
    presetCourtCount: 14,
  },
  {
    id: 'gv-riansports',
    name: 'Sân Cầu Lông Rian Sports (Enjoy cũ)',
    address: '185B Nguyễn Oanh, P.10',
    district: 'Gò Vấp',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Rian+Sports+Nguyễn+Oanh+Gò+Vấp',
    presetCourtCount: 8,
  },
  {
    id: 'gv-vysport',
    name: 'Sân Cầu Lông Vy Sport',
    address: 'Hẻm 424 Phan Văn Trị, P.5',
    district: 'Gò Vấp',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Vy+Sport+Phan+Văn+Trị+Gò+Vấp',
    presetCourtCount: 3,
  },
  {
    id: 'gv-chauduong',
    name: 'Sân Cầu Lông Châu Dương Gò Vấp',
    address: '16 Đường số 53, P.14',
    district: 'Gò Vấp',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Châu+Dương+Đường+53+Gò+Vấp',
    presetCourtCount: 4,
  },
  {
    id: 'gv-datduc',
    name: 'Sân Cầu Lông Đạt Đức',
    address: '5A Nguyễn Văn Lượng, P.16',
    district: 'Gò Vấp',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Đạt+Đức+Gò+Vấp',
    presetCourtCount: 6,
  },
  {
    id: 'gv-bencat',
    name: 'Sân Cầu Lông Bến Cát',
    address: '173 Dương Quảng Hàm, P.5',
    district: 'Gò Vấp',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Bến+Cát+Dương+Quảng+Hàm+Gò+Vấp',
    presetCourtCount: 4,
  },
  {
    id: 'gv-quangtrung',
    name: 'Sân Cầu Lông Quang Trung',
    address: 'Hẻm 688 Quang Trung, P.11',
    district: 'Gò Vấp',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Quang+Trung+Gò+Vấp',
    presetCourtCount: 4,
  },
  {
    id: 'gv-giaothong',
    name: 'Sân Cầu Lông Giao Thông Vận Tải',
    address: '448 Lê Văn Thọ, P.16',
    district: 'Gò Vấp',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Giao+Thông+Vận+Tải+Lê+Văn+Thọ+Gò+Vấp',
    presetCourtCount: 4,
  },
  {
    id: 'gv-phanvanphi',
    name: 'Sân Cầu Lông Phan Văn Trị',
    address: 'Phan Văn Trị, P.7',
    district: 'Gò Vấp',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Phan+Văn+Trị+Gò+Vấp',
    presetCourtCount: 4,
  },

  // ==================== QUẬN 10 & QUẬN 11 (10 SÂN) ====================
  {
    id: 'q10-kyhoa',
    name: 'CLB Cầu Lông Kỳ Hòa',
    address: '238 Đường 3 Tháng 2, Phường 12',
    district: 'Quận 10',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=CLB+Cầu+Lông+Kỳ+Hòa+Quận+10',
    presetCourtCount: 4,
  },
  {
    id: 'q10-291',
    name: 'Sân Cầu Lông 291',
    address: '291 Hẻm 285 Cách Mạng Tháng Tám, Phường 12',
    district: 'Quận 10',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+291+Cách+Mạng+Tháng+Tám+Quận+10',
    presetCourtCount: 4,
  },
  {
    id: 'q10-bachai',
    name: 'Sân Cầu Lông Bắc Hải',
    address: 'LL1 Bis Hương Giang, Cư xá Bắc Hải, Phường 15',
    district: 'Quận 10',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Bắc+Hải+Hương+Giang+Quận+10',
    presetCourtCount: 4,
  },
  {
    id: 'q10-thanhthai',
    name: 'Sân Cầu Lông Thành Thái',
    address: '7/1 Thành Thái, Phường 14',
    district: 'Quận 10',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Thành+Thái+Quận+10',
    presetCourtCount: 4,
  },
  {
    id: 'q11-phutho',
    name: 'Sân Cầu Lông Nhà Tập Luyện Phú Thọ',
    address: '219 Lý Thường Kiệt (Lầu 3), Phường 15',
    district: 'Quận 11',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Nhà+Tập+Luyện+Phú+Thọ+Quận+11',
    presetCourtCount: 12,
  },
  {
    id: 'q11-binhthoi',
    name: 'Sân Cầu Lông Bình Thới',
    address: '53 Đường số 100 Bình Thới, Phường 14',
    district: 'Quận 11',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Bình+Thới+Đường+100+Quận+11',
    presetCourtCount: 10,
  },
  {
    id: 'q11-chauduong',
    name: 'Sân Cầu Lông Châu Dương Quận 11',
    address: '185 Lê Thị Bạch Cát, Phường 11',
    district: 'Quận 11',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Châu+Dương+Lê+Thị+Bạch+Cát+Quận+11',
    presetCourtCount: 8,
  },
  {
    id: 'q11-thienminh',
    name: 'Sân Cầu Lông Thiên Minh',
    address: '117 Lạc Long Quân, Phường 1',
    district: 'Quận 11',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Thiên+Minh+Lạc+Long+Quân+Quận+11',
    presetCourtCount: 6,
  },
  {
    id: 'q11-lequydon',
    name: 'Sân Cầu Lông Lê Quý Đôn',
    address: '343D Lạc Long Quân (Cổng sau THCS Lê Quý Đôn), Phường 5',
    district: 'Quận 11',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Lê+Quý+Đôn+Lạc+Long+Quân+Quận+11',
    presetCourtCount: 4,
  },
  {
    id: 'q11-damsen',
    name: 'Sân Cầu Lông Đầm Sen',
    address: 'Hòa Bình, Phường 3',
    district: 'Quận 11',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Đầm+Sen+Quận+11',
    presetCourtCount: 4,
  },

  // ==================== BÌNH THẠNH & PHÚ NHUẬN (7 SÂN) ====================
  {
    id: 'bth-binhminh',
    name: 'Sân Cầu Lông Bình Minh',
    address: '24 Bùi Đình Túy, P.12',
    district: 'Bình Thạnh',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Bình+Minh+Bình+Thạnh',
    presetCourtCount: 4,
  },
  {
    id: 'bth-thanhda',
    name: 'Sân Cầu Lông Thanh Đa',
    address: 'Bình Quới, P.28',
    district: 'Bình Thạnh',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Thanh+Đa+Bình+Thạnh',
    presetCourtCount: 6,
  },
  {
    id: 'bth-chuvanan',
    name: 'Sân Cầu Lông Chu Văn An',
    address: 'Chu Văn An, P.12',
    district: 'Bình Thạnh',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Chu+Văn+An+Bình+Thạnh',
    presetCourtCount: 4,
  },
  {
    id: 'bth-phanxichlong',
    name: 'Sân Cầu Lông Phan Xích Long',
    address: 'Phan Xích Long, P.2',
    district: 'Bình Thạnh',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Phan+Xích+Long+Bình+Thạnh',
    presetCourtCount: 4,
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
    id: 'pn-hoalu',
    name: 'Sân Cầu Lông Hoa Lư / Hoàng Sa',
    address: 'Hoàng Sa, P.8',
    district: 'Phú Nhuận',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Hoa+Lư+Hoàng+Sa+Phú+Nhuận',
    presetCourtCount: 4,
  },
  {
    id: 'pn-gaxelua',
    name: 'Sân Cầu Lông Ga Xe Lửa',
    address: 'Nguyễn Trọng Tuyển, P.10',
    district: 'Phú Nhuận',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Ga+Xe+Lửa+Phú+Nhuận',
    presetCourtCount: 4,
  },

  // ==================== QUẬN 12, QUẬN 7, QUẬN 1, QUẬN 3 & QUẬN 8 (10 SÂN) ====================
  {
    id: 'q12-anphudong',
    name: 'Sân Cầu Lông An Phú Đông',
    address: 'Vườn Lài, P. An Phú Đông',
    district: 'Quận 12',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+An+Phú+Đông+Quận+12',
    presetCourtCount: 4,
  },
  {
    id: 'q12-thanhloc',
    name: 'Sân Cầu Lông Thạnh Lộc',
    address: 'Hà Huy Giáp, P. Thạnh Lộc',
    district: 'Quận 12',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Thạnh+Lộc+Quận+12',
    presetCourtCount: 4,
  },
  {
    id: 'q12-tanchanhhiep',
    name: 'Sân Cầu Lông Tân Chánh Hiệp',
    address: 'Nguyễn Ảnh Thủ, P. Tân Chánh Hiệp',
    district: 'Quận 12',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Tân+Chánh+Hiệp+Quận+12',
    presetCourtCount: 6,
  },
  {
    id: 'q12-trungmyphu',
    name: 'Sân Cầu Lông Trung Mỹ Tây',
    address: 'Song Hành, P. Trung Mỹ Tây',
    district: 'Quận 12',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Trung+Mỹ+Tây+Quận+12',
    presetCourtCount: 4,
  },
  {
    id: 'q7-tanmy',
    name: 'Sân Cầu Lông Tân Mỹ',
    address: 'Tân Mỹ, P. Tân Phú',
    district: 'Quận 7',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Tân+Mỹ+Quận+7',
    presetCourtCount: 4,
  },
  {
    id: 'q7-phumyhung',
    name: 'Sân Cầu Lông Phú Mỹ Hưng',
    address: 'Nguyễn Văn Linh, P. Tân Phong',
    district: 'Quận 7',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Phú+Mỹ+Hưng+Quận+7',
    presetCourtCount: 6,
  },
  {
    id: 'q7-lamvien',
    name: 'Sân Cầu Lông Lâm Viên',
    address: 'Bùi Văn Ba, P. Tân Thuận Đông',
    district: 'Quận 7',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Lâm+Viên+Quận+7',
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
  {
    id: 'q8-phamhung',
    name: 'Sân Cầu Lông Phạm Hùng',
    address: 'Phạm Hùng, Phường 4',
    district: 'Quận 8',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sân+Cầu+Lông+Phạm+Hùng+Quận+8',
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
    .replace(/&/g, ' tt ')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Từ khóa loại hình sân chung (stop-words cho ngữ cảnh tìm kiếm sân cầu lông)
const GENERIC_PREFIX_TOKENS = new Set(['san', 'clb', 'cau', 'long', 'badminton', 'club', 'o', 'tai', 'khu', 'cum']);

// Hàm tìm kiếm sân theo từ khóa không dấu / có dấu và xếp hạng thông minh 100%
export function searchCourts(query: string): CourtInfo[] {
  if (!query || query.trim().length === 0) return [];

  const cleanQuery = normalizeVietnamese(query);
  const allTokens = cleanQuery.split(' ').filter(Boolean);
  if (allTokens.length === 0) return [];

  // Phân loại tokens: token đặc thù (tên riêng, số nhà, đường) vs token loại hình (sân, clb, cầu, lông)
  const specificTokens = allTokens.filter((t) => !GENERIC_PREFIX_TOKENS.has(t));
  // Nếu có token đặc thù (VD: 'celadon', 'minkyo', 'thoai ngoc hau'), bắt buộc phải khớp các token này
  // Nếu người dùng chỉ gõ 'sân' hoặc 'clb', dùng allTokens
  const requiredTokens = specificTokens.length > 0 ? specificTokens : allTokens;

  const matched = BADMINTON_COURTS.filter((court) => {
    // Tự động gắn tiền tố đầy đủ 'sân clb câu lạc bộ badminton' để mọi biến thể tìm kiếm đều khớp
    const rawCourtSearch = normalizeVietnamese(
      `sân clb câu lạc bộ badminton ${court.name} ${court.address} ${court.district}`
    );
    return requiredTokens.every((token) => rawCourtSearch.includes(token));
  });

  // Ranking thông minh theo độ tương đồng và vị trí xuất hiện
  return matched
    .map((court) => {
      const nameNorm = normalizeVietnamese(court.name);
      const addrNorm = normalizeVietnamese(court.address);
      let score = 0;

      // 1. Khớp chính xác toàn bộ query không dấu trong tên sân
      if (nameNorm.includes(cleanQuery)) {
        score += 100;
      }

      // 2. Tên sân chứa toàn bộ requiredTokens
      const allInName = requiredTokens.every((t) => nameNorm.includes(t));
      if (allInName) {
        score += 60;
      }

      // 3. Tên sân bắt đầu bằng cụm từ tìm kiếm
      if (nameNorm.startsWith(cleanQuery)) {
        score += 40;
      }

      // 4. Khớp trong địa chỉ chi tiết (tên đường, số nhà, phường)
      if (addrNorm.includes(cleanQuery)) {
        score += 30;
      }

      // 5. Ưu tiên số lượng tokens khớp trong tên sân
      const matchedTokensInName = requiredTokens.filter((t) => nameNorm.includes(t)).length;
      score += matchedTokensInName * 10;

      return { court, score };
    })
    .sort((a, b) => b.score - a.score)
    .map((item) => item.court)
    .slice(0, 15);
}
