/**
 * grade3SinhalaQuestionBank.js
 * Comprehensive 50-Item Research Question Bank and Remedial Drills for Grade 3 Sinhala
 * Structure:
 * - C1: අක්ෂර, පිල්ලම් සහ ශබ්ද (Letters, Pillam & Beginning Sounds)
 * - C2: නාම පද, ලිංග භේදය සහ යුගල පද (Nouns, Gender & Word Pairs)
 * - C3: සමාන පද සහ විරුද්ධ පද (Synonyms & Antonyms)
 * - C4: උක්ත-ආඛ්‍යාත, කාලය සහ ව්‍යාකරණ (Concord, Tenses & Grammar)
 * - C5: කියවීම, අවබෝධය, විරාම ලකුණු සහ තේරවිලි (Comprehension, Punctuation & Riddles)
 */

export const GRADE3_SINHALA_CATEGORIES = {
  C1: {
    id: 'C1',
    name: 'අක්ෂර හා පිල්ලම්',
    fullName: 'අක්ෂර, පිල්ලම් සහ ශබ්ද (Letters, Pillam & Sounds)',
    icon: '🔤',
    description: 'මූලික අකුරු, පිල්ලම් යෙදීම සහ ආරම්භක ශබ්ද හඳුනාගැනීම'
  },
  C2: {
    id: 'C2',
    name: 'නාම පද හා යුගල පද',
    fullName: 'නාම පද, ලිංග භේදය සහ යුගල පද (Nouns, Gender & Word Pairs)',
    icon: '👫',
    description: 'ප්‍රාණවාචී/අප්‍රාණවාචී නාම, ස්ත්‍රී/පුරුෂ ලිංග සහ යුගල පද'
  },
  C3: {
    id: 'C3',
    name: 'සමාන හා විරුද්ධ පද',
    fullName: 'සමාන පද සහ විරුද්ධ පද (Synonyms & Antonyms)',
    icon: '🔄',
    description: '3 ශ්‍රේණියට ගැළපෙන සමාන පද සහ ප්‍රතිවිරුද්ධ අර්ථ'
  },
  C4: {
    id: 'C4',
    name: 'ව්‍යාකරණ හා වාක්‍ය',
    fullName: 'උක්ත-ආඛ්‍යාත සහ කාලය (Grammar, Concord & Tenses)',
    icon: '✍️',
    description: 'ඒක වචන/බහු වචන උක්ත-ආඛ්‍යාත ගැලපීම සහ අතීත/වර්‍තමාන කාල'
  },
  C5: {
    id: 'C5',
    name: 'කියවීම හා තේරවිලි',
    fullName: 'කියවීම, අවබෝධය, විරාම ලකුණු සහ තේරවිලි (Comprehension & Riddles)',
    icon: '📖',
    description: 'කෙටි ඡේද කියවීම, තිත/ප්‍රශ්නාර්ථය සහ සරල තේරවිලි'
  }
};

