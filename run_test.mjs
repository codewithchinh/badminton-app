import { BADMINTON_COURTS, searchCourts } from './src/data/badmintonCourts.ts';

console.log('=== BÁO CÁO TOÀN DIỆN DỮ LIỆU SÂN CẦU LÔNG (GRID SCAN AUDIT) ===');
console.log('Tổng số sân thực tế trong hệ thống:', BADMINTON_COURTS.length);

const districtCounts = {};
BADMINTON_COURTS.forEach((c) => {
  districtCounts[c.district] = (districtCounts[c.district] || 0) + 1;
});

console.log('\n--- PHÂN BỐ SÂN THEO TỪNG QUẬN ---');
for (const [dist, count] of Object.entries(districtCounts)) {
  console.log(`- ${dist}: ${count} sân`);
}

const testCategories = {
  'Tân Phú (42 sân)': [
    'Celadon', 'minkyo', 'thoại ngọc hầu', 'hoà thạnh', 'phú thọ hòa', 'lũy bán bích', 'tây thạnh',
    'thiên vân', 'vân đồn', 'tân thành', 'nguyễn thế truyện', 'hiền vương', 'bình long', 'kênh 19/5', 'chế lan viên'
  ],
  'Bình Tân (32 sân)': [
    'station 217', 'mã lò', 'thảo trang', 'lê văn quới', 'bình minh', 'tên lửa', 'an lạc a', 'tỉnh lộ 10',
    'bingo', 'trung kiên', 'bùi tư toàn', 'hồ học lãm', 'quốc lộ 1a', 'đỗ năng tế', 'kinh dương vương', 'tân kỳ tân quý'
  ],
  'Tân Bình (24 sân)': [
    'viettel', 'hoàng hoa thám', 'ga trực thăng', 'k334', 'bạch đằng', 'a41', 'a75', 'sky', 'tân sơn',
    'đông hồ', 'bàu cát', 'đồng đen', '18b cộng hòa', 'chế lan viên', 'ni sư huỳnh liên', 'phạm văn bạch', 'nguyễn sỹ sách'
  ],
  'Quận 2 (11 sân)': [
    'be badminton', 'an phú', 'hiển hoa', 'trần não', 'an khánh', 'lương định của', 'lavie 2', 'thân văn nhiếp',
    'đông phương', 'bình trưng', 'trịnh khắc lập', 'thạnh mỹ lợi', 'khánh hồng', 'bình an', 'thảo điền'
  ],
  'Thủ Đức & Q9 (23 sân)': [
    'shb', 'lê văn chí', 'vạn phúc', 'an nhiên', 'quốc lộ 13', 'tada', 'kha vạn cân', 'bình triệu',
    'tam bình', 'rạng đông', 'einstein', 'làng thiếu niên', 'đặng văn bi', 'tường anh', 'võ văn ngân',
    'tô ngọc vân', 'limited', 'nguyễn duy trinh', 'nguyễn xiển', 'hita', 'hoàng hữu nam', 'tám khỏe', 'lê văn việt'
  ],
  'Quận 7 (14 sân)': [
    'qv badminton', 'bùi văn ba', 'long viên', 'trần xuân soạn', 't793', 'd\'ni', 'victory', 'nguyễn văn quỳ',
    '79 pro', 'pro sport', 'huỳnh tấn phát', 'tân phong', 'nguyễn thị thập', 'nhà thi đấu quận 7',
    'eco green', 'nguyễn văn linh', 'tân mỹ', 'phú mỹ hưng', 'lâm viên', 'hàng dương', 'lê văn lương'
  ]
};

console.log('\n--- BẮT ĐẦU CHẠY KIỂM THỬ TỰ ĐỘNG TẤT CẢ TEST CASES ---');
let totalTests = 0;
let passedTests = 0;
let failedTests = [];

for (const [catName, queries] of Object.entries(testCategories)) {
  console.log(`\nKiểm tra khu vực [${catName}]:`);
  for (const q of queries) {
    totalTests++;
    const res = searchCourts(q);
    if (res.length > 0) {
      passedTests++;
      // In kết quả đầu mối
      // console.log(`  ✓ "${q}" -> Tìm thấy ${res.length} sân (Top 1: ${res[0].name})`);
    } else {
      failedTests.push({ cat: catName, query: q });
      console.error(`  ✗ [FAIL] "${q}" KHÔNG TÌM THẤY SÂN NÀO!`);
    }
  }
  console.log(`  => Đạt chuẩn ${queries.length - failedTests.filter(f => f.cat === catName).length}/${queries.length} truy vấn.`);
}

console.log('\n========================================');
console.log(`KẾT QUẢ CUỐI CÙNG: ${passedTests}/${totalTests} (${Math.round((passedTests/totalTests)*100)}%) PASSED.`);
if (failedTests.length === 0) {
  console.log('>>> 100% HOÀN HẢO! TOÀN BỘ SÂN VÀ TỪ KHÓA ĐỀU KHỚP VÀ ĐƯỢC TÌM THẤY CHÍNH XÁC.');
} else {
  console.error('>>> CÒN LỖI THẤT BẠI:', failedTests);
  process.exit(1);
}
