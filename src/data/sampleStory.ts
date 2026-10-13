import { Character, LocationItem, Scene, ImageAsset, StylePreset } from '../types';

export const MOT_BUA_NO_SCRIPT = `Cái đói đã tràn về khắp ngõ xóm từ những ngày đầu đông năm ấy. Trong túp lều rách nát ở cuối làng, bà cái Tý ngồi co ro bên góc chõng tre ọp ẹp, ánh mắt trũng sâu nhìn đứa cháu gái duy nhất còn lại đang đói lả, hai bờ môi khô khốc nứt nẻ vì nhiều ngày liền chỉ húp nước cháo cám cầm hơi.

Bà lão run run thò tay vào trong túi áo nâu rách chắp vá chằng chịt, cẩn thận lần mò rồi rút ra đúng hai đồng xu nhỏ mòn vẹt mép. Đó là toàn bộ số gia tài cuối cùng của một đời làm thuê cuốc mướn. Đôi bàn tay xương xẩu, nhăn nheo như cành củi khô của bà run rẩy đặt hai đồng xu vào lòng bàn tay bé bỏng của cái Tý, giọng nghẹn lại: "Cầm lấy mà mua tấm bánh, cháu ơi...".

Thế nhưng hai đồng xu cũng chỉ hoãn được cái đói trong chốc lát. Không còn lối thoát nào khác, người bà già nua đành dắt đứa cháu côi cút đến gõ cửa nhà bà phó Thụ ở xóm trên, hy vọng xin được một bát cơm nguội thừa hoặc gửi đứa cháu vào làm con sen chăn trâu cắt cỏ để nó không phải chết đói.

Bà phó Thụ đứng bệ vệ, hai tay chống nạnh ngay bậc thềm gạch đỏ bóng loáng. Đôi mắt ti hí sắc lẻm của bà phó quét từ đầu đến chân hai bà cháu đang khúm núm run rẩy dưới bóng râm sân gạch. Một nụ cười nửa miệng khinh khỉnh nở trên khuôn mặt béo đẫy đà, báo trước những đắng cay tủi nhục mà đứa cháu nhỏ sắp phải gánh chịu.

Đoạn văn này của nhà văn Nam Cao phơi bày đến tận cùng bi kịch của người nông dân trước Cách mạng: cái đói không chỉ cướp đi sự sống, mà còn xé nát nhân phẩm, ép buộc người bà nghèo khổ phải dứt ruột bán đi đứa cháu ruột thịt của mình chỉ để đổi lấy một hy vọng sống mong manh.`;

