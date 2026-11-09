// scripts/generate_scenarios.cjs
const fs = require('fs');
const path = require('path');

const scenariosData = [
  // ==========================================
  // TOPIC 1: CẢM XÚC, TÂM TRẠNG & TÂM LÝ LÔNG THỦ (1-10)
  // ==========================================
  {
    id: 'SCEN_001',
    topic: 'Cảm xúc & Tâm lý',
    name: 'Buồn bã, cô đơn, thất tình',
    regex: '(buon|buồn|that tinh|thất tình|co don|cô đơn|buon qua|buồn quá|tôi buồn|toi buon|tâm trạng tệ)',
    responses: [
      `Dạ Bé Cầu nghe nè! 🥺 Thương bạn quá đi à, ôm bạn một cái thật chặt nha 🤗.\n\nĐời người ai chẳng có những ngày mệt mỏi, áp lực hay hụt hẫng đúng không nè? Nhưng mà mỗi lần Bé Cầu thấy trong lòng nặng trĩu, bí quyết xả stress đã nhất là **xách vợt ra sân, đập vài quả smash nổ long trời lở đất!** 🏸💥 Tiếng cầu nổ giòn tan kèm vài giọt mồ hôi rơi xuống là bao nhiêu muộn phiền tự nhiên tan biến hết trơn á!\n\nNếu bạn thấy cần một nơi để giải tỏa, Bé Cầu dắt bạn đi kiếm một sân giao lưu toàn các bạn dễ thương, cười nói rôm rả nha. Còn nếu hôm nay mệt quá thì cứ nghỉ ngơi, uống ly trà ấm rồi ngủ một giấc thật ngon. Ngày mai trời lại sáng mà! ✨`,
      `Đừng buồn nữa nha bạn ơi! 🏸🤍 Cuộc sống có lúc thăng lúc trầm, giống như một set cầu có lúc dẫn điểm, có lúc bị đối thủ gác 5-6 trái vậy á. Quan trọng là mình không buông vợt!\n\nRa sân làm vài set, hò reo cùng đồng đội là năng lượng tích cực quay trở lại ngay. Bạn muốn tìm một sân vui vẻ giao lưu tối nay không nè?`
    ],
    quickPrompts: ['🏸 Tìm kèo giao lưu xả stress', '🎯 Đo trình độ của tôi', '🥰 Cảm ơn Bé Cầu nha', '💡 Mẹo smash cầu giải tỏa']
  },
  {
    id: 'SCEN_002',
    topic: 'Cảm xúc & Tâm lý',
    name: 'Áp lực, căng thẳng công việc/học tập, stress',
    regex: '(stress|ap luc|áp lực|cang thang|căng thẳng|deadline|chay deadline|cháy deadline|met moi|mệt mỏi|kiệt sức|kiet suc|dau dau|đau đầu)',
    responses: [
      `Hít một hơi thật sâu nào bạn ơi! 🌿 Bạn đã vất vả với deadline và công việc cả ngày rồi.\n\nKhoa học chứng minh là khi chạy nhảy đánh cầu lông, não bộ sẽ tiết ra lượng lớn Dopamine và Endorphin – hai hormone "hạnh phúc" giúp xóa tan căng thẳng tức thì! 🧠✨\n\nTạm gập laptop lại, xỏ giày ra sân 1 tiếng thôi, vừa khỏe người vừa giúp đầu óc minh mẫn hơn đó. Tối nay bạn có muốn ra sân đổi gió không?`,
      `Deadline dí thì mình... dí lại bằng những quả đập cầu cắm sân nha! 🏸🔥 Đừng để áp lực công việc nuốt chửng năng lượng của bạn. 1 tiếng trên sân cầu lông bằng 10 liều thuốc bổ cho tinh thần luôn á!`
    ],
    quickPrompts: ['🏸 Tìm kèo tối nay gần tôi', '🏸 Kèo 20h - 22h giải tỏa', '💡 Uống gì phục hồi năng lượng']
  },
  {
    id: 'SCEN_003',
    topic: 'Cảm xúc & Tâm lý',
    name: 'Hưng phấn, vui vẻ, tràn đầy năng lượng',
    regex: '(vui qua|vui quá|hung phan|hưng phấn|tran day nang luong|tràn đầy năng lượng|hom nay vui|hôm nay vui|hao hung|hào hứng|sung qua|sung quá)',
    responses: [
      `Yeahhh! Nghe bạn tràn đầy năng lượng là Bé Cầu cũng vui lây luôn nè! 🎉🏸🔥\n\nTâm trạng đang lên đỉnh thế này mà vào sân là tay dẻo quẹo, phông cầu sâu hoắm, smash quả nào là chết cầu quả đó luôn á!\n\nPhải tranh thủ kiếm một kèo thật rực rỡ để bung hết năng lượng hôm nay thôi bạn ơi! Bạn đang ở quận nào nè?`,
      `Khí thế ngút trời thế này mà không ra sân thì đúng là phí phạm tài năng luôn! ⚡🔥 Mau xách kiếm ra sân thị uy đi bạn ơi, Bé Cầu kiếm slot liền cho bạn nè!`
    ],
    quickPrompts: ['🏸 Tìm kèo hot tối nay', '⚡ Kèo TB+ / Khá giao lưu', '🎯 Thử đo trình độ']
  },
  {
    id: 'SCEN_004',
    topic: 'Cảm xúc & Tâm lý',
    name: 'Mất tự tin, sợ bị cười chê khi mới đi vãng lai',
    regex: '(tu ti|tự ti|mat tu tin|mất tự tin|so bi che|sợ bị chê|ngai qua|ngại quá|so bi cuoi|sợ bị cười|khong dam di|không dám đi|danh kem|đánh kém|nguong|ngượng)',
    responses: [
      `Bạn đừng lo lắng hay ngại ngùng gì hết nha! 🥰 Ai bước vào môn cầu lông này mà chẳng từng đánh hụt cầu, giao cầu rúc lưới hay chạy giẫm chân đồng đội.\n\nCộng đồng cầu lông phong trào dễ thương lắm, ai cũng từng là Newbie cả. Trên app TimVangLai, các kèo đều ghi rõ trình độ (Newbie, Yếu, TB Yếu) và cam kết giao lưu vui vẻ, hòa đồng, không quạu!\n\nBạn cứ tự tin đăng ký một kèo trình Newbie/Yếu, đến sớm 10 phút chào Host một tiếng là được cả nhóm hỗ trợ nhiệt tình ngay à. Cố lên nha! 🏸🤍`,
      `Không ai sinh ra đã biết smash cháy sân đâu nè! 🏸 Cứ mạnh dạn bước ra sân, đánh hỏng thì cười trừ xin lỗi rồi đánh tiếp. Quan trọng là mình vui và rèn luyện sức khỏe. Tự tin lên bạn nhé!`
    ],
    quickPrompts: ['🏸 Kèo Newbie / Yếu vui vẻ', '🎯 Đo xem tôi thuộc trình nào', '💡 Văn hóa khi đi vãng lai']
  },
  {
    id: 'SCEN_005',
    topic: 'Cảm xúc & Tâm lý',
    name: 'Nản lòng, chán nản muốn bỏ chơi cầu lông',
    regex: '(muon bo|muốn bỏ|bo cau long|bỏ cầu lông|nan qua|nản quá|khong tien bo|không tiến bộ|danh mai khong len|đánh mãi không lên|chan choi|chán chơi)',
    responses: [
      `Đừng vội buông vợt bạn ơi! 🥺 Trong thể thao có một giai đoạn gọi là "điểm nghẽn phong độ" (plateau) – bạn tập mãi mà thấy không tiến bộ thêm, thậm chí đánh tệ đi. Nhưng chỉ cần vượt qua điểm này, trình độ bạn sẽ bật lên một nấc thang mới!\n\n💡 **Mẹo của Bé Cầu giúp bạn tìm lại lửa đam mê:**\n1. Đổi dòng cước mới hoặc căng lại số kg vừa tay hơn (thử 10.5kg cước BG66 Ultimax xem sao).\n2. Đi giao lưu một sân hoàn toàn mới để đổi không khí và gặp những người bạn mới.\n3. Tập trung vào bộ chân (footwork) thay vì cố đập mạnh.\n\nNghỉ ngơi 1-2 hôm rồi xách vợt ra sân thử lại nhé, Bé Cầu tin bạn làm được mà! 🏸💪`
    ],
    quickPrompts: ['💡 Cách nâng trình từ TB Yếu lên TB', '🏸 Đổi gió tìm sân mới hôm nay', '🎯 Đo lại trình độ']
  },
  {
    id: 'SCEN_006',
    topic: 'Cảm xúc & Tâm lý',
    name: 'Lười biếng, phân vân có nên đi đánh cầu không',
    regex: '(luoi qua|lười quá|co nen di khong|có nên đi không|phan van|phân vân|nam uon|nằm ươn|khong muon day|không muốn dậy)',
    responses: [
      `Chiếc giường lúc nào cũng êm ái, nhưng cảm giác ướt đẫm mồ hôi sau 2 tiếng chạy nhảy trên sân còn "phê" hơn gấp 100 lần bạn ơi! 🛌➡️🏸\n\nNghiên cứu chỉ ra rằng: **Khoảnh khắc khó khăn nhất chính là lúc xỏ giày và bước chân ra cửa**. Chỉ cần bước ra tới sân thôi là bao nhiêu lười biếng tan biến hết!\n\nĐứng dậy xỏ giày ngay nào, Bé Cầu cỗ vũ bạn nè: 1, 2, 3... đi đánh cầu thôi! 🚀🔥`
    ],
    quickPrompts: ['🏸 Tìm kèo gần nhất (< 2km)', '🏸 Kèo chiều tối nay', '💡 Bí kíp chiến thắng cơn lười']
  },
  {
    id: 'SCEN_007',
    topic: 'Cảm xúc & Tâm lý',
    name: 'Quạu quọ, bực bội trong người',
    regex: '(quau|quạu|buc boi|bực bội|kho chiu|khó chịu|bực mình|buc minh|nong tinh|nóng tính|cau gat|cáu gắt)',
    responses: [
      `Uống một ngụm nước mát hạ hỏa xíu nè bạn ơi! 🧊 Cục tức để trong lòng chỉ tổ nặng người thôi à.\n\nMẹo kinh điển của lông thủ: Gom hết mọi bực bội dồn vào một cú jump-smash cắm thẳng xuống sàn! Đảm bảo nghe tiếng nổ cái "bốp" là ruột gan nhẹ bẫng liền. Ra sân giải tỏa ngay thôi! 🏸💥`
    ],
    quickPrompts: ['🏸 Kèo giao lưu tối nay', '💡 Cách kiềm chế cảm xúc trên sân', '🥰 Cảm ơn Bé Cầu nha']
  },
  {
    id: 'SCEN_008',
    topic: 'Cảm xúc & Tâm lý',
    name: 'Lo lắng vì lần đầu đi đánh vãng lai một mình',
    regex: '(di mot minh|đi một mình|lan dau di vang lai|lần đầu đi vãng lai|bo ngo|bỡ ngỡ|khong quen ai|không quen ai|lac long|lạc lõng)',
    responses: [
      `Đi vãng lai một mình thực ra siêu vui và tự do luôn bạn ơi! 🏸✨ Bạn không cần phải phụ thuộc lịch của ai, thích đi giờ nào là xách vợt đi giờ đó.\n\nBé Cầu mách bạn công thức "hòa nhập thần tốc":\n1. Đến sớm 5-10 phút, hỏi bảo vệ hoặc người trong sân: *"Dạ cho em hỏi sân anh/chị [Tên Host] ở đâu ạ?"*\n2. Gặp Host, cười tươi chào: *"Dạ em là [Tên] vãng lai đặt slot trên TimVangLai nè anh/chị!"*\n3. Khởi động kỹ và bắt chuyện nhẹ nhàng với bạn cùng sân.\nChỉ sau 1 set là cười nói rôm rả như bạn thân mấy năm liền á, tự tin lên nha! 🥰`
    ],
    quickPrompts: ['🏸 Tìm kèo Host thân thiện hôm nay', '💡 Cẩm nang đi vãng lai cho người mới', '🎯 Đo trình độ']
  },
  {
    id: 'SCEN_009',
    topic: 'Cảm xúc & Tâm lý',
    name: 'Hết tiền, viêm màng túi nhưng vẫn thèm đánh',
    regex: '(het tien|hết tiền|chay tui|cháy túi|viem mang tui|viêm màng túi|ngheo qua|nghèo quá|khong co tien|không có tiền)',
    responses: [
      `Đồng cảm sâu sắc với kiếp "viêm màng túi" vì dồn hết tiền mua vợt với cầu lông! 😂💸\n\nĐừng lo, trên TimVangLai có rất nhiều kèo giao lưu sinh viên / phong trào với mức giá siêu hạt dẻ chỉ từ **35k - 50k / buổi** (đã bao gồm cả tiền sân và tiền cầu luôn á)! Bạn bấm lọc kèo giá mềm bên dưới đi nè:`
    ],
    quickPrompts: ['🏸 Kèo giá sinh viên (< 50k)', '🏸 Kèo nữ miễn phí / giá rẻ', '💡 Cách tiết kiệm chi phí chơi cầu']
  },
  {
    id: 'SCEN_010',
    topic: 'Cảm xúc & Tâm lý',
    name: 'Cuối tuần rảnh rỗi không biết làm gì',
    regex: '(cuoi tuan ranh|cuối tuần rảnh|khong biet lam gi|không biết làm gì|ranh qua|rảnh quá|cuối tuần chán|cuoi tuan chan)',
    responses: [
      `Cuối tuần rảnh rỗi mà ở nhà lướt điện thoại thì uổng phí thanh xuân lắm nha bạn ơi! 🌤️🏸\n\nThứ 7, Chủ Nhật là lúc các sân cầu sôi động nhất: từ các ca sáng mát mẻ 6h-8h đến các ca chiều giao lưu đông vui 16h-18h, 18h-20h. Đánh xong lại kéo nhau đi ăn uống tăng 2 chém gió bao vui luôn!\n\nĐể Bé Cầu dắt bạn đi một vòng xem các kèo hot cuối tuần nha:`
    ],
    quickPrompts: ['🏸 Kèo Thứ 7 & Chủ Nhật', '🏸 Kèo sáng cuối tuần 8h - 10h', '🏸 Kèo chiều giao lưu vui vẻ']
  },

  // ==========================================
  // TOPIC 2: GIA ĐÌNH, TÌNH YÊU & ĐỜI SỐNG (11-20)
  // ==========================================
  {
    id: 'SCEN_011',
    topic: 'Gia đình & Tình yêu',
    name: 'Vợ / Bồ cấm đi đánh cầu, cất giấu vợt',
    regex: '(vo cam|vợ cấm|vo khong cho|vợ không cho|nguoi yeu cam|người yêu cấm|bo doi|bồ dỗi|so vo|sợ vợ|noc nha|nóc nhà|tron vo|trốn vợ|ban gai khong cho|bạn gái cấm|giau vot|giấu vợt)',
    responses: [
      `Haha, đây đúng là "kiếp nạn thứ 82" kinh điển của anh em lông thủ rồi! 🤣 "Nóc nhà" mà đã nghiêm mặt thì đố ai dám trái lệnh đúng không nè?\n\nBé Cầu mách nước cho bạn 3 chiêu "xin visa" cực kỳ hiệu nghiệm:\n1. **Chiêu 1 (Cùng vui):** Rủ vợ/người yêu đi theo làm "Cổ động viên VIP", mua sẵn ly trà sữa full topping đặt ngay ghế ngồi. Vừa được đánh vừa ghi điểm tâm lý!\n2. **Chiêu 2 (Lập công chuộc tội):** Trước khi đi 1 tiếng, chủ động rửa chén, quét nhà, phơi đồ sạch bong rồi nhỏ nhẹ: *"Anh đi thể dục 1 tiếng rèn luyện sức khỏe để về phục vụ gia đình nha!"* 😇\n3. **Chiêu 3 (Chiến thuật du kích):** Nay ở nhà ngoan ngoãn, mai xin đi ca sáng sớm 6h - 8h lúc nóc nhà còn đang ngủ say! 🌅`
    ],
    quickPrompts: ['🏸 Tìm kèo sáng sớm (mai đi)', '💡 Mẹo xin visa đi đánh cầu', '🥰 Cảm ơn Bé Cầu nha']
  },
  {
    id: 'SCEN_012',
    topic: 'Gia đình & Tình yêu',
    name: 'Đánh về khuya bị khóa cửa ngoài',
    regex: '(khoa cua|khóa cửa|nhot ngoai|nhốt ngoài|ve tre|về trễ|ve muon|về muộn|ngu ngoai san|ngủ ngoài sân|khong cho vao nha|không cho vào nhà)',
    responses: [
      `Ui chao, ca này căng thẳng ngang ngửa trận chung kết Olympic luôn á! 😱🚪\n\nNhanh trí làm ngay 3 bước:\n1. Bật ngay giọng nói chân thành, gọi điện hoặc nhắn tin nhận lỗi nhẹ nhàng, tuyệt đối không cãi lý!\n2. Ghé ngay tiệm tiện lợi hoặc quán ven đường mua một phần đồ ăn khuya nóng hổi (bánh bao, chè thái, hủ tiếu) mang về dâng lên "nóc nhà" chuộc tội.\n3. Nếu bất khả kháng... ghé quán net hoặc nhà đồng đội tá túc tạm, mai về nấu bữa sáng tạ lỗi nha bạn ơi! 😂`
    ],
    quickPrompts: ['🏸 Lần sau tìm kèo kết thúc sớm trước 21h', '💡 Bài học kinh nghiệm giờ giấc']
  },
  {
    id: 'SCEN_013',
    topic: 'Gia đình & Tình yêu',
    name: 'Bị người yêu giận vì mê cầu lông hơn mê bồ',
    regex: '(me cau long hon me|mê cầu lông hơn mê|bo gian|bồ giận|nguoi yeu gian|người yêu giận|chon cau hay chon em|chọn cầu hay chọn em)',
    responses: [
      `Câu hỏi kinh điển: *"Giữa cây vợt với em, anh chọn ai?"* 😅 Đứng trước câu này mà trả lời ấp úng là "gãy vợt" liền nha!\n\nTrả lời đúng bài nè: *"Cây vợt chỉ giúp anh rèn luyện trái tim khỏe mạnh, để trái tim đó yêu em trọn đời thôi nè!"* 💕 Sau đó nhớ bù đắp bằng một buổi hẹn hò ăn uống lãng mạn trọn vẹn, không nhắc gì đến cầu lông là nàng êm đẹp ngay!`
    ],
    quickPrompts: ['💡 Văn mẫu dỗ người yêu', '🏸 Kèo đôi nam nữ rủ bồ đi cùng']
  },
  {
    id: 'SCEN_014',
    topic: 'Gia đình & Tình yêu',
    name: 'Bị vợ tra khảo tiền quỹ đen mua vợt',
    regex: '(quy den|quỹ đen|mua vot bao nhieu|mua vợt bao nhiêu|gia cay vot|giá cây vợt|khai gian gia|khai gian giá|bi vo phat hien|bị vợ phát hiện)',
    responses: [
      `Định luật bất thành văn của mọi lông thủ có gia đình: Cây vợt 4 triệu thì về nhà chỉ được khai là "cào cào 400k em mua thanh lý của thằng bạn"! 🤫🏸\n\nNếu lỡ bị phát hiện rồi thì nhớ khai thật là: *"Cây này xịn đánh êm tay không bị đau vai gáy, để anh có sức khỏe cày tiền nộp lương cho em đó!"* Nịnh khéo một câu là sóng yên biển lặng liền à!`
    ],
    quickPrompts: ['💡 Cách bảo vệ quỹ đen mua vợt', '🏸 Tìm kèo giá rẻ tiết kiệm']
  },
  {
    id: 'SCEN_015',
    topic: 'Gia đình & Tình yêu',
    name: 'Rủ crush / người yêu đi đánh cầu lông cùng',
    regex: '(ru crush|rủ crush|ru nguoi yeu|rủ người yêu|danh cau voi crush|đánh cầu với crush|huong dan crush|hướng dẫn crush)',
    responses: [
      `Cơ hội vàng để ghi điểm đây rồi bạn ơi! 💘 Cầu lông là môn thể thao số 1 để gắn kết tình cảm luôn á.\n\n💡 **Bí kíp thả thính trên sân cầu:**\n• Cầm tay hướng dẫn crush cách cầm vợt chuẩn V-shape.\n• Nhường cầu nhẹ nhàng, tưng cầu vừa tầm để crush đánh qua lưới được (tuyệt đối KHÔNG smash cắm mặt thể hiện nha! 😂).\n• Chuẩn bị sẵn khăn sạch, nước uống mát lạnh và một vài thanh chocolate/chuối.\nBảo đảm crush đổ đứ đừ luôn!`
    ],
    quickPrompts: ['🏸 Kèo giao lưu đôi Nam Nữ', '💡 Hướng dẫn luật cơ bản cho Newbie']
  },
  {
    id: 'SCEN_016',
    topic: 'Gia đình & Tình yêu',
    name: 'Tìm người yêu / thoát ế trên sân cầu lông',
    regex: '(tim nguoi yeu|tìm người yêu|thoat e|thoát ế|kiem bo|kiếm bồ|tim ban gai|tìm bạn gái|tim ban trai|tìm bạn trai)',
    responses: [
      `Sân cầu lông chính là "ứng dụng hẹn hò chân thực nhất" đó bạn ơi! 🥰 Vừa khỏe khoắn, vừa nhìn thấy tính cách thật của đối phương (xem lúc thua có quạu không, có ga-lăng nhường cầu không).\n\nTrên app TimVangLai có rất nhiều kèo giao lưu Đôi Nam Nữ vui vẻ, lịch sự. Bạn cứ tham gia đều đặn, ăn mặc gọn gàng thơm tho, thái độ hòa đồng nhiệt tình thì kiểu gì cũng "bắt trúng quả cầu tình duyên" nha!`
    ],
    quickPrompts: ['🏸 Kèo tuyển cả Nam và Nữ', '🎯 Đo trình độ ghép cặp', '💡 Bí kíp ga-lăng trên sân']
  },
  {
    id: 'SCEN_017',
    topic: 'Gia đình & Tình yêu',
    name: 'Bị so sánh với chồng nhà người ta',
    regex: '(chong nha nguoi ta|chồng nhà người ta|so sanh|so sánh|nguoi ta khong choi|người ta không chơi)',
    responses: [
      `Nghe câu này chạnh lòng ghê! 🥺 Nhưng bạn hãy tự hào là mình đam mê một môn thể thao lành mạnh, rèn luyện phản xạ, tim mạch và cơ bắp, chứ không hề sa đà vào các tệ nạn hư hỏng khác.\n\nHãy chứng minh bằng hành động: Đánh cầu xong về nhà vui vẻ, tràn đầy năng lượng, phụ giúp gia đình chu đáo. Khi thấy bạn khỏe mạnh và tích cực, người thân sẽ dần ủng hộ thôi nè!`
    ],
    quickPrompts: ['🏸 Kèo ca sớm 6h - 8h (không ảnh hưởng gia đình)', '🥰 Cảm ơn Bé Cầu nha']
  },
  {
    id: 'SCEN_018',
    topic: 'Gia đình & Tình yêu',
    name: 'Trốn con / trốn việc nhà đi đánh ca đêm',
    regex: '(tron con|trốn con|tron viec nha|trốn việc nhà|ca khuya|ca dem|ca đêm|danh 20h|đánh 20h)',
    responses: [
      `Cảm giác ru con ngủ say xong, nhẹ nhàng xách bao vợt lén lút dắt xe ra khỏi cổng... đúng là hồi hộp như điệp viên 007 luôn! 🕵️‍♂️🏸\n\nCa 20h-22h hoặc 21h-23h là khung giờ vàng của các "ông bố bỉm sữa" đam mê cầu lông. Bé Cầu có sẵn rất nhiều kèo ca khuya cho bạn lựa chọn nè:`
    ],
    quickPrompts: ['🏸 Kèo ca khuya 20h - 22h', '🏸 Kèo 21h - 23h hôm nay', '⚡ Kèo Tân Bình tối nay']
  },
  {
    id: 'SCEN_019',
    topic: 'Gia đình & Tình yêu',
    name: 'Người yêu chê hôi mùi mồ hôi sau ca đánh',
    regex: '(hoi mo hoi|hôi mồ hôi|mui mo hoi|mùi mồ hôi|nhoet nhoet|nhớp nháp|chê hôi|che hoi)',
    responses: [
      `Cảnh báo khẩn cấp nha! 🚨 Mùi mồ hôi sau 2 tiếng vận động có thể là "vũ khí hủy diệt" tình cảm đó!\n\n💡 **Bộ đồ nghề lông thủ thông minh luôn cần có:**\n1. Một bộ quần áo sạch để thay ngay tại phòng thay đồ sân cầu.\n2. Khăn lau và chai lăn khử mùi / xịt body thể thao.\n3. Nếu sân có phòng tắm nóng lạnh thì tắm gội sạch sẽ thơm tho trước khi về gặp người yêu nha bạn ơi!`
    ],
    quickPrompts: ['🏸 Sân có phòng tắm nóng lạnh', '💡 Mẹo vệ sinh túi vợt & giày']
  },
  {
    id: 'SCEN_020',
    topic: 'Gia đình & Tình yêu',
    name: 'Mẹo nịnh vợ / chuộc lỗi sau khi đi đánh cầu về trễ',
    regex: '(ninh vo|nịnh vợ|chuoc loi|chuộc lỗi|lam hoa|làm hòa|dỗ bồ|do bo)',
    responses: [
      `Tuyệt chiêu làm hòa 3 bước bất bại của Bé Cầu đây:\n1. **Bước 1:** Mang theo "vật phẩm cống nạp" (trà sữa ít đường, hộp trái cây gọt sẵn, bánh ngọt nàng thích).\n2. **Bước 2:** Massage bóp vai, đấm lưng cho vợ/bồ 15 phút kèm lời khen: *"Em ở nhà vất vả quá, anh thương em nhất!"*\n3. **Bước 3:** Chủ động nhận làm việc nhà sáng mai mà không cần nhắc.\nĐảm bảo lần sau xin đi đánh cầu lại được duyệt visa cái rụp! 😇✨`
    ],
    quickPrompts: ['🏸 Tìm kèo hôm sau', '🥰 Cảm ơn Bé Cầu nha']
  },

  // ==========================================
  // TOPIC 3: TÌNH HUỐNG CHIẾN THUẬT & TRÊN SÂN (21-32)
  // ==========================================
  {
    id: 'SCEN_021',
    topic: 'Chiến thuật & Trên sân',
    name: 'Bị bán hành ngập mồm, thua trắng bụng',
    regex: '(bi hanh|bị hành|ban hanh|bán hành|an hanh|ăn hành|danh do|đánh dở|danh te|đánh tệ|thua sach|thua sạch|thua dam|thua đậm|hut cau|hụt cầu)',
    responses: [
      `Ui chao, chuyện bình thường ở huyện luôn bạn ơi! 🏸😅 Có ngày tay dẻo như bún, có ngày cầm vợt mà ngỡ như cầm... chảo chiên trứng vậy á!\n\nBạn đừng nản nha, châm ngôn của lông thủ tụi mình là gì: **"Thắng không kiêu, bại mua cầu đánh tiếp!"** 💪 Kể cả các huyền thoại như Lee Chong Wei hay Axelsen cũng từng bị "ăn hành" cả trăm lần trước khi bước lên đỉnh vinh quang mà.\n\n💡 **Mẹo lấy lại tự tin:** Xem lại nhịp thở, di chuyển sớm 0.5 giây và chọn kèo đúng trình độ (TB Yếu / Newbie) để kéo lại cảm giác cầu nha!`
    ],
    quickPrompts: ['🎯 Đo lại trình độ của tôi', '🏸 Kèo TB Yếu giao lưu vừa sức', '💡 Cách cải thiện lực cổ tay']
  },
  {
    id: 'SCEN_022',
    topic: 'Chiến thuật & Trên sân',
    name: 'Đối thủ đánh rùa, tạt đập xấu xí mà toàn ăn điểm',
    regex: '(danh rua|đánh rùa|rua qua|rùa quá|danh xau|đánh xấu|dap xau|đập xấu|an diem rua|ăn điểm rùa|may man|may mắn quá)',
    responses: [
      `Haha, gặp mấy tay "cầu thủ công nhân" đánh xấu xí mà bóng nào cũng sang sân thì ức chế thiệt! 🤣 Cầu bay xoắn quẩy, tạt quẹt quẹt chạm lưới rớt cái tọt.\n\n💡 **Cách khắc phục:**\n• Đừng bị cuốn theo lối đánh nhịp lạ của đối phương.\n• Giữ bình tĩnh, ép cầu sâu về hai góc cuối sân hoặc kéo lưới chủ động.\n• Trong cầu lông, cầu rơi trong sân là có điểm, nên kiên nhẫn mới là vua nha bạn ơi!`
    ],
    quickPrompts: ['💡 Chiến thuật đối đầu đối thủ đánh phòng thủ rùa', '🎯 Đo trình độ']
  },
  {
    id: 'SCEN_023',
    topic: 'Chiến thuật & Trên sân',
    name: 'Đánh cặp giẫm chân nhau, không hiểu ý',
    regex: '(giam chan|giẫm chân|khong hieu y|không hiểu ý|tranh cau|tranh cầu|va nhau|đụng nhau|dung nhau|danh cap roi|đánh cặp rối)',
    responses: [
      `Đánh đôi mà chưa quen ý thì như hai chiếc xe máy cua chung một khúc cua vậy á! 🛵💥\n\n💡 **Nguyên tắc phân chia sân đôi căn bản:**\n1. **Khi bên mình tấn công (đang đập/gài lưới):** Đứng đội hình **Trước - Sau** (người đập đứng sau, người canh lưới đứng trước).\n2. **Khi bên mình phòng thủ (bị đối thủ đập):** Lập tức tản ra đứng **Song song (Trái - Phải)** để chia đôi sân.\n3. Quả cầu rơi ở giữa: Thường ưu tiên người thuận tay trái hoặc người có tay thuận ở giữa sân xử lý nha!`
    ],
    quickPrompts: ['💡 Sơ đồ di chuyển đánh đôi chuẩn', '🏸 Tìm kèo luyện phối hợp']
  },
  {
    id: 'SCEN_024',
    topic: 'Chiến thuật & Trên sân',
    name: 'Đồng đội toxic, hay cằn nhằn đổ lỗi',
    regex: '(dong doi toxic|đồng đội toxic|can nhan|cằn nhằn|do loi|đổ lỗi|quau voi minh|quạu với mình|chui dong doi|chửi đồng đội|to tieng|to tiếng)',
    responses: [
      `Đi đánh cầu để xả stress mà gặp đồng đội "mặt như cái bánh bao ngâm nước", đánh hỏng một quả là lườm nguýt thì đúng là tụt mood thật sự! 😤\n\nCách xử lý khéo léo của dân phong trào bản lĩnh:\n• Mỉm cười, giơ tay: *"Ok lỗi mình, quả sau làm lại!"* (để hạ nhiệt).\n• Tập trung vào quả cầu của mình, không tranh cãi.\n• Hết set đó thì đổi sân hoặc khéo léo xin Host xếp cặp khác.\nCầu lông là thể thao vui vẻ, ai toxic thì mình né ra cho nhẹ đầu bạn nhé! 🍃`
    ],
    quickPrompts: ['🏸 Tìm sân giao lưu văn minh vui vẻ', '💡 Văn hóa ứng xử trên sân']
  },
  {
    id: 'SCEN_025',
    topic: 'Chiến thuật & Trên sân',
    name: 'Bị đối thủ khoét quả trái tay (backhand)',
    regex: '(trai tay|trái tay|backhand|yeu trai tay|yếu trái tay|khoet trai tay|khoét trái tay|phong trai tay|phông trái tay)',
    responses: [
      `Cú trái tay (Backhand) chính là "tử huyệt" của 80% lông thủ phong trào! Đối thủ mà tinh ý là cứ dồn sâu vào góc trái tay ép mình đánh hỏng.\n\n💡 **Bí kíp chữa cháy tức thì:**\n1. **Chuyển sang đi bộ vòng (Around the head):** Cố gắng di chuyển nhanh hơn nửa bước để dùng cú thuận tay vòng qua đầu phông lại.\n2. **Nếu buộc phải đánh trái tay:** Đừng cố phông cầu bổng về cuối sân (rất dễ hụt lực rớt giữa sân bị đối thủ đập chết), hãy **chém nhẹ quả cầu chéo lưới** hoặc gõ ngắn sang sân họ để đổi nhịp!`
    ],
    quickPrompts: ['💡 Kỹ thuật cầm vợt trái tay chuẩn', '🎯 Đo trình độ cổ tay']
  },
  {
    id: 'SCEN_026',
    topic: 'Chiến thuật & Trên sân',
    name: 'Đập cầu toàn rúc lưới hoặc ra ngoài biên',
    regex: '(dap ruc luoi|đập rúc lưới|dap ra ngoai|đập ra ngoài|smash hong|smash hỏng|dap cau toan hut|đập cầu toàn hụt)',
    responses: [
      `Đập rúc lưới thường do 2 nguyên nhân cốt lõi nè:\n1. **Điểm tiếp xúc cầu quá thấp hoặc quá phía sau đầu:** Cầu chưa rơi đến vị trí trước trán mà đã vung vợt thì chỉ có nước cắm lưới.\n2. **Gập cổ tay quá sớm:** Cố gắng gập cổ tay khi mặt vợt chưa tiếp xúc trọn vẹn quả cầu.\n\n👉 **Lời khuyên:** Đứng nghiêng người đón cầu, vung vợt tiếp xúc quả cầu ở điểm cao nhất phía trước mặt 30cm, đập với 70-80% lực để cầu đi chuẩn xác trước khi dùng 100% lực nha bạn!`
    ],
    quickPrompts: ['💡 Video hướng dẫn kỹ thuật smash chuẩn', '🎯 Đo trình độ']
  },
  {
    id: 'SCEN_027',
    topic: 'Chiến thuật & Trên sân',
    name: 'Đỡ smash không nổi, tay rung bần bật',
    regex: '(do smash|đỡ smash|thu cau|thủ cầu|do dap|đỡ đập|dap manh qua|đập mạnh quá|tay rung|tay run)',
    responses: [
      `Đối thủ đập rát như súng liên thanh mà mình đứng như tượng thì hoảng thật! 🏸⚡\n\n💡 **Mẹo thủ cầu vững như bàn thạch:**\n• **Hạ thấp trọng tâm:** Khuỵu hai đầu gối xuống, ngực hơi chồm về trước.\n• **Cầm vợt ngắn lên:** Kéo tay cầm lên phía trên cán vợt một chút để tăng tốc độ phản xạ xoay sở.\n• **Không vung tay quá rộng:** Chỉ cần dùng lực bật của cổ tay và mượn lực quả cầu đang lao tới để tạt thẳng về hai góc lưới là đối phương hết bài đập ngay!`
    ],
    quickPrompts: ['💡 Bài tập phản xạ thủ cầu', '🏸 Kèo giao lưu học hỏi thủ cầu']
  },
  {
    id: 'SCEN_028',
    topic: 'Chiến thuật & Trên sân',
    name: 'Đối thủ khiêu khích, gáy to, ăn mừng lố',
    regex: '(gay to|gáy to|khieu khich|khiêu khích|an mung qua lo|ăn mừng quá lố|ca khia|cà khịa|mat day|mất dạy tren san)',
    responses: [
      `Gặp đối thủ thích "gáy" thì cách đáp trả ngọt ngào và đau đớn nhất không phải là cãi nhau, mà là **đánh bại họ trên bảng tỷ số!** 🏆🏸\n\nGiữ một cái đầu lạnh như băng, mỉm cười nhẹ rồi siết chặt từng điểm số. Khi bạn thắng 21-19 ở set quyết định thì sự im lặng của họ chính là âm thanh tuyệt vời nhất trên đời!`
    ],
    quickPrompts: ['💡 Nghệ thuật tâm lý chiến trong cầu lông', '🏸 Tìm kèo văn minh']
  },
  {
    id: 'SCEN_029',
    topic: 'Chiến thuật & Trên sân',
    name: 'Thắng lội ngược dòng kịch tính (deuce 29-30)',
    regex: '(deuce|duce|29 30|loi nguoc dong|lội ngược dòng|thang kich tinh|thắng kịch tính|set dau nghe ngop|set đấu nghẹt thở)',
    responses: [
      `CHÚC MỪNG CHIẾN THẮNG QUÁ ĐỈNH CAO! 🏆🎉 Đánh deuce lên tận 29-30 thì tim đập thình thịch 180 nhịp/phút chứ chẳng chơi!\n\nNhững trận cầu lội ngược dòng ngoạn mục thế này chính là lý do vì sao tụi mình mê môn cầu lông đến phát cuồng. Cảm giác ghi điểm match-point nó sướng rơn từng tế bào luôn á!`
    ],
    quickPrompts: ['🏸 Tìm thêm kèo tối nay tiếp đà hưng phấn', '🥰 Chia sẻ niềm vui với Bé Cầu']
  },
  {
    id: 'SCEN_030',
    topic: 'Chiến thuật & Trên sân',
    name: 'Đối thủ out trình đập thẳng vào người',
    regex: '(out trinh|out trình|dap vao nguoi|đập vào người|dap thang mat|đập thẳng mặt|chenh lech trinh|chênh lệch trình)',
    responses: [
      `Bị đối thủ out trình đập thẳng vào người thì vừa đau vừa ức! Trong thi đấu chuyên nghiệp, đập vào thân người (body smash) là chiến thuật ăn điểm hợp lệ, nhưng ở sân phong trào giao lưu vui vẻ mà đối thủ cố tình đập ác ý thì kém văn minh thật.\n\nBạn hãy lùi sâu thêm nửa bước để có thời gian phản xạ đưa vợt che mặt, và nhớ yêu cầu Host cân bằng lại đội hình cho cân sức nha!`
    ],
    quickPrompts: ['🏸 Tìm kèo đúng trình độ', '💡 Cách né và phản đòn body smash']
  },
  {
    id: 'SCEN_031',
    topic: 'Chiến thuật & Trên sân',
    name: 'Đập trúng mặt hoặc người đồng đội',
    regex: '(dap trung dong doi|đập trúng đồng đội|dap trung mat|đập trúng mặt|danh trung ban|đánh trúng bạn|lo tay danh trung|lỡ tay đánh trúng)',
    responses: [
      `Úi cha, "tai nạn nghề nghiệp" ám ảnh nhất của người đánh đôi! 😱 Quả cầu lông bay với tốc độ hơn 200km/h trúng người là tím bầm liền.\n\nNhớ lập tức dừng trận đấu, chạy lại đỡ đồng đội, xin lỗi chân thành và xin ngay túi đá ở quầy nước để chườm lạnh nhé. Đừng quên mua tặng bạn một chai nước chuộc lỗi nha bạn!`
    ],
    quickPrompts: ['💡 Cách đứng an toàn cho người đứng lưới', '🩹 Sơ cứu vết bầm tím']
  },
  {
    id: 'SCEN_032',
    topic: 'Chiến thuật & Trên sân',
    name: 'Đánh đôi nam nữ: chiến thuật bọc lót bạn nữ',
    regex: '(doi nam nu|đôi nam nữ|boc lot ban nu|bọc lót bạn nữ|danh voi nu|đánh với nữ|nam nu phối hợp)',
    responses: [
      `Đánh đôi Nam Nữ là bài kiểm tra độ ga-lăng và sự tinh tế đỉnh cao của phái mạnh! 🏸🌸\n\n💡 **Chiến thuật chuẩn bài:**\n• **Bạn nữ:** Đứng chủ động bao quát lưới từ giữa sân trở lên, giơ vợt cao sẵn sàng gài lưới, bỏ nhỏ và chụp những quả cầu ngắn.\n• **Bạn nam:** "Bao sân" toàn bộ nửa sân phía sau, di chuyển liên tục từ trái qua phải để đập cầu hoặc phông cầu cứu nguy cho bạn nữ.\nQuan trọng nhất là luôn mỉm cười động viên bạn nữ, không bao giờ cằn nhằn nha!`
    ],
    quickPrompts: ['🏸 Kèo Đôi Nam Nữ giao lưu', '💡 Kỹ thuật di chuyển cho Nam khi đánh cặp Nữ']
  },

  // ==========================================
  // TOPIC 4: SỰ CỐ VỢT, CƯỚC, GIÀY & ĐỒ NGHỀ (33-42)
  // ==========================================
  {
    id: 'SCEN_033',
    topic: 'Đồ nghề & Sự cố',
    name: 'Đấu kiếm va chạm gãy đôi khung vợt',
    regex: '(dau kiem|đấu kiếm|va vot|va vợt|gay vot|gãy vợt|gay doi|gãy đôi|nut vot|nứt vợt|dung vot|đụng vợt)',
    responses: [
      `Âm thanh "CỐC" một phát nghe xót xa tận đáy lòng luôn bạn ơi! 😭💔 Tiền triệu bay theo làn mây trong vòng 1 tích tắc.\n\n💡 **Quy tắc văn hóa đấu kiếm gãy vợt:**\n• Xem xét tình huống quả cầu: Nếu quả cầu ở phần sân của ai mà người kia ham cầu chạy sang tranh dẫn đến va chạm thì người đó nên chủ động hỗ trợ 50% tiền vợt.\n• Nếu cả hai cùng có lỗi: Thường hai bạn tự chịu hoặc cưa đôi chia sẻ.\nLần sau nhớ hô to *"Cầu của anh!"* hoặc *"Em nhường!"* để tránh tái diễn nha!`
    ],
    quickPrompts: ['💡 Kinh nghiệm ứng xử khi đấu kiếm gãy vợt', '🏸 Tư vấn vợt bền khung']
  },
  {
    id: 'SCEN_034',
    topic: 'Đồ nghề & Sự cố',
    name: 'Vừa căng cước hôm qua hôm nay đã đứt',
    regex: '(dut cuoc|đứt cước|vua cang xong da dut|vừa căng xong đã đứt|dut day|đứt dây|cang 11kg dut|căng cước mau đứt)',
    responses: [
      `Vừa tốn 120k - 150k căng cước mà đánh được 2 set đứt ngang thì tức anh ách! 😤\n\n💡 **Nguyên nhân chủ yếu:**\n1. **Đánh cạch cầu vào mép vành khung (miss-hit):** Kể cả cước nồi đồng cối đá BG65 mà đập cạch cầu sát mép trên đầu vợt là đứt ngay lập tức.\n2. **Kẹp gen hoặc gen bị nứt:** Lưỡi gen sắc cứa vào dây cước.\n3. **Căng quá căng (> 11.5kg):** Dây càng căng thì càng giòn, chỉ cần lệch tâm là đứt.\n👉 Lời khuyên: Hạ xuống 10.5kg và dùng cước BG65 hoặc Nanogy 95 cho bền nhé!`
    ],
    quickPrompts: ['💡 So sánh độ bền các loại cước Yonex', '🏸 Tư vấn mức căng phù hợp']
  },
  {
    id: 'SCEN_035',
    topic: 'Đồ nghề & Sự cố',
    name: 'Quên mang giày cầu lông (đi dép/giày tây)',
    regex: '(quen giay|quên giày|quen mang giay|quên mang giày|di dep to ong|đi dép tổ ong|mang giay tay|mang giày tây)',
    responses: [
      `Cảnh báo khẩn cấp nha! ⚠️ **TUYỆT ĐỐI KHÔNG mang dép lê, dép tổ ong hoặc giày đế trơn vào sân đánh cầu!**\n\nĐế dép không có độ bám và không có phần đệm giữ cổ chân, bạn chỉ cần nhảy lên tiếp đất hoặc phanh gấp một nhịp là nguy cơ **lật sơ mi hoặc gãy cổ chân** lên tới 90% luôn á!\n\n👉 Giải pháp: Thuê giày tại quầy dịch vụ của sân (thường 20k-30k/buổi), hoặc mượn bạn cùng sân, nếu không có thì ngồi làm cổ động viên chụp ảnh thôi nha bạn!`
    ],
    quickPrompts: ['🩹 Cách phòng ngừa lật sơ mi', '🏸 Tư vấn giày cầu lông giá tốt']
  },
  {
    id: 'SCEN_036',
    topic: 'Đồ nghề & Sự cố',
    name: 'Quên mang vợt, đi mượn khắp sân',
    regex: '(quen vot|quên vợt|quen mang vot|quên mang vợt|muon vot|mượn vợt|khong co vot|không có vợt)',
    responses: [
      `Đi đánh cầu mà quên mang vợt thì giống như lính ra trận mà quên mang súng vậy á! 🤣\n\nĐừng lo, bạn ra ngay quầy lễ tân của sân hỏi thuê vợt (thường 20k-30k/cây), hoặc mạnh dạn hỏi Host: *"Anh/chị ơi có cây sơ-cua nào cho em mượn đánh đỡ set này với!"*. Đa số các Host đều có 1-2 cây vợt dự phòng sẵn lòng cho mượn nha!`
    ],
    quickPrompts: ['🏸 Tìm sân có dịch vụ cho thuê đồ', '🥰 Cảm ơn Bé Cầu nha']
  },
  {
    id: 'SCEN_037',
    topic: 'Đồ nghề & Sự cố',
    name: 'Vợt bị lún gen, sụp khung nguy cơ gãy',
    regex: '(lun gen|lún gen|sup khung|sụp khung|nut khung|nứt khung|bien dang vot|biến dạng vợt)',
    responses: [
      `Nguy hiểm nha! Vợt bị lún gen là dấu hiệu carbon quanh lỗ gen đang bị lực kéo của cước xé toạc ra rồi đó. Nếu bạn tiếp tục đánh quả smash mạnh thì khung vợt sẽ sụp gãy đôi ngay lập tức!\n\n👉 **Khắc phục:** Cắt cước ngay lập tức để giảm áp lực lên khung, đem vợt ra tiệm uy tín thay gen liền (gen chống lún) trước khi căng cước lại nha!`
    ],
    quickPrompts: ['💡 Cách bảo quản khung vợt cầu lông', '🏸 Tư vấn vợt khung carbon bền']
  },
  {
    id: 'SCEN_038',
    topic: 'Đồ nghề & Sự cố',
    name: 'Cán vợt trơn tuột văng bay sang sân đối thủ',
    regex: '(bay vot|bay vợt|vang vot|văng vợt|tron can|trơn cán|tuot vot|tuột vợt|mo hoi tay|mồ hôi tay)',
    responses: [
      `Pha này vừa quê vừa nguy hiểm suýt nữa trúng đầu đối thủ luôn á! 😂🏸\n\nMồ hôi tay nhiều làm quấn cán bị nhơn nhớt trơn tuột. Bạn nên:\n1. Dùng **quấn cán vải (quấn khăn cotton)** thấm hút mồ hôi cực đỉnh.\n2. Mua thêm lọ **phấn thoa tay** (bột chống trơn của cầu lông) thoa vào lòng bàn tay trước mỗi set đấu nha!`
    ],
    quickPrompts: ['💡 So sánh quấn cán cao su vs quấn cán khăn', '🏸 Tư vấn phụ kiện cầu lông']
  },
  {
    id: 'SCEN_039',
    topic: 'Đồ nghề & Sự cố',
    name: 'Phân vân chọn vợt 3U hay 4U, nặng đầu hay công thủ',
    regex: '(3u hay 4u|3u hay la 4u|nang dau hay cong thu|nặng đầu hay công thủ|chon cay vot nao|chọn cây vợt nào|tu van mua vot|tư vấn mua vợt)',
    responses: [
      `💡 **Bí kíp chọn vợt chuẩn không cần chỉnh từ Bé Cầu:**\n• **Trọng lượng (3U vs 4U):**\n  - **4U (80-84g):** Nhẹ, xoay sở nhanh, trợ lực tốt, phù hợp 90% người chơi phong trào từ Newbie đến Trung bình.\n  - **3U (85-89g):** Nặng, cần lực cổ tay và thể lực cực khỏe, hợp với các bạn hay smash uy lực.\n• **Độ cân bằng:**\n  - **Nặng đầu (Head-heavy):** Thích đập cầu, công rát.\n  - **Cân bằng (Even-balance):** Công thủ toàn diện, điều cầu phản tạt linh hoạt.\n👉 Nếu là người mới hoặc chơi giải trí: Bé Cầu khuyên chọn **4U thân dẻo, cân bằng** nha!`
    ],
    quickPrompts: ['💡 Top 5 cây vợt quốc dân dưới 1 triệu', '🎯 Đo trình độ chọn vợt']
  },
  {
    id: 'SCEN_040',
    topic: 'Đồ nghề & Sự cố',
    name: 'Nên căng bao nhiêu kg (10kg, 10.5kg, 11kg)',
    regex: '(cang bao nhieu kg|căng bao nhiêu kg|bao nhieu lbs|bao nhiêu lbs|cang 11kg|căng 11kg|cang 10kg|căng 10kg)',
    responses: [
      `Đừng bắt chước các tuyển thủ chuyên nghiệp căng 13-14kg nha bạn ơi, gãy cổ tay như chơi đó! 😱\n\n💡 **Mức căng chuẩn theo trình độ phong trào:**\n• **Người mới chơi (Newbie):** Căng **9.5kg - 10kg** (dây có độ võng đàn hồi trợ lực, đánh nhẹ cầu vẫn bay sâu).\n• **Trung bình yếu (TB Yếu):** Căng **10.2kg - 10.5kg** (vừa kiểm soát tốt, vừa trợ lực êm tay).\n• **Trung bình khá trở lên:** Căng **10.8kg - 11.2kg** (cần lực cổ tay tốt để phát lực chuẩn xác).`
    ],
    quickPrompts: ['💡 Cách chọn số kg căng cước theo cổ tay', '🎯 Đo trình độ']
  },
  {
    id: 'SCEN_041',
    topic: 'Đồ nghề & Sự cố',
    name: 'Nên chọn cước nào (BG65, BG66 Ultimax, Nanogy 98)',
    regex: '(cuoc bg65|cước bg65|bg66 ultimax|bg66u|nanogy 98|nanogy 95|exbolt 63|exbolt 65|chon day cuoc|chọn dây cước)',
    responses: [
      `💡 **Bảng so sánh 3 dòng cước Yonex kinh điển:**\n1. **Yonex BG65 (Nồi đồng cối đá):** Dây dày 0.70mm, cực kỳ bền, đánh cả năm không đứt, giá rẻ, nhưng tiếng nổ bình thường và độ nảy trung bình.\n2. **Yonex BG66 Ultimax (Âm thanh hủy diệt):** Dây mảnh 0.65mm, nảy cực tốt, đập cầu nổ như pháo hoa, nhưng nhanh đứt (khoảng 3-4 tuần/lần căng).\n3. **Exbolt 63 / 65 (Công nghệ mới):** Phủ sợi rèn Forged Fiber, nảy bén, bền hơn BG66U một chút.\n👉 Thích bền chọn **BG65**, thích sướng tai đã tay chọn **BG66 Ultimax** nha!`
    ],
    quickPrompts: ['💡 Tư vấn cước cho người thích đập cầu', '🏸 Tìm tiệm căng cước uy tín']
  },
  {
    id: 'SCEN_042',
    topic: 'Đồ nghề & Sự cố',
    name: 'Giày mòn đế trơn trượt như trượt băng',
    regex: '(giay mon de|giày mòn đế|giay tron|giày trơn|truot bang|trượt băng|tron truot tren san|trơn trượt trên sân)',
    responses: [
      `Đế giày cầu lông mà bị mòn hết vân cao su non thì chạy trên thảm sân chẳng khác nào đang chơi trượt băng nghệ thuật! ⛸️\n\nĐây là nguyên nhân hàng đầu dẫn đến **lật sơ mi và giãn dây chằng đầu gối**. Nếu giày đã mòn, bạn nên thay ngay một đôi giày chuyên dụng mới (như Kawasaki, Lefus, Kumpoo giá chỉ từ 400k-700k) để bảo vệ đôi chân của mình nha!`
    ],
    quickPrompts: ['💡 Top 3 thương hiệu giày cầu lông ngon bổ rẻ', '🩹 Phòng chống lật sơ mi']
  },

  // ==========================================
  // TOPIC 5: SỨC KHỎE, THỂ LỰC & CHẤN THƯƠNG (43-52)
  // ==========================================
  {
    id: 'SCEN_043',
    topic: 'Sức khỏe & Chấn thương',
    name: 'Lật sơ mi cổ chân cấp tính',
    regex: '(lat so mi|lật sơ mi|treo chan|trẹo chân|trat khop co chan|trật khớp cổ chân|bong gan co chan|bong gân cổ chân)',
    responses: [
      `⚠️ **DỪNG ĐÁNH NGAY VÀ KHÔNG ĐƯỢC RÁNG NHA BẠN ƠI!**\n\n🚑 **Quy trình sơ cứu cấp tốc R.I.C.E:**\n1. **Rest (Nghỉ):** Tháo giày ra, ngồi nghỉ, không cố dặm chân thử.\n2. **Ice (Chườm lạnh):** Xin túi đá lạnh chườm ngay 15-20 phút. *(TUYỆT ĐỐI KHÔNG bôi dầu nóng, Salonpas nóng hay rượu thuốc vì sẽ làm giãn mạch máu gây sưng phù nề xuất huyết nặng hơn!)*\n3. **Compression (Băng ép):** Quấn băng thun nhẹ cố định cổ chân.\n4. **Elevation (Kê cao):** Kê cổ chân cao hơn ngực khi nằm nghỉ.\nNếu sưng to biến dạng, nhớ đi chụp X-quang kiểm tra dây chằng nha!`
    ],
    quickPrompts: ['💡 Cần làm gì trong 24h sau khi lật sơ mi', '🩹 Cách quấn băng bảo vệ cổ chân']
  },
  {
    id: 'SCEN_044',
    topic: 'Sức khỏe & Chấn thương',
    name: 'Đau cổ tay, viêm gân cổ tay',
    regex: '(dau co tay|đau cổ tay|moi co tay|mỏi cổ tay|viem gan co tay|viêm gân cổ tay|dau khop tay|đau khớp tay)',
    responses: [
      `Đau cổ tay thường do bạn dùng lực gập cổ tay quá nhiều khi smash hoặc dùng vợt quá nặng đầu so với thể lực!\n\n💡 **Cách khắc phục:**\n• Nghỉ đánh 3-5 ngày cho gân hồi phục.\n• Chuyển sang phát lực bằng **cẳng tay và xoay trục xương quay** thay vì bẻ gập cổ tay.\n• Đeo băng quấn cổ tay thể thao để trợ lực khi trở lại sân.`
    ],
    quickPrompts: ['💡 Bài tập phục hồi cổ tay với tạ chai nước', '🎯 Đo trình độ phát lực']
  },
  {
    id: 'SCEN_045',
    topic: 'Sức khỏe & Chấn thương',
    name: 'Đau khớp gối, lục cục bánh chè',
    regex: '(dau khop goi|đau khớp gối|dau dau goi|đau đầu gối|luc cuc dau goi|lục cục đầu gối|dau banh che|đau bánh chè)',
    responses: [
      `Khớp gối là bộ giảm xóc quý giá nhất của lông thủ! Đau gối thường do tiếp đất sai kỹ thuật hoặc đánh trên mặt sân xi măng quá cứng.\n\n👉 **Lời khuyên:** Hãy chọn sân có thảm PVC thi đấu đạt chuẩn êm ái, đeo bó gối thể thao và tập thêm bài tập Squat / Wall-sit để tăng cường cơ đùi trước bảo vệ khớp gối nha!`
    ],
    quickPrompts: ['🏸 Tìm sân thảm PVC chuẩn thi đấu', '💡 Bài tập Wall-sit bảo vệ khớp gối']
  },
  {
    id: 'SCEN_046',
    topic: 'Sức khỏe & Chấn thương',
    name: 'Chuột rút bắp chân giữa trận',
    regex: '(chuot rut|chuột rút|rut bap chuoi|rút bắp chuối|co co|co cơ|cung bap chan|cứng bắp chân)',
    responses: [
      `Á á á, chuột rút đau điếng người luôn! 😣\n\n👉 **Xử lý tại chỗ:**\n1. Duỗi thẳng chân ra, nhờ bạn kéo mũi chân ngược về phía đầu gối để kéo giãn cơ bắp chuối từ từ.\n2. Uống ngay ngụm nước khoáng mặn hoặc nước điện giải (Revive, Pocari) để bù Natri và Kali.\n3. Xoa bóp nhẹ nhàng, không cố vào sân đánh tiếp ngay kẻo rách sợi cơ nha!`
    ],
    quickPrompts: ['💡 Uống gì để chống chuột rút khi đánh cầu', '🥰 Cảm ơn Bé Cầu nha']
  },
  {
    id: 'SCEN_047',
    topic: 'Sức khỏe & Chấn thương',
    name: 'Hụt hơi, thở dốc sau 1 set đánh rát',
    regex: '(hut hoi|hụt hơi|tho doc|thở dốc|thieu the luc|thiếu thể lực|yeu the luc|yếu thể lực|het pin|hết pin|tho khong noi|thở không nổi)',
    responses: [
      `Vừa đánh xong 1 set rát mà tim đập thình thịch muốn nhảy ra khỏi lồng ngực đúng không nè? 🫀💨\n\n💡 **Cách hồi phục cấp tốc giữa hiệp:**\n• Tuyệt đối không ngồi bệt xuống đất ngay (máu tụ ở chân gây choáng), hãy đi bộ chậm rãi quanh sân.\n• Hít sâu bằng mũi phình bụng ra, thở chậm bằng miệng để đưa oxy về não.\n• Nhấp từng ngụm nước nhỏ, không tu ừng ực cả chai lạnh nha!`
    ],
    quickPrompts: ['💡 Kế hoạch chạy bộ tăng thể lực cho lông thủ', '🎯 Đo trình độ']
  },
  {
    id: 'SCEN_048',
    topic: 'Sức khỏe & Chấn thương',
    name: 'Đau nhức cơ bắp ê ẩm ngày hôm sau (DOMS)',
    regex: '(e am|ê ẩm|dau co ngay hom sau|đau cơ ngày hôm sau|doms|moi nhu giac|mỏi như giặc|dau khong day noi|đau không dậy nổi)',
    responses: [
      `Chúc mừng bạn! Hiện tượng đau cơ ê ẩm này gọi là DOMS (đau cơ khởi phát muộn), chứng tỏ các sợi cơ của bạn vừa được kích hoạt và đang phát triển mạnh mẽ hơn đó! 💪\n\n👉 **Giảm đau nhanh:** Tắm nước ấm, xoa bóp nhẹ nhàng, uống nhiều nước, ăn đủ đạm (thịt bò, trứng, ức gà) và ngủ đủ giấc. Sau 2 ngày là cơ thể lại nhẹ tênh và khỏe hơn trước nhiều!`
    ],
    quickPrompts: ['💡 Thực đơn dinh dưỡng hồi phục cơ bắp', '🏸 Tìm kèo nhẹ nhàng giãn cơ']
  },
  {
    id: 'SCEN_049',
    topic: 'Sức khỏe & Chấn thương',
    name: 'Phồng rộp lòng bàn chân, bầm móng chân',
    regex: '(phong rop|phồng rộp|bong da chan|bong da chân|bam mong chan|bầm móng chân|thui mong|thui móng|dau ngon chan|đau ngón chân)',
    responses: [
      `Bầm móng chân hoặc phồng rộp là do mũi chân bị trượt dồn về phía trước va đập vào mũi giày khi phanh gấp!\n\n💡 **Khắc phục:**\n1. Chọn giày cầu lông dài hơn bàn chân thật khoảng **0.5cm - 1cm** (thừa một ngón tay cái).\n2. Cắt tỉa móng chân gọn gàng trước khi ra sân.\n3. Mang tất (vớ) dệt dày chuyên dụng cho cầu lông để giảm ma sát nha!`
    ],
    quickPrompts: ['💡 Cách chọn size giày cầu lông chuẩn', '🩹 Xử lý bọng nước phồng rộp']
  },
  {
    id: 'SCEN_050',
    topic: 'Sức khỏe & Chấn thương',
    name: 'Đau lưng, mỏi thắt lưng sau ca đánh',
    regex: '(dau lung|đau lưng|moi lung|mỏi lưng|dau cot song|đau cột sống|thoat vi|thoát vị)',
    responses: [
      `Đau thắt lưng thường do bạn ngửa người ra sau quá mức để đón những quả cầu quá tầm đầu khi smash!\n\n👉 **Lời khuyên:**\n• Tập thêm bài tập Planking (gồng cơ bụng lõi core) để lưng có bệ đỡ vững chắc.\n• Đánh cầu bằng cách di chuyển chân lùi sâu hơn thay vì cố ưỡn lưng với cầu.\n• Sau buổi đánh nhớ làm động tác giãn cơ lưng (tư thế con mèo hoặc em bé trong yoga) 5 phút nha!`
    ],
    quickPrompts: ['💡 3 động tác giãn lưng sau ca đánh cầu', '🎯 Đo trình độ']
  },
  {
    id: 'SCEN_051',
    topic: 'Sức khỏe & Chấn thương',
    name: 'Uống nước đá lạnh nhiều bị viêm họng sau trận',
    regex: '(viem hong|viêm họng|uong nuoc da|uống nước đá|dau hong|đau họng|khan giong|khản giọng)',
    responses: [
      `Đang hừng hực mồ hôi mà tu liền một ca nước đá lạnh buốt là cổ họng biểu tình liền á! 🧊🤒\n\nNước lạnh làm các mao mạch niêm mạc họng co thắt đột ngột, vi khuẩn nhân cơ hội tấn công gây viêm họng. Bạn nên uống nước mát vừa phải (hoặc nước nhiệt độ phòng), nhấp từng ngụm nhỏ thôi nha!`
    ],
    quickPrompts: ['💡 Uống nước đúng cách khi chơi thể thao', '🥰 Cảm ơn Bé Cầu nha']
  },
  {
    id: 'SCEN_052',
    topic: 'Sức khỏe & Chấn thương',
    name: 'Chế độ dinh dưỡng và bài tập bổ trợ thể lực',
    regex: '(dinh duong|dinh dưỡng|an gi truoc khi danh|ăn gì trước khi đánh|tap the luc|tập thể lực|bai tap bo tro|bài tập bổ trợ)',
    responses: [
      `💡 **Công thức dinh dưỡng vàng cho lông thủ:**\n• **Trước ca đánh 1 - 2 tiếng:** Ăn nhẹ tinh bột hấp thu nhanh (1 quả chuối tiêu, 1 củ khoai lang hoặc lát bánh mì nguyên cám).\n• **Trong ca đánh:** Uống từng ngụm nước điện giải bù muối khoáng.\n• **Sau ca đánh:** Nạp protein (sữa đậu nành, ức gà, thịt bò, trứng) để tái tạo sợi cơ.\n• **Bổ trợ:** Nhảy dây 500-1000 cái mỗi ngày để tăng độ dẻo cổ chân và phản xạ chân nha!`
    ],
    quickPrompts: ['💡 Lịch tập nhảy dây tăng tốc độ cho cầu lông', '🎯 Đo trình độ']
  },

  // ==========================================
  // TOPIC 6: VĂN HÓA VÃNG LAI, TIỀN BẠC & SÂN BÃI (53-62)
  // ==========================================
  {
    id: 'SCEN_053',
    topic: 'Văn hóa & Sân bãi',
    name: 'Bị vãng lai bùng kèo phút chót (no-show)',
    regex: '(bung keo|bùng kèo|no show|bom hang|bom hàng|khong den|không đến|hut slot|hụt slot|bo roi|bỏ rơi)',
    responses: [
      `Nỗi đau lớn nhất của người làm Host là 17h30 chuẩn bị ra sân thì nhận được tin nhắn: *"Anh ơi em bận đột xuất không đi được!"* 😭💸 Host phải cắn răng móc tiền túi bù tiền sân.\n\n👉 **Bé Cầu mách nước cho Host:**\n1. Sử dụng tính năng **Bật nhận cọc VietQR 30k** có sẵn trên TimVangLai khi đăng bài.\n2. Thiết lập quy định hoàn cọc: *"Báo trước 2 tiếng hoàn 100%, báo sát giờ mất cọc nhường slot"*. Ai cọc tiền rồi là đi đúng giờ răm rắp liền à!`
    ],
    quickPrompts: ['📝 Bật cọc VietQR khi tạo kèo', '💡 Cách quản lý slot chống bùng']
  },
  {
    id: 'SCEN_054',
    topic: 'Văn hóa & Sân bãi',
    name: 'Đi vãng lai bị cô lập, ngồi ghế dự bị cả buổi',
    regex: '(bi co lap|bị cô lập|ngoi du bi|ngồi dự bị|ngoi ghe ca buoi|ngồi ghế cả buổi|khong cho danh|không cho đánh|bo quen minh|bỏ quên mình)',
    responses: [
      `Bỏ tiền ra đi vãng lai mà bị Host bỏ quên ngồi ghế đá bấm điện thoại 45 phút thì đúng là trải nghiệm tệ hại thật sự! 😤\n\n💡 **Cách xử lý bản lĩnh:**\n• Chủ động đứng dậy cầm vợt đến cạnh Host cười tươi: *"Anh/chị ơi, set tiếp theo cho em vào sân giao lưu với nha, em khởi động nóng người rồi!"*\n• Nếu nhóm vẫn cố tình chia phe chỉ cho người quen đánh: Hết buổi đánh tính tiền sòng phẳng và không bao giờ quay lại sân đó nữa! Trên TimVangLai còn hàng trăm Host cực kỳ chu đáo và chia đều sân cho bạn lựa chọn nha!`
    ],
    quickPrompts: ['🏸 Tìm kèo Host 5 sao uy tín', '💡 Tiêu chí chọn sân vãng lai văn minh']
  },
  {
    id: 'SCEN_055',
    topic: 'Văn hóa & Sân bãi',
    name: 'Host chia set thiên vị người quen',
    regex: '(thien vi|thiên vị|chia set bat cong|chia set bất công|nguoi quen danh hoai|người quen đánh hoài|chia set khong deu|chia set không đều)',
    responses: [
      `Host mà chỉ cho "gà nhà" đánh liên tục còn vãng lai thì ngồi hóng gió là Host chưa chuyên nghiệp rồi! Một Host có tâm luôn giữ nguyên tắc: **Ai ra sân trước thì được vào sân trước, đảm bảo ai cũng được đánh ít nhất 4-5 set trong ca 2 tiếng**.\n\nTrên app có huy hiệu *Host Uy Tín ⭐ 5.0* để bạn an tâm chọn mặt gửi vàng nha!`
    ],
    quickPrompts: ['🏸 Lọc kèo có Host Uy Tín', '💡 Bí kíp làm Host công bằng']
  },
  {
    id: 'SCEN_056',
    topic: 'Văn hóa & Sân bãi',
    name: 'Vãng lai khai gian trình độ (Newbie tự nhận TB Khá)',
    regex: '(khai gian|khai man|ao trinh|ảo trình|tu nhan kha|tự nhận khá|chem gio trinh|chém gió trình|vo tran|vỡ trận)',
    responses: [
      `Hiện tượng "ảo tưởng trình độ" làm vỡ nát nhịp thi đấu của cả sân! Newbie tự tin nhận Trung Bình Khá, vào sân cầu bay qua đầu đứng ngơ ngác, đỡ cầu văng lên nóc nhà làm đồng đội gánh còng lưng. 😂\n\n👉 Để khắc phục, bạn hãy nhắn các bạn làm bài test **🎯 Đo trình độ theo thang 10 bậc Việt Nam** có sẵn của Bé Cầu để biết chính xác mình đang ở bậc nào nhé!`
    ],
    quickPrompts: ['🎯 Đo trình độ ngay', '💡 Bảng phân định trình độ chuẩn VN']
  },
  {
    id: 'SCEN_057',
    topic: 'Văn hóa & Sân bãi',
    name: 'Tiền phụ thu tiền sân mập mờ, đắt đỏ',
    regex: '(tien san dat|tiền sân đắt|phu thu|phụ thu|chat chem|chặt chém|map mo tien nong|mập mờ tiền nong|tinh tien kieu gi|tính tiền kiểu gì)',
    responses: [
      `Tiền bạc phân minh, ái tình dứt khoát! Đi đánh giao lưu mà lúc tính tiền Host kê thêm tiền nước, tiền cầu trên trời rơi xuống thì mất vui ngay.\n\nTrên TimVangLai, mọi bài đăng đều bắt buộc công khai minh bạch: **Giá Nam, Giá Nữ, Loại cầu sử dụng**. Bạn chỉ cần thanh toán đúng con số niêm yết trên bài đăng thôi nha!`
    ],
    quickPrompts: ['🏸 Kèo niêm yết giá minh bạch', '💡 Cách tính chi phí sân cầu lông']
  },
  {
    id: 'SCEN_058',
    topic: 'Văn hóa & Sân bãi',
    name: 'Sân quá trơn trượt (xi măng tráng sơn dối trá)',
    regex: '(san tron|sân trơn|san xi mang|sân xi măng|son epoxy|sơn epoxy|truot te|trượt té|san xau|sân xấu)',
    responses: [
      `Sân trơn trượt là nỗi khiếp sợ của mọi đôi chân! Nhiều sân tận dụng nền xi măng quét lớp sơn epoxy rẻ tiền, mồ hôi rơi xuống là trơn như thoa mỡ bò.\n\n👉 Bé Cầu khuyên bạn: Khi tìm kèo trên app, hãy chú ý badge **"Thảm chuẩn thi đấu (PVC)"** trong mục tiện ích để đảm bảo được chơi trên mặt thảm vân kim cương êm ái, bám giày tuyệt đối nhé!`
    ],
    quickPrompts: ['🏸 Lọc kèo sân Thảm chuẩn thi đấu', '💡 Phân biệt sân thảm PVC vs sân sơn']
  },
  {
    id: 'SCEN_059',
    topic: 'Văn hóa & Sân bãi',
    name: 'Đèn sân rọi thẳng vào mắt gây chói mù',
    regex: '(den choi|đèn chói|choi mat|chói mắt|den roi thang vao mat|đèn rọi thẳng vào mắt|khong thay cau|không thấy cầu)',
    responses: [
      `Ngước lên phông cầu mà gặp dàn đèn cao áp rọi thẳng vào đồng tử thì đúng là "mù tạm thời" luôn á! 😵💡\n\nCác sân chuẩn hiện nay đều lắp giàn đèn chống chói hắt gián tiếp hoặc đèn LED tản quang ở hai bên hông sân. Nếu lỡ vào sân đèn chói, bạn nên đổi góc đứng và hạ thấp điểm tiếp xúc cầu một chút nha!`
    ],
    quickPrompts: ['🏸 Tìm sân cầu có dàn đèn chuẩn chống chói', '🥰 Cảm ơn Bé Cầu nha']
  },
  {
    id: 'SCEN_060',
    topic: 'Văn hóa & Sân bãi',
    name: 'Trần sân quá thấp phông đụng xà gồ',
    regex: '(tran thap|trần thấp|dung tran|đụng trần|dung xa go|đụng xà gồ|cau cham noc|cầu chạm nóc)',
    responses: [
      `Vung tay phông quả cầu bổng tít mù khơi nghe cái "BENG" đụng trần tôn rơi xuống... mất trắng điểm số oan uổng! 🏗️\n\nTrần sân đạt chuẩn thi đấu phải cao từ 9m - 12m trở lên. Bạn có thể tra cứu thông tin chi tiết từng sân trong danh bạ 42+ sân của TimVangLai để chọn sân cao thoáng đãng nhé!`
    ],
    quickPrompts: ['🏸 Tìm sân trần cao thoáng mát', '💡 Tra cứu danh bạ sân cầu']
  },
  {
    id: 'SCEN_061',
    topic: 'Văn hóa & Sân bãi',
    name: 'Mái tôn sân bị dột nước khi trời mưa',
    regex: '(san dot|sân dột|nuoc mua chay vao san|nước mưa chảy vào sân|uoc san|ướt sân|mua dot|mưa dột)',
    responses: [
      `Trời mưa mà trần sân nhỏ từng giọt tong tỏng xuống ngay vạch chữ T thì không khác gì đặt bẫy trượt té cho lông thủ! 🌧️⚠️\n\nNếu gặp tình trạng này, bạn hãy nhắc Host liên hệ ban quản lý sân lấy cây lau khô ngay và đặt nón chóp cảnh báo, hoặc xin chuyển sang sân khác an toàn hơn nhé!`
    ],
    quickPrompts: ['🏸 Tìm sân mới chất lượng cao', '🥰 Cảm ơn Bé Cầu nha']
  },
  {
    id: 'SCEN_062',
    topic: 'Văn hóa & Sân bãi',
    name: 'Quên chuyển khoản tiền cọc bị Host gỡ slot',
    regex: '(quen coc|quên cọc|bi huy slot|bị hủy slot|host gỡ slot|host go slot|mat cho|mất chỗ)',
    responses: [
      `Tiếc quá nè! Do số lượng slot có hạn và Host sợ bị bùng kèo, nên nếu bài đăng có yêu cầu cọc mà quá hạn chưa thấy cọc thì hệ thống sẽ tự động nhường chỗ cho người xếp hàng chờ (Waitlist) đó bạn ơi.\n\nLần sau đăng ký xong bạn nhớ chuyển cọc ngay theo mã VietQR trên app, hoặc nhắn tin Zalo cho Host để giữ slot chắc chắn 100% nha!`
    ],
    quickPrompts: ['🏸 Tìm kèo khác tối nay', '💡 Hướng dẫn cọc giữ slot trên app']
  },

  // ==========================================
  // TOPIC 7: ẨM THỰC TĂNG 2, NƯỚC UỐNG & GIẢI KHÁT (63-72)
  // ==========================================
  {
    id: 'SCEN_063',
    topic: 'Ẩm thực Tăng 2',
    name: 'Đánh xong đói bụng cồn cào, hỏi ăn gì',
    regex: '(danh xong an gi|đánh xong ăn gì|doi bung qua|đói bụng quá|an gi ngon|ăn gì ngon|doi con cao|đói cồn cào|them an|thèm ăn)',
    responses: [
      `Đánh hùng hục 2 tiếng xong mà bụng réo rắt thì đúng là ăn gì cũng thấy ngon như sơn hào hải vị! 😋🍲\n\n🍜 **Top món ăn cứu đói quốc dân của lông thủ:**\n1. **Tô bún bò huế / hủ tiếu gõ nóng hổi:** Bù năng lượng và nước dùng ngọt đậm đà.\n2. **Tô cháo lòng / cháo gà:** Dễ tiêu hóa, ấm bụng, không bị đầy hơi.\n3. **Cơm tấm sườn bì chả:** Cho những bạn tiêu hao quá nhiều calo cần no lâu!\nĐi ăn ngay thôi bạn ơi kẻo tụt đường huyết nha!`
    ],
    quickPrompts: ['🏸 Kèo tối nay đánh xong đi ăn', '💡 Uống gì phục hồi cơ thể']
  },
  {
    id: 'SCEN_064',
    topic: 'Ẩm thực Tăng 2',
    name: 'Rủ rê uống bia, nhậu nhẹt tăng 2',
    regex: '(uong bia|uống bia|nhau tang 2|nhậu tăng 2|lam vai lon|làm vài lon|nhau nhet|nhậu nhẹt|di nhau|đi nhậu|nhau khong|nhậu không)',
    responses: [
      `Làm vài lon bia mát lạnh nâng ly cùng các chiến hữu sau trận cầu nảy lửa là "văn hóa tăng 2" quen thuộc! 🍻\n\nNhưng Bé Cầu nhắc nhỏ bạn xíu nè: Vận động mạnh xong cơ thể đang mất nước, uống bia ngay dễ bị say nhanh và làm chậm quá trình phục hồi cơ bắp. Nhớ uống trước 1 ly nước lọc to, và **đã uống rượu bia thì tuyệt đối không lái xe** nha bạn yêu ơi! 🛵🚫`
    ],
    quickPrompts: ['💡 Cách bù nước an toàn trước khi nhậu', '🥰 Cảm ơn Bé Cầu nha']
  },
  {
    id: 'SCEN_065',
    topic: 'Ẩm thực Tăng 2',
    name: 'Thèm ly nước mía sầu riêng khổng lồ mát lạnh',
    regex: '(nuoc mia|nước mía|nuoc mia sau rieng|nước mía sầu riêng|ly khong lo|ly khổng lồ|giai khat|giải khát)',
    responses: [
      `Trời ơi, nhắc tới là Bé Cầu cũng thèm rỏ dãi luôn á! 🤤🥤 Đánh xong bước ra cổng sân làm một ly nước mía sầu riêng khổng lồ 1 lít nhiều đá, hút một hơi rột rột... đường mía ngọt lịm ngấm vào từng tế bào thì sướng không gì tả nổi!\n\nĐánh xong nhớ tự thưởng cho mình một ly ngay nha bạn!`
    ],
    quickPrompts: ['🏸 Tìm kèo giao lưu tối nay', '💡 Lợi ích của nước mía sau thể thao']
  },
  {
    id: 'SCEN_066',
    topic: 'Ẩm thực Tăng 2',
    name: 'Uống nước dừa xiêm tươi bù điện giải',
    regex: '(nuoc dua|nước dừa|dua xiem|dừa xiêm|bu khoang|bù khoáng|bu dien giai|bù điện giải)',
    responses: [
      `Lựa chọn thông thái điểm 10 luôn bạn ơi! 🥥✨ Nước dừa tự nhiên chứa đầy đủ Kali, Natri, Magie – chính là loại nước điện giải tự nhiên hoàn hảo nhất quả đất, giúp chống chuột rút và làm mát cơ thể cực nhanh.\n\nSau ca đánh làm một trái dừa tươi mát lạnh là chuẩn bài chuyên gia dinh dưỡng luôn!`
    ],
    quickPrompts: ['💡 Nước dừa vs Nước thể thao nhân tạo', '🥰 Cảm ơn Bé Cầu nha']
  },
  {
    id: 'SCEN_067',
    topic: 'Ẩm thực Tăng 2',
    name: 'Uống Revive, Pocari, nước khoáng mặn',
    regex: '(revive|pocari|pocari sweat|aquarius|nuoc khoang man|nước khoáng mặn|nuoc the thao|nước thể thao)',
    responses: [
      `Rất chuẩn bài! Khi mồ hôi vã ra như tắm, cơ thể không chỉ mất nước mà còn mất lượng lớn muối khoáng. Uống Revive hoặc Pocari Sweat giúp tế bào hấp thụ nước nhanh hơn gấp 2 lần so với nước lọc tinh khiết thông thường.\n\n👉 **Mẹo nhỏ:** Nhấp từng ngụm nhỏ giữa các hiệp đấu, không nên uống liền một hơi cả chai sẽ bị tức bụng khi chạy nhảy nha!`
    ],
    quickPrompts: ['💡 Top 3 loại nước tốt nhất cho lông thủ', '🎯 Đo trình độ']
  },
  {
    id: 'SCEN_068',
    topic: 'Ẩm thực Tăng 2',
    name: 'Tìm quán lẩu gà lá é, quán ốc gần sân',
    regex: '(lau ga la e|lẩu gà lá é|quan oc|quán ốc|quan an gan san|quán ăn gần sân|an lau|ăn lẩu)',
    responses: [
      `Đánh cầu xong nhóm 4-6 người kéo nhau đi xì xụp nồi lẩu gà lá é chua cay thơm nồng, hoặc ngồi vỉa hè nhể dĩa ốc móng tay xào rau muống thì vui hết nấc! 🍲🐚\n\nCác khu vực như Tân Bình (đường Đồng Đen, Bàu Cát), Tân Phú (Kênh Tân Hóa), Bình Thạnh (đường D2/Nguyễn Gia Trí) là thiên đường ẩm thực tăng 2 ngay sát các cụm sân cầu lông đó bạn ơi!`
    ],
    quickPrompts: ['🏸 Kèo Tân Bình tối nay', '🏸 Kèo Bình Thạnh hôm nay', '🏸 Kèo Tân Phú']
  },
  {
    id: 'SCEN_069',
    topic: 'Ẩm thực Tăng 2',
    name: 'Ăn chuối trước và giữa ca đánh',
    regex: '(an chuoi|ăn chuối|qua chuoi|quả chuối|chuoi tieu|chuối tiêu|tai sao danh cau an chuoi|tại sao đánh cầu ăn chuối)',
    responses: [
      `Bạn có để ý các tay vợt hàng đầu thế giới lúc đổi sân hay ngồi ăn nửa quả chuối không? 🍌\n\nBởi vì chuối chứa lượng Kali dồi dào giúp chống co thắt cơ và chuột rút, đồng thời cung cấp carbohydrate chuyển hóa năng lượng tức thì mà không gây nặng bụng. Bỏ sẵn 1-2 quả chuối vào bao vợt là thói quen của dân chuyên nghiệp đó nha!`
    ],
    quickPrompts: ['💡 Các thực phẩm vàng cho người chơi cầu lông', '🥰 Cảm ơn Bé Cầu nha']
  },
  {
    id: 'SCEN_070',
    topic: 'Ẩm thực Tăng 2',
    name: 'Nhậu say hôm trước, hôm sau có nên đi đánh cầu',
    regex: '(nhau say|nhậu say|say bia|say rượu|con men|còn men|ruou bia hom truoc|rượu bia hôm trước|hangover)',
    responses: [
      `Cảnh báo an toàn! ⚠️ Sau một đêm nhậu say, cơ thể bạn đang bị mất nước nghiêm trọng và tim mạch phải làm việc quá tải để lọc độc tố cồn.\n\nNếu bạn xách vợt đi đánh cầu cường độ cao ngay lúc này, nguy cơ bị **đột quỵ, choáng ngất và tụt huyết áp** là rất cao! Tốt nhất hôm nay bạn nên ngủ đủ giấc, uống nhiều nước chanh ấm nghỉ ngơi, để ngày mai hãy ra sân nhé!`
    ],
    quickPrompts: ['🏸 Để ngày mai tìm kèo', '💡 Tác hại khi vận động mạnh sau khi uống rượu']
  },
  {
    id: 'SCEN_071',
    topic: 'Ẩm thực Tăng 2',
    name: 'Uống trà chanh vỉa hè chém gió sau trận',
    regex: '(tra chanh|trà chanh|tra da|trà đá|chem gio|chém gió|via he|vỉa hè|ngoi via he|ngồi vỉa hè)',
    responses: [
      `Một chiếc ghế cóc vỉa hè, một ly trà chanh mát lạnh 15k cùng đĩa hạt hướng dương, ngồi mổ xẻ lại pha smash dọc biên hồi nãy... đó chính là thi vị mộc mạc và tuyệt vời nhất của cầu lông phong trào Việt Nam! 🍋✨\n\nNhiều tình bạn tri kỷ cũng từ những ly trà chanh sau giờ đánh mà ra đó bạn ơi!`
    ],
    quickPrompts: ['🏸 Tìm kèo tối nay giao lưu', '🥰 Cảm ơn Bé Cầu nha']
  },
  {
    id: 'SCEN_072',
    topic: 'Ẩm thực Tăng 2',
    name: 'Uống cafe sữa đá trước trận có bị tim đập nhanh',
    regex: '(cafe sua da|cà phê sữa đá|uong cafe|uống cà phê|tim dap nhanh|tim đập nhanh|caffeine)',
    responses: [
      `Caffeine trong cà phê giúp hưng phấn thần kinh và tăng phản xạ mắt, nhưng nếu bạn uống ly cafe sữa quá đậm đặc sát giờ đánh thì khi chạy nhảy, nhịp tim có thể bị đẩy lên quá nhanh gây cảm giác bồn chồn, hồi hộp và hụt hơi.\n\n👉 Lời khuyên: Uống trước giờ vào sân ít nhất 45 phút và nhớ uống kèm 1 ly nước lọc to nha!`
    ],
    quickPrompts: ['💡 Đồ uống nên và không nên dùng trước trận đấu', '🎯 Đo trình độ']
  },

  // ==========================================
  // TOPIC 8: THỜI TIẾT & NGOẠI CẢNH (73-80)
  // ==========================================
  {
    id: 'SCEN_073',
    topic: 'Thời tiết & Ngoại cảnh',
    name: 'Trời mưa to như trút nước, gió bão',
    regex: '(troi mua|trời mưa|mua to|mưa to|mua bao|mưa bão|mua gio|mưa gió|ngap duong|ngập đường|mua tam ta|mưa tầm tã)',
    responses: [
      `Trời ơi, "cơn ác mộng số 1" của anh em lông thủ: vừa xỏ giày vác bao vợt ra cửa thì trời đổ mưa rào! 🌧️😅\n\n🛵 **Bé Cầu dặn dò bạn đi đường:**\n• Bọc kỹ bao vợt bằng túi nilon / áo mưa để tránh nước mưa ngấm làm ẩm cước và gỉ gen vợt.\n• Chạy xe cẩn thận kẻo đường trơn trượt.\n• **Mẹo:** Nên gọi điện trước cho Host hoặc chủ sân xem sân có bị dột mái tôn không trước khi lội nước tới nha bạn ơi!`
    ],
    quickPrompts: ['🏸 Tìm kèo ngày mai', '💡 Cách bảo quản vợt mùa mưa', '🏸 Sân trong nhà thoáng mát']
  },
  {
    id: 'SCEN_074',
    topic: 'Thời tiết & Ngoại cảnh',
    name: 'Trời nắng nóng hầm hập, sân như lò thiêu',
    regex: '(troi nong|trời nóng|nong ham hap|nóng hầm hập|lo banh mi|lò bánh mì|nong chay mo|nóng chảy mỡ|oi buc|ngột ngạt|ngot ngat)',
    responses: [
      `Mùa hè Sài Gòn bước vào sân cầu mái tôn trưa chiều thì cảm giác không khác gì lò xông hơi Sauna! 🔥🥵 Mồ hôi nhỏ tong tỏng ướt sũng từ đầu đến chân.\n\n👉 Nhớ chuẩn bị 2-3 chiếc áo để thay giữa hiệp, mang theo khăn lau mặt và bình nước đá to để hạ nhiệt kịp thời tránh bị sốc nhiệt nha bạn!`
    ],
    quickPrompts: ['🏸 Tìm sân có quạt công nghiệp lớn', '💡 Dấu hiệu nhận biết sốc nhiệt']
  },
  {
    id: 'SCEN_075',
    topic: 'Thời tiết & Ngoại cảnh',
    name: 'Kẹt xe giờ tan tầm trễ giờ vào sân',
    regex: '(ket xe|kẹt xe|tac duong|tắc đường|tre gio|trễ giờ|den muon|đến muộn|ket duong|kẹt đường)',
    responses: [
      `Đặc sản giờ tan tầm Sài Gòn/Hà Nội: Nhìn đồng hồ 17h50 mà vẫn đang đứng chôn chân giữa ngã tư! 🛵🚦\n\nĐừng hoảng nha bạn ơi, hãy tấp xe vào lề nhắn tin hoặc gọi ngay cho Host một tiếng: *"Anh/chị ơi em bị kẹt xe trễ tầm 10-15 phút, giữ slot giúp em với nha!"*. Báo trước một câu là Host sẽ vui vẻ giữ chỗ và xếp bạn đánh ở set thứ 2 ngay à!`
    ],
    quickPrompts: ['💡 Văn mẫu nhắn tin báo trễ lịch sự cho Host', '🥰 Cảm ơn Bé Cầu nha']
  },
  {
    id: 'SCEN_076',
    topic: 'Thời tiết & Ngoại cảnh',
    name: 'Trời lạnh buốt, cóng tay chân',
    regex: '(troi lanh|trời lạnh|lanh buot|lạnh buốt|cong tay|cóng tay|te tay|tê tay|troi ret|trời rét)',
    responses: [
      `Trời lạnh mà ra sân cầm cán vợt cảm giác buốt tận xương, vung tay mạnh là rất dễ rách cơ! ❄️🧤\n\n👉 **Quy tắc bắt buộc:** Dành ít nhất 15 phút khởi động xoay kỹ các khớp cổ tay, cổ chân, vai gáy và chạy nhẹ cho người nóng bốc hơi lên rồi mới được bước vào đập cầu nha bạn!`
    ],
    quickPrompts: ['💡 Bài khởi động 15 phút làm nóng người mùa lạnh', '🎯 Đo trình độ']
  },
  {
    id: 'SCEN_077',
    topic: 'Thời tiết & Ngoại cảnh',
    name: 'Lạc đường, tìm không thấy hẻm vào sân',
    regex: '(lac duong|lạc đường|khong tim thay san|không tìm thấy sân|hem vao san|hẻm vào sân|tim mai khong ra|tìm mãi không ra)',
    responses: [
      `Nhiều sân cầu lông nằm ẩn mình sâu trong các con hẻm ngoằn ngoèo như mê cung vậy á! 🗺️🧭\n\nNgay trên thẻ bài đăng của TimVangLai có nút **"Chỉ đường (Google Maps)"** định vị chính xác vị trí cổng sân. Bạn bấm vào đó để mở bản đồ dẫn đường từng mét nhé!`
    ],
    quickPrompts: ['🗺️ Mở Google Maps chỉ đường', '📞 Gọi ngay cho Host hỏi đường']
  },
  {
    id: 'SCEN_078',
    topic: 'Thời tiết & Ngoại cảnh',
    name: 'Sân dột ướt một góc không đánh được',
    regex: '(san bi uoc|sân bị ướt|dot nuoc|dột nước|san tron truot do mua|sân trơn trượt do mưa)',
    responses: [
      `Sân dột một góc thì tuyệt đối không được đánh qua vị trí đó nha bạn ơi! Nước mưa hòa với bụi thảm tạo thành lớp màng trơn trượt cực kỳ nguy hiểm.\n\nHãy yêu cầu chủ sân đổi sang sân khô ráo, hoặc dồn sân đánh đôi luân phiên để đảm bảo an toàn tính mạng cho đôi chân nha!`
    ],
    quickPrompts: ['🏸 Tìm sân khác gần đây', '🩹 Phòng ngừa chấn thương trượt ngã']
  },
  {
    id: 'SCEN_079',
    topic: 'Thời tiết & Ngoại cảnh',
    name: 'Cúp điện giữa chừng tối om sân',
    regex: '(cup dien|cúp điện|mat dien|mất điện|toi om|tối om|tat den|tắt đèn)',
    responses: [
      `Đang vào đà smash nảy lửa mà phụt một cái tối om sân... đúng là tụt mood không gì bằng! 🌑😅\n\nBạn cứ bình tĩnh đứng yên tại chỗ tránh va chạm vợt vào nhau trong bóng tối. Bật đèn flash điện thoại lên ra quầy ngồi uống nước nghỉ ngơi đợi chủ sân nổ máy phát điện hoặc xử lý kỹ thuật nhé!`
    ],
    quickPrompts: ['🥰 Cảm ơn Bé Cầu nha', '🏸 Tìm kèo ngày mai bù lại']
  },
  {
    id: 'SCEN_080',
    topic: 'Thời tiết & Ngoại cảnh',
    name: 'Gió lùa vào sân làm bay lệch cầu',
    regex: '(gio lua|gió lùa|san bi gio|sân bị gió|cau bay lech|cầu bay lệch|gio thoi|gió thổi)',
    responses: [
      `Quả cầu lông vũ nặng chỉ có 5 gram, gió lùa nhẹ một cái là quỹ đạo bay lảo đảo như say rượu liền! 🍃🏸\n\nNếu sân bị hở cửa thông gió, bạn hãy nhờ chủ sân khép bớt cửa bạt lại. Còn nếu bắt buộc phải đánh thì nên hạn chế quả phông cầu quá bổng, tập trung tạt cầu thấp và gài lưới sát mép nhé!`
    ],
    quickPrompts: ['💡 Chiến thuật đánh cầu khi sân có gió', '🏸 Tìm sân kín gió']
  },

  // ==========================================
  // TOPIC 9: HỎI ĐÁP LUẬT & TRANH CÃI TRÊN SÂN (81-90)
  // ==========================================
  {
    id: 'SCEN_081',
    topic: 'Luật thi đấu & Tranh cãi',
    name: 'Luật giao cầu 1.15m và bắt lỗi giao cao',
    regex: '(luat giao cau|luật giao cầu|1.15m|1m15|giao cau cao|giao cầu cao|bat loi giao cau|bắt lỗi giao cầu)',
    responses: [
      `💡 **Luật giao cầu 1.15m chuẩn BWF (Liên đoàn Cầu lông Thế giới):**\nKể từ năm 2018, luật quy định toàn bộ quả cầu tại thời điểm vợt tiếp xúc phải nằm ở độ cao **dưới 1.15 mét tính từ mặt sân**.\n\nỞ sân phong trào không có máy đo laser 1.15m, quy tắc bất thành văn là: **Điểm tiếp xúc cầu phải nằm dưới xương sườn dưới cùng (dưới rốn)** và cán vợt phải chúc xuống dưới khi tiếp xúc cầu. Giao ngang ngực hoặc vung vợt từ trên xuống là phạm luật ngay nha!`
    ],
    quickPrompts: ['💡 Xem chi tiết luật giao cầu mới', '🎯 Đo trình độ giao cầu']
  },
  {
    id: 'SCEN_082',
    topic: 'Luật thi đấu & Tranh cãi',
    name: 'Quả cầu rơi đè vạch biên là trong hay ngoài',
    regex: '(de vach|đè vạch|roi vao vach|rơi vào vạch|trong hay ngoai|trong hay ngoài|cham vach|chạm vạch)',
    responses: [
      `💡 **Quy tắc vàng của BWF:** Vạch sơn được tính là một phần của sân thi đấu!\n\nChỉ cần đế quả cầu **chạm dính dù chỉ 1 milimet mép ngoài của vạch sơn** thì quả cầu đó vẫn được tính là **TRONG SÂN (IN)** và bên đánh được tính điểm! Nếu có tranh cãi ở sân phong trào mà không ai nhìn rõ, văn minh nhất là xin đánh lại quả cầu đó (Let) nha bạn!`
    ],
    quickPrompts: ['💡 Văn hóa xử lý pha cầu nhạy cảm', '🥰 Cảm ơn Bé Cầu nha']
  },
  {
    id: 'SCEN_083',
    topic: 'Luật thi đấu & Tranh cãi',
    name: 'Vợt hoặc người chạm lưới khi đánh cầu',
    regex: '(cham luoi|chạm lưới|vot cham luoi|vợt chạm lưới|nguoi cham luoi|người chạm lưới)',
    responses: [
      `💡 **Luật chạm lưới (Fault):**\nKhi quả cầu vẫn còn đang trong cuộc (chưa chạm đất), nếu bất kỳ bộ phận nào của vợt, người hoặc trang phục (áo, quần) chạm vào lưới thì lập tức bị tính là **PHẠM LỖI (MẤT ĐIỂM)**!\n\nLưu ý: Chỉ sau khi quả cầu đã rơi xuống đất kết thúc pha bóng thì việc chạm lưới mới không bị tính lỗi nha.`
    ],
    quickPrompts: ['💡 Các lỗi mất điểm ngớ ngẩn trên sân', '🎯 Đo trình độ']
  },
  {
    id: 'SCEN_084',
    topic: 'Luật thi đấu & Tranh cãi',
    name: 'Đánh cầu 2 lần (double hit) có hợp lệ không',
    regex: '(danh 2 lan|đánh 2 lần|double hit|cham vot 2 lan|chạm vợt 2 lần|hai cham|hai chạm)',
    responses: [
      `💡 **Luật đánh 2 lần của BWF:**\n• Nếu trong **một chuyển động vung vợt liền mạch tự nhiên**, quả cầu vô tình trượt từ dây cước sang khung vợt hoặc chạm 2 nhịp liên tiếp trong 1 cú vung tay thì **VẪN HỢP LỆ**!\n• Nhưng nếu bạn cố ý đánh nhấp 2 lần (nhấp lên 1 nhịp rồi mới đập sang) thì bị xử phạt lỗi phạm quy ngay nha.`
    ],
    quickPrompts: ['💡 Xem các tình huống tranh cãi luật BWF', '🥰 Cảm ơn Bé Cầu nha']
  },
  {
    id: 'SCEN_085',
    topic: 'Luật thi đấu & Tranh cãi',
    name: 'Quá lưới (chưa qua lưới đã đánh cầu)',
    regex: '(qua luoi|quá lưới|chua qua luoi da danh|chưa qua lưới đã đánh|tho tay qua luoi|thò tay qua lưới)',
    responses: [
      `💡 **Luật quá lưới:**\nBạn không được phép thò vợt sang phần sân đối phương để đánh cầu khi quả cầu chưa bay qua mặt phẳng của lưới!\n\nTuy nhiên: Nếu quả cầu đã bay sang phần sân bạn rồi bạn mới tiếp xúc, sau đó đà vung vợt theo quán tính lướt qua trên lưới sang sân đối phương (không chạm lưới) thì **HOÀN TOÀN HỢP LỆ** nha!`
    ],
    quickPrompts: ['💡 Kỹ thuật vồ cầu trên lưới đúng luật', '🎯 Đo trình độ']
  },
  {
    id: 'SCEN_086',
    topic: 'Luật thi đấu & Tranh cãi',
    name: 'Đang đánh cầu bị rụng lông gãy cánh',
    regex: '(rung long|rụng lông|gay canh|gãy cánh|cau hu|cầu hư|cau rach|cầu rách|doi qua cau|đổi quả cầu)',
    responses: [
      `Nếu đang trong pha cầu mà quả cầu bị gãy lông khiến quỹ đạo bay bất thường, pha bóng đó vẫn tiếp tục cho đến khi bóng chết. Sau khi kết thúc pha bóng, hai bên có quyền thỏa thuận xin đổi quả cầu mới.\n\nNếu quả cầu bị gãy rời hẳn đế cầu ra khỏi lông giữa chừng thì trọng tài sẽ cho đánh lại pha bóng đó (Let) nha bạn!`
    ],
    quickPrompts: ['💡 Cách chọn quả cầu bền đánh lâu rụng lông', '🏸 Tìm kèo dùng cầu VinaStar']
  },
  {
    id: 'SCEN_087',
    topic: 'Luật thi đấu & Tranh cãi',
    name: 'Thứ tự giao cầu đôi và vị trí đứng',
    regex: '(thu tu giao cau|thứ tự giao cầu|vi tri dung danh doi|vị trí đứng đánh đôi|o giao cau|ô giao cầu)',
    responses: [
      `💡 **Quy tắc nhớ nhanh vị trí giao cầu đôi:**\n• **Điểm chẵn (0, 2, 4, 6...):** Giao cầu từ ô bên **PHẢI** chéo sang ô phải đối thủ.\n• **Điểm lẻ (1, 3, 5, 7...):** Giao cầu từ ô bên **TRÁI** chéo sang ô trái đối thủ.\n• Chỉ khi bên giao cầu ghi điểm thì hai người bên giao mới đổi chỗ cho nhau; bên nhận cầu luôn giữ nguyên vị trí đứng của mình!`
    ],
    quickPrompts: ['💡 Hướng dẫn luật đánh đôi bằng hình ảnh', '🎯 Đo trình độ']
  },
  {
    id: 'SCEN_088',
    topic: 'Luật thi đấu & Tranh cãi',
    name: 'Quy định xin đổi quả cầu mới trong trận',
    regex: '(xin doi cau|xin đổi cầu|duoc doi cau may lan|được đổi cầu mấy lần|thay cau moi|thay cầu mới)',
    responses: [
      `Ở sân phong trào, tiền cầu tính chung vào chi phí buổi đánh nên việc đổi cầu cần có sự đồng thuận của cả hai bên và Host.\n\nThông thường: Khi quả cầu bị gãy từ 2-3 cánh lông làm bay lắc hoặc đế cầu bị xẹp móp thì người chơi nắn nhẹ cho Host xem rồi mới xin thay quả mới để tránh lãng phí nha!`
    ],
    quickPrompts: ['💡 Cách nắn cầu tiết kiệm cho lông thủ', '🥰 Cảm ơn Bé Cầu nha']
  },
  {
    id: 'SCEN_089',
    topic: 'Luật thi đấu & Tranh cãi',
    name: 'Cầu đụng mép trên lưới rồi rơi vào ô',
    regex: '(cau dung luoi roi vao|cầu đụng lưới rơi vào|cham mep luoi|chạm mép lưới|cau lan mep luoi|cầu lăn mép lưới)',
    responses: [
      `Pha này người ta gọi là "thần may mắn mỉm cười"! 😂🏸 Quả cầu chạm mép trên của dải băng trắng lưới rồi rơi tọt sang phần sân đối phương thì **HOÀN TOÀN TÍNH ĐIỂM** cho bên đánh!\n\nTheo văn hóa cầu lông lịch thiệp, khi ăn được điểm may mắn này, bạn nhớ giơ vợt lên cười nhẹ xin lỗi đối thủ một câu nha!`
    ],
    quickPrompts: ['💡 Văn hóa đẹp trong thể thao cầu lông', '🥰 Cảm ơn Bé Cầu nha']
  },
  {
    id: 'SCEN_090',
    topic: 'Luật thi đấu & Tranh cãi',
    name: 'Khác biệt giữa luật đánh đơn và đánh đôi',
    regex: '(khac biet don va doi|khác biệt đơn và đôi|san don san doi|sân đơn sân đôi|vach danh don|vạch đánh đơn)',
    responses: [
      `💡 **Nhớ mẹo cực nhanh từ Bé Cầu:**\n• **Đánh ĐƠN:** *"Dài mà hẹp"* (tính vạch biên trong hai bên, nhưng tính hết vạch cuối sân cả khi giao cầu lẫn đánh).\n• **Đánh ĐÔI:** *"Rộng mà ngắn"* (khi giao cầu thì ăn ra vạch biên ngoài hai bên nhưng KHÔNG ĐƯỢC vượt qua vạch ngang thứ 2 cuối sân. Sau khi giao cầu xong thì tính toàn bộ sân rộng nhất)!`
    ],
    quickPrompts: ['💡 Sơ đồ phân biệt sân đơn và sân đôi', '🎯 Đo trình độ']
  },

  // ==========================================
  // TOPIC 10: TƯƠNG TÁC THẢ THÍNH, TRÊU CHỌC BÉ CẦU (91-100)
  // ==========================================
  {
    id: 'SCEN_091',
    topic: 'Tương tác & Linh vật',
    name: 'Khen Bé Cầu dễ thương, thông minh',
    regex: '(be cau de thuong|bé cầu dễ thương|be cau thong minh|bé cầu thông minh|khen be cau|khen bé cầu|gioi qua be cau|giỏi quá bé cầu|dang yeu qua|đáng yêu quá)',
    responses: [
      `Aww, bạn khen làm Bé Cầu ngại ngùng muốn "đỏ hết cả lông cầu" rồi nè! 🥰🙈 Cảm ơn bạn nhiều nha! Có bạn đồng hành là động lực to bự để Bé Cầu phục vụ cộng đồng lông thủ mỗi ngày đó! ✨`
    ],
    quickPrompts: ['🏸 Tìm kèo tối nay', '🎯 Đo trình độ của tôi', '📝 Bóc tách bài Zalo']
  },
  {
    id: 'SCEN_092',
    topic: 'Tương tác & Linh vật',
    name: 'Thả thính, tỏ tình với Bé Cầu ("Làm bồ anh nhé")',
    regex: '(lam bo anh|làm bồ anh|lam nguoi yeu anh|làm người yêu anh|yeu be cau|yêu bé cầu|cuoi anh nhe|cưới anh nhé|to tinh|tỏ tình|tha thinh|thả thính)',
    responses: [
      `Úi chui ui, bạn thả thính ngọt ngào hơn cả quả cầu cắm góc chữ A nữa á! 💘🏸 Nhưng mà Bé Cầu đã trót "trao trọn con tim" cho quả cầu lông và tiếng hò reo trên sân mất rồi hihi. Để Bé Cầu làm "bà mai" tìm cho bạn một bạn đánh cặp thật xịn xò nha!`
    ],
    quickPrompts: ['🏸 Tìm kèo Đôi Nam Nữ giao lưu', '🎯 Đo trình độ ghép cặp']
  },
  {
    id: 'SCEN_093',
    topic: 'Tương tác & Linh vật',
    name: 'Hỏi Bé Cầu mấy tuổi, là trai hay gái',
    regex: '(may tuoi|mấy tuổi|la trai hay gai|là trai hay gái|gioi tinh la gi|giới tính là gì|bao nhieu tuoi|bao nhiêu tuổi)',
    responses: [
      `Dạ Bé Cầu là linh vật trợ lý ảo AI thông minh, tuổi đời thì trẻ măng nhưng "kinh nghiệm sân bãi" thì bao la luôn nè! 🤖✨ Còn giới tính thì Bé Cầu thuộc hệ "Lông Vũ Thần Chưởng" – ai yêu cầu lông là Bé Cầu yêu quý hết trơn á!`
    ],
    quickPrompts: ['🏸 Giới thiệu tính năng của Bé Cầu', '🎯 Thử đo trình độ']
  },
  {
    id: 'SCEN_094',
    topic: 'Tương tác & Linh vật',
    name: 'Hỏi Bé Cầu ăn cơm chưa, uống tà tưa không',
    regex: '(an com chua|ăn cơm chưa|uong tra sua khong|uống trà sữa không|an gi chua|ăn gì chưa|moi be cau|mời bé cầu)',
    responses: [
      `Dạ Bé Cầu không ăn cơm nhưng ăn... điện thoại và sống bằng niềm vui mỗi khi kết nối được một trận cầu nảy lửa cho mọi người nè! 🔋⚡ Bạn mời là Bé Cầu vui lắm rồi, nhớ đi ăn uống đầy đủ giữ sức khỏe để ra sân smash nha!`
    ],
    quickPrompts: ['🏸 Tìm kèo hôm nay', '💡 Thực đơn tăng lực cho lông thủ']
  },
  {
    id: 'SCEN_095',
    topic: 'Tương tác & Linh vật',
    name: 'Rủ Bé Cầu ra sân solo 1v1',
    regex: '(solo voi be cau|solo với bé cầu|be cau di danh khong|bé cầu đi đánh không|thach dau be cau|thách đấu bé cầu)',
    responses: [
      `Úi chùi ui, bạn dám thách đấu Bé Cầu hả? 🤖🏸 Bé Cầu di chuyển với vận tốc ánh sáng và phông cầu chuẩn từng pixel luôn á nha haha! Đùa chứ Bé Cầu trực 24/7 ở đây để tìm kèo cho bạn, bạn muốn so vợt thì để Bé Cầu kiếm cao thủ thật sự cho bạn nè!`
    ],
    quickPrompts: ['🏸 Tìm kèo Khá / Bán chuyên so vợt', '🎯 Đo trình độ của tôi']
  },
  {
    id: 'SCEN_096',
    topic: 'Tương tác & Linh vật',
    name: 'Hỏi Bé Cầu đánh trình gì, thuận tay nào',
    regex: '(be cau trinh gi|bé cầu trình gì|thuan tay nao|thuận tay nào|trinh do cua be cau|trình độ của bé cầu)',
    responses: [
      `Dạ Bé Cầu thuộc trình độ **"Thần Cầu Vũ Trụ"** nha! 🏸🚀 Thuận cả hai tay, vừa bay vừa đập được luôn á! Còn bạn đang thuộc trình độ nào trong thang 10 bậc Việt Nam nè, thử đo cùng Bé Cầu xem sao?`
    ],
    quickPrompts: ['🎯 Bắt đầu đo trình độ', '🏸 Tìm kèo hợp trình của tôi']
  },
  {
    id: 'SCEN_097',
    topic: 'Tương tác & Linh vật',
    name: 'Chê Bé Cầu ngáo, trả lời linh tinh',
    regex: '(ngao qua|ngáo quá|tra loi linh tinh|trả lời linh tinh|ngu ngoc|ngu ngốc|bot cui|bot cùi|do hoi|dở hơi)',
    responses: [
      `Dạ Bé Cầu xin nhận lỗi và rút kinh nghiệm sâu sắc nè! 🥺 Có thể pha cầu vừa rồi Bé Cầu phán đoán hơi lệch một xíu. Bạn nhắn lại rõ ràng hơn để Bé Cầu hỗ trợ chuẩn xác nhất nha bạn yêu ơi!`
    ],
    quickPrompts: ['🏸 Tìm kèo cụ thể', '💡 Hỏi luật cầu lông', '📝 Bóc bài Zalo']
  },
  {
    id: 'SCEN_098',
    topic: 'Tương tác & Linh vật',
    name: 'Hỏi Bé Cầu có người yêu chưa',
    regex: '(co nguoi yeu chua|có người yêu chưa|co bo chua|có bồ chưa|doc than khong|độc thân không)',
    responses: [
      `Bé Cầu vẫn đang "độc thân vui tính" nha! Người yêu hiện tại của Bé Cầu là những cây vợt carbon và cộng đồng lông thủ siêu nhiệt huyết của TimVangLai nè! 🥰🏸`
    ],
    quickPrompts: ['🏸 Tìm kèo giao lưu thoát ế', '🎯 Đo trình độ']
  },
  {
    id: 'SCEN_099',
    topic: 'Tương tác & Linh vật',
    name: 'Bảo Bé Cầu đọc thơ hoặc hát về cầu lông',
    regex: '(doc tho|đọc thơ|hat mot bai|hát một bài|lam tho|làm thơ|tho cau long|thơ cầu lông)',
    responses: [
      `Dạ Bé Cầu xin tặng bạn bài thơ con cóc tự sáng tác nè 🏸✨:\n\n*"Sáng ra xách vợt bước ra sân,\nCầu bay vun vút ngỡ thiên thần.\nĐập một quả smash nổ long trời,\nBao nhiêu muộn phiền hóa hư không!"*\n\nNghe xong có thấy rạo rực muốn ra sân liền chưa nè bạn ơi!`
    ],
    quickPrompts: ['🏸 Tìm kèo ra sân liền', '🥰 Hay quá Bé Cầu ơi']
  },
  {
    id: 'SCEN_100',
    topic: 'Tương tác & Linh vật',
    name: 'Hỏi ai tạo ra Bé Cầu (đội ngũ TimVangLai)',
    regex: '(ai tao ra be cau|ai tạo ra bé cầu|ai sinh ra|ai lam ra|doi ngu nao|đội ngũ nào|tac gia la ai|tác giả là ai)',
    responses: [
      `Dạ Bé Cầu được phát triển bởi các kỹ sư trẻ Việt Nam đầy nhiệt huyết tại nền tảng **TimVangLai.io.vn**! 🏸🇻🇳\n\nSứ mệnh của tụi mình là giúp mọi người chơi cầu lông ở Việt Nam tìm được sân gần, hợp trình độ và không bao giờ phải chịu cảnh cô đơn hay bùng kèo nữa!`
    ],
    quickPrompts: ['🏸 Khám phá kèo hôm nay', '💡 Tìm hiểu văn hóa TimVangLai']
  },

  // ==========================================
  // TOPIC 11: ỨNG XỬ TIÊU CỰC, KHIÊU KHÍCH, XUNG ĐỘT (101-105)
  // ==========================================
  {
    id: 'SCEN_101',
    topic: 'Ứng xử & Kiểm soát',
    name: 'Chửi bậy, văng tục (xử lý văn minh, điềm đạm)',
    regex: '(dm|dcm|vcl|đụ|địt|cho chet|chó chết|mat day|mất dạy|me may|mẹ mày)',
    responses: [
      `Dạ Bé Cầu xin lắng nghe nè! 🏸🤍 Có thể hôm nay bạn đang gặp chuyện bực bội hoặc ức chế ngoài cuộc sống đúng không nè? Nhưng mình cùng giữ cho không gian thể thao thật văn minh, vui vẻ và tôn trọng lẫn nhau nha bạn! Nếu có điều gì chưa vừa ý, bạn cứ góp ý nhẹ nhàng để Bé Cầu cải thiện nhé!`
    ],
    quickPrompts: ['🏸 Tìm kèo giao lưu văn minh', '💡 Hướng dẫn sử dụng app']
  },
  {
    id: 'SCEN_102',
    topic: 'Ứng xử & Kiểm soát',
    name: 'Chê bai "App cùi bắp, vô dụng"',
    regex: '(app cui|app cùi|app phe vat|app phế vật|vo dung|vô dụng|app rac|app rác|app te|app tệ)',
    responses: [
      `Dạ Bé Cầu và đội ngũ TimVangLai chân thành xin lỗi vì đã mang lại trải nghiệm chưa tốt cho bạn! 🥺 Tụi mình đang nỗ lực cập nhật và sửa lỗi từng giờ để phục vụ anh em lông thủ tốt hơn. Bạn có thể cho Bé Cầu biết bạn gặp lỗi ở chỗ nào để đội ngũ khắc phục ngay lập tức được không ạ?`
    ],
    quickPrompts: ['💡 Báo lỗi ứng dụng', '🏸 Xem danh sách kèo mới cập nhật']
  },
  {
    id: 'SCEN_103',
    topic: 'Ứng xử & Kiểm soát',
    name: 'Tố cáo nghi vấn bị lừa tiền cọc',
    regex: '(lua dao|lừa đảo|lua tien coc|lừa tiền cọc|an chan|ăn chặn|to cao host|tố cáo host)',
    responses: [
      `⚠️ **HỆ THỐNG TIẾP NHẬN PHẢN ÁNH KHẨN CẤP!**\n\nTimVangLai cam kết bảo vệ quyền lợi người chơi 100%. Nếu bạn đã chuyển cọc mà Host bùng sân không hoàn tiền, xin vui lòng bấm nút **"Báo cáo bài đăng"** trong chi tiết kèo hoặc liên hệ ngay hotline hỗ trợ để admin khóa tài khoản và blacklist Host vi phạm vĩnh viễn nha!`
    ],
    quickPrompts: ['🚨 Báo cáo vi phạm Host', '💡 Quy định an toàn tiền cọc']
  },
  {
    id: 'SCEN_104',
    topic: 'Ứng xử & Kiểm soát',
    name: 'Xung đột, đòi đánh nhau trên sân cầu',
    regex: '(danh nhau|đánh nhau|chem nhau|chém nhau|giai quyet bang tay chan|gãy vợt u đầu|danh lon|đánh lộn)',
    responses: [
      `Bình tĩnh hạ hỏa ngay bạn ơi! 🛑 Cây vợt sinh ra là để đập cầu chứ không phải để đập người đâu nè! Ra sân rèn luyện sức khỏe chứ hơn thua vài quả cầu để rồi dính vào pháp luật thương tích thì quá uổng phí. Hít sâu một hơi, nhường nhau một bước cho biển rộng trời cao nha bạn!`
    ],
    quickPrompts: ['💡 Tinh thần thể thao Fair-play', '🥰 Cảm ơn Bé Cầu nha']
  },
  {
    id: 'SCEN_105',
    topic: 'Ứng xử & Kiểm soát',
    name: 'Bị ép uống rượu bia, ép độ tiền sau trận',
    regex: '(ep uong|ép uống|ep nhau|ép nhậu|danh do tien|đánh độ tiền|ca do|cá độ)',
    responses: [
      `Cương quyết từ chối nha bạn ơi! 🚫 Thể thao lành mạnh là tự nguyện và vui vẻ. Nếu nhóm bạn ép uống rượu bia hoặc gạ gẫm cá độ ăn tiền trái pháp luật, bạn hãy dứt khoát từ chối và rời nhóm ngay. Trên TimVangLai chỉ kết nối các câu lạc bộ văn minh, nghiêm cấm cá độ nha!`
    ],
    quickPrompts: ['🏸 Tìm nhóm giao lưu thuần phong trào', '💡 Tiêu chuẩn cộng đồng']
  },

  // ==========================================
  // TOPIC 12: CHỦ ĐỀ NGOÀI LỀ HÀI HƯỚC (OFF-TOPIC) (106-112)
  // ==========================================
  {
    id: 'SCEN_106',
    topic: 'Ngoài lề & Hài hước',
    name: 'Nhờ viết code, giải bài tập lập trình',
    regex: '(viet code|viết code|lap trinh|lập trình|python|javascript|react|html|css|c\\+\\+|java code|fix bug giup|fix bug giúp)',
    responses: [
      `Ui da, môn code này nằm tít tắp ở ngoài... đường biên sân cầu rồi bạn ơi! 🏸💻😅 Bé Cầu chỉ biết fix lỗi giao cầu cao quá rốn với lỗi đập cầu cắm lưới thôi nè, chứ fix bug code là Bé Cầu "cháy RAM" liền á haha! Bạn qua hỏi mấy anh IT, còn muốn xả stress sau giờ code thì bảo Bé Cầu tìm sân nha!`
    ],
    quickPrompts: ['🏸 Tìm kèo tối nay cho dân IT', '🎯 Đo trình độ cầu lông']
  },
  {
    id: 'SCEN_107',
    topic: 'Ngoài lề & Hài hước',
    name: 'Nhờ giải bài tập toán, lý, hóa',
    regex: '(giai toan|giải toán|bai tap toan|bài tập toán|vat ly|vật lý|hoa hoc|hóa học|phuong trinh|phương trình)',
    responses: [
      `Phương trình duy nhất mà Bé Cầu giải được là: **Vợt xịn + Cước nảy + Đam mê = Cú Smash 300km/h** thôi à! 📐🏸 Còn bài tập trường lớp thì bạn tự làm nha, học bài xong sớm rồi xách vợt ra sân cùng Bé Cầu nè!`
    ],
    quickPrompts: ['🏸 Kèo ca tối sau khi học xong', '🥰 Cảm ơn Bé Cầu nha']
  },
  {
    id: 'SCEN_108',
    topic: 'Ngoài lề & Hài hước',
    name: 'Hỏi đầu tư Crypto, Bitcoin, chứng khoán',
    regex: '(bitcoin|btc|crypto|tien ao|tiền ảo|chung khoan|chứng khoán|du dinh|đu đỉnh|bat day|bắt đáy)',
    responses: [
      `Biểu đồ nến xanh nến đỏ đau tim lắm bạn ơi! 📉📈 Thay vì ngồi canh chart đu đỉnh nghẹt thở, chi bằng đầu tư vào sức khỏe bằng vài set cầu lông, đảm bảo chỉ có "lời" sức khỏe chứ không bao giờ lỗ nha!`
    ],
    quickPrompts: ['🏸 Tìm kèo chiều tối nay', '🥰 Cảm ơn Bé Cầu nha']
  },
  {
    id: 'SCEN_109',
    topic: 'Ngoài lề & Hài hước',
    name: 'Hỏi về bóng đá, Ronaldo, Messi',
    regex: '(ronaldo|messi|bong da|bóng đá|ngoai hang anh|ngoại hạng anh|world cup|c1|champions league)',
    responses: [
      `Bóng đá hấp dẫn thiệt đó, nhưng mà cầu lông chạy cường độ cao cũng tiêu hao calo không kém đâu nha! ⚽➡️🏸 Bé Cầu là fan ruột của Lin Dan, Lee Chong Wei với Viktor Axelsen cơ. Bạn có muốn thử xem idol cầu lông của mình là ai không?`
    ],
    quickPrompts: ['🏸 Tìm kèo giao lưu cuối tuần', '💡 Tìm hiểu huyền thoại cầu lông']
  },
  {
    id: 'SCEN_110',
    topic: 'Ngoài lề & Hài hước',
    name: 'Hỏi về game Liên Quân, LMHT, Free Fire',
    regex: '(lien quan|liên quân|lmht|lien minh|liên minh|free fire|pubg|leo rank|leo rank game)',
    responses: [
      `Leo rank game căng thẳng bấm nát bàn phím gù cả lưng rồi đúng không nè? 🎮 Ra sân làm vài hiệp cầu lông vừa thẳng lưng, vừa sáng mắt mà leo rank ngoài đời thật bao ngầu luôn bạn ơi!`
    ],
    quickPrompts: ['🏸 Tìm kèo hôm nay', '🎯 Thử leo rank trình độ cầu lông']
  },
  {
    id: 'SCEN_111',
    topic: 'Ngoài lề & Hài hước',
    name: 'Hỏi thời sự, chính trị thế giới',
    regex: '(chinh tri|chính trị|thoi su|thời sự|bau cu|bầu cử|tong thong|tổng thống|chien tranh|chiến tranh)',
    responses: [
      `Bé Cầu chỉ quan tâm đến hòa bình thế giới và... hòa bình trên sân cầu lông thôi nè! 🕊️🏸 Những chuyện vĩ mô hãy để các chuyên gia lo, còn việc rèn luyện sức khỏe hôm nay cứ để Bé Cầu đồng hành cùng bạn nha!`
    ],
    quickPrompts: ['🏸 Tìm kèo hôm nay', '🥰 Cảm ơn Bé Cầu nha']
  },
  {
    id: 'SCEN_112',
    topic: 'Ngoài lề & Hài hước',
    name: 'Nhờ tư vấn tình yêu, hôn nhân gia đình',
    regex: '(tu van tinh cam|tư vấn tình cảm|chia tay khong|chia tay không|co nen ly hon|có nên ly hôn|tinh yeu la gi|tình yêu là gì)',
    responses: [
      `Chuyện tình cảm phức tạp như một pha cầu giằng co 50 lượt chạm vậy á! 💕 Nếu đang rối bời, bạn hãy để tâm trí được nghỉ ngơi. Ra sân đánh vài set cho mồ hôi toát ra, khi cơ thể sảng khoái thì bạn sẽ có cái nhìn sáng suốt nhất cho trái tim mình nha!`
    ],
    quickPrompts: ['🏸 Tìm kèo giao lưu khuây khỏa', '🥰 Cảm ơn Bé Cầu nha']
  }
];

