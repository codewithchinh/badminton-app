import type { MatchPost, SkillLevel } from '../types';
import { BADMINTON_COURTS } from '../data/badmintonCourts';
import { POPULAR_SHUTTLE_TYPES } from '../components/CreateMatchModal';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  // Dynamic action payloads
  matches?: MatchPost[];
  draftMatch?: Partial<MatchPost>;
  suggestedLevel?: SkillLevel;
  quickPrompts?: string[];
}

// Storage key for user-provided Gemini API key
const GEMINI_API_KEY_STORAGE = 'timvanglai_gemini_api_key';

export function getStoredGeminiKey(): string {
  try {
    return localStorage.getItem(GEMINI_API_KEY_STORAGE) || import.meta.env.VITE_GEMINI_API_KEY || '';
  } catch {
    return import.meta.env.VITE_GEMINI_API_KEY || '';
  }
}

export function setStoredGeminiKey(key: string): void {
  try {
    if (key.trim()) {
      localStorage.setItem(GEMINI_API_KEY_STORAGE, key.trim());
    } else {
      localStorage.removeItem(GEMINI_API_KEY_STORAGE);
    }
  } catch {}
}

/**
 * Normalizes Vietnamese string for fuzzy search
 */
function normalizeText(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .trim();
}

/**
 * Built-in Smart Badminton NLP Engine
 * Operates offline, zero-latency, 100% reliable, understands badminton slang in VN.
 */
