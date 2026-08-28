# -*- coding: utf-8 -*-
"""
Sri Lankan Grade 2 Mathematics Curriculum Framework
4 Domains x 5 Skills = 20 Skills x 5 Difficulty Levels
Based on the National Institute of Education (NIE) Primary Mathematics Teacher Guide (Grade 2)
"""

GRADE2_DOMAINS = {
    "D1_NUMBER_SENSE": {
        "id": "D1_NUMBER_SENSE",
        "name_en": "Number Sense",
        "name_si": "සංඛ්‍යා සංකල්පය",
        "description_en": "Counting up to 100, number recognition, place value (tens and ones), comparing and patterns",
        "description_si": "100 දක්වා ගණන් කිරීම, කියවීම, ස්ථානීය අගය (දහය සහ එක), සැසඳීම සහ රටා",
        "skills": [
            {
                "id": "G2_D1_S1_COUNTING",
                "name_en": "Counting in 1s and 2s (up to 100)",
                "name_si": "1න් 1 සහ 2න් 2 ගණන් කිරීම (100 දක්වා)",
                "curriculum_code": "NIE-G2-M-2.0",
                "objectives": "Count objects and pictures in 1s up to 100, and by 2s up to 100"
            },
            {
                "id": "G2_D1_S2_NUMBER_READING",
                "name_en": "Number Recognition, Reading & Writing (1-100 and 0)",
                "name_si": "සංඛ්‍යා හඳුනාගැනීම, කියවීම හා ලිවීම (1-100 සහ 0)",
                "curriculum_code": "NIE-G2-M-3.0",
                "objectives": "Read and write numbers in digits and words up to 100; understand zero (0)"
            },
            {
                "id": "G2_D1_S3_PLACE_VALUE",
                "name_en": "Place Value (Tens and Ones up to 99)",
                "name_si": "ස්ථානීය අගය (දහයේ සහ එකේ ඒවා - 99 දක්වා)",
                "curriculum_code": "NIE-G2-M-3.6",
                "objectives": "Express 2-digit numbers using bundles of tens and single ones"
            },
            {
                "id": "G2_D1_S4_COMPARING_ORDERING",
                "name_en": "Comparing & Ordering Numbers (up to 100)",
                "name_si": "සංඛ්‍යා සැසඳීම සහ පෙළගැස්වීම (100 දක්වා)",
                "curriculum_code": "NIE-G2-M-3.7",
                "objectives": "Compare 2-digit numbers (greater/smaller) and arrange 3 numbers in order"
            },
            {
                "id": "G2_D1_S5_PATTERNS_PREMATH",
                "name_en": "Number Patterns (+2) & Pre-Math Sorting",
                "name_si": "සංඛ්‍යා රටා (2න් 2) සහ පූර්ව ගණිත වර්ගීකරණය",
                "curriculum_code": "NIE-G2-M-4.0",
                "objectives": "Build number patterns with common difference of 2; sort objects by shape, size, texture"
            }
        ]
    },
    "D2_OPERATIONS": {
        "id": "D2_OPERATIONS",
        "name_en": "Mathematical Operations",
        "name_si": "ගණිත කර්ම",
        "description_en": "Addition and subtraction up to 20 and 2-digit numbers up to 99 without regrouping",
        "description_si": "20 දක්වා සහ 99 දක්වා ගෙනයෑම්/ගැනීම් රහිත එකතු කිරීම සහ අඩු කිරීම",
        "skills": [
            {
                "id": "G2_D2_S1_ADDITION_20",
                "name_en": "Basic Addition (sums up to 20)",
                "name_si": "මූලික එකතු කිරීම (එකතුව 20 දක්වා)",
                "curriculum_code": "NIE-G2-M-5.1",
                "objectives": "Add single-digit numbers and sums up to 20 using number strips and objects"
            },
            {
                "id": "G2_D2_S2_ADDITION_2DIGIT",
                "name_en": "2-Digit Addition (up to 99 without regrouping)",
                "name_si": "ඉලක්කම් 2ක එකතු කිරීම (99 දක්වා ගෙනයෑම් රහිත)",
                "curriculum_code": "NIE-G2-M-5.3",
                "objectives": "Add two 2-digit numbers without carrying (e.g., 33 + 25 = 58)"
            },
            {
                "id": "G2_D2_S3_SUBTRACTION_20",
                "name_en": "Basic Subtraction (within 20)",
                "name_si": "මූලික අඩු කිරීම (20 දක්වා)",
                "curriculum_code": "NIE-G2-M-6.1",
                "objectives": "Subtract from numbers up to 9 and 20 using concrete objects and number strips"
            },
            {
                "id": "G2_D2_S4_SUBTRACTION_2DIGIT",
                "name_en": "2-Digit Subtraction (up to 99 without borrowing)",
                "name_si": "ඉලක්කම් 2ක අඩු කිරීම (99 දක්වා ගැනීම් රහිත)",
                "curriculum_code": "NIE-G2-M-6.3",
                "objectives": "Subtract 2-digit numbers without decomposition (e.g., 55 - 14 = 41)"
            },
            {
                "id": "G2_D2_S5_WORD_PROBLEMS_BONDS",
                "name_en": "Word Problems & Number Bonds (up to 20)",
                "name_si": "සරල වාචික ගැටලු සහ සංඛ්‍යා බන්ධන",
                "curriculum_code": "NIE-G2-M-5.2",
                "objectives": "Solve single-step addition and subtraction word problems and identify number bonds"
            }
        ]
    },
    "D3_MEASUREMENT": {
        "id": "D3_MEASUREMENT",
        "name_en": "Measurement & Everyday Mathematics",
        "name_si": "මිනුම් සහ එදිනෙදා ගණිතය",
        "description_en": "Length, weight, capacity with non-standard units, days of the week, and coins up to Rs. 10",
        "description_si": "අභිමත ඒකක මගින් දිග, බර, ධාරිතාව, සතියේ දින සහ රු. 10 දක්වා කාසි",
        "skills": [
            {
                "id": "G2_D3_S1_LENGTH",
                "name_en": "Length & Height (Non-standard units: handspans, sticks)",
                "name_si": "දිග සහ උස (අභිමත ඒකක: වියත්, කූරු, පියවර)",
                "curriculum_code": "NIE-G2-M-7.0",
                "objectives": "Measure, compare and order length/height using arbitrary units"
            },
            {
                "id": "G2_D3_S2_WEIGHT",
                "name_en": "Mass & Balance Scale (Non-standard units)",
                "name_si": "බර සහ තරාදිය (අභිමත ඒකක මගින් iei£u)",
                "curriculum_code": "NIE-G2-M-8.0",
                "objectives": "Compare weights by hand and balance scale using marbles, bottle caps"
            },
            {
                "id": "G2_D3_S3_CAPACITY",
                "name_en": "Capacity & Liquid Volume (Comparing Containers)",
                "name_si": "ධාරිතාව සහ ද්‍රව ප්‍රමාණ (භාජන සැසඳීම)",
                "curriculum_code": "NIE-G2-M-9.0",
                "objectives": "Compare liquid volume using cups/bottles (more, less, equal)"
            },
            {
                "id": "G2_D3_S4_TIME_DAYS",
                "name_en": "Time Elapsed & Days of the Week",
                "name_si": "කාලය ගතවීම සහ සතියේ දින 7",
                "curriculum_code": "NIE-G2-M-10.0",
                "objectives": "Understand elapsed time and recall 7 days of the week in sequence"
            },
            {
                "id": "G2_D3_S5_MONEY_COINS",
                "name_en": "Coins (Rs. 1, 2, 5, 10) & Simple Transactions",
                "name_si": "කාසි (රු. 1, 2, 5, 10) සහ සරල ගනුදෙනු",
                "curriculum_code": "NIE-G2-M-11.0",
                "objectives": "Identify coins (Rs. 1, 2, 5, 10) and combine coins to pay for items under Rs. 20"
            }
        ]
    },
    "D4_GEOMETRY_DATA": {
        "id": "D4_GEOMETRY_DATA",
        "name_en": "Geometry, Space & Data",
        "name_si": "ජ්‍යාමිතිය, අවකාශය සහ දත්ත",
        "description_en": "2D shapes, 3D solids, spatial relationships, one-to-one matching, and sorting data",
        "description_si": "ද්විමාන හැඩ, ත්‍රිමාණ වස්තු, පිහිටීම, එකට එක ගැළපීම සහ දත්ත වර්ගීකරණය",
        "skills": [
            {
                "id": "G2_D4_S1_2D_SHAPES",
                "name_en": "2D Shapes (Circle, Square, Triangle, Rectangle)",
                "name_si": "ද්විමාන හැඩතල (වෘත්තය, සමචතුරස්‍රය, ත්‍රිකෝණය, සෘජුකෝණාස්‍රය)",
                "curriculum_code": "NIE-G2-M-12.1",
                "objectives": "Identify and describe basic 2D shapes and their sides"
            },
            {
                "id": "G2_D4_S2_3D_SOLIDS",
                "name_en": "3D Solids in Environment (Cube, Cylinder, Sphere)",
                "name_si": "පරිසරයේ ත්‍රිමාණ වස්තු (ඝනකය, සිලින්ඩරය, ගෝලය)",
                "curriculum_code": "NIE-G2-M-12.0",
                "objectives": "Identify everyday 3D objects and trace their flat faces"
            },
            {
                "id": "G2_D4_S3_POSITION_SPACE",
                "name_en": "Position & Spatial Concepts (Top, Bottom, In, Out, Left, Right)",
                "name_si": "පිහිටීම සහ අවකාශීය සංකල්ප (උඩ, යට, ඇතුළ, පිටත, වම, දකුණ)",
                "curriculum_code": "NIE-G2-M-13.0",
                "objectives": "Describe position of objects in space"
            },
            {
                "id": "G2_D4_S4_MATCHING_RELATIONS",
                "name_en": "One-to-One Matching & Relations (Many-to-One)",
                "name_si": "එකට එක ගැළපීම සහ බහු-ඒක සම්බන්ධතා",
                "curriculum_code": "NIE-G2-M-1.3",
                "objectives": "Match objects one-to-one to find more, less, or equal sets"
            },
            {
                "id": "G2_D4_S5_DATA_SORTING",
                "name_en": "Sorting & Simple Pictorial Tables",
                "name_si": "වර්ගීකරණය සහ සරල රූප සටහන්/වගු",
                "curriculum_code": "NIE-G2-M-1.1",
                "objectives": "Sort items into groups by a single characteristic and read simple picture lists"
            }
        ]
    }
}