// Pre-generated SVG references for canonical 2D Xế Chiều folk characters
function createCharacterSvg(name: string, type: 'front' | 'side' | 'full', traits: string, mainColor: string): string {
  const isGrandmother = name.includes('Bà cái Tý');
  const isChild = name.includes('Cái Tý');
  const isRich = name.includes('phó Thụ');

  const headSize = isChild ? 75 : isGrandmother ? 90 : 96;
  const bodyH = type === 'full' ? 240 : 160;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
    <rect width="400" height="400" fill="#FAF6F0" />
    <circle cx="200" cy="200" r="185" fill="#F0E8DC" stroke="#221E19" stroke-width="4" />
    
    <!-- Marker header -->
    <rect x="25" y="25" width="350" height="32" rx="6" fill="#2E241D" />
    <text x="40" y="47" font-family="'Plus Jakarta Sans', sans-serif" font-weight="700" font-size="13" fill="#E89659">XẾ CHIỀU REFERENCE</text>
    <text x="360" y="47" font-family="'JetBrains Mono', monospace" font-size="12" fill="#FFFFFF" text-anchor="end">${type.toUpperCase()}</text>

    <!-- Character Body -->
    <g transform="translate(200, ${type === 'full' ? 260 : 250})">
      <!-- Shadow -->
      <ellipse cx="0" cy="110" rx="70" ry="16" fill="#CBBBB0" opacity="0.5" />
      <!-- Torso -->
      <path d="M -45 0 L -60 ${bodyH * 0.4} Q 0 ${bodyH * 0.45} 60 ${bodyH * 0.4} L 45 0 Z" 
            fill="${mainColor}" stroke="#1C1814" stroke-width="7" stroke-linejoin="round" />
      ${isGrandmother ? '<path d="M -25 30 L 0 55 L 25 30" stroke="#FAF6F0" stroke-width="4" fill="none" />' : ''}
      ${isRich ? '<path d="M -30 10 L 0 40 L 30 10" stroke="#D19C4C" stroke-width="6" fill="none" />' : ''}
    </g>

    <!-- Character Head (Big Head ~ half body size) -->
    <g transform="translate(200, 160)">
      <circle cx="0" cy="0" r="${headSize * 0.7}" fill="${isGrandmother ? '#EAD0BA' : isChild ? '#F5DAC4' : '#FBE0D0'}" stroke="#1C1814" stroke-width="8" />
      
      <!-- Hair/Headdress -->
      ${isGrandmother ? `
        <path d="M -60 -20 Q -65 -75 0 -80 Q 65 -75 60 -20 Q 30 -60 -30 -60 Z" fill="#6A625B" stroke="#1C1814" stroke-width="7" />
        <circle cx="0" cy="-75" r="14" fill="#6A625B" stroke="#1C1814" stroke-width="6" />
      ` : isChild ? `
        <path d="M -45 -25 Q -40 -65 0 -68 Q 40 -65 45 -25 Z" fill="#2C231E" stroke="#1C1814" stroke-width="7" />
        <circle cx="0" cy="-72" r="12" fill="#D45B5B" stroke="#1C1814" stroke-width="5" />
      ` : `
        <!-- Khăn mỏ quạ đen bóng bà phó Thụ -->
        <path d="M -65 0 L 0 -85 L 65 0 Q 0 -30 -65 0 Z" fill="#221C19" stroke="#1C1814" stroke-width="7" />
        <polygon points="0,-85 -15,-40 15,-40" fill="#221C19" />
      `}

      <!-- Face Elements based on view angle -->
      ${type === 'side' ? `
        <ellipse cx="25" cy="-5" rx="5" ry="7" fill="#1C1814" />
        <path d="M 12 -22 Q 26 -28 38 -20" stroke="#1C1814" stroke-width="5" stroke-linecap="round" fill="none" />
        <path d="M 45 4 L 54 12 L 44 18" stroke="#1C1814" stroke-width="5" fill="none" />
        <path d="M 20 25 Q 32 30 42 24" stroke="#1C1814" stroke-width="5" stroke-linecap="round" fill="none" />
      ` : `
        <ellipse cx="-22" cy="-5" rx="5" ry="7" fill="#1C1814" />
        <ellipse cx="22" cy="-5" rx="5" ry="7" fill="#1C1814" />
        <path d="M -34 -20 Q -22 -26 -10 -18" stroke="#1C1814" stroke-width="5" stroke-linecap="round" fill="none" />
        <path d="M 10 -18 Q 22 -26 34 -20" stroke="#1C1814" stroke-width="5" stroke-linecap="round" fill="none" />
        <path d="M 0 0 L 2 12" stroke="#B08362" stroke-width="4" stroke-linecap="round" />
        <path d="M -14 26 Q 0 ${isRich ? '34' : '20'} 14 26" stroke="#1C1814" stroke-width="5" stroke-linecap="round" fill="none" />
      `}
    </g>

    <!-- Footer label -->
    <rect x="25" y="345" width="350" height="30" rx="6" fill="#FAF6F0" stroke="#D5C5B5" stroke-width="1.5" />
    <text x="200" y="365" font-family="'Plus Jakarta Sans', sans-serif" font-weight="600" font-size="12" fill="#2E241D" text-anchor="middle">${name} (${traits.slice(0, 32)}...)</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const SAMPLE_CHARACTERS: Character[] = [
  {
    id: "char_ba_cai_ty",
    name: "Bà cái Tý",
    role: "Nhân vật chính",
    ageEra: "Bà lão ~65 tuổi, lưng còng",
    fixedTraits: "Mặt gầy gò, hốc mắt sâu đượm buồn, búi tóc bạc thưa, áo nâu vá nhiều mảng ở vai, quần sồi đen bạc màu, tỷ lệ 2D đầu to 1/2 thân",
    clothingColor: "Nâu đất sồng bạc màu",
    references: [
      {
        id: "ref_ba_front",
        type: "front",
        label: "Chính diện",
        imageUrl: createCharacterSvg("Bà cái Tý", "front", "Mặt gầy, mắt buồn, áo nâu vá", "#6B503D"),
        isApproved: true,
      },
      {
        id: "ref_ba_side",
        type: "side",
        label: "Nghiêng 3/4",
        imageUrl: createCharacterSvg("Bà cái Tý", "side", "Góc nghiêng lưng còng", "#6B503D"),
        isApproved: true,
      },
      {
        id: "ref_ba_full",
        type: "full_body",
        label: "Toàn thân",
        imageUrl: createCharacterSvg("Bà cái Tý", "full", "Dáng người khắc khổ", "#6B503D"),
        isApproved: true,
      },
    ],
  },
  {
    id: "char_cai_ty",
    name: "Cái Tý (Cháu gái)",
    role: "Nhân vật đồng hành",
    ageEra: "Bé gái ~7 tuổi, gầy gò",
    fixedTraits: "Mặt tròn nhỏ, mắt đen to ngơ ngác lo lắng, tóc trái đào buộc túm, áo yếm nâu cũ rộng thùng thình",
    clothingColor: "Nâu nhạt vá viền kem",
    references: [
      {
        id: "ref_ty_front",
        type: "front",
        label: "Chính diện",
        imageUrl: createCharacterSvg("Cái Tý", "front", "Mắt đen tròn ngơ ngác", "#9E7B62"),
        isApproved: true,
      },
      {
        id: "ref_ty_side",
        type: "side",
        label: "Nghiêng 3/4",
        imageUrl: createCharacterSvg("Cái Tý", "side", "Áo yếm nâu nhạt", "#9E7B62"),
        isApproved: true,
      },
      {
        id: "ref_ty_full",
        type: "full_body",
        label: "Toàn thân",
        imageUrl: createCharacterSvg("Cái Tý", "full", "Gầy gò đói lả", "#9E7B62"),
        isApproved: true,
      },
    ],
  },
  {
    id: "char_ba_pho_thu",
    name: "Bà phó Thụ",
    role: "Chủ nợ / Phú nông",
    ageEra: "Phụ nữ trung niên ~45 tuổi, béo đẫy đà",
    fixedTraits: "Mặt tròn to dữ dằn, mắt xếch sắc lẻm, răng đen chải chuốt, áo tứ thân bằng lụa màu mận chín, tay đeo xuyến bạc",
    clothingColor: "Mận chín sẫm & khăn mỏ quạ",
    references: [
      {
        id: "ref_pho_front",
        type: "front",
        label: "Chính diện",
        imageUrl: createCharacterSvg("Bà phó Thụ", "front", "Mặt tròn béo, mắt xếch", "#542335"),
        isApproved: true,
      },
      {
        id: "ref_pho_side",
        type: "side",
        label: "Nghiêng 3/4",
        imageUrl: createCharacterSvg("Bà phó Thụ", "side", "Khăn mỏ quạ lụa mận chín", "#542335"),
        isApproved: true,
      },
      {
        id: "ref_pho_full",
        type: "full_body",
        label: "Toàn thân",
        imageUrl: createCharacterSvg("Bà phó Thụ", "full", "Chống nạnh bệ vệ", "#542335"),
        isApproved: true,
      },
    ],
  },
];

export const SAMPLE_LOCATIONS: LocationItem[] = [
  {
    id: "loc_gian_nha_tranh",
    name: "Gian nhà tranh bà cái Tý",
    description: "Mái rạ dột nát, vách đất nứt toác, chiếc chõng tre ọp ẹp và ngọn đèn dầu hột vịt le lói.",
    keyElements: ["chõng tre ọp ẹp", "vách đất nứt nẻ", "bát sành mẻ rỗng", "ngọn đèn dầu"],
  },
  {
    id: "loc_san_nha_pho_thu",
    name: "Sân gạch nhà bà phó Thụ",
    description: "Sân gạch đỏ rộng thênh thang, chum nước sành lớn, cối xay lúa và con chó đá trước hiên.",
    keyElements: ["sân gạch đỏ", "bậc thềm lim", "chum nước sành", "cây cau cao vút"],
  },
];

// Helper to make stylized scene illustrations for canonical scenes
function createSceneSvg(sceneNumber: number, title: string, subtitle: string, characterTag: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" width="1280" height="720">
    <defs>
      <radialGradient id="bg_${sceneNumber}" cx="50%" cy="50%" r="70%">
        <stop offset="0%" stop-color="#FBF8F3" />
        <stop offset="100%" stop-color="#E7D9C9" />
      </radialGradient>
    </defs>
    <rect width="1280" height="720" fill="url(#bg_${sceneNumber})" />
    
    <!-- Khung viền mộc mạc đặc trưng Xế Chiều -->
    <rect x="0" y="0" width="1280" height="720" fill="none" stroke="#221E19" stroke-width="12" />
    <path d="M 0 550 Q 640 530 1280 550" stroke="#684D3A" stroke-width="14" fill="none" />
    
    <!-- Chi tiết không gian dân gian 1-3 chi tiết -->
    <line x1="220" y1="40" x2="220" y2="660" stroke="#7E5638" stroke-width="32" stroke-linecap="round" />
    <line x1="220" y1="40" x2="220" y2="660" stroke="#281D14" stroke-width="6" />

    <!-- Nhân vật 2D theo phân cảnh -->
    <g transform="translate(640, 350)">
      <ellipse cx="0" cy="180" rx="130" ry="22" fill="#BFAF9E" opacity="0.6" />
      <!-- Thân -->
      <path d="M -50 40 L -70 170 Q 0 180 70 170 L 50 40 Z" fill="#6B503D" stroke="#1C1814" stroke-width="9" stroke-linejoin="round" />
      <path d="M -35 40 L 0 90 L 35 40" stroke="#FBF8F3" stroke-width="5" fill="none" />
      <!-- Đầu to 1/2 thân -->
      <circle cx="0" cy="-40" r="95" fill="#EED2BC" stroke="#1C1814" stroke-width="9" />
      <path d="M -80 -45 Q -90 -130 0 -135 Q 90 -130 80 -45 Q 60 -105 -20 -115 Z" fill="#2E241D" stroke="#1C1814" stroke-width="8" />
      <!-- Mắt chấm & Miệng -->
      <ellipse cx="-30" cy="-40" rx="6" ry="8" fill="#1C1814" />
      <ellipse cx="30" cy="-40" rx="6" ry="8" fill="#1C1814" />
      <path d="M -15 -5 Q 0 8 15 -5" stroke="#1C1814" stroke-width="6" stroke-linecap="round" fill="none" />
    </g>

    <!-- Tag thương hiệu góc trái trên -->
    <rect x="40" y="40" width="280" height="44" rx="8" fill="#281E17" opacity="0.95" />
    <text x="56" y="69" font-family="'Plus Jakarta Sans', sans-serif" font-weight="800" font-size="18" fill="#E89659">XẾ CHIỀU STUDIO</text>
    <text x="215" y="69" font-family="'JetBrains Mono', monospace" font-size="14" fill="#E7D9C9">SCENE ${sceneNumber}</text>

    <!-- Hộp thông tin lời đọc ở đáy ảnh -->
    <rect x="50" y="580" width="1180" height="95" rx="12" fill="#1A1512" opacity="0.92" />
    <text x="80" y="620" font-family="'Plus Jakarta Sans', sans-serif" font-weight="700" font-size="22" fill="#FFFFFF">${title.replace(/</g, '&lt;')}</text>
    <text x="80" y="652" font-family="'Plus Jakarta Sans', sans-serif" font-size="16" fill="#D3C3B2">${subtitle.slice(0, 100).replace(/</g, '&lt;')}...</text>
    <text x="1170" y="636" font-family="'JetBrains Mono', monospace" font-size="15" fill="#E89659" text-anchor="end">${characterTag.replace(/</g, '&lt;')}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const SAMPLE_SCENES: Scene[] = [
  {
    id: "scene_001",
    order: 1,
    scriptExcerpt: "Cái đói đã tràn về khắp ngõ xóm từ những ngày đầu đông năm ấy. Trong túp lều rách nát ở cuối làng, bà cái Tý ngồi co ro bên góc chõng tre ọp ẹp...",
    paragraphIndex: 0,
    kind: "narrative",
    action: "Bà cái Tý ngồi bó gối co ro trên chõng tre mục, ánh mắt xót xa nhìn đứa cháu gái đang đói lả.",
    emotion: "Đau đớn, đói lả, tuyệt vọng",
    cameraAngle: "Trung cảnh (medium shot)",
    cast: ["Bà cái Tý", "Cái Tý"],
    props: ["chõng tre ọp ẹp", "bát sành mẻ không"],
    compiledPrompt: "2D minimalist Vietnamese folk animation style for Xế Chiều Studio. Old emaciated grandmother sitting beside her hungry granddaughter on a rustic bamboo bed inside a dark mud-wall hut. Big head proportions, bold black ink outlines, muted earthy cream and brown tones, dramatic sorrowful atmosphere.",
    selectedAssetId: "asset_s1_v1",
    reviewStatus: "approved",
    durationSeconds: 5.5,
    notes: "Đã duyệt nhân vật bà lão và cháu gái đúng tông màu đất Xế Chiều",
  },
  {
    id: "scene_002",
    order: 2,
    scriptExcerpt: "Bà lão run run thò tay vào trong túi áo nâu rách chắp vá chằng chịt, cẩn thận lần mò rồi rút ra đúng hai đồng xu nhỏ mòn vẹt mép...",
    paragraphIndex: 1,
    kind: "narrative",
    action: "Cận cảnh bàn tay gầy gò nhăn nheo của bà lão trao đúng hai đồng xu cổ cho bàn tay nhỏ xíu run rẩy của đứa cháu.",
    emotion: "Xót xa, nâng niu, nghẹn ngào",
    cameraAngle: "Cận cảnh (close-up)",
    cast: ["Bà cái Tý", "Cái Tý"],
    props: ["hai đồng xu cổ viền tròn", "bàn tay xương xẩu"],
    compiledPrompt: "2D animated close-up shot for Xế Chiều Studio. Wrinkled weathered hand holding exactly two small vintage bronze coins passing them to a child's small trembling palm. Minimalist folk art, clean thick black lines, flat earth tones, stark uncluttered cream background.",
    selectedAssetId: "asset_s2_v1",
    reviewStatus: "approved",
    durationSeconds: 4.0,
    notes: "Đã kiểm tra kỹ: đúng 2 đồng xu, không bị vẽ thừa thành 3 xu.",
  },
  {
    id: "scene_003",
    order: 3,
    scriptExcerpt: "Thế nhưng hai đồng xu cũng chỉ hoãn được cái đói trong chốc lát. Không còn lối thoát nào khác, người bà già nua đành dắt đứa cháu côi cút đến gõ cửa nhà bà phó Thụ...",
    paragraphIndex: 2,
    kind: "narrative",
    action: "Bà dắt tay đứa cháu bé bỏng bước đi chậm chạp trên con đường làng quạnh quẽ dưới trời chiều âm u.",
    emotion: "Kiệt quệ, tủi hổ",
    cameraAngle: "Toàn cảnh (wide shot)",
    cast: ["Bà cái Tý", "Cái Tý"],
    props: ["gậy tre", "nón mê rách"],
    compiledPrompt: "Wide 2D shot. Frail grandmother in patched brown tunic walking hand-in-hand with a tiny malnourished girl along a deserted dusty village path under a gloomy dusk sky. Big head style, simple tree silhouette, folk cartoon aesthetic.",
    selectedAssetId: "asset_s3_v1",
    reviewStatus: "unreviewed",
    durationSeconds: 6.0,
  },
  {
    id: "scene_004",
    order: 4,
    scriptExcerpt: "Bà phó Thụ đứng bệ vệ, hai tay chống nạnh ngay bậc thềm gạch đỏ bóng loáng. Đôi mắt ti hí sắc lẻm quét từ đầu đến chân hai bà cháu...",
    paragraphIndex: 3,
    kind: "narrative",
    action: "Bà phó Thụ đứng chống nạnh bệ vệ trên hiên gạch, ánh mắt soi mói khinh khỉnh nhìn xuống hai bà cháu đang khúm núm.",
    emotion: "Khinh bỉ, hách dịch",
    cameraAngle: "Góc thấp chếch lên (low-angle shot)",
    cast: ["Bà phó Thụ", "Bà cái Tý"],
    props: ["bậc thềm gạch", "quạt nan"],
    compiledPrompt: "2D folk animation scene. Plump arrogant landlord woman in dark plum silk dress standing with arms akimbo on brick porch looking down haughtily at bowed elderly beggar. Bold outlines, contrasting proportions, clean flat colors.",
    selectedAssetId: "asset_s4_v1",
    reviewStatus: "needs_fix",
    durationSeconds: 5.0,
    notes: "Cần đổi góc: hạ góc máy xuống một chút để làm nổi bật sự bệ vệ của bà phó Thụ.",
  },
  {
    id: "scene_005",
    order: 5,
    scriptExcerpt: "Đoạn văn này của nhà văn Nam Cao phơi bày đến tận cùng bi kịch của người nông dân trước Cách mạng: cái đói không chỉ cướp đi sự sống, mà còn xé nát nhân phẩm...",
    paragraphIndex: 4,
    kind: "commentary",
    action: "Khung hình biểu tượng tĩnh: chiếc bát sành mẻ rỗng không cô đơn giữa phông nền sẫm hoài niệm, ngọn khói mỏng bốc lên.",
    emotion: "Trầm mặc, xót xa chiêm nghiệm",
    cameraAngle: "Cận cảnh biểu tượng tĩnh",
    cast: ["Người dẫn chuyện"],
    props: ["chiếc bát sành mẻ rỗng", "khói mỏng"],
    compiledPrompt: "Minimalist symbolic 2D illustration for Xế Chiều Studio. A single cracked empty ceramic rice bowl resting on rustic dark floor with subtle thin smoke drift. Highly contemplative, editorial mood, deep sepia and dark indigo tones.",
    selectedAssetId: "asset_s5_v1",
    reviewStatus: "approved",
    durationSeconds: 4.5,
  },
];

export const SAMPLE_ASSETS: Record<string, ImageAsset[]> = {
  scene_001: [
    {
      id: "asset_s1_v1",
      sceneId: "scene_001",
      dataUrl: createSceneSvg(1, "Cảnh 1: Gian nhà tranh đói lả", "Bà cái Tý và đứa cháu gái co ro bên góc chõng tre", "BÀ CÁI TÝ • CÁI TÝ"),
      promptSnapshot: "2D minimalist Vietnamese folk animation style for Xế Chiều Studio...",
      createdAt: Date.now() - 3600000,
      provider: "Xế Chiều 2D Engine",
      isApproved: true,
      version: 1,
    },
  ],
  scene_002: [
    {
      id: "asset_s2_v1",
      sceneId: "scene_002",
      dataUrl: createSceneSvg(2, "Cảnh 2: Hai đồng xu gia tài", "Bàn tay nhăn nheo run rẩy trao đúng hai đồng xu", "CẬN CẢNH ĐẠO CỤ"),
      promptSnapshot: "2D animated close-up shot for Xế Chiều Studio. Exactly two small coins...",
      createdAt: Date.now() - 3000000,
      provider: "Xế Chiều 2D Engine",
      isApproved: true,
      version: 1,
    },
  ],
  scene_003: [
    {
      id: "asset_s3_v1",
      sceneId: "scene_003",
      dataUrl: createSceneSvg(3, "Cảnh 3: Con đường hoàng hôn", "Hai bà cháu bước đi trên con đường làng quạnh quẽ", "TOÀN CẢNH LÀNG QUÊ"),
      promptSnapshot: "Wide 2D shot. Frail grandmother in patched brown tunic...",
      createdAt: Date.now() - 2400000,
      provider: "Xế Chiều 2D Engine",
      isApproved: false,
      version: 1,
    },
  ],
  scene_004: [
    {
      id: "asset_s4_v1",
      sceneId: "scene_004",
      dataUrl: createSceneSvg(4, "Cảnh 4: Cửa nhà phú nông", "Bà phó Thụ đứng chống nạnh soi mói nhìn xuống", "BÀ PHÓ THỤ"),
      promptSnapshot: "2D folk animation scene. Plump arrogant landlord woman...",
      createdAt: Date.now() - 1800000,
      provider: "Xế Chiều 2D Engine",
      isApproved: false,
      version: 1,
    },
  ],
  scene_005: [
    {
      id: "asset_s5_v1",
      sceneId: "scene_005",
      dataUrl: createSceneSvg(5, "Cảnh 5: Bát sành và phẩm giá", "Chiếc bát sành mẻ rỗng không cô độc", "BÌNH LUẬN NARRATOR"),
      promptSnapshot: "Minimalist symbolic 2D illustration. Cracked empty ceramic rice bowl...",
      createdAt: Date.now() - 1200000,
      provider: "Xế Chiều 2D Engine",
      isApproved: true,
      version: 1,
    },
  ],
};

export const DEFAULT_STYLE_PRESET: StylePreset = {
  id: "preset_xe_chieu_2d",
  name: "Hoạt hình Xế Chiều (Mặc định)",
  description: "Hoạt hình 2D Việt Nam cực đơn giản: đầu lớn ~1/2 thân, thân nhỏ, nét viền đen dày mộc mạc, màu phẳng gam kem/nâu đất/chàm xám.",
  rules: [
    "Đầu lớn khoảng nửa chiều cao cơ thể, thân nhỏ ngắn, tay chân gọn gàng.",
    "Đường viền mực đen dày, hơi thô tay, không bóng đổ phức tạp (tối đa một mảng bóng nhẹ).",
    "Bảng màu phẳng: kem, nâu sồng, chàm xám, da ấm mộc mạc.",
    "Bối cảnh tối giản 1-3 chi tiết địa điểm, tạo nhiều khoảng trống kể chuyện.",
    "Không 3D CGI, không anime hiện đại, không texture hạt điện ảnh.",
    "Một ảnh một khung hình 16:9, không ghép collage, không chèn watermark hay text tự sinh.",
  ],
  colorPalette: [
    { name: "Nền Kem Mộc", hex: "#FAF6F0" },
    { name: "Nâu Sồng Đất", hex: "#6B503D" },
    { name: "Chàm Xám Cũ", hex: "#465563" },
    { name: "Da Ấm Mộc", hex: "#EED2BC" },
    { name: "Mận Chín Tối", hex: "#542335" },
    { name: "Viền Mực Đen", hex: "#1C1814" },
  ],
  sampleReferences: [],
};
