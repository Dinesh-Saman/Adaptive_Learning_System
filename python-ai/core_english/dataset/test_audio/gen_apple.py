import subprocess, os

out_path = r"D:\Kids\test_paper_1_audio\apple_sample.wav"

ps_script = f'''
Add-Type -AssemblyName System.Speech
$synth = New-Object System.Speech.Synthesis.SpeechSynthesizer
$synth.Rate = 0
$synth.Volume = 100
$synth.SetOutputToWaveFile("{out_path.replace(chr(92), '/')}")
$synth.Speak("apple")
$synth.SetOutputToDefaultAudioDevice()
'''
subprocess.run(["powershell", "-Command", ps_script], capture_output=True, text=True)
print("Generated apple_sample.wav")
