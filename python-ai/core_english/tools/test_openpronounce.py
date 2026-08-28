from openpronounce import load_audio, compare_audio_with_text
import os

espeak_dll = r"C:\Program Files\eSpeak NG\libespeak-ng.dll"
if os.path.exists(espeak_dll):
    os.environ["PHONEMIZER_ESPEAK_LIBRARY"] = espeak_dll
    
os.environ["HF_HOME"] = r"D:\Kids\huggingface_cache"

test_audio = "human_calibration_voices/film_correct.wav"

if os.path.exists(test_audio):
    sound = load_audio(test_audio)
    result = compare_audio_with_text(sound, "film")

    print("Score:", result["score"])
    print("Expected Phones:", result["differences"]["expected_phones"])
    print("Heard Phones:", result["differences"]["heard_phones"])
    print("Mispronounced words:")
    for err in result["differences"]["errors"]:
        print(err["word"], err["expected"], "->", err["actual"] or "(missing)", err["confidence"])
else:
    print("Test file not found.")
