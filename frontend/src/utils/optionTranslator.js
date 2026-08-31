const SINHALA_EXACT_MAP = {
  'A විශාල වේ (A > B)': 'A is greater (A > B)',
  'B විශාල වේ (B > A)': 'B is greater (B > A)',
  'A සහ B සමාන වේ': 'A and B are equal',
  '🟦 (නිල් කොටුව)': '🟦 (Blue Square)',
  '🔴 (රතු රවුම)': '🔴 (Red Circle)',
  '⭐ (තරුව)': '⭐ (Star)',
  '🔺 (ත්‍රිකෝණය)': '🔺 (Triangle)',
  'වියත (Handspan)': 'Handspan',
  'පියවර (Step)': 'Footstep',
  'රියන (Cubite)': 'Cubite',
  'කිලෝග්‍රෑම්': 'kg',
  'මේසය (Table)': 'Table',
  'පුටුව (Chair)': 'Chair',
  'ගිනිකූරක් හෝ කුඩා පැන්සලක්': 'Matchstick or small pencil',
  'පියවරක් (Footsteps)': 'Footstep',
  'මීටර් 10 කෝදුවක්': '10m ruler',
  'ලීටරයක්': '1 Liter',
  'ගල (Rock)': 'Rock',
  'පිහාටුව (Feather)': 'Feather',
  'පොත බරින් වැඩිය': 'Book is heavier',
  'පොත බරින් අඩුය': 'Book is lighter',
  'පොත සැහැල්ලුය': 'Book is light',
  'තරාදිය කැඩී ඇත': 'Scale is broken',
  'අඹ ගෙඩිය (Mango)': 'Mango',
  'දෙහි ගෙඩිය (Lime)': 'Lime',
  'නොදනී': 'Unknown',
  'පියන් 5කට': 'For 5 lids',
  'පියන් 10කට': 'For 10 lids',
  'පියන් 15කට': 'For 15 lids',
  'පියන් 20කට': 'For 20 lids',
  'ලී කුට්ටිය (Wood block)': 'Wood block',
  'සබන් කැටය (Soap)': 'Soap',
  'බාල්දිය (Bucket)': 'Bucket',
  'තේ හැන්ද (Teaspoon)': 'Teaspoon',
  'බෙහෙත් මූඩිය': 'Medicine cap',
  'බිංදු විදුරුව': 'Dropper',
  'දෙවන භාජනය (Vessel B)': 'Vessel B',
  'පළමු භාජනය (Vessel A)': 'Vessel A',
  'බඳුන, බෝතලය, ජෝගුව': 'Pot, Bottle, Jug',
  'ජෝගුව, බෝතලය, බඳුන': 'Jug, Bottle, Pot',
  'බෝතලය, බඳුන, ජෝගුව': 'Bottle, Pot, Jug',
  'බඳුන, ජෝගුව, බෝතලය': 'Pot, Jug, Bottle',
  'අඟහරුවාදා (Tuesday)': 'Tuesday',
  'බදාදා (Wednesday)': 'Wednesday',
  'ඉරිදා (Sunday)': 'Sunday',
  'සිකුරාදා (Friday)': 'Friday',
  'සෙනසුරාදා (Saturday)': 'Saturday',
  'බ්‍රහස්පතින්දා (Thursday)': 'Thursday',
  'සඳුදා (Monday)': 'Monday',
  'මීටර් 50ක් දිවීමට': 'Running 50m',
  'මීටර් 10ක් දිවීමට': 'Running 10m',
  'දෙකටම එකම කාලය': 'Same time for both',
  'බදාදා, බ්‍රහස්පතින්දා, සිකුරාදා': 'Wednesday, Thursday, Friday',
  'සිකුරාදා, බදාදා, බ්‍රහස්පතින්දා': 'Friday, Wednesday, Thursday',
  'ඉරිදා, සිකුරාදා, සෙනසුරාදා': 'Sunday, Friday, Saturday',
  'සඳුදා, බදාදා, අඟහරුවාදා': 'Monday, Wednesday, Tuesday',
  'ත්‍රිකෝණය (Triangle)': 'Triangle',
  'වෘත්තය (Circle)': 'Circle',
  'සමචතුරස්‍රය (Square)': 'Square',
  'සෘජුකෝණාස්‍රය': 'Rectangle',
  'පාද 4ම දිගින් සමාන වේ': 'All 4 sides are equal in length',
  'පාද 2ක් පමණක් සමාන වේ': 'Only 2 sides are equal',
  'සියලු පාද අසමාන වේ': 'All sides are unequal',
  'පාද වක්‍ර වේ': 'Sides are curved',
  'දෙකටම පාද 4 බැගින් ඇත': 'Both have 4 sides each',
  'දෙකටම පාද 3 බැගින් ඇත': 'Both have 3 sides each',
  'දෙකම රවුම්ය': 'Both are round',
  'දෙකටම පාද නොමැත': 'Neither has sides',
  'ගෝලය (Sphere)': 'Sphere',
  'ඝනකය (Cube)': 'Cube',
  'සිලින්ඩරය (Cylinder)': 'Cylinder',
  'සමචතුරස්‍රය': 'Square',
  'ත්‍රිකෝණය': 'Triangle',
  'පිරමිඩය': 'Pyramid',
  'ඝනකය හෝ ඝනකාභය (Cube/Cuboid)': 'Cube or Cuboid',
  'ගෝලය': 'Sphere',
  'සිලින්ඩරය': 'Cylinder',
  'කේතුව': 'Cone',
  'යට (Under/Below)': 'Under / Below',
  'උඩ (On top)': 'On top',
  'ඇතුළේ (Inside)': 'Inside',
  'පිටත (Outside)': 'Outside',
  'යට (Under)': 'Under',
  'ඉදිරියෙන් (In front)': 'In front',
  'පිටුපසින් (Behind)': 'Behind',
  'මැද (Middle)': 'Middle',
  'දකුණු අත (Right hand)': 'Right hand',
  'වම් අත (Left hand)': 'Left hand',
  'යට අත': 'Lower hand',
  'උඩ අත': 'Upper hand',
  'නිමල් (Nimal)': 'Nimal',
  'කමල් (Kamal)': 'Kamal',
  'සුනිල් (Sunil)': 'Sunil',
  'කිසිවෙක් නැත': 'None',
  'ළමුන් ගණන සහ කෙසෙල් ගණන සමානයි': 'Number of children and bananas are equal',
  'කෙසෙල් වැඩියි': 'More bananas',
  'ළමුන් වැඩියි': 'More children',
  'වර්ණය (Color)': 'Color',
  'හැඩය (Shape)': 'Shape',
  'බර (Weight)': 'Weight',
  'දිග (Length)': 'Length',
  'තරම / ප්‍රමාණය (Size)': 'Size',
  'සුවඳ': 'Smell',
  'නම': 'Name',
  'කෙසෙල් (Bananas)': 'Bananas',
  'ඇපල් (Apples)': 'Apples',
  'අඹ (Mangoes)': 'Mangoes',
  'හත්සිය නවය': 'Seven hundred nine (709)',
  'හත්සිය අනූව': 'Seven hundred ninety (790)',
  'හත්සිය අනූ නවය': 'Seven hundred ninety-nine (799)',
  'හත්දහස් නවය': 'Seven thousand nine (7009)',
  'හයසිය හතළිහ': 'Six hundred forty (640)',
  'හයසිය හතර': 'Six hundred four (604)',
  'හයසිය හතළිස් හතර': 'Six hundred forty-four (644)',
  'හැට හතර': 'Sixty-four (64)',
  'හතළිස් පහ': 'Forty-five (45)',
  'තිස් පහ': 'Thirty-five (35)',
  'පනස් හතර': 'Fifty-four (54)',
  'විසි පහ': 'Twenty-five (25)',
  '0 (ශූන්‍යය)': '0 (Zero)',
  '1 (එක)': '1 (One)',
  '10 (දහය)': '10 (Ten)',
  '5 (පහ)': '5 (Five)',
  'දින 28': '28 Days',
  'දින 29': '29 Days',
  'දින 30': '30 Days',
  'දින 31': '31 Days',
  'එකස්ථානය (Ones)': 'Ones place',
  'දහස්ථානය (Tens)': 'Tens place',
  'සියස්ථානය (Hundreds)': 'Hundreds place',
  'දහස්ස්ථානය (Thousands)': 'Thousands place',
  'X සහ Y සමාන වේ': 'X and Y are equal',
  'හතරෙන් එක (1/4)': 'One fourth (1/4)',
  'දෙකෙන් එක / අඩ (1/2)': 'One half (1/2)',
  'තුනෙන් එක (1/3)': 'One third (1/3)',
  'සම්පූර්ණ (1)': 'Whole (1)',
  'මිලිමීටර් (mm)': 'mm',
  'මීටර් (m)': 'm',
  'ලීටර් (L)': 'L',
  'ග්‍රෑම් (g)': 'g',
  'කිලෝග්‍රෑම් (kg)': 'kg',
  'තත්පර (s)': 's',
  'සෙන්ටිමීටර් (cm)': 'cm',
  '7:30 (හතහමාර)': '7:30 (Half past 7)',
  '8:30 (අටහමාර)': '8:30 (Half past 8)',
  'පැය 1යි මිනිත්තු 15': '1 Hour 15 Minutes',
  'පැය 1යි මිනිත්තු 30': '1 Hour 30 Minutes',
  'පැය 1යි මිනිත්තු 45': '1 Hour 45 Minutes',
  'පැය 2යි': '2 Hours',
  'සෘජුකෝණාස්‍රය (Rectangle)': 'Rectangle',
  'පාද නොමැත': 'No sides',
  'පාද 3ක් පමණක් ඇත': 'Only 3 sides',
  'මුහුණත් වක්‍ර වේ': 'Faces are curved',
  'සම්මුඛ පාද සමාන දිගින් යුක්තය': 'Opposite sides are equal in length',
  'සියලු පාද අසමානය': 'All sides are unequal',
  'මුදුන් නොමැත': 'No vertices',
  'පාද 5ක් ඇත': 'Has 5 sides',
  'ත්‍රිකෝණයක්': 'Triangle',
  'සෘජුකෝණාස්‍රයක්': 'Rectangle',
  'වෘත්තයක්': 'Circle',
  'පංචාස්‍රයක්': 'Pentagon',
  'කේතුව (Cone)': 'Cone',
  'ඝනකය': 'Cube',
  'ඝනකාභය': 'Cuboid',
  'උතුර (North)': 'North',
  'දකුණ (South)': 'South',
  'නැගෙනහිර (East)': 'East',
  'බටහිර (West)': 'West',
  'ඊසාන (North-East)': 'North-East',
  'ගිනිකොන (South-East)': 'South-East',
  'වයඹ (North-West)': 'North-West',
  'නිරිත (South-West)': 'South-West',
  'නැගෙනහිර': 'East',
  'බටහිර': 'West',
  'උතුර': 'North',
  'සම්පූර්ණයෙන්ම එකිනෙක මත සමපාත වේ': 'Completely coincide with each other',
  'එකක් විශාල වේ': 'One is larger',
  'හැඩය වෙනස් වේ': 'Shape is different',
  'අනන්තය': 'Infinite',
  '4ක් පමණි': '4 only',
  '8ක් පමණි': '8 only',
  '100ක් පමණි': '100 only',
  'අසීමිත / අනන්ත ගණනක් (Infinite)': 'Infinite',
  'අඹ': 'Mango',
  'ඇපල්': 'Apple',
  'කෙසෙල් (Banana)': 'Banana',
  'කෙසෙල්': 'Banana',
  'සඳුදා': 'Monday',
  'අඟහරුවාදා': 'Tuesday',
  'ඉරිදා': 'Sunday',
  'බදාදා': 'Wednesday',
  'සෘජු කෝණය': 'Right angle',
  'සුළු කෝණය': 'Acute angle',
  'මහා කෝණය': 'Obtuse angle',
  'සරල කෝණය': 'Straight angle',
  'ප්‍රත්‍යාවර්ත කෝණය': 'Reflex angle',
  'බද්ධ කෝණය': 'Adjacent angle',
  'සමාන්තර රේඛා': 'Parallel lines',
  'ලම්බක රේඛා': 'Perpendicular lines',
  'තිරස් රේඛා': 'Horizontal lines',
  'ඡේදක රේඛා': 'Intersecting lines',
  'සෘජු කෝණයක්': 'Right angle',
  'සුළු කෝණයක්': 'Acute angle',
  'මහා කෝණයක්': 'Obtuse angle',
  'සරල කෝණයක්': 'Straight angle',
  'පංචාස්‍රය': 'Pentagon',
  'වෘත්තය': 'Circle',
  'අනන්ත සංඛ්‍යාවක් ඇත': 'Infinite number',
  '4ක් පමණක් ඇත': 'Only 4',
  '2ක් පමණක් ඇත': 'Only 2',
  '100ක් ඇත': '100',
  'සියල්ල සමානයි': 'All are equal',
  'දෙකම සමානයි': 'Both are equal',
  'කිසිවක් නොවේ': 'None of these'
};

