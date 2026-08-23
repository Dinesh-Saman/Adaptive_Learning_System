import random

def evaluate_motor_skills(frames_data: list):
    """
    Evaluates gross motor skills (jumping, balancing) based on a sequence of frames.
    In a real app, MediaPipe Pose would extract 3D coordinates from each frame here.
    For this prototype, we will simulate a heuristic engine that evaluates "stability".
    """
    if not frames_data:
        return {
            "score": 0,
            "status": "Failed",
            "feedback": "No video data received."
        }
        
    # Simulate extraction of stability metric
    # Let's say a high variance in Center of Mass (COM) while balancing is bad.
    # We will just generate a mock stability score between 40 and 95.
    
    stability_score = random.randint(40, 95)
    
    if stability_score > 80:
        status = "Excellent"
        feedback = "Great balance and coordination! Keep your core tight."
    elif stability_score > 60:
        status = "Good"
        feedback = "Good effort, but you are wobbling a bit. Try focusing your eyes on a single spot."
    else:
        status = "Needs Improvement"
        feedback = "You lost your balance quickly. Try keeping your arms out wide like airplane wings."
        
    return {
        "score": stability_score,
        "status": status,
        "feedback": feedback
    }
