// Sri Lankan Grade 3 Mathematics Curriculum Framework
// 4 Domains x 5 Skills = 20 Skills x 5 Difficulty Levels
// Based on the National Institute of Education (NIE) Primary Mathematics Teacher Guide

export const GRADE3_DOMAINS = {
  D1_NUMBER_SENSE: {
    id: "D1_NUMBER_SENSE",
    name_en: "Number Sense",
    name_si: "සංඛ්‍යා සංකල්පය",
    icon: "🔢",
    color: "from-blue-500 to-indigo-600",
    skills: [
      { id: "D1_S1_COUNTING", name_en: "Counting Forward & Backward", name_si: "ඉදිරියට සහ පසුපසට ගණන් කිරීම" },
      { id: "D1_S2_NUMBER_READING", name_en: "Number Recognition & Reading", name_si: "සංඛ්‍යා හඳුනාගැනීම සහ කියවීම" },
      { id: "D1_S3_PLACE_VALUE", name_en: "Place Value & Partitioning", name_si: "ස්ථානීය අගය සහ සංඛ්‍යා වෙන්කිරීම" },
      { id: "D1_S4_COMPARING_ORDERING", name_en: "Comparing & Ordering", name_si: "සංඛ්‍යා සැසඳීම සහ පෙළගැස්වීම" },
      { id: "D1_S5_NUMBER_PATTERNS", name_en: "Number Patterns & Sequences", name_si: "සංඛ්‍යා රටා සහ අනුක්‍රම" }
    ]
  },
  D2_OPERATIONS: {
    id: "D2_OPERATIONS",
    name_en: "Mathematical Operations",
    name_si: "ගණිත කර්ම",
    icon: "➕",
    color: "from-emerald-500 to-teal-600",
    skills: [
      { id: "D2_S1_ADDITION", name_en: "Addition (up to 3 digits)", name_si: "එකතු කිරීම" },
      { id: "D2_S2_SUBTRACTION", name_en: "Subtraction (up to 3 digits)", name_si: "අඩු කිරීම" },
      { id: "D2_S3_MULTIPLICATION", name_en: "Multiplication (Arrays & Groups)", name_si: "ගුණ කිරීම" },
      { id: "D2_S4_DIVISION", name_en: "Division (Equal Sharing)", name_si: "බෙදීම" },
      { id: "D2_S5_FRACTIONS", name_en: "Simple Fractions (Halves & Quarters)", name_si: "සරල භාග" }
    ]
  },
  D3_MEASUREMENT: {
    id: "D3_MEASUREMENT",
    name_en: "Measurement & Everyday Mathematics",
    name_si: "මිනුම් සහ එදිනෙදා ගණිතය",
    icon: "📏",
    color: "from-amber-500 to-orange-600",
    skills: [
      { id: "D3_S1_LENGTH", name_en: "Length & Distance (m/cm)", name_si: "දිග සහ දුර" },
      { id: "D3_S2_WEIGHT", name_en: "Mass & Weight (kg/g)", name_si: "ස්කන්ධය සහ බර" },
      { id: "D3_S3_CAPACITY", name_en: "Capacity & Liquid Volume (L/ml)", name_si: "ධාරිතාව" },
      { id: "D3_S4_TIME", name_en: "Time & Clock Reading", name_si: "කාලය සහ ඔරලෝසුව" },
      { id: "D3_S5_MONEY", name_en: "Money & Change Calculation", name_si: "මුදල් සහ ඉතිරි මුදල" }
    ]
  },
  D4_GEOMETRY_DATA: {
    id: "D4_GEOMETRY_DATA",
    name_en: "Geometry, Space & Data",
    name_si: "ජ්‍යාමිතිය සහ දත්ත",
    icon: "📐",
    color: "from-purple-500 to-pink-600",
    skills: [
      { id: "D4_S1_2D_SHAPES", name_en: "2D Shapes & Properties", name_si: "ද්විමාන හැඩතල" },
      { id: "D4_S2_3D_SOLIDS", name_en: "3D Solid Objects", name_si: "ත්‍රිමාණ ඝන වස්තු" },
      { id: "D4_S3_DIRECTION", name_en: "Direction & Spatial Position", name_si: "දිශාව සහ පිහිටීම" },
      { id: "D4_S4_SYMMETRY", name_en: "Symmetry & Fold Lines", name_si: "සමමිතිය" },
      { id: "D4_S5_DATA_GRAPHS", name_en: "Data Handling & Pictographs", name_si: "දත්ත සහ ප්‍රස්තාර" }
    ]
  }
};