export function translateOption(opt, isEnglish) {
  if (!isEnglish || opt === null || opt === undefined) return opt;
  if (typeof opt !== 'string') return opt;

  let s = opt.trim();

  // 1. Direct dictionary match
  if (SINHALA_EXACT_MAP[s]) {
    return SINHALA_EXACT_MAP[s];
  }

  // 2. Extracted English in parenthesis
  const parenMatch = s.match(/^[^(]+\(([^)]+)\)$/);
  if (parenMatch && /^[A-Za-z0-9\s/.,'%-]+$/.test(parenMatch[1].trim())) {
    return parenMatch[1].trim();
  }

  // 3. Dynamic Regex Engines
  s = s.replace(/දින\s*(\d+)ක්?/g, '$1 Days');
  s = s.replace(/(\d+)ක්?\s*දින/g, '$1 Days');
  s = s.replace(/ලබ්ධිය\s*(\d+),\s*ශේෂය\s*(\d+)/g, 'Quotient $1, Remainder $2');
  s = s.replace(/(\d+)\s*වර්ග\s*සෙ\.මී\./g, '$1 sq cm');
  s = s.replace(/මුහුණත්\s*(\d+),\s*දාර\s*(\d+)/g, '$1 Faces, $2 Edges');
  s = s.replace(/රු\.\s*(\d+)/g, 'Rs. $1');
  s = s.replace(/රුපියල්\s*(\d+)\s*කාසිය/g, 'Rs. $1 Coin');
  s = s.replace(/රුපියල්\s*(\d+)\s*කාසි/g, 'Rs. $1 Coins');
  s = s.replace(/රුපියල්\s*(\d+)\s*නෝට්ටුව/g, 'Rs. $1 Note');
  s = s.replace(/රුපියල්\s*(\d+)\s*නෝට්ටු/g, 'Rs. $1 Notes');
  s = s.replace(/රුපියල්\s*(\d+)/g, 'Rs. $1');

  s = s.replace(/ප\.ව\.\s*(\d+)\.(\d+)/g, '$1.$2 PM');
  s = s.replace(/පෙ\.ව\.\s*(\d+)\.(\d+)/g, '$1.$2 AM');
  s = s.replace(/මිනිත්තු\s*(\d+)/g, '$1 Minutes');
  s = s.replace(/කෝප්ප\s*(\d+)ක්?/g, '$1 Cups');
  s = s.replace(/ලීටර්\s*(\d+)ක්?/g, '$1 Liters');
  s = s.replace(/මිලීලීටර්\s*(\d+)ක්?/g, '$1 ml');
  s = s.replace(/ග්‍රෑම්\s*(\d+)ක්?/g, '$1 g');
  s = s.replace(/කිලෝග්‍රෑම්\s*(\d+)ක්?/g, '$1 kg');
  s = s.replace(/සෙන්ටිමීටර්\s*(\d+)ක්?/g, '$1 cm');
  s = s.replace(/මීටර්\s*(\d+)ක්?/g, '$1 m');
  s = s.replace(/පැය\s*(\d+)ක්?/g, '$1 Hours');

  s = s.replace(/^(\d+)ක්$/g, '$1');
  s = s.replace(/\b(\d+)\s*සහ\s*(\d+)\b/g, '$1 and $2');
  s = s.replace(/\b(\d+)\s*හෝ\s*(\d+)\b/g, '$1 or $2');
  s = s.replace(/\bසහ\b/g, 'and');
  s = s.replace(/\bහෝ\b/g, 'or');
  s = s.replace(/\bසිට\b/g, 'from');
  s = s.replace(/\bදක්වා\b/g, 'to');
  s = s.replace(/\bඅතර\b/g, 'between');

  s = s.replace(/දහයේ\s*ඒවා\s*(\d+)ක්\s*සහ\s*එකේ\s*(ඒවා\s*)?(\d+)ක්/g, '$1 Tens and $3 Ones');
  s = s.replace(/දහයේ\s*ඒවා\s*(\d+)ක්/g, '$1 Tens');
  s = s.replace(/දහයේ\s*(\d+)ක්/g, '$1 Tens');
  s = s.replace(/එකේ\s*ඒවා\s*(\d+)ක්/g, '$1 Ones');
  s = s.replace(/එකේ\s*(\d+)ක්/g, '$1 Ones');

  s = s.replace(/දහයේ\s*මිටි/g, 'Tens');
  s = s.replace(/දහයේ\s*ඒවා/g, 'Tens');
  s = s.replace(/එකේ\s*ඒවා/g, 'Ones');
  s = s.replace(/දශක/g, 'Tens');
  s = s.replace(/ඒකක/g, 'Ones');
  s = s.replace(/සියස්/g, 'Hundreds');
  s = s.replace(/දහස්/g, 'Thousands');

  s = s.replace(/දකුණු\s*අත/g, 'Right hand');
  s = s.replace(/වම්\s*අත/g, 'Left hand');
  s = s.replace(/යට\s*අත/g, 'Lower hand');
  s = s.replace(/උඩ\s*අත/g, 'Upper hand');

  s = s.replace(/\bදකුණ\b/g, 'Right');
  s = s.replace(/\bවම\b/g, 'Left');
  s = s.replace(/\bඋඩ\b/g, 'Up');
  s = s.replace(/\bයට\b/g, 'Down');
  s = s.replace(/\bඉදිරිය\b/g, 'Front');
  s = s.replace(/\bපසුපස\b/g, 'Back');
  s = s.replace(/\bඇතුළත\b/g, 'Inside');
  s = s.replace(/\bපිටත\b/g, 'Outside');

  s = s.replace(/විශාලතම/g, 'Largest');
  s = s.replace(/විශාලම/g, 'Largest');
  s = s.replace(/කුඩාම/g, 'Smallest');
  s = s.replace(/වැඩිම/g, 'Most');
  s = s.replace(/අඩුම/g, 'Least');
  s = s.replace(/දිගම/g, 'Longest');
  s = s.replace(/කොටම/g, 'Shortest');
  s = s.replace(/බරම/g, 'Heaviest');
  s = s.replace(/සැහැල්ලුම/g, 'Lightest');
  s = s.replace(/පළලම/g, 'Widest');

  s = s.replace(/කෙළින්\s*රේඛාව/g, 'Straight line');
  s = s.replace(/වක්‍ර\s*රේඛාව/g, 'Curved line');
  s = s.replace(/වෘත්තය/g, 'Circle');
  s = s.replace(/චතුරස්‍රය/g, 'Square');
  s = s.replace(/ඍජුකෝණාස්‍රය/g, 'Rectangle');
  s = s.replace(/ත්‍රිකෝණය/g, 'Triangle');
  s = s.replace(/සිලින්ඩරය/g, 'Cylinder');
  s = s.replace(/ගෝලය/g, 'Sphere');
  s = s.replace(/ඝනකය/g, 'Cube');

  s = s.replace(/\(ශූන්‍යය\)/g, '(Zero)');
  s = s.replace(/\(ශූන්‍යය \/ බිංදුව\)/g, '(Zero / 0)');
  s = s.replace(/ශූන්‍යය/g, 'Zero');
  s = s.replace(/බිංදුව/g, 'Zero');

  return s;
}
