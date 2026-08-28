import os
import glob
import base64
import requests
import json
import time

def test_api():
    folder = "."
    files = glob.glob(os.path.join(folder, "*.wav"))
    files.sort()
    
    url = "http://localhost:5000/api/english/assess"
    
    success_count = 0
    total_tests = len(files)
    
    for filepath in files:
        filename = os.path.basename(filepath)
        
        # Parse expected results from filename
        # Format: 1_Correct_friend.wav OR 2_Wrong_busy_ZSConfusion.wav
        parts = filename.replace(".wav", "").split('_')
        test_type = parts[1] # "Correct" or "Wrong"
        target_text = parts[2]
        
        with open(filepath, "rb") as f:
            encoded_audio = base64.b64encode(f.read()).decode('utf-8')
            
        payload = {
            "studentId": "automation_test",
            "audioBase64": encoded_audio,
            "targetText": target_text
        }
        
        try:
            response = requests.post(url, json=payload)
            if response.status_code == 200:
                result = response.json()
                score = result.get("overall_score", 0)
                mti_flag = result.get("l1_contrast_flag")
                
                print(f"File: {filename:35} | Score: {score:5.1f} | Flag: {str(mti_flag):30}")
                
                # Validation Logic
                if test_type == "Correct":
                    if score >= 80 and not mti_flag:
                        print("  [PASS] Correctly identified as perfect.")
                        success_count += 1
                    else:
                        print("  [FAIL] Should have been perfect.")
                else:
                    if score < 80 and mti_flag:
                        print(f"  [PASS] Correctly flagged MTI: {mti_flag}")
                        success_count += 1
                    else:
                        print("  [FAIL] Did not correctly flag MTI.")
            else:
                print(f"File: {filename} | HTTP Error {response.status_code}")
                
        except Exception as e:
            print(f"Request failed for {filename}: {e}")
            
    print(f"\n--- TEST SUMMARY: {success_count}/{total_tests} PASSED ---")

if __name__ == "__main__":
    test_api()
