import os
import json
import re
import numpy as np
import librosa
from scipy.spatial.distance import cdist
from typing import Dict, Any, List, Optional
from core_english.phoneme_engine import align_phoneme_sequences, get_phonemes_for_word

# 12 Core Sri Lankan English MTI Patterns Reference Knowledgebase
SRI_LANKAN_MTI_PATTERNS = [
    {
        "id": 1,
        "key": "S_CLUSTER_PROSTHESIS",
        "name": "S-Cluster Prosthesis",
        "name_si": "වචන මුලට 'ඉ' ශබ්දය එකතු කිරීම (I-school)",
        "target_ipa": "/skuːl/",
        "error_ipa": "/ɪskuːl/ or /iskul/",
        "examples": ["school", "spoon", "station", "study", "speak", "star", "stop", "spring"],
        "pedagogical_tip": "Start immediately with the hissing 'sss' sound without adding an 'is-' in front (say 'sss-chool', not 'is-school').",
        "pedagogical_tip_si": "වචනය ආරම්භයේදී 'ඉස්' (Is-) වෙනුවට 'ස්ස්' (sss-) ශබ්දයෙන් කෙලින්ම ආරම්භ කරන්න."
    },
    {
        "id": 2,
        "key": "V_W_MERGER",
        "name": "V/W Merger",
        "name_si": "V සහ W ශබ්ද පටලවා ගැනීම (Wery / Vindow)",
        "target_ipa": "/ˈveri/",
        "error_ipa": "/ˈweri/",
        "examples": ["very", "water", "win", "view", "van", "window", "voice", "village"],
        "pedagogical_tip": "For 'W', round your lips forward into a circle ('O'). For 'V', touch your top front teeth gently to your lower lip.",
        "pedagogical_tip_si": "'W' අකුරට තොල් රවුම් කරන්න. 'V' අකුරට උඩු දත් යටි තොල මත තබා කතා කරන්න."
    },
    {
        "id": 3,
        "key": "TH_SUBSTITUTION",
        "name": "TH Substitution (TH → T/D)",
        "name_si": "TH ශබ්දය වෙනුවට T/D භාවිතය (Tree for Three)",
        "target_ipa": "/θriː/",
        "error_ipa": "/triː/",
        "examples": ["three", "think", "this", "that", "there", "the", "mother", "father"],
        "pedagogical_tip": "Put the tip of your tongue gently between your front teeth and blow air gently to produce the soft 'TH' sound.",
        "pedagogical_tip_si": "දිව දත් දෙක අතර මඳක් තබා වාතය පිටකරමින් මෘදු 'TH' ශබ්දය උච්චාරණය කරන්න."
    },
    {
        "id": 4,
        "key": "F_P_SUBSTITUTION",
        "name": "F/P Substitution",
        "name_si": "F වෙනුවට P ශබ්දය භාවිතය (Pan for Fan)",
        "target_ipa": "/fæn/",
        "error_ipa": "/pæn/",
        "examples": ["fan", "film", "food", "elephant", "fish", "feather", "four"],
        "pedagogical_tip": "Gently place upper teeth on lower lip and blow air for 'F', rather than pressing both lips together like 'P'.",
        "pedagogical_tip_si": "'F' ශබ්දයට උඩු දත් යටි තොල මත තබා හුළං පිඹින්න (තොල් දෙකම එකතු කර 'P' ශබ්දය නොගන්න)."
    },
    {
        "id": 5,
        "key": "PARAGOGE",
        "name": "Paragoge (Ending Vowel Addition)",
        "name_si": "වචන අගට අනවශ්‍ය ස්වර එකතු කිරීම (Busa / Milka)",
        "target_ipa": "/bʌs/",
        "error_ipa": "/bʌsə/ or /busa/",
        "examples": ["bus", "milk", "book", "good", "cake", "stamp", "park", "pen"],
        "pedagogical_tip": "Stop your voice cleanly at the final consonant without adding an extra '-a' sound at the end.",
        "pedagogical_tip_si": "වචනය අවසානයේ අනවශ්‍ය 'අ' හෝ 'උ' ශබ්දයක් (උදා: බස්-අ) එකතු නොකර වචනය පිරිසිදුව අවසන් කරන්න."
    },
    {
        "id": 6,
        "key": "FINAL_CONSONANT_WEAKENING",
        "name": "Final Consonant Weakening / Deletion",
        "name_si": "අවසාන ව්‍යංජන ශබ්දය අතහැරීම (Bu for But)",
        "target_ipa": "/bʌt/",
        "error_ipa": "/bʌ/",
        "examples": ["but", "good", "that", "friend", "cat", "hand", "red", "bird"],
        "pedagogical_tip": "Make sure to clearly pronounce the ending consonant sound (like 't', 'd', 'k') at the end of the word.",
        "pedagogical_tip_si": "වචනයේ අග ඇති 't', 'd', 'k' වැනි අවසන් අකුරු ශබ්දය පැහැදිලිව ප්‍රකාශ කරන්න."
    },
    {
        "id": 7,
        "key": "CLUSTER_SIMPLIFICATION",
        "name": "Consonant Cluster Simplification",
        "name_si": "බැඳි අකුරු සරල කර පැවසීම (Neks for Next)",
        "target_ipa": "/nekst/",
        "error_ipa": "/neks/",
        "examples": ["next", "friend", "stamp", "product", "desk", "fast", "best", "plant"],
        "pedagogical_tip": "Clearly pronounce all consonant sounds in the cluster (e.g. pronounce both the 's' and 't' in 'next').",
        "pedagogical_tip_si": "වචන අග ඇති සියලුම බැඳි අකුරු ශබ්ද (උදා: 'next' හි s සහ t) සම්පූර්ණයෙන් පවසන්න."
    },
    {
        "id": 8,
        "key": "VOWEL_LENGTH_CONFUSION",
        "name": "Short/Long Vowel Confusion",
        "name_si": "දිගු සහ කෙටි ස්වර පටලවා ගැනීම (Kek for Cake)",
        "target_ipa": "/keɪk/",
        "error_ipa": "/kek/",
        "examples": ["cake", "boat", "great", "note", "feet", "fit", "seat", "sit"],
        "pedagogical_tip": "Elongate the diphthong vowel cleanly (say 'kay-eek' for cake, rather than a short 'kek').",
        "pedagogical_tip_si": "දිගු ස්වර ශබ්ද (Diphthongs) ප්‍රමාණවත් ලෙස ඇද උච්චාරණය කරන්න."
    },
    {
        "id": 9,
        "key": "INITIAL_H_DELETION",
        "name": "Initial H Dropping",
        "name_si": "'H' ශබ්දය අතහැරීම (Ouse for House)",
        "target_ipa": "/haʊs/",
        "error_ipa": "/aʊs/",
        "examples": ["house", "happy", "hello", "hand", "hot", "hat", "hear", "help"],
        "pedagogical_tip": "Breathe out gently like a sigh ('hhh') before starting the vowel in words starting with 'H'.",
        "pedagogical_tip_si": "'H' අකුරෙන් පටන් ගන්නා වචන වලදී ආරම්භයේදීම 'හ්' (hhh) හුස්ම පිටකරමින් ශබ්ද කරන්න."
    },
    {
        "id": 10,
        "key": "Z_S_CONFUSION",
        "name": "Z/S Voicing Confusion",
        "name_si": "Z සහ S ශබ්ද පටලවා ගැනීම (Busi for Busy)",
        "target_ipa": "/zuː/",
        "error_ipa": "/suː/",
        "examples": ["zoo", "busy", "please", "zero", "zebra", "music", "noise", "rose"],
        "pedagogical_tip": "Vibrate your vocal cords (buzz like a bee: 'zzz') when pronouncing 'Z' sounds.",
        "pedagogical_tip_si": "'Z' ශබ්දය පැවසීමේදී උගුරේ කම්පනයක් (මී මැස්සෙකුගේ නාදය: zzz) ඇති කරමින් ශබ්ද කරන්න."
    },
    {
        "id": 11,
        "key": "BACK_VOWEL_CONFUSION",
        "name": "Back Vowel Confusion",
        "name_si": "පසුපස ස්වර පටලවා ගැනීම (Hol for Hall / Kap for Cup)",
        "target_ipa": "/hɔːl/",
        "error_ipa": "/hɒl/ or /hol/",
        "examples": ["hall", "hot", "cup", "bus", "ball", "call", "walk", "tall"],
        "pedagogical_tip": "Open your mouth taller and drop your jaw to produce the deep back vowel '/ɔː/' sound.",
        "pedagogical_tip_si": "කට හොඳින් විවෘත කර නිවැරදි ගැඹුරු ස්වර ශබ්දය ලබාගන්න."
    },
    {
        "id": 12,
        "key": "STRESS_RHYTHM_DEVIATION",
        "name": "Equal Stress / Syllable-Timed Rhythm",
        "name_si": "ඒකාකාරී රොබෝ රිද්මය (Equal Stress / Flat Rhythm)",
        "target_ipa": "/kəmˈpjuːtər/",
        "error_ipa": "/kompjuˈter/ (equal stress)",
        "examples": ["computer", "banana", "tomorrow", "beautiful", "together", "umbrella"],
        "pedagogical_tip": "English is stress-timed! Put strong emphasis on the stressed syllable and say unstressed syllables quickly and lightly.",
        "pedagogical_tip_si": "ඉංග්‍රීසි භාෂාවේ ප්‍රධාන අක්ෂරයට වැඩි බරක් දී (Stress), අනෙක් අක්ෂර සැහැල්ලුවෙන් උච්චාරණය කරන්න."
    }
]

