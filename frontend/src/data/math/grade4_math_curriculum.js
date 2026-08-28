// Sri Lankan Grade 4 Mathematics Curriculum Framework
// 4 Domains x 5 Skills = 20 Skills x 5 Difficulty Levels
// Based on the National Institute of Education (NIE) Grade 4 Primary Mathematics Teacher Guide

export const GRADE4_DOMAINS = {
  D1_NUMBER_SENSE: {
    id: "D1_NUMBER_SENSE",
    name_en: "Number Sense",
    name_si: "සංඛ්‍යා සංකල්පය",
    icon: "🔢",
    color: "from-blue-600 to-indigo-700",
    skills: [
      { id: "G4_D1_S1_PLACE_VALUE_10000", name_en: "Place Value & Reading Numbers (up to 10,000)", name_si: "10,000 දක්වා ස්ථානීය අගය සහ කියවීම/ලිවීම" },
      { id: "G4_D1_S2_ROMAN_NUMERALS", name_en: "Roman Numerals (I to XX)", name_si: "රෝම ඉලක්කම් (I සිට XX දක්වා)" },
      { id: "G4_D1_S3_ROUNDING_COMPARING", name_en: "Rounding (nearest 10 & 100) and Comparing", name_si: "ළඟම 10ට සහ 100ට වැටයීම සහ සැසඳීම" },
      { id: "G4_D1_S4_FACTORS_MULTIPLES", name_en: "Factors & Multiples", name_si: "සාධක සහ ගුණාකාර" },
      { id: "G4_D1_S5_NUMBER_PATTERNS", name_en: "Number Patterns & Special Numbers", name_si: "සංඛ්‍යා රටා සහ විශේෂ සංඛ්‍යා" }
    ]
  },
  D2_OPERATIONS: {
    id: "D2_OPERATIONS",
    name_en: "Mathematical Operations",
    name_si: "ගණිත කර්ම",
    icon: "➕",
    color: "from-emerald-600 to-teal-700",
    skills: [
      { id: "G4_D2_S1_ADDITION_4DIGIT", name_en: "4-Digit Addition with Regrouping", name_si: "ඉලක්කම් 4ක සංඛ්‍යා එකතු කිරීම" },
      { id: "G4_D2_S2_SUBTRACTION_4DIGIT", name_en: "4-Digit Subtraction with Regrouping", name_si: "ඉලක්කම් 4ක සංඛ්‍යා අඩු කිරීම" },
      { id: "G4_D2_S3_MULTIPLICATION", name_en: "Multiplication (2 & 3 Digit Numbers)", name_si: "ඉලක්කම් 2ක සහ 3ක සංඛ්‍යා ගුණ කිරීම" },
      { id: "G4_D2_S4_DIVISION", name_en: "Division with/without Remainder", name_si: "ශේෂය සහිත සහ රහිත බෙදීම" },
      { id: "G4_D2_S5_FRACTIONS_DECIMALS", name_en: "Fractions & Decimals Operations", name_si: "භාග සහ දශම සංඛ්‍යා එකතු කිරීම/අඩු කිරීම" }
    ]
  },
  D3_MEASUREMENT: {
    id: "D3_MEASUREMENT",
    name_en: "Measurement & Everyday Mathematics",
    name_si: "මිනුම් සහ එදිනෙදා ගණිතය",
    icon: "📏",
    color: "from-amber-600 to-orange-700",
    skills: [
      { id: "G4_D3_S1_LENGTH_PERIMETER", name_en: "Length, Distance & Perimeter (km/m/cm)", name_si: "දිග, පරිමිතිය සහ ඒකක පරිවර්තනය" },
      { id: "G4_D3_S2_WEIGHT_MASS", name_en: "Mass & Weight (kg & g Conversions)", name_si: "ස්කන්ධය සහ බර (kg/g ගණනය කිරීම්)" },
      { id: "G4_D3_S3_CAPACITY_VOLUME", name_en: "Capacity & Liquid Volume (L & ml)", name_si: "ධාරිතාව (L/ml ගණනය කිරීම්)" },
      { id: "G4_D3_S4_TIME_CALENDAR", name_en: "Time, Clock Reading & Calendar", name_si: "කාලය, ඔරලෝසුව සහ දින දර්ශනය" },
      { id: "G4_D3_S5_MONEY_BILLS", name_en: "Money, Bills & Transactions", name_si: "මුදල්, බිල්පත් සහ ගනුදෙනු" }
    ]
  },
  D4_GEOMETRY_DATA: {
    id: "D4_GEOMETRY_DATA",
    name_en: "Geometry, Space & Data",
    name_si: "ජ්‍යාමිතිය සහ දත්ත",
    icon: "📐",
    color: "from-purple-600 to-pink-700",
    skills: [
      { id: "G4_D4_S1_ANGLES_LINES", name_en: "Angles (Right, Acute, Obtuse) & Lines", name_si: "කෝණ (සෘජු, සුළු, මහා) සහ සමාන්තර රේඛා" },
      { id: "G4_D4_S2_2D_AREA_SHAPES", name_en: "2D Shapes, Area & Properties", name_si: "ද්විමාන හැඩතල සහ වර්ගඵලය" },
      { id: "G4_D4_S3_3D_SOLIDS", name_en: "3D Solids (Faces, Edges, Vertices)", name_si: "ත්‍රිමාණ ඝන වස්තු (මුහුණත්, දාර, ශීර්ෂ)" },
      { id: "G4_D4_S4_SYMMETRY", name_en: "Symmetry & Lines of Symmetry", name_si: "සමමිතිය සහ සමමිතික අක්ෂ" },
      { id: "G4_D4_S5_DATA_BAR_GRAPHS", name_en: "Data Handling, Bar Graphs & Tables", name_si: "තීරු ප්‍රස්තාර, පින්තූර ප්‍රස්තාර සහ දත්ත" }
    ]
  }
};
