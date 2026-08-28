Add-Type -AssemblyName System.Speech
$synth = New-Object System.Speech.Synthesis.SpeechSynthesizer

$data = @(
    # Class 0: Correct
    @{Class=0; Word="school"}, @{Class=0; Word="very"}, @{Class=0; Word="three"}, @{Class=0; Word="fan"}, @{Class=0; Word="bus"},
    @{Class=0; Word="friend"}, @{Class=0; Word="cake"}, @{Class=0; Word="house"}, @{Class=0; Word="zoo"}, @{Class=0; Word="computer"},
    @{Class=0; Word="water"}, @{Class=0; Word="think"}, @{Class=0; Word="food"}, @{Class=0; Word="good"}, @{Class=0; Word="happy"},
    @{Class=0; Word="student"}, @{Class=0; Word="village"}, @{Class=0; Word="thick"}, @{Class=0; Word="family"}, @{Class=0; Word="cat"},
    @{Class=0; Word="old"}, @{Class=0; Word="perfect"}, @{Class=0; Word="boat"}, @{Class=0; Word="heavy"}, @{Class=0; Word="zero"},
    
    # Class 1: S-Cluster Prosthesis
    @{Class=1; Word="ischool"}, @{Class=1; Word="ispoon"}, @{Class=1; Word="istation"}, @{Class=1; Word="istudy"}, @{Class=1; Word="istudent"},
    
    # Class 2: V/W Merger
    @{Class=2; Word="wery"}, @{Class=2; Word="wan"}, @{Class=2; Word="walley"}, @{Class=2; Word="wisit"}, @{Class=2; Word="wowel"},
    
    # Class 3: TH Substitution
    @{Class=3; Word="tree"}, @{Class=3; Word="tink"}, @{Class=3; Word="dis"}, @{Class=3; Word="dat"}, @{Class=3; Word="tursday"},
    
    # Class 4: F/P Substitution
    @{Class=4; Word="pan"}, @{Class=4; Word="pilm"}, @{Class=4; Word="pood"}, @{Class=4; Word="pone"}, @{Class=4; Word="pish"},
    
    # Class 5: Paragoge
    @{Class=5; Word="busa"}, @{Class=5; Word="milka"}, @{Class=5; Word="booka"}, @{Class=5; Word="gooda"}, @{Class=5; Word="cata"},
    
    # Class 6: Final Consonant Weakening
    @{Class=6; Word="buh"}, @{Class=6; Word="goo"}, @{Class=6; Word="tha"}, @{Class=6; Word="wha"}, @{Class=6; Word="ol"},
    
    # Class 7: Consonant Cluster Simplification
    @{Class=7; Word="nex"}, @{Class=7; Word="fren"}, @{Class=7; Word="stam"}, @{Class=7; Word="tex"}, @{Class=7; Word="fac"},
    
    # Class 8: Short/Long Vowel Confusion
    @{Class=8; Word="kek"}, @{Class=8; Word="bot"}, @{Class=8; Word="gret"}, @{Class=8; Word="not"}, @{Class=8; Word="mak"},
    
    # Class 9: Initial H Dropping
    @{Class=9; Word="ouse"}, @{Class=9; Word="appy"}, @{Class=9; Word="ello"}, @{Class=9; Word="at"}, @{Class=9; Word="and"},
    
    # Class 10: Z/S Confusion
    @{Class=10; Word="soo"}, @{Class=10; Word="bisy"}, @{Class=10; Word="pleas"}, @{Class=10; Word="eesy"}, @{Class=10; Word="sero"},
    
    # Class 11: Back Vowel Confusion
    @{Class=11; Word="hol"}, @{Class=11; Word="hut"}, @{Class=11; Word="cap"}, @{Class=11; Word="bas"}, @{Class=11; Word="bol"},
    
    # Class 12: Equal Stress (using slow staccato for TTS)
    @{Class=12; Word="com-pu-ter"}, @{Class=12; Word="ba-na-na"}, @{Class=12; Word="to-mor-row"}, @{Class=12; Word="po-ta-to"}, @{Class=12; Word="to-ma-to"}
)

$outputDir = "d:\Kids\python-ai\training_data"
$i = 0
foreach ($item in $data) {
    $word = $item.Word
    $class = $item.Class
    $filename = "$outputDir\class_$class`_$i.wav"
    $synth.SetOutputToWaveFile($filename)
    $synth.Speak($word)
    $i++
}
$synth.Dispose()
Write-Output "Generated $($data.Length) audio files."
