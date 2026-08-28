import os, json, base64, sys
from main import analyze_pronunciation, SpeechAudioData

with open('synthetic_curriculum_audio/curriculum_manifest.json', 'r', encoding='utf-8') as f_in:
    manifest = json.load(f_in)

print('=' * 80)
print('EVALUATING ALL ' + str(len(manifest)) + ' CURRICULUM QUESTIONS (RIGHT & WRONG RECORDINGS)')
print('=' * 80 + '\n')

right_passes = 0
wrong_passes = 0
total_items = len(manifest)
failed_items = []

for item in manifest:
    item_id = item['id']
    target = item['target_text']
    expected_pattern = item['expected_pattern']
    
    # 1. Test RIGHT audio
    with open(item['right_path'], 'rb') as af:
        b64_right = base64.b64encode(af.read()).decode('utf-8')
    data_right = SpeechAudioData(student_id='eval_right', audio_base64=b64_right, target_text=target, video_frames_base64=[])
    res_right = analyze_pronunciation(data_right)
    
    right_mti = [p.get('pattern_name') for p in res_right.get('mti_patterns', [])]
    pron_right = res_right.get('diagnostics', {}).get('pronunciation', 0)
    score_right = res_right.get('overall_score', 0)
    
    right_ok = (len(right_mti) == 0 and pron_right >= 80.0)
    if right_ok:
        right_passes += 1
        print('[PASS RIGHT] ' + item_id.ljust(12) + ' | Target: ' + target.ljust(35) + ' | Score: ' + str(score_right) + '% | Pron: ' + str(pron_right) + '% | MTI: None')
    else:
        failed_items.append({'id': item_id, 'type': 'RIGHT_FAIL', 'target': target, 'mti': right_mti, 'score': score_right})
        print('[FAIL RIGHT] ' + item_id.ljust(12) + ' | Target: ' + target.ljust(35) + ' | Score: ' + str(score_right) + '% | False MTI: ' + str(right_mti))
        
    # 2. Test WRONG audio
    with open(item['wrong_path'], 'rb') as af:
        b64_wrong = base64.b64encode(af.read()).decode('utf-8')
    data_wrong = SpeechAudioData(student_id='eval_wrong', audio_base64=b64_wrong, target_text=target, video_frames_base64=[])
    res_wrong = analyze_pronunciation(data_wrong)
    
    wrong_mti = [p.get('pattern_name') for p in res_wrong.get('mti_patterns', [])]
    pron_wrong = res_wrong.get('diagnostics', {}).get('pronunciation', 100)
    score_wrong = res_wrong.get('overall_score', 0)
    
    wrong_ok = (len(wrong_mti) > 0 or pron_wrong < 100.0)
    if wrong_ok:
        wrong_passes += 1
        print('[PASS WRONG] ' + item_id.ljust(12) + ' | Spoke:  ' + item['wrong_spoken'].ljust(35) + ' | Caught MTI: ' + str(wrong_mti) + ' | Pron: ' + str(pron_wrong) + '%')
    else:
        failed_items.append({'id': item_id, 'type': 'WRONG_FAIL', 'spoken': item['wrong_spoken'], 'target': target})
        print('[FAIL WRONG] ' + item_id.ljust(12) + ' | Spoke:  ' + item['wrong_spoken'].ljust(35) + ' | Missed MTI, got 100% Pronunciation!')
    print('-' * 80)

print('\n' + '=' * 80)
print('SUMMARY: RIGHT Pronunciations: ' + str(right_passes) + '/' + str(total_items) + ' Passed | WRONG Pronunciations: ' + str(wrong_passes) + '/' + str(total_items) + ' Caught')
print('=' * 80)

if failed_items:
    print('\nFAILED ITEMS DETAIL:')
    for f_item in failed_items:
        print(f_item)
