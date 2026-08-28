/**
 * grade4SinhalaQuestionBank.js
 * Comprehensive Research Item Bank for Grade 4 Sinhala 5-Paper Adaptive Assessment & Learning System
 * Categorized into 5 Research Domains (C1 - C5) with Calibrated Difficulty, Competencies, and Remedial Sets
 * Extracted directly from official Grade 4 Primary Sinhala Curricular Modules:
 * - C1: සමාන පද (Synonyms & Lexical Semantics)
 * - C2: විරුද්ධ පද (Antonyms & Semantic Contrasts)
 * - C3: ප්‍රස්තාව පිරුළු සහ ඉඟි වැකි (Proverbs & Idioms)
 * - C4: කාලය, ව්‍යාකරණ, යුගල පද සහ අක්ෂර වින්‍යාසය (Tenses, Grammar, Word Pairs & Spelling)
 * - C5: කියවීම, අවබෝධය සහ විරාම ලක්ෂණ (Reading Comprehension & Punctuation Marks)
 */

export const GRADE4_SINHALA_CATEGORIES = {
  C1: {
    id: 'C1',
    name: 'සමාන පද හා අර්ථ විචාරය',
    nameEn: 'Synonyms & Lexical Semantics',
    description: 'සමාන පද හඳුනාගැනීම, වාක්‍යයේ අර්ථය නොවනෙසෙන සේ පද යෙදීම සහ පද මාලා.',
    icon: '📖',
    color: 'from-blue-500 to-indigo-600',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-200'
  },
  C2: {
    id: 'C2',
    name: 'විරුද්ධ පද හා ප්‍රතිවිරුද්ධ අර්ථ',
    nameEn: 'Antonyms & Contrasting Concepts',
    description: 'ප්‍රමාණය, කාලය, හැඟීම්, තත්ත්ව සහ ක්‍රියා පිළිබඳ විරුද්ධ පද හඳුනාගැනීම.',
    icon: '⚖️',
    color: 'from-emerald-500 to-teal-600',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200'
  },
  C3: {
    id: 'C3',
    name: 'ප්‍රස්තාව පිරුළු සහ ඉඟි වැකි',
    nameEn: 'Proverbs, Idioms & Metaphors',
    description: 'ජනප්‍රිය ප්‍රස්තාව පිරුළු, ඉඟි වැකි, ඒවායේ අර්ථ සහ සන්දර්භානුකූල භාවිතය.',
    icon: '📜',
    color: 'from-amber-500 to-orange-600',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200'
  },
  C4: {
    id: 'C4',
    name: 'කාලය, ව්‍යාකරණ, යුගල පද හා අක්ෂර වින්‍යාසය',
    nameEn: 'Tenses, Grammar, Word Pairs & Spelling',
    description: 'වර්‍තමාන/අතීත කාල, කථන→ලිඛිත රූපාන්තරණය, උක්ත-ආඛ්‍යාත ගැලපීම, යුගල පද සහ නිවැරදි අක්ෂර වින්‍යාසය.',
    icon: '✍️',
    color: 'from-purple-500 to-pink-600',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-200'
  },
  C5: {
    id: 'C5',
    name: 'කියවීම, අවබෝධය සහ විරාම ලක්ෂණ',
    nameEn: 'Reading Comprehension & Punctuation',
    description: 'කෙටි ඡේද කියවා තොරතුරු උකහා ගැනීම, හේතු-ඵල විමසීම සහ නිවැරදි විරාම ලක්ෂණ භාවිතය.',
    icon: '🧠',
    color: 'from-rose-500 to-red-600',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-200'
  }
};

