import re
from typing import List, Tuple, Dict, Any

# Standard CMU / IPA G2P Lexicon for Sri Lankan Primary English Curriculum
G2P_LEXICON = {
    # Target words & common contrast words
    "school": ["s", "k", "uː", "l"],
    "three": ["θ", "r", "iː"],
    "tree": ["t", "r", "iː"],
    "this": ["ð", "ɪ", "s"],
    "that": ["ð", "æ", "t"],
    "think": ["θ", "ɪ", "ŋ", "k"],
    "film": ["f", "ɪ", "l", "m"],
    "pilm": ["p", "ɪ", "l", "m"],
    "fan": ["f", "æ", "n"],
    "pan": ["p", "æ", "n"],
    "space": ["s", "p", "eɪ", "s"],
    "these": ["ð", "iː", "z"],
    "dees": ["d", "iː", "z"],
    "fish": ["f", "ɪ", "ʃ"],
    "welcome": ["w", "e", "l", "k", "ə", "m"],
    "velcome": ["v", "e", "l", "k", "ə", "m"],
    "west": ["w", "e", "s", "t"],
    "vest": ["v", "e", "s", "t"],
    "bus": ["b", "ʌ", "s"],
    "basa": ["b", "ʌ", "s", "ə"],
    "friend": ["f", "r", "e", "n", "d"],
    "fren": ["f", "r", "e", "n"],
    "project": ["p", "r", "ɒ", "dʒ", "e", "k", "t"],
    "projec": ["p", "r", "ɒ", "dʒ", "e", "k"],
    "cake": ["k", "eɪ", "k"],
    "kek": ["k", "e", "k"],
    "boat": ["b", "əʊ", "t"],
    "bot": ["b", "ɒ", "t"],
    "house": ["h", "aʊ", "s"],
    "ouse": ["aʊ", "s"],
    "busy": ["b", "ɪ", "z", "i"],
    "bissy": ["b", "ɪ", "s", "i"],
    "thought": ["θ", "ɔː", "t"],
    "thot": ["θ", "ɒ", "t"],
    "beautiful": ["b", "j", "uː", "t", "ɪ", "f", "əl"],
    "book": ["b", "ʊ", "k"],
    "apple": ["æ", "p", "l"],
    "cat": ["k", "æ", "t"],
    "dog": ["d", "ɒ", "ɡ"],
    "girl": ["ɡ", "ɜː", "l"],
    "boy": ["b", "ɔɪ"],
    "happy": ["h", "æ", "p", "i"],
    "water": ["w", "ɔː", "t", "ə"],
    "spoon": ["s", "p", "uː", "n"],
    "station": ["s", "t", "eɪ", "ʃ", "n"],
    "study": ["s", "t", "ʌ", "d", "i"],
    "please": ["p", "l", "iː", "z"],
    "zoo": ["z", "uː"],
    "next": ["n", "e", "k", "s", "t"],
    "stamp": ["s", "t", "æ", "m", "p"]
}

def get_phonemes_for_word(word: str) -> List[str]:
    """Retrieves standard expected phoneme list for a word, with fallback letter mapping."""
    clean = re.sub(r'[^a-zA-Z]', '', word).lower()
    if clean in G2P_LEXICON:
        return list(G2P_LEXICON[clean])
    # Fallback heuristic mapping
    return list(clean)

def get_sentence_phonemes(sentence: str) -> List[Tuple[str, List[str]]]:
    """Returns a list of (word, [phonemes]) for each word in a sentence."""
    words = re.findall(r'\b[a-zA-Z]+\b', sentence)
    return [(w.lower(), get_phonemes_for_word(w)) for w in words]

def align_phoneme_sequences(expected: List[str], heard: List[str]) -> Dict[str, Any]:
    """
    Performs optimal dynamic-programming sequence alignment (Needleman-Wunsch / Levenshtein)
    between expected phonemes and actual heard phonemes.
    Identifies insertions, deletions, substitutions, and exact matches.
    """
    n, m = len(expected), len(heard)
    # Distance matrix
    dp = [[0] * (m + 1) for _ in range(n + 1)]
    for i in range(n + 1):
        dp[i][0] = i
    for j in range(m + 1):
        dp[0][j] = j
        
    for i in range(1, n + 1):
        for j in range(1, m + 1):
            if expected[i-1] == heard[j-1]:
                cost = 0
            else:
                cost = 1
            dp[i][j] = min(
                dp[i-1][j] + 1,       # deletion
                dp[i][j-1] + 1,       # insertion
                dp[i-1][j-1] + cost   # match / substitution
            )
            
    # Traceback alignment
    i, j = n, m
    aligned_expected = []
    aligned_heard = []
    deviations = []
    
    while i > 0 or j > 0:
        if i > 0 and j > 0 and (expected[i-1] == heard[j-1] or dp[i][j] == dp[i-1][j-1] + 1):
            aligned_expected.append(expected[i-1])
            aligned_heard.append(heard[j-1])
            if expected[i-1] != heard[j-1]:
                deviations.append({
                    "type": "substitution",
                    "expected": expected[i-1],
                    "heard": heard[j-1],
                    "pos": i-1
                })
            else:
                deviations.append({
                    "type": "match",
                    "expected": expected[i-1],
                    "heard": heard[j-1],
                    "pos": i-1
                })
            i -= 1
            j -= 1
        elif i > 0 and (j == 0 or dp[i][j] == dp[i-1][j] + 1):
            aligned_expected.append(expected[i-1])
            aligned_heard.append("-")
            deviations.append({
                "type": "deletion",
                "expected": expected[i-1],
                "heard": None,
                "pos": i-1
            })
            i -= 1
        else:
            aligned_expected.append("-")
            aligned_heard.append(heard[j-1])
            deviations.append({
                "type": "insertion",
                "expected": None,
                "heard": heard[j-1],
                "pos": i
            })
            j -= 1
            
    aligned_expected.reverse()
    aligned_heard.reverse()
    deviations.reverse()
    
    # Calculate Phoneme Error Rate (PER)
    errors = sum(1 for d in deviations if d["type"] != "match")
    per = errors / max(1, len(expected))
    accuracy = max(0.0, min(100.0, (1.0 - per) * 100.0))
    
    return {
        "expected_sequence": expected,
        "heard_sequence": heard,
        "aligned_expected": aligned_expected,
        "aligned_heard": aligned_heard,
        "deviations": deviations,
        "phoneme_error_rate": round(per, 3),
        "phoneme_accuracy": round(accuracy, 1)
    }
