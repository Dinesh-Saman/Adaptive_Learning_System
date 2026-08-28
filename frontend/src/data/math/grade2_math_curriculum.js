// Sri Lankan Grade 2 Mathematics Curriculum Framework
// 4 Domains x 5 Skills = 20 Skills x 5 Difficulty Levels
// Based on the National Institute of Education (NIE) Grade 2 Primary Mathematics Teacher Guide

export const GRADE2_DOMAINS = {
  D1_NUMBER_SENSE: {
    id: "D1_NUMBER_SENSE",
    name_en: "Number Sense",
    name_si: "සංඛ්‍යා සංකල්පය",
    icon: "🔢",
    color: "from-blue-500 to-indigo-600",
    skills: [
      { id: "G2_D1_S1_COUNTING", name_en: "Counting in 1s and 2s (up to 100)", name_si: "1න් 1 සහ 2න් 2 ගණන් කිරීම (100 දක්වා)" },
      { id: "G2_D1_S2_NUMBER_READING", name_en: "Number Reading & Writing (1-100 & 0)", name_si: "සංඛ්‍යා හඳුනාගැනීම හා ලිවීම (1-100 සහ 0)" },
      { id: "G2_D1_S3_PLACE_VALUE", name_en: "Place Value (Tens and Ones up to 99)", name_si: "ස්ථානීය අගය (දහයේ සහ එකේ ඒවා)" },
      { id: "G2_D1_S4_COMPARING_ORDERING", name_en: "Comparing & Ordering (up to 100)", name_si: "සංඛ්‍යා සැසඳීම සහ පෙළගැස්වීම" },
      { id: "G2_D1_S5_PATTERNS_PREMATH", name_en: "Number Patterns (+2) & Pre-Math", name_si: "සංඛ්‍යා රටා (2න් 2) සහ පූර්ව ගණිතය" }
    ]
  },
  D2_OPERATIONS: {
    id: "D2_OPERATIONS",
    name_en: "Mathematical Operations",
    name_si: "ගණිත කර්ම",
    icon: "➕",
    color: "from-emerald-500 to-teal-600",
    skills: [
      { id: "G2_D2_S1_ADDITION_20", name_en: "Basic Addition (sums to 20)", name_si: "මූලික එකතු කිරීම (20 දක්වා)" },
      { id: "G2_D2_S2_ADDITION_2DIGIT", name_en: "2-Digit Addition (up to 99)", name_si: "ඉලක්කම් 2ක එකතු කිරීම (99 දක්වා)" },
      { id: "G2_D2_S3_SUBTRACTION_20", name_en: "Basic Subtraction (within 20)", name_si: "මූලික අඩු කිරීම (20 දක්වා)" },
      { id: "G2_D2_S4_SUBTRACTION_2DIGIT", name_en: "2-Digit Subtraction (up to 99)", name_si: "ඉලක්කම් 2ක අඩු කිරීම (99 දක්වා)" },
      { id: "G2_D2_S5_WORD_PROBLEMS_BONDS", name_en: "Word Problems & Number Bonds (to 20)", name_si: "සරල වාචික ගැටලු සහ සංඛ්‍යා බන්ධන" }
    ]
  },
  D3_MEASUREMENT: {
    id: "D3_MEASUREMENT",
    name_en: "Measurement & Everyday Mathematics",
    name_si: "මිනුම් සහ එදිනෙදා ගණිතය",
    icon: "📏",
    color: "from-amber-500 to-orange-600",
    skills: [
      { id: "G2_D3_S1_LENGTH", name_en: "Length & Height (Non-standard units)", name_si: "දිග සහ උස (අභිමත ඒකක)" },
      { id: "G2_D3_S2_WEIGHT", name_en: "Mass & Balance Scale (Non-standard)", name_si: "බර සහ තරාදිය (අභිමත ඒකක)" },
      { id: "G2_D3_S3_CAPACITY", name_en: "Capacity (Comparing Containers)", name_si: "ධාරිතාව (භාජන සැසඳීම)" },
      { id: "G2_D3_S4_TIME_DAYS", name_en: "Time Elapsed & 7 Days of the Week", name_si: "කාලය ගතවීම සහ සතියේ දින 7" },
      { id: "G2_D3_S5_MONEY_COINS", name_en: "Coins (Rs. 1, 2, 5, 10) & Transactions", name_si: "කාසි (රු. 1, 2, 5, 10) සහ සරල ගනුදෙනු" }
    ]
  },
  D4_GEOMETRY_DATA: {
    id: "D4_GEOMETRY_DATA",
    name_en: "Geometry, Space & Data",
    name_si: "ජ්‍යාමිතිය සහ දත්ත",
    icon: "📐",
    color: "from-purple-500 to-pink-600",
    skills: [
      { id: "G2_D4_S1_2D_SHAPES", name_en: "2D Shapes (Circle, Square, Triangle, Rect)", name_si: "ද්විමාන හැඩතල (වෘත්තය, සමචතුරස්‍රය...)" },
      { id: "G2_D4_S2_3D_SOLIDS", name_en: "3D Everyday Solids (Cube, Cylinder, Sphere)", name_si: "පරිසරයේ ත්‍රිමාණ වස්තු (ඝනකය, සිලින්ඩරය...)" },
      { id: "G2_D4_S3_POSITION_SPACE", name_en: "Position & Space (Top, Bottom, In, Out)", name_si: "පිහිටීම සහ අවකාශීය සංකල්ප" },
      { id: "G2_D4_S4_MATCHING_RELATIONS", name_en: "1-to-1 Matching & Many-to-One Relations", name_si: "එකට එක ගැළපීම සහ සම්බන්ධතා" },
      { id: "G2_D4_S5_DATA_SORTING", name_en: "Sorting & Pictorial Tables", name_si: "වර්ගීකරණය සහ සරල රූප සටහන්" }
    ]
  }
};
