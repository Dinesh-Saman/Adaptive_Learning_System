# -*- coding: utf-8 -*-
"""
Sri Lankan Grade 3 Mathematics Curriculum Framework
4 Domains x 5 Skills = 20 Skills x 5 Difficulty Levels
Based on the National Institute of Education (NIE) Primary Mathematics Teacher Guide
"""

GRADE3_DOMAINS = {
    "D1_NUMBER_SENSE": {
        "id": "D1_NUMBER_SENSE",
        "name_en": "Number Sense",
        "name_si": "සංඛ්‍යා සංකල්පය",
        "description_en": "Counting, reading, place value, comparing, and number patterns up to 1000",
        "description_si": "1000 දක්වා සංඛ්‍යා ගණන් කිරීම, කියවීම, ස්ථානීය අගය, සැසඳීම සහ රටා",
        "skills": [
            {
                "id": "D1_S1_COUNTING",
                "name_en": "Counting Forward & Backward",
                "name_si": "ඉදිරියට සහ පසුපසට ගණන් කිරීම",
                "curriculum_code": "NIE-G3-M-1.1",
                "objectives": "Count in 1s, 2s, 5s, 10s, 100s up to 1000"
            },
            {
                "id": "D1_S2_NUMBER_READING",
                "name_en": "Number Recognition & Reading",
                "name_si": "සංඛ්‍යා හඳුනාගැනීම සහ කියවීම",
                "curriculum_code": "NIE-G3-M-1.2",
                "objectives": "Read and write numbers in digits and words up to 1000"
            },
            {
                "id": "D1_S3_PLACE_VALUE",
                "name_en": "Place Value & Partitioning",
                "name_si": "ස්ථානීය අගය සහ සංඛ්‍යා වෙන්කිරීම",
                "curriculum_code": "NIE-G3-M-1.3",
                "objectives": "Identify hundreds, tens, and ones in 3-digit numbers"
            },
            {
                "id": "D1_S4_COMPARING_ORDERING",
                "name_en": "Comparing & Ordering Numbers",
                "name_si": "සංඛ්‍යා සැසඳීම සහ ආරෝහණ/අවරෝහණ පිළිවෙළ",
                "curriculum_code": "NIE-G3-M-1.4",
                "objectives": "Compare using greater than, less than, ascending and descending order"
            },
            {
                "id": "D1_S5_NUMBER_PATTERNS",
                "name_en": "Number Patterns & Sequences",
                "name_si": "සංඛ්‍යා රටා සහ අනුක්‍රම",
                "curriculum_code": "NIE-G3-M-1.5",
                "objectives": "Identify and continue linear number patterns and odd/even sequences"
            }
        ]
    },
    "D2_OPERATIONS": {
        "id": "D2_OPERATIONS",
        "name_en": "Mathematical Operations",
        "name_si": "ගණිත කර්ම",
        "description_en": "Addition, subtraction, grouping multiplication, division, and fractions",
        "description_si": "එකතු කිරීම, අඩු කිරීම, ගුණ කිරීම, බෙදීම සහ සරල භාග",
        "skills": [
            {
                "id": "D2_S1_ADDITION",
                "name_en": "Addition (up to 3 digits)",
                "name_si": "එකතු කිරීම (ඉලක්කම් 3ක් දක්වා)",
                "curriculum_code": "NIE-G3-M-2.1",
                "objectives": "Add 2-digit and 3-digit numbers with and without regrouping"
            },
            {
                "id": "D2_S2_SUBTRACTION",
                "name_en": "Subtraction (up to 3 digits)",
                "name_si": "අඩු කිරීම (ඉලක්කම් 3ක් දක්වා)",
                "curriculum_code": "NIE-G3-M-2.2",
                "objectives": "Subtract numbers with decomposition/borrowing within 1000"
            },
            {
                "id": "D2_S3_MULTIPLICATION",
                "name_en": "Multiplication (Repeated Addition & Arrays)",
                "name_si": "ගුණ කිරීම (කණ්ඩායම් කිරීම හා වගු)",
                "curriculum_code": "NIE-G3-M-2.3",
                "objectives": "Understand multiplication as repeated addition (2, 3, 4, 5, 10 times tables)"
            },
            {
                "id": "D2_S4_DIVISION",
                "name_en": "Division (Equal Sharing & Grouping)",
                "name_si": "බෙදීම (සමානව බෙදාදීම සහ වෙන්කිරීම)",
                "curriculum_code": "NIE-G3-M-2.4",
                "objectives": "Divide by equal sharing and grouping without remainders"
            },
            {
                "id": "D2_S5_FRACTIONS",
                "name_en": "Simple Fractions (Halves & Quarters)",
                "name_si": "සරල භාග (අඩ, කාල, තුන්කාල)",
                "curriculum_code": "NIE-G3-M-2.5",
                "objectives": "Identify unit fractions 1/2, 1/4, 3/4 from shapes and sets"
            }
        ]
    },
    "D3_MEASUREMENT": {
        "id": "D3_MEASUREMENT",
        "name_en": "Measurement & Everyday Mathematics",
        "name_si": "මිනුම් සහ එදිනෙදා ගණිතය",
        "description_en": "Length, weight, capacity, time, and money transactions",
        "description_si": "දිග, බර, ධාරිතාව, කාලය සහ මුදල් ගනුදෙනු",
        "skills": [
            {
                "id": "D3_S1_LENGTH",
                "name_en": "Length & Distance (m and cm)",
                "name_si": "දිග සහ දුර (මීටර් සහ සෙන්ටිමීටර්)",
                "curriculum_code": "NIE-G3-M-3.1",
                "objectives": "Estimate and measure length using meter rulers and sticks"
            },
            {
                "id": "D3_S2_WEIGHT",
                "name_en": "Mass & Weight (kg and g)",
                "name_si": "ස්කන්ධය / බර (කිලෝග්‍රෑම් සහ ග්‍රෑම්)",
                "curriculum_code": "NIE-G3-M-3.2",
                "objectives": "Compare weights and understand standard kilogram (kg) balances"
            },
            {
                "id": "D3_S3_CAPACITY",
                "name_en": "Capacity & Liquid Volume (L and ml)",
                "name_si": "ධාරිතාව (ලීටර් සහ මිලිලීටර්)",
                "curriculum_code": "NIE-G3-M-3.3",
                "objectives": "Measure and compare liquid volumes using 1L and 500ml containers"
            },
            {
                "id": "D3_S4_TIME",
                "name_en": "Time & Clock Reading",
                "name_si": "කාලය සහ ඔරලෝසුව කියවීම",
                "curriculum_code": "NIE-G3-M-3.4",
                "objectives": "Read analog clock (hours, half hours, quarter hours) and calendar"
            },
            {
                "id": "D3_S5_MONEY",
                "name_en": "Money, Shopping & Change Calculation",
                "name_si": "මුදල්, සාප්පු සවාරි සහ ඉතිරි මුදල",
                "curriculum_code": "NIE-G3-M-3.5",
                "objectives": "Combine coins and notes (Rs. 10, 20, 50, 100, 500) and calculate change"
            }
        ]
    },
    "D4_GEOMETRY_DATA": {
        "id": "D4_GEOMETRY_DATA",
        "name_en": "Geometry, Space & Data",
        "name_si": "ජ්‍යාමිතිය, අවකාශය සහ දත්ත",
        "description_en": "2D shapes, 3D solids, spatial direction, symmetry, and data pictographs",
        "description_si": "ද්විමාන හැඩ, ත්‍රිමාණ වස්තු, දිශාව, සමමිතිය සහ ප්‍රස්තාර/දත්ත",
        "skills": [
            {
                "id": "D4_S1_2D_SHAPES",
                "name_en": "2D Shapes & Geometric Properties",
                "name_si": "ද්විමාන හැඩතල සහ ගුණාංග",
                "curriculum_code": "NIE-G3-M-4.1",
                "objectives": "Identify circles, triangles, squares, rectangles, and their sides/vertices"
            },
            {
                "id": "D4_S2_3D_SOLIDS",
                "name_en": "3D Solid Objects",
                "name_si": "ත්‍රිමාණ ඝන වස්තු",
                "curriculum_code": "NIE-G3-M-4.2",
                "objectives": "Recognize cubes, cuboids, cylinders, cones, and spheres"
            },
            {
                "id": "D4_S3_DIRECTION",
                "name_en": "Direction & Spatial Position",
                "name_si": "දිශාව සහ පිහිටීම",
                "curriculum_code": "NIE-G3-M-4.3",
                "objectives": "Understand left, right, top, bottom, cardinal directions (North, South, East, West)"
            },
            {
                "id": "D4_S4_SYMMETRY",
                "name_en": "Symmetry & Lines of Symmetry",
                "name_si": "සමමිතිය සහ සමමිතික අක්ෂය",
                "curriculum_code": "NIE-G3-M-4.4",
                "objectives": "Identify symmetrical shapes and draw vertical/horizontal fold lines"
            },
            {
                "id": "D4_S5_DATA_GRAPHS",
                "name_en": "Data Handling & Pictographs",
                "name_si": "දත්ත හැසිරවීම සහ රූප ප්‍රස්තාර",
                "curriculum_code": "NIE-G3-M-4.5",
                "objectives": "Read and interpret simple tally charts, tables, and pictographs"
            }
        ]
    }
}

DIFFICULTY_LEVELS = {
    1: {
        "name": "Level 1: Very Easy",
        "desc": "Direct recognition, identification, and basic recall",
        "correct_delta": 5,
        "incorrect_delta": -8
    },
    2: {
        "name": "Level 2: Easy",
        "desc": "Simple direct application of concepts",
        "correct_delta": 5,
        "incorrect_delta": -6
    },
    3: {
        "name": "Level 3: Moderate",
        "desc": "Requires 1-2 structured reasoning or calculation steps",
        "correct_delta": 6,
        "incorrect_delta": -5
    },
    4: {
        "name": "Level 4: Difficult",
        "desc": "Multi-step problem or non-standard visual representation",
        "correct_delta": 7,
        "incorrect_delta": -3
    },
    5: {
        "name": "Level 5: Very Difficult",
        "desc": "Higher-order reasoning, interpretation, and conceptual transfer",
        "correct_delta": 8,
        "incorrect_delta": -2
    }
}