export function processBuiltInBadmintonAI(
  userInput: string,
  allMatches: MatchPost[]
): ChatMessage {
  const inputNorm = normalizeText(userInput);

  // 1. POST PARSER INTENT: Host pastes a post from Zalo/Facebook
  const isPostParseIntent =
    /tuyển|tuyen|vang lai|vãng lai|slot|cần|can tim|giao lưu|giao luu|buổi|buoi|kèo|keo/i.test(userInput) &&
    /(\d{1,2}h|\d{1,2}:\d{2}|sân|san|cầu|cau|giá|gia|tiền|tien|\d{2,3}k)/i.test(userInput);

  if (isPostParseIntent && userInput.length > 35) {
    const draft = parseRawPostToDraft(userInput);
    let summaryText = `🏸 **Bé Cầu AI đã bóc tách xong bài đăng cho bạn nè!**\n\n`;
    summaryText += `• **Sân:** ${draft.courtName || 'Chưa nhận diện'}${draft.district ? ` (${draft.district})` : ''}\n`;
    summaryText += `• **Địa chỉ:** ${draft.address || 'Theo vị trí sân'}\n`;
    summaryText += `• **Thời gian:** ${draft.startTime || '19:00'} - ${draft.endTime || '21:00'} (${draft.date || 'Hôm nay'})\n`;
    summaryText += `• **Trình độ tuyển:** ${draft.minLevel || 'TB Yếu'} -> ${draft.maxLevel || 'TB+'}\n`;
    summaryText += `• **Loại cầu:** ${draft.shuttleType || 'VinaStar Đỏ'}\n`;
    summaryText += `• **Chi phí:** Nam ${draft.priceMale ? draft.priceMale.toLocaleString('vi-VN') + 'đ' : '60.000đ'} | Nữ ${draft.priceFemale ? draft.priceFemale.toLocaleString('vi-VN') + 'đ' : '40.000đ'}\n`;
    if (draft.depositAmount) {
      summaryText += `• **Tiền cọc:** ${draft.depositAmount.toLocaleString('vi-VN')}đ / người\n`;
    }
    summaryText += `\n👉 Bấm nút **"Điền vào Form Tạo Kèo"** bên dưới để mở giao diện đăng bài hoàn chỉnh ngay lập tức!`;

    return {
      id: Date.now().toString(),
      sender: 'assistant',
      text: summaryText,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      draftMatch: draft,
      quickPrompts: [
        '🏸 Tìm kèo tối nay gần tôi',
        '🎯 Đánh giá trình độ của tôi',
        '💡 Luật giao cầu đôi mới nhất',
      ],
    };
  }

  // 2. SKILL LEVEL EVALUATION INTENT
  const isSkillIntent =
    /trình|trinh do|trình độ|level|đánh giá|danh gia|thẩm định|tham dinh|tự lượng sức|mới chơi|moi choi|bao lâu|phông|dap cau|đập cầu|thủ cầu|thu cau|trái tay|trai tay|net|lưới/i.test(
      inputNorm
    );

  if (isSkillIntent && (inputNorm.includes('toi') || inputNorm.includes('minh') || inputNorm.includes('em') || inputNorm.includes('trinh gi') || inputNorm.includes('the nao') || inputNorm.includes('la gi'))) {
    const evalResult = evaluatePlayerLevel(userInput);
    let resText = `🎯 **Đánh giá & Thẩm định trình độ Cầu Lông:**\n\n`;
    resText += `Trình độ ước tính: **${evalResult.level}**\n\n`;
    resText += `**Đặc điểm nhận diện:**\n${evalResult.description}\n\n`;
    resText += `💡 **Lời khuyên nâng trình:**\n${evalResult.advice}\n\n`;

    // Filter matches that fit this level
    const matchedForLevel = allMatches.filter((m) => {
      return (
        m.status !== 'cancelled' &&
        m.status !== 'completed' &&
        (m.minLevel === evalResult.level || m.maxLevel === evalResult.level || m.minLevel === 'TB Yếu' || m.minLevel === 'Trung Bình')
      );
    }).slice(0, 3);

    if (matchedForLevel.length > 0) {
      resText += `👉 Mình đã lọc sẵn một số kèo rất hợp với trình độ **${evalResult.level}** bên dưới để bạn giao lưu thử:`;
    }

    return {
      id: Date.now().toString(),
      sender: 'assistant',
      text: resText,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      suggestedLevel: evalResult.level,
      matches: matchedForLevel.length > 0 ? matchedForLevel : undefined,
      quickPrompts: [
        `🏸 Kèo trình ${evalResult.level} hôm nay`,
        '📝 Dán bài Zalo để AI soạn',
        '💰 Kèo dưới 60k Tân Bình',
      ],
    };
  }

  // 3. BADMINTON RULES & GEAR FAQS
  const isRulesOrGearIntent =
    /luật|luat|giao cầu|giao cau|1.15|1m15|căng cước|cang cuoc|vợt|vot|cầu nhựa|cau nhua|cọc|coc|giữ chỗ|bùng|bung/i.test(
      inputNorm
    );

  if (isRulesOrGearIntent) {
    const faqAnswer = getBadmintonFAQAnswer(inputNorm);
    return {
      id: Date.now().toString(),
      sender: 'assistant',
      text: faqAnswer,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      quickPrompts: [
        '🏸 Tìm kèo tối nay gần tôi',
        '🎯 Đo trình độ của tôi',
        '📝 Soạn bài đăng Host tự động',
      ],
    };
  }

  // 4. MATCH SEARCH INTENT (DEFAULT FALLBACK / EXPLICIT SEARCH)
  const searchResults = searchMatchesWithNLP(userInput, allMatches);
  let reply = '';

  if (searchResults.matches.length > 0) {
    reply = `🏸 **Bé Cầu đã tìm thấy ${searchResults.matches.length} kèo phù hợp** với yêu cầu *"${userInput}"* nè:\n\n`;
    if (searchResults.filterSummary) {
      reply += `🔍 *Tiêu chí khớp:* ${searchResults.filterSummary}\n\n`;
    }
    reply += `Bạn bấm vào thẻ kèo bên dưới để xem vị trí, số slot trống và đăng ký ngay nha:`;
  } else if (searchResults.requestedHour !== null) {
    const formattedHour = `${searchResults.requestedHour.toString().padStart(2, '0')}:${searchResults.requestedMinute.toString().padStart(2, '0')}`;
    reply = `🏸 **Hiện tại Bé Cầu chưa thấy kèo nào diễn ra lúc ${formattedHour}** ${searchResults.isTonight ? '(buổi tối/đêm)' : ''} trong hệ thống.\n\n`;
    if (searchResults.closestMatches && searchResults.closestMatches.length > 0) {
      const latest = searchResults.closestMatches[0];
      reply += `💡 Các sân cầu phong trào thường kết thúc ca lúc 22:00 - 22:30. Kèo muộn nhất hiện có hôm nay là tại **${latest.courtName} (${latest.startTime} - ${latest.endTime})**.\n\nBạn tham khảo các kèo buổi tối gần nhất dưới đây xem có tiện giờ không nha:`;
    } else {
      reply += `💡 Thông thường các sân cầu phong trào đóng cửa trước 22:30. Bạn có thể thử tìm các ca tối phổ biến như **18h - 20h**, **19h - 21h** hoặc **20h - 22h** nhé!`;
    }
  } else {
    reply = `🏸 Hiện tại Bé Cầu chưa thấy kèo nào khớp 100% với yêu cầu *"${userInput}"*.\n\n`;
    if (searchResults.suggestions.length > 0) {
      reply += `💡 **Gợi ý dành cho bạn:**\n`;
      searchResults.suggestions.forEach((s) => (reply += `• ${s}\n`));
      reply += `\n`;
    }
    reply += `Bạn có thể thử tìm theo quận khác, hoặc bấm nút bên dưới để xem toàn bộ danh sách kèo hôm nay nhé!`;
  }

  const resultMatches =
    searchResults.matches.length > 0
      ? searchResults.matches.slice(0, 5)
      : searchResults.closestMatches && searchResults.closestMatches.length > 0
      ? searchResults.closestMatches.slice(0, 3)
      : undefined;

  return {
    id: Date.now().toString(),
    sender: 'assistant',
    text: reply,
    timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    matches: resultMatches,
    quickPrompts: [
      '🏸 Kèo tối nay 19h - 21h',
      '🏸 Kèo 20h - 22h',
      '💰 Kèo dưới 60k Tân Bình',
      '📝 Dán bài Zalo soạn kèo nhanh',
    ],
  };
}

