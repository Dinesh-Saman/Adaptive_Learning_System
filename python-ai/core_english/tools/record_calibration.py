import os
import time
import sounddevice as sd
import soundfile as sf
import numpy as np

# Folder to save your recordings
SAVE_DIR = "human_calibration_voices"
os.makedirs(SAVE_DIR, exist_ok=True)

# Configuration for recording
SAMPLE_RATE = 16000
DURATION = 3.0  # seconds per recording

# The list of words to record (word, type, what_to_say, explanation)
RECORDING_PLAN = [
    ("film", "correct", "film", "Say 'film' normally with a clear 'F' sound"),
    ("film", "wrong", "pilm", "Say 'pilm' with a hard 'P' sound"),
    ("space", "correct", "space", "Say 'space' starting directly with the 'sss' sound"),
    ("space", "wrong", "is-space", "Say 'is-space' adding an 'is' at the beginning"),
    ("welcome", "correct", "welcome", "Say 'welcome' with rounded lips like 'W'"),
    ("welcome", "wrong", "velcome", "Say 'velcome' biting your lower lip like 'V'"),
    ("bus", "correct", "bus", "Say 'bus' ending sharply with 'S'"),
    ("bus", "wrong", "busa", "Say 'busa' adding an extra 'a' sound at the end"),
]

def select_microphone():
    print("="*60)
    print(" 🎤 DETECTING MICROPHONES...")
    print("="*60)
    devices = sd.query_devices()
    input_devices = []
    
    for i, dev in enumerate(devices):
        if dev['max_input_channels'] > 0:
            input_devices.append((i, dev))
            print(f"[{i}] {dev['name']}")
            
    if not input_devices:
        print("❌ CRITICAL ERROR: No microphones found on this system!")
        sys.exit(1)
        
    print("\nIf you are getting 'Peak: 0.0000', your default microphone is likely wrong.")
    try:
        choice = input("Enter the number of the microphone you want to use (or press ENTER for default): ")
        if choice.strip() == "":
            return None
        return int(choice)
    except:
        return None

def record_audio(filename, duration, fs, device_id):
    """Records audio from the selected microphone."""
    print(f"\n🔴 RECORDING NOW ({int(duration)} seconds)... SPEAK!")
    # Record audio
    recording = sd.rec(int(duration * fs), samplerate=fs, channels=1, dtype='float32', device=device_id)
    sd.wait()  # Wait until recording is finished
    print("⏹️ RECORDING STOPPED.")
    
    # Save as WAV file
    sf.write(filename, recording, fs)
    
    # Check volume to ensure mic is working
    peak_volume = np.max(np.abs(recording))
    if peak_volume < 0.01:
        print(f"⚠️ WARNING: The audio is very quiet (Peak: {peak_volume:.4f}).")
        print("   -> Check if your mic is muted or if Windows Privacy settings are blocking Python.")
    else:
        print(f"✅ Saved perfectly! (Peak volume: {peak_volume:.2f})")

def main():
    import sys
    device_id = select_microphone()
    
    print("\n" + "="*60)
    print(" 🎙️  SRI LANKAN MTI - HUMAN VOICE CALIBRATION RECORDER")
    print("="*60)
    print(f"All recordings will be saved to the '{SAVE_DIR}' folder.")
    print("You will be prompted to speak 8 times (3 seconds each).")
    print("Press ENTER when you are ready to begin...")
    input()
    
    for word, type_label, text_to_say, explanation in RECORDING_PLAN:
        print("-" * 60)
        print(f"TASK: [{word.upper()}] - {type_label.upper()} PRONUNCIATION")
        print(f"💡 Instruction: {explanation}")
        print(f"👉 Please say: \"{text_to_say}\"")
        
        while True:
            ready = input("Press ENTER to start recording (or type 'q' to quit): ")
            if ready.lower() == 'q':
                print("Exiting...")
                return
                
            filename = os.path.join(SAVE_DIR, f"{word}_{type_label}.wav")
            record_audio(filename, DURATION, SAMPLE_RATE, device_id)
            
            retry = input("\nPress ENTER to accept and continue, or type 'r' to re-record this word: ")
            if retry.lower() != 'r':
                break
                
    print("="*60)
    print("🎉 ALL DONE! Thank you.")
    print(f"Please notify the AI that your recordings are ready in: D:\\Kids\\python-ai\\{SAVE_DIR}")
    print("="*60)

if __name__ == "__main__":
    main()