export const GRADE4_QUESTION_BANK = [
  // ══════════════════════════════════════════════════════════════════════
  // CATEGORY 1 (C1): සමාන පද හා අර්ථ විචාරය (Synonyms & Lexical Semantics)
  // ══════════════════════════════════════════════════════════════════════
  {
    id: 'G4_C1_001',
    category: 'C1',
    competency: 'Direct Synonym Recall',
    sub_skill: 'Time of day synonym',
    difficulty: 0.2,
    prompt: "'උදෑසන' යන්නෙහි නිවැරදි සමාන පදය කුමක්ද?",
    options: ['පාන්දර', 'රාත්‍රිය', 'සවස', 'දවල්'],
    answer: 'පාන්දර',
    audioPrompt: 'උදෑසන යන්නෙහි නිවැරදි සමාන පදය තෝරන්න.',
    explanation: "'උදෑසන' යනු හිරු උදාවන වේලාව වන අතර ඊට සමාන පදය 'පාන්දර' වේ."
  },
  {
    id: 'G4_C1_002',
    category: 'C1',
    competency: 'Direct Synonym Recall',
    sub_skill: 'Creature synonym',
    difficulty: 0.25,
    prompt: "'කුරුල්ලා' යන්නට සමාන වචනය තෝරන්න.",
    options: ['පක්ෂියා', 'මාළුවා', 'සත්වයා', 'ගවයා'],
    answer: 'පක්ෂියා',
    audioPrompt: 'කුරුල්ලා යන්නට සමාන වචනය තෝරන්න.',
    explanation: "'කුරුල්ලා' සහ 'පක්ෂියා' එකම අර්ථය ලබාදෙන සමාන පද වේ."
  },
  {
    id: 'G4_C1_003',
    category: 'C1',
    competency: 'Direct Synonym Recall',
    sub_skill: 'Object & Book synonym',
    difficulty: 0.3,
    prompt: "'පොත' සඳහා යෙදිය හැකි සමාන පදය කුමක්ද?",
    options: ['ග්‍රන්ථය', 'ලේඛනය', 'පත්තරය', 'පෑන'],
    answer: 'ග්‍රන්ථය',
    audioPrompt: 'පොත සඳහා යෙදිය හැකි සමාන පදය කුමක්ද?',
    explanation: "'පොත' යන්නට තවත් නමක් ලෙස 'ග්‍රන්ථය' යොදා ගනී."
  },
  {
    id: 'G4_C1_004',
    category: 'C1',
    competency: 'Contextual Synonym',
    sub_skill: 'Synonym in sentence context',
    difficulty: 0.35,
    prompt: "“අපේ ගෙවත්තේ විශාල ගසක් ඇත.” — මෙහි 'විශාල' යන්නෙහි සමාන පදය කුමක්ද?",
    options: ['ලොකු', 'කුඩා', 'සිහින්', 'මිටි'],
    answer: 'ලොකු',
    audioPrompt: 'විශාල යන්නෙහි සමාන පදය තෝරන්න.',
    explanation: "'විශාල' යනු ප්‍රමාණයෙන් ඉහළ බව දැක්වීමට 'ලොකු' හෝ 'දැවැන්ත' යෙදේ."
  },
  {
    id: 'G4_C1_005',
    category: 'C1',
    competency: 'Emotion Synonyms',
    sub_skill: 'Happiness synonym triad',
    difficulty: 0.45,
    prompt: "'සතුට' යන හැඟීමට ගැළපෙන සමාන පදය කුමක්ද?",
    options: ['ප්‍රීතිය', 'ශෝකය', 'කෝපය', 'භීතිය'],
    answer: 'ප්‍රීතිය',
    audioPrompt: 'සතුට යන හැඟීමට ගැළපෙන සමාන පදය කුමක්ද?',
    explanation: "'සතුට' යන්නෙහි සමාන පදය 'ප්‍රීතිය' හෝ 'සොම්නස' වේ."
  },
  {
    id: 'G4_C1_006',
    category: 'C1',
    competency: 'Nature Synonyms',
    sub_skill: 'Environmental element mapping',
    difficulty: 0.5,
    prompt: "'සුළඟ' යන්නට සමාන පදය තෝරන්න.",
    options: ['පවන', 'වර්ෂාව', 'ගින්න', 'දිය'],
    answer: 'පවන',
    audioPrompt: 'සුළඟ යන්නට සමාන පදය තෝරන්න.',
    explanation: "'සුළඟ' හැඳින්වීමට 'පවන' හෝ 'වාතය' යොදා ගනී."
  },
  {
    id: 'G4_C1_007',
    category: 'C1',
    competency: 'Character Attributes',
    sub_skill: 'Virtue & skill synonym',
    difficulty: 0.6,
    prompt: "'දක්ෂ' ශිෂ්‍යයෙකු හැඳින්වීමට ගැළපෙන සමාන පදය කුමක්ද?",
    options: ['සමර්ථ', 'අලස', 'දුර්‍වල', 'බියගුලු'],
    answer: 'සමර්ථ',
    audioPrompt: 'දක්ෂ යන්නට ගැළපෙන සමාන පදය කුමක්ද?',
    explanation: "'දක්ෂ' යනු හැකියාව ඇති කෙනෙකු වන අතර ඊට සමාන පදය 'සමර්ථ' වේ."
  },
  {
    id: 'G4_C1_008',
    category: 'C1',
    competency: 'Nature Synonyms',
    sub_skill: 'Celestial body synonym',
    difficulty: 0.65,
    prompt: "'හිරු' සහ 'සඳ' සඳහා නිවැරදි සමාන පද යුගලය තෝරන්න.",
    options: ['සූර්‍යා - චන්ද්‍රයා', 'තාරකාව - ගුවන', 'වලාකුළ - වැස්ස', 'පවන - ආකාශය'],
    answer: 'සූර්‍යා - චන්ද්‍රයා',
    audioPrompt: 'හිරු සහ සඳ සඳහා නිවැරදි සමාන පද යුගලය තෝරන්න.',
    explanation: "'හිරු' යනු 'සූර්‍යා' වන අතර 'සඳ' යනු 'චන්ද්‍රයා' වේ."
  },
  {
    id: 'G4_C1_009',
    category: 'C1',
    competency: 'Word Chain & Multiple Synonyms',
    sub_skill: 'Synonym chain completion',
    difficulty: 0.75,
    prompt: "වචන දාමය සම්පූර්ණ කරන්න: “කෑම → ආහාර → ______”",
    options: ['බොජුන්', 'පානය', 'වස්ත්‍රය', 'මාවත'],
    answer: 'බොජුන්',
    audioPrompt: 'වචන දාමය සම්පූර්ණ කිරීමට සුදුසු සමාන පදය තෝරන්න.',
    explanation: "'කෑම', 'ආහාර' සහ 'බොජුන්' යනු එකම අර්ථය දෙන සමාන පද වේ."
  },
  {
    id: 'G4_C1_010',
    category: 'C1',
    competency: 'Sentence Word Replacement',
    sub_skill: 'Advanced contextual synonym substitution',
    difficulty: 0.85,
    prompt: "“අපි දිගු මාවතක් ඔස්සේ පාසලට ගියෙමු.” — 'මාවත' වෙනුවට යෙදිය හැකි වඩාත් නිවැරදි පදය කුමක්ද?",
    options: ['පාර', 'නිවස', 'වත්ත', 'නගරය'],
    answer: 'පාර',
    audioPrompt: 'මාවත වෙනුවට යෙදිය හැකි සමාන පදය තෝරන්න.',
    explanation: "'මාවත' සහ 'මාර්ගය' යන්නෙහි සරල සමාන පදය 'පාර' වේ."
  },

  // ══════════════════════════════════════════════════════════════════════
  // CATEGORY 2 (C2): විරුද්ධ පද හා ප්‍රතිවිරුද්ධ අර්ථ (Antonyms & Contrasts)
  // ══════════════════════════════════════════════════════════════════════
  {
    id: 'G4_C2_001',
    category: 'C2',
    competency: 'Action Antonyms',
    sub_skill: 'Arrival vs Departure',
    difficulty: 0.2,
    prompt: "'පැමිණීම' යන්නෙහි නිවැරදි විරුද්ධ පදය කුමක්ද?",
    options: ['පිටවීම', 'ඇතුළුවීම', 'නැවතීම', 'සිටීම'],
    answer: 'පිටවීම',
    audioPrompt: 'පැමිණීම යන්නෙහි නිවැරදි විරුද්ධ පදය තෝරන්න.',
    explanation: "'පැමිණීම' හි ප්‍රතිවිරුද්ධ ක්‍රියාව 'පිටවීම' වේ."
  },
  {
    id: 'G4_C2_002',
    category: 'C2',
    competency: 'Condition Antonyms',
    sub_skill: 'Need and relevance',
    difficulty: 0.25,
    prompt: "'අවශ්‍ය' යන්නෙහි විරුද්ධ පදය තෝරන්න.",
    options: ['අනවශ්‍ය', 'වටිනා', 'හිතකර', 'ප්‍රයෝජනවත්'],
    answer: 'අනවශ්‍ය',
    audioPrompt: 'අවශ්‍ය යන්නෙහි විරුද්ධ පදය තෝරන්න.',
    explanation: "'අවශ්‍ය' යන්නට 'අන්' උපසර්ගය එක්වී 'අනවශ්‍ය' ලෙස විරුද්ධ පදය සෑදේ."
  },
  {
    id: 'G4_C2_003',
    category: 'C2',
    competency: 'Quality & Cleanliness Antonyms',
    sub_skill: 'Clean vs Dirty',
    difficulty: 0.3,
    prompt: "'පිරිසිදු' යන්නෙහි නිවැරදි විරුද්ධ පදය කුමක්ද?",
    options: ['අපිරිසිදු', 'පවිත්‍ර', 'සුදු', 'නිර්මල'],
    answer: 'අපිරිසිදු',
    audioPrompt: 'පිරිසිදු යන්නෙහි නිවැරදි විරුද්ධ පදය තෝරන්න.',
    explanation: "'පිරිසිදු' හි විරුද්ධ පදය 'අපිරිසිදු' වේ."
  },
  {
    id: 'G4_C2_004',
    category: 'C2',
    competency: 'Physical Properties Antonyms',
    sub_skill: 'Weight contrast',
    difficulty: 0.4,
    prompt: "“මගේ පාසල් බෑගය බරය.” — මෙහි 'බර' යන්නෙහි විරුද්ධ පදය කුමක්ද?",
    options: ['සැහැල්ලු', 'උස', 'කුඩා', 'මිටි'],
    answer: 'සැහැල්ලු',
    audioPrompt: 'බර යන්නෙහි විරුද්ධ පදය කුමක්ද?',
    explanation: "'බර' හි විරුද්ධ පදය 'සැහැල්ලු' වේ."
  },
  {
    id: 'G4_C2_005',
    category: 'C2',
    competency: 'Spatial & Dimension Antonyms',
    sub_skill: 'Height and depth opposites',
    difficulty: 0.45,
    prompt: "'උස' සහ 'ඉහළ' යන වචනවල නිවැරදි විරුද්ධ පද යුගලය කුමක්ද?",
    options: ['මිටි - පහළ', 'දිග - ළඟ', 'පළල් - පටු', 'ලොකු - කුඩා'],
    answer: 'මිටි - පහළ',
    audioPrompt: 'උස සහ ඉහළ යන වචනවල නිවැරදි විරුද්ධ පද යුගලය තෝරන්න.',
    explanation: "'උස' හි විරුද්ධ පදය 'මිටි' වන අතර 'ඉහළ' හි විරුද්ධ පදය 'පහළ' වේ."
  },
  {
    id: 'G4_C2_006',
    category: 'C2',
    competency: 'Thermal & State Antonyms',
    sub_skill: 'Temperature contrast',
    difficulty: 0.5,
    prompt: "'උණුසුම්' දවසකට විරුද්ධ දවසක් වන්නේ කෙසේද?",
    options: ['සීතල', 'රස්නය', 'වියළි', 'දීප්තිමත්'],
    answer: 'සීතල',
    audioPrompt: 'උණුසුම් දවසකට විරුද්ධ දවස කුමක්ද?',
    explanation: "'උණුසුම්' හෝ 'උණු' යන්නෙහි විරුද්ධ තත්ත්වය 'සීතල' වේ."
  },
  {
    id: 'G4_C2_007',
    category: 'C2',
    competency: 'State & Availability Antonyms',
    sub_skill: 'Container state opposite',
    difficulty: 0.6,
    prompt: "“වතුර වීදුරුව හිස්ව තිබුණි.” — 'හිස්' යන්නෙහි විරුද්ධ පදය කුමක්ද?",
    options: ['පිරුණු', 'කුඩා', 'පිරිසිදු', 'බර'],
    answer: 'පිරුණු',
    audioPrompt: 'හිස් යන්නෙහි විරුද්ධ පදය කුමක්ද?',
    explanation: "'හිස්' හි ප්‍රතිවිරුද්ධ තත්ත්වය 'පිරුණු' වේ."
  },
  {
    id: 'G4_C2_008',
    category: 'C2',
    competency: 'Skill & Training Antonyms',
    sub_skill: 'Trained vs Untrained',
    difficulty: 0.65,
    prompt: "'පුහුණු' ගුරුවරයෙකුට විරුද්ධ අදහස කුමක්ද?",
    options: ['නුපුහුණු', 'දක්ෂ', 'අලස', 'අසමත්'],
    answer: 'නුපුහුණු',
    audioPrompt: 'පුහුණු යන්නට විරුද්ධ අදහස තෝරන්න.',
    explanation: "'පුහුණු' යන්නට 'නු' උපසර්ගය එක්වී 'නුපුහුණු' සෑදේ."
  },
  {
    id: 'G4_C2_009',
    category: 'C2',
    competency: 'Environmental Depth & Width Antonyms',
    sub_skill: 'Depth and breadth contrast',
    difficulty: 0.75,
    prompt: "'ගැඹුරු' ගඟක් සහ 'පළල්' පාරක් සඳහා නිවැරදි විරුද්ධ පද මොනවාද?",
    options: ['නොගැඹුරු - පටු', 'උස - මිටි', 'දිගු - කෙටි', 'සීතල - වියළි'],
    answer: 'නොගැඹුරු - පටු',
    audioPrompt: 'ගැඹුරු සහ පළල් සඳහා විරුද්ධ පද තෝරන්න.',
    explanation: "'ගැඹුරු' හි විරුද්ධ පදය 'නොගැඹුරු' වන අතර 'පළල්' හි විරුද්ධ පදය 'පටු' වේ."
  },
  {
    id: 'G4_C2_010',
    category: 'C2',
    competency: 'Sentence Inversion Challenge',
    sub_skill: 'Complex sentence meaning flip',
    difficulty: 0.85,
    prompt: "“මෙම ගණිත ගැටලුව ඉතා පහසුය.” — මෙහි ප්‍රතිවිරුද්ධ අර්ථය දෙන වාක්‍යය කුමක්ද?",
    options: ['මෙම ගණිත ගැටලුව ඉතා අමාරුය.', 'මෙම ගණිත ගැටලුව ඉතා ලස්සනයි.', 'මෙම ගණිත ගැටලුව නිවැරදිය.', 'මෙම ගණිත ගැටලුව කෙටිය.'],
    answer: 'මෙම ගණිත ගැටලුව ඉතා අමාරුය.',
    audioPrompt: 'ප්‍රතිවිරුද්ධ අර්ථය දෙන වාක්‍යය තෝරන්න.',
    explanation: "'පහසු' හි විරුද්ධ පදය 'අමාරු' හෝ 'අපහසු' වේ."
  },

  // ══════════════════════════════════════════════════════════════════════
  // CATEGORY 3 (C3): ප්‍රස්තාව පිරුළු සහ ඉඟි වැකි (Proverbs & Idioms)
  // ══════════════════════════════════════════════════════════════════════
  {
    id: 'G4_C3_001',
    category: 'C3',
    competency: 'Proverb Completion',
    sub_skill: 'Trouble upon trouble proverb',
    difficulty: 0.2,
    prompt: "හිස්තැන පුරවන්න: “කබලෙන් ______ වැටුණා වගේ.”",
    options: ['ලිපට', 'ගසට', 'වතුරට', 'පාරට'],
    answer: 'ලිපට',
    audioPrompt: 'කබලෙන් ලිපට වැටුණා වගේ ප්‍රස්තාව පිරුළ සම්පූර්ණ කරන්න.',
    explanation: "'කබලෙන් ලිපට වැටුණා වගේ' යනු එක් කරදරයකින් තවත් කරදරයකට පත්වීමයි."
  },
  {
    id: 'G4_C3_002',
    category: 'C3',
    competency: 'Proverb Meaning',
    sub_skill: 'Excuse making proverb',
    difficulty: 0.3,
    prompt: "“නටන්න බැරි මිනිහාට පොළොව ඇදයි වගේ” යන පිරුළෙන් අදහස් වන්නේ කුමක්ද?",
    options: [
      'තමන්ගේ අඩුපාඩුවට වෙනත් හේතුවක් දැක්වීම',
      'හොඳින් නැටුම් පුහුණු වීම',
      'පොළොව මත සෙල්ලම් කිරීම',
      'යහළුවන්ට උදව් කිරීම'
    ],
    answer: 'තමන්ගේ අඩුපාඩුවට වෙනත් හේතුවක් දැක්වීම',
    audioPrompt: 'නටන්න බැරි මිනිහාට පොළොව ඇදයි වගේ අදහස තෝරන්න.',
    explanation: "තමන්ගේ නොහැකියාව හෝ වැරැද්ද වසා ගැනීමට බාහිර දේවලට දොස් පැවරීම මෙයින් අදහස් වේ."
  },
  {
    id: 'G4_C3_003',
    category: 'C3',
    competency: 'Proverb Situational Context',
    sub_skill: 'Worse alternative choice',
    difficulty: 0.4,
    prompt: "ලැබුණු දෙයට වඩා අමාරු හෝ කරදරකාරී දෙයක් ලැබුණු අවස්ථාවක භාවිත කරන පිරුළ කුමක්ද?",
    options: [
      'ඉඟුරු දී මිරිස් ගත්තා වගේ',
      'ගිය දේ ගියා වගේ',
      'අතේ මාට්ටු වගේ',
      'කබලෙන් ලිපට වැටුණා වගේ'
    ],
    answer: 'ඉඟුරු දී මිරිස් ගත්තා වගේ',
    audioPrompt: 'ලැබුණු දෙයට වඩා අමාරු දෙයක් ලැබුණු විට යොදන පිරුළ තෝරන්න.',
    explanation: "තිත්ත ඉඟුරු වෙනුවට සැර මිරිස් ලැබුණා සේ වැඩි කරදරයක් සිදුවූ විට මෙය යෙදේ."
  },
  {
    id: 'G4_C3_004',
    category: 'C3',
    competency: 'Idiom Meaning Recall',
    sub_skill: 'Enthusiastic book reader idiom',
    difficulty: 0.45,
    prompt: "නිතරම පොත් කියවීමට දැඩි ආශාවක් දක්වන ශිෂ්‍යයා හඳුන්වන ඉඟි වැකිය කුමක්ද?",
    options: ['පොත් ගුල්ලා', 'හණමිටිකාරයා', 'අඹ යාලුවා', 'ඇඹලයා'],
    answer: 'පොත් ගුල්ලා',
    audioPrompt: 'නිතරම පොත් කියවන ළමයා හඳුන්වන ඉඟි වැකිය තෝරන්න.',
    explanation: "නිතර පොත්පත් කියවන අය 'පොත් ගුල්ලා' ලෙස හැඳින්වේ."
  },
  {
    id: 'G4_C3_005',
    category: 'C3',
    competency: 'Idiom Meaning Recall',
    sub_skill: 'Extreme heavy rain idiom',
    difficulty: 0.5,
    prompt: "ඉතා තදින් නොනවත්වා ඇදහැලෙන වැස්ස හැඳින්වෙන්නේ කුමන ඉඟි වැකියෙන්ද?",
    options: ['මොර සූරණ වැස්ස', 'හාවක් හුවක් නැහැ', 'ගල් පැලෙන බොරු', 'දවල් හීන'],
    answer: 'මොර සූරණ වැස්ස',
    audioPrompt: 'ඉතා තද වැස්ස හඳුන්වන ඉඟි වැකිය තෝරන්න.',
    explanation: "කඩාහැලෙන මහා තද වර්ෂාවට 'මොර සූරණ වැස්ස' යැයි කියනු ලැබේ."
  },
  {
    id: 'G4_C3_006',
    category: 'C3',
    competency: 'Idiom Meaning Recall',
    sub_skill: 'Great joy idiom',
    difficulty: 0.55,
    prompt: "“ජයග්‍රහණය ලැබුණු විට දරුවාට මහත් සතුටක් ඇති විය.” — මෙහි 'මහත් සතුට' දැක්වීමට ගැළපෙන ඉඟි වැකිය කුමක්ද?",
    options: ['ඉහේ මලක් පිපීම', 'සායම ගියා', 'මුහුණ ඇඹුල් වීම', 'හඹස් බිය'],
    answer: 'ඉහේ මලක් පිපීම',
    audioPrompt: 'මහත් සතුටක් ලැබීම දැක්වෙන ඉඟි වැකිය තෝරන්න.',
    explanation: "විශාල සතුටක් හා ප්‍රීතියක් හටගත් විට 'ඉහේ මලක් පිපුණා වැනිය' යොදයි."
  },
  {
    id: 'G4_C3_007',
    category: 'C3',
    competency: 'Idiom Speed & Action',
    sub_skill: 'Very fast vs Very slow idioms',
    difficulty: 0.65,
    prompt: "ඉතා වේගයෙන් යෑම දැක්වීමට 'ඊ ගහක වේගයෙන්' යොදයි නම්, ඉතා සෙමින් යෑම දැක්වීමට යොදන්නේ කුමක්ද?",
    options: ['ඉබි ගමන', 'කුකුලු නින්ද', 'උගුරට දෙකට', 'හොර ගල් ඇහිලීම'],
    answer: 'ඉබි ගමන',
    audioPrompt: 'ඉතා සෙමින් ගමන් කිරීම දැක්වෙන ඉඟි වැකිය කුමක්ද?',
    explanation: "ඉබි ගමන යනු අතිශය මන්දගාමීව, සෙමින් ගමන් කිරීමයි."
  },
  {
    id: 'G4_C3_008',
    category: 'C3',
    competency: 'Idiom Meaning Analysis',
    sub_skill: 'Friendship idiom',
    difficulty: 0.7,
    prompt: "අපගේ හොඳම, ලෙන්ගතුම මිතුරා හැඳින්වීමට යෙදෙන සුදුසුම ඉඟි වැකිය කුමක්ද?",
    options: ['අඹ යාලුවා', 'හණමිටිකාරයා', 'ඇඹලයා', 'දහදිය හෙළන අය'],
    answer: 'අඹ යාලුවා',
    audioPrompt: 'හොඳම මිතුරා හඳුන්වන ඉඟි වැකිය තෝරන්න.',
    explanation: "දැඩි මිතුරුකමකින් බැඳුණු ලෙන්ගතු මිතුරා 'අඹ යාලුවා' වේ."
  },
  {
    id: 'G4_C3_009',
    category: 'C3',
    competency: 'Idiom Behaviour & Attitude',
    sub_skill: 'Waiting for an opportunity',
    difficulty: 0.8,
    prompt: "තමන්ට වාසිදායක අවස්ථාවක් එන තෙක් බලා සිටීම හඳුන්වන්නේ කුමන ඉඟි වැකියෙන්ද?",
    options: ['හොර ගල් ඇහිලීම', 'උඩින් පල්ලෙන්', 'කරල පැහීම', 'හමස් මල්ලට'],
    answer: 'හොර ගල් ඇහිලීම',
    audioPrompt: 'අවස්ථාව එන තෙක් බලා සිටීම දැක්වෙන ඉඟි වැකිය තෝරන්න.',
    explanation: "සැඟවී සිට තමන්ට වාසිදායක මොහොතක් එන තෙක් රැක සිටීම 'හොර ගල් ඇහිලීම' නම් වේ."
  },
  {
    id: 'G4_C3_010',
    category: 'C3',
    competency: 'Idiom Character Matching',
    sub_skill: 'Old fashioned minded person',
    difficulty: 0.85,
    prompt: "නවීන සමාජයේ යහපත් වෙනස්කම් ප්‍රතික්ෂේප කරමින් පැරණි මතවලම එල්බ සිටින්නා හඳුන්වන්නේ කුමක් ලෙසද?",
    options: ['හණමිටිකාරයා', 'පොත් ගුල්ලා', 'ඇඹලයා', 'කඩිරැළක් සේ'],
    answer: 'හණමිටිකාරයා',
    audioPrompt: 'පරණ අදහස් දරන්නා හඳුන්වන ඉඟි වැකිය තෝරන්න.',
    explanation: "අනාගතයට නොගැළපෙන පරණ මත දරන අය 'හණමිටිකාරයා' ලෙස හඳුන්වයි."
  },

  // ══════════════════════════════════════════════════════════════════════
  // CATEGORY 4 (C4): කාලය, ව්‍යාකරණ, යුගල පද හා අක්ෂර වින්‍යාසය (Tenses & Grammar)
  // ══════════════════════════════════════════════════════════════════════
  {
    id: 'G4_C4_001',
    category: 'C4',
    competency: 'Tense Identification',
    sub_skill: 'Present vs Past classification',
    difficulty: 0.2,
    prompt: "“මම සෑම දිනකම පාසලට යමි.” — මෙම වාක්‍යය කුමන කාලයට අයත්ද?",
    options: ['වර්‍තමාන කාලය', 'අතීත කාලය', 'අනාගත කාලය', 'කථන කාලය'],
    answer: 'වර්‍තමාන කාලය',
    audioPrompt: 'වාක්‍යයේ කාලය හඳුනාගන්න.',
    explanation: "'සෑම දිනකම යමි' යනු වර්‍තමානයේ නිරතුරුව සිදුවන ක්‍රියාවකි."
  },
  {
    id: 'G4_C4_002',
    category: 'C4',
    competency: 'Tense Transformation',
    sub_skill: 'Past tense conversion',
    difficulty: 0.3,
    prompt: "“ඔහු පොත කියවයි.” යන වර්‍තමාන වාක්‍යය අතීත කාලයට හැරවූ විට ලැබෙන්නේ කුමක්ද?",
    options: ['ඔහු පොත කියවීය.', 'ඔහු පොත කියවති.', 'ඔහු පොත කියවමි.', 'ඔහු පොත කියවන්නේය.'],
    answer: 'ඔහු පොත කියවීය.',
    audioPrompt: 'අතීත කාලයට හැරවූ නිවැරදි වාක්‍යය තෝරන්න.',
    explanation: "'කියවයි' යන්නෙහි තනි පුරුෂ අතීත ආඛ්‍යාතය 'කියවීය' වේ."
  },
  {
    id: 'G4_C4_003',
    category: 'C4',
    competency: 'Spoken to Written Sinhala',
    sub_skill: 'First person singular written conversion',
    difficulty: 0.35,
    prompt: "“මම පාසලට යනවා.” යන කථන වාක්‍යයේ නිවැරදි ලිඛිත වාක්‍යය කුමක්ද?",
    options: ['මම පාසලට යමි.', 'මම පාසලට යයි.', 'මම පාසලට යති.', 'මම පාසලට යමු.'],
    answer: 'මම පාසලට යමි.',
    audioPrompt: 'මම පාසලට යනවා යන්නෙහි නිවැරදි ලිඛිත වාක්‍යය තෝරන්න.',
    explanation: "උත්තම පුරුෂ ඒක වචන 'මම' කර්තෘට ලිඛිත ආඛ්‍යාතය 'යමි' යෙදිය යුතුය."
  },
  {
    id: 'G4_C4_004',
    category: 'C4',
    competency: 'Subject-Verb Concord',
    sub_skill: 'Plural subject-verb agreement',
    difficulty: 0.45,
    prompt: "“ළමයි උයනේ සෙල්ලම් ______.” හිස්තැනට ගැළපෙන නිවැරදි ලිඛිත ආඛ්‍යාතය කුමක්ද?",
    options: ['කරති', 'කරයි', 'කරමි', 'කරමු'],
    answer: 'කරති',
    audioPrompt: 'හිස්තැනට ගැළපෙන නිවැරදි ආඛ්‍යාතය තෝරන්න.',
    explanation: "'ළමයි' යනු ප්‍රථම පුරුෂ බහු වචනයක් බැවින් ආඛ්‍යාතය 'කරති' විය යුතුය."
  },
  {
    id: 'G4_C4_005',
    category: 'C4',
    competency: 'Sinhala Word Pairs (යුගල පද)',
    sub_skill: 'Basic household & nature word pairs',
    difficulty: 0.5,
    prompt: "'ගෙවල්' සහ 'ගස්' සඳහා ගැළපෙන නිවැරදි යුගල පද මොනවාද?",
    options: ['දොරවල් - වැල්', 'හෙල් - කොළ', 'වතු - පිටි', 'රෙදි - පිළි'],
    answer: 'දොරවල් - වැල්',
    audioPrompt: 'ගෙවල් සහ ගස් සඳහා ගැළපෙන යුගල පද තෝරන්න.',
    explanation: "'ගෙවල් දොරවල්' සහ 'ගස් වැල්' යනු සම්මත සිංහල යුගල පද වේ."
  },
  {
    id: 'G4_C4_006',
    category: 'C4',
    competency: 'Sinhala Word Pairs (යුගල පද)',
    sub_skill: 'Movement and activity pair',
    difficulty: 0.55,
    prompt: "යුගල පදය ගළපන්න: “කෑම - බීම, කන්න - බොන්න, යන - ______”",
    options: ['එන', 'දුවන', 'බලන', 'නටන'],
    answer: 'එන',
    audioPrompt: 'යන සමඟ යෙදෙන යුගල පදය තෝරන්න.',
    explanation: "'යන එන' යනු ගමනාගමනය දැක්වෙන යුගල පදයයි."
  },
  {
    id: 'G4_C4_007',
    category: 'C4',
    competency: 'Spelling Precision (අක්ෂර වින්‍යාසය)',
    sub_skill: 'Murdhaja ṇa and dental na precision',
    difficulty: 0.65,
    prompt: "“අම්මා පරිග___කය භාවිත කළාය.” — හිස්තැනට ගැළපෙන නිවැරදි අක්ෂරය කුමක්ද?",
    options: ['ණ', 'න', 'න්', 'ණ්'],
    answer: 'ණ',
    audioPrompt: 'පරිගණකය යන වචනයට නිවැරදි අකුර තෝරන්න.',
    explanation: "'පරිගණකය' යන්නෙහි 'ග' පසුපසට මූර්ධජ 'ණ' යෙදේ."
  },
  {
    id: 'G4_C4_008',
    category: 'C4',
    competency: 'Spelling Precision (අක්ෂර වින්‍යාසය)',
    sub_skill: 'Sha, Sha, Sa distinctions',
    difficulty: 0.7,
    prompt: "“ගුරුවරයා අපට වි___ෂ කරුණක් පැහැදිලි කළේය.” — හිස්තැනට නිවැරදි අක්ෂරය කුමක්ද?",
    options: ['ෂේ', 'ශේ', 'සේ', 'ෂ'],
    answer: 'ෂේ',
    audioPrompt: 'විශේෂ යන වචනයට ගැළපෙන අකුර තෝරන්න.',
    explanation: "'විශේෂ' යන්න ලිවීමේදී මුලින් 'ශ' ද පසුව මූර්ධජ 'ෂ' ද යෙදේ."
  },
  {
    id: 'G4_C4_009',
    category: 'C4',
    competency: 'Past Tense Plural Formation',
    sub_skill: 'First person plural past agreement',
    difficulty: 0.8,
    prompt: "“ඊයේ අපි තරගයෙන් ජය ______.” හිස්තැනට ගැළපෙන ආඛ්‍යාතය කුමක්ද?",
    options: ['ගත්තෙමු', 'ගනිමු', 'ගත්තාය', 'ගත්තෝය'],
    answer: 'ගත්තෙමු',
    audioPrompt: 'ඊයේ අපි තරගයෙන් ජය ගත්තෙමු යන්නට නිවැරදි පදය තෝරන්න.',
    explanation: "අතීත කාල උත්තම පුරුෂ බහුවචන 'අපි' කර්තෘට 'ගත්තෙමු' හෝ 'දිනුවෙමු' යෙදේ."
  },
  {
    id: 'G4_C4_010',
    category: 'C4',
    competency: 'Complex Word Pairing',
    sub_skill: 'Formal paired compound synthesis',
    difficulty: 0.85,
    prompt: "'ලිපි ලේඛන', 'කෙත් වතු' සහ 'ගංගා ______' හිස්තැනට එන යුගල පදය කුමක්ද?",
    options: ['ඇළදොළ', 'වැව්', 'මුහුදු', 'පොකුණු'],
    answer: 'ඇළදොළ',
    audioPrompt: 'ගංගා සමඟ යෙදෙන සම්මත යුගල පදය තෝරන්න.',
    explanation: "'ගංගා ඇළදොළ' යනු ස්වභාවික ජල මාර්ග දැක්වෙන සම්මත යුගල පදයයි."
  },

  // ══════════════════════════════════════════════════════════════════════
  // CATEGORY 5 (C5): කියවීම, අවබෝධය සහ විරාම ලක්ෂණ (Reading & Punctuation)
  // ══════════════════════════════════════════════════════════════════════
  {
    id: 'G4_C5_001',
    category: 'C5',
    competency: 'Punctuation Mark Identification',
    sub_skill: 'Question mark identification',
    difficulty: 0.2,
    prompt: "“ඔයාගේ නම කුමක්ද___” — මෙම වාක්‍යය අවසානයට සුදුසු විරාම ලක්ෂණය කුමක්ද?",
    options: ['?', '.', '!', ','],
    answer: '?',
    audioPrompt: 'ප්‍රශ්නයක් අවසානයට යොදන විරාම ලක්ෂණය තෝරන්න.',
    explanation: "යමක් විමසන ප්‍රශ්න වාක්‍යයක් අවසානයට ප්‍රශ්නාර්ථ ලකුණ (?) යෙදේ."
  },
  {
    id: 'G4_C5_002',
    category: 'C5',
    competency: 'Punctuation Mark Identification',
    sub_skill: 'Exclamation mark usage',
    difficulty: 0.25,
    prompt: "“වාව්! මේ මල හරිම ලස්සනයි___” — අවසානයට ගැළපෙන ලකුණ කුමක්ද?",
    options: ['!', '.', '?', ','],
    answer: '!',
    audioPrompt: 'පුදුමය හෝ සතුට දැක්වෙන වාක්‍යයකට යොදන ලකුණ තෝරන්න.',
    explanation: "පුදුමය, සතුට හෝ ප්‍රීතිය ප්‍රකාශ වන වාක්‍යවලට විස්මයාදී ලකුණ (!) යොදයි."
  },
  {
    id: 'G4_C5_003',
    category: 'C5',
    competency: 'Comma Listing Usage',
    sub_skill: 'Enumeration comma placement',
    difficulty: 0.35,
    prompt: "“අඹ__ පේර__ දොඩම් සහ කෙසෙල් කූඩයේ ඇත.” — හිස්තැන්වලට ගැළපෙන ලකුණ කුමක්ද?",
    options: [', (කොමාව)', '. (තිත)', '? (ප්‍රශ්නාර්ථය)', '! (විස්මයාර්ථය)'],
    answer: ', (කොමාව)',
    audioPrompt: 'නාම පද කිහිපයක් එක පෙළට ලියන විට යොදන ලකුණ තෝරන්න.',
    explanation: "වචන හෝ නම් කිහිපයක් වෙන් කර දැක්වීමට කොමාව (,) භාවිතා කෙරේ."
  },
  {
    id: 'G4_C5_004',
    category: 'C5',
    competency: 'Story Fact Retrieval',
    sub_skill: 'Direct narrative comprehension',
    difficulty: 0.45,
    prompt: "“අපේ පාසලේ ලස්සන වත්තක් ඇත. එහි විවිධ වර්ණවල මල් පිපී ඇත. ගුරුවරුන් වත්ත පිරිසිදුව තබා ගැනීමට සිසුන්ට උපදෙස් දෙති.” — ගුරුවරුන් සිසුන්ට දෙන උපදෙස කුමක්ද?",
    options: [
      'වත්ත පිරිසිදුව තබා ගැනීමට',
      'පොත් කියවීමට',
      'සෙල්ලම් කිරීමට',
      'ආහාර ගැනීමට'
    ],
    answer: 'වත්ත පිරිසිදුව තබා ගැනීමට',
    audioPrompt: 'පාඨය අනුව ගුරුවරුන් සිසුන්ට දෙන උපදෙස තෝරන්න.',
    explanation: "පාඨයේ සඳහන් පරිදි ගුරුවරුන් සිසුන්ට උපදෙස් දෙන්නේ පාසල් වත්ත පිරිසිදුව තබා ගැනීමටය."
  },
  {
    id: 'G4_C5_005',
    category: 'C5',
    competency: 'Story Detail Understanding',
    sub_skill: 'Direct narrative fact retrieval',
    difficulty: 0.5,
    prompt: "“සෙනු පාසලෙන් නිවසට පැමිණි පසු අම්මාට උදව් කළාය. ඇය මල් පැළවලට වතුර දැමුවාය.” — සෙනු මල් පැළවලට දැමුවේ කුමක්ද?",
    options: ['වතුර', 'වැලි', 'පොහොර', 'කිරි'],
    answer: 'වතුර',
    audioPrompt: 'සෙනු මල් පැළවලට දැමුවේ කුමක්ද?',
    explanation: "සෙනු මල් පැළ හොඳින් වැඩීමට වතුර දැමුවාය."
  },
  {
    id: 'G4_C5_006',
    category: 'C5',
    competency: 'Environmental Passage Comprehension',
    sub_skill: 'Environment week activities',
    difficulty: 0.6,
    prompt: "“අපේ පාසලේ පරිසර සතිය උත්සවාකාරයෙන් පැවැත්විණි. පළමු දිනයේ පාසල් වත්ත පිරිසිදු කළ අතර දෙවන දිනයේ පැළ සිටුවීමේ වැඩසටහනක් සංවිධානය කර තිබුණි.” — පාසල් පරිසර සතියේ දෙවන දිනයේ පැවැත්වුණේ කුමන වැඩසටහනද?",
    options: [
      'පැළ සිටුවීමේ වැඩසටහන',
      'පාසල් වත්ත පිරිසිදු කිරීම',
      'ප්ලාස්ටික් භාවිතය අඩු කිරීමේ වැඩසටහන',
      'චිත්‍ර ප්‍රදර්ශනය'
    ],
    answer: 'පැළ සිටුවීමේ වැඩසටහන',
    audioPrompt: 'පාඨය කියවා පරිසර සතියේ දෙවන දිනයේ සිදුවූ වැඩසටහන තෝරන්න.',
    explanation: "පළමු දිනයේ වත්ත පිරිසිදු කළ අතර දෙවන දිනයේ පැළ සිටුවීමේ වැඩසටහන පැවැත්විණි."
  },
  {
    id: 'G4_C5_007',
    category: 'C5',
    competency: 'Moral & Main Idea Comprehension',
    sub_skill: 'Water conservation theme',
    difficulty: 0.65,
    prompt: "“අප නිවසේදී දිනපතා ජලය අරපිරිමැස්මෙන් භාවිත කළ යුතුය. විශේෂයෙන් දත් මදින විට ජල කරාමය වසා තැබීමෙන් විශාල ජල ප්‍රමාණයක් අපතේ යාම වළක්වා ගත හැක.” — ජලය සුරැකීම සඳහා දෛනික ජීවිතයට ගත හැකි හොඳ පුරුද්ද කුමක්ද?",
    options: [
      'දත් මදින විට නළය වසා තැබීම',
      'වැඩිපුර ජලය අපතේ යැවීම',
      'වැසි ජලය කාණු ඔස්සේ ගලා යාමට හැරීම',
      'නළය නිතරම විවෘතව තැබීම'
    ],
    answer: 'දත් මදින විට නළය වසා තැබීම',
    audioPrompt: 'ජලය සුරැකීමේ හොඳ පුරුද්දක් තෝරන්න.',
    explanation: "දත් මදින විට නළය වසා තැබීමෙන් විශාල ජල ප්‍රමාණයක් අපතේ යාම වළක්වා ගත හැක."
  },
  {
    id: 'G4_C5_008',
    category: 'C5',
    competency: 'Quotation Punctuation',
    sub_skill: 'Direct speech dialogue punctuation',
    difficulty: 0.75,
    prompt: "කෙනෙකු පැවසූ ප්‍රකාශයක් එලෙසම උපුටා දක්වන විට යොදන ලකුණ කුමක්ද?",
    options: ['“ ” (යුගල උඩුකොමා)', '. (තිත)', '? (ප්‍රශ්නාර්ථය)', ', (කොමාව)'],
    answer: '“ ” (යුගල උඩුකොමා)',
    audioPrompt: 'කෙනෙකුගේ වචන උපුටා දක්වන විට යොදන ලකුණ තෝරන්න.',
    explanation: "කථකයෙකු පැවසූ වචන ඒ අයුරින්ම ලිවීමේදී යුගල උඩුකොමා (“ ”) තුළ බහාලයි."
  },
  {
    id: 'G4_C5_009',
    category: 'C5',
    competency: 'Narrative Detail & Inference',
    sub_skill: 'Weather narrative observation',
    difficulty: 0.8,
    prompt: "“සෙනසුරාදා උදෑසන අහස වලාකුළුවලින් වැසී තිබුණි. ටික වේලාවකට පසු තද වැස්සක් වැටුණි.” — අහස වැසී තිබුණේ කුමකින්ද?",
    options: [
      'වලාකුළුවලින්',
      'කුරුල්ලන්ගෙන්',
      'මල්වලින්',
      'දුමෙන්'
    ],
    answer: 'වලාකුළුවලින්',
    audioPrompt: 'අහස වැසී තිබුණේ කුමකින්ද යන්න තෝරන්න.',
    explanation: "වැස්සට පෙර අහස කළු වලාකුළුවලින් වැසී පැවතුණි."
  },
  {
    id: 'G4_C5_010',
    category: 'C5',
    competency: 'Complex Sentence Punctuation Repair',
    sub_skill: 'Multi-punctuation sentence syntax',
    difficulty: 0.85,
    prompt: "නිවැරදිව විරාම ලක්ෂණ යොදා ඇති වාක්‍යය තෝරන්න.",
    options: [
      'අම්මා, “කඩිනමින් එන්න,” යැයි කීවාය.',
      'අම්මා “කඩිනමින් එන්න යැයි” කීවාය.',
      'අම්මා කඩිනමින් එන්න? යැයි කීවාය.',
      'අම්මා! කඩිනමින් එන්න යැයි කීවාය.'
    ],
    answer: 'අම්මා, “කඩිනමින් එන්න,” යැයි කීවාය.',
    audioPrompt: 'නිවැරදි විරාම ලක්ෂණ සහිත වාක්‍යය තෝරන්න.',
    explanation: "කථකයාගෙන් පසු කොමාව ද, උපුටනය උඩුකොමා තුළ ද නිවැරදිව යොදා ඇත."
  }
];