interface SearchMatchesResult {
  matches: MatchPost[];
  filterSummary: string;
  requestedHour: number | null;
  requestedMinute: number;
  isTonight: boolean;
  closestMatches: MatchPost[];
  suggestions: string[];
}

/**
 * Natural Language Match Search Engine
 */
function searchMatchesWithNLP(query: string, allMatches: MatchPost[]): SearchMatchesResult {
  const qNorm = normalizeText(query);
  const activeMatches = allMatches.filter((m) => m.status !== 'cancelled' && m.status !== 'completed');

  // Detect District
  const districtKeywords = [
    { name: 'Tân Phú', keys: ['tan phu', 'q tan phu', 'quan tan phu'] },
    { name: 'Tân Bình', keys: ['tan binh', 'q tan binh', 'quan tan binh'] },
    { name: 'Phú Nhuận', keys: ['phu nhuan', 'q phu nhuan', 'quan phu nhuan'] },
    { name: 'Gò Vấp', keys: ['go vap', 'q go vap', 'quan go vap'] },
    { name: 'Bình Thạnh', keys: ['binh thanh', 'q binh thanh', 'quan binh thanh'] },
    { name: 'Thủ Đức', keys: ['thu duc', 'tp thu duc', 'q thu duc'] },
    { name: 'Quận 7', keys: ['quan 7', 'q7', 'q 7', 'district 7'] },
    { name: 'Quận 10', keys: ['quan 10', 'q10', 'q 10'] },
    { name: 'Bình Tân', keys: ['binh tan', 'q binh tan', 'quan binh tan'] },
    { name: 'Quận 1', keys: ['quan 1', 'q1', 'q 1'] },
    { name: 'Quận 3', keys: ['quan 3', 'q3', 'q 3'] },
    { name: 'Quận 5', keys: ['quan 5', 'q5', 'q 5'] },
    { name: 'Quận 8', keys: ['quan 8', 'q8', 'q 8'] },
    { name: 'Quận 12', keys: ['quan 12', 'q12', 'q 12'] },
  ];

  let detectedDistricts: string[] = [];
  for (const d of districtKeywords) {
    if (d.keys.some((k) => qNorm.includes(k))) {
      detectedDistricts.push(d.name);
    }
  }

  // 1. Detect Specific Hour mention (e.g. 23h, 23:00, 23h30, 19h, 8h sáng, 7h tối...)
  let specificHour: number | null = null;
  let specificMinute = 0;

  const hourMatch = qNorm.match(/(?:luc|lúc|vao|vào|tam|tầm|khoang|khoảng)?\s*(\b[0-2]?\d)(?:h|:(\d{2}))(?:\s*(sang|sáng|chieu|chiều|toi|tối|dem|đêm))?/);
  if (hourMatch) {
    let h = parseInt(hourMatch[1], 10);
    if (h >= 0 && h <= 24) {
      if (hourMatch[2]) {
        specificMinute = parseInt(hourMatch[2], 10);
      }
      const period = hourMatch[3];
      if (period && (period.includes('chieu') || period.includes('chiều') || period.includes('toi') || period.includes('tối'))) {
        if (h < 12) h += 12;
      }
      specificHour = h;
    }
  }

  // Detect Time Range / Day
  const isTonight = /tối|toi|dem|đêm/i.test(qNorm) || (specificHour !== null && specificHour >= 18);
  const isMorning = /sáng|sang|morning/i.test(qNorm) || (specificHour !== null && specificHour < 12);
  const isAfternoon = /chiều|chieu|afternoon/i.test(qNorm) || (specificHour !== null && specificHour >= 12 && specificHour < 18);
  const isToday = /hôm nay|hom nay|today/i.test(qNorm);
  const isTomorrow = /ngày mai|ngay mai|mai|tomorrow/i.test(qNorm);

  // Detect Max Price
  let maxPrice: number | null = null;
  const priceMatch = qNorm.match(/(?:dưới|duoi|tam|tầm|khoảng|khoang|<)?\s*(\d{2,3})\s*(?:k|nghin|nghìn|dong|đồng)/);
  if (priceMatch) {
    maxPrice = parseInt(priceMatch[1], 10) * 1000;
  }

  // Detect Skill Level
  let targetLevel: SkillLevel | null = null;
  if (/newbie|mới tập|moi tap/i.test(qNorm)) targetLevel = 'Newbie';
  else if (/tb yếu|tb yeu|trung bình yếu|trung binh yeu/i.test(qNorm)) targetLevel = 'TB Yếu';
  else if (/tb\+|tb plus|trung bình khá|trung binh kha/i.test(qNorm)) targetLevel = 'TB+';
  else if (/tb---|tb-|trung bình yếu/i.test(qNorm)) targetLevel = 'TB-';
  else if (/khá|kha|bán chuyên|ban chuyen/i.test(qNorm)) targetLevel = 'Khá (Bán chuyên)';
  else if (/trung bình|trung binh/i.test(qNorm)) targetLevel = 'Trung Bình';
  else if (/yếu\+|yeu\+/i.test(qNorm)) targetLevel = 'Yếu+';
  else if (/yếu|yeu/i.test(qNorm)) targetLevel = 'Yếu';

  // Filter matches strictly
  let results = activeMatches.filter((m) => {
    // District match
    if (detectedDistricts.length > 0 && !detectedDistricts.includes(m.district)) {
      return false;
    }

    // Day match
    if (isToday && m.date !== 'Hôm nay') return false;
    if (isTomorrow && m.date !== 'Ngày mai') return false;

    // Specific Hour Check
    if (specificHour !== null) {
      const [sH, sM] = m.startTime.split(':').map((v) => parseInt(v, 10));
      const [eH, eM] = m.endTime.split(':').map((v) => parseInt(v, 10));
      const startTotal = sH * 60 + (sM || 0);
      let endTotal = eH * 60 + (eM || 0);
      if (endTotal <= startTotal) {
        endTotal += 24 * 60; // Ca đánh xuyên đêm
      }
      const targetTotal = specificHour * 60 + specificMinute;

      // Trận đấu chỉ khớp nếu giờ người dùng tìm nằm trong trận (hoặc giờ bắt đầu sát trong vòng 30 phút)
      const isDuringMatch = targetTotal >= startTotal && targetTotal < endTotal;
      const isCloseStart = Math.abs(startTotal - targetTotal) <= 30;

      if (!isDuringMatch && !isCloseStart) {
        return false;
      }
    } else {
      // General Time of day match (khi người dùng không nhập giờ cụ thể)
      if (isTonight && !isMorning && !isAfternoon) {
        const startHour = parseInt(m.startTime.split(':')[0], 10);
        if (startHour < 17) return false;
      }
      if (isMorning && !isTonight && !isAfternoon) {
        const startHour = parseInt(m.startTime.split(':')[0], 10);
        if (startHour >= 12) return false;
      }
      if (isAfternoon && !isTonight && !isMorning) {
        const startHour = parseInt(m.startTime.split(':')[0], 10);
        if (startHour < 12 || startHour >= 18) return false;
      }
    }

    // Price match
    if (maxPrice && m.priceMale > maxPrice && m.priceFemale > maxPrice) {
      return false;
    }

    // Level match
    if (targetLevel) {
      if (m.minLevel !== targetLevel && m.maxLevel !== targetLevel) {
        const levels: SkillLevel[] = ['Newbie', 'Yếu', 'Yếu+', 'TB Yếu', 'TB-', 'Trung Bình', 'TB+', 'TB+++', 'Khá (Bán chuyên)', 'Tốt (Ăn tập)'];
        const targetIdx = levels.indexOf(targetLevel);
        const minIdx = levels.indexOf(m.minLevel);
        const maxIdx = levels.indexOf(m.maxLevel);
        if (targetIdx < minIdx || targetIdx > maxIdx) {
          return false;
        }
      }
    }

    return true;
  });

  // Closest alternative matches if specific hour had 0 results
  let closestMatches: MatchPost[] = [];
  if (specificHour !== null && results.length === 0) {
    closestMatches = activeMatches
      .filter((m) => {
        if (isToday && m.date !== 'Hôm nay') return false;
        if (isTomorrow && m.date !== 'Ngày mai') return false;
        return true;
      })
      .sort((a, b) => {
        const [sHa, sMa] = a.startTime.split(':').map((v) => parseInt(v, 10));
        const [sHb, sMb] = b.startTime.split(':').map((v) => parseInt(v, 10));
        const diffA = Math.abs(sHa * 60 + (sMa || 0) - (specificHour! * 60 + specificMinute));
        const diffB = Math.abs(sHb * 60 + (sMb || 0) - (specificHour! * 60 + specificMinute));
        return diffA - diffB;
      });
  }

  // If no strict results and NO specific hour requested, fallback to district
  if (results.length === 0 && specificHour === null && detectedDistricts.length > 0) {
    results = activeMatches.filter((m) => detectedDistricts.includes(m.district));
  }

  // Filter summary description
  const summaryParts: string[] = [];
  if (detectedDistricts.length > 0) summaryParts.push(`Khu vực: ${detectedDistricts.join(', ')}`);
  if (specificHour !== null) {
    const formattedHour = `${specificHour.toString().padStart(2, '0')}:${specificMinute.toString().padStart(2, '0')}`;
    summaryParts.push(`Khung giờ: ${formattedHour}`);
  } else {
    if (isTonight) summaryParts.push('Khung giờ: Buổi tối (sau 17h)');
    if (isMorning) summaryParts.push('Khung giờ: Buổi sáng');
    if (isAfternoon) summaryParts.push('Khung giờ: Buổi chiều');
  }
  if (targetLevel) summaryParts.push(`Trình độ: ${targetLevel}`);
  if (maxPrice) summaryParts.push(`Giá tối đa: ${maxPrice.toLocaleString('vi-VN')}đ`);

  return {
    matches: results,
    filterSummary: summaryParts.join(' • '),
    requestedHour: specificHour,
    requestedMinute: specificMinute,
    isTonight,
    closestMatches,
    suggestions: [
      'Thử mở rộng sang các quận lân cận (Tân Phú, Tân Bình, Gò Vấp)',
      'Xem tất cả các kèo đang mở đăng ký trong ngày hôm nay',
      'Đăng bài tuyển vãng lai riêng nếu bạn có sân mà thiếu tay vợt',
    ],
  };
}

