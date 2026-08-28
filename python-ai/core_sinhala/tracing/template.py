"""
template.py
Sinhala Linguistic Database, Character & Pillama Inventories, and Reference Tracing Templates
"""

from typing import Dict, List, Any, Optional

# ── 1. Structured Sinhala Letter Inventory ──
SINHALA_LETTER_DB: Dict[str, Dict[str, Any]] = {
    "අ": {"type": "vowel", "unicode": "\\u0D85", "name": "Ayanu", "has_descender": False, "has_ascender": False},
    "ආ": {"type": "vowel", "unicode": "\\u0D86", "name": "Aayanu", "has_descender": False, "has_ascender": False},
    "ඇ": {"type": "vowel", "unicode": "\\u0D87", "name": "Aeyanu", "has_descender": False, "has_ascender": False},
    "ඈ": {"type": "vowel", "unicode": "\\u0D88", "name": "Aaeyanu", "has_descender": False, "has_ascender": False},
    "ඉ": {"type": "vowel", "unicode": "\\u0D89", "name": "Iyanu", "has_descender": False, "has_ascender": True},
    "ඊ": {"type": "vowel", "unicode": "\\u0D8A", "name": "Iiyanu", "has_descender": False, "has_ascender": True},
    "උ": {"type": "vowel", "unicode": "\\u0D8B", "name": "Uyanu", "has_descender": False, "has_ascender": False},
    "ඌ": {"type": "vowel", "unicode": "\\u0D8C", "name": "Uuyanu", "has_descender": True, "has_ascender": False},
    "එ": {"type": "vowel", "unicode": "\\u0D8E", "name": "Eyanu", "has_descender": False, "has_ascender": False},
    "ඒ": {"type": "vowel", "unicode": "\\u0D8F", "name": "Eeyanu", "has_descender": False, "has_ascender": True},
    "ඔ": {"type": "vowel", "unicode": "\\u0D92", "name": "Oyanu", "has_descender": False, "has_ascender": False},
    "ඕ": {"type": "vowel", "unicode": "\\u0D93", "name": "Ooyanu", "has_descender": False, "has_ascender": True},

    "ක": {"type": "consonant", "unicode": "\\u0D9A", "name": "Kayanna", "has_descender": False, "has_ascender": False},
    "ග": {"type": "consonant", "unicode": "\\u0D9C", "name": "Gayanna", "has_descender": False, "has_ascender": False},
    "ත": {"type": "consonant", "unicode": "\\u0DA toxicity", "name": "Tayanna", "has_descender": False, "has_ascender": False},
    "ද": {"type": "consonant", "unicode": "\\u0DAF", "name": "Dayanna", "has_descender": False, "has_ascender": False},
    "ප": {"type": "consonant", "unicode": "\\u0DB4", "name": "Payanna", "has_descender": False, "has_ascender": False},
    "බ": {"type": "consonant", "unicode": "\\u0DB6", "name": "Bayanna", "has_descender": False, "has_ascender": False},
    "ම": {"type": "consonant", "unicode": "\\u0DB8", "name": "Mayanna", "has_descender": False, "has_ascender": False},
    "ය": {"type": "consonant", "unicode": "\\u0DBF", "name": "Yayanna", "has_descender": False, "has_ascender": False},
    "ර": {"type": "consonant", "unicode": "\\u0DC3", "name": "Rayanna", "has_descender": False, "has_ascender": False},
    "ල": {"type": "consonant", "unicode": "\\u0DC5", "name": "Layanna", "has_descender": False, "has_ascender": False},
    "ව": {"type": "consonant", "unicode": "\\u0DC0", "name": "Vayanna", "has_descender": False, "has_ascender": False},
    "ස": {"type": "consonant", "unicode": "\\u0DC3", "name": "Sayanna", "has_descender": False, "has_ascender": False},
    "හ": {"type": "consonant", "unicode": "\\u0DC4", "name": "Hayanna", "has_descender": False, "has_ascender": False}
}