# Quick lookup by pattern key
MTI_MAP = {p["key"]: p for p in SRI_LANKAN_MTI_PATTERNS}

class SriLankanMTIRuleEngine:
    """
    12 Explicit Rule Detectors & Dual-Template Acoustic Contrast Engine
    for Sri Lankan English Primary Learner MTI Patterns.
    """
    def __init__(self, sr: int = 16000):
        self.sr = sr
        self.patterns = SRI_LANKAN_MTI_PATTERNS

    def analyze_spoken_text(self, spoken_text: str, target_text: str) -> List[Dict[str, Any]]:
        """Text-level MTI pattern detector based on transcribed word substitutions."""
        detected = []
        spoken_clean = re.sub(r'[^a-zA-Z0-9 ]', ' ', spoken_text or '').lower().strip()
        target_clean = re.sub(r'[^a-zA-Z0-9 ]', ' ', target_text or '').lower().strip()

        spoken_words = spoken_clean.split()
        target_words = target_clean.split()

        for idx, tw in enumerate(target_words):
            # 1. S-Cluster Prosthesis (e.g. target: 'spring', 'star', 'station', 'school' -> spoken: "it's spring", "is spring", "ispring", "east spring", "esta", "easter", "est")
            if tw.startswith(('sc', 'sp', 'st', 'sk', 'sm', 'sn', 'spr', 'str', 'scr')):
                has_direct_prosthesis = any(
                    sw in ['i' + tw, 'is' + tw[1:], 'es' + tw[1:], 'est', 'esta', 'easter', 'estar', 'istar', 'aster', 'ispring', 'espring', 'istation', 'ischool', 'ispoon', 'istudy', 'estudy', 'history', 'histories', 'ispeak', 'istop'] or
                    sw.startswith('is' + tw) or sw.startswith('es' + tw) or sw.startswith('i' + tw)
                    for sw in spoken_words
                )
                
                has_separated_prosthesis = False
                if len(target_words) == 1:
                    is_school = (tw == 'school')
                    has_target_or_confuser = any(
                        sw == tw or sw.startswith(tw[:3]) or (is_school and sw in ['cool', 'kool', 'pool', 'tool', 'call', 'coo', 'cl'])
                        for sw in spoken_words
                    )
                    has_separated_prosthesis = has_target_or_confuser and any(
                        sw in ['is', 'es', 'est', 'east', 'easter', 'esta', 'his', 'he', 'its', "it's", 'it']
                        for sw in spoken_words
                    )
                else:
                    for s_idx, sw in enumerate(spoken_words):
                        if sw == tw or sw.startswith(tw[:3]):
                            if s_idx > 0 and spoken_words[s_idx - 1] in ['is', 'es', 'est', 'east', 'esta', 'its', "it's"]:
                                expected_prev = target_words[idx - 1] if idx > 0 else ""
                                if spoken_words[s_idx - 1] != expected_prev:
                                    has_separated_prosthesis = True
                                    break

                if has_direct_prosthesis or has_separated_prosthesis:
                    detected.append(self._build_pattern_entry("S_CLUSTER_PROSTHESIS", tw, "is-" + tw))

            # 2. V/W Merger (e.g. target: 'very', spoken: 'wery')
            if tw.startswith('v'):
                if any(sw in ['w' + tw[1:], 'wary', 'worry', 'wery', 'where', 'ware', 'wan', 'one', 'when', 'wew', 'woice', 'willage'] for sw in spoken_words):
                    detected.append(self._build_pattern_entry("V_W_MERGER", tw, 'w' + tw[1:]))
            elif tw.startswith('w'):
                if any(sw in ['v' + tw[1:], 'vater', 'voter', 'varta', 'vin', 'vindow', 'vinda'] for sw in spoken_words):
                    detected.append(self._build_pattern_entry("V_W_MERGER", tw, 'v' + tw[1:]))

            # 3. TH Substitution (e.g. target: 'three', spoken: 'tree')
            if tw in ['three', 'think', 'this', 'that', 'there', 'the', 'mother', 'father']:
                if tw == 'three' and any(sw in ['tree', 'tray', 'free', 'thee', 'tri', 'tee', 'tea', 'ti', 't'] for sw in spoken_words):
                    detected.append(self._build_pattern_entry("TH_SUBSTITUTION", tw, "tree"))
                elif tw == 'think' and any(sw in ['tink', 'sink', 'pink', 'thing', 'tin'] for sw in spoken_words):
                    detected.append(self._build_pattern_entry("TH_SUBSTITUTION", tw, "tink"))
                elif tw in ['this', 'that'] and any(sw in ['dis', 'dat', 'tis', 'tat', 'thiss', 'dot'] for sw in spoken_words):
                    detected.append(self._build_pattern_entry("TH_SUBSTITUTION", tw, "dis/dat"))
                elif tw == 'there' and any(sw in ['dare', 'tare', 'their', 'dey'] for sw in spoken_words):
                    detected.append(self._build_pattern_entry("TH_SUBSTITUTION", tw, "dare"))
                elif tw == 'the' and any(sw in ['de', 'te', 'da'] for sw in spoken_words):
                    detected.append(self._build_pattern_entry("TH_SUBSTITUTION", tw, "de"))
                elif tw == 'mother' and any(sw in ['mudder', 'moder', 'matter', 'madar'] for sw in spoken_words):
                    detected.append(self._build_pattern_entry("TH_SUBSTITUTION", tw, "mudder"))
                elif tw == 'father' and any(sw in ['fadder', 'fader', 'pada'] for sw in spoken_words):
                    detected.append(self._build_pattern_entry("TH_SUBSTITUTION", tw, "fadder"))

            # 4. F/P Substitution (e.g. target: 'elephant', 'fan', 'film', 'food', 'four')
            if tw.startswith('f') or 'ph' in tw or tw == 'elephant':
                is_fish = (tw == 'fish')
                has_fp = any(
                    sw == 'p' + tw[1:] or 
                    sw in ['pan', 'pen', 'pilm', 'film', 'pood', 'pone', 'pour', 'pore', 'poor', 'paw', 'po', 'pole', 'poll', 'par', 'per', 'port', 'pot', 'pish', 'push', 'dish', 'pedder', 'peather', 'peter', 'elepant', 'elephent', 'aliphant', 'oliphant', 'elipant', 'elephan', 'eliphant', 'pud', 'put', 'pill', 'peace', 'piece'] or
                    (is_fish and sw in ['pish', 'push', 'peach', 'pitch', 'piss', 'pis', 'dish', 'phish', 'posh']) or
                    (tw.startswith('f') and (sw.startswith('p' + tw[1:3]) or sw.startswith(('po', 'pa', 'pe', 'pi')))) or
                    (tw == 'elephant' and ('pant' in sw or 'plant' in sw or 'pent' in sw or sw == 'elepant'))
                    for sw in spoken_words
                )
                if has_fp:
                    detected.append(self._build_pattern_entry("F_P_SUBSTITUTION", tw, 'p' + tw[1:] if tw.startswith('f') else 'elepant'))

            # 5. Paragoge (e.g. target: 'bus', spoken: 'busa')
            if tw in ['bus', 'milk', 'book', 'good', 'cake', 'stamp', 'park', 'pen']:
                if any(sw in [tw + 'a', tw + 'ha', tw + 'er', tw + 'e', tw + 'i', 'milkha', 'milka', 'melka', 'melkha', 'milkah', 'busa', 'basa', 'bassa', 'booka', 'buku', 'gooda', 'guda', 'keka', 'keki', 'stampa', 'parka', 'paka', 'pena'] for sw in spoken_words):
                    detected.append(self._build_pattern_entry("PARAGOGE", tw, tw + 'a'))

            # 6. Final Consonant Weakening (e.g. target: 'but', spoken: 'bu')
            if tw in ['but', 'good', 'that', 'friend', 'cat', 'hand', 'red', 'bird']:
                if any(sw in ['bu', 'ba', 'bah', 'goo', 'gu', 'tha', 'fren', 'ca', 'kah', 'han', 're', 'ray', 'ber', 'bur'] for sw in spoken_words):
                    detected.append(self._build_pattern_entry("FINAL_CONSONANT_WEAKENING", tw, tw[:-1]))

            # 7. Consonant Cluster Simplification (e.g. target: 'next', spoken: 'neks')
            if tw in ['next', 'friend', 'stamp', 'product', 'desk', 'fast', 'best', 'plant']:
                if any(sw in ['neks', 'necks', 'nex', 'neck', 'fren', 'stam', 'stem', 'produk', 'produc', 'des', 'dec', 'fas', 'fass', 'pass', 'farce', 'face', 'first', 'force', 'bes', 'bet', 'plan', 'plen'] for sw in spoken_words):
                    detected.append(self._build_pattern_entry("CLUSTER_SIMPLIFICATION", tw, 'neks'))

            # 8. Short/Long Vowel Confusion (e.g. target: 'cake', spoken: 'kek')
            if tw in ['cake', 'boat', 'great', 'note', 'feet', 'fit', 'seat', 'sit']:
                if (
                    (tw == 'cake' and any(sw in ['kek', 'kake'] for sw in spoken_words)) or
                    (tw == 'boat' and any(sw in ['bot', 'bought', 'board', 'bode', 'bod', 'bowt'] for sw in spoken_words)) or
                    (tw == 'great' and any(sw in ['gret', 'get'] for sw in spoken_words)) or
                    (tw == 'note' and any(sw in ['not', 'nut'] for sw in spoken_words)) or
                    (tw == 'feet' and any(sw in ['fit', 'foot'] for sw in spoken_words)) or
                    (tw == 'fit' and any(sw in ['feet'] for sw in spoken_words)) or
                    (tw == 'seat' and any(sw in ['sit', 'set'] for sw in spoken_words)) or
                    (tw == 'sit' and any(sw in ['seat'] for sw in spoken_words))
                ):
                    detected.append(self._build_pattern_entry("VOWEL_LENGTH_CONFUSION", tw, 'kek/bot'))

            # 9. Initial H Dropping (e.g. target: 'house', spoken: 'ouse')
            if tw in ['house', 'happy', 'hello', 'hand', 'hot', 'hat', 'hear', 'help'] or tw.startswith('h'):
                if any(
                    sw in ['ouse', 'ause', 'our', 'hour', 'appy', 'api', 'ello', 'elo', 'and', 'end', 'ot', 'ought', 'art', 'out', 'at', 'act', 'ear', 'air', 'elp', 'alp', 'aut', 'aot'] or
                    (tw.startswith('h') and sw == tw[1:]) or
                    (tw == 'hot' and sw in ['ot', 'ought', 'art', 'out', 'aat', 'aut']) or
                    (tw == 'hand' and sw in ['and', 'end', 'ant'])
                    for sw in spoken_words
                ):
                    detected.append(self._build_pattern_entry("INITIAL_H_DELETION", tw, tw[1:]))

            # 10. Z/S Confusion (e.g. target: 'zoo', spoken: 'soo')
            if tw in ['zoo', 'busy', 'please', 'zero', 'zebra', 'music', 'noise', 'rose'] or tw.startswith('z'):
                is_zoo = (tw == 'zoo')
                if any(
                    sw in ['soo', 'sue', 'so', 'su', 'sew', 'sow', 'sou', 'bissy', 'bisi', 'pleas', 'police', 'sero', 'siro', 'sebra', 'mewsic', 'mousic', 'noiss', 'nice', 'ross', 'rows'] or
                    (is_zoo and sw in ['so', 'su', 'soo', 'sue', 'sew', 'sow', 'sou', 'soon', 'siu']) or
                    (tw.startswith('z') and sw == 's' + tw[1:])
                    for sw in spoken_words
                ):
                    detected.append(self._build_pattern_entry("Z_S_CONFUSION", tw, 'soo' if is_zoo else 's' + tw[1:]))

            # 11. Back Vowel Confusion (e.g. target: 'hall', spoken: 'hol')
            if tw in ['hall', 'cup', 'ball', 'call', 'walk', 'tall']:
                if any(sw in ['hol', 'hole', 'hull', 'cap', 'cop', 'bol', 'bowl', 'col', 'coal', 'wok', 'woke', 'tol', 'toll'] for sw in spoken_words):
                    detected.append(self._build_pattern_entry("BACK_VOWEL_CONFUSION", tw, 'hol/cap'))

        # Deduplicate
        seen = set()
        unique_detected = []
        for d in detected:
            if d["key"] not in seen:
                seen.add(d["key"])
                unique_detected.append(d)

        return unique_detected

    def _build_pattern_entry(self, key: str, target_word: str, heard_variant: str) -> Dict[str, Any]:
        info = MTI_MAP.get(key, {})
        return {
            "id": info.get("id", 0),
            "key": key,
            "name": info.get("name", key),
            "name_si": info.get("name_si", ""),
            "target_ipa": info.get("target_ipa", ""),
            "error_ipa": info.get("error_ipa", ""),
            "target_word": target_word,
            "heard_variant": heard_variant,
            "pedagogical_tip": info.get("pedagogical_tip", ""),
            "pedagogical_tip_si": info.get("pedagogical_tip_si", "")
        }

    def evaluate(self, y: np.ndarray, target_word: str, visual_closure: bool = False, visual_rounding: bool = False) -> Dict[str, Any]:
        """Acoustic-signal level MTI pattern evaluation."""
        target = target_word.strip().lower()
        expected_phones = get_phonemes_for_word(target)
        
        peak = float(np.max(np.abs(y))) if len(y) > 0 else 0.0
        if peak < 0.005:
            alignment = {"expected_phones": expected_phones, "heard_phones": [], "phoneme_accuracy": 0.0, "errors": []}
            return {
                "target_word": target,
                "has_mti_patterns": False,
                "detected_patterns": [],
                "primary_mti_flag": None,
                "phoneme_alignment": alignment,
                "phoneme_accuracy": 0.0
            }
            
        y_norm = (y / peak) * 0.90
        y_trim = librosa.effects.trim(y_norm, top_db=20)[0]
        
        zcr = librosa.feature.zero_crossing_rate(y_trim)[0]
        cent = librosa.feature.spectral_centroid(y=y_trim, sr=self.sr)[0]
        
        detected_patterns = []
        heard_phones = list(expected_phones)

        # 1. S_CLUSTER_PROSTHESIS
        if target.startswith("s") and len(target) > 2 and target[1] in ["c", "k", "p", "t", "m", "n"]:
            onset_frames = min(5, len(cent))
            onset_cent = float(np.mean(cent[:onset_frames]))
            onset_zcr = float(np.mean(zcr[:onset_frames]))
            if onset_cent < 2500.0 or onset_zcr < 0.20:
                detected_patterns.append(self._build_pattern_entry("S_CLUSTER_PROSTHESIS", target, "is-" + target))
                heard_phones.insert(0, "ɪ")

        # 2. F_P_SUBSTITUTION
        if "f" in target:
            if visual_closure:
                detected_patterns.append(self._build_pattern_entry("F_P_SUBSTITUTION", target, target.replace("f", "p")))
                heard_phones = ["p" if p == "f" else p for p in heard_phones]

        # 3. V_W_MERGER
        if target.startswith("w") and visual_closure and not visual_rounding:
            detected_patterns.append(self._build_pattern_entry("V_W_MERGER", target, "v" + target[1:]))
            heard_phones = ["v" if p == "w" else p for p in heard_phones]

        alignment = align_phoneme_sequences(expected_phones, heard_phones)
        
        return {
            "target_word": target,
            "has_mti_patterns": len(detected_patterns) > 0,
            "detected_patterns": detected_patterns,
            "primary_mti_flag": detected_patterns[0]["name"] if detected_patterns else None,
            "phoneme_alignment": alignment,
            "phoneme_accuracy": alignment["phoneme_accuracy"]
        }

sri_lankan_mti_engine = SriLankanMTIRuleEngine()