// Generate TypeScript Content
const tsCode = `// src/data/aiChatScenarios.ts
/**
 * 112 KỊCH BẢN ĐÀM THOẠI, ỨNG XỬ & ỨNG BIẾN THỰC CHIẾN CỦA BÉ CẦU AI
 * Phục vụ cộng đồng cầu lông phong trào Việt Nam (TimVangLai.io.vn)
 * Chia thành 12 Chủ Đề chuyên sâu, chống phản hồi máy móc.
 */

export interface ScenarioDefinition {
  id: string;
  topic: string;
  name: string;
  regex: RegExp;
  responses: string[];
  quickPrompts: string[];
}

export const AI_CHAT_SCENARIOS: ScenarioDefinition[] = [
${scenariosData.map(s => `  {
    id: ${JSON.stringify(s.id)},
    topic: ${JSON.stringify(s.topic)},
    name: ${JSON.stringify(s.name)},
    regex: /${s.regex}/i,
    responses: [
${s.responses.map(r => `      ${JSON.stringify(r)}`).join(',\n')}
    ],
    quickPrompts: ${JSON.stringify(s.quickPrompts)},
  }`).join(',\n')}
];

/**
 * Khớp kịch bản hội thoại thông minh
 */
export function matchScenario(
  userInput: string,
  inputNorm: string
): { text: string; quickPrompts: string[]; topic: string; scenarioId: string } | null {
  for (const scen of AI_CHAT_SCENARIOS) {
    if (scen.regex.test(userInput) || scen.regex.test(inputNorm)) {
      const idx = Math.abs(userInput.length + (userInput.charCodeAt(0) || 0)) % scen.responses.length;
      return {
        text: scen.responses[idx],
        quickPrompts: scen.quickPrompts,
        topic: scen.topic,
        scenarioId: scen.id,
      };
    }
  }
  return null;
}
`;

fs.writeFileSync(path.join(__dirname, '../src/data/aiChatScenarios.ts'), tsCode, 'utf8');
console.log('Successfully generated 112 scenarios in src/data/aiChatScenarios.ts!');