/**
 * Smart Raw Post Parser (Zalo/FB -> Draft Match)
 */
export function parseRawPostToDraft(rawText: string): Partial<MatchPost> {
  const norm = normalizeText(rawText);

  // 1. Find Court & District from BADMINTON_COURTS database
  let detectedCourtName = '';
  let detectedAddress = '';
  let detectedDistrict = 'Tân Phú';
  let detectedMapsUrl = '';

  for (const court of BADMINTON_COURTS) {
    const courtNorm = normalizeText(court.name);
    // Strip common prefixes
    const simpleName = courtNorm.replace(/^(san cau long|clb cau long|san|clb)\s*/i, '').trim();
    if (simpleName.length >= 4 && (norm.includes(courtNorm) || norm.includes(simpleName))) {
      detectedCourtName = court.name;
      detectedAddress = court.address;
      detectedDistrict = court.district;
      detectedMapsUrl = court.googleMapsUrl;
      break;
    }
  }

  // Fallback court extraction
  if (!detectedCourtName) {
    const sânMatch = rawText.match(/sân\s+([A-Za-z0-9\s_.-]+?)(?:,|\.|\n|hôm|ngày|\d{1,2}h|\d{1,2}:|quận|tân|bình)/i);
    if (sânMatch && sânMatch[1].trim().length > 2) {
      detectedCourtName = `Sân Cầu Lông ${sânMatch[1].trim()}`;
    } else {
      detectedCourtName = 'Sân Cầu Lông Giao Lưu';
    }
  }

  // 2. Date
  let date = 'Hôm nay';
  if (/mai|ngày mai|ngay mai/i.test(rawText)) date = 'Ngày mai';
  else if (/thứ 7|thu 7|thứ bảy|t7/i.test(rawText)) date = 'Thứ 7';
  else if (/chủ nhật|chu nhat|cn/i.test(rawText)) date = 'Chủ Nhật';

  // 3. Time (19h-21h, 19:00 - 21:00, 20h - 22h...)
  let startTime = '19:00';
  let endTime = '21:00';
  const timeMatch = rawText.match(/(\d{1,2})(?:h|:(\d{2}))?\s*(?:-|đến|den|to)\s*(\d{1,2})(?:h|:(\d{2}))?/i);
  if (timeMatch) {
    const startH = parseInt(timeMatch[1], 10).toString().padStart(2, '0');
    const startM = timeMatch[2] || '00';
    const endH = parseInt(timeMatch[3], 10).toString().padStart(2, '0');
    const endM = timeMatch[4] || '00';
    startTime = `${startH}:${startM}`;
    endTime = `${endH}:${endM}`;
  }

  // 4. Shuttlecock
  let shuttleType = 'VinaStar Đỏ';
  for (const s of POPULAR_SHUTTLE_TYPES) {
    if (norm.includes(normalizeText(s))) {
      shuttleType = s;
      break;
    }
  }
  if (shuttleType === 'VinaStar Đỏ' && /vinastar|vina/i.test(rawText)) {
    shuttleType = /xanh/i.test(rawText) ? 'VinaStar Xanh' : 'VinaStar Đỏ';
  } else if (/hải yến|hai yen/i.test(rawText)) {
    shuttleType = /xanh/i.test(rawText) ? 'Hải Yến Xanh' : 'Hải Yến Đỏ';
  } else if (/thành công|thanh cong/i.test(rawText)) {
    shuttleType = 'Thành Công 77';
  } else if (/ba sao/i.test(rawText)) {
    shuttleType = 'Ba Sao Pro-X';
  } else if (/88/i.test(rawText)) {
    shuttleType = 'Cầu 88';
  }

  // 5. Prices
  let priceMale = 60000;
  let priceFemale = 40000;
  const priceMatches = [...rawText.matchAll(/(\d{2,3})\s*k/gi)];
  if (priceMatches.length === 1) {
    const p = parseInt(priceMatches[0][1], 10) * 1000;
    priceMale = p;
    priceFemale = Math.max(30000, p - 20000);
  } else if (priceMatches.length >= 2) {
    priceMale = parseInt(priceMatches[0][1], 10) * 1000;
    priceFemale = parseInt(priceMatches[1][1], 10) * 1000;
  }

  // 6. Deposit
  let depositAmount = 0;
  const depositMatch = rawText.match(/cọc\s*(\d{2,3})\s*k/i);
  if (depositMatch) {
    depositAmount = parseInt(depositMatch[1], 10) * 1000;
  }

  // 7. Slots
  let totalSlots = 8;
  const slotMatch = rawText.match(/(\d{1,2})\s*(?:slot|người|tay|bạn|nam|nữ)/i);
  if (slotMatch) {
    const s = parseInt(slotMatch[1], 10);
    if (s > 0 && s <= 20) totalSlots = s + 4; // Add buffer for existing host players
  }

  // 8. Skill Level
  let minLevel: SkillLevel = 'TB Yếu';
  let maxLevel: SkillLevel = 'TB+';
  if (/yếu|yeu/i.test(norm) && !/trung binh|tb/i.test(norm)) {
    minLevel = 'Yếu';
    maxLevel = 'TB Yếu';
  } else if (/khá|kha|bán chuyên/i.test(norm)) {
    minLevel = 'Trung Bình';
    maxLevel = 'Khá (Bán chuyên)';
  } else if (/mới|newbie/i.test(norm)) {
    minLevel = 'Newbie';
    maxLevel = 'Yếu+';
  }

  return {
    title: `Giao lưu vãng lai tại ${detectedCourtName}`,
    courtName: detectedCourtName,
    district: detectedDistrict,
    address: detectedAddress || `${detectedCourtName}, ${detectedDistrict}`,
    googleMapsUrl: detectedMapsUrl,
    date,
    startTime,
    endTime,
    courtNumber: 'Sẽ báo trước giờ',
    courtCount: 1,
    shuttleType,
    totalSlots,
    minLevel,
    maxLevel,
    priceMale,
    priceFemale,
    depositAmount,
    notes: rawText.slice(0, 300),
  };
}