# ── 2. Sinhala Pillama Database ──
PILLAMA_DB: Dict[str, Dict[str, Any]] = {
    "P_NONE": {
        "id": "P_NONE",
        "name": "පිල්ලම් රහිත (Base Letter)",
        "sign": "",
        "position": "none",
        "has_ascender": False,
        "has_descender": False
    },
    "P_AELA": {
        "id": "P_AELA",
        "name": "ඇලපිල්ල (ා)",
        "sign": "ා",
        "position": "right",
        "has_ascender": False,
        "has_descender": False
    },
    "P_AEDA": {
        "id": "P_AEDA",
        "name": "ඇදපිල්ල (ැ / ෑ)",
        "sign": "ැ",
        "position": "right-below",
        "has_ascender": False,
        "has_descender": True
    },
    "P_ISPILI": {
        "id": "P_ISPILI",
        "name": "ඉස්පිල්ල (ි / ී)",
        "sign": "ි",
        "position": "top",
        "has_ascender": True,
        "has_descender": False
    },
    "P_PAPILI": {
        "id": "P_PAPILI",
        "name": "පාපිල්ල (ු / ූ)",
        "sign": "ු",
        "position": "bottom",
        "has_ascender": False,
        "has_descender": True
    },
    "P_KOMBU": {
        "id": "P_KOMBU",
        "name": "කොම්බුව (ෙ / ේ)",
        "sign": "ෙ",
        "position": "left",
        "has_ascender": False,
        "has_descender": False
    }
}

# ── 3. Valid Grapheme Registry (Letter + Pillam) ──
GRAPHEME_DB: Dict[str, Dict[str, Any]] = {
    "ක": {"base": "ක", "pillama": "P_NONE"},
    "කා": {"base": "ක", "pillama": "P_AELA"},
    "කැ": {"base": "ක", "pillama": "P_AEDA"},
    "කි": {"base": "ක", "pillama": "P_ISPILI"},
    "කු": {"base": "ක", "pillama": "P_PAPILI"},
    "කෙ": {"base": "ක", "pillama": "P_KOMBU"},

    "ග": {"base": "ග", "pillama": "P_NONE"},
    "ගා": {"base": "ග", "pillama": "P_AELA"},
    "ගැ": {"base": "ග", "pillama": "P_AEDA"},
    "ගි": {"base": "ග", "pillama": "P_ISPILI"},
    "ගු": {"base": "ග", "pillama": "P_PAPILI"},
    "ගෙ": {"base": "ග", "pillama": "P_KOMBU"},

    "ත": {"base": "ත", "pillama": "P_NONE"},
    "තා": {"base": "ත", "pillama": "P_AELA"},
    "ති": {"base": "ත", "pillama": "P_ISPILI"},
    "තු": {"base": "ත", "pillama": "P_PAPILI"},
    "තෙ": {"base": "ත", "pillama": "P_KOMBU"},

    "ම": {"base": "ම", "pillama": "P_NONE"},
    "මා": {"base": "ම", "pillama": "P_AELA"},
    "මි": {"base": "ම", "pillama": "P_ISPILI"},
    "මු": {"base": "ම", "pillama": "P_PAPILI"},
    "මෙ": {"base": "ම", "pillama": "P_KOMBU"},

    "ප": {"base": "ප", "pillama": "P_NONE"},
    "පා": {"base": "ප", "pillama": "P_AELA"},
    "පි": {"base": "ප", "pillama": "P_ISPILI"},
    "පු": {"base": "ප", "pillama": "P_PAPILI"},
    "පෙ": {"base": "ප", "pillama": "P_KOMBU"},
}

