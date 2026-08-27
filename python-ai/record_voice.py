import os
import sys
import time
import sounddevice as sd
import soundfile as sf
import numpy as np

# Audio Recording Configuration
SR = 16000          # 16 kHz Sample Rate
DURATION = 2.0      # 2 seconds per word
OUT_DIR = r"D:\Kids\test_paper_1_audio"
os.makedirs(OUT_DIR, exist_ok=True)

def find_best_input_device():
    devices = sd.query_devices()
    # 1. Prefer real hardware Realtek Microphone Array
    for idx, dev in enumerate(devices):
        if dev['max_input_channels'] > 0 and 'microphone array' in dev['name'].lower():
            return idx, dev['name']
    # 2. Prefer any Microphone that is not Camo/Virtual
    for idx, dev in enumerate(devices):
        if dev['max_input_channels'] > 0 and 'microphone' in dev['name'].lower() and 'camo' not in dev['name'].lower():
            return idx, dev['name']
    # 3. Default input
    default_in = sd.default.device[0]
    return default_in, devices[default_in]['name']

DEV_ID, DEV_NAME = find_best_input_device()

# List of 11 Test Paper Target Words & Their MTI Patterns
PROMPTS = [
    {
        "word": "project",
        "clean_file": "1_Correct_project.wav",
        "clean_guide": "Say 'project' clearly (/ˈprɒdʒ.ekt/)",
        "wrong_file": "2_Wrong_project_ClusterSimplification.wav",
        "wrong_guide": "Say 'projec' by dropping the final 't' (/ˈprɒdʒ.ek/)"
    },
    {
        "word": "space",
        "clean_file": "1_Correct_space.wav",
        "clean_guide": "Say 'space' cleanly (/speɪs/)",
        "wrong_file": "2_Wrong_space_SClusterProsthesis.wav",
        "wrong_guide": "Say 'is-space' by adding an initial vowel (/ɪs.peɪs/)"
    },
    {
        "word": "welcome",
        "clean_file": "1_Correct_welcome.wav",
        "clean_guide": "Say 'welcome' with a clean 'W' sound (/ˈwel.kəm/)",
        "wrong_file": "2_Wrong_welcome_VWMerger.wav",
        "wrong_guide": "Say 'velcome' by swapping 'W' with 'V' (/ˈvel.kəm/)"
    },
    {
        "word": "these",
        "clean_file": "1_Correct_these.wav",
        "clean_guide": "Say 'these' with a soft 'th' (/ðiːz/)",
        "wrong_file": "2_Wrong_these_THSubstitution.wav",
        "wrong_guide": "Say 'dees' by substituting 'th' with 'd' (/diːz/)"
    },
    {
        "word": "film",
        "clean_file": "1_Correct_film.wav",
        "clean_guide": "Say 'film' with a clear 'F' sound (/fɪlm/)",
        "wrong_file": "2_Wrong_film_FPSubstitution.wav",
        "wrong_guide": "Say 'pilm' by swapping 'F' with 'P' (/pɪlm/)"
    },
    {
        "word": "bus",
        "clean_file": "1_Correct_bus.wav",
        "clean_guide": "Say 'bus' cleanly (/bʌs/)",
        "wrong_file": "2_Wrong_bus_Paragoge.wav",
        "wrong_guide": "Say 'basa' by adding an extra ending vowel (/bʌs.ə/)"
    },
    {
        "word": "friend",
        "clean_file": "1_Correct_friend.wav",
        "clean_guide": "Say 'friend' with ending 'nd' sound (/frend/)",
        "wrong_file": "2_Wrong_friend_FinalConsonantWeakening.wav",
        "wrong_guide": "Say 'fren' by dropping the final 'd' (/fren/)"
    },
    {
        "word": "busy",
        "clean_file": "1_Correct_busy.wav",
        "clean_guide": "Say 'busy' with a 'Z' buzz sound (/ˈbɪz.i/)",
        "wrong_file": "2_Wrong_busy_ZSConfusion.wav",
        "wrong_guide": "Say 'bissy' with a sharp 'S' sound (/ˈbɪs.i/)"
    },
    {
        "word": "house",
        "clean_file": "1_Correct_house.wav",
        "clean_guide": "Say 'house' with a clear 'H' breath (/haʊs/)",
        "wrong_file": "2_Wrong_house_HDropping.wav",
        "wrong_guide": "Say 'ouse' by dropping the 'H' (/aʊs/)"
    },
    {
        "word": "thought",
        "clean_file": "1_Correct_thought.wav",
        "clean_guide": "Say 'thought' with open 'AW' vowel (/θɔːt/)",
        "wrong_file": "2_Wrong_thought_BackVowel.wav",
        "wrong_guide": "Say 'thot' with a short flat vowel (/θɒt/)"
    },
    {
        "word": "beautiful",
        "clean_file": "beautiful_correct.wav",
        "clean_guide": "Say 'beautiful' with natural English stress (BYOO-tih-ful)",
        "wrong_file": "beautiful_wrong_equalstress.wav",
        "wrong_guide": "Say 'boh-YOU-tee-FOOL' with equal robotic stress on every syllable"
    }
]