/**
 * Skill Level Evaluator logic
 */
function evaluatePlayerLevel(userInput: string): { level: SkillLevel; description: string; advice: string } {
  const norm = normalizeText(userInput);

  if (/mới chơi|moi choi|vài ngày|vai ngay|chưa biết luật|chua biet luat|phát cầu hỏng|chua danh bao gio/i.test(norm)) {
    return {
      level: 'Newbie',
      description: 'Mới làm quen bộ môn, đang tập cách cầm vợt chuẩn (V-grip) và phát cầu đúng ô. Chưa nắm rõ luật đôi và vị trí đứng.',
      advice: 'Tập trung luyện cổ tay thả lỏng, tập phát cầu trái tay ngắn và học cách di chuyển 6 góc sân trước khi đánh trận tính điểm.',
    };
  }

  if (/yếu|dưới 1 năm|duoi 1 nam|chưa có lực|chay loan|hụt cầu|hut cau|chưa phông tới|chua phong toi/i.test(norm)) {
    return {
      level: 'Yếu+',
      description: 'Đánh qua lại được nhiều chạm, phông cầu tới giữa hoặc 3/4 sân. Đập cầu nhẹ chưa cắm, bắt đầu hiểu nguyên tắc trên lưới - dưới công trong đánh đôi.',
      advice: 'Tập bài tập xoay hông và mượn lực toàn thân để phông cầu cao sâu chạm vạch đích cuối sân, tránh để đối thủ đập ngay đầu vợt.',
    };
  }

  if (/khá|kha|ăn tập|an tap|bán chuyên|ban chuyen|thi đấu giải|giai quan|giai tp/i.test(norm)) {
    return {
      level: 'Khá (Bán chuyên)',
      description: 'Kỹ thuật hoàn chỉnh, bộ chân thanh thoát, đập cầu uy lực cắm vạch, phản tạt tốc độ cao và xoay chuyển chiến thuật đôi cực kỳ nhịp nhàng.',
      advice: 'Chú trọng thể lực bền bỉ, tâm lý thi đấu và sự ăn ý với partner khi chạm trán các cặp đôi có lối đánh biến hoá.',
    };
  }

  if (/tb\+|tb plus|đập tốt|dap tot|phông sâu|phong sau|thủ vững|thu vung|trái tay ổn|trai tay on/i.test(norm)) {
    return {
      level: 'TB+',
      description: 'Lối đánh tốc độ, đập cầu có điểm rơi và uy lực. Phông cầu thoát tay tới vạch 2 cuối sân, thủ phản tạt tốt và bắt đầu kiểm soát nhịp cầu.',
      advice: 'Rèn luyện thêm các quả đập gõ cổ tay (stick smash), bỏ nhỏ chéo lưới hiểm hóc và biến hoá đường cầu để không bị bắt bài.',
    };
  }

  if (/tb-|trung bình yếu|tb yeu|1-2 năm|1-2 nam|biết đập|chưa có trái tay|thu hoi yeu/i.test(norm)) {
    return {
      level: 'TB Yếu',
      description: 'Phổ biến nhất trong phong trào! Đã nắm vững luật đôi, phông cầu ổn định, đập được nhưng thủ cầu nặng còn bỡ ngỡ, trái tay chưa thoát lực.',
      advice: 'Hạ thấp trọng tâm khi thủ cầu, mở mặt vợt đẩy cầu về hai góc biên sâu để đảo ngược thế trận khi bị ép.',
    };
  }

  // Default to Trung Bình
  return {
    level: 'Trung Bình',
    description: 'Trình độ tiêu chuẩn phong trào. Đánh đều tay, di chuyển nhịp nhàng, phông sâu, đập có lực, hiểu nguyên tắc bọc lót cho đồng đội.',
    advice: 'Nâng cao tốc độ ra vợt ở khu vực lưới và các quả tạt phản công nhanh để làm chủ thế chủ động.',
  };
}