export const GRADE3_QUESTION_BANK = [
  // ── CATEGORY 1 (C1): අක්ෂර හා පිල්ලම් ──
  {
    id: 'G3_C1_001',
    category: 'C1',
    competency: 'Pillam Matching',
    difficulty: 0.15,
    prompt: "'මල' යන වචනයට ඇදපිල්ල යෙදූ විට සෑදෙන වචනය කුමක්ද?",
    options: ['මැල', 'මාල', 'මීල', 'මුල'],
    answer: 'මැල',
    audioPrompt: 'ඇදපිල්ල යෙදූ විට සෑදෙන වචනය තෝරන්න.',
    explanation: "'ම' අකුරට ඇදපිල්ල යෙදූ විට 'මැ' සෑදේ."
  },
  {
    id: 'G3_C1_002',
    category: 'C1',
    competency: 'Beginning Sound Identification',
    difficulty: 0.25,
    prompt: "“කැරට්” යන වචනය ආරම්භ වන මූලික ශබ්දය කුමක්ද?",
    options: ['ක', 'ග', 'ප', 'ම'],
    answer: 'ක',
    audioPrompt: 'කැරට් ආරම්භ වන ශබ්දය කුමක්ද?',
    explanation: "'කැරට්' ආරම්භ වන්නේ 'ක' ශබ්දයෙනි."
  },
  {
    id: 'G3_C1_003',
    category: 'C1',
    competency: 'Missing Letter Assembly',
    difficulty: 0.35,
    prompt: "'පා___ල' හිස්තැනට නිවැරදි අකුර යොදා වචනය සම්පූර්ණ කරන්න.",
    options: ['ස', 'ක', 'ම', 'ද'],
    answer: 'ස',
    audioPrompt: 'පාසල වචනය සම්පූර්ණ කිරීමට අකුර තෝරන්න.',
    explanation: "'පාසල' යනු ඉගෙනුම ලබන ස්ථානයයි."
  },
  {
    id: 'G3_C1_004',
    category: 'C1',
    competency: 'Vowel Sign Recognition',
    difficulty: 0.45,
    prompt: "'කූඩුව' යන වචනයේ යෙදී ඇති පිල්ලම කුමක්ද?",
    options: ['දීර්ඝ පාපිල්ල', 'කොඩිය', 'ඇලපිල්ල', 'ඉස්පිල්ල'],
    answer: 'දීර්ඝ පාපිල්ල',
    audioPrompt: 'කූඩුව වචනයේ යෙදී ඇති පිල්ලම තෝරන්න.',
    explanation: "'කූ' අකුරේ යෙදී ඇත්තේ දීර්ඝ පාපිල්ලයි."
  },
  {
    id: 'G3_C1_005',
    category: 'C1',
    competency: 'Letter Sound Discrimination',
    difficulty: 0.55,
    prompt: "පහත වචන අතරින් 'ම' ශබ්දයෙන් ආරම්භ වන වචනය කුමක්ද?",
    options: ['මල', 'ගස', 'පොත', 'අලියා'],
    answer: 'මල',
    audioPrompt: 'ම ශබ්දයෙන් පටන් ගන්නා වචනය තෝරන්න.',
    explanation: "'මල' ආරම්භ වන්නේ 'ම' අකුරෙනි."
  },
  {
    id: 'G3_C1_006',
    category: 'C1',
    competency: 'Pillam Application',
    difficulty: 0.65,
    prompt: "'ගස' යන වචනයට ඉස්පිල්ල සහ ඇලපිල්ල යෙදූ විට ලැබෙන්නේ කුමක්ද?",
    options: ['ගීතා', 'ගස', 'ගෝල', 'ගැස'],
    answer: 'ගීතා',
    audioPrompt: 'පිල්ලම් යෙදූ වචනය තෝරන්න.',
    explanation: "'ග' අකුරට දීර්ඝ ඉස්පිල්ල හා 'ත' අකුරට ඇලපිල්ල යෙදූ විට 'ගීතා' වේ."
  },
  {
    id: 'G3_C1_007',
    category: 'C1',
    competency: 'Word Construction',
    difficulty: 0.7,
    prompt: "අකුරු ගළපා වචනය සාදන්න: (වි + දු + හ + ල)",
    options: ['විදුහල', 'විහදුල', 'හලවිදු', 'දුහලවි'],
    answer: 'විදුහල',
    audioPrompt: 'අකුරු ගළපා සෑදෙන වචනය තෝරන්න.',
    explanation: "අකුරු නිවැරදි පිළිවෙළට තැබූ විට 'විදුහල' සෑදේ."
  },
  {
    id: 'G3_C1_008',
    category: 'C1',
    competency: 'Phonetic Differentiation',
    difficulty: 0.75,
    prompt: "'පවන', 'පෑන', 'පොත' යන වචනවල මුල් අකුර කුමක්ද?",
    options: ['ප', 'බ', 'ම', 'ව'],
    answer: 'ප',
    audioPrompt: 'මුල් අකුර තෝරන්න.',
    explanation: "සියලු වචන 'ප' ශබ්දයෙන් ඇරඹේ."
  },
  {
    id: 'G3_C1_009',
    category: 'C1',
    competency: 'Dotted Tracing Spelling',
    difficulty: 0.8,
    prompt: "'පු___තකාලය' හිස්තැනට සුදුසු අක්ෂරය කුමක්ද?",
    options: ['ස්', 'ත්', 'න්', 'ර්'],
    answer: 'ස්',
    audioPrompt: 'පුස්තකාලය හිස්තැනට එන අකුර තෝරන්න.',
    explanation: "'පුස්තකාලය' නිවැරදි අක්ෂර වින්‍යාසය වේ."
  },
  {
    id: 'G3_C1_010',
    category: 'C1',
    competency: 'Advanced Pillam Identification',
    difficulty: 0.85,
    prompt: "'කෙත' යන වචනයේ 'කෙ' අකුරෙහි යෙදී ඇත්තේ කුමන පිල්ලමද?",
    options: ['කොම්බුව', 'ඇලපිල්ල', 'පාපිල්ල', 'ඇදපිල්ල'],
    answer: 'කොම්බුව',
    audioPrompt: 'කෙ අකුරේ පිල්ලම කුමක්ද?',
    explanation: "'කෙ' අකුරේ යෙදී ඇත්තේ කොම්බුවයි."
  },

  // ── CATEGORY 2 (C2): නාම පද හා යුගල පද ──
  {
    id: 'G3_C2_001',
    category: 'C2',
    competency: 'Gender Classification',
    difficulty: 0.2,
    prompt: "'තාත්තා' යන්නෙහි ස්ත්‍රී ලිංග පදය කුමක්ද?",
    options: ['අම්මා', 'නංගී', 'අක්කා', 'දුව'],
    answer: 'අම්මා',
    audioPrompt: 'තාත්තාගේ ගැහැනු පදය තෝරන්න.',
    explanation: "'තාත්තා' පුරුෂ ලිංග වන අතර 'අම්මා' ස්ත්‍රී ලිංග වේ."
  },
  {
    id: 'G3_C2_002',
    category: 'C2',
    competency: 'Word Pairing',
    difficulty: 0.3,
    prompt: "'ගස්' සමඟ යෙදෙන සුදුසු යුගල පදය කුමක්ද?",
    options: ['වැල්', 'හෙල්', 'දොරවල්', 'කොළ'],
    answer: 'වැල්',
    audioPrompt: 'ගස් සමඟ එන යුගල පදය තෝරන්න.',
    explanation: "'ගස්-වැල්' යනු සම්මත යුගල පදයයි."
  },
  {
    id: 'G3_C2_003',
    category: 'C2',
    competency: 'Living vs Non-Living Nouns',
    difficulty: 0.4,
    prompt: "පහත සඳහන් දෑ අතුරින් ප්‍රාණවාචී (පණ ඇති) නාම පදය කුමක්ද?",
    options: ['හාවා', 'පුටුව', 'පොත', 'මේසය'],
    answer: 'හාවා',
    audioPrompt: 'පණ ඇති නාම පදය තෝරන්න.',
    explanation: "'හාවා' සතෙකු බැවින් ප්‍රාණවාචී වේ."
  },
  {
    id: 'G3_C2_004',
    category: 'C2',
    competency: 'Animal Gender Pairing',
    difficulty: 0.5,
    prompt: "'ගිරවා' යන පක්ෂියාගේ ස්ත්‍රී ලිංග පදය කුමක්ද?",
    options: ['ගිරවිය', 'කිකිළිය', 'බැළලිය', 'දෙන'],
    answer: 'ගිරවිය',
    audioPrompt: 'ගිරවාගේ ගැහැනු පදය කුමක්ද?',
    explanation: "'ගිරවා' පිරිමි සතා වන අතර 'ගිරවිය' ගැහැනු සතාය."
  },
  {
    id: 'G3_C2_005',
    category: 'C2',
    competency: 'Word Pairs Recognition',
    difficulty: 0.6,
    prompt: "'කඳු' සමඟ යෙදෙන සම්මත යුගල පදය තෝරන්න.",
    options: ['හෙල්', 'වැල්', 'වතු', 'පාරවල්'],
    answer: 'හෙල්',
    audioPrompt: 'කඳු සමඟ එන යුගල පදය තෝරන්න.',
    explanation: "'කඳු-හෙල්' සම්මත යුගල පදයකි."
  },
  {
    id: 'G3_C2_006',
    category: 'C2',
    competency: 'Non-Living Noun Classification',
    difficulty: 0.65,
    prompt: "පහත දැක්වෙන දේ අතරින් අප්‍රාණවාචී (පණ නැති) නාම පදය කුමක්ද?",
    options: ['පැන්සල', 'ළමයා', 'ගුරුවරයා', 'ලේනා'],
    answer: 'පැන්සල',
    audioPrompt: 'පණ නැති නාම පදය තෝරන්න.',
    explanation: "'පැන්සල' අප්‍රාණවාචී ද්‍රව්‍යයකි."
  },
  {
    id: 'G3_C2_007',
    category: 'C2',
    competency: 'Royal Gender Pairing',
    difficulty: 0.7,
    prompt: "'රජතුමා' යන්නෙහි ස්ත්‍රී ලිංග පදය කුමක්ද?",
    options: ['රැජින', 'කුමරිය', 'මනාලිය', 'යෙහෙළිය'],
    answer: 'රැජින',
    audioPrompt: 'රජතුමාගේ ස්ත්‍රී පදය තෝරන්න.',
    explanation: "'රජතුමා' සඳහා 'රැජින' (බිසව) යෙදේ."
  },
  {
    id: 'G3_C2_008',
    category: 'C2',
    competency: 'Everyday Word Pairs',
    difficulty: 0.75,
    prompt: "'කෑම' සමඟ යෙදෙන යුගල පදය කුමක්ද?",
    options: ['බීම', 'රස', 'කැමති', 'පිසීම'],
    answer: 'බීම',
    audioPrompt: 'කෑම සමඟ එන යුගල පදය තෝරන්න.',
    explanation: "'කෑම-බීම' ආහාර පාන දැක්වෙන යුගල පදයයි."
  },
  {
    id: 'G3_C2_009',
    category: 'C2',
    competency: 'Gender Differentiation',
    difficulty: 0.8,
    prompt: "'සිංහයා' යන්නෙහි ස්ත්‍රී ලිංග පදය තෝරන්න.",
    options: ['සිංහදෙන', 'ව්‍යාඝ්‍රිය', 'ඇතිනි', 'වෙළඹ'],
    answer: 'සිංහදෙන',
    audioPrompt: 'සිංහයාගේ ස්ත්‍රී පදය තෝරන්න.',
    explanation: "ගැහැනු සිංහයා 'සිංහදෙන' නම් වේ."
  },
  {
    id: 'G3_C2_010',
    category: 'C2',
    competency: 'Home & Environment Word Pairs',
    difficulty: 0.85,
    prompt: "'ගෙවල්' සමඟ යෙදෙන නිවැරදි යුගල පදය කුමක්ද?",
    options: ['දොරවල්', 'මිදුල්', 'වතු', 'පාරවල්'],
    answer: 'දොරවල්',
    audioPrompt: 'ගෙවල් සමඟ එන යුගල පදය තෝරන්න.',
    explanation: "'ගෙවල්-දොරවල්' නිවැරදි යුගල පදයයි."
  },

  // ── CATEGORY 3 (C3): සමාන හා විරුද්ධ පද ──
  {
    id: 'G3_C3_001',
    category: 'C3',
    competency: 'Synonym Identification',
    difficulty: 0.2,
    prompt: "'මව' යන වචනයට සමාන අර්ථය දෙන පදය කුමක්ද?",
    options: ['අම්මා', 'පියා', 'මිතුරා', 'සහෝදරයා'],
    answer: 'අම්මා',
    audioPrompt: 'මව යන්නට සමාන වචනය තෝරන්න.',
    explanation: "'මව' සහ 'අම්මා' සමාන පද වේ."
  },
  {
    id: 'G3_C3_002',
    category: 'C3',
    competency: 'Antonym Identification',
    difficulty: 0.25,
    prompt: "'උඩ' යන්නෙහි විරුද්ධ පදය කුමක්ද?",
    options: ['යට', 'ළඟ', 'දිග', 'ඈත'],
    answer: 'යට',
    audioPrompt: 'උඩ විරුද්ධ පදය තෝරන්න.',
    explanation: "'උඩ' හි විරුද්ධ පදය 'යට' වේ."
  },
  {
    id: 'G3_C3_003',
    category: 'C3',
    competency: 'Nature Synonyms',
    difficulty: 0.35,
    prompt: "'ජලය' යන වචනයෙහි සමාන පදය කුමක්ද?",
    options: ['වතුර', 'ගින්න', 'පස', 'සුළඟ'],
    answer: 'වතුර',
    audioPrompt: 'ජලය සමාන පදය තෝරන්න.',
    explanation: "'ජලය' යනු 'වතුර' වේ."
  },
  {
    id: 'G3_C3_004',
    category: 'C3',
    competency: 'Size Antonyms',
    difficulty: 0.45,
    prompt: "'ලොකු' යන්නෙහි නිවැරදි විරුද්ධ පදය කුමක්ද?",
    options: ['පොඩි (කුඩා)', 'උස', 'මහත', 'දිග'],
    answer: 'පොඩි (කුඩා)',
    audioPrompt: 'ලොකු විරුද්ධ පදය තෝරන්න.',
    explanation: "'ලොකු ↔ කුඩා' වේ."
  },
  {
    id: 'G3_C3_005',
    category: 'C3',
    competency: 'Environment Synonyms',
    difficulty: 0.55,
    prompt: "'ගස' යන්න සඳහා යෙදෙන සමාන පදය තෝරන්න.",
    options: ['වෘක්ෂය', 'මල', 'පලතුර', 'පත්‍රය'],
    answer: 'වෘක්ෂය',
    audioPrompt: 'ගස සමාන පදය තෝරන්න.',
    explanation: "'ගස = වෘක්ෂය' වේ."
  },
  {
    id: 'G3_C3_006',
    category: 'C3',
    competency: 'Cleanliness Antonyms',
    difficulty: 0.65,
    prompt: "'පිරිසිදු' යන වචනයේ විරුද්ධ පදය කුමක්ද?",
    options: ['අපිරිසිදු', 'ලස්සන', 'අලුත්', 'සුවඳ'],
    answer: 'අපිරිසිදු',
    audioPrompt: 'පිරිසිදු විරුද්ධ පදය තෝරන්න.',
    explanation: "'පිරිසිදු ↔ අපිරිසිදු' වේ."
  },
  {
    id: 'G3_C3_007',
    category: 'C3',
    competency: 'Sky & Nature Synonyms',
    difficulty: 0.7,
    prompt: "'අහස' යන වචනයට ගැළපෙන සමාන පදය කුමක්ද?",
    options: ['ගුවන', 'මුහුද', 'පොළොව', 'වැව'],
    answer: 'ගුවන',
    audioPrompt: 'අහස සමාන පදය තෝරන්න.',
    explanation: "'අහස = ගුවන (නබෝ)' වේ."
  },
  {
    id: 'G3_C3_008',
    category: 'C3',
    competency: 'Distance Antonyms',
    difficulty: 0.75,
    prompt: "'දිග' සහ 'ළඟ' යන වචනවල විරුද්ධ පද පිළිවෙළින් මොනවාද?",
    options: ['කෙටි - දුර', 'උස - මිටි', 'ලොකු - පොඩි', 'මහත - කෙට්ටු'],
    answer: 'කෙටි - දුර',
    audioPrompt: 'දිග සහ ළඟ විරුද්ධ පද තෝරන්න.',
    explanation: "'දිග ↔ කෙටි' සහ 'ළඟ ↔ දුර' වේ."
  },
  {
    id: 'G3_C3_009',
    category: 'C3',
    competency: 'Bird & Animal Synonyms',
    difficulty: 0.8,
    prompt: "'කුරුල්ලා' හඳුන්වන වෙනත් සමාන පදය කුමක්ද?",
    options: ['පක්ෂියා', 'මුවා', 'මසුන්', 'අලියා'],
    answer: 'පක්ෂියා',
    audioPrompt: 'කුරුල්ලා සමාන පදය තෝරන්න.',
    explanation: "'කුරුල්ලා = පක්ෂියා (ද්විජ)' වේ."
  },
  {
    id: 'G3_C3_010',
    category: 'C3',
    competency: 'Temperature Antonyms',
    difficulty: 0.85,
    prompt: "'උණුසුම්' යන්නෙහි නිවැරදි විරුද්ධ පදය කුමක්ද?",
    options: ['සීතල', 'තෙත්', 'වියළි', 'ඝන'],
    answer: 'සීතල',
    audioPrompt: 'උණුසුම් විරුද්ධ පදය තෝරන්න.',
    explanation: "'උණුසුම් ↔ සීතල' වේ."
  },

  // ── CATEGORY 4 (C4): ව්‍යාකරණ හා වාක්‍ය ──
  {
    id: 'G3_C4_001',
    category: 'C4',
    competency: 'First Person Singular Concord',
    difficulty: 0.2,
    prompt: "“මම පාසලට ______.” හිස්තැනට නිවැරදි ආඛ්‍යාතය තෝරන්න.",
    options: ['යමි', 'යයි', 'යති', 'යමු'],
    answer: 'යමි',
    audioPrompt: 'මම සමඟ එන නිවැරදි ආඛ්‍යාතය තෝරන්න.',
    explanation: "'මම' කර්තෘට ආඛ්‍යාතය 'යමි' වේ."
  },
  {
    id: 'G3_C4_002',
    category: 'C4',
    competency: 'Third Person Singular Concord',
    difficulty: 0.3,
    prompt: "“ළමයා පොත ______.” හිස්තැනට ගැළපෙන පදය තෝරන්න.",
    options: ['කියවයි', 'කියවමි', 'කියවති', 'කියවමු'],
    answer: 'කියවයි',
    audioPrompt: 'ළමයා සමඟ එන ආඛ්‍යාතය තෝරන්න.',
    explanation: "'ළමයා' ඒක වචන බැවින් 'කියවයි' යෙදේ."
  },
  {
    id: 'G3_C4_003',
    category: 'C4',
    competency: 'Third Person Plural Concord',
    difficulty: 0.4,
    prompt: "“ළමයි මිදුලේ සෙල්ලම් ______.” හිස්තැනට සුදුසු පදය කුමක්ද?",
    options: ['කරති', 'කරයි', 'කරමි', 'කරමු'],
    answer: 'කරති',
    audioPrompt: 'ළමයි සමඟ එන ආඛ්‍යාතය තෝරන්න.',
    explanation: "'ළමයි' බහු වචන බැවින් 'කරති' යෙදේ."
  },
  {
    id: 'G3_C4_004',
    category: 'C4',
    competency: 'First Person Plural Concord',
    difficulty: 0.5,
    prompt: "“අපි උදෑසන පාසල් ______.” හිස්තැනට නිවැරදි පදය කුමක්ද?",
    options: ['යමු', 'යමි', 'යයි', 'යති'],
    answer: 'යමු',
    audioPrompt: 'අපි සමඟ එන ආඛ්‍යාතය තෝරන්න.',
    explanation: "'අපි' කර්තෘට ආඛ්‍යාතය 'යමු' වේ."
  },
  {
    id: 'G3_C4_005',
    category: 'C4',
    competency: 'Past Tense Recognition',
    difficulty: 0.6,
    prompt: "“අපි ඊයේ සෙල්ලම් කළෙමු.” මෙම වාක්‍යය අයත් වන්නේ කුමන කාලයටද?",
    options: ['අතීත කාලය', 'වර්‍තමාන කාලය', 'අනාගත කාලය', 'කිසිවක් නොවේ'],
    answer: 'අතීත කාලය',
    audioPrompt: 'වාක්‍යයේ කාලය තෝරන්න.',
    explanation: "ඊයේ සිදු වූ ක්‍රියාවක් බැවින් අතීත කාලය වේ."
  },
  {
    id: 'G3_C4_006',
    category: 'C4',
    competency: 'Sentence Ordering',
    difficulty: 0.65,
    prompt: "වචන පිළිවෙළට සකස් කර නිවැරදි වාක්‍යය තෝරන්න: (කයි / බත් / පුතා)",
    options: ['පුතා බත් කයි.', 'බත් කයි පුතා.', 'කයි පුතා බත්.', 'පුතා කයි බත්.'],
    answer: 'පුතා බත් කයි.',
    audioPrompt: 'නිවැරදි වාක්‍යය තෝරන්න.',
    explanation: "උක්තය, කර්මය, ආඛ්‍යාතය පිළිවෙළට 'පුතා බත් කයි' වේ."
  },
  {
    id: 'G3_C4_007',
    category: 'C4',
    competency: 'Plural Subject-Verb Agreement',
    difficulty: 0.7,
    prompt: "“කුරුල්ලෝ අහසේ ______.” හිස්තැනට සුදුසු ක්‍රියාපදය තෝරන්න.",
    options: ['පියාඹති', 'පියාඹයි', 'පියාඹමි', 'පියාඹමු'],
    answer: 'පියාඹති',
    audioPrompt: 'කුරුල්ලෝ සමඟ එන ක්‍රියාව තෝරන්න.',
    explanation: "'කුරුල්ලෝ' බහු වචනයට 'පියාඹති' යෙදේ."
  },
  {
    id: 'G3_C4_008',
    category: 'C4',
    competency: 'Past Tense Conversion',
    difficulty: 0.75,
    prompt: "“ඔහු පාසලට යයි.” අතීත කාලයට හැරවූ විට ලැබෙන්නේ කුමක්ද?",
    options: ['ඔහු පාසලට ගියේය.', 'ඔහු පාසලට යන්නේය.', 'ඔහු පාසලට යමි.', 'ඔහු පාසලට යති.'],
    answer: 'ඔහු පාසලට ගියේය.',
    audioPrompt: 'අතීත කාල වාක්‍යය තෝරන්න.',
    explanation: "'යයි' හි අතීත කාල රූපය 'ගියේය' වේ."
  },
  {
    id: 'G3_C4_009',
    category: 'C4',
    competency: 'Error Correction in Sentence',
    difficulty: 0.8,
    prompt: "වැරදි වාක්‍යය නිවැරදි කරන්න: “බල්ලා අහසේ පියාඹයි.”",
    options: ['බල්ලා මිදුලේ දුවයි.', 'බල්ලා අහසේ සිටී.', 'බල්ලා පියාඹති.', 'අහසේ බල්ලා යයි.'],
    answer: 'බල්ලා මිදුලේ දුවයි.',
    audioPrompt: 'නිවැරදි අර්ථවත් වාක්‍යය තෝරන්න.',
    explanation: "බල්ලන්ට පියාඹිය නොහැකි බැවින් 'බල්ලා මිදුලේ දුවයි' නිවැරදිය."
  },
  {
    id: 'G3_C4_010',
    category: 'C4',
    competency: 'Complex Sentence Synthesis',
    difficulty: 0.85,
    prompt: "“මම චිත්‍රයක් ______.” හිස්තැනට සුදුසු නිවැරදි ක්‍රියාපදය තෝරන්න.",
    options: ['අඳිමි', 'අඳියි', 'අඳිති', 'අඳිමු'],
    answer: 'අඳිමි',
    audioPrompt: 'මම සඳහා ක්‍රියාපදය තෝරන්න.',
    explanation: "'මම' කර්තෘට 'අඳිමි' යෙදේ."
  },

  // ── CATEGORY 5 (C5): කියවීම හා තේරවිලි ──
  {
    id: 'G3_C5_001',
    category: 'C5',
    competency: 'Punctuation Mark Identification',
    difficulty: 0.2,
    prompt: "“ඔබේ නම කුමක්ද___” වාක්‍යය අවසානයට සුදුසු විරාම ලකුණ කුමක්ද?",
    options: ['?', '.', '!', ','],
    answer: '?',
    audioPrompt: 'ප්‍රශ්නයක් අවසානයට එන ලකුණ තෝරන්න.',
    explanation: "ප්‍රශ්න විමසන වාක්‍යයකට ප්‍රශ්නාර්ථ ලකුණ (?) යෙදේ."
  },
  {
    id: 'G3_C5_002',
    category: 'C5',
    competency: 'Object Riddle',
    difficulty: 0.3,
    prompt: "තේරවිල්ල විසඳන්න: “සුදු පාටයි, උස ම උසයි හිස දල්වයි අඳුර නසයි.”",
    options: ['ඉටිපන්දම', 'බෝලය', 'කුඩය', 'පොත'],
    answer: 'ඉටිපන්දම',
    audioPrompt: 'තේරවිල්ලට පිළිතුර තෝරන්න.',
    explanation: "දැල්වූ විට අඳුර නසන්නේ ඉටිපන්දමයි."
  },
  {
    id: 'G3_C5_003',
    category: 'C5',
    competency: 'Full Stop Punctuation',
    difficulty: 0.4,
    prompt: "“මම පොතක් කියවමි___” සාමාන්‍ය වාක්‍යයක් අවසානයට තබන ලකුණ කුමක්ද?",
    options: ['. (තිත)', '? (ප්‍රශ්නාර්ථය)', '! (විස්මයාර්ථය)', ', (කොමාව)'],
    answer: '. (තිත)',
    audioPrompt: 'සාමාන්‍ය වාක්‍යයකට තබන ලකුණ තෝරන්න.',
    explanation: "වාක්‍යයක් අවසන් වූ විට තිත (.) තබයි."
  },
  {
    id: 'G3_C5_004',
    category: 'C5',
    competency: 'Animal Riddle',
    difficulty: 0.5,
    prompt: "තේරවිල්ල විසඳන්න: “උස ම උසයි බෙල්ල දිගයි ගස්වල දලු හිටගෙන කයි.”",
    options: ['ජිරාෆ්', 'හඳ', 'බෝලය', 'හාවා'],
    answer: 'ජිරාෆ්',
    audioPrompt: 'තේරවිල්ලේ සත්වයා තෝරන්න.',
    explanation: "දිගු බෙල්ලකින් ගස්වල දලු කන්නේ ජිරාෆ්ය."
  },
  {
    id: 'G3_C5_005',
    category: 'C5',
    competency: 'Mini Passage Reading Fact Retrieval',
    difficulty: 0.55,
    prompt: "“මලිත්ට රතු බෝලයක් තිබුණි. ඔහු එය මිදුලේ සෙල්ලම් කිරීමට ගත්තේය.” මලිත්ගේ බෝලයේ පාට කුමක්ද?",
    options: ['රතු', 'නිල්', 'කහ', 'කොළ'],
    answer: 'රතු',
    audioPrompt: 'බෝලයේ පාට තෝරන්න.',
    explanation: "පාඨයේ සඳහන් වන්නේ රතු බෝලයක් බවයි."
  },
  {
    id: 'G3_C5_006',
    category: 'C5',
    competency: 'Sky Riddle',
    difficulty: 0.65,
    prompt: "තේරවිල්ල විසඳන්න: “රෑ අහසේ දිලිසෙන්නේ ලොවට එළිය මම දෙන්නේ.”",
    options: ['හඳ', 'කුඩය', 'ඉටිපන්දම', 'තරුව'],
    answer: 'හඳ',
    audioPrompt: 'තේරවිල්ලට ගැළපෙන පිළිතුර තෝරන්න.',
    explanation: "රාත්‍රියට එළිය දෙන්නේ හඳ (චන්ද්‍රයා) වේ."
  },
  {
    id: 'G3_C5_007',
    category: 'C5',
    competency: 'Everyday Object Riddle',
    difficulty: 0.7,
    prompt: "තේරවිල්ල විසඳන්න: “අව්වට වැස්සට දෙකටම මාව උඩින් අරගෙන යයි.”",
    options: ['කුඩය', 'හඳ', 'බෝලය', 'සපත්තු'],
    answer: 'කුඩය',
    audioPrompt: 'තේරවිල්ල විසඳන්න.',
    explanation: "අව්වෙන් සහ වැස්සෙන් ආරක්ෂාවට කුඩය ගෙන යයි."
  },
  {
    id: 'G3_C5_008',
    category: 'C5',
    competency: 'Mini Passage Action Comprehension',
    difficulty: 0.75,
    prompt: "“අමා උදෑසන මල් වත්තට ගියාය. ඇය ලස්සන රෝස මලක් දැක සතුටු වූවාය.” අමා දුටු මල කුමක්ද?",
    options: ['රෝස මල', 'නෙළුම් මල', 'ඕකිඩ් මල', 'සූරියකාන්ත මල'],
    answer: 'රෝස මල',
    audioPrompt: 'අමා දුටු මල තෝරන්න.',
    explanation: "පාඨයේ සඳහන් පරිදි අමා දුටුවේ රෝස මලකි."
  },
  {
    id: 'G3_C5_009',
    category: 'C5',
    competency: 'Exclamation Punctuation',
    difficulty: 0.8,
    prompt: "“වාව්! මේ මල හරිම ලස්සනයි___” හිස්තැනට සුදුසු ලකුණ කුමක්ද?",
    options: ['!', '.', '?', ','],
    answer: '!',
    audioPrompt: 'විස්මයට යොදන ලකුණ තෝරන්න.',
    explanation: "පුදුමය හා සතුට දැක්වීමට විස්මයාදී ලකුණ (!) යොදයි."
  },
  {
    id: 'G3_C5_010',
    category: 'C5',
    competency: 'Causal Reason Comprehension',
    difficulty: 0.85,
    prompt: "“අපේ දෑත්වල නොපෙනෙන විෂබීජ රැඳී තිබිය හැක. එබැවින් ආහාර ගැනීමට පෙර සබන් යොදා අත් සේදීමෙන් නිරෝගීව සිටිය හැක.” අප ආහාර ගැනීමට පෙර අත් සෝදන්නේ කුමන හේතුවක් නිසාද?",
    options: ['පිරිසිදුව හා නිරෝගීව සිටීමට', 'නිදා ගැනීමට', 'දුවන්නට', 'සෙල්ලම් කිරීමට'],
    answer: 'පිරිසිදුව හා නිරෝගීව සිටීමට',
    audioPrompt: 'අත් සේදීමට හේතුව තෝරන්න.',
    explanation: "විෂබීජවලින් මිදී නිරෝගීව සිටීමට අත් සෝදයි."
  }
];

