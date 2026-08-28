import json
import random

# Exactly 35 distinct Grade 4 mathematical topics
grade4_types = [
    "G4_SYMMETRY", "G4_ROMAN_NUMERALS", "G4_ADD_4DIGIT", "G4_SUB_3DIGIT", "G4_MUL_2DIGIT",
    "G4_DIV_3DIGIT", "G4_DECIMAL_TENTHS", "G4_DECIMAL_ADD", "G4_FRACTION_IDENTIFY", "G4_FRACTION_ADD",
    "G4_FRACTION_SUB", "G4_FRACTION_EQUIVALENT", "G4_PERIMETER_SQUARE", "G4_PERIMETER_RECT", "G4_AREA_SQUARE",
    "G4_TIME_HOURS_MINS", "G4_TIME_ELAPSED", "G4_WEIGHT_GRAMS", "G4_WEIGHT_KG", "G4_VOLUME_ML",
    "G4_VOLUME_L", "G4_MONEY_NOTES", "G4_MONEY_CHANGE", "G4_NUMBER_PATTERNS", "G4_FACTORS",
    "G4_MULTIPLES", "G4_WORD_ADD", "G4_WORD_SUB", "G4_WORD_MUL", "G4_WORD_DIV",
    "G4_DATA_BAR_GRAPH", "G4_DATA_PICTOGRAPH", "G4_ANGLES_RIGHT", "G4_LINES_PARALLEL", "G4_LINES_PERPENDICULAR",
    "G4_NUMBER_NAMES", "G4_PLACE_VALUE", "G4_NUMBER_FORMING", "G4_LENGTH_M_TO_CM", "G4_LENGTH_CM_TO_M_CM",
    "G4_SUB_MISSING_NUMBER", "G4_SUB_TWO_STEP", "G4_FRACTION_OF_SET", "G4_FRACTION_WORD_PROBLEM", "G4_NUMBER_EXPANDED_FORM", "G4_DIV_REMAINDER",
    "G4_DIRECTIONS", "G4_DATA_TABLE", "G4_TIME_UNITS", "G4_CALENDAR", "G4_MONEY_COIN_CONVERSIONS",
    "G4_LENGTH_ADD", "G4_LENGTH_SUB", "G4_TIME_CLOCK", "G4_MONEY_PUZZLE", "G4_NUMBER_SORTING",
    "G4_WEIGHT_ADD", "G4_WEIGHT_SUB", "G4_WEIGHT_PUZZLE", "G4_VOLUME_ADD", "G4_VOLUME_SUB",
    "G4_MONEY_ADD", "G4_MONEY_BILL", "G4_MUL_MISSING_NUMBER", "G4_3D_VIEWS", "G4_VOLUME_PUZZLE"
]

questions = []
q_count_per_type = 4000 // len(grade4_types)
remainder = 4000 % len(grade4_types)