# ── 4. Explicit Tracing Templates with Target Subcomponents ──
TRACING_TEMPLATES: Dict[str, Dict[str, Any]] = {
    "TRACE_KA_001": {
        "template_id": "TRACE_KA_001",
        "target_text": "ක",
        "tracing_type": "letter",
        "components": [{"text": "ක", "type": "letter", "base": "ක", "pillama": "P_NONE", "weight": 1.0}],
        "has_ascender": False,
        "has_descender": False
    },
    "TRACE_GA_001": {
        "template_id": "TRACE_GA_001",
        "target_text": "ග",
        "tracing_type": "letter",
        "components": [{"text": "ග", "type": "letter", "base": "ග", "pillama": "P_NONE", "weight": 1.0}],
        "has_ascender": False,
        "has_descender": False
    },
    "TRACE_MA_001": {
        "template_id": "TRACE_MA_001",
        "target_text": "ම",
        "tracing_type": "letter",
        "components": [{"text": "ම", "type": "letter", "base": "ම", "pillama": "P_NONE", "weight": 1.0}],
        "has_ascender": False,
        "has_descender": False
    },
    "TRACE_THA_001": {
        "template_id": "TRACE_THA_001",
        "target_text": "ත",
        "tracing_type": "letter",
        "components": [{"text": "ත", "type": "letter", "base": "ත", "pillama": "P_NONE", "weight": 1.0}],
        "has_ascender": False,
        "has_descender": False
    },
    "TRACE_KAA_001": {
        "template_id": "TRACE_KAA_001",
        "target_text": "කා",
        "tracing_type": "grapheme",
        "components": [
            {"text": "ක", "type": "base_letter", "base": "ක", "pillama": "P_NONE", "weight": 0.6},
            {"text": "ා", "type": "pillama", "base": "ක", "pillama": "P_AELA", "weight": 0.4}
        ],
        "has_ascender": False,
        "has_descender": False
    },
    "TRACE_GU_001": {
        "template_id": "TRACE_GU_001",
        "target_text": "ගු",
        "tracing_type": "grapheme",
        "components": [
            {"text": "ග", "type": "base_letter", "base": "ග", "pillama": "P_NONE", "weight": 0.55},
            {"text": "ු", "type": "pillama", "base": "ග", "pillama": "P_PAPILI", "weight": 0.45}
        ],
        "has_ascender": False,
        "has_descender": True
    },
    "TRACE_MALA_001": {
        "template_id": "TRACE_MALA_001",
        "target_text": "මල",
        "tracing_type": "word",
        "components": [
            {"text": "ම", "type": "letter", "base": "ම", "pillama": "P_NONE", "weight": 0.5},
            {"text": "ල", "type": "letter", "base": "ල", "pillama": "P_NONE", "weight": 0.5}
        ],
        "has_ascender": False,
        "has_descender": False
    },
    "TRACE_GASA_001": {
        "template_id": "TRACE_GASA_001",
        "target_text": "ගස",
        "tracing_type": "word",
        "components": [
            {"text": "ග", "type": "letter", "base": "ග", "pillama": "P_NONE", "weight": 0.5},
            {"text": "ස", "type": "letter", "base": "ස", "pillama": "P_NONE", "weight": 0.5}
        ],
        "has_ascender": False,
        "has_descender": False
    },
    "TRACE_PASALA_001": {
        "template_id": "TRACE_PASALA_001",
        "target_text": "පාසල",
        "tracing_type": "word",
        "components": [
            {"text": "පා", "type": "grapheme", "base": "ප", "pillama": "P_AELA", "weight": 0.4},
            {"text": "ස", "type": "letter", "base": "ස", "pillama": "P_NONE", "weight": 0.3},
            {"text": "ල", "type": "letter", "base": "ල", "pillama": "P_NONE", "weight": 0.3}
        ],
        "has_ascender": False,
        "has_descender": False
    },
    "TRACE_POTA_001": {
        "template_id": "TRACE_POTA_001",
        "target_text": "පොත",
        "tracing_type": "word",
        "components": [
            {"text": "පො", "type": "grapheme", "base": "ප", "pillama": "P_KOMBU", "weight": 0.5},
            {"text": "ත", "type": "letter", "base": "ත", "pillama": "P_NONE", "weight": 0.5}
        ],
        "has_ascender": False,
        "has_descender": False
    }
}

def get_template(target_text: str, template_id: Optional[str] = None) -> Dict[str, Any]:
    if template_id and template_id in TRACING_TEMPLATES:
        return TRACING_TEMPLATES[template_id]
    
    # Match by target_text
    for tid, tpl in TRACING_TEMPLATES.items():
        if tpl["target_text"] == target_text:
            return tpl
            
    # Dynamic template synthesis for unlisted target text
    comps = []
    has_desc = False
    has_asc = False
    for ch in target_text:
        ch_info = SINHALA_LETTER_DB.get(ch, {})
        has_desc = has_desc or ch_info.get("has_descender", False)
        has_asc = has_asc or ch_info.get("has_ascender", False)
        comps.append({"text": ch, "type": "letter", "base": ch, "pillama": "P_NONE", "weight": 1.0 / max(1, len(target_text))})

    return {
        "template_id": f"DYN_TRACE_{target_text}",
        "target_text": target_text,
        "tracing_type": "word" if len(target_text) > 1 else "letter",
        "components": comps,
        "has_ascender": has_asc,
        "has_descender": has_desc
    }