// ── REMEDIAL EXERCISE BANK FOR GRADE 3 ──
export const GRADE3_REMEDIAL_EXERCISE_BANK = {
  C1: [
    {
      id: 'REM_G3_C1_01',
      title: 'අක්ෂර හා පිල්ලම් පුහුණුව (Pillam Practice)',
      sub: 'පිල්ලම් යෙදූ අකුරු හා වචන නිවැරදිව තෝරන්න',
      difficulty: 'Easy',
      targetSkill: 'Pillam identification',
      items: [
        { q: "'ම' අකුරට ඇදපිල්ල යෙදූ විට?", options: ['මැ', 'මා', 'මු'], ans: 'මැ' },
        { q: "'ක' අකුරට දීර්ඝ ඉස්පිල්ල යෙදූ විට?", options: ['කී', 'කි', 'කු'], ans: 'කී' },
        { q: "'ග' අකුරට ඇලපිල්ල යෙදූ විට?", options: ['ගා', 'ගැ', 'ගි'], ans: 'ගා' },
        { q: "'ද' අකුරට පාපිල්ල යෙදූ විට?", options: ['දු', 'දූ', 'දි'], ans: 'දු' },
        { q: "'ත' අකුරට කොම්බුව යෙදූ විට?", options: ['තෙ', 'තො', 'තා'], ans: 'තෙ' }
      ]
    },
    {
      id: 'REM_G3_C1_02',
      title: 'ආරම්භක ශබ්ද හඳුනාගැනීම (Beginning Sounds)',
      sub: 'වචනවල මුල් ශබ්දය නිවැරදිව තෝරන්න',
      difficulty: 'Medium',
      targetSkill: 'Phonological awareness',
      items: [
        { q: "'කැරට්' ආරම්භ වන ශබ්දය?", options: ['ක', 'ග', 'ප'], ans: 'ක' },
        { q: "'ගස' ආරම්භ වන ශබ්දය?", options: ['ග', 'ක', 'ද'], ans: 'ග' },
        { q: "'පොත' ආරම්භ වන ශබ්දය?", options: ['ප', 'බ', 'ම'], ans: 'ප' },
        { q: "'මල' ආරම්භ වන ශබ්දය?", options: ['ම', 'න', 'ප'], ans: 'ම' },
        { q: "'අලියා' ආරම්භ වන ශබ්දය?", options: ['අ', 'ආ', 'ඇ'], ans: 'අ' }
      ]
    },
    {
      id: 'REM_G3_C1_03',
      title: 'අක්ෂර ගළපා වචන සැකසීම (Word Assembly)',
      sub: 'අකුරු එකතු කර නිවැරදි වචනය සාදන්න',
      difficulty: 'Hard',
      targetSkill: 'Word synthesis',
      items: [
        { q: "පා + ස + ල = ?", options: ['පාසල', 'සපාපල', 'ලසපා'], ans: 'පාසල' },
        { q: "වි + දු + හ + ල = ?", options: ['විදුහල', 'හලවිදු', 'දුහලවි'], ans: 'විදුහල' },
        { q: "පු + ස් + ත + කා + ල + ය = ?", options: ['පුස්තකාලය', 'කාලයපුස්ත', 'පුතස්කාලය'], ans: 'පුස්තකාලය' },
        { q: "කු + රු + ල් + ලා = ?", options: ['කුරුල්ලා', 'ල්ලාකුරු', 'රුකුල්ලා'], ans: 'කුරුල්ලා' },
        { q: "මි + තු + රා = ?", options: ['මිතුරා', 'රාමිතු', 'තුරාමි'], ans: 'මිතුරා' }
      ]
    }
  ],
  C2: [
    {
      id: 'REM_G3_C2_01',
      title: 'ස්ත්‍රී හා පුරුෂ ලිංග (Gender Pairs)',
      sub: 'ස්ත්‍රී සහ පුරුෂ පද වෙන්කර හඳුනාගනිමු',
      difficulty: 'Easy',
      targetSkill: 'Gender classification',
      items: [
        { q: "'තාත්තා' ස්ත්‍රී පදය?", options: ['අම්මා', 'නංගි', 'දුව'], ans: 'අම්මා' },
        { q: "'ගිරවා' ගැහැනු පදය?", options: ['ගිරවිය', 'කිකිළිය', 'රැජින'], ans: 'ගිරවිය' },
        { q: "'රජතුමා' ස්ත්‍රී පදය?", options: ['රැජින', 'කුමරිය', 'මනාලිය'], ans: 'රැජින' },
        { q: "'කුකුළා' ගැහැනු සතා?", options: ['කිකිළි', 'දෙන', 'බැළලි'], ans: 'කිකිළි' },
        { q: "'පුතා' ස්ත්‍රී පදය?", options: ['දුව', 'අක්කා', 'නංගි'], ans: 'දුව' }
      ]
    },
    {
      id: 'REM_G3_C2_02',
      title: 'යුගල පද පුහුණුව (Word Pairs Practice)',
      sub: 'සම්මත යුගල පද නිවැරදිව ගළපන්න',
      difficulty: 'Medium',
      targetSkill: 'Word pairing',
      items: [
        { q: "'ගස්' සමඟ එන යුගල පදය?", options: ['වැල්', 'හෙල්', 'දොරවල්'], ans: 'වැල්' },
        { q: "'කඳු' සමඟ එන යුගල පදය?", options: ['හෙල්', 'වැල්', 'කොළ'], ans: 'හෙල්' },
        { q: "'කෑම' සමඟ එන යුගල පදය?", options: ['බීම', 'රස', 'කන්න'], ans: 'බීම' },
        { q: "'ගෙවල්' සමඟ එන යුගල පදය?", options: ['දොරවල්', 'මිදුල්', 'වතු'], ans: 'දොරවල්' },
        { q: "'අම්මා' සමඟ එන යුගල පදය?", options: ['තාත්තා', 'මාමා', 'පිය'], ans: 'තාත්තා' }
      ]
    },
    {
      id: 'REM_G3_C2_03',
      title: 'ප්‍රාණවාචී හා අප්‍රාණවාචී නාම (Noun Types)',
      sub: 'පණ ඇති සහ පණ නැති නාම පද වෙන්කරමු',
      difficulty: 'Hard',
      targetSkill: 'Noun categorization',
      items: [
        { q: "ප්‍රාණවාචී (පණ ඇති) පදය?", options: ['හාවා', 'පුටුව', 'පොත'], ans: 'හාවා' },
        { q: "අප්‍රාණවාචී (පණ නැති) පදය?", options: ['පැන්සල', 'ළමයා', 'ලේනා'], ans: 'පැන්සල' },
        { q: "ප්‍රාණවාචී පදය?", options: ['ගුරුවරයා', 'මේසය', 'පෑන'], ans: 'ගුරුවරයා' },
        { q: "අප්‍රාණවාචී පදය?", options: ['පොත', 'අලියා', 'මුවා'], ans: 'පොත' },
        { q: "ප්‍රාණවාචී පදය?", options: ['කුරුල්ලා', 'බෝලය', 'ගල'], ans: 'කුරුල්ලා' }
      ]
    }
  ],
  C3: [
    {
      id: 'REM_G3_C3_01',
      title: 'සමාන පද පුහුණුව (Synonyms Practice)',
      sub: 'එකම අර්ථය දෙන සමාන පද තෝරන්න',
      difficulty: 'Easy',
      targetSkill: 'Synonym matching',
      items: [
        { q: "'මව' සමාන පදය?", options: ['අම්මා', 'පියා', 'මිතුරා'], ans: 'අම්මා' },
        { q: "'ජලය' සමාන පදය?", options: ['වතුර', 'ගින්න', 'පස'], ans: 'වතුර' },
        { q: "'ගස' සමාන පදය?", options: ['වෘක්ෂය', 'මල', 'පලතුර'], ans: 'වෘක්ෂය' },
        { q: "'අහස' සමාන පදය?", options: ['ගුවන', 'මුහුද', 'පොළොව'], ans: 'ගුවන' },
        { q: "'කුරුල්ලා' සමාන පදය?", options: ['පක්ෂියා', 'මුවා', 'මාළුවා'], ans: 'පක්ෂියා' }
      ]
    },
    {
      id: 'REM_G3_C3_02',
      title: 'විරුද්ධ පද යුගල (Antonyms Practice)',
      sub: 'ප්‍රතිවිරුද්ධ අර්ථ ඇති පද හඳුනාගනිමු',
      difficulty: 'Medium',
      targetSkill: 'Antonym matching',
      items: [
        { q: "'උඩ' විරුද්ධ පදය?", options: ['යට', 'ළඟ', 'දිග'], ans: 'යට' },
        { q: "'ලොකු' විරුද්ධ පදය?", options: ['පොඩි', 'උස', 'මහත'], ans: 'පොඩි' },
        { q: "'පිරිසිදු' විරුද්ධ පදය?", options: ['අපිරිසිදු', 'ලස්සන', 'අලුත්'], ans: 'අපිරිසිදු' },
        { q: "'දිග' විරුද්ධ පදය?", options: ['කෙටි', 'ළඟ', 'පළල්'], ans: 'කෙටි' },
        { q: "'උණුසුම්' විරුද්ධ පදය?", options: ['සීතල', 'තෙත්', 'වියළි'], ans: 'සීතල' }
      ]
    },
    {
      id: 'REM_G3_C3_03',
      title: 'උසස් සමාන හා විරුද්ධ පද (Advanced Vocabulary)',
      sub: 'සන්දර්භානුකූල පද ගළපන්න',
      difficulty: 'Hard',
      targetSkill: 'Advanced lexical pairs',
      items: [
        { q: "'සතුට' සමාන පදය?", options: ['ප්‍රීතිය', 'දුක', 'බිය'], ans: 'ප්‍රීතිය' },
        { q: "'සතුට' විරුද්ධ පදය?", options: ['දුක', 'සිනහව', 'සෙල්ලම'], ans: 'දුක' },
        { q: "'ළඟ' විරුද්ධ පදය?", options: ['දුර', 'කෙටි', 'පටු'], ans: 'දුර' },
        { q: "'මුහුද' සමාන පදය?", options: ['සයුර', 'කන්ද', 'වැව'], ans: 'සයුර' },
        { q: "'අලුත්' විරුද්ධ පදය?", options: ['පරණ', 'නව', 'සුන්දර'], ans: 'පරණ' }
      ]
    }
  ],
  C4: [
    {
      id: 'REM_G3_C4_01',
      title: 'උක්ත-ආඛ්‍යාත ගැලපීම (Subject-Verb Concord)',
      sub: 'කර්තෘට ගැළපෙන ක්‍රියාපදය තෝරන්න',
      difficulty: 'Easy',
      targetSkill: 'Subject-Verb agreement',
      items: [
        { q: "“මම පාසලට ______.”", options: ['යමි', 'යයි', 'යති'], ans: 'යමි' },
        { q: "“ඔහු පොත ______.”", options: ['කියවයි', 'කියවමි', 'කියවති'], ans: 'කියවයි' },
        { q: "“ළමයි සෙල්ලම් ______.”", options: ['කරති', 'කරයි', 'කරමි'], ans: 'කරති' },
        { q: "“අපි පාසල් ______.”", options: ['යමු', 'යමි', 'යයි'], ans: 'යමු' },
        { q: "“කුරුල්ලෝ ______.”", options: ['පියාඹති', 'පියාඹයි', 'පියාඹමි'], ans: 'පියාඹති' }
      ]
    },
    {
      id: 'REM_G3_C4_02',
      title: 'කාලය හඳුනාගැනීම (Tenses Practice)',
      sub: 'අතීත හා වර්‍තමාන කාල වාක්‍ය වෙන්කරමු',
      difficulty: 'Medium',
      targetSkill: 'Tense recognition',
      items: [
        { q: "“අපි ඊයේ සෙල්ලම් කළෙමු.” කාලය කුමක්ද?", options: ['අතීත කාලය', 'වර්‍තමාන කාලය'], ans: 'අතීත කාලය' },
        { q: "“මම දැන් පොත කියවමි.” කාලය කුමක්ද?", options: ['වර්‍තමාන කාලය', 'අතීත කාලය'], ans: 'වර්‍තමාන කාලය' },
        { q: "“ඔහු ගෙදර ගියේය.” කාලය කුමක්ද?", options: ['අතීත කාලය', 'වර්‍තමාන කාලය'], ans: 'අතීත කාලය' },
        { q: "“ළමයි පාඩම් කරති.” කාලය කුමක්ද?", options: ['වර්‍තමාන කාලය', 'අතීත කාලය'], ans: 'වර්‍තමාන කාලය' },
        { q: "“අම්මා බත් ඉව්වාය.” කාලය කුමක්ද?", options: ['අතීත කාලය', 'වර්‍තමාන කාලය'], ans: 'අතීත කාලය' }
      ]
    },
    {
      id: 'REM_G3_C4_03',
      title: 'වාක්‍ය පිළිවෙළ හා නිර්මාණය (Sentence Structure)',
      sub: 'වචන පිළිවෙළට තබා අර්ථවත් වාක්‍ය සාදන්න',
      difficulty: 'Hard',
      targetSkill: 'Sentence composition',
      items: [
        { q: "(බත් / පුතා / කයි) නිවැරදි වාක්‍යය?", options: ['පුතා බත් කයි.', 'බත් කයි පුතා.'], ans: 'පුතා බත් කයි.' },
        { q: "(යයි / දරුවා / පාසලට) නිවැරදි වාක්‍යය?", options: ['දරුවා පාසලට යයි.', 'යයි පාසලට දරුවා.'], ans: 'දරුවා පාසලට යයි.' },
        { q: "(අඳිමි / චිත්‍රයක් / මම) නිවැරදි වාක්‍යය?", options: ['මම චිත්‍රයක් අඳිමි.', 'අඳිමි මම චිත්‍රයක්.'], ans: 'මම චිත්‍රයක් අඳිමි.' },
        { q: "(සෙල්ලම් කරති / ළමයි / මිදුලේ) නිවැරදි වාක්‍යය?", options: ['ළමයි මිදුලේ සෙල්ලම් කරති.', 'සෙල්ලම් කරති මිදුලේ ළමයි.'], ans: 'ළමයි මිදුලේ සෙල්ලම් කරති.' },
        { q: "(උදෑසන / යමු / පාසලට / අපි) නිවැරදි වාක්‍යය?", options: ['අපි උදෑසන පාසලට යමු.', 'පාසලට යමු අපි උදෑසන.'], ans: 'අපි උදෑසන පාසලට යමු.' }
      ]
    }
  ],
  C5: [
    {
      id: 'REM_G3_C5_01',
      title: 'සිංහල තේරවිලි විසඳමු (Riddle Solving)',
      sub: 'තේරවිල්ල කියවා නිවැරදි පිළිතුර සොයන්න',
      difficulty: 'Easy',
      targetSkill: 'Deductive riddle reasoning',
      items: [
        { q: "“සුදු පාටයි, උස ම උසයි හිස දල්වයි අඳුර නසයි.”", options: ['ඉටිපන්දම', 'බෝලය', 'කුඩය'], ans: 'ඉටිපන්දම' },
        { q: "“උස ම උසයි බෙල්ල දිගයි ගස්වල දලු හිටගෙන කයි.”", options: ['ජිරාෆ්', 'හඳ', 'හාවා'], ans: 'ජිරාෆ්' },
        { q: "“රෑ අහසේ දිලිසෙන්නේ ලොවට එළිය මම දෙන්නේ.”", options: ['හඳ', 'කුඩය', 'ගස'], ans: 'හඳ' },
        { q: "“දාරෙත් නැති මුලුත් නැති යන්නේ මම පෙරළි පෙරළි.”", options: ['බෝලය', 'ජිරාෆ්', 'පෙට්ටිය'], ans: 'බෝලය' },
        { q: "“අව්වට වැස්සට දෙකටම මාව උඩින් අරගෙන යයි.”", options: ['කුඩය', 'හඳ', 'සපත්තු'], ans: 'කුඩය' }
      ]
    },
    {
      id: 'REM_G3_C5_02',
      title: 'කෙටි පාඨ කියවීම හා අවබෝධය (Short Passages)',
      sub: 'සරල ඡේද කියවා තොරතුරු උකහා ගනිමු',
      difficulty: 'Medium',
      targetSkill: 'Text comprehension',
      items: [
        {
          passage: 'මලිත්ට රතු බෝලයක් තිබුණි. ඔහු එය මිදුලේ සෙල්ලම් කිරීමට ගත්තේය.',
          q: 'බෝලයේ පාට කුමක්ද?',
          options: ['රතු', 'නිල්', 'කහ'],
          ans: 'රතු'
        },
        {
          passage: 'මලිත්ට රතු බෝලයක් තිබුණි. ඔහු එය මිදුලේ සෙල්ලම් කිරීමට ගත්තේය.',
          q: 'මලිත් සෙල්ලම් කළේ කොහේද?',
          options: ['මිදුලේ', 'කාමරයේ', 'පාරේ'],
          ans: 'මිදුලේ'
        },
        {
          passage: 'අමා උදෑසන මල් වත්තට ගියාය. ඇය ලස්සන රෝස මලක් දැක සතුටු වූවාය.',
          q: 'අමා ගියේ කොහේද?',
          options: ['මල් වත්තට', 'පාසලට', 'කඩේට'],
          ans: 'මල් වත්තට'
        },
        {
          passage: 'අමා උදෑසන මල් වත්තට ගියාය. ඇය ලස්සන රෝස මලක් දැක සතුටු වූවාය.',
          q: 'අමා දුටු මල කුමක්ද?',
          options: ['රෝස මල', 'නෙළුම් මල', 'ඕකිඩ් මල'],
          ans: 'රෝස මල'
        },
        {
          passage: 'අමා උදෑසන මල් වත්තට ගියාය. ඇය ලස්සන රෝස මලක් දැක සතුටු වූවාය.',
          q: 'අමා මල් වත්තට ගියේ කවදාද?',
          options: ['උදෑසන', 'රෑ', 'සවස'],
          ans: 'උදෑසන'
        }
      ]
    },
    {
      id: 'REM_G3_C5_03',
      title: 'විරාම ලකුණු හා හොඳ පුරුදු (Punctuation & Good Habits)',
      sub: 'විරාම ලකුණු සහ හේතු-ඵල අවබෝධය',
      difficulty: 'Hard',
      targetSkill: 'Punctuation and causal reasoning',
      items: [
        { q: "“ඔයාගේ නම කුමක්ද___”", options: ['?', '.', '!'], ans: '?' },
        { q: "“මම පොතක් කියවමි___”", options: ['.', '?', '!'], ans: '.' },
        { q: "“වාව්, මේ මල හරිම ලස්සනයි___”", options: ['!', '.', '?'], ans: '!' },
        { q: "ආහාර ගැනීමට පෙර අත් සෝදන්නේ ඇයි?", options: ['පිරිසිදුව සිටීමට', 'නිදා ගැනීමට', 'දුවන්නට'], ans: 'පිරිසිදුව සිටීමට' },
        { q: "පාසලට පොත් ගෙන යන්නේ ඇයි?", options: ['ඉගෙනීමට', 'නිදාගැනීමට', 'කෑමට'], ans: 'ඉගෙනීමට' }
      ]
    }
  ]
};

export const GRADE3_REMEDIAL_EXERCISES = GRADE3_REMEDIAL_EXERCISE_BANK;