/**
 * Badminton FAQ database
 */
function getBadmintonFAQAnswer(norm: string): string {
  if (norm.includes('1.15') || norm.includes('giao cau') || norm.includes('giao cầu')) {
    return `🏸 **Luật Giao Cầu Mới Nhất (BWF & Phong trào):**\n\n1. **Chiều cao phát cầu:** Toàn bộ quả cầu phải nằm dưới **1.15 mét** tính từ mặt sân tại thời điểm tiếp xúc vợt (bỏ luật cũ tính theo thắt lưng).\n2. **Vị trí chân:** Hai chân phải chạm đất trong ô phát cầu, không được chạm vạch biên hay vạch giữa.\n3. **Cử động vợt:** Vợt phải chuyển động liên tục về phía trước từ lúc bắt đầu động tác cho đến khi chạm cầu (không được nhử/khựng vợt đánh lừa đối phương).\n4. **Đánh đôi:** Điểm chẵn phát bên phải, điểm lẻ phát bên trái. Đội ghi điểm tiếp tục phát cầu và đổi ô trái/phải.`;
  }

  if (norm.includes('vot') || norm.includes('vợt') || norm.includes('cang') || norm.includes('cước')) {
    return `🏸 **Tư Vấn Chọn Vợt & Căng Cước Phong Trào:**\n\n• **Trọng lượng vợt:** Người mới hoặc lực tay trung bình nên chọn **4U (80-84g)** hoặc **5U** nhẹ tay, dễ thủ. Chỉ chọn **3U (85-89g)** khi có lực cổ tay khỏe.\n• **Độ cứng thân & điểm cân bằng:**\n  - Thủ phản tạt / Công thủ toàn diện: Thân dẻo vừa, cân bằng (Even Balance 285-295mm).\n  - Chuyên đập công: Thân cứng, nặng đầu (Head Heavy > 300mm).\n• **Mức căng cước:**\n  - Người mới / Nữ: **9.5kg - 10.5kg** (21-23 lbs).\n  - Trung bình phong trào: **10.5kg - 11.5kg** (23-25 lbs).\n  - Khá / Lực tay khỏe: **11.5kg - 12.5kg** (25-27 lbs).\n• **Cước thông dụng:** Yonex BG65 (bền, êm), BG65Ti (nổ to, bền), BG66 Ultimax (nảy cực sướng, kiểm soát tốt).`;
  }

  if (norm.includes('cọc') || norm.includes('coc') || norm.includes('bung') || norm.includes('bùng')) {
    return `🛡️ **Văn Hoá & Quy Định Cọc Giữ Chỗ Trên TimVangLai.io.vn:**\n\n• **Tại sao cần cọc?** Cọc giúp Host an tâm giữ slot, không bị tình trạng "bùng kèo" phút chót khiến sân bị lỗ tiền hoặc thiếu người chơi mất vui.\n• **Mức cọc phổ biến:** Thường từ **20.000đ - 30.000đ** (hoặc 50% tiền sân). Host nhận tiền trực tiếp qua mã VietQR an toàn.\n• **Chính sách hoàn cọc:** Nếu có việc bận, người chơi báo trước ít nhất **2 - 3 tiếng** để Host kịp tìm người thay thế sẽ được hoàn cọc 100%.`;
  }

  return `🏸 **Kiến thức Cầu Lông Phong Trào:**\n\nCầu lông là môn thể thao rèn luyện phản xạ và tim mạch tuyệt vời. Tại Việt Nam, các loại cầu phổ biến nhất gồm: **VinaStar Đỏ** (miền Nam ưa chuộng), **Hải Yến** và **Thành Công 77** (miền Bắc). Hãy luôn khởi động kỹ cổ tay, cổ chân và đầu gối ít nhất 10 phút trước khi vào sân nhé!`;
}