// ══════════════════════════════════════════════════════════════════════
// REMEDIAL PRACTICE EXERCISE BANK (Structured by Category & Multi-Items)
// ══════════════════════════════════════════════════════════════════════
export const GRADE4_REMEDIAL_EXERCISE_BANK = {
  C1: [
    {
      id: 'REM_G4_C1_01',
      title: 'දෛනික හා සරල සමාන පද (Basic Synonyms)',
      sub: 'දී ඇති වචනයට වඩාත් ගැළපෙන සමාන පදය තෝරන්න',
      difficulty: 'Easy',
      targetSkill: 'Daily vocabulary synonyms',
      items: [
        { q: "'උදෑසන' සමාන පදය කුමක්ද?", options: ['පාන්දර', 'රාත්‍රිය', 'දවල්'], ans: 'පාන්දර' },
        { q: "'කුරුල්ලා' සමාන පදය කුමක්ද?", options: ['පක්ෂියා', 'මාළුවා', 'ගවයා'], ans: 'පක්ෂියා' },
        { q: "'පොත' සමාන පදය කුමක්ද?", options: ['ග්‍රන්ථය', 'ලේඛනය', 'පෑන'], ans: 'ග්‍රන්ථය' },
        { q: "'පාදය' සමාන පදය කුමක්ද?", options: ['පය', 'අත', 'හිස'], ans: 'පය' },
        { q: "'වතුර' සමාන පදය කුමක්ද?", options: ['ජලය', 'ගින්න', 'වැලි'], ans: 'ජලය' }
      ]
    },
    {
      id: 'REM_G4_C1_02',
      title: 'පරිසර හා හැඟීම් සමාන පද (Nature & Emotion Synonyms)',
      sub: 'ස්වභාවධර්මය හා හැඟීම් දැක්වෙන සමාන පද ගළපන්න',
      difficulty: 'Medium',
      targetSkill: 'Nature & emotion vocabulary',
      items: [
        { q: "'ගස' සමාන පදය කුමක්ද?", options: ['වෘක්ෂය', 'මල', 'පලතුර'], ans: 'වෘක්ෂය' },
        { q: "'අහස' සමාන පදය කුමක්ද?", options: ['ගුවන', 'පොළොව', 'මුහුද'], ans: 'ගුවන' },
        { q: "'සතුට' සමාන පදය කුමක්ද?", options: ['ප්‍රීතිය', 'දුක', 'බිය'], ans: 'ප්‍රීතිය' },
        { q: "'සුළඟ' සමාන පදය කුමක්ද?", options: ['පවන', 'වර්ෂාව', 'ගින්න'], ans: 'පවන' },
        { q: "'මුහුද' සමාන පදය කුමක්ද?", options: ['සයුර', 'කන්ද', 'වැව'], ans: 'සයුර' }
      ]
    },
    {
      id: 'REM_G4_C1_03',
      title: 'උසස් සමාන පද හා සන්දර්භය (Advanced Context Synonyms)',
      sub: 'වාක්‍ය සන්දර්භයට ගැළපෙන සමාන පද තෝරන්න',
      difficulty: 'Hard',
      targetSkill: 'Advanced lexical semantics',
      items: [
        { q: "'දක්ෂ' සමාන පදය කුමක්ද?", options: ['සමර්ථ', 'අලස', 'දුර්‍වල'], ans: 'සමර්ථ' },
        { q: "'ශක්තිමත්' සමාන පදය කුමක්ද?", options: ['බලවත්', 'කුඩා', 'මන්ද'], ans: 'බලවත්' },
        { q: "'නිහඬ' සමාන පදය කුමක්ද?", options: ['නිශ්ශබ්ද', 'ඝෝෂාකාරී', 'කඩිසර'], ans: 'නිශ්ශබ්ද' },
        { q: "'කෑම' සමාන පදය කුමක්ද?", options: ['බොජුන්', 'ඇඳුම්', 'පොත්'], ans: 'බොජුන්' },
        { q: "'පාර' සමාන පදය කුමක්ද?", options: ['මාවත', 'නිවස', 'ගස'], ans: 'මාවත' }
      ]
    }
  ],
  C2: [
    {
      id: 'REM_G4_C2_01',
      title: 'ප්‍රමාණය හා භෞතික ගුණ විරුද්ධ පද (Size & Physical Antonyms)',
      sub: 'ප්‍රමාණය හා බර දැක්වෙන ප්‍රතිවිරුද්ධ පද තෝරන්න',
      difficulty: 'Easy',
      targetSkill: 'Physical attributes antonyms',
      items: [
        { q: "'ලොකු' විරුද්ධ පදය කුමක්ද?", options: ['කුඩා', 'උස', 'මහත'], ans: 'කුඩා' },
        { q: "'උස' විරුද්ධ පදය කුමක්ද?", options: ['මිටි', 'දිග', 'පළල්'], ans: 'මිටි' },
        { q: "'බර' විරුද්ධ පදය කුමක්ද?", options: ['සැහැල්ලු', 'විශාල', 'පරණ'], ans: 'සැහැල්ලු' },
        { q: "'දිග' විරුද්ධ පදය කුමක්ද?", options: ['කෙටි', 'ළඟ', 'පළල්'], ans: 'කෙටි' },
        { q: "'පළල්' විරුද්ධ පදය කුමක්ද?", options: ['පටු', 'දිග', 'උස'], ans: 'පටු' }
      ]
    },
    {
      id: 'REM_G4_C2_02',
      title: 'කාලය, තත්ත්ව හා හැඟීම් විරුද්ධ පද (Time & Condition Antonyms)',
      sub: 'කාලය හා තත්ත්වයන්ගේ ප්‍රතිවිරුද්ධ පද හඳුනාගනිමු',
      difficulty: 'Medium',
      targetSkill: 'Temporal and emotional antonyms',
      items: [
        { q: "'දවල්' විරුද්ධ පදය කුමක්ද?", options: ['රාත්‍රිය', 'සවස', 'උදේ'], ans: 'රාත්‍රිය' },
        { q: "'පිරිසිදු' විරුද්ධ පදය කුමක්ද?", options: ['අපිරිසිදු', 'ලස්සන', 'පරණ'], ans: 'අපිරිසිදු' },
        { q: "'උණුසුම්' විරුද්ධ පදය කුමක්ද?", options: ['සීතල', 'තෙත්', 'වියළි'], ans: 'සීතල' },
        { q: "'සතුට' විරුද්ධ පදය කුමක්ද?", options: ['දුක', 'සිනහව', 'සෙල්ලම'], ans: 'දුක' },
        { q: "'අලුත්' විරුද්ධ පදය කුමක්ද?", options: ['පරණ', 'නව', 'ලස්සන'], ans: 'පරණ' }
      ]
    },
    {
      id: 'REM_G4_C2_03',
      title: 'උසස් ක්‍රියා හා සංකල්ප විරුද්ධ පද (Advanced Antonyms)',
      sub: 'ක්‍රියා සහ සංකල්පවල විරුද්ධ පද ගළපන්න',
      difficulty: 'Hard',
      targetSkill: 'Advanced conceptual antonyms',
      items: [
        { q: "'පැමිණීම' විරුද්ධ පදය කුමක්ද?", options: ['පිටවීම', 'ඇතුළුවීම', 'සිටීම'], ans: 'පිටවීම' },
        { q: "'අවශ්‍ය' විරුද්ධ පදය කුමක්ද?", options: ['අනවශ්‍ය', 'වටිනා', 'හිතකර'], ans: 'අනවශ්‍ය' },
        { q: "'පුහුණු' විරුද්ධ පදය කුමක්ද?", options: ['නුපුහුණු', 'දක්ෂ', 'අලස'], ans: 'නුපුහුණු' },
        { q: "'ජය' විරුද්ධ පදය කුමක්ද?", options: ['පරාජය', 'සතුට', 'බය'], ans: 'පරාජය' },
        { q: "'ගැඹුරු' විරුද්ධ පදය කුමක්ද?", options: ['නොගැඹුරු', 'පළල්', 'උස'], ans: 'නොගැඹුරු' }
      ]
    }
  ],
  C3: [
    {
      id: 'REM_G4_C3_01',
      title: 'ප්‍රස්තාව පිරුළු සම්පූර්ණ කරමු (Proverbs Mastery)',
      sub: 'ප්‍රකට ප්‍රස්තාව පිරුළු නිවැරදිව සම්පූර්ණ කරන්න',
      difficulty: 'Easy',
      targetSkill: 'Proverb recall',
      items: [
        { q: "“කබලෙන් ______ වැටුණා වගේ.”", options: ['ලිපට', 'ගසට', 'වතුරට'], ans: 'ලිපට' },
        { q: "“නටන්න බැරි මිනිහාට ______ ඇදයි වගේ.”", options: ['පොළොව', 'අහස', 'ගස'], ans: 'පොළොව' },
        { q: "“ඉඟුරු දී ______ ගත්තා වගේ.”", options: ['මිරිස්', 'සීනි', 'ලුණු'], ans: 'මිරිස්' },
        { q: "“ගිය දේ ______ වගේ.”", options: ['ගියා', 'ආවා', 'නැවතුණා'], ans: 'ගියා' },
        { q: "“අතේ ______ වගේ.”", options: ['මාට්ටු', 'මල්', 'පොත්'], ans: 'මාට්ටු' }
      ]
    },
    {
      id: 'REM_G4_C3_02',
      title: 'ඉඟි වැකි අර්ථ විවරණය (Idiom Meanings)',
      sub: 'ජනප්‍රිය ඉඟි වැකිවල අර්ථය හඳුනාගන්න',
      difficulty: 'Medium',
      targetSkill: 'Idiom semantics',
      items: [
        { q: "'නිතර පොත් කියවන්නා' හඳුන්වන්නේ කුමන ඉඟි වැකියෙන්ද?", options: ['පොත් ගුල්ලා', 'හණමිටිකාරයා', 'ඇඹලයා'], ans: 'පොත් ගුල්ලා' },
        { q: "'ඉතා තද වැස්ස' හඳුන්වන ඉඟි වැකිය කුමක්ද?", options: ['මොර සූරණ වැස්ස', 'හාවක් හුවක් නැහැ', 'දවල් හීන'], ans: 'මොර සූරණ වැස්ස' },
        { q: "'මහත් සතුටක් ලැබීම' දැක්වෙන ඉඟි වැකිය කුමක්ද?", options: ['ඉහේ මලක් පිපීම', 'සායම ගියා', 'මුහුණ ඇඹුල් වීම'], ans: 'ඉහේ මලක් පිපීම' },
        { q: "'ඉතා සෙමින් ගමන් කිරීම' හඳුන්වන්නේ කුමන ඉඟි වැකියෙන්ද?", options: ['ඉබි ගමන', 'ඊ ගහක වේගයෙන්', 'කුකුලු නින්ද'], ans: 'ඉබි ගමන' },
        { q: "'හොඳම මිතුරා' හඳුන්වන ඉඟි වැකිය කුමක්ද?", options: ['අඹ යාලුවා', 'හණමිටිකාරයා', 'ඇඹලයා'], ans: 'අඹ යාලුවා' }
      ]
    },
    {
      id: 'REM_G4_C3_03',
      title: 'සන්දර්භානුකූල ඉඟි වැකි (Situational Idioms)',
      sub: 'විවිධ අවස්ථාවලට ගැළපෙන ඉඟි වැකි තෝරන්න',
      difficulty: 'Hard',
      targetSkill: 'Contextual idiom usage',
      items: [
        { q: "'අවස්ථාව එන තෙක් බලා සිටීම' දැක්වෙන ඉඟි වැකිය කුමක්ද?", options: ['හොර ගල් ඇහිලීම', 'උඩින් පල්ලෙන්', 'කරල පැහීම'], ans: 'හොර ගල් ඇහිලීම' },
        { q: "'පරණ මතවලම එල්බ සිටින්නා' හඳුන්වන්නේ කුමක් ලෙසද?", options: ['හණමිටිකාරයා', 'පොත් ගුල්ලා', 'අඹ යාලුවා'], ans: 'හණමිටිකාරයා' },
        { q: "'නරක ක්‍රියාවකට අනුබල දීම' හඳුන්වන්නේ කුමක් ලෙසද?", options: ['උල්පන්දම් දීම', 'අත දීම', 'පෙරලා පැමිණීම'], ans: 'උල්පන්දම් දීම' },
        { q: "'ඉතා වේගයෙන් යෑම' දැක්වෙන ඉඟි වැකිය කුමක්ද?", options: ['ඊ ගහක වේගයෙන්', 'ඉබි ගමන', 'කුකුලු නින්ද'], ans: 'ඊ ගහක වේගයෙන්' },
        { q: "'නම්බුව හෝ ගෞරවය නැති වීම' හඳුන්වන්නේ කුමන යෙදුමෙන්ද?", options: ['සායම ගියා', 'ඉහේ මලක් පිපුණා', 'මුහුණ ඇඹුල් වුණා'], ans: 'සායම ගියා' }
      ]
    }
  ],
  C4: [
    {
      id: 'REM_G4_C4_01',
      title: 'කාලය හා කථන-ලිඛිත පරිවර්තනය (Tenses & Spoken-Written)',
      sub: 'කථන වාක්‍ය නිවැරදි ලිඛිත භාෂාවට හරවන්න',
      difficulty: 'Easy',
      targetSkill: 'Spoken-to-written transformation',
      items: [
        { q: "“මම පාසලට යනවා.” ලිඛිත භාෂාවට හැරවූ විට?", options: ['මම පාසලට යමි.', 'මම පාසලට යයි.', 'මම පාසලට යති.'], ans: 'මම පාසලට යමි.' },
        { q: "“ඔහු පොත කියවනවා.” ලිඛිත භාෂාවට හැරවූ විට?", options: ['ඔහු පොත කියවයි.', 'ඔහු පොත කියවමි.', 'ඔහු පොත කියවති.'], ans: 'ඔහු පොත කියවයි.' },
        { q: "“අපි පන්සල් යනවා.” ලිඛිත භාෂාවට හැරවූ විට?", options: ['අපි පන්සල් යමු.', 'අපි පන්සල් යයි.', 'අපි පන්සල් යති.'], ans: 'අපි පන්සල් යමු.' },
        { q: "“ළමයි සෙල්ලම් කරනවා.” ලිඛිත භාෂාවට හැරවූ විට?", options: ['ළමයි සෙල්ලම් කරති.', 'ළමයි සෙල්ලම් කරමි.', 'ළමයි සෙල්ලම් කරයි.'], ans: 'ළමයි සෙල්ලම් කරති.' },
        { q: "“ඔහු පොත කියවයි.” අතීත කාලයට හැරවූ විට?", options: ['ඔහු පොත කියවීය.', 'ඔහු පොත කියවති.', 'ඔහු පොත කියවමි.'], ans: 'ඔහු පොත කියවීය.' }
      ]
    },
    {
      id: 'REM_G4_C4_02',
      title: 'යුගල පද පුහුණුව (Word Pairs Mastery)',
      sub: 'නිතර භාවිත වන සම්මත යුගල පද ගළපන්න',
      difficulty: 'Medium',
      targetSkill: 'Sinhala word pairing',
      items: [
        { q: "'ගෙවල්' සමඟ එන යුගල පදය කුමක්ද?", options: ['දොරවල්', 'හෙල්', 'වතු'], ans: 'දොරවල්' },
        { q: "'කඳු' සමඟ එන යුගල පදය කුමක්ද?", options: ['හෙල්', 'වැල්', 'කොළ'], ans: 'හෙල්' },
        { q: "'ගස්' සමඟ එන යුගල පදය කුමක්ද?", options: ['වැල්', 'කොළ', 'දොරවල්'], ans: 'වැල්' },
        { q: "'අම්මා' සමඟ එන යුගල පදය කුමක්ද?", options: ['තාත්තා', 'මාමා', 'පිය'], ans: 'තාත්තා' },
        { q: "'කෑම' සමඟ එන යුගල පදය කුමක්ද?", options: ['බීම', 'රස', 'කන්න'], ans: 'බීම' }
      ]
    },
    {
      id: 'REM_G4_C4_03',
      title: 'අක්ෂර වින්‍යාසය හා උක්ත-ආඛ්‍යාත (Spelling & Agreement)',
      sub: 'ණ/න, ළ/ල සහ ක්‍රියාපද අනුරූපතාව පරීක්ෂා කරමු',
      difficulty: 'Hard',
      targetSkill: 'Spelling rules and agreement',
      items: [
        { q: "'පරිග___කය' හිස්තැනට සුදුසු අකුර තෝරන්න.", options: ['ණ', 'න', 'න්'], ans: 'ණ' },
        { q: "'වි___ෂ' හිස්තැනට සුදුසු අකුර තෝරන්න.", options: ['ෂේ', 'ශේ', 'සේ'], ans: 'ෂේ' },
        { q: "'පි___තුරු' හිස්තැනට සුදුසු අකුර තෝරන්න.", options: ['ළි', 'ලි', 'ලී'], ans: 'ළි' },
        { q: "“අපි ඊයේ සෙල්ලම් ______.” හිස්තැනට සුදුසු ආඛ්‍යාතය?", options: ['කළෙමු', 'කරමු', 'කළහ'], ans: 'කළෙමු' },
        { q: "“ගුරුතුමා පාඩම ______.” හිස්තැනට සුදුසු ආඛ්‍යාතය?", options: ['උගන්වයි', 'උගන්වමි', 'උගන්වති'], ans: 'උගන්වයි' }
      ]
    }
  ],
  C5: [
    {
      id: 'REM_G4_C5_01',
      title: 'විරාම ලක්ෂණ භාවිතය (Punctuation Rules)',
      sub: 'නියමිත තැන්වලට ගැළපෙන විරාම ලක්ෂණ තෝරන්න',
      difficulty: 'Easy',
      targetSkill: 'Punctuation mark selection',
      items: [
        { q: "“ඔයාගේ නම කුමක්ද___”", options: ['?', '.', '!'], ans: '?' },
        { q: "“මම පොතක් කියවමි___”", options: ['.', '?', '!'], ans: '.' },
        { q: "“වාව්, මේ මල හරිම ලස්සනයි___”", options: ['!', '.', '?'], ans: '!' },
        { q: "“අඹ___ පේර සහ දොඩම් කූඩයේ ඇත.”", options: [',', '.', '?'], ans: ',' },
        { q: "කෙනෙකුගේ වචන ඒ අයුරින්ම ලියන විට යොදන්නේ?", options: ['“ ”', '.', '!'], ans: '“ ”' }
      ]
    },
    {
      id: 'REM_G4_C5_02',
      title: 'කෙටි ඡේද කියවීම (Short Passage Comprehension)',
      sub: 'කෙටි ඡේද කියවා නිවැරදි තොරතුරු තෝරන්න',
      difficulty: 'Medium',
      targetSkill: 'Direct fact extraction',
      items: [
        {
          passage: 'අපේ පාසලේ ලස්සන වත්තක් ඇත. එහි විවිධ වර්ණවල මල් පිපී ඇත. උදෑසන සිසුන් වත්තට ගොස් මල් බලති.',
          q: 'පාසලේ ඇත්තේ කුමක්ද?',
          options: ['වත්තක්', 'පොකුණක්', 'කඩයක්'],
          ans: 'වත්තක්'
        },
        {
          passage: 'අපේ පාසලේ ලස්සන වත්තක් ඇත. එහි විවිධ වර්ණවල මල් පිපී ඇත. උදෑසන සිසුන් වත්තට ගොස් මල් බලති.',
          q: 'වත්තේ පිපී ඇත්තේ මොනවාද?',
          options: ['මල්', 'ගස්', 'එළවළු'],
          ans: 'මල්'
        },
        {
          passage: 'අපේ පාසලේ ලස්සන වත්තක් ඇත. එහි විවිධ වර්ණවල මල් පිපී ඇත. උදෑසන සිසුන් වත්තට ගොස් මල් බලති.',
          q: 'සිසුන් වත්තට යන්නේ කවදාද?',
          options: ['උදෑසන', 'රාත්‍රියේ', 'සවස'],
          ans: 'උදෑසන'
        },
        {
          passage: 'සෙනු පාසලෙන් නිවසට පැමිණි පසු අම්මාට උදව් කළාය. ඇය මල් පැළවලට වතුර දැමුවාය.',
          q: 'සෙනු උදව් කළේ කාටද?',
          options: ['අම්මාට', 'තාත්තාට', 'මිතුරාට'],
          ans: 'අම්මාට'
        },
        {
          passage: 'සෙනු පාසලෙන් නිවසට පැමිණි පසු අම්මාට උදව් කළාය. ඇය මල් පැළවලට වතුර දැමුවාය.',
          q: 'සෙනු මල් පැළවලට දැමුවේ කුමක්ද?',
          options: ['වතුර', 'වැලි', 'කිරි'],
          ans: 'වතුර'
        }
      ]
    },
    {
      id: 'REM_G4_C5_03',
      title: 'සන්දර්භ හා හේතු-ඵල අවබෝධය (Causal Comprehension)',
      sub: 'හේතු-ඵල සම්බන්ධතා හා හොඳ පුරුදු හඳුනාගනිමු',
      difficulty: 'Hard',
      targetSkill: 'Causal & environmental reasoning',
      items: [
        { q: 'පරිසරය රැකගැනීමට කළ හැකි හොඳම පුරුද්ද කුමක්ද?', options: ['ගස් සිටුවීම', 'ප්ලාස්ටික් දැමීම', 'ගස් කැපීම'], ans: 'ගස් සිටුවීම' },
        { q: 'ජලය අපතේ නොයැවීමට කළ යුත්තේ කුමක්ද?', options: ['දත් මදින විට නළය වැසීම', 'නළය ඇර තැබීම', 'වැඩිපුර ජලය දැමීම'], ans: 'දත් මදින විට නළය වැසීම' },
        { q: 'වර්ෂාවට පෙර අහසේ දැකිය හැක්කේ මොනවාද?', options: ['කළු වලාකුළු', 'තද අව්ව', 'තාරකා'], ans: 'කළු වලාකුළු' },
        { q: 'පොත් කියවීමෙන් ලැබෙන ප්‍රධාන ප්‍රයෝජනය කුමක්ද?', options: ['දැනුම වර්ධනය වීම', 'මුදල් ලැබීම', 'නින්ද යාම'], ans: 'දැනුම වර්ධනය වීම' },
        { q: '“ඔයා හෙට එනවාද?” යනු කුමන වර්ගයේ වාක්‍යයක්ද?', options: ['ප්‍රශ්නයක්', 'ප්‍රකාශයක්', 'විස්මයක්'], ans: 'ප්‍රශ්නයක්' }
      ]
    }
  ]
};

export const GRADE4_REMEDIAL_EXERCISES = GRADE4_REMEDIAL_EXERCISE_BANK;
export const GRADE4_REMEDIAL_BANK = GRADE4_REMEDIAL_EXERCISE_BANK;