def record_clip(prompt_text, filename):
    while True:
        print("\n" + "=" * 65)
        print(f"TARGET: {prompt_text}")
        print("=" * 65)
        
        for i in range(3, 0, -1):
            print(f"  Starting in {i}...", end="\r", flush=True)
            time.sleep(0.8)
            
        print("  🔴 RECORDING NOW -> SPEAK CLEARLY!                     ", flush=True)
        audio = sd.rec(int(DURATION * SR), samplerate=SR, channels=1, device=DEV_ID, dtype='float32')
        sd.wait()
        print("  ⏹️  RECORDING FINISHED!", flush=True)
        
        # Volume check
        max_amp = np.max(np.abs(audio))
        if max_amp < 0.005:
            print(f"  ❌ ERROR: Recorded pure silence (volume {max_amp:.4f}). Please speak into the mic!")
            ans = input("  Press ENTER to retry this word: ").strip()
            continue
            
        out_path = os.path.join(OUT_DIR, filename)
        sf.write(out_path, audio, SR)
        print(f"  💾 Saved ({round(max_amp*100, 1)}% mic level) -> {filename}")
        
        ans = input("  Press ENTER to accept, or type 'r' to re-record: ").strip().lower()
        if ans == 'r':
            continue
        return out_path

def main():
    print("\n" + "#" * 65)
    print("🎙️  VOICE COLLECTOR FOR AI PRONUNCIATION MODEL")
    print(f"   Using Hardware Microphone: [{DEV_NAME}]")
    print("   We will record 11 words (Clean version & MTI accent version).")
    print("   Total time: ~3 minutes.")
    print("#" * 65)
    
    input("\nPress ENTER when you are ready to begin...")
    
    for idx, item in enumerate(PROMPTS, 1):
        print(f"\n>>> WORD {idx}/{len(PROMPTS)}: '{item['word'].upper()}' <<<")
        
        # 1. Clean recording
        record_clip(f"CORRECT PRONUNCIATION: {item['clean_guide']}", item['clean_file'])
        
        # 2. Wrong/MTI recording
        record_clip(f"MTI ACCENT PRONUNCIATION: {item['wrong_guide']}", item['wrong_file'])
        
    print("\n" + "#" * 65)
    print("🎉 ALL VOICE SAMPLES RECORDED SUCCESSFULLY!")
    print("   Now starting AI Model Training on your personal voice...")
    print("#" * 65 + "\n")
    
    import train_balanced_model
    train_balanced_model.train()
    
    print("\n✅ AI Model training complete! Your voice is now the baseline.")

if __name__ == "__main__":
    main()