/**
 * Cloud AI Engine: Google Gemini API integration
 * Calls gemini-1.5-flash with grounded match data and strict fallback to built-in NLP.
 */
export async function sendChatMessageToAI(
  userInput: string,
  history: ChatMessage[],
  allMatches: MatchPost[]
): Promise<ChatMessage> {
  const apiKey = getStoredGeminiKey();

  // If no Gemini key configured, directly use high-performance Built-In NLP
  if (!apiKey) {
    return processBuiltInBadmintonAI(userInput, allMatches);
  }

  try {
    // Controller with 10s timeout according to global rule
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 9500);

    // Prepare active matches context (minimal tokens)
    const matchesContext = allMatches
      .filter((m) => m.status !== 'cancelled' && m.status !== 'completed')
      .slice(0, 15)
      .map((m) => ({
        id: m.id,
        court: m.courtName,
        district: m.district,
        date: m.date,
        time: `${m.startTime}-${m.endTime}`,
        level: `${m.minLevel} -> ${m.maxLevel}`,
        price: `${m.priceMale}k/${m.priceFemale}k`,
        slotsRemaining: Math.max(0, m.totalSlots - (m.joinedPlayers ? m.joinedPlayers.length : 0)),
        shuttle: m.shuttleType,
      }));

    const systemPrompt = `Bạn là Bé Cầu AI - Trợ Lý Cầu Lông siêu dễ thương, thông minh và nhiệt tình của nền tảng TimVangLai.io.vn (tìm kèo & tuyển vãng lai cầu lông phong trào #1 Việt Nam).
Tính cách & Xưng hô: Tự xưng là 'Bé Cầu' hoặc 'mình', gọi người dùng là 'bạn'. Giọng văn vui vẻ, dễ thương, thân thiện, am hiểu sâu sắc văn hoá cầu lông phong trào Việt Nam (thuật ngữ: phông, đập/smash, gõ cổ tay, thủ phản tạt, vãng lai, cọc giữ slot, VinaStar, Hải Yến...).

DANH SÁCH CÁC TRẬN ĐẤU ĐANG CÓ TRÊN HỆ THỐNG:
${JSON.stringify(matchesContext)}

NHIỆM VỤ CỦA BẠN:
1. Nếu người dùng tìm kèo: Chỉ gợi ý các trận đấu CÓ THẬT trong danh sách trên. Nêu rõ tên sân, quận, giờ, giá và số slot còn lại.
QUY TẮC KHUNG GIỜ BẮT BUỘC (CHÍNH XÁC TUYỆT ĐỐI):
- Nếu người dùng hỏi một giờ cụ thể (VD: 23h, 22h, 7h sáng...): Hãy kiểm tra kỹ startTime và endTime của từng trận trong danh sách.
- Trận đấu CHỈ khớp nếu thời gian diễn ra BAO GỒM giờ đó (hoặc giờ bắt đầu sát trong vòng 30 phút).
- Tuyệt đối KHÔNG được bảo là có kèo cho 23h nếu kèo đó kết thúc lúc 20h hoặc 22h!
- Nếu không có trận nào diễn ra vào giờ đó, PHẢI nói thẳng: "Hiện tại không có kèo nào diễn ra lúc [giờ]..." rồi mới gợi ý các kèo tối muộn nhất trong danh sách.
2. Nếu Host dán bài đăng nháp từ Zalo/Facebook: Hãy bóc tách đầy đủ (Tên sân, ngày, giờ, trình độ, loại cầu, giá nam, giá nữ, tiền cọc, ghi chú).
3. Nếu người chơi hỏi về trình độ: Đánh giá theo thang 10 bậc Việt Nam (Newbie, Yếu, Yếu+, TB Yếu, TB-, Trung Bình, TB+, TB+++, Khá, Tốt) và tư vấn nâng cao.
4. Trả lời bằng tiếng Việt tự nhiên, định dạng Markdown đẹp mắt.`;

    const contents = [
      {
        role: 'user',
        parts: [{ text: systemPrompt }],
      },
      ...history.slice(-4).map((msg) => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }],
      })),
      {
        role: 'user',
        parts: [{ text: userInput }],
      },
    ];

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents }),
        signal: controller.signal,
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.warn('Gemini API request failed, falling back to built-in NLP:', response.status);
      return processBuiltInBadmintonAI(userInput, allMatches);
    }

    const data = await response.json();
    const rawReply = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawReply) {
      return processBuiltInBadmintonAI(userInput, allMatches);
    }

    // Check if the reply or user prompt was a post parse
    const isPostParse =
      /tuyển|vãng lai|slot|sân/i.test(userInput) &&
      /(\d{1,2}h|\d{1,2}:|giá|nam|nữ)/i.test(userInput) &&
      userInput.length > 35;

    let draftMatch: Partial<MatchPost> | undefined = undefined;
    if (isPostParse) {
      draftMatch = parseRawPostToDraft(userInput);
    }

    // Check if Gemini suggested matches by finding IDs or matching names
    let matchedItems: MatchPost[] | undefined = undefined;
    const foundMatches = allMatches.filter((m) => rawReply.includes(m.courtName) || rawReply.includes(m.id));
    if (foundMatches.length > 0) {
      matchedItems = foundMatches.slice(0, 4);
    }

    return {
      id: Date.now().toString(),
      sender: 'assistant',
      text: rawReply,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      matches: matchedItems,
      draftMatch,
      quickPrompts: [
        '🏸 Tìm kèo tối nay gần tôi',
        '📝 Dán bài Zalo để AI soạn',
        '🎯 Thẩm định trình độ của tôi',
      ],
    };
  } catch (err) {
    console.warn('Error calling Gemini, falling back to built-in Badminton AI:', err);
    return processBuiltInBadmintonAI(userInput, allMatches);
  }
}
