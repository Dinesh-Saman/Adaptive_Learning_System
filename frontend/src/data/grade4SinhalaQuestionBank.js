/**
 * grade4SinhalaQuestionBank.js
 * Comprehensive Research Item Bank for Grade 4 Sinhala 5-Paper Adaptive Assessment & Learning System
 * Categorized into 5 Research Domains (C1 - C5) with Calibrated Difficulty, Competencies, and Remedial Sets
 * Extracted directly from official Grade 4 Primary Sinhala Curricular Modules:
 * - C1: සමාන පද හා අර්ථ විචාරය (Synonyms & Lexical Semantics)
 * - C2: විරුද්ධ පද හා ප්‍රතිවිරුද්ධ අර්ථ (Antonyms & Contrasting Concepts)
 * - C3: ප්‍රස්තාව පිරුළු සහ ඉඟි වැකි (Proverbs, Idioms & Metaphors)
 * - C4: කාලය, ව්‍යාකරණ, යුගල පද හා අක්ෂර වින්‍යාසය (Tenses, Grammar, Word Pairs & Spelling)
 * - C5: කියවීම, අවබෝධය සහ විරාම ලක්ෂණ (Reading Comprehension & Punctuation)
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
  {
    "id": "G4_C1_001",
    "category": "C1",
    "competency": "Direct Synonym Recall",
    "sub_skill": "Time of day synonym",
    "difficulty": 0.2,
    "prompt": "'උදෑසන' යන්නෙහි නිවැරදි සමාන පදය කුමක්ද?",
    "options": [
      "පාන්දර",
      "රාත්‍රිය",
      "සවස",
      "දවල්"
    ],
    "answer": "පාන්දර",
    "audioPrompt": "උදෑසන යන්නෙහි නිවැරදි සමාන පදය තෝරන්න.",
    "explanation": "'උදෑසන' යනු හිරු උදාවන වේලාව වන අතර ඊට සමාන පදය 'පාන්දර' වේ."
  },
  {
    "id": "G4_C1_002",
    "category": "C1",
    "competency": "Direct Synonym Recall",
    "sub_skill": "Creature synonym",
    "difficulty": 0.25,
    "prompt": "'කුරුල්ලා' යන්නට සමාන වචනය තෝරන්න.",
    "options": [
      "පක්ෂියා",
      "මාළුවා",
      "සත්වයා",
      "ගවයා"
    ],
    "answer": "පක්ෂියා",
    "audioPrompt": "කුරුල්ලා යන්නට සමාන වචනය තෝරන්න.",
    "explanation": "'කුරුල්ලා' සහ 'පක්ෂියා' එකම අර්ථය ලබාදෙන සමාන පද වේ."
  },
  {
    "id": "G4_C1_003",
    "category": "C1",
    "competency": "Direct Synonym Recall",
    "sub_skill": "Object & Book synonym",
    "difficulty": 0.3,
    "prompt": "'පොත' සඳහා යෙදිය හැකි සමාන පදය කුමක්ද?",
    "options": [
      "ග්‍රන්ථය",
      "ලේඛනය",
      "පත්තරය",
      "පෑන"
    ],
    "answer": "ග්‍රන්ථය",
    "audioPrompt": "පොත සඳහා යෙදිය හැකි සමාන පදය කුමක්ද?",
    "explanation": "'පොත' යන්නට තවත් නමක් ලෙස 'ග්‍රන්ථය' යොදා ගනී."
  },
  {
    "id": "G4_C1_004",
    "category": "C1",
    "competency": "Contextual Synonym",
    "sub_skill": "Synonym in sentence context",
    "difficulty": 0.35,
    "prompt": "“අපේ ගෙවත්තේ විශාල ගසක් ඇත.” මෙහි 'විශාල' යන්නෙහි සමාන පදය කුමක්ද?",
    "options": [
      "ලොකු",
      "කුඩා",
      "සිහින්",
      "මිටි"
    ],
    "answer": "ලොකු",
    "audioPrompt": "විශාල යන්නෙහි සමාන පදය තෝරන්න.",
    "explanation": "'විශාල' යනු ප්‍රමාණයෙන් ඉහළ බව දැක්වීමට 'ලොකු' හෝ 'දැවැන්ත' යෙදේ."
  },
  {
    "id": "G4_C1_005",
    "category": "C1",
    "competency": "Emotion Synonyms",
    "sub_skill": "Happiness synonym triad",
    "difficulty": 0.45,
    "prompt": "'සතුට' යන හැඟීමට ගැළපෙන සමාන පදය කුමක්ද?",
    "options": [
      "ප්‍රීතිය",
      "ශෝකය",
      "කෝපය",
      "භීතිය"
    ],
    "answer": "ප්‍රීතිය",
    "audioPrompt": "සතුට යන හැඟීමට ගැළපෙන සමාන පදය කුමක්ද?",
    "explanation": "'සතුට' යන්නෙහි සමාන පදය 'ප්‍රීතිය' හෝ 'සොම්නස' වේ."
  },
  {
    "id": "G4_C1_006",
    "category": "C1",
    "competency": "Nature Synonyms",
    "sub_skill": "Environmental element mapping",
    "difficulty": 0.5,
    "prompt": "'සුළඟ' යන්නට සමාන පදය තෝරන්න.",
    "options": [
      "පවන",
      "වර්ෂාව",
      "ගින්න",
      "දිය"
    ],
    "answer": "පවන",
    "audioPrompt": "සුළඟ යන්නට සමාන පදය තෝරන්න.",
    "explanation": "'සුළඟ' හැඳින්වීමට 'පවන' හෝ 'වාතය' යොදා ගනී."
  },
  {
    "id": "G4_C1_007",
    "category": "C1",
    "competency": "Character Attributes",
    "sub_skill": "Virtue & skill synonym",
    "difficulty": 0.6,
    "prompt": "'දක්ෂ' ශිෂ්‍යයෙකු හැඳින්වීමට ගැළපෙන සමාන පදය කුමක්ද?",
    "options": [
      "සමර්ථ",
      "අලස",
      "දුර්‍වල",
      "බියගුලු"
    ],
    "answer": "සමර්ථ",
    "audioPrompt": "දක්ෂ යන්නට ගැළපෙන සමාන පදය කුමක්ද?",
    "explanation": "'දක්ෂ' යනු හැකියාව ඇති කෙනෙකු වන අතර ඊට සමාන පදය 'සමර්ථ' වේ."
  },
  {
    "id": "G4_C1_008",
    "category": "C1",
    "competency": "Contextual Replacement",
    "sub_skill": "Semantic preservation under replacement",
    "difficulty": 0.65,
    "prompt": "“සූර්‍යා නැගෙනහිරින් උදා වේ.” මෙහි 'සූර්‍යා' වෙනුවට යෙදිය හැකි සුදුසුම පදය කුමක්ද?",
    "options": [
      "හිරු",
      "සඳ",
      "තරුව",
      "වලාකුළ"
    ],
    "answer": "හිරු",
    "audioPrompt": "සූර්‍යා වෙනුවට යෙදිය හැකි සුදුසුම පදය තෝරන්න.",
    "explanation": "'සූර්‍යා' හඳුන්වන තවත් නමකි 'හිරු', 'දිනකර' හෝ 'භාස්කර'."
  },
  {
    "id": "G4_C1_009",
    "category": "C1",
    "competency": "Odd-One-Out Identification",
    "sub_skill": "Synonym group intruder detection",
    "difficulty": 0.7,
    "prompt": "පහත පද අතරින් සමාන පද කාණ්ඩයට අයත් නොවන වචනය කුමක්ද?",
    "options": [
      "පොත",
      "ග්‍රන්ථය",
      "පොතපත",
      "පෑන"
    ],
    "answer": "පෑන",
    "audioPrompt": "සමාන පද කාණ්ඩයට අයත් නොවන වචනය තෝරන්න.",
    "explanation": "'පොත', 'ග්‍රන්ථය' සහ 'පොතපත' සමාන අර්ථ දෙන අතර 'පෑන' ලිවීමේ උපකරණයකි."
  },
  {
    "id": "G4_C1_010",
    "category": "C1",
    "competency": "Triple Synonym Chain",
    "sub_skill": "Complex multi-synonym recognition",
    "difficulty": 0.8,
    "prompt": "'මුහුද' හැඳින්වීමට යෙදෙන සමාන පද යුගලය තෝරන්න.",
    "options": [
      "සයුර, සාගරය",
      "ගංගාව, ඇළ",
      "පොකුණ, විල",
      "කන්ද, පර්වතය"
    ],
    "answer": "සයුර, සාගරය",
    "audioPrompt": "මුහුද සඳහා යෙදෙන සමාන පද යුගලය තෝරන්න.",
    "explanation": "'මුහුද' හැඳින්වීමට 'සයුර', 'සාගරය' සහ 'මහ මුහුද' යොදා ගනී."
  },
  {
    "id": "G4_C1_011",
    "category": "C1",
    "competency": "Direct Synonym Recall",
    "sub_skill": "Body part synonym",
    "difficulty": 0.2,
    "prompt": "'පාදය' යන්නට සමාන වචනය කුමක්ද?",
    "options": [
      "පය",
      "අත",
      "හිස",
      "ඇස"
    ],
    "answer": "පය",
    "audioPrompt": "පාදය යන්නට සමාන වචනය තෝරන්න.",
    "explanation": "'පාදය' සහ 'පය' සමාන අර්ථ දෙන පද වේ."
  },
  {
    "id": "G4_C1_012",
    "category": "C1",
    "competency": "Direct Synonym Recall",
    "sub_skill": "Water synonym",
    "difficulty": 0.2,
    "prompt": "'වතුර' සඳහා යෙදෙන සම්මත සමාන පදය කුමක්ද?",
    "options": [
      "ජලය",
      "ගින්න",
      "පවන",
      "පස"
    ],
    "answer": "ජලය",
    "audioPrompt": "වතුර සඳහා යෙදෙන සමාන පදය තෝරන්න.",
    "explanation": "'වතුර' සහ 'ජලය' යනු එකම ද්‍රවය හැඳින්වෙන සමාන පද වේ."
  },
  {
    "id": "G4_C1_013",
    "category": "C1",
    "competency": "Direct Synonym Recall",
    "sub_skill": "Home synonym",
    "difficulty": 0.25,
    "prompt": "'නිවස' යන්නට ගැළපෙන සමාන පදය කුමක්ද?",
    "options": [
      "ගෙදර",
      "පාසල",
      "කඩය",
      "වත්ත"
    ],
    "answer": "ගෙදර",
    "audioPrompt": "නිවස යන්නට ගැළපෙන සමාන පදය තෝරන්න.",
    "explanation": "'නිවස', 'ගෙදර' සහ 'වාසස්ථානය' සමාන පද වේ."
  },
  {
    "id": "G4_C1_014",
    "category": "C1",
    "competency": "Direct Synonym Recall",
    "sub_skill": "Friend synonym",
    "difficulty": 0.3,
    "prompt": "'මිතුරා' යන්නට සමාන වචනය තෝරන්න.",
    "options": [
      "යහළුවා",
      "සතුරා",
      "ගුරුවරයා",
      "අසල්වැසියා"
    ],
    "answer": "යහළුවා",
    "audioPrompt": "මිතුරා යන්නට සමාන වචනය තෝරන්න.",
    "explanation": "'මිතුරා' සහ 'යහළුවා' සමාන අර්ථ ඇති පද වේ."
  },
  {
    "id": "G4_C1_015",
    "category": "C1",
    "competency": "Direct Synonym Recall",
    "sub_skill": "Speed synonym",
    "difficulty": 0.35,
    "prompt": "'ඉක්මනින්' යන්නට වඩාත් ගැළපෙන සමාන පදය කුමක්ද?",
    "options": [
      "කඩිනමින්",
      "සෙමින්",
      "නිහඬව",
      "ප්‍රමාදව"
    ],
    "answer": "කඩිනමින්",
    "audioPrompt": "ඉක්මනින් යන්නට සමාන පදය තෝරන්න.",
    "explanation": "'ඉක්මනින්' සහ 'කඩිනමින්' වේගයෙන් සිදුවීම දැක්වෙන සමාන පද වේ."
  },
  {
    "id": "G4_C1_016",
    "category": "C1",
    "competency": "Nature Synonyms",
    "sub_skill": "Tree synonym",
    "difficulty": 0.3,
    "prompt": "'ගස' සඳහා භාවිත වන තවත් නමක් තෝරන්න.",
    "options": [
      "වෘක්ෂය",
      "මල",
      "පලතුර",
      "වැළ"
    ],
    "answer": "වෘක්ෂය",
    "audioPrompt": "ගස සඳහා භාවිත වන තවත් නමක් තෝරන්න.",
    "explanation": "'ගස' සහ 'වෘක්ෂය' හෝ 'තුරු' සමාන පද වේ."
  },
  {
    "id": "G4_C1_017",
    "category": "C1",
    "competency": "Nature Synonyms",
    "sub_skill": "Sky synonym",
    "difficulty": 0.35,
    "prompt": "'අහස' යන්නෙහි නිවැරදි සමාන පදය කුමක්ද?",
    "options": [
      "ගුවන",
      "පොළොව",
      "මුහුද",
      "කන්ද"
    ],
    "answer": "ගුවන",
    "audioPrompt": "අහස යන්නෙහි නිවැරදි සමාන පදය තෝරන්න.",
    "explanation": "'අහස', 'ගුවන' සහ 'ආකාශය' සමාන පද වේ."
  },
  {
    "id": "G4_C1_018",
    "category": "C1",
    "competency": "Nature Synonyms",
    "sub_skill": "Earth synonym",
    "difficulty": 0.4,
    "prompt": "'පොළොව' යන්නෙහි සමාන පදය කුමක්ද?",
    "options": [
      "භූමිය",
      "අහස",
      "ගුවන",
      "සයුර"
    ],
    "answer": "භූමිය",
    "audioPrompt": "පොළොව යන්නෙහි සමාන පදය තෝරන්න.",
    "explanation": "'පොළොව', 'භූමිය' සහ 'මිහිකත' සමාන පද වේ."
  },
  {
    "id": "G4_C1_019",
    "category": "C1",
    "competency": "Nature Synonyms",
    "sub_skill": "Mountain synonym",
    "difficulty": 0.45,
    "prompt": "'කන්ද' හැඳින්වීමට යෙදෙන තවත් වචනයක් තෝරන්න.",
    "options": [
      "ගිර",
      "ගඟ",
      "මුහුද",
      "වෙරළ"
    ],
    "answer": "ගිර",
    "audioPrompt": "කන්ද හැඳින්වීමට යෙදෙන වචනය තෝරන්න.",
    "explanation": "'කන්ද' හැඳින්වීමට 'ගිර' හෝ 'පර්වතය' යොදයි."
  },
  {
    "id": "G4_C1_020",
    "category": "C1",
    "competency": "Nature Synonyms",
    "sub_skill": "Forest synonym",
    "difficulty": 0.45,
    "prompt": "'වනාන්තරය' යන්නට ගැළපෙන සමාන පදය කුමක්ද?",
    "options": [
      "කැලය",
      "වත්ත",
      "නගරය",
      "ගම"
    ],
    "answer": "කැලය",
    "audioPrompt": "වනාන්තරය යන්නට ගැළපෙන සමාන පදය තෝරන්න.",
    "explanation": "'වනාන්තරය', 'කැලය' සහ 'අරණ' සමාන පද වේ."
  },
  {
    "id": "G4_C1_021",
    "category": "C1",
    "competency": "Nature Synonyms",
    "sub_skill": "Flower synonym",
    "difficulty": 0.35,
    "prompt": "'මල' යන්නට යෙදෙන සම්මත සමාන පදය කුමක්ද?",
    "options": [
      "පුෂ්පය",
      "ගස",
      "කොළය",
      "ගෙඩිය"
    ],
    "answer": "පුෂ්පය",
    "audioPrompt": "මල යන්නට යෙදෙන සමාන පදය තෝරන්න.",
    "explanation": "'මල' හැඳින්වීමට 'පුෂ්පය' හෝ 'කුසුම' යොදයි."
  },
  {
    "id": "G4_C1_022",
    "category": "C1",
    "competency": "Nature Synonyms",
    "sub_skill": "Moon synonym",
    "difficulty": 0.4,
    "prompt": "'සඳ' සඳහා යෙදෙන සුදුසුම සමාන පදය තෝරන්න.",
    "options": [
      "චන්ද්‍රයා",
      "සූර්‍යා",
      "හිරු",
      "වලාකුළ"
    ],
    "answer": "චන්ද්‍රයා",
    "audioPrompt": "සඳ සඳහා යෙදෙන සමාන පදය තෝරන්න.",
    "explanation": "'සඳ', 'චන්ද්‍රයා' සහ 'හඳ' සමාන පද වේ."
  },
  {
    "id": "G4_C1_023",
    "category": "C1",
    "competency": "Nature Synonyms",
    "sub_skill": "Rain synonym",
    "difficulty": 0.45,
    "prompt": "'වැස්ස' සඳහා යෙදිය හැකි සමාන පදය කුමක්ද?",
    "options": [
      "වර්ෂාව",
      "පවන",
      "අව්ව",
      "හිම"
    ],
    "answer": "වර්ෂාව",
    "audioPrompt": "වැස්ස සඳහා යෙදිය හැකි සමාන පදය තෝරන්න.",
    "explanation": "'වැස්ස' සහ 'වර්ෂාව' එකම අර්ථය ලබාදේ."
  },
  {
    "id": "G4_C1_024",
    "category": "C1",
    "competency": "Nature Synonyms",
    "sub_skill": "Fire synonym",
    "difficulty": 0.5,
    "prompt": "'ගින්න' හැඳින්වීමට යෙදෙන සමාන පදය කුමක්ද?",
    "options": [
      "ගිනිදැල්ල",
      "ජලය",
      "සුළඟ",
      "පස"
    ],
    "answer": "ගිනිදැල්ල",
    "audioPrompt": "ගින්න හැඳින්වීමට යෙදෙන සමාන පදය තෝරන්න.",
    "explanation": "'ගින්න' සහ 'ගිනිදැල්ල' හෝ 'අග්නිය' සමාන අර්ථ දරයි."
  },
  {
    "id": "G4_C1_025",
    "category": "C1",
    "competency": "Character Attributes",
    "sub_skill": "Quietness synonym",
    "difficulty": 0.4,
    "prompt": "'නිහඬ' යන්නට සමාන වචනය කුමක්ද?",
    "options": [
      "නිශ්ශබ්ද",
      "ඝෝෂාකාරී",
      "කඩිසර",
      "බියගුලු"
    ],
    "answer": "නිශ්ශබ්ද",
    "audioPrompt": "නිහඬ යන්නට සමාන වචනය තෝරන්න.",
    "explanation": "'නිහඬ' සහ 'නිශ්ශබ්ද' ශබ්දයක් නැති බව දක්වයි."
  },
  {
    "id": "G4_C1_026",
    "category": "C1",
    "competency": "Character Attributes",
    "sub_skill": "Strength synonym",
    "difficulty": 0.45,
    "prompt": "'ශක්තිමත්' යන්නෙහි සමාන පදය තෝරන්න.",
    "options": [
      "බලවත්",
      "දුර්‍වල",
      "කුඩා",
      "මන්දගාමී"
    ],
    "answer": "බලවත්",
    "audioPrompt": "ශක්තිමත් යන්නෙහි සමාන පදය තෝරන්න.",
    "explanation": "'ශක්තිමත්' සහ 'බලවත්' එක සමාන ගුණාංගයකි."
  },
  {
    "id": "G4_C1_027",
    "category": "C1",
    "competency": "Character Attributes",
    "sub_skill": "Wisdom synonym",
    "difficulty": 0.55,
    "prompt": "'බුද්ධිමත්' යන්නෙහි සමාන පදය කුමක්ද?",
    "options": [
      "නැණවත්",
      "මෝඩ",
      "අලස",
      "බියගුලු"
    ],
    "answer": "නැණවත්",
    "audioPrompt": "බුද්ධිමත් යන්නෙහි සමාන පදය තෝරන්න.",
    "explanation": "'බුද්ධිමත්' සහ 'නැණවත්' යනු නුවණැති බවයි."
  },
  {
    "id": "G4_C1_028",
    "category": "C1",
    "competency": "Contextual Replacement",
    "sub_skill": "Path synonym in sentence",
    "difficulty": 0.4,
    "prompt": "“අපි දිගු පාරක් දිගේ ගමන් කළෙමු.” මෙහි 'පාර' යන්නට සමාන පදය කුමක්ද?",
    "options": [
      "මාවත",
      "නිවස",
      "කන්ද",
      "ගස"
    ],
    "answer": "මාවත",
    "audioPrompt": "පාර යන්නට සමාන පදය තෝරන්න.",
    "explanation": "'පාර' සහ 'මාවත' එකම තේරුම ලබා දෙයි."
  },
  {
    "id": "G4_C1_029",
    "category": "C1",
    "competency": "Action Synonyms",
    "sub_skill": "Help synonym",
    "difficulty": 0.4,
    "prompt": "'උදව්' යන්නෙහි සමාන පදය තෝරන්න.",
    "options": [
      "උපකාර",
      "බාධා",
      "දඬුවම්",
      "සෙල්ලම්"
    ],
    "answer": "උපකාර",
    "audioPrompt": "උදව් යන්නෙහි සමාන පදය තෝරන්න.",
    "explanation": "'උදව්' සහ 'උපකාර' සමාන අර්ථ දරයි."
  },
  {
    "id": "G4_C1_030",
    "category": "C1",
    "competency": "Sensory Synonyms",
    "sub_skill": "Fragrance synonym",
    "difficulty": 0.5,
    "prompt": "'සුවඳ' යන්නට ගැළපෙන සමාන පදය කුමක්ද?",
    "options": [
      "සුගන්ධය",
      "ශබ්දය",
      "ආලෝකය",
      "දුගඳ"
    ],
    "answer": "සුගන්ධය",
    "audioPrompt": "සුවඳ යන්නට ගැළපෙන සමාන පදය තෝරන්න.",
    "explanation": "'සුවඳ' යනු ප්‍රියජනක ගන්ධය වන අතර ඊට 'සුගන්ධය' යොදයි."
  },
  {
    "id": "G4_C2_001",
    "category": "C2",
    "competency": "Physical Magnitude Antonym",
    "sub_skill": "Spatial size opposition",
    "difficulty": 0.2,
    "prompt": "'ලොකු' යන්නෙහි විරුද්ධ පදය කුමක්ද?",
    "options": [
      "කුඩා",
      "මහත",
      "උස",
      "පළල්"
    ],
    "answer": "කුඩා",
    "audioPrompt": "ලොකු යන්නෙහි විරුද්ධ පදය තෝරන්න.",
    "explanation": "'ලොකු' යන්නෙහි ප්‍රතිවිරුද්ධ අර්ථය වන්නේ 'කුඩා' හෝ 'පොඩි' යන්නයි."
  },
  {
    "id": "G4_C2_002",
    "category": "C2",
    "competency": "Spatial Elevation Antonym",
    "sub_skill": "Height opposition",
    "difficulty": 0.25,
    "prompt": "'උස' යන්නෙහි විරුද්ධ පදය කුමක්ද?",
    "options": [
      "මිටි",
      "දිග",
      "මහත",
      "කෙටි"
    ],
    "answer": "මිටි",
    "audioPrompt": "උස යන්නෙහි විරුද්ධ පදය තෝරන්න.",
    "explanation": "'උස' යන්නෙහි විරුද්ධ පදය 'මිටි' හෝ 'පහත්' වේ."
  },
  {
    "id": "G4_C2_003",
    "category": "C2",
    "competency": "Weight / Density Antonym",
    "sub_skill": "Mass opposition",
    "difficulty": 0.3,
    "prompt": "'බර' යන්නෙහි විරුද්ධ පදය තෝරන්න.",
    "options": [
      "සැහැල්ලු",
      "විශාල",
      "ඝන",
      "පරණ"
    ],
    "answer": "සැහැල්ලු",
    "audioPrompt": "බර යන්නෙහි විරුද්ධ පදය තෝරන්න.",
    "explanation": "'බර' ඇති දේක විරුද්ධ තත්ත්වය 'සැහැල්ලු' වීමයි."
  },
  {
    "id": "G4_C2_004",
    "category": "C2",
    "competency": "Linear Dimension Antonym",
    "sub_skill": "Length opposition",
    "difficulty": 0.35,
    "prompt": "'දිග' යන්නෙහි නිවැරදි විරුද්ධ පදය කුමක්ද?",
    "options": [
      "කෙටි",
      "ළඟ",
      "පළල්",
      "මිටි"
    ],
    "answer": "කෙටි",
    "audioPrompt": "දිග යන්නෙහි නිවැරදි විරුද්ධ පදය තෝරන්න.",
    "explanation": "'දිග' යන්නෙහි විරුද්ධ පදය 'කෙටි' වේ."
  },
  {
    "id": "G4_C2_005",
    "category": "C2",
    "competency": "Diurnal Cycle Antonym",
    "sub_skill": "Temporal time contrast",
    "difficulty": 0.4,
    "prompt": "'දවල්' යන්නට විරුද්ධ පදය තෝරන්න.",
    "options": [
      "රාත්‍රිය",
      "උදෑසන",
      "සවස",
      "පාන්දර"
    ],
    "answer": "රාත්‍රිය",
    "audioPrompt": "දවල් යන්නට විරුද්ධ පදය තෝරන්න.",
    "explanation": "'දවල්' (දිවා කාලය) යන්නෙහි විරුද්ධ පදය 'රාත්‍රිය' (රැය) වේ."
  },
  {
    "id": "G4_C2_006",
    "category": "C2",
    "competency": "Thermal State Antonym",
    "sub_skill": "Temperature contrast",
    "difficulty": 0.45,
    "prompt": "'උණුසුම්' යන්නෙහි විරුද්ධ පදය කුමක්ද?",
    "options": [
      "සීතල",
      "තෙත්",
      "වියළි",
      "රස්නය"
    ],
    "answer": "සීතල",
    "audioPrompt": "උණුසුම් යන්නෙහි විරුද්ධ පදය තෝරන්න.",
    "explanation": "'උණුසුම්' යන්නෙහි විරුද්ධ පදය 'සීතල' වේ."
  },
  {
    "id": "G4_C2_007",
    "category": "C2",
    "competency": "Surface / Hygiene Antonym",
    "sub_skill": "Cleanliness opposition",
    "difficulty": 0.5,
    "prompt": "'පිරිසිදු' යන්නෙහි විරුද්ධ පදය තෝරන්න.",
    "options": [
      "අපිරිසිදු",
      "ලස්සන",
      "පරණ",
      "අලුත්"
    ],
    "answer": "අපිරිසිදු",
    "audioPrompt": "පිරිසිදු යන්නෙහි විරුද්ධ පදය තෝරන්න.",
    "explanation": "'පිරිසිදු' යන්නට 'අ' උපසර්ගය එක්වීමෙන් 'අපිරිසිදු' විරුද්ධ පදය සෑදේ."
  },
  {
    "id": "G4_C2_008",
    "category": "C2",
    "competency": "Directional Mobility Antonym",
    "sub_skill": "Arrival/Departure opposition",
    "difficulty": 0.6,
    "prompt": "'පැමිණීම' යන්නෙහි විරුද්ධ පදය කුමක්ද?",
    "options": [
      "පිටවීම",
      "ඇතුළුවීම",
      "සිටීම",
      "නැවතීම"
    ],
    "answer": "පිටවීම",
    "audioPrompt": "පැමිණීම යන්නෙහි විරුද්ධ පදය තෝරන්න.",
    "explanation": "'පැමිණීම' (ළඟාවීම) යන්නෙහි විරුද්ධ පදය 'පිටවීම' වේ."
  },
  {
    "id": "G4_C2_009",
    "category": "C2",
    "competency": "Temporal Age Antonym",
    "sub_skill": "Newness vs Age contrast",
    "difficulty": 0.65,
    "prompt": "'අලුත්' යන්නෙහි විරුද්ධ පදය කුමක්ද?",
    "options": [
      "පරණ",
      "නැවුම්",
      "ලස්සන",
      "සුවඳ"
    ],
    "answer": "පරණ",
    "audioPrompt": "අලුත් යන්නෙහි විරුද්ධ පදය තෝරන්න.",
    "explanation": "'අලුත්' යන්නෙහි ප්‍රතිවිරුද්ධ පදය 'පරණ' වේ."
  },
  {
    "id": "G4_C2_010",
    "category": "C2",
    "competency": "Velocity Antonym Pair",
    "sub_skill": "Pace contrast mapping",
    "difficulty": 0.7,
    "prompt": "'වේගවත්' යන්නෙහි නිවැරදි විරුද්ධ පදය කුමක්ද?",
    "options": [
      "මන්දගාමී",
      "කඩිසර",
      "බලවත්",
      "ශක්තිමත්"
    ],
    "answer": "මන්දගාමී",
    "audioPrompt": "වේගවත් යන්නෙහි නිවැරදි විරුද්ධ පදය තෝරන්න.",
    "explanation": "'වේගවත්' යන්නට විරුද්ධව ඉතා සෙමින් සිදුවීම 'මන්දගාමී' ලෙස හැඳින්වේ."
  },
  {
    "id": "G4_C2_011",
    "category": "C2",
    "competency": "Emotion Antonym",
    "sub_skill": "Joy vs Sorrow contrast",
    "difficulty": 0.25,
    "prompt": "'සතුට' යන්නෙහි විරුද්ධ පදය කුමක්ද?",
    "options": [
      "දුක",
      "ප්‍රීතිය",
      "සිනහව",
      "සෙල්ලම"
    ],
    "answer": "දුක",
    "audioPrompt": "සතුට යන්නෙහි විරුද්ධ පදය තෝරන්න.",
    "explanation": "'සතුට' යන්නෙහි ප්‍රතිවිරුද්ධ හැඟීම 'දුක' (ශෝකය) වේ."
  },
  {
    "id": "G4_C2_012",
    "category": "C2",
    "competency": "Spatial Breadth Antonym",
    "sub_skill": "Width contrast",
    "difficulty": 0.35,
    "prompt": "'පළල්' යන්නෙහි විරුද්ධ පදය තෝරන්න.",
    "options": [
      "පටු",
      "දිග",
      "උස",
      "මිටි"
    ],
    "answer": "පටු",
    "audioPrompt": "පළල් යන්නෙහි විරුද්ධ පදය තෝරන්න.",
    "explanation": "'පළල්' මාවතකට විරුද්ධ වන්නේ 'පටු' මාවතයි."
  },
  {
    "id": "G4_C2_013",
    "category": "C2",
    "competency": "Truth Antonym",
    "sub_skill": "Honesty opposition",
    "difficulty": 0.3,
    "prompt": "'ඇත්ත' යන්නෙහි විරුද්ධ පදය කුමක්ද?",
    "options": [
      "බොරුව",
      "සත්‍යය",
      "හරි",
      "සාධාරණ"
    ],
    "answer": "බොරුව",
    "audioPrompt": "ඇත්ත යන්නෙහි විරුද්ධ පදය තෝරන්න.",
    "explanation": "'ඇත්ත' යන්නෙහි විරුද්ධ පදය 'බොරුව' (අසත්‍යය) වේ."
  },
  {
    "id": "G4_C2_014",
    "category": "C2",
    "competency": "Moral Antonym",
    "sub_skill": "Good vs Bad contrast",
    "difficulty": 0.3,
    "prompt": "'හොඳ' යන්නෙහි විරුද්ධ පදය තෝරන්න.",
    "options": [
      "නරක",
      "යහපත්",
      "ලස්සන",
      "සුවඳ"
    ],
    "answer": "නරක",
    "audioPrompt": "හොඳ යන්නෙහි විරුද්ධ පදය තෝරන්න.",
    "explanation": "'හොඳ' යන්නෙහි විරුද්ධ පදය 'නරක' වේ."
  },
  {
    "id": "G4_C2_015",
    "category": "C2",
    "competency": "Lighting Antonym",
    "sub_skill": "Light vs Dark contrast",
    "difficulty": 0.35,
    "prompt": "'එළිය' යන්නෙහි නිවැරදි විරුද්ධ පදය කුමක්ද?",
    "options": [
      "අඳුර",
      "දීප්තිය",
      "හිරු",
      "රශ්මිය"
    ],
    "answer": "අඳුර",
    "audioPrompt": "එළිය යන්නෙහි නිවැරදි විරුද්ධ පදය තෝරන්න.",
    "explanation": "'එළිය' (ආලෝකය) යන්නෙහි විරුද්ධ පදය 'අඳුර' (අන්ධකාරය) වේ."
  },
  {
    "id": "G4_C2_016",
    "category": "C2",
    "competency": "Texture Antonym",
    "sub_skill": "Hard vs Soft contrast",
    "difficulty": 0.4,
    "prompt": "'තද' යන්නෙහි විරුද්ධ පදය කුමක්ද?",
    "options": [
      "මෘදු",
      "ඝන",
      "බර",
      "විශාල"
    ],
    "answer": "මෘදු",
    "audioPrompt": "තද යන්නෙහි විරුද්ධ පදය තෝරන්න.",
    "explanation": "'තද' හෝ 'දැඩි' යන්නෙහි විරුද්ධ පදය 'මෘදු' හෝ 'ලෙහෙසි' වේ."
  },
  {
    "id": "G4_C2_017",
    "category": "C2",
    "competency": "Success Antonym",
    "sub_skill": "Victory vs Defeat contrast",
    "difficulty": 0.45,
    "prompt": "'ජය' යන්නෙහි විරුද්ධ පදය තෝරන්න.",
    "options": [
      "පරාජය",
      "සතුට",
      "උත්සවය",
      "තරගය"
    ],
    "answer": "පරාජය",
    "audioPrompt": "ජය යන්නෙහි විරුද්ධ පදය තෝරන්න.",
    "explanation": "'ජය' (ජයග්‍රහණය) යන්නෙහි විරුද්ධ පදය 'පරාජය' වේ."
  },
  {
    "id": "G4_C2_018",
    "category": "C2",
    "competency": "Distance Antonym",
    "sub_skill": "Near vs Far contrast",
    "difficulty": 0.35,
    "prompt": "'ළඟ' යන්නෙහි විරුද්ධ පදය කුමක්ද?",
    "options": [
      "දුර",
      "මෑත",
      "පිටුපස",
      "ඉදිරිය"
    ],
    "answer": "දුර",
    "audioPrompt": "ළඟ යන්නෙහි විරුද්ධ පදය තෝරන්න.",
    "explanation": "'ළඟ' (සමීප) යන්නෙහි විරුද්ධ පදය 'දුර' වේ."
  },
  {
    "id": "G4_C2_019",
    "category": "C2",
    "competency": "Character Antonym",
    "sub_skill": "Brave vs Timid contrast",
    "difficulty": 0.5,
    "prompt": "'නිර්භීත' යන්නෙහි විරුද්ධ පදය කුමක්ද?",
    "options": [
      "බියගුලු",
      "එඩිතර",
      "ශක්තිමත්",
      "දක්ෂ"
    ],
    "answer": "බියගුලු",
    "audioPrompt": "නිර්භීත යන්නෙහි විරුද්ධ පදය තෝරන්න.",
    "explanation": "'නිර්භීත' යනු බිය නැති අය වන අතර විරුද්ධ පදය 'බියගුලු' වේ."
  },
  {
    "id": "G4_C2_020",
    "category": "C2",
    "competency": "Action Antonym",
    "sub_skill": "Buy vs Sell contrast",
    "difficulty": 0.45,
    "prompt": "'මිලදී ගැනීම' යන්නෙහි විරුද්ධ පදය කුමක්ද?",
    "options": [
      "විකිණීම",
      "දීම",
      "ලැබීම",
      "හුවමාරුව"
    ],
    "answer": "විකිණීම",
    "audioPrompt": "මිලදී ගැනීම යන්නෙහි විරුද්ධ පදය තෝරන්න.",
    "explanation": "'මිලදී ගැනීම' (ගැනීම) යන්නෙහි විරුද්ධ ක්‍රියාව 'විකිණීම' වේ."
  },
  {
    "id": "G4_C2_021",
    "category": "C2",
    "competency": "Work Ethic Antonym",
    "sub_skill": "Lazy vs Active contrast",
    "difficulty": 0.45,
    "prompt": "'අලස' ශිෂ්‍යයාට විරුද්ධ ගුණාංගය කුමක්ද?",
    "options": [
      "කඩිසර",
      "මෝඩ",
      "දුර්‍වල",
      "බියගුලු"
    ],
    "answer": "කඩිසර",
    "audioPrompt": "අලස යන්නෙහි විරුද්ධ පදය තෝරන්න.",
    "explanation": "'අලස' (කම්මැලි) යන්නෙහි විරුද්ධ පදය 'කඩිසර' හෝ 'උද්‍යෝගිමත්' වේ."
  },
  {
    "id": "G4_C2_022",
    "category": "C2",
    "competency": "Depth Antonym",
    "sub_skill": "Deep vs Shallow contrast",
    "difficulty": 0.5,
    "prompt": "'ගැඹුරු' ජලාශයකට විරුද්ධ වචනය කුමක්ද?",
    "options": [
      "නොගැඹුරු",
      "විශාල",
      "පළල්",
      "දිග"
    ],
    "answer": "නොගැඹුරු",
    "audioPrompt": "ගැඹුරු යන්නෙහි විරුද්ධ පදය තෝරන්න.",
    "explanation": "'ගැඹුරු' යන්නෙහි විරුද්ධ පදය 'නොගැඹුරු' හෝ 'දිය නොපිරි' වේ."
  },
  {
    "id": "G4_C2_023",
    "category": "C2",
    "competency": "Intellect Antonym",
    "sub_skill": "Wise vs Foolish contrast",
    "difficulty": 0.5,
    "prompt": "'නුවණැති' යන්නෙහි විරුද්ධ පදය කුමක්ද?",
    "options": [
      "නුවණ නැති (මෝඩ)",
      "දක්ෂ",
      "බුද්ධිමත්",
      "සමර්ථ"
    ],
    "answer": "නුවණ නැති (මෝඩ)",
    "audioPrompt": "නුවණැති යන්නෙහි විරුද්ධ පදය තෝරන්න.",
    "explanation": "'නුවණැති' යන්නෙහි විරුද්ධ පදය 'නුවණ නැති' (මෝඩ) වේ."
  },
  {
    "id": "G4_C2_024",
    "category": "C2",
    "competency": "Friendship Antonym",
    "sub_skill": "Friend vs Enemy contrast",
    "difficulty": 0.35,
    "prompt": "'මිතුරා' යන්නෙහි නිවැරදි විරුද්ධ පදය කුමක්ද?",
    "options": [
      "සතුරා",
      "යහළුවා",
      "නෑයා",
      "ගුරුවරයා"
    ],
    "answer": "සතුරා",
    "audioPrompt": "මිතුරා යන්නෙහි විරුද්ධ පදය තෝරන්න.",
    "explanation": "'මිතුරා' යන්නෙහි විරුද්ධ පදය 'සතුරා' වේ."
  },
  {
    "id": "G4_C2_025",
    "category": "C2",
    "competency": "Position Antonym",
    "sub_skill": "Front vs Back contrast",
    "difficulty": 0.3,
    "prompt": "'ඉදිරිය' යන්නෙහි විරුද්ධ පදය කුමක්ද?",
    "options": [
      "පිටුපස",
      "ළඟ",
      "උඩ",
      "යට"
    ],
    "answer": "පිටුපස",
    "audioPrompt": "ඉදිරිය යන්නෙහි විරුද්ධ පදය තෝරන්න.",
    "explanation": "'ඉදිරිය' යන්නෙහි විරුද්ධ පදය 'පිටුපස' (පසුපස) වේ."
  },
  {
    "id": "G4_C2_026",
    "category": "C2",
    "competency": "Physical Quality Antonym",
    "sub_skill": "Wet vs Dry contrast",
    "difficulty": 0.4,
    "prompt": "'තෙත්' යන්නෙහි විරුද්ධ පදය කුමක්ද?",
    "options": [
      "වියළි",
      "සීතල",
      "උණුසුම්",
      "මෘදු"
    ],
    "answer": "වියළි",
    "audioPrompt": "තෙත් යන්නෙහි විරුද්ධ පදය තෝරන්න.",
    "explanation": "'තෙත්' වූ දේකට විරුද්ධ වන්නේ 'වියළි' වූ දෙයයි."
  },
  {
    "id": "G4_C2_027",
    "category": "C2",
    "competency": "Life Cycle Antonym",
    "sub_skill": "Birth vs Death contrast",
    "difficulty": 0.5,
    "prompt": "'උපත' යන්නෙහි විරුද්ධ පදය තෝරන්න.",
    "options": [
      "විපත (මරණය)",
      "සතුට",
      "ජීවිතය",
      "වර්ධනය"
    ],
    "answer": "විපත (මරණය)",
    "audioPrompt": "උපත යන්නෙහි විරුද්ධ පදය තෝරන්න.",
    "explanation": "'උපත' යන්නෙහි විරුද්ධ පදය 'විපත' හෝ 'මරණය' වේ."
  },
  {
    "id": "G4_C2_028",
    "category": "C2",
    "competency": "Acceptance Antonym",
    "sub_skill": "Give vs Receive contrast",
    "difficulty": 0.4,
    "prompt": "'දීම' යන්නෙහි විරුද්ධ පදය කුමක්ද?",
    "options": [
      "ගැනීම",
      "බෙදීම",
      "තැබීම",
      "විසි කිරීම"
    ],
    "answer": "ගැනීම",
    "audioPrompt": "දීම යන්නෙහි විරුද්ධ පදය තෝරන්න.",
    "explanation": "'දීම' යන්නෙහි ප්‍රතිවිරුද්ධ ක්‍රියාව 'ගැනීම' වේ."
  },
  {
    "id": "G4_C2_029",
    "category": "C2",
    "competency": "Possibility Antonym",
    "sub_skill": "Easy vs Hard contrast",
    "difficulty": 0.45,
    "prompt": "'පහසු' කාර්යයකට විරුද්ධ පදය කුමක්ද?",
    "options": [
      "අපහසු",
      "සරල",
      "කෙටි",
      "ලස්සන"
    ],
    "answer": "අපහසු",
    "audioPrompt": "පහසු යන්නෙහි විරුද්ධ පදය තෝරන්න.",
    "explanation": "'පහසු' (ලේසි) යන්නෙහි විරුද්ධ පදය 'අපහසු' (දුෂ්කර) වේ."
  },
  {
    "id": "G4_C2_030",
    "category": "C2",
    "competency": "Beginning Antonym",
    "sub_skill": "Start vs End contrast",
    "difficulty": 0.4,
    "prompt": "'ආරම්භය' යන්නෙහි විරුද්ධ පදය කුමක්ද?",
    "options": [
      "අවසානය",
      "මුල",
      "මැද",
      "පෙර"
    ],
    "answer": "අවසානය",
    "audioPrompt": "ආරම්භය යන්නෙහි විරුද්ධ පදය තෝරන්න.",
    "explanation": "'ආරම්භය' යන්නෙහි විරුද්ධ පදය 'අවසානය' (නිමාව) වේ."
  },
  {
    "id": "G4_C3_001",
    "category": "C3",
    "competency": "Proverb Completion",
    "sub_skill": "Classic Sri Lankan proverb recall",
    "difficulty": 0.3,
    "prompt": "හිස්තැන පුරවන්න: “කබලෙන් ______ වැටුණා වගේ.”",
    "options": [
      "ලිපට",
      "ගසට",
      "වතුරට",
      "ළිඳට"
    ],
    "answer": "ලිපට",
    "audioPrompt": "හිස්තැනට ගැළපෙන වචනය තෝරන්න.",
    "explanation": "එක් කරදරයකින් තවත් කරදරයකට පත්වීම දැක්වීමට 'කබලෙන් ලිපට වැටුණා වගේ' යන පිරුළ යොදයි."
  },
  {
    "id": "G4_C3_002",
    "category": "C3",
    "competency": "Proverb Semantic Interpretation",
    "sub_skill": "Deflection of fault metaphor",
    "difficulty": 0.45,
    "prompt": "“නටන්න බැරි මිනිහාට පොළොව ඇදයි වගේ” යන පිරුළෙන් අදහස් වන්නේ කුමක්ද?",
    "options": [
      "තමන්ගේ නොහැකියාව වසා ගැනීමට බාහිර දේවලට දොස් පැවරීම",
      "පොළොවේ ඇද නැති බව ප්‍රකාශ කිරීම",
      "නැටුම් හොඳින් පුහුණු වීම",
      "නටන විට බිම බලාගෙන නැටීම"
    ],
    "answer": "තමන්ගේ නොහැකියාව වසා ගැනීමට බාහිර දේවලට දොස් පැවරීම",
    "audioPrompt": "පිරුළෙන් අදහස් වන දේ තෝරන්න.",
    "explanation": "තමන්ගේ නොහැකියාව හෝ වැරැද්ද වසා ගැනීමට බාහිර දේවලට දොස් පැවරීම මෙයින් අදහස් වේ."
  },
  {
    "id": "G4_C3_003",
    "category": "C3",
    "competency": "Situational Proverb Application",
    "sub_skill": "Deteriorating trade metaphor",
    "difficulty": 0.5,
    "prompt": "ලැබුණු දෙයට වඩා අමාරු හෝ කරදරකාරී දෙයක් ලැබුණු අවස්ථාවක භාවිත කරන පිරුළ කුමක්ද?",
    "options": [
      "ඉඟුරු දී මිරිස් ගත්තා වගේ",
      "කබලෙන් ලිපට වැටුණා වගේ",
      "අතේ මාට්ටු වගේ",
      "ගිය දේ ගියා වගේ"
    ],
    "answer": "ඉඟුරු දී මිරිස් ගත්තා වගේ",
    "audioPrompt": "අවස්ථාවට ගැළපෙන ප්‍රස්තාව පිරුළ තෝරන්න.",
    "explanation": "තිත්ත ඉඟුරු වෙනුවට සැර මිරිස් ලැබුණා සේ වැඩි කරදරයක් සිදුවූ විට මෙය යෙදේ."
  },
  {
    "id": "G4_C3_004",
    "category": "C3",
    "competency": "Idiom Semantic Decoding",
    "sub_skill": "Book lover metaphorical idiom",
    "difficulty": 0.35,
    "prompt": "නිතරම පොත් කියවීමට දැඩි ආශාවක් දක්වන ශිෂ්‍යයා හඳුන්වන ඉඟි වැකිය කුමක්ද?",
    "options": [
      "පොතේ ගුල්ලා",
      "හණමිටිකාරයා",
      "ඇඹලයා",
      "අඹ යහළුවා"
    ],
    "answer": "පොතේ ගුල්ලා",
    "audioPrompt": "නිතර පොත් කියවන්නා හඳුන්වන ඉඟි වැකිය තෝරන්න.",
    "explanation": "නිතර පොත්පත් කියවන අය 'පොතේ ගුල්ලා' ලෙස හඳුන්වයි."
  },
  {
    "id": "G4_C3_005",
    "category": "C3",
    "competency": "Weather Metaphor Idiom",
    "sub_skill": "Torrential rain idiom mapping",
    "difficulty": 0.4,
    "prompt": "ඉතා තදින් නොනවත්වා ඇදහැලෙන වැස්ස හැඳින්වෙන්නේ කුමන ඉඟි වැකියෙන්ද?",
    "options": [
      "මොර සූරණ වැස්ස",
      "හාවක් හූවක් නැහැ",
      "ගල් පැලෙන බොරු",
      "දවල් හීන"
    ],
    "answer": "මොර සූරණ වැස්ස",
    "audioPrompt": "තද වැස්ස හැඳින්වෙන ඉඟි වැකිය තෝරන්න.",
    "explanation": "කඩාහැලෙන මහා තද වර්ෂාවට 'මොර සූරණ වැස්ස' යැයි කියනු ලැබේ."
  },
  {
    "id": "G4_C3_006",
    "category": "C3",
    "competency": "Emotion Metaphor Idiom",
    "sub_skill": "Supreme joy idiom mapping",
    "difficulty": 0.55,
    "prompt": "“ජයග්‍රහණය ලැබුණු විට දරුවාට මහත් සතුටක් ඇති විය.” මෙහි 'මහත් සතුට' දැක්වීමට ගැළපෙන ඉඟි වැකිය කුමක්ද?",
    "options": [
      "ඉහේ මලක් පිපුණා වගේ",
      "මුහුණ ඇඹුල් වුණා",
      "සායම ගියා",
      "කුකුල් නින්ද"
    ],
    "answer": "ඉහේ මලක් පිපුණා වගේ",
    "audioPrompt": "මහත් සතුට දැක්වෙන ඉඟි වැකිය තෝරන්න.",
    "explanation": "විශාල සතුටක් හා ප්‍රීතියක් හටගත් විට 'ඉහේ මලක් පිපුණා වගේ' යෙදේ."
  },
  {
    "id": "G4_C3_007",
    "category": "C3",
    "competency": "Pace Metaphor Idiom",
    "sub_skill": "Slow pace metaphorical expression",
    "difficulty": 0.45,
    "prompt": "ඉතා වේගයෙන් යෑම දැක්වීමට 'ඊ ගහක වේගයෙන්' යොදයි නම්, ඉතා සෙමින් යෑම දැක්වීමට යොදන්නේ කුමක්ද?",
    "options": [
      "ඉබි ගමන",
      "කුකුල් නින්ද",
      "කරල පැහීම",
      "අත දීම"
    ],
    "answer": "ඉබි ගමන",
    "audioPrompt": "ඉතා සෙමින් යෑම දැක්වෙන ඉඟි වැකිය තෝරන්න.",
    "explanation": "ඉබි ගමන යනු අතිශය මන්දගාමීව, සෙමින් ගමන් කිරීමයි."
  },
  {
    "id": "G4_C3_008",
    "category": "C3",
    "competency": "Relationship Metaphor Idiom",
    "sub_skill": "Best friend idiom mapping",
    "difficulty": 0.35,
    "prompt": "අපගේ හොඳම, ලෙන්ගතුම මිතුරා හැඳින්වීමට යෙදෙන සුදුසුම ඉඟි වැකිය කුමක්ද?",
    "options": [
      "අඹ යහළුවා",
      "හණමිටිකාරයා",
      "පොතේ ගුල්ලා",
      "ඇඹලයා"
    ],
    "answer": "අඹ යහළුවා",
    "audioPrompt": "හොඳම මිතුරා හැඳින්වෙන ඉඟි වැකිය තෝරන්න.",
    "explanation": "දැඩි මිතුරුකමකින් බැඳුණු ලෙන්ගතු මිතුරා 'අඹ යහළුවා' වේ."
  },
  {
    "id": "G4_C3_009",
    "category": "C3",
    "competency": "Strategic Patience Idiom",
    "sub_skill": "Waiting for right moment idiom",
    "difficulty": 0.65,
    "prompt": "තමන්ට වාසිදායක අවස්ථාවක් එන තෙක් බලා සිටීම හඳුන්වන්නේ කුමන ඉඟි වැකියෙන්ද?",
    "options": [
      "හොර ගල් ඇහිලීම",
      "උඩින් පල්ලෙන්",
      "කරල පැහීම",
      "දවල් හීන"
    ],
    "answer": "හොර ගල් ඇහිලීම",
    "audioPrompt": "වාසිදායක අවස්ථාවක් එන තෙක් බලා සිටීම දැක්වෙන ඉඟි වැකිය තෝරන්න.",
    "explanation": "සැඟවී සිට තමන්ට වාසිදායක මොහොතක් එන තෙක් රැක සිටීම 'හොර ගල් ඇහිලීම' වේ."
  },
  {
    "id": "G4_C3_010",
    "category": "C3",
    "competency": "Traditionalism Idiom",
    "sub_skill": "Stubborn outdated belief metaphor",
    "difficulty": 0.7,
    "prompt": "නවීන සමාජයේ යහපත් වෙනස්කම් ප්‍රතික්ෂේප කරමින් පැරණි මතවලම එල්බ සිටින්නා හඳුන්වන්නේ කුමක් ලෙසද?",
    "options": [
      "හණමිටිකාරයා",
      "පොතේ ගුල්ලා",
      "අඹ යහළුවා",
      "කරල පැසුණු අය"
    ],
    "answer": "හණමිටිකාරයා",
    "audioPrompt": "පැරණි මත දරන්නා හඳුන්වන ඉඟි වැකිය තෝරන්න.",
    "explanation": "අනාගතයට නොගැළපෙන පරණ මත දරන අය 'හණමිටිකාරයා' ලෙස හඳුන්වයි."
  },
  {
    "id": "G4_C3_011",
    "category": "C3",
    "competency": "Proverb Completion",
    "sub_skill": "Lost item acceptance proverb",
    "difficulty": 0.35,
    "prompt": "හිස්තැන පුරවන්න: “ගිය දේ ______ වගේ.”",
    "options": [
      "ගියා",
      "ආවා",
      "නැවතුණා",
      "වැටුණා"
    ],
    "answer": "ගියා",
    "audioPrompt": "හිස්තැනට සුදුසු පදය තෝරන්න.",
    "explanation": "සිදුවූ හානිය හෝ අහිමිවීම ගැන පසුතැවීම අත්හැරීම 'ගිය දේ ගියා වගේ' යනුවෙන් කියනු ලැබේ."
  },
  {
    "id": "G4_C3_012",
    "category": "C3",
    "competency": "Proverb Context",
    "sub_skill": "Caught red-handed proverb",
    "difficulty": 0.35,
    "prompt": "රහසක් හෝ වරදක් කරමින් සිටියදී කෙළින්ම අසුවීම දැක්වෙන පිරුළ කුමක්ද?",
    "options": [
      "අතේ මාට්ටු වගේ",
      "ගිය දේ ගියා වගේ",
      "කබලෙන් ලිපට",
      "ඉඟුරු දී මිරිස්"
    ],
    "answer": "අතේ මාට්ටු වගේ",
    "audioPrompt": "වරදක් කරද්දී අසුවීම දැක්වෙන පිරුළ තෝරන්න.",
    "explanation": "රහසක් එළිවීම හෝ වරදක් කරද්දීම අසුවීම 'අතේ මාට්ටු' ලෙස හැඳින්වේ."
  },
  {
    "id": "G4_C3_013",
    "category": "C3",
    "competency": "Idiom Semantic Decoding",
    "sub_skill": "Speed metaphor",
    "difficulty": 0.4,
    "prompt": "ඉතා වේගයෙන් දිවයන ශිෂ්‍යයා දැක්වීමට ගැළපෙන ඉඟි වැකිය කුමක්ද?",
    "options": [
      "ඊ ගහක වේගයෙන්",
      "ඉබි ගමන",
      "කුකුල් නින්ද",
      "දවල් හීන"
    ],
    "answer": "ඊ ගහක වේගයෙන්",
    "audioPrompt": "ඉතා වේගයෙන් යෑම දැක්වෙන ඉඟි වැකිය තෝරන්න.",
    "explanation": "දුන්නකින් විදින ලද ඊතලයක් සේ අතිශය වේගයෙන් ගමන් කිරීමට 'ඊ ගහක වේගයෙන්' යොදයි."
  },
  {
    "id": "G4_C3_014",
    "category": "C3",
    "competency": "Idiom Meaning Matching",
    "sub_skill": "Sleep pattern metaphor",
    "difficulty": 0.45,
    "prompt": "'අවදියෙන් මෙන් පසුවන ඉතා කෙටි නින්ද' හඳුන්වන ඉඟි වැකිය කුමක්ද?",
    "options": [
      "කුකුල් නින්ද",
      "ඉබි ගමන",
      "හොර ගල් ඇහිලීම",
      "සායම ගියා"
    ],
    "answer": "කුකුල් නින්ද",
    "audioPrompt": "කෙටි නින්ද හඳුන්වන ඉඟි වැකිය තෝරන්න.",
    "explanation": "සැහැල්ලුවෙන්, කුඩා ශබ්දයකටත් ඇහැරෙන සේ නිදාගැනීම 'කුකුල් නින්ද' වේ."
  },
  {
    "id": "G4_C3_015",
    "category": "C3",
    "competency": "Idiom Meaning Matching",
    "sub_skill": "Big lie metaphor",
    "difficulty": 0.4,
    "prompt": "'ඉතා විශාල, පිළිගත නොහැකි අසත්‍ය ප්‍රකාශ' හැඳින්වෙන්නේ කුමන ඉඟි වැකියෙන්ද?",
    "options": [
      "ගල් පැලෙන බොරු",
      "හාවක් හූවක්",
      "උල්පන්දම්",
      "මොර සූරණ"
    ],
    "answer": "ගල් පැලෙන බොරු",
    "audioPrompt": "විශාල බොරු හැඳින්වෙන ඉඟි වැකිය තෝරන්න.",
    "explanation": "කිසිසේත්ම විශ්වාස කළ නොහැකි විශාල ප්‍රබන්ධ 'ගල් පැලෙන බොරු' නම් වේ."
  },
  {
    "id": "G4_C3_016",
    "category": "C3",
    "competency": "Situational Idiom Usage",
    "sub_skill": "Work overload metaphor",
    "difficulty": 0.5,
    "prompt": "වැඩ රාශියක් එක්වර පිරිවරමින් පැමිණීම දැක්වීමට යෙදෙන ඉඟි වැකිය කුමක්ද?",
    "options": [
      "කර ළඟට ඒම",
      "අත දීම",
      "සායම යෑම",
      "උඩින් පල්ලෙන්"
    ],
    "answer": "කර ළඟට ඒම",
    "audioPrompt": "වැඩ අධික වීම දැක්වෙන ඉඟි වැකිය තෝරන්න.",
    "explanation": "කාර්යයන් පාලනය කරගත නොහැකි තරමට ගොඩගැසීම 'කර ළඟට ඒම' ලෙස හඳුන්වයි."
  },
  {
    "id": "G4_C3_017",
    "category": "C3",
    "competency": "Situational Idiom Usage",
    "sub_skill": "Unexpected trouble metaphor",
    "difficulty": 0.55,
    "prompt": "බලාපොරොත්තු නොවූ විශාල ගැටලුවකට මුහුණ දීමට සිදුවූ විට භාවිත වන ඉඟි වැකිය කුමක්ද?",
    "options": [
      "උඩගොස් බිම වැටීම",
      "ඉහේ මලක් පිපීම",
      "කරල පැහීම",
      "අඹ යහළුවා"
    ],
    "answer": "උඩගොස් බිම වැටීම",
    "audioPrompt": "නොසිතූ කරදරයකට පත්වීම දැක්වෙන ඉඟි වැකිය තෝරන්න.",
    "explanation": "ඉතා උසස් තත්ත්වයක සිටියදී නොසිතූ අර්බුදයකට මුහුණ දීම 'උඩගොස් බිම වැටීම' වේ."
  },
  {
    "id": "G4_C3_018",
    "category": "C3",
    "competency": "Moral Metaphor Idiom",
    "sub_skill": "Encouraging bad deed idiom",
    "difficulty": 0.55,
    "prompt": "නරක හෝ වැරදි ක්‍රියාවක් කිරීමට තවත් අයෙකු උනන්දු කිරීම හඳුන්වන්නේ කුමක් ලෙසද?",
    "options": [
      "උල්පන්දම් දීම",
      "අත දීම",
      "උපකාර කිරීම",
      "පෙරළා පැමිණීම"
    ],
    "answer": "උල්පන්දම් දීම",
    "audioPrompt": "නරක වැඩකට අනුබල දීම හඳුන්වන ඉඟි වැකිය තෝරන්න.",
    "explanation": "අයහපත් දෙයකට අනුබල දීම හෝ උසිගැන්වීම 'උල්පන්දම් දීම' වේ."
  },
  {
    "id": "G4_C3_019",
    "category": "C3",
    "competency": "Action Metaphor Idiom",
    "sub_skill": "Helping hand idiom",
    "difficulty": 0.35,
    "prompt": "අපහසුතාවට පත් මිතුරෙකුට උපකාර කිරීම හඳුන්වන සුදුසුම ඉඟි වැකිය කුමක්ද?",
    "options": [
      "අත දීම",
      "උල්පන්දම් දීම",
      "සායම ගියා",
      "මුහුණ ඇඹුල් වීම"
    ],
    "answer": "අත දීම",
    "audioPrompt": "උපකාර කිරීම හඳුන්වන ඉඟි වැකිය තෝරන්න.",
    "explanation": "කෙනෙකුට කරුණාවෙන් උපකාර කිරීම 'අත දීම' ලෙස හැඳින්වේ."
  },
  {
    "id": "G4_C3_020",
    "category": "C3",
    "competency": "Disappointment Metaphor Idiom",
    "sub_skill": "Facial disappointment idiom",
    "difficulty": 0.45,
    "prompt": "තෑග්ග නොලැබීම නිසා දරුවා දැඩි අසතුටට පත්වීම දැක්වෙන ඉඟි වැකිය කුමක්ද?",
    "options": [
      "මුහුණ ඇඹුල් වීම",
      "ඉහේ මලක් පිපීම",
      "කරල පැහීම",
      "අඹ යහළුවා"
    ],
    "answer": "මුහුණ ඇඹුල් වීම",
    "audioPrompt": "අසතුටට පත්වීම දැක්වෙන ඉඟි වැකිය තෝරන්න.",
    "explanation": "කලකිරීම, අසතුට හෝ නොසතුට මුහුණින් ප්‍රකාශ වීම 'මුහුණ ඇඹුල් වීම' නම් වේ."
  },
  {
    "id": "G4_C3_021",
    "category": "C3",
    "competency": "Reputation Loss Idiom",
    "sub_skill": "Honor loss metaphor",
    "difficulty": 0.5,
    "prompt": "වැරැද්දක් නිසා කෙනෙකුගේ ගෞරවය හා නම්බුව නැතිවී යාම හඳුන්වන ඉඟි වැකිය කුමක්ද?",
    "options": [
      "සායම ගියා",
      "ඉහේ මලක් පිපුණා",
      "කරල පැහුණා",
      "අත දුන්නා"
    ],
    "answer": "සායම ගියා",
    "audioPrompt": "ගෞරවය නැතිවීම දැක්වෙන ඉඟි වැකිය තෝරන්න.",
    "explanation": "තමන්ගේ කීර්තිය හෝ පිළිගැනීම පළුදු වීම 'සායම ගියා' යන්නෙන් අදහස් වේ."
  },
  {
    "id": "G4_C3_022",
    "category": "C3",
    "competency": "Carelessness Idiom",
    "sub_skill": "Superficial work metaphor",
    "difficulty": 0.5,
    "prompt": "වැඩක් නොසැලකිලිමත් ලෙස, මතුපිටින් පමණක් කිරීම හඳුන්වන ඉඟි වැකිය කුමක්ද?",
    "options": [
      "උඩින් පල්ලෙන්",
      "ඊ ගහක වේගයෙන්",
      "කඩි ගුලක් සේ",
      "ඉබි ගමනින්"
    ],
    "answer": "උඩින් පල්ලෙන්",
    "audioPrompt": "නොසැලකිලිමත් වැඩ කිරීම හඳුන්වන ඉඟි වැකිය තෝරන්න.",
    "explanation": "ගැඹුරින් නොබලා උඩින් මතුපිටින් වැඩ නිම කිරීම 'උඩින් පල්ලෙන්' ලෙස යොදයි."
  },
  {
    "id": "G4_C3_023",
    "category": "C3",
    "competency": "Prosperity Idiom",
    "sub_skill": "Abundant harvest metaphor",
    "difficulty": 0.55,
    "prompt": "ගොවියාගේ වෙහෙස නිසා විශාල ලාභයක් හා වාසියක් ලැබීම දැක්වෙන ඉඟි වැකිය කුමක්ද?",
    "options": [
      "කරල පැහීම",
      "සායම යෑම",
      "උඩින් පල්ලෙන්",
      "හොර ගල් ඇහිලීම"
    ],
    "answer": "කරල පැහීම",
    "audioPrompt": "විශාල වාසියක් ලැබීම දැක්වෙන ඉඟි වැකිය තෝරන්න.",
    "explanation": "වාසනාව හෝ මහන්සියේ ප්‍රතිඵල ලෙස විශාල වාසියක් ලැබීම 'කරල පැහීම' වේ."
  },
  {
    "id": "G4_C3_024",
    "category": "C3",
    "competency": "Silence Idiom",
    "sub_skill": "Absolute silence metaphor",
    "difficulty": 0.45,
    "prompt": "පන්තියේ කිසිදු ශබ්දයක් නොමැතිව පවතින දැඩි නිශ්ශබ්දතාව හැඳින්වෙන්නේ කුමන ඉඟි වැකියෙන්ද?",
    "options": [
      "හාවක් හූවක් නැහැ",
      "මොර සූරණ වැස්ස",
      "ගල් පැලෙන බොරු",
      "දවල් හීන"
    ],
    "answer": "හාවක් හූවක් නැහැ",
    "audioPrompt": "දැඩි නිශ්ශබ්දතාව හඳුන්වන ඉඟි වැකිය තෝරන්න.",
    "explanation": "කිසිදු ප්‍රතිචාරයක් හෝ ශබ්දයක් නැති තත්ත්වය 'හාවක් හූවක් නැහැ' වේ."
  },
  {
    "id": "G4_C3_025",
    "category": "C3",
    "competency": "Unrealistic Ambition Idiom",
    "sub_skill": "Daydreaming metaphor",
    "difficulty": 0.45,
    "prompt": "කිසිදා සැබෑ නොවන අසත්‍ය සිහින හා අපේක්ෂා දකින්නා හඳුන්වන්නේ කුමක් ලෙසද?",
    "options": [
      "දවල් හීන දකින්නා",
      "පොතේ ගුල්ලා",
      "අඹ යහළුවා",
      "නැණවතා"
    ],
    "answer": "දවල් හීන දකින්නා",
    "audioPrompt": "සිදු නොවන දේ අපේක්ෂා කිරීම දැක්වෙන ඉඟි වැකිය තෝරන්න.",
    "explanation": "ප්‍රායෝගික නොවන හිස් බලාපොරොත්තු ඇති කරගැනීම 'දවල් හීන' නම් වේ."
  },
  {
    "id": "G4_C3_026",
    "category": "C3",
    "competency": "Patience Metaphor Idiom",
    "sub_skill": "Anxious waiting idiom",
    "difficulty": 0.5,
    "prompt": "ප්‍රතිඵලය ලැබෙන තුරු නොඉවසිල්ලෙන් හෝ දැඩි බලාපොරොත්තුවෙන් සිටීම හඳුන්වන්නේ කුමක් ලෙසද?",
    "options": [
      "ඇඟිලි ගනිමින් සිටීම",
      "කුකුල් නින්ද",
      "ඉබි ගමන",
      "උඩින් පල්ලෙන්"
    ],
    "answer": "ඇඟිලි ගනිමින් සිටීම",
    "audioPrompt": "දැඩි අපේක්ෂාවෙන් බලා සිටීම දැක්වෙන ඉඟි වැකිය තෝරන්න.",
    "explanation": "දිනය හෝ වේලාව එන තෙක් නොඉවසිල්ලෙන් බලා සිටීම 'ඇඟිලි ගනිමින් සිටීම' වේ."
  },
  {
    "id": "G4_C3_027",
    "category": "C3",
    "competency": "Activity Metaphor Idiom",
    "sub_skill": "Beehive/Ant hive activity metaphor",
    "difficulty": 0.55,
    "prompt": "සියලු දෙනා ඉතා කඩිසරව හා සාමූහිකව වැඩ කිරීම හඳුන්වන ඉඟි වැකිය කුමක්ද?",
    "options": [
      "කඩි ගුලක් ඇවිස්සුණා සේ",
      "ඉබි ගමනින්",
      "හොර ගල් ඇහිලීම",
      "සායම ගියා"
    ],
    "answer": "කඩි ගුලක් ඇවිස්සුණා සේ",
    "audioPrompt": "ඉතා කඩිසරව වැඩ කිරීම දැක්වෙන ඉඟි වැකිය තෝරන්න.",
    "explanation": "හැමෝම ඉතා වේගයෙන් හා අවදියෙන් වැඩ කිරීම 'කඩි ගුලක් ඇවිස්සුණා සේ' වේ."
  },
  {
    "id": "G4_C3_028",
    "category": "C3",
    "competency": "Spatial Extent Idiom",
    "sub_skill": "Boundless horizon idiom",
    "difficulty": 0.45,
    "prompt": "කෙළවරක් නොපෙනෙන තරම් අතිශය විශාල ප්‍රදේශය දැක්වීමට යොදන ඉඟි වැකිය කුමක්ද?",
    "options": [
      "ඉමක් නොපෙනෙන",
      "ඊ ගහක වේගයෙන්",
      "කර ළඟට ආ",
      "අතේ මාට්ටු"
    ],
    "answer": "ඉමක් නොපෙනෙන",
    "audioPrompt": "කෙළවරක් නැති විශාල බව දැක්වෙන ඉඟි වැකිය තෝරන්න.",
    "explanation": "සීමාවක් හෝ මායිමක් නොපෙනෙන අතිශය විශාල ප්‍රදේශයට 'ඉමක් නොපෙනෙන' යොදයි."
  },
  {
    "id": "G4_C3_029",
    "category": "C3",
    "competency": "Betrayal Metaphor Idiom",
    "sub_skill": "Hidden treachery idiom",
    "difficulty": 0.65,
    "prompt": "මිත්‍රශීලීව පෙනී සිටිමින් රහසින් ද්‍රෝහි වීම හඳුන්වන ප්‍රකට ඉඟි වැකිය කුමක්ද?",
    "options": [
      "දිය රෙද්දෙන් බෙල්ල කැපීම",
      "අත දීම",
      "ඉහේ මලක් පිපීම",
      "අඹ යහළුවා"
    ],
    "answer": "දිය රෙද්දෙන් බෙල්ල කැපීම",
    "audioPrompt": "රහසින් ද්‍රෝහි වීම හඳුන්වන ඉඟි වැකිය තෝරන්න.",
    "explanation": "හොඳින් සිටිමින් රහසේම හානි කිරීම 'දිය රෙද්දෙන් බෙල්ල කැපීම' වේ."
  },
  {
    "id": "G4_C3_030",
    "category": "C3",
    "competency": "Double Misfortune Proverb",
    "sub_skill": "Multiple disaster proverb",
    "difficulty": 0.5,
    "prompt": "කරදරයක් සිදුවී තිබියදී ඊටත් වඩා තවත් කරදරයකට පත්වීම දැක්වෙන පිරුළ කුමක්ද?",
    "options": [
      "ගහෙන් වැටුණු මිනිහාට ගොනා ඇන්නා වගේ",
      "ගිය දේ ගියා වගේ",
      "අතේ මාට්ටු වගේ",
      "ඉඟුරු දී මිරිස් ගත්තා වගේ"
    ],
    "answer": "ගහෙන් වැටුණු මිනිහාට ගොනා ඇන්නා වගේ",
    "audioPrompt": "කරදර පිට කරදර වීම දැක්වෙන පිරුළ තෝරන්න.",
    "explanation": "එක කරදරයක් පිට තවත් කරදරයක් එකතුවීම මෙම පිරුළෙන් කියැවේ."
  },
  {
    "id": "G4_C4_001",
    "category": "C4",
    "competency": "Tense Identification",
    "sub_skill": "Present habitual tense classification",
    "difficulty": 0.35,
    "prompt": "“මම සෑම දිනකම පාසල් යමි.” මෙම වාක්‍යය අයත් වන්නේ කුමන කාලයටද?",
    "options": [
      "වර්‍තමාන කාලය",
      "අතීත කාලය",
      "අනාගත කාලය",
      "අසම්භාව්‍ය කාලය"
    ],
    "answer": "වර්‍තමාන කාලය",
    "audioPrompt": "වාක්‍යය අයත් වන කාලය තෝරන්න.",
    "explanation": "දැනට සිදුවන හෝ නිතර සිදුවන ක්‍රියා දැක්වෙන්නේ වර්‍තමාන කාලයෙනි."
  },
  {
    "id": "G4_C4_002",
    "category": "C4",
    "competency": "Tense Identification",
    "sub_skill": "Past completed tense classification",
    "difficulty": 0.4,
    "prompt": "“ඔහු ඊයේ රසවත් පොතක් කියවීය.” මෙම වාක්‍යය අයත් කාලය කුමක්ද?",
    "options": [
      "අතීත කාලය",
      "වර්‍තමාන කාලය",
      "අනාගත කාලය",
      "නියත කාලය"
    ],
    "answer": "අතීත කාලය",
    "audioPrompt": "වාක්‍යය අයත් වන කාලය තෝරන්න.",
    "explanation": "'ඊයේ කියවීය' යනු දැනටමත් සිදුවී අවසන් වූ බැවින් අතීත කාලය වේ."
  },
  {
    "id": "G4_C4_003",
    "category": "C4",
    "competency": "Tense Identification",
    "sub_skill": "Future prospective tense classification",
    "difficulty": 0.45,
    "prompt": "“නංගී හෙට උදෑසන මල් නෙළනු ඇත.” මෙම වාක්‍යය අයත් වන කාලය කුමක්ද?",
    "options": [
      "අනාගත කාලය",
      "වර්‍තමාන කාලය",
      "අතීත කාලය",
      "පූර්ව කාලය"
    ],
    "answer": "අනාගත කාලය",
    "audioPrompt": "වාක්‍යය අයත් වන කාලය තෝරන්න.",
    "explanation": "'හෙට නෙළනු ඇත' යන්න ඉදිරියට සිදුවීමට ඇති බැවින් අනාගත කාලය වේ."
  },
  {
    "id": "G4_C4_004",
    "category": "C4",
    "competency": "Spoken-to-Written Agreement",
    "sub_skill": "First-person plural past inflection",
    "difficulty": 0.5,
    "prompt": "“අපි ඊයේ පාසල් යනවා.” යන්න නිවැරදි ලිඛිත භාෂාවට හැරවූ විට?",
    "options": [
      "අපි ඊයේ පාසල් ගියෙමු.",
      "අපි ඊයේ පාසල් යමු.",
      "අපි ඊයේ පාසල් ගියේය.",
      "අපි ඊයේ පාසල් යති."
    ],
    "answer": "අපි ඊයේ පාසල් ගියෙමු.",
    "audioPrompt": "නිවැරදි ලිඛිත වාක්‍යය තෝරන්න.",
    "explanation": "'අපි' (උත්තම පුරුෂ බහු වචන) අතීත කාල ආඛ්‍යාතය 'ගියෙමු' විය යුතුය."
  },
  {
    "id": "G4_C4_005",
    "category": "C4",
    "competency": "Subject-Verb Agreement",
    "sub_skill": "Third person singular present agreement",
    "difficulty": 0.4,
    "prompt": "“ගොවියා කුඹුරේ වැඩ ______.” හිස්තැනට සුදුසු නිවැරදි ක්‍රියාපදය තෝරන්න.",
    "options": [
      "කරයි",
      "කරමි",
      "කරති",
      "කරමු"
    ],
    "answer": "කරයි",
    "audioPrompt": "හිස්තැනට සුදුසු ක්‍රියාපදය තෝරන්න.",
    "explanation": "'ගොවියා' (ප්‍රථම පුරුෂ ඒක වචන) උක්තය සඳහා ආඛ්‍යාතය 'කරයි' වේ."
  },
  {
    "id": "G4_C4_006",
    "category": "C4",
    "competency": "Spoken-to-Written Grammar",
    "sub_skill": "First person singular present transformation",
    "difficulty": 0.35,
    "prompt": "“මම පොත කියවනවා.” යන්න නිවැරදි ලිඛිත භාෂාවට හැරවූ විට කුමක්ද?",
    "options": [
      "මම පොත කියවමි.",
      "මම පොත කියවයි.",
      "මම පොත කියවති.",
      "මම පොත කියවමු."
    ],
    "answer": "මම පොත කියවමි.",
    "audioPrompt": "නිවැරදි ලිඛිත වාක්‍යය තෝරන්න.",
    "explanation": "'මම' උක්තය සඳහා වර්‍තමාන කාල ආඛ්‍යාතය 'කියවමි' වේ."
  },
  {
    "id": "G4_C4_007",
    "category": "C4",
    "competency": "Spoken-to-Written Grammar",
    "sub_skill": "Third person feminine singular transformation",
    "difficulty": 0.35,
    "prompt": "“ඈ මල් නෙළනවා.” යන්න නිවැරදි ලිඛිත වාක්‍යය කුමක්ද?",
    "options": [
      "ඈ මල් නෙළයි.",
      "ඈ මල් නෙළමි.",
      "ඈ මල් නෙළති.",
      "ඈ මල් නෙළමු."
    ],
    "answer": "ඈ මල් නෙළයි.",
    "audioPrompt": "නිවැරදි ලිඛිත වාක්‍යය තෝරන්න.",
    "explanation": "'ඈ' උක්තය සඳහා ලිඛිත වර්‍තමාන ආඛ්‍යාතය 'නෙළයි' වේ."
  },
  {
    "id": "G4_C4_008",
    "category": "C4",
    "competency": "Spoken-to-Written Grammar",
    "sub_skill": "First person plural present transformation",
    "difficulty": 0.4,
    "prompt": "“අප පාසල් යනවා.” යන්නෙහි සම්මත ලිඛිත රූපය කුමක්ද?",
    "options": [
      "අප පාසල් යමු.",
      "අප පාසල් යයි.",
      "අප පාසල් යති.",
      "අප පාසල් යමි."
    ],
    "answer": "අප පාසල් යමු.",
    "audioPrompt": "නිවැරදි ලිඛිත වාක්‍යය තෝරන්න.",
    "explanation": "'අප' උක්තයට වර්‍තමාන කාල ආඛ්‍යාතය 'යමු' වේ."
  },
  {
    "id": "G4_C4_009",
    "category": "C4",
    "competency": "Spoken-to-Written Grammar",
    "sub_skill": "Third person plural transformation",
    "difficulty": 0.45,
    "prompt": "“ළමයි සෙල්ලම් කරනවා.” යන්න ලිඛිත භාෂාවට හරවන්න.",
    "options": [
      "ළමයි සෙල්ලම් කරති.",
      "ළමයි සෙල්ලම් කරයි.",
      "ළමයි සෙල්ලම් කරමි.",
      "ළමයි සෙල්ලම් කරමු."
    ],
    "answer": "ළමයි සෙල්ලම් කරති.",
    "audioPrompt": "නිවැරදි ලිඛිත වාක්‍යය තෝරන්න.",
    "explanation": "'ළමයි' (බහු වචන) උක්තය සඳහා ආඛ්‍යාතය 'කරති' විය යුතුය."
  },
  {
    "id": "G4_C4_010",
    "category": "C4",
    "competency": "Spoken-to-Written Grammar",
    "sub_skill": "Third person masculine singular transformation",
    "difficulty": 0.4,
    "prompt": "“ඔහු පාඩම් උගන්වනවා.” යන්නෙහි නිවැරදි ලිඛිත වාක්‍යය තෝරන්න.",
    "options": [
      "ඔහු පාඩම් උගන්වයි.",
      "ඔහු පාඩම් උගන්වති.",
      "ඔහු පාඩම් උගන්වමි.",
      "ඔහු පාඩම් උගන්වමු."
    ],
    "answer": "ඔහු පාඩම් උගන්වයි.",
    "audioPrompt": "නිවැරදි ලිඛිත වාක්‍යය තෝරන්න.",
    "explanation": "'ඔහු' උක්තයට අනුරූප ආඛ්‍යාතය 'උගන්වයි' වේ."
  },
  {
    "id": "G4_C4_011",
    "category": "C4",
    "competency": "Subject-Verb Agreement",
    "sub_skill": "First person singular present",
    "difficulty": 0.3,
    "prompt": "“මම අඹ ගෙඩියක් ______.” හිස්තැනට සුදුසු පදය තෝරන්න.",
    "options": [
      "කමි",
      "කයි",
      "කති",
      "කමු"
    ],
    "answer": "කමි",
    "audioPrompt": "හිස්තැනට සුදුසු ක්‍රියාපදය තෝරන්න.",
    "explanation": "'මම' සමඟ 'කමි' යෙදේ."
  },
  {
    "id": "G4_C4_012",
    "category": "C4",
    "competency": "Subject-Verb Agreement",
    "sub_skill": "Third person plural present",
    "difficulty": 0.4,
    "prompt": "“සිසුන් පන්ති කාමරයේ පොත් ______.” හිස්තැනට සුදුසු ආඛ්‍යාතය කුමක්ද?",
    "options": [
      "කියවති",
      "කියවයි",
      "කියවමි",
      "කියවමු"
    ],
    "answer": "කියවති",
    "audioPrompt": "හිස්තැනට සුදුසු ආඛ්‍යාතය තෝරන්න.",
    "explanation": "'සිසුන්' බහු වචන උක්තය බැවින් 'කියවති' යෙදේ."
  },
  {
    "id": "G4_C4_013",
    "category": "C4",
    "competency": "Word Pair Knowledge",
    "sub_skill": "Standard Sinhala word pairs",
    "difficulty": 0.35,
    "prompt": "'ගෙවල්' යන්න සමඟ එක්වන සුදුසුම යුගල පදය කුමක්ද?",
    "options": [
      "දොරවල්",
      "හෙල්",
      "වැල්",
      "වතු"
    ],
    "answer": "දොරවල්",
    "audioPrompt": "ගෙවල් සමඟ එන යුගල පදය තෝරන්න.",
    "explanation": "සම්මත යුගල පදය 'ගෙවල් දොරවල්' වේ."
  },
  {
    "id": "G4_C4_014",
    "category": "C4",
    "competency": "Word Pair Knowledge",
    "sub_skill": "Mountain word pairs",
    "difficulty": 0.35,
    "prompt": "'කඳු' යන්න සමඟ ගැළපෙන යුගල පදය තෝරන්න.",
    "options": [
      "හෙල්",
      "වැල්",
      "කොළ",
      "දොරවල්"
    ],
    "answer": "හෙල්",
    "audioPrompt": "කඳු සමඟ ගැළපෙන යුගල පදය තෝරන්න.",
    "explanation": "'කඳු හෙල්' යනු ස්වභාවික භූමිය දැක්වෙන සම්මත යුගල පදයකි."
  },
  {
    "id": "G4_C4_015",
    "category": "C4",
    "competency": "Word Pair Knowledge",
    "sub_skill": "Flora word pairs",
    "difficulty": 0.35,
    "prompt": "'ගස්' යන්න සමඟ එක්වන යුගල පදය කුමක්ද?",
    "options": [
      "වැල්",
      "හෙල්",
      "කොළ",
      "මල්"
    ],
    "answer": "වැල්",
    "audioPrompt": "ගස් සමඟ එන යුගල පදය තෝරන්න.",
    "explanation": "පැලෑටි හා ශාක හැඳින්වීමට 'ගස් වැල්' යුගල පදය යොදයි."
  },
  {
    "id": "G4_C4_016",
    "category": "C4",
    "competency": "Word Pair Knowledge",
    "sub_skill": "Food word pairs",
    "difficulty": 0.3,
    "prompt": "'කෑම' යන්න සමඟ එන සම්මත යුගල පදය කුමක්ද?",
    "options": [
      "බීම",
      "රස",
      "කන්න",
      "දීම"
    ],
    "answer": "බීම",
    "audioPrompt": "කෑම සමඟ එන යුගල පදය තෝරන්න.",
    "explanation": "'කෑම බීම' යනු ආහාර පාන දැක්වෙන ප්‍රකට යුගල පදයයි."
  },
  {
    "id": "G4_C4_017",
    "category": "C4",
    "competency": "Word Pair Knowledge",
    "sub_skill": "Parental word pairs",
    "difficulty": 0.3,
    "prompt": "'අම්මා' සමඟ යෙදෙන සුදුසුම යුගල පදය තෝරන්න.",
    "options": [
      "තාත්තා",
      "මාමා",
      "පියා",
      "අක්කා"
    ],
    "answer": "තාත්තා",
    "audioPrompt": "අම්මා සමඟ යෙදෙන යුගල පදය තෝරන්න.",
    "explanation": "දෙමාපියන් හැඳින්වීමේ සම්මත යුගල පදය 'අම්මා තාත්තා' වේ."
  },
  {
    "id": "G4_C4_018",
    "category": "C4",
    "competency": "Orthography: Retroflex Na/La",
    "sub_skill": "Murdhaja Na spelling rule",
    "difficulty": 0.45,
    "prompt": "'පරිග___කය' හිස්තැනට සුදුසු නිවැරදි අක්ෂරය කුමක්ද?",
    "options": [
      "ණ",
      "න",
      "න්",
      "ණ්"
    ],
    "answer": "ණ",
    "audioPrompt": "හිස්තැනට සුදුසු අක්ෂරය තෝරන්න.",
    "explanation": "'පරිගණකය' ලිවීමේදී මූර්ධජ 'ණ' යෙදිය යුතුය."
  },
  {
    "id": "G4_C4_019",
    "category": "C4",
    "competency": "Orthography: Sibilants",
    "sub_skill": "Murdhaja Sha sibilant",
    "difficulty": 0.5,
    "prompt": "'වි___ෂ' හිස්තැනට සුදුසු නිවැරදි අක්ෂරය කුමක්ද?",
    "options": [
      "ශේෂ",
      "ෂේෂ",
      "සේෂ",
      "ශෙෂ"
    ],
    "answer": "ශේෂ",
    "audioPrompt": "හිස්තැනට සුදුසු නිවැරදි අකුර තෝරන්න.",
    "explanation": "'විශේෂ' යන්නෙහි මුල තාලුජ 'ශේ' ද අග මූර්ධජ 'ෂ' ද යෙදේ."
  },
  {
    "id": "G4_C4_020",
    "category": "C4",
    "competency": "Orthography: Retroflex La",
    "sub_skill": "Murdhaja La spelling rule",
    "difficulty": 0.45,
    "prompt": "'පි___තුරු' හිස්තැනට ගැළපෙන අක්ෂරය තෝරන්න.",
    "options": [
      "ළි",
      "ලි",
      "ලී",
      "ළී"
    ],
    "answer": "ළි",
    "audioPrompt": "හිස්තැනට සුදුසු අකුර තෝරන්න.",
    "explanation": "'පිළිතුරු' යන්නෙහි මූර්ධජ 'ළි' යෙදේ."
  },
  {
    "id": "G4_C4_021",
    "category": "C4",
    "competency": "Orthography: Murdhaja Na",
    "sub_skill": "Bell word orthography",
    "difficulty": 0.5,
    "prompt": "'ඝ___ටාරය' හිස්තැනට සුදුසු නිවැරදි අක්ෂරය කුමක්ද?",
    "options": [
      "ණ්",
      "න්",
      "න",
      "ණ"
    ],
    "answer": "ණ්",
    "audioPrompt": "හිස්තැනට සුදුසු අක්ෂරය තෝරන්න.",
    "explanation": "'ඝණ්ටාරය' ලිවීමේදී 'ට' ට පෙර මූර්ධජ 'ණ්' යෙදේ (ට-වර්ග නීතිය)."
  },
  {
    "id": "G4_C4_022",
    "category": "C4",
    "competency": "Orthography: Sibilants",
    "sub_skill": "Talaja Sha in Prashnaya",
    "difficulty": 0.4,
    "prompt": "'ප්‍ර___නය' හිස්තැනට සුදුසු අක්ෂරය කුමක්ද?",
    "options": [
      "ශ්",
      "ෂ්",
      "ස්",
      "හ්"
    ],
    "answer": "ශ්",
    "audioPrompt": "හිස්තැනට සුදුසු අකුර තෝරන්න.",
    "explanation": "'ප්‍රශ්නය' ලිවීමේදී තාලුජ 'ශ්' යොදා ගනී."
  },
  {
    "id": "G4_C4_023",
    "category": "C4",
    "competency": "Orthography: Dantaja Na",
    "sub_skill": "Fragrance word orthography",
    "difficulty": 0.45,
    "prompt": "'සුග___ධය' හිස්තැනට සුදුසු නිවැරදි අක්ෂරය තෝරන්න.",
    "options": [
      "න්",
      "ණ්",
      "න",
      "ණ"
    ],
    "answer": "න්",
    "audioPrompt": "හිස්තැනට සුදුසු අකුර තෝරන්න.",
    "explanation": "'සුගන්ධය' ලිවීමේදී 'ධ' ට පෙර දන්තජ 'න්' යෙදේ (ත-වර්ග නීතිය)."
  },
  {
    "id": "G4_C4_024",
    "category": "C4",
    "competency": "Orthography: Consonant Vowel Placement",
    "sub_skill": "Field word orthography",
    "difficulty": 0.4,
    "prompt": "'කු___ර' හිස්තැනට සුදුසු නිවැරදි අක්ෂරය කුමක්ද?",
    "options": [
      "ඹු",
      "බූ",
      "බු",
      "බ"
    ],
    "answer": "ඹු",
    "audioPrompt": "හිස්තැනට සුදුසු අක්ෂරය තෝරන්න.",
    "explanation": "'කුඹුර' ලිවීමේදී සංඥක 'ඹු' අක්ෂරය යෙදේ."
  },
  {
    "id": "G4_C4_025",
    "category": "C4",
    "competency": "Orthography: Dental Aspirate vs Non-aspirate",
    "sub_skill": "Mirror word spelling",
    "difficulty": 0.45,
    "prompt": "'කැඩප___ක්' හිස්තැනට සුදුසු අක්ෂරය කුමක්ද?",
    "options": [
      "ත",
      "ථ",
      "ද",
      "ධ"
    ],
    "answer": "ත",
    "audioPrompt": "හිස්තැනට සුදුසු අක්ෂරය තෝරන්න.",
    "explanation": "'කැඩපතක්' (කැඩපත) ලිවීමේදී අල්පප්‍රාණ 'ත' යෙදේ."
  },
  {
    "id": "G4_C4_026",
    "category": "C4",
    "competency": "Orthography: Sibilants",
    "sub_skill": "Night word spelling",
    "difficulty": 0.45,
    "prompt": "'නිශා___ය' හිස්තැනට සුදුසු අක්ෂරය කුමක්ද?",
    "options": [
      "චර",
      "ශර",
      "සක",
      "වර"
    ],
    "answer": "චර",
    "audioPrompt": "හිස්තැනට සුදුසු අක්ෂරය තෝරන්න.",
    "explanation": "රාත්‍රියෙහි හැසිරෙන සතුන් 'නිශාචර' නම් වේ."
  },
  {
    "id": "G4_C4_027",
    "category": "C4",
    "competency": "Subject-Verb Agreement",
    "sub_skill": "Past third person plural inflection",
    "difficulty": 0.45,
    "prompt": "“ළමයි උදෑසන පාසලට ______.” හිස්තැනට ගැළපෙන අතීත ආඛ්‍යාතය කුමක්ද?",
    "options": [
      "පැමිණියහ",
      "පැමිණියේය",
      "පැමිණියෙමු",
      "පැමිණෙති"
    ],
    "answer": "පැමිණියහ",
    "audioPrompt": "හිස්තැනට සුදුසු අතීත ආඛ්‍යාතය තෝරන්න.",
    "explanation": "'ළමයි' (බහු වචන) සඳහා අතීත කාල ආඛ්‍යාතය 'පැමිණියහ' වේ."
  },
  {
    "id": "G4_C4_028",
    "category": "C4",
    "competency": "Orthography: Murdhaja vs Dantaja",
    "sub_skill": "Math word spelling",
    "difficulty": 0.4,
    "prompt": "'ගණි___ය' හිස්තැනට සුදුසු අක්ෂරය තෝරන්න.",
    "options": [
      "ත",
      "ථ",
      "ද",
      "ධ"
    ],
    "answer": "ත",
    "audioPrompt": "හිස්තැනට සුදුසු අක්ෂරය තෝරන්න.",
    "explanation": "'ගණිතය' ලිවීමේදී 'ණි' සමඟ අල්පප්‍රාණ 'ත' යෙදේ."
  },
  {
    "id": "G4_C4_029",
    "category": "C4",
    "competency": "Subject-Verb Agreement",
    "sub_skill": "Past first person singular inflection",
    "difficulty": 0.4,
    "prompt": "“මම ඊයේ රසවත් ගීයක් ______.” හිස්තැනට ගැළපෙන ආඛ්‍යාතය කුමක්ද?",
    "options": [
      "ගැයුවෙමි",
      "ගැයුවේය",
      "ගයති",
      "ගයමු"
    ],
    "answer": "ගැයුවෙමි",
    "audioPrompt": "හිස්තැනට සුදුසු ආඛ්‍යාතය තෝරන්න.",
    "explanation": "'මම' අතීත කාලයේදී 'ගැයුවෙමි' ලෙස යෙදේ."
  },
  {
    "id": "G4_C4_030",
    "category": "C4",
    "competency": "Orthography: Overall Precision",
    "sub_skill": "Expertise word orthography",
    "difficulty": 0.55,
    "prompt": "නිවැරදි අක්ෂර වින්‍යාසය සහිත පදය තෝරන්න.",
    "options": [
      "ප්‍රවීණතාව",
      "ප්‍රවීනතාව",
      "ප්‍රවිණතාව",
      "ප්‍රවීණතාවා"
    ],
    "answer": "ප්‍රවීණතාව",
    "audioPrompt": "නිවැරදි අක්ෂර වින්‍යාසය සහිත පදය තෝරන්න.",
    "explanation": "'ප්‍රවීණතාව' ලිවීමේදී 'වී' දීර්ඝය හා මූර්ධජ 'ණ' යෙදිය යුතුය."
  },
  {
    "id": "G4_C5_001",
    "category": "C5",
    "competency": "Interrogative Punctuation",
    "sub_skill": "Question mark placement rule",
    "difficulty": 0.25,
    "prompt": "“ඔයාගේ නම කුමක්ද___” මෙම වාක්‍යය අවසානයට සුදුසු විරාම ලක්ෂණය කුමක්ද?",
    "options": [
      "? (ප්‍රශ්නාර්ථ ලකුණ)",
      ". (තිත)",
      "! (විස්මයාදී ලකුණ)",
      ", (කොමාව)"
    ],
    "answer": "? (ප්‍රශ්නාර්ථ ලකුණ)",
    "audioPrompt": "වාක්‍යය අවසානයට සුදුසු විරාම ලකුණ තෝරන්න.",
    "explanation": "යමක් විමසන ප්‍රශ්න වාක්‍යයක් අවසානයට ප්‍රශ්නාර්ථ ලකුණ (?) යෙදේ."
  },
  {
    "id": "G4_C5_002",
    "category": "C5",
    "competency": "Exclamatory Punctuation",
    "sub_skill": "Exclamation mark emotion rule",
    "difficulty": 0.3,
    "prompt": "“වාව්! මේ මල හරිම ලස්සනයි___” අවසානයට ගැළපෙන ලකුණ කුමක්ද?",
    "options": [
      "! (විස්මයාදී ලකුණ)",
      ". (තිත)",
      "? (ප්‍රශ්නාර්ථ ලකුණ)",
      ", (කොමාව)"
    ],
    "answer": "! (විස්මයාදී ලකුණ)",
    "audioPrompt": "අවසානයට ගැළපෙන විරාම ලක්ෂණය තෝරන්න.",
    "explanation": "පුදුමය, සතුට හෝ ප්‍රීතිය ප්‍රකාශ වන වාක්‍යවලට විස්මයාදී ලකුණ (!) යොදයි."
  },
  {
    "id": "G4_C5_003",
    "category": "C5",
    "competency": "List Enumeration Punctuation",
    "sub_skill": "Comma listing rule",
    "difficulty": 0.35,
    "prompt": "“අඹ__ පේර__ දොඩම් සහ කෙසෙල් කූඩයේ ඇත.” හිස්තැන්වලට ගැළපෙන ලකුණ කුමක්ද?",
    "options": [
      ", (කොමාව)",
      ". (තිත)",
      "? (ප්‍රශ්නාර්ථය)",
      "! (විස්මය)"
    ],
    "answer": ", (කොමාව)",
    "audioPrompt": "හිස්තැනට ගැළපෙන ලකුණ තෝරන්න.",
    "explanation": "වචන හෝ නම් කිහිපයක් වෙන් කර දැක්වීමට කොමාව (,) භාවිතා කෙරේ."
  },
  {
    "id": "G4_C5_004",
    "category": "C5",
    "competency": "Direct Fact Retrieval",
    "sub_skill": "School garden detail extraction",
    "difficulty": 0.4,
    "prompt": "“අපේ පාසලේ ලස්සන වත්තක් ඇත. එහි විවිධ වර්ණවල මල් පිපී ඇත. ගුරුවරුන් වත්ත පිරිසිදුව තබා ගැනීමට සිසුන්ට උපදෙස් දෙති.” ගුරුවරුන් සිසුන්ට දෙන උපදෙස කුමක්ද?",
    "options": [
      "පාසල් වත්ත පිරිසිදුව තබා ගැනීමට",
      "මල් කැඩීමට",
      "වත්තෙන් පිටවීමට",
      "සෙල්ලම් කිරීමට"
    ],
    "answer": "පාසල් වත්ත පිරිසිදුව තබා ගැනීමට",
    "audioPrompt": "ගුරුවරුන් දෙන උපදෙස කුමක්ද යන්න තෝරන්න.",
    "explanation": "පාඨයේ සඳහන් පරිදි ගුරුවරුන් සිසුන්ට උපදෙස් දෙන්නේ පාසල් වත්ත පිරිසිදුව තබා ගැනීමටය."
  },
  {
    "id": "G4_C5_005",
    "category": "C5",
    "competency": "Direct Fact Retrieval",
    "sub_skill": "Home assistance narrative extraction",
    "difficulty": 0.45,
    "prompt": "“සෙනු පාසලෙන් නිවසට පැමිණි පසු අම්මාට උදව් කළාය. ඇය මල් පැළවලට වතුර දැමුවාය.” සෙනු මල් පැළවලට දැමුවේ කුමක්ද?",
    "options": [
      "වතුර",
      "කිරි",
      "පොහොර",
      "වැලි"
    ],
    "answer": "වතුර",
    "audioPrompt": "සෙනු මල් පැළවලට දැමුවේ කුමක්ද යන්න තෝරන්න.",
    "explanation": "සෙනු මල් පැළ හොඳින් වැඩීමට වතුර දැමුවාය."
  },
  {
    "id": "G4_C5_006",
    "category": "C5",
    "competency": "Reading & Event Extraction",
    "sub_skill": "Environment week chronological event",
    "difficulty": 0.55,
    "prompt": "“අපේ පාසලේ පරිසර සතිය උත්සවාකාරයෙන් පැවැත්විණි. පළමු දිනයේ පාසල් වත්ත පිරිසිදු කළ අතර දෙවන දිනයේ පැළ සිටුවීමේ වැඩසටහනක් සංවිධානය කර තිබුණි.” පාසල් පරිසර සතියේ දෙවන දිනයේ පැවැත්වුණේ කුමන වැඩසටහනද?",
    "options": [
      "පැළ සිටුවීමේ වැඩසටහන",
      "වත්ත පිරිසිදු කිරීම",
      "ක්‍රීඩා උත්සවය",
      "චිත්‍ර තරගය"
    ],
    "answer": "පැළ සිටුවීමේ වැඩසටහන",
    "audioPrompt": "පාඨය කියවා පරිසර සතියේ දෙවන දිනයේ සිදුවූ වැඩසටහන තෝරන්න.",
    "explanation": "පළමු දිනයේ වත්ත පිරිසිදු කළ අතර දෙවන දිනයේ පැළ සිටුවීමේ වැඩසටහන පැවැත්විණි."
  },
  {
    "id": "G4_C5_007",
    "category": "C5",
    "competency": "Moral & Main Idea Comprehension",
    "sub_skill": "Water conservation theme",
    "difficulty": 0.65,
    "prompt": "“අප නිවසේදී දිනපතා ජලය අරපිරිමැස්මෙන් භාවිත කළ යුතුය. විශේෂයෙන් දත් මදින විට ජල කරාමය වසා තැබීමෙන් විශාල ජල ප්‍රමාණයක් අපතේ යාම වළක්වා ගත හැක.” ජලය සුරැකීම සඳහා දෛනික ජීවිතයට ගත හැකි හොඳ පුරුද්ද කුමක්ද?",
    "options": [
      "දත් මදින විට නළය වසා තැබීම",
      "වැඩිපුර ජලය අපතේ යැවීම",
      "වැසි ජලය කාණු ඔස්සේ ගලා යාමට හැරීම",
      "නළය නිතරම විවෘතව තැබීම"
    ],
    "answer": "දත් මදින විට නළය වසා තැබීම",
    "audioPrompt": "ජලය සුරැකීමේ හොඳ පුරුද්දක් තෝරන්න.",
    "explanation": "දත් මදින විට නළය වසා තැබීමෙන් විශාල ජල ප්‍රමාණයක් අපතේ යාම වළක්වා ගත හැක."
  },
  {
    "id": "G4_C5_008",
    "category": "C5",
    "competency": "Quotation Punctuation",
    "sub_skill": "Direct speech dialogue punctuation",
    "difficulty": 0.75,
    "prompt": "කෙනෙකු පැවසූ ප්‍රකාශයක් එලෙසම උපුටා දක්වන විට යොදන ලකුණ කුමක්ද?",
    "options": [
      "“ ” (යුගල උඩුකොමා)",
      ". (තිත)",
      "? (ප්‍රශ්නාර්ථය)",
      ", (කොමාව)"
    ],
    "answer": "“ ” (යුගල උඩුකොමා)",
    "audioPrompt": "කෙනෙකුගේ වචන උපුටා දක්වන විට යොදන ලකුණ තෝරන්න.",
    "explanation": "කථකයෙකු පැවසූ වචන ඒ අයුරින්ම ලිවීමේදී යුගල උඩුකොමා (“ ”) තුළ බහාලයි."
  },
  {
    "id": "G4_C5_009",
    "category": "C5",
    "competency": "Narrative Detail & Inference",
    "sub_skill": "Weather narrative observation",
    "difficulty": 0.8,
    "prompt": "“සෙනසුරාදා උදෑසන අහස වලාකුළුවලින් වැසී තිබුණි. ටික වේලාවකට පසු තද වැස්සක් වැටුණි.” අහස වැසී තිබුණේ කුමකින්ද?",
    "options": [
      "වලාකුළුවලින්",
      "කුරුල්ලන්ගෙන්",
      "මල්වලින්",
      "දුමෙන්"
    ],
    "answer": "වලාකුළුවලින්",
    "audioPrompt": "අහස වැසී තිබුණේ කුමකින්ද යන්න තෝරන්න.",
    "explanation": "වැස්සට පෙර අහස කළු වලාකුළුවලින් වැසී පැවතුණි."
  },
  {
    "id": "G4_C5_010",
    "category": "C5",
    "competency": "Complex Sentence Punctuation Repair",
    "sub_skill": "Multi-punctuation sentence syntax",
    "difficulty": 0.85,
    "prompt": "නිවැරදිව විරාම ලක්ෂණ යොදා ඇති වාක්‍යය තෝරන්න.",
    "options": [
      "අම්මා, “කඩිනමින් එන්න,” යැයි කීවාය.",
      "අම්මා “කඩිනමින් එන්න යැයි” කීවාය.",
      "අම්මා කඩිනමින් එන්න? යැයි කීවාය.",
      "අම්මා! කඩිනමින් එන්න යැයි කීවාය."
    ],
    "answer": "අම්මා, “කඩිනමින් එන්න,” යැයි කීවාය.",
    "audioPrompt": "නිවැරදි විරාම ලක්ෂණ සහිත වාක්‍යය තෝරන්න.",
    "explanation": "කථකයාගෙන් පසු කොමාව ද, උපුටනය උඩුකොමා තුළ ද නිවැරදිව යොදා ඇත."
  },
  {
    "id": "G4_C5_011",
    "category": "C5",
    "competency": "Direct Fact Retrieval",
    "sub_skill": "School bus manners narrative",
    "difficulty": 0.35,
    "prompt": "“කවිඳු සෑම උදෑසනකම පාසල් බස් රථයෙන් පාසලට යයි. ඔහු බස් රථයට නියමිත වේලාවට පැමිණෙයි. බස් රථයේදී ඔහු වැඩිහිටියන්ට ගෞරවයෙන් ආචාර කරයි.” කවිඳු බස් රථයේදී ආචාර කරන්නේ කාටද?",
    "options": [
      "වැඩිහිටියන්ට",
      "සතුන්ට",
      "වෙළෙන්දන්ට",
      "කුඩා දරුවන්ට"
    ],
    "answer": "වැඩිහිටියන්ට",
    "audioPrompt": "කවිඳු බස් රථයේදී ආචාර කරන්නේ කාටදැයි තෝරන්න.",
    "explanation": "පාඨයේ සඳහන් පරිදි කවිඳු බස් රථයේදී වැඩිහිටියන්ට ගෞරවයෙන් ආචාර කරයි."
  },
  {
    "id": "G4_C5_012",
    "category": "C5",
    "competency": "Temporal Fact Retrieval",
    "sub_skill": "Library reading routine narrative",
    "difficulty": 0.35,
    "prompt": "“පාසලේ පොඩි පුස්තකාලයක් ඇත. එහි කතන්දර පොත්, විද්‍යා පොත් සහ සඟරා තිබේ. මලිත් සෑම සිකුරාදාම පුස්තකාලයට ගොස් සතුන් පිළිබඳ පොත් කියවයි.” මලිත් පුස්තකාලයට යන්නේ කවදාද?",
    "options": [
      "සිකුරාදා",
      "සඳුදා",
      "බදාදා",
      "ඉරිදා"
    ],
    "answer": "සිකුරාදා",
    "audioPrompt": "මලිත් පුස්තකාලයට යන දිනය තෝරන්න.",
    "explanation": "පාඨයේ සඳහන් පරිදි මලිත් සෑම සිකුරාදා දිනකම පුස්තකාලයට යයි."
  },
  {
    "id": "G4_C5_013",
    "category": "C5",
    "competency": "Direct Fact Retrieval",
    "sub_skill": "Village fair market narrative",
    "difficulty": 0.4,
    "prompt": "“ඉරිදා උදෑසන අමල් අම්මා සමඟ ගමේ පොළට ගියේය. පොළේ එළවළු, පලතුරු සහ මල් විකිණීමට තිබුණි. අම්මා නැවුම් එළවළු මිලදී ගත්තාය.” අමල් පොළට ගියේ කවදාද?",
    "options": [
      "ඉරිදා උදෑසන",
      "සඳුදා සවස",
      "සිකුරාදා",
      "සෙනසුරාදා"
    ],
    "answer": "ඉරිදා උදෑසන",
    "audioPrompt": "අමල් පොළට ගිය වේලාව තෝරන්න.",
    "explanation": "පාඨයේ මුලින්ම සඳහන් වන්නේ ඉරිදා උදෑසන පොළට ගිය බවයි."
  },
  {
    "id": "G4_C5_014",
    "category": "C5",
    "competency": "Chronological Fact Retrieval",
    "sub_skill": "Sports meet ranking narrative",
    "difficulty": 0.4,
    "prompt": "“පාසලේ වාර්ෂික ක්‍රීඩා තරගය පසුගිය සතියේ පැවැත්විණි. සිසුන් ධාවන තරගවලට සහභාගි වූහ. සචින් මීටර් 100 ධාවන තරගයට සහභාගි වී දෙවන ස්ථානය ලබා ගත්තේය.” සචින් ලබාගත් ස්ථානය කුමක්ද?",
    "options": [
      "දෙවන ස්ථානය",
      "පළමු ස්ථානය",
      "තෙවන ස්ථානය",
      "සිව්වන ස්ථානය"
    ],
    "answer": "දෙවන ස්ථානය",
    "audioPrompt": "සචින් ලබාගත් ස්ථානය තෝරන්න.",
    "explanation": "සචින් මීටර් 100 ධාවන තරගයෙන් දෙවන ස්ථානය හිමිකර ගත්තේය."
  },
  {
    "id": "G4_C5_015",
    "category": "C5",
    "competency": "Location & Sightseeing Retrieval",
    "sub_skill": "Mountain travel narrative",
    "difficulty": 0.45,
    "prompt": "“නිවාඩු දිනයේ රවීගේ පවුලේ අය කඳුකර ප්‍රදේශයක සංචාරය කළහ. මග දෙපස විශාල ගස් සහ දිය ඇල්ලක් දැක ඔවුහු සතුටු වූහ.” රවීගේ පවුලේ අය ගමන් කළේ කුමන ප්‍රදේශයකටද?",
    "options": [
      "කඳුකර ප්‍රදේශයකට",
      "මුහුදු වෙරළකට",
      "නගරයකට",
      "පාසලකට"
    ],
    "answer": "කඳුකර ප්‍රදේශයකට",
    "audioPrompt": "ඔවුන් ගමන් කළ ප්‍රදේශය තෝරන්න.",
    "explanation": "පාඨයේ සඳහන් පරිදි ඔවුන් සංචාරය කළේ කඳුකර ප්‍රදේශයකය."
  },
  {
    "id": "G4_C5_016",
    "category": "C5",
    "competency": "Community Action Fact Retrieval",
    "sub_skill": "Lake cleanup environmental narrative",
    "difficulty": 0.45,
    "prompt": "“ගමේ වැව අවට පරිසරය පිරිසිදු කිරීම සඳහා ගම්වාසීන් එක්වී වැඩසටහනක් පැවැත්වූහ. ඔවුහු වැව අවට තිබූ ප්ලාස්ටික් සහ පොලිතීන් ඉවත් කළහ.” ගම්වාසීන් ඉවත් කළේ මොනවාද?",
    "options": [
      "ප්ලාස්ටික් සහ පොලිතීන්",
      "මල් සහ ගස්",
      "පොත්පත්",
      "ජලය"
    ],
    "answer": "ප්ලාස්ටික් සහ පොලිතීන්",
    "audioPrompt": "ගම්වාසීන් ඉවත් කළ ද්‍රව්‍ය තෝරන්න.",
    "explanation": "පරිසරය අපිරිසිදු කරන ප්ලාස්ටික් සහ පොලිතීන් කසළ ඉවත් කරන ලදී."
  },
  {
    "id": "G4_C5_017",
    "category": "C5",
    "competency": "Causal & Plant Care Fact Retrieval",
    "sub_skill": "Plant revival narrative",
    "difficulty": 0.45,
    "prompt": "“සහන්ගේ සීයා ගොවියෙකි. එක් දිනක් සහන් කුඩා පැළයක් වියළී ඇති බව දැක ඊට වතුර දැමුවේය. දින කිහිපයකට පසු පැළය යළි සජීවී විය.” පැළය වියළී තිබූ විට සහන් කළේ කුමක්ද?",
    "options": [
      "ඊට වතුර දැමුවේය",
      "එය කපා දැමුවේය",
      "එය විකුණුවේය",
      "එය ඉවත් කළේය"
    ],
    "answer": "ඊට වතුර දැමුවේය",
    "audioPrompt": "සහන් කළ ක්‍රියාව තෝරන්න.",
    "explanation": "පැළය රැකගැනීමට සහන් වතුර දැමීමෙන් එය යළි සජීවී විය."
  },
  {
    "id": "G4_C5_018",
    "category": "C5",
    "competency": "Goal & Theme Comprehension",
    "sub_skill": "Book donation purpose narrative",
    "difficulty": 0.5,
    "prompt": "“සිසුන්ගේ කියවීමේ පුරුද්ද වැඩි කිරීම සඳහා පොත් පරිත්‍යාග කිරීමේ වැඩසටහනක් පාසලේ පැවැත්විණි. ලැබුණු පොත් පුස්තකාලයට භාර දෙන ලදී.” වැඩසටහනේ ප්‍රධාන අරමුණ කුමක්ද?",
    "options": [
      "කියවීමේ පුරුද්ද වැඩි කිරීම",
      "ක්‍රීඩා වැඩි කිරීම",
      "පාසල වසා දැමීම",
      "වත්ත පිරිසිදු කිරීම"
    ],
    "answer": "කියවීමේ පුරුද්ද වැඩි කිරීම",
    "audioPrompt": "වැඩසටහනේ අරමුණ තෝරන්න.",
    "explanation": "පාඨයේ මුලින්ම කියැවෙන්නේ කියවීමේ පුරුද්ද වැඩිදියුණු කිරීමට මෙම වැඩසටහන කළ බවයි."
  },
  {
    "id": "G4_C5_019",
    "category": "C5",
    "competency": "Instruction Retrieval",
    "sub_skill": "Zoo rules narrative",
    "difficulty": 0.5,
    "prompt": "“සිව්වන ශ්‍රේණියේ සිසුන් සත්ව උද්‍යානයට ගියහ. ඔවුහු අලි, ජිරාෆ්, වඳුරන් සහ විවිධ පක්ෂීන් නැරඹූහ. ගුරුවරයා සතුන්ට කෑම නොදෙන ලෙස සිසුන්ට පැවසීය.” ගුරුවරයා සිසුන්ට දුන් උපදෙස කුමක්ද?",
    "options": [
      "සතුන්ට කෑම නොදෙන ලෙස",
      "සතුන් අල්ලන ලෙස",
      "සතුන් ගෙදර ගෙනියන ලෙස",
      "සතුන් සමඟ සෙල්ලම් කරන ලෙස"
    ],
    "answer": "සතුන්ට කෑම නොදෙන ලෙස",
    "audioPrompt": "ගුරුවරයා දුන් උපදෙස තෝරන්න.",
    "explanation": "සතුන්ගේ ආරක්ෂාව වෙනුවෙන් කෑම නොදෙන ලෙස ගුරුවරයා උපදෙස් දුන්නේය."
  },
  {
    "id": "G4_C5_020",
    "category": "C5",
    "competency": "Interpersonal Detail Retrieval",
    "sub_skill": "Welcoming new classmate narrative",
    "difficulty": 0.45,
    "prompt": "“නව වාරයේදී පන්තියට අලුත් සිසුවෙකු පැමිණියේය. ඔහුගේ නම දිනේෂ් ය. විවේක වේලාවේදී මලිත් ඔහු සමඟ කතා කර පාසල පෙන්වා දුන්නේය.” නව සිසුවාට පාසල පෙන්වා දුන්නේ කවුද?",
    "options": [
      "මලිත්",
      "ගුරුවරයා",
      "විදුහල්පතිතුමා",
      "සචින්"
    ],
    "answer": "මලිත්",
    "audioPrompt": "පාසල පෙන්වා දුන්නේ කවුදැයි තෝරන්න.",
    "explanation": "පාඨයේ සඳහන් පරිදි මලිත් අලුත් මිතුරාට පාසල පෙන්වා දුන්නේය."
  },
  {
    "id": "G4_C5_021",
    "category": "C5",
    "competency": "Material & Innovation Retrieval",
    "sub_skill": "Recycled exhibition craft narrative",
    "difficulty": 0.5,
    "prompt": "“සිසුන්ගේ නිර්මාණ ඇතුළත් ප්‍රදර්ශනයක් පාසලේදී පැවැත්විණි. සිව්වන ශ්‍රේණියේ සිසුන් ප්‍රතිචක්‍රීකරණය කළ ද්‍රව්‍ය භාවිත කර නිර්මාණ ඉදිරිපත් කළහ.” සිසුන් භාවිත කළ ද්‍රව්‍ය මොනවාද?",
    "options": [
      "ප්‍රතිචක්‍රීකරණය කළ ද්‍රව්‍ය",
      "අලුත් මිල අධික ද්‍රව්‍ය",
      "ආහාර ද්‍රව්‍ය",
      "ගස් සහ මල්"
    ],
    "answer": "ප්‍රතිචක්‍රීකරණය කළ ද්‍රව්‍ය",
    "audioPrompt": "සිසුන් භාවිත කළ ද්‍රව්‍ය තෝරන්න.",
    "explanation": "පරිසර හිතකාමී ප්‍රතිචක්‍රීකරණය කළ ද්‍රව්‍ය යොදාගෙන නිර්මාණ සකස් කෙරිණි."
  },
  {
    "id": "G4_C5_022",
    "category": "C5",
    "competency": "Location Detail Retrieval",
    "sub_skill": "Umbrella classroom position narrative",
    "difficulty": 0.45,
    "prompt": "“පාසල ඇරී නිවසට යන විට අහස අඳුරු විය. කවිඳුට උදෑසන කුඩය පන්ති කාමරයේ ජනේලය අසල තැබූ බව මතක් වී එය රැගෙන ආවේය.” කවිඳු කුඩය තබා තිබුණේ කොහේද?",
    "options": [
      "පන්ති කාමරයේ ජනේලය අසල",
      "බස් රථයේ",
      "පුස්තකාලයේ",
      "වත්තේ"
    ],
    "answer": "පන්ති කාමරයේ ජනේලය අසල",
    "audioPrompt": "කුඩය තබා තිබූ ස්ථානය තෝරන්න.",
    "explanation": "කවිඳු කුඩය තබා තිබුණේ පන්ති කාමරයේ ජනේලය අසලය."
  },
  {
    "id": "G4_C5_023",
    "category": "C5",
    "competency": "Event Detail Retrieval",
    "sub_skill": "Village new year event narrative",
    "difficulty": 0.45,
    "prompt": "“අපේ ගමේ අවුරුදු උත්සවයේදී ළමයින් සඳහා විවිධ ක්‍රීඩා පැවැත්විණි. සවස සංගීත වැඩසටහනක් තිබූ අතර ජයග්‍රාහකයන්ට ත්‍යාග පිරිනමන ලදී.” සවස පැවැත්වුණේ කුමක්ද?",
    "options": [
      "සංගීත වැඩසටහනක්",
      "වෙළෙඳපොළක්",
      "ගස් සිටුවීමක්",
      "විභාගයක්"
    ],
    "answer": "සංගීත වැඩසටහනක්",
    "audioPrompt": "සවස පැවැත්වුණේ කුමක්දැයි තෝරන්න.",
    "explanation": "පාඨයේ සඳහන් පරිදි සවස සංගීත වැඩසටහනක් පැවැත්විණි."
  },
  {
    "id": "G4_C5_024",
    "category": "C5",
    "competency": "Habit & Mannerism Retrieval",
    "sub_skill": "Morning routine manners narrative",
    "difficulty": 0.4,
    "prompt": "“දිනේෂා සෑම උදෑසනකම වේලාසනින් අවදි වී දත් මදියි. පාසලට යාමට පෙර පොත්පත් පිළිවෙළට සකස් කර ගනියි. ඇය ගුරුවරුන්ට හා මිතුරන්ට ගරු කරයි.” දිනේෂා උදෑසන අවදි වන්නේ කෙසේද?",
    "options": [
      "වේලාසනින් අවදි වෙයි",
      "ප්‍රමාද වී අවදි වෙයි",
      "අවදි නොවී නිදා ගනියි",
      "දහවල් වී අවදි වෙයි"
    ],
    "answer": "වේලාසනින් අවදි වෙයි",
    "audioPrompt": "දිනේෂා උදෑසන අවදි වන ආකාරය තෝරන්න.",
    "explanation": "පාඨයේ සඳහන් වන පරිදි දිනේෂා වේලාසනින් අවදි වීමේ යහපත් පුරුද්දක් දක්වයි."
  },
  {
    "id": "G4_C5_025",
    "category": "C5",
    "competency": "Jataka/Moral Tale Retrieval",
    "sub_skill": "Kimphala tree story fact extraction",
    "difficulty": 0.5,
    "prompt": "“යටගිය දවස සිටුවරයෙක් ගැල්කරුවන්ට විෂ සහිත ගසක ගෙඩි නොකන ලෙස අවවාද කළේය. සිටුවරයාගේ බස ඇසූ ගැල්කරුවන්ගේ ජීවිත බේරිණි.” නුවණැති සිටුවරයා ගැල්කරුවන්ට දුන් අවවාදය කුමක්ද?",
    "options": [
      "නොදන්නා ගස්වල ගෙඩි නොකන ලෙස",
      "ගස්වල ගෙඩි කඩා කන ලෙස",
      "වතුර නොබී සිටින ලෙස",
      "කැලයේ නවතින ලෙස"
    ],
    "answer": "නොදන්නා ගස්වල ගෙඩි නොකන ලෙස",
    "audioPrompt": "සිටුවරයා දුන් අවවාදය තෝරන්න.",
    "explanation": "නොදන්නා, විෂ සහිත ගස්වල ඵල නොකන ලෙස සිටුවරයා අවවාද කළේය."
  },
  {
    "id": "G4_C5_026",
    "category": "C5",
    "competency": "Moral & Value Judgment",
    "sub_skill": "Story message inference",
    "difficulty": 0.55,
    "prompt": "“ප්‍රඥාවන්ත වැඩිහිටියන්ගේ අවවාද පිළිපැදීමෙන් අනතුරුවලින් මිදී යහපත උදාකර ගත හැකි බව මෙම කතාවෙන් පහදා දෙයි.” මෙම කතාවෙන් ලැබෙන ප්‍රධාන ආදර්ශය කුමක්ද?",
    "options": [
      "නුවණැත්තන්ගේ අවවාද පිළිපැදීම",
      "කැලෑවල පමණක් ගමන් කිරීම",
      "ගස්වල ගෙඩි පමණක් කෑම",
      "කිසිවෙකු නොඇසීම"
    ],
    "answer": "නුවණැත්තන්ගේ අවවාද පිළිපැදීම",
    "audioPrompt": "කතාවෙන් ලැබෙන ආදර්ශය තෝරන්න.",
    "explanation": "වැඩිහිටි නුවණැත්තන්ගේ උපදෙස් පිළිපැදීමෙන් ජීවිතය ආරක්ෂා වේ."
  },
  {
    "id": "G4_C5_027",
    "category": "C5",
    "competency": "Organizing Entity Retrieval",
    "sub_skill": "Tree planting project narrative",
    "difficulty": 0.45,
    "prompt": "“පාසල් පරිසර සංගමය සංවිධානය කළ ගස් රෝපණ වැඩසටහනට සිව්වන හා පස්වන ශ්‍රේණිවල සිසුන් සහභාගි වී පාසල් වත්තේ පැළ සිටුවූහ.” වැඩසටහන සංවිධානය කළේ කවුද?",
    "options": [
      "පරිසර සංගමය",
      "ක්‍රීඩා සංගමය",
      "කලා සංගමය",
      "ශිෂ්‍ය සංගමය"
    ],
    "answer": "පරිසර සංගමය",
    "audioPrompt": "වැඩසටහන සංවිධානය කළ සංගමය තෝරන්න.",
    "explanation": "පාඨයේ සඳහන් පරිදි ගස් රෝපණය සංවිධානය කළේ පාසල් පරිසර සංගමයයි."
  },
  {
    "id": "G4_C5_028",
    "category": "C5",
    "competency": "Routine & Schedule Retrieval",
    "sub_skill": "Classroom bookshelf maintenance narrative",
    "difficulty": 0.45,
    "prompt": "“අකිලගේ පන්තියේ පොත් රාක්කයක් තිබුණි. සෑම සිකුරාදාම අකිල හා මිතුරන් රාක්කයේ පොත් පිළිවෙළට තැබූහ.” සිසුන් පොත් පිළිවෙළට තැබුවේ කවදාද?",
    "options": [
      "සෑම සිකුරාදාම",
      "සෑම සඳුදාම",
      "සෑම ඉරිදාම",
      "සෑම අඟහරුවාදාම"
    ],
    "answer": "සෑම සිකුරාදාම",
    "audioPrompt": "පොත් පිළිවෙළට තැබූ දිනය තෝරන්න.",
    "explanation": "පාඨයේ සඳහන් වන්නේ සෑම සිකුරාදා දිනකම පොත් පිළිවෙළ කළ බවයි."
  },
  {
    "id": "G4_C5_029",
    "category": "C5",
    "competency": "Speech Subject Retrieval",
    "sub_skill": "Morning assembly principal speech narrative",
    "difficulty": 0.45,
    "prompt": "“සඳුදා උදෑසන රැස්වීමේදී විදුහල්පතිතුමා පාසල පිරිසිදුව තබා ගැනීමේ වැදගත්කම පැහැදිලි කළේය.” විදුහල්පතිතුමා කතා කළේ කුමක් පිළිබඳවද?",
    "options": [
      "පාසල පිරිසිදුව තබා ගැනීම පිළිබඳව",
      "ක්‍රීඩා පිළිබඳව",
      "ආහාර ගැනීම පිළිබඳව",
      "නිවාඩු ලබාදීම පිළිබඳව"
    ],
    "answer": "පාසල පිරිසිදුව තබා ගැනීම පිළිබඳව",
    "audioPrompt": "විදුහල්පතිතුමා කතා කළ කරුණ තෝරන්න.",
    "explanation": "විදුහල්පතිතුමා පැහැදිලි කළේ පාසල පිරිසිදුව තබා ගැනීමේ වැදගත්කමයි."
  },
  {
    "id": "G4_C5_030",
    "category": "C5",
    "competency": "Weather Observation Retrieval",
    "sub_skill": "Afternoon weather change narrative",
    "difficulty": 0.45,
    "prompt": "“උදෑසන අහස පැහැදිලිව තිබුණද දහවල් වන විට කළු වලාකුළු එක්වී තද සුළඟක් හමන්නට විය.” දහවල් වන විට අහසේ සිදු වූයේ කුමක්ද?",
    "options": [
      "කළු වලාකුළු එක්වී තද සුළඟක් හමන්නට විය",
      "හිරු තදින් පෑයුවේය",
      "හිම පතනය විය",
      "තරු පෑයුවේය"
    ],
    "answer": "කළු වලාකුළු එක්වී තද සුළඟක් හමන්නට විය",
    "audioPrompt": "දහවල් වන විට සිදු වූ දෙය තෝරන්න.",
    "explanation": "පාඨයේ සඳහන් පරිදි දහවල් වන විට කළු වලාකුළු එක්වී සුළඟ හමන්නට විය."
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

