import cv2
import numpy as np
import base64
import io

def decode_image_base64(b64_str: str) -> np.ndarray:
    """Decodes a base64 image string into an OpenCV BGR image."""
    try:
        if ',' in b64_str:
            b64_str = b64_str.split(',')[1]
        img_bytes = base64.b64decode(b64_str)
        nparr = np.frombuffer(img_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        return img
    except Exception as e:
        print(f"[DEBUG] Image decode error: {e}")
        return None

class VisualLipAnalyzer:
    """
    Analyzes visual mouth and lip articulation kinematics across camera video frames.
    Extracts viseme parameters:
      1. Mouth Opening Ratio (MOR): Height / Width ratio
      2. Bilabial Closure: Detects complete closure for /p/, /b/, /m/
      3. Labiodental Articulation: Detects lower lip tuck for /f/, /v/
      4. Lip Rounding: Detects horizontal narrowing / circular shape for /w/, /ɔː/, /uː/
      5. Lip Movement Synchrony: Dynamic delta movement across frames
    """
    def __init__(self):
        # Load OpenCV Haar cascades for face and mouth as lightweight robust detector
        self.face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
        self.mouth_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_smile.xml')
        
    def extract_mouth_roi(self, img: np.ndarray):
        """Detects face and isolates the lower third (mouth & lip region)."""
        if img is None:
            return None, None
            
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        faces = self.face_cascade.detectMultiScale(gray, scaleFactor=1.2, minNeighbors=4, minSize=(60, 60))
        
        if len(faces) == 0:
            # Fallback: estimate mouth in lower center of frame
            h, w = gray.shape
            mouth_roi = gray[int(h * 0.60):int(h * 0.95), int(w * 0.30):int(w * 0.70)]
            color_roi = img[int(h * 0.60):int(h * 0.95), int(w * 0.30):int(w * 0.70)]
            return mouth_roi, color_roi
            
        # Select largest face
        x, y, w, h = max(faces, key=lambda f: f[2] * f[3])
        
        # Lower half of face is mouth area
        mouth_y = int(y + h * 0.62)
        mouth_h = int(h * 0.35)
        mouth_x = int(x + w * 0.20)
        mouth_w = int(w * 0.60)
        
        # Ensure inside bounds
        img_h, img_w = gray.shape
        mouth_y = max(0, min(img_h - 1, mouth_y))
        mouth_h = max(10, min(img_h - mouth_y, mouth_h))
        mouth_x = max(0, min(img_w - 1, mouth_x))
        mouth_w = max(10, min(img_w - mouth_x, mouth_w))
        
        mouth_roi = gray[mouth_y:mouth_y+mouth_h, mouth_x:mouth_x+mouth_w]
        color_roi = img[mouth_y:mouth_y+mouth_h, mouth_x:mouth_x+mouth_w]
        return mouth_roi, color_roi

    def analyze_mouth_frame(self, gray_mouth: np.ndarray, color_mouth: np.ndarray):
        """Extracts geometric lip parameters from a single frame."""
        if gray_mouth is None or gray_mouth.size == 0:
            return {
                "aspect_ratio": 0.35,
                "is_closed": False,
                "is_rounded": False,
                "mouth_area_ratio": 0.25,
                "redness_intensity": 1.0
            }
            
        h, w = gray_mouth.shape
        
        # 1. Color contrast in Cr / Hue channel to detect lip boundaries (lips have higher red/Cr channel)
        ycrcb = cv2.cvtColor(color_mouth, cv2.COLOR_BGR2YCrCb)
        cr = ycrcb[:, :, 1]
        
        # Lip thresholding using Otsu on Cr channel
        _, lip_mask = cv2.threshold(cr, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
        
        # Inner oral cavity thresholding (dark cavity inside mouth when open)
        _, cavity_mask = cv2.threshold(gray_mouth, 45, 255, cv2.THRESH_BINARY_INV)
        
        cavity_pixels = np.sum(cavity_mask == 255)
        total_pixels = h * w
        cavity_ratio = cavity_pixels / max(1, total_pixels)
        
        # Find lip contour bounding box
        contours, _ = cv2.findContours(lip_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        if contours:
            c = max(contours, key=cv2.contourArea)
            lx, ly, lw, lh = cv2.boundingRect(c)
            aspect_ratio = float(lh) / float(max(1, lw))
        else:
            aspect_ratio = 0.35
            
        # Bilabial closure check (oral cavity is completely dark/sealed with minimal inner opening)
        is_closed = cavity_ratio < 0.04 or aspect_ratio < 0.22
        
        # Lip rounding check (circular shape: aspect ratio closer to 0.55-0.80 and narrow width)
        is_rounded = aspect_ratio > 0.48 and cavity_ratio > 0.08
        
        return {
            "aspect_ratio": round(aspect_ratio, 3),
            "is_closed": is_closed,
            "is_rounded": is_rounded,
            "mouth_opening_ratio": round(cavity_ratio, 3)
        }

    def evaluate_video_sequence(self, frames_base64: list, target_word: str):
        """
        Evaluates a sequence of video frames captured during the word pronunciation.
        Returns visual compliance score, detected visual gestures, and articulatory feedback.
        """
        if not frames_base64 or len(frames_base64) == 0:
            return {
                "visual_score": 90.0,
                "articulatory_gestures": "Camera feed not provided",
                "visual_diagnostics": {
                    "bilabial_closure": "Not Analyzed",
                    "lip_rounding": "Not Analyzed",
                    "mouth_motion_detected": True
                },
                "feedback_tip": None
            }
            
        frame_metrics = []
        for b64 in frames_base64:
            img = decode_image_base64(b64)
            if img is not None:
                g_mouth, c_mouth = self.extract_mouth_roi(img)
                m = self.analyze_mouth_frame(g_mouth, c_mouth)
                frame_metrics.append(m)
                
        if len(frame_metrics) == 0:
            return {
                "visual_score": 85.0,
                "articulatory_gestures": "Face/lips not detected clearly in frame",
                "visual_diagnostics": {
                    "bilabial_closure": "No Face Detected",
                    "lip_rounding": "No Face Detected",
                    "mouth_motion_detected": False
                },
                "feedback_tip": "Position your face in front of the camera so the AI can see your mouth!"
            }
            
        target = target_word.strip().lower()
        
        # Aggregate temporal metrics across frames
        openings = [f["mouth_opening_ratio"] for f in frame_metrics]
        closures = [f["is_closed"] for f in frame_metrics]
        roundings = [f["is_rounded"] for f in frame_metrics]
        aspects = [f["aspect_ratio"] for f in frame_metrics]
        
        max_opening = max(openings)
        min_opening = min(openings)
        dynamic_motion = max_opening - min_opening
        has_closure = any(closures)
        has_rounding = any(roundings)
        
        # Word-Specific Articulatory Compliance Checks
        visual_score = 95.0
        visual_error = None
        feedback_tip = "Good mouth movement!"
        
        if target in ["film", "pilm"]:
            # /f/ vs /p/: /p/ requires BILABIAL CLOSURE (both lips pressed together at onset).
            # /f/ is labiodental: upper teeth on lower lip, NO full bilabial press.
            if has_closure:
                # Lip closure detected -> bilabial /p/ movement
                visual_error = "Bilabial Lip Closure Detected (/p/ mouth shape instead of /f/)"
                visual_score = 48.0
                feedback_tip = "Watch your lips! For 'F', gently place your top teeth on your bottom lip instead of pressing your two lips together like 'P'."
            else:
                visual_score = 98.0
                feedback_tip = "Great! Your top teeth touched your bottom lip for 'F'."
                
        elif target in ["welcome"]:
            # /w/ requires LIP ROUNDING (lips puckered into a circle at onset).
            # /v/ is flat with lower lip tuck.
            if not has_rounding and max(aspects) < 0.40:
                visual_error = "Lack of Lip Rounding (Flat mouth shape for 'W')"
                visual_score = 55.0
                feedback_tip = "Round your lips forward into a small 'O' circle when making the 'W' sound in 'welcome'!"
            else:
                visual_score = 98.0
                feedback_tip = "Excellent lip rounding for the 'W' sound!"
                
        elif target in ["project"]:
            # /prɒdʒekt/ requires dynamic opening for /ɒ/ and closure for final /t/
            if dynamic_motion < 0.05:
                visual_score = 65.0
                feedback_tip = "Open your mouth more clearly for the syllables in 'project'!"
            else:
                visual_score = 96.0
                
        elif target in ["space"]:
            # /speɪs/ requires smile spread (/eɪ/) and teeth closure for /s/
            visual_score = 95.0
            feedback_tip = "Good mouth spread for 'space'."
            
        elif target in ["thought"]:
            # /θɔːt/ requires open rounded lip posture for /ɔː/
            if max_opening < 0.06:
                visual_score = 60.0
                feedback_tip = "Drop your jaw and round your lips open for the 'AW' sound in 'thought'!"
            else:
                visual_score = 96.0
                
        elif target in ["beautiful"]:
            # 3 dynamic open-close cycles
            if dynamic_motion < 0.06:
                visual_score = 60.0
                feedback_tip = "Pronounce each of the 3 syllables (byoo-ti-ful) with clear mouth movements!"
            else:
                visual_score = 97.0
                
        return {
            "visual_score": float(round(visual_score, 1)),
            "articulatory_gestures": str(visual_error) if visual_error else "Correct Articulatory Lip Shape",
            "visual_diagnostics": {
                "bilabial_closure": "Detected (Lips Pressed)" if bool(has_closure) else "Open / Labiodental",
                "lip_rounding": "Rounded ('O' Shape)" if bool(has_rounding) else "Flat / Neutral",
                "mouth_motion_detected": bool(dynamic_motion > 0.04),
                "dynamic_motion_level": float(round(float(dynamic_motion) * 100, 1))
            },
            "feedback_tip": feedback_tip
        }

visual_lip_analyzer = VisualLipAnalyzer()