def num_to_words(n):
    ones = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"]
    tens = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"]
    if n < 20: return ones[n]
    if n < 100: return tens[n // 10] + (" " + ones[n % 10] if n % 10 != 0 else "")
    if n < 1000: return ones[n // 100] + " hundred" + (" and " + num_to_words(n % 100) if n % 100 != 0 else "")
    if n < 10000: return ones[n // 1000] + " thousand" + (" " + num_to_words(n % 1000) if n % 1000 != 0 else "")
    return str(n)

def generate_options(correct_ans, is_number=True):
    opts = [str(correct_ans)]
    if is_number:
        try:
            val = float(correct_ans) if '.' in str(correct_ans) else int(correct_ans)
            opts.append(str(round(val + random.choice([1, 2, -1, -2, 10, -10]), 2)))
            opts.append(str(round(val + random.choice([3, 4, -3, -4, 5, -5]), 2)))
            opts.append(str(round(val + random.choice([20, -20, 0.1, -0.1]), 2)))
        except:
            opts.extend(["None of these", "Cannot determine", "0"])
    else:
        opts.extend(["None of these", "Cannot determine", "Other"])
    random.shuffle(opts)
    # Ensure options are unique
    opts = list(set(opts))
    while len(opts) < 4:
        opts.append(f"Rand_{random.randint(1, 100)}")
    return opts[:4]

q_id = 1

for t_idx, t in enumerate(grade4_types):
    count = q_count_per_type + (1 if t_idx < remainder else 0)
    for _ in range(count):
        q = {"id": q_id, "type_id": t, "difficulty_tier": 2, "hint_sinhala": "සිංහල උපදේශය (Grade 4 Skill)"}
        q_format = random.choice(["mcq", "fill_blank"])
        
        # Difficulty tier logic: randomly assign 1, 2, or 3
        difficulty = random.choice([1, 2, 3])
        q["difficulty_tier"] = difficulty
        
        # Simplified generator logic for 35 types to ensure exact counts
        if t == "G4_SYMMETRY":
            shapes = {
                "square": 4,
                "rectangle": 2,
                "equilateral triangle": 3,
                "circle": "infinite",
                "heart": 1,
                "letter T": 1,
                "letter H": 2,
                "right triangle": 0,
                "parallelogram": 0
            }
            shape = random.choice(list(shapes.keys()))
            lines = shapes[shape]
            q_type = random.randint(1, 2)
            if q_type == 1:
                q["text"] = f"Is a {shape} a symmetrical shape?"
                q["answer"] = "True" if lines != 0 else "False"
                q_format = "boolean"
            else:
                q["text"] = f"How many lines of symmetry does a {shape} have?"
                q["answer"] = str(lines).capitalize()
                q_format = "mcq"
        elif "ROMAN" in t:
            romans = ["I","II","III","IV","V","VI","VII","VIII","IX","X"]
            q_type = random.randint(1, 3)
            val = random.randint(1, 10)
            if q_type == 1:
                q["text"] = f"What is the Roman Numeral for the number {val}?"
                q["answer"] = romans[val-1]
            elif q_type == 2:
                q["text"] = f"What number does the Roman Numeral {romans[val-1]} represent?"
                q["answer"] = str(val)
            else:
                val = random.randint(2, 9)
                q["text"] = f"Which Roman Numerals come immediately before and after {romans[val-1]}?"
                q["answer"] = f"{romans[val-2]} and {romans[val]}"
            q_format = "mcq"
        elif t == "G4_WORD_ADD":
            if random.choice([True, False]):
                a, b = random.randint(100, 999 * difficulty), random.randint(100, 999 * difficulty)
                q["text"] = f"A factory produced {a} cups on Monday and {b} cups on Tuesday. How many cups were produced in total?"
                q["answer"] = str(a + b)
            else:
                a, b, c = random.randint(100, 999 * difficulty), random.randint(100, 999 * difficulty), random.randint(100, 999 * difficulty)
                q["text"] = f"A library has {a} fiction books, {b} non-fiction books, and {c} reference books. How many books are there in total?"
                q["answer"] = str(a + b + c)
        elif t == "G4_WORD_SUB":
            a = random.randint(500, 1500 * difficulty)
            b = random.randint(100, a - 100)
            q["text"] = f"A store had {a} items. They sold {b} of them. How many items are left?"
            q["answer"] = str(a - b)
        elif t == "G4_WORD_MUL":
            if random.choice([True, False]):
                a = random.randint(5, 25 * difficulty)
                b = random.randint(2, 6)
                q["text"] = f"There are {a} boxes, and each box contains {b} toys. How many toys are there in total?"
                q["answer"] = str(a * b)
            else:
                a = random.randint(5, 20)
                b = random.randint(3, 8)
                q["text"] = f"Amal is {a} years old. His grandfather is {b} times as old as Amal. How old is the grandfather?"
                q["answer"] = str(a * b)
        elif t == "G4_WORD_DIV":
            b = random.randint(3, 5)
            ans = random.randint(10, 25 * difficulty)
            if random.choice([True, False]):
                a = b * ans
                q["text"] = f"A teacher has {a} pencils and distributes them equally among {b} students. How many pencils does each student get?"
                q["answer"] = str(ans)
            else:
                rem = random.randint(1, b - 1)
                a = b * ans + rem
                q["text"] = f"A carpenter has {a} nails. Each chair requires {b} nails. How many chairs can be made and how many nails are left over? (Format as 'Q chairs and R nails left')"
                q["answer"] = f"{ans} chairs and {rem} nails left"
        elif t == "G4_ADD_4DIGIT":
            if difficulty == 1:
                a, b = random.randint(100, 999), random.randint(100, 999) # 3-digit for easy
            elif difficulty == 2:
                a, b = random.randint(1000, 4999), random.randint(100, 999) # 4-digit + 3-digit
            else:
                a, b = random.randint(1000, 9999), random.randint(1000, 9999) # Hardest
            q["text"] = f"Calculate: {a} + {b}"
            q["answer"] = str(a+b)
        elif t == "G4_SUB_3DIGIT":
            if difficulty == 1:
                a = random.randint(50, 99)
                b = random.randint(10, a - 10) # 2-digit for easy
            elif difficulty == 2:
                a = random.randint(500, 999)
                b = random.randint(10, 99) # 3-digit minus 2-digit
            else:
                a = random.randint(500, 999)
                b = random.randint(100, a - 100) # Hardest
            q["text"] = f"Calculate: {a} - {b}"
            q["answer"] = str(a-b)
        elif t == "G4_MUL_2DIGIT":
            a = random.randint(10, 99)
            b = random.randint(2, 9)
            q["text"] = f"Calculate: {a} x {b}"
            q["answer"] = str(a*b)
        elif "DIV_REMAINDER" in t:
            b = random.randint(3, 5)
            ans = random.randint(10, 33 * difficulty)
            rem = random.randint(1, b - 1)
            total = b * ans + rem
            q["text"] = f"Calculate {total} ÷ {b}. Format your answer as 'Q remainder R' (e.g. '12 remainder 1')."
            q["answer"] = f"{ans} remainder {rem}"
            q_format = "fill_blank"
        elif t == "G4_DIV_3DIGIT":
            if random.choice([True, False]):
                b = random.randint(2, 5)
                first = random.randint(1, 9)
                last = random.randint(0, 9)
                dividend = first * 100 + last
                while dividend % b != 0:
                    last = random.randint(0, 9)
                    dividend = first * 100 + last
                q["text"] = f"Calculate: {dividend} ÷ {b}"
                q["answer"] = str(dividend // b)
            else:
                b = random.randint(2, 5)
                ans = random.randint(100, 300)
                q["text"] = f"Calculate: {b*ans} ÷ {b}"
                q["answer"] = str(ans)
        elif t == "G4_MUL_MISSING_NUMBER":
            b = random.randint(2, 9)
            if random.choice([True, False]):
                first_digit = random.randint(1, 9)
                ans = first_digit * 10 * b
                q["text"] = f"Fill the blank: {first_digit}[_] x {b} = {ans}"
                q["answer"] = "0"
            else:
                last_digit = random.randint(1, 9)
                ans = (10 + last_digit) * b
                q["text"] = f"Fill the blank: [_]{last_digit} x {b} = {ans}"
                q["answer"] = "1"
        elif "DECIMAL" in t:
            val1, val2 = random.randint(1, 9), random.randint(1, 9)
            q["text"] = f"What is 0.{val1} + 0.{val2}?"
            q["answer"] = str(round((val1+val2)/10, 1))
        elif t == "G4_FRACTION_IDENTIFY":
            den = random.randint(3, 10)
            num = random.randint(1, den - 1)
            q["text"] = f"A pizza is cut into {den} slices. You eat {num} slices. What fraction of the pizza did you eat?"
            q["answer"] = f"{num}/{den}"
            q_format = "mcq"
        elif t == "G4_FRACTION_ADD":
            num1 = random.randint(1, 3)
            num2 = random.randint(1, 3)
            den = random.choice([4, 8, 10]) if difficulty > 1 else 5
            q["text"] = f"What is {num1}/{den} + {num2}/{den}?"
            q["answer"] = f"{num1+num2}/{den}"
            q_format = "mcq"
        elif t == "G4_FRACTION_SUB":
            den = random.choice([4, 5, 8, 10])
            num1 = random.randint(3, den - 1)
            num2 = random.randint(1, num1 - 1)
            q["text"] = f"What is {num1}/{den} - {num2}/{den}?"
            q["answer"] = f"{num1-num2}/{den}"
            q_format = "mcq"
        elif t == "G4_FRACTION_EQUIVALENT":
            num = random.randint(1, 3)
            den = random.randint(num + 1, 5)
            mult = random.randint(2, 4)
            q["text"] = f"Which fraction is equivalent to {num}/{den}?"
            q["answer"] = f"{num*mult}/{den*mult}"
            q_format = "mcq"
        elif t == "G4_FRACTION_OF_SET":
            den = random.choice([2, 3, 4, 5])
            total = den * random.randint(2, 6 * difficulty)
            q["text"] = f"What is 1/{den} of {total}?"
            q["answer"] = str(total // den)
            q_format = "fill_blank"
        elif t == "G4_FRACTION_WORD_PROBLEM":
            import math
            total = random.choice([8, 10, 12, 16, 20])
            num = random.choice([2, 4, 5])
            while total % num != 0 or num >= total:
                 num = random.choice([2, 4, 5])
            q["text"] = f"There are {total} beads. {num} are red. What fraction of the beads are red?"
            gcd = math.gcd(num, total)
            q["answer"] = f"{num//gcd}/{total//gcd}"
            q_format = "mcq"
        elif "PERIMETER" in t:
            side = random.randint(5, 10 * difficulty)
            q["text"] = f"What is the perimeter of a square with side {side}cm?"
            q["answer"] = str(side*4)
        elif "AREA" in t:
            side = random.randint(2, 5 * difficulty)
            q["text"] = f"What is the area of a square with side {side}cm?"
            q["answer"] = str(side*side)
        elif t == "G4_LENGTH_ADD":
            m1, cm1 = random.randint(2, 15), random.randint(10, 90)
            m2, cm2 = random.randint(1, 10), random.randint(10, 90)
            total_cm = cm1 + cm2
            carry_m = total_cm // 100
            rem_cm = total_cm % 100
            total_m = m1 + m2 + carry_m
            if random.choice([True, False]):
                q["text"] = f"Calculate: {m1} m {cm1} cm + {m2} m {cm2} cm"
            else:
                q["text"] = f"A tailor uses {m1} m {cm1} cm of red cloth and {m2} m {cm2} cm of blue cloth. What is the total length of cloth used?"
            q["answer"] = f"{total_m} m {rem_cm} cm"
            q_format = "mcq"
        elif t == "G4_LENGTH_SUB":
            m1, cm1 = random.randint(10, 25), random.randint(10, 50)
            m2, cm2 = random.randint(2, 8), random.randint(60, 90)
            total1 = m1 * 100 + cm1
            total2 = m2 * 100 + cm2
            diff = total1 - total2
            ans_m, ans_cm = diff // 100, diff % 100
            if random.choice([True, False]):
                q["text"] = f"Calculate: {m1} m {cm1} cm - {m2} m {cm2} cm"
            else:
                q["text"] = f"A rope was {m1} m {cm1} cm long. A piece of {m2} m {cm2} cm was cut off. What is the length of the remaining rope?"
            q["answer"] = f"{ans_m} m {ans_cm} cm"
            q_format = "mcq"
        elif t == "G4_TIME_CLOCK":
            q_type = random.randint(1, 2)
            hours = random.randint(1, 12)
            mins = random.choice([0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55])
            if q_type == 1:
                if mins == 0:
                    q["text"] = f"On an analog clock, the minute hand points to 12 and the hour hand points exactly to {hours}. What is the time?"
                else:
                    min_pointing = mins // 5
                    if mins < 30:
                        q["text"] = f"On an analog clock, the minute hand points to {min_pointing} and the hour hand is just past {hours}. What is the time?"
                    elif mins == 30:
                        q["text"] = f"On an analog clock, the minute hand points to 6 and the hour hand is halfway between {hours} and {(hours%12)+1}. What is the time?"
                    else:
                        q["text"] = f"On an analog clock, the minute hand points to {min_pointing} and the hour hand is almost at {(hours%12)+1}. What is the time?"
                q["answer"] = f"{hours}:{mins:02d}"
            else:
                if mins == 0:
                    q["text"] = f"If the time is {hours}:00, what number does the minute hand point to?"
                    q["answer"] = "12"
                else:
                    q["text"] = f"If the time is {hours}:{mins:02d}, what number does the minute hand point to?"
                    q["answer"] = str(mins // 5)
            q_format = "mcq"
        elif "TIME_UNITS" in t:
            q_type = random.randint(1, 3)
            if q_type == 1:
                weeks = random.randint(2, 10)
                q["text"] = f"How many days are in {weeks} weeks?"
                q["answer"] = str(weeks * 7)
            elif q_type == 2:
                years = random.randint(2, 5)
                q["text"] = f"How many months are in {years} years?"
                q["answer"] = str(years * 12)
            else:
                months = [("January", 31), ("February", 28), ("March", 31), ("April", 30), ("May", 31), ("June", 30), ("July", 31), ("August", 31), ("September", 30), ("October", 31), ("November", 30), ("December", 31)]
                m, d = random.choice(months)
                q["text"] = f"How many days are in {m} (in a non-leap year)?"
                q["answer"] = str(d)
            q_format = "fill_blank"
        elif "CALENDAR" in t:
            days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
            start_day_idx = random.randint(0, 6)
            total_days = random.choice([28, 30, 31])
            q_type = random.randint(1, 2)
            if q_type == 1:
                target_date = random.randint(2, total_days)
                ans_day = days[(start_day_idx + target_date - 1) % 7]
                q["text"] = f"A month has {total_days} days and the 1st falls on a {days[start_day_idx]}. What day of the week is the {target_date}th?"
                q["answer"] = ans_day
                q_format = "mcq"
            else:
                target_day_idx = random.randint(0, 6)
                count = sum(1 for d in range(1, total_days + 1) if (start_day_idx + d - 1) % 7 == target_day_idx)
                q["text"] = f"If a month has {total_days} days and starts on a {days[start_day_idx]}, how many {days[target_day_idx]}s are in that month?"
                q["answer"] = str(count)
                q_format = "fill_blank"
        elif t == "G4_NUMBER_SORTING":
            if difficulty == 1:
                nums = [random.randint(10, 99) for _ in range(4)]
            elif difficulty == 2:
                nums = [random.randint(100, 999) for _ in range(4)]
            else:
                nums = [random.randint(1000, 9999) for _ in range(4)]
            is_asc = random.choice([True, False])
            order_name = "ascending" if is_asc else "descending"
            sorted_nums = sorted(nums, reverse=not is_asc)
            q["text"] = f"Sort the following numbers in {order_name} order: {', '.join(map(str, nums))}"
            q["answer"] = ", ".join(map(str, sorted_nums))
            q_format = "mcq"
        elif t == "G4_TIME_HOURS_MINS":
            q_type = random.randint(1, 6)
            if q_type == 1:
                hrs = random.randint(1, 5)
                q["text"] = f"How many minutes are in {hrs} hours?"
                q["answer"] = str(hrs * 60)
            elif q_type == 2:
                days = random.randint(1, 3)
                q["text"] = f"How many hours are in {days} days?"
                q["answer"] = str(days * 24)
            elif q_type == 3:
                q["text"] = "How many minutes are in half an hour?"
                q["answer"] = "30"
            elif q_type == 4:
                hrs = random.choice([48, 72])
                q["text"] = f"How many days are in {hrs} hours?"
                q["answer"] = str(hrs // 24)
            elif q_type == 5:
                h, m = random.randint(1, 3), random.choice([15, 30, 45])
                q["text"] = f"Convert {h} hours and {m} minutes to minutes."
                q["answer"] = str(h * 60 + m)
            else:
                q["text"] = "How many minutes does the minute hand take to move from one number to the next on a clock?"
                q["answer"] = "5"
            q_format = "fill_blank"
        elif t == "G4_TIME_ELAPSED":
            start_h = random.randint(1, 9)
            duration = random.randint(1, 3)
            q["text"] = f"A class starts at {start_h}:00 AM and lasts for {duration} hours. What time does it end?"
            q["answer"] = f"{start_h + duration}:00 AM"
            q_format = "mcq"
        elif t == "G4_WEIGHT_GRAMS":
            kg = random.randint(1, difficulty * 3)
            g = random.randint(10, 990) if difficulty > 1 else 0
            if g > 0:
                q["text"] = f"Convert {kg} kg {g} g to grams."
                q["answer"] = str(kg * 1000 + g)
            else:
                q["text"] = f"Convert {kg} kg to grams."
                q["answer"] = str(kg * 1000)
            q_format = "fill_blank"
        elif t == "G4_WEIGHT_KG":
            kg = random.randint(1, difficulty * 3)
            g = random.randint(10, 990) if difficulty > 1 else 0
            total_g = kg * 1000 + g
            q["text"] = f"Convert {total_g} g to kg and g." if g > 0 else f"Convert {total_g} g to kg."
            q["answer"] = f"{kg} kg {g} g" if g > 0 else f"{kg} kg"
            q_format = "mcq"
        elif t == "G4_WEIGHT_ADD":
            kg1, g1 = random.randint(1, 5), random.randint(100, 900)
            kg2, g2 = random.randint(1, 5), random.randint(100, 900)
            total_g = g1 + g2
            carry_kg = total_g // 1000
            rem_g = total_g % 1000
            total_kg = kg1 + kg2 + carry_kg
            if random.choice([True, False]):
                q["text"] = f"Calculate: {kg1} kg {g1} g + {kg2} kg {g2} g"
            else:
                q["text"] = f"A farmer harvested {kg1} kg {g1} g of apples and {kg2} kg {g2} g of oranges. What is the total weight?"
            q["answer"] = f"{total_kg} kg {rem_g} g"
            q_format = "mcq"
        elif t == "G4_WEIGHT_SUB":
            kg1, g1 = random.randint(5, 10), random.randint(100, 500)
            kg2, g2 = random.randint(1, 4), random.randint(600, 900)
            total1 = kg1 * 1000 + g1
            total2 = kg2 * 1000 + g2
            diff = total1 - total2
            ans_kg, ans_g = diff // 1000, diff % 1000
            if random.choice([True, False]):
                q["text"] = f"Calculate: {kg1} kg {g1} g - {kg2} kg {g2} g"
            else:
                q["text"] = f"A bakery needs {kg1} kg {g1} g of flour. They already have {kg2} kg {g2} g. How much more flour is needed?"
            q["answer"] = f"{ans_kg} kg {ans_g} g"
            q_format = "mcq"
        elif t == "G4_WEIGHT_PUZZLE":
            q_type = random.randint(1, 2)
            if q_type == 1:
                target = random.choice([3, 6, 7, 8])
                if target == 3: ans = "1kg, 2kg"
                elif target == 6: ans = "5kg, 1kg"
                elif target == 7: ans = "5kg, 2kg"
                elif target == 8: ans = "5kg, 2kg, 1kg"
                q["text"] = f"Which combination of standard weights (1kg, 2kg, 5kg) can be used to measure exactly {target} kg?"
                q["answer"] = ans
            else:
                target_g = random.choice([30, 70, 110, 120, 150, 180])
                if target_g == 30: ans = "20g + 10g"
                elif target_g == 70: ans = "50g + 20g"
                elif target_g == 110: ans = "100g + 10g"
                elif target_g == 120: ans = "100g + 20g"
                elif target_g == 150: ans = "100g + 50g"
                elif target_g == 180: ans = "100g + 50g + 20g + 10g"
                q["text"] = f"Using standard weights (10g, 20g, 50g, 100g, 5kg), how would you measure 5 kg {target_g} g?"
                q["answer"] = f"5kg + {ans}"
            q_format = "mcq"
        elif t == "G4_VOLUME_ML":
            l = random.randint(1, difficulty * 4)
            ml = random.randint(10, 990) if difficulty > 1 else 0
            if ml > 0:
                q["text"] = f"Convert {l} L {ml} ml to milliliters."
                q["answer"] = str(l * 1000 + ml)
            else:
                q["text"] = f"Convert {l} L to milliliters."
                q["answer"] = str(l * 1000)
            q_format = "fill_blank"
        elif t == "G4_VOLUME_L":
            l = random.randint(1, difficulty * 3)
            ml = random.choice([250, 500, 750]) if difficulty > 1 else 0
            total_ml = l * 1000 + ml
            q["text"] = f"Convert {total_ml} ml to L and ml." if ml > 0 else f"Convert {total_ml} ml to L."
            q["answer"] = f"{l} L {ml} ml" if ml > 0 else f"{l} L"
            q_format = "mcq"
        elif t == "G4_VOLUME_ADD":
            q_type = random.randint(1, 2)
            if q_type == 1:
                ml1 = random.choice([500, 1500, 2500, 3500])
                ml2 = random.choice([500, 1500, 2500])
                total_ml = ml1 + ml2
                q["text"] = f"Calculate and write the answer in liters (L): {ml1} ml + {ml2} ml"
                q["answer"] = f"{total_ml // 1000} L"
            else:
                l1, ml1 = random.randint(1, 5), random.randint(100, 900)
                l2, ml2 = random.randint(1, 5), random.randint(100, 900)
                total_ml = ml1 + ml2
                carry_l = total_ml // 1000
                rem_ml = total_ml % 1000
                total_l = l1 + l2 + carry_l
                if random.choice([True, False]):
                    q["text"] = f"Calculate: {l1} L {ml1} ml + {l2} L {ml2} ml"
                else:
                    q["text"] = f"Mother mixed {l1} L {ml1} ml of fruit juice with {l2} L {ml2} ml of water. What is the total volume?"
                q["answer"] = f"{total_l} L {rem_ml} ml"
            q_format = "mcq"
        elif t == "G4_VOLUME_SUB":
            l1, ml1 = random.randint(5, 10), random.randint(100, 500)
            l2, ml2 = random.randint(1, 4), random.randint(600, 900)
            total1 = l1 * 1000 + ml1
            total2 = l2 * 1000 + ml2
            diff = total1 - total2
            ans_l, ans_ml = diff // 1000, diff % 1000
            if random.choice([True, False]):
                q["text"] = f"Calculate: {l1} L {ml1} ml - {l2} L {ml2} ml"
            else:
                q["text"] = f"A tank needs {l1} L {ml1} ml of water. It currently has {l2} L {ml2} ml. How much more water is needed?"
            q["answer"] = f"{ans_l} L {ans_ml} ml"
            q_format = "mcq"
        elif t == "G4_VOLUME_PUZZLE":
            q_type = random.randint(1, 2)
            if q_type == 1:
                q["text"] = "You have 5 containers of liquids: Paint (2 L), Milk (1 L), Oil (1 L 500 ml), Water (500 ml), and Juice (200 ml). How much more liquid is in the Oil container than the Milk container?"
                q["answer"] = "500 ml"
            else:
                q["text"] = "You have 5 containers of liquids: Paint (2 L), Milk (1 L), Oil (1 L 500 ml), Water (500 ml), and Juice (200 ml). How many times must you pour the Water container to equal the amount in the Oil container?"
                q["answer"] = "3"
            q_format = "mcq"
        elif t == "G4_3D_VIEWS":
            q_type = random.randint(1, 3)
            if q_type == 1:
                q["text"] = "When looking straight down from above (Plan View) at a standard square-based pyramid, what 2D shape do you see?"
                q["answer"] = "Square"
            elif q_type == 2:
                q["text"] = "When looking directly at the front (Front View) of a standard cylinder, what 2D shape do you see?"
                q["answer"] = "Rectangle"
            else:
                q["text"] = "When looking directly at the side (Side View) of a standard cube, what 2D shape do you see?"
                q["answer"] = "Square"
            q_format = "mcq"
        elif t == "G4_MONEY_CHANGE":
            q_type = random.randint(1, 2)
            if q_type == 1:
                cost_r = random.randint(15, 80)
                cost_c = random.choice([25, 50, 75])
                give_r = random.choice([50, 100, 500])
                while give_r <= cost_r:
                    give_r = random.choice([100, 500, 1000])
                total_cost_cents = cost_r * 100 + cost_c
                total_give_cents = give_r * 100
                diff = total_give_cents - total_cost_cents
                q["text"] = f"An item costs Rs. {cost_r}.{cost_c:02d}. You pay with a Rs. {give_r} note. How much is your change?"
                q["answer"] = f"Rs. {diff // 100}.{diff % 100:02d}"
            else:
                unit_r = random.randint(20, 150)
                qty = random.randint(2, 5)
                cost_r = unit_r * qty
                give_r = random.choice([100, 500, 1000])
                while give_r <= cost_r:
                    give_r += 500
                diff = give_r - cost_r
                q["text"] = f"You buy {qty} items that cost Rs. {unit_r}.00 each. You pay with Rs. {give_r}. How much is your change?"
                q["answer"] = f"Rs. {diff}.00"
            q_format = "mcq"
        elif t == "G4_MONEY_COIN_CONVERSIONS":
            coins = [("25 cent", 4), ("50 cent", 2), ("10 cent", 10)]
            coin_name, per_rupee = random.choice(coins)
            rupees = random.randint(1, 5)
            q["text"] = f"How many {coin_name} coins are there in Rs. {rupees}?"
            q["answer"] = str(per_rupee * rupees)
            q_format = "fill_blank"
        elif t == "G4_MONEY_NOTES":
            amounts = [15.50, 12.25, 17.50, 19.25, 70, 190, 350, 850, 62, 51.50]
            val = random.choice(amounts)
            if val == 70: ans = "50, 20"
            elif val == 15.50: ans = "10, 5, 0.50"
            elif val == 12.25: ans = "10, 2, 0.25"
            elif val == 17.50: ans = "10, 5, 2, 0.50"
            elif val == 19.25: ans = "10, 5, 2, 2, 0.25"
            elif val == 190: ans = "100, 50, 20, 20"
            elif val == 350: ans = "100, 100, 100, 50"
            elif val == 850: ans = "500, 100, 100, 100, 50"
            elif val == 62: ans = "50, 10, 2"
            elif val == 51.50: ans = "50, 1, 0.50"
            q["text"] = f"Which of the following is a valid combination of notes/coins to make exactly Rs. {val:.2f}?"
            q["answer"] = ans
            q_format = "mcq"
        elif t == "G4_MONEY_PUZZLE":
            puzzles = [
                ("How can you pay Rs. 30 using exactly one note and one coin?", "Rs. 20 note and Rs. 10 coin"),
                ("How can you pay Rs. 100 using exactly three notes and one coin?", "Rs. 50, Rs. 20, Rs. 20 notes and Rs. 10 coin"),
                ("What is the month with the fewest number of days?", "February"),
                ("What is the seventh month of the year?", "July"),
                ("If today is Wednesday, what day is 2 days from now?", "Friday"),
                ("What is the month immediately before October?", "September")
            ]
            q_text, q_ans = random.choice(puzzles)
            q["text"] = q_text
            q["answer"] = q_ans
            q_format = "mcq"
        elif t == "G4_MONEY_ADD":
            r1 = random.randint(50, 500)
            c1 = random.choice([0, 25, 50, 75])
            r2 = random.randint(50, 500)
            c2 = random.choice([0, 25, 50, 75])
            total_c = c1 + c2
            carry_r = total_c // 100
            rem_c = total_c % 100
            total_r = r1 + r2 + carry_r
            q["text"] = f"Calculate the total: Rs. {r1}.{c1:02d} + Rs. {r2}.{c2:02d}"
            q["answer"] = f"Rs. {total_r}.{rem_c:02d}"
            q_format = "mcq"
        elif t == "G4_MONEY_BILL":
            items = ["Sugar", "Rice", "Flour", "Dhal"]
            item = random.choice(items)
            base_price = random.choice([80, 100, 120, 160, 200])
            q_type = random.randint(1, 4)
            if q_type == 1:
                q["text"] = f"If 1 kg of {item} costs Rs. {base_price}.00, how much does 500 g cost?"
                q["answer"] = f"Rs. {base_price // 2}.00"
            elif q_type == 2:
                q["text"] = f"If 1 kg of {item} costs Rs. {base_price}.00, how much does 250 g cost?"
                q["answer"] = f"Rs. {base_price // 4}.00"
            elif q_type == 3:
                q["text"] = f"If 500 g of {item} costs Rs. {base_price // 2}.00, how much does 1 kg cost?"
                q["answer"] = f"Rs. {base_price}.00"
            else:
                item1, item2 = random.sample(items, 2)
                p1, p2 = random.choice([80, 100, 120]), random.choice([160, 200, 240])
                q["text"] = f"A shop sells {item1} for Rs. {p1} per kg and {item2} for Rs. {p2} per kg. What is the total bill for 2 kg of {item1} and 500 g of {item2}?"
                ans = (p1 * 2) + (p2 // 2)
                q["answer"] = f"Rs. {ans}.00"
            q_format = "mcq"
        elif "PATTERN" in t:
            step = difficulty * random.choice([2, 3, 5, 10])
            start = random.randint(2, 50)
            seq = [start + i*step for i in range(5)]
            missing_idx = random.randint(0, 4)
            ans = seq[missing_idx]
            seq[missing_idx] = "[?]"
            q["text"] = f"Find the missing number in the pattern: {', '.join(map(str, seq))}"
            q["answer"] = str(ans)
        elif "FACTORS" in t:
            fact = random.randint(2, 5 * difficulty)
            mult = fact * random.randint(2, 5)
            q["text"] = f"Is {fact} a factor of {mult}?"
            q["answer"] = "True"
            q_format = "boolean"
        elif "MULTIPLES" in t:
            nth = random.randint(2, 5 * difficulty)
            base = random.randint(2, 4)
            q["text"] = f"What is the {nth}th multiple of {base}?"
            q["answer"] = str(nth * base)
        elif "DATA_TABLE" in t:
            if random.choice([True, False]):
                cats = ["Children", "Women", "Weekend", "Sports", "News"]
                sales = [random.randint(10, 40) * 100 for _ in range(5)]
                
                q["chart_data"] = {
                    "type": "bar",
                    "title": "Monthly Magazine Printing Volumes",
                    "labels": cats,
                    "values": sales,
                    "y_max": 4500
                }
                
                question_type = random.randint(1, 3)
                if question_type == 1:
                    cat_idx = random.randint(0, 4)
                    q["text"] = f"Look at the magazine printing graph above. How many {cats[cat_idx]} magazines were printed?"
                    q["answer"] = str(sales[cat_idx])
                elif question_type == 2:
                    d1, d2 = random.sample([0, 1, 2, 3, 4], 2)
                    q["text"] = f"Look at the graph. What is the total printed for {cats[d1]} and {cats[d2]}?"
                    q["answer"] = str(sales[d1] + sales[d2])
                else:
                    d1, d2 = random.sample([0, 1, 2, 3, 4], 2)
                    target_sum = sales[d1] + sales[d2]
                    ans_cats = sorted([d1, d2])
                    q["text"] = f"Look at the graph. Which two categories add up to exactly {target_sum} magazines printed?"
                    q["answer"] = f"{cats[ans_cats[0]]} and {cats[ans_cats[1]]}"
            else:
                days = ["Mon", "Tue", "Wed", "Thu", "Fri"]
                sales = [random.randint(15, 55) * 100 for _ in range(5)]
                
                q["chart_data"] = {
                    "type": "bar",
                    "title": "Weekly Event Ticket Sales",
                    "labels": days,
                    "values": sales,
                    "y_max": 6000
                }
                
                q_type = random.randint(1, 2)
                if q_type == 1:
                    d1, d2 = random.sample([0, 1, 2, 3, 4], 2)
                    q["text"] = f"Look at the ticket sales graph above. What is the total tickets sold on {days[d1]} and {days[d2]}?"
                    q["answer"] = str(sales[d1] + sales[d2])
                else:
                    d1, d2 = random.sample([0, 1, 2, 3, 4], 2)
                    target_sum = sales[d1] + sales[d2]
                    ans_days = sorted([d1, d2])
                    q["text"] = f"Look at the ticket sales graph above. Which two days had a total of {target_sum} tickets sold?"
                    q["answer"] = f"{days[ans_days[0]]} and {days[ans_days[1]]}"
            q_format = "mcq"
        elif "DATA_BAR_GRAPH" in t:
            themes = [
                ("Favorite Fruits", "Number of Students", ["Mango", "Guava", "Woodapple", "Watermelon", "Apple"]),
                ("Animals in the Park", "Number of Animals", ["Squirrels", "Parrots", "Mynahs", "Butterflies", "Snails"]),
                ("Favorite Colors", "Number of Students", ["Red", "Blue", "Green", "Yellow", "Black"]),
                ("Favorite Subjects", "Number of Students", ["Math", "Science", "History", "English", "Art"])
            ]
            title, y_label, cats = random.choice(themes)
            vals = [random.randint(1, 10) * 10 for _ in range(5)] # e.g. 10, 20, ..., 100
            
            q["chart_data"] = {
                "type": "bar",
                "title": title,
                "labels": list(cats),
                "values": vals,
                "y_max": max(vals) + 20
            }
                
            q_type = random.randint(1, 5)
            if q_type == 1:
                idx = random.randint(0, 4)
                q["text"] = f"A class conducted a survey about {title.lower()}. Look at the graph above. How many {cats[idx]} are there?"
                q["answer"] = str(vals[idx])
            elif q_type == 2:
                max_idx = vals.index(max(vals))
                q["text"] = f"A class conducted a survey about {title.lower()}. Look at the graph above. Which has the most?"
                q["answer"] = cats[max_idx]
            elif q_type == 3:
                min_idx = vals.index(min(vals))
                q["text"] = f"A class conducted a survey about {title.lower()}. Look at the graph above. Which has the least?"
                q["answer"] = cats[min_idx]
            elif q_type == 4:
                idx1, idx2 = random.sample(range(5), 2)
                diff = abs(vals[idx1] - vals[idx2])
                q["text"] = f"A class conducted a survey about {title.lower()}. Look at the graph above. What is the difference between {cats[idx1]} and {cats[idx2]}?"
                q["answer"] = str(diff)
            else:
                q["text"] = f"A class conducted a survey about {title.lower()}. Look at the graph above. What is the total number of items recorded?"
                q["answer"] = str(sum(vals))
            q_format = "mcq"
        elif "GRAPH" in t or "DATA" in t:
            val = random.randint(2, 5 * difficulty)
            pics = random.randint(2, 5)
            emoji = random.choice(["🍎", "⚽", "🚗", "⭐", "🐟"])
            pictograph = " ".join([emoji] * pics)
            q["text"] = f"If 1 {emoji} = {val} items, how many items are here?\n\n{pictograph}"
            q["answer"] = str(val * pics)
        elif "NUMBER_NAMES" in t:
            n = random.randint(10, 99) if difficulty == 1 else (random.randint(100, 999) if difficulty == 2 else random.randint(1000, 9999))
            q["text"] = f"What is the number name for {n}?"
            q["answer"] = num_to_words(n)
            q_format = "mcq"
        elif "NUMBER_EXPANDED_FORM" in t:
            if difficulty == 1:
                num = random.randint(10, 99)
                tens = (num // 10) * 10
                ones = num % 10
                q["answer"] = f"{tens} + {ones}"
            elif difficulty == 2:
                num = random.randint(100, 999)
                h = (num // 100) * 100
                tens = ((num % 100) // 10) * 10
                ones = num % 10
                q["answer"] = f"{h} + {tens} + {ones}"
            else:
                num = random.randint(1000, 9999)
                th = (num // 1000) * 1000
                h = ((num % 1000) // 100) * 100
                tens = ((num % 100) // 10) * 10
                ones = num % 10
                q["answer"] = f"{th} + {h} + {tens} + {ones}"
            q["text"] = f"What is the expanded form of {num}?"
            q_format = "fill_blank"
        elif "PLACE_VALUE" in t:
            places = ["ones", "tens", "hundreds", "thousands"]
            num = random.randint(100, 999) if difficulty < 3 else random.randint(1000, 9999)
            num_str = str(num)
            idx = random.randint(0, len(num_str)-1)
            digit = num_str[idx]
            if random.choice([True, False]):
                place = places[len(num_str) - 1 - idx]
                q["text"] = f"What is the place value of {digit} in {num}?"
                q["answer"] = place
            else:
                val = int(digit) * (10 ** (len(num_str) - 1 - idx))
                q["text"] = f"What value does {digit} represent in {num}?"
                q["answer"] = str(val)
            q_format = "mcq"
        elif "NUMBER_FORMING" in t:
            q_type = random.randint(1, 2)
            if q_type == 1:
                digits = random.sample(range(0, 10), 4)
                if 0 not in digits and random.random() > 0.5:
                    digits[0] = 0
                largest = random.choice([True, False])
                if largest:
                    sorted_digits = sorted(digits, reverse=True)
                else:
                    sorted_digits = sorted(digits)
                    if sorted_digits[0] == 0:
                        for i in range(1, 4):
                            if sorted_digits[i] != 0:
                                sorted_digits[0], sorted_digits[i] = sorted_digits[i], sorted_digits[0]
                                break
                q["text"] = f"What is the {'largest' if largest else 'smallest'} 4-digit number you can form using the digits {digits[0]}, {digits[1]}, {digits[2]}, and {digits[3]}?"
                q["answer"] = "".join(map(str, sorted_digits))
            else:
                import itertools
                digits = random.sample(range(1, 10), 3)
                perms = [int("".join(map(str, p))) for p in itertools.permutations(digits)]
                cond = random.choice(["greater", "less"])
                if cond == "greater":
                    target = min(perms) + 100
                    valid = [p for p in perms if p > target]
                else:
                    target = max(perms) - 100
                    valid = [p for p in perms if p < target]
                while not valid:
                    cond = "greater" if cond == "less" else "less"
                    valid = [p for p in perms if (p > target if cond == "greater" else p < target)]
                ans = valid[0]
                q["text"] = f"Using the digits {digits[0]}, {digits[1]}, and {digits[2]}, write a number {cond} than {target}."
                q["answer"] = str(ans)
            q_format = "fill_blank"
        elif "LENGTH_M_TO_CM" in t:
            m = random.randint(2, 10 * difficulty)
            q["text"] = f"Convert {m} m to cm."
            q["answer"] = str(m * 100)
            q_format = "fill_blank"
        elif "LENGTH_CM_TO_M_CM" in t:
            m = random.randint(1, 9 * difficulty)
            cm = random.randint(1, 99) if difficulty > 1 else 0
            total_cm = m * 100 + cm
            q["text"] = f"Convert {total_cm} cm to meters and centimeters." if cm > 0 else f"Convert {total_cm} cm to meters."
            q["answer"] = f"{m} m {cm} cm" if cm > 0 else f"{m} m"
            q_format = "mcq"
        elif "SUB_MISSING_NUMBER" in t:
            a = random.randint(20, 50 * difficulty)
            b = random.randint(5, a - 1)
            ans = a - b
            q["text"] = f"Solve for the missing number: {a} - [?] = {ans}"
            q["answer"] = str(b)
        elif "SUB_TWO_STEP" in t:
            a = random.randint(50, 100 * difficulty)
            b = random.randint(10, a // 2)
            c = random.randint(5, b)
            q["text"] = f"Calculate: {a} - {b} - {c}"
            q["answer"] = str(a - b - c)
        elif "DIRECTIONS" in t:
            if difficulty == 1:
                pairs = [("North", "South"), ("South", "North"), ("East", "West"), ("West", "East")]
                d1, d2 = random.choice(pairs)
                q["text"] = f"Which direction is directly opposite to {d1}?"
                q["answer"] = d2
                q_format = "mcq"
            elif difficulty == 2:
                d1 = random.choice(["North", "South"])
                d2 = random.choice(["East", "West"])
                opp = "South" if d1 == "North" else "North"
                q["text"] = f"If you walk 5 steps {d1}, 3 steps {d2}, and then 5 steps {opp}, which direction are you from your starting point?"
                q["answer"] = d2
                q_format = "mcq"
            else:
                d1 = random.choice(["North", "South", "East", "West"])
                opp = {"North":"South", "South":"North", "East":"West", "West":"East"}[d1]
                steps1 = random.randint(4, 9)
                steps2 = random.randint(1, steps1 - 1)
                q["text"] = f"A robot moves {steps1} blocks {d1} and then {steps2} blocks {opp}. How many blocks {d1} is it from the start?"
                q["answer"] = str(steps1 - steps2)
                q_format = "fill_blank"
        else:
            q["text"] = "General Math Question: 5 + 5 = ?"
            q["answer"] = "10"

        if q_format == "mcq":
            q["options"] = generate_options(q["answer"])
        elif q_format == "boolean":
            q["options"] = ["True", "False"]
            
        questions.append(q)
        q_id += 1

with open('core_math/question_pool.json', 'w', encoding='utf-8') as f:
    json.dump({"questions": questions}, f, indent=4)
print(f"Successfully generated {len(questions)} questions across {len(grade4_types)} Grade 4 types in core_math/question_pool.json")
