Add-Type -AssemblyName System.Speech
$synth = New-Object System.Speech.Synthesis.SpeechSynthesizer

$words = @(
    @{Correct="friend"; Wrong="frien"; Category="FinalConsonantWeakening"},
    @{Correct="project"; Wrong="projek"; Category="ClusterSimplification"},
    @{Correct="busy"; Wrong="bisy"; Category="ZSConfusion"},
    @{Correct="space"; Wrong="ispace"; Category="SClusterProsthesis"},
    @{Correct="film"; Wrong="pilm"; Category="FPSubstitution"},
    @{Correct="welcome"; Wrong="velcome"; Category="VWMerger"},
    @{Correct="house"; Wrong="ouse"; Category="HDropping"},
    @{Correct="bus"; Wrong="busa"; Category="Paragoge"},
    @{Correct="these"; Wrong="dees"; Category="THSubstitution"},
    @{Correct="thought"; Wrong="thot"; Category="BackVowel"}
)

$outputDir = "d:\Kids\test_paper_1_audio"

foreach ($item in $words) {
    # Generate Correct
    $correctFile = "$outputDir\1_Correct_$($item.Correct).wav"
    $synth.SetOutputToWaveFile($correctFile)
    $synth.Speak($item.Correct)
    
    # Generate Wrong
    $wrongFile = "$outputDir\2_Wrong_$($item.Correct)_$($item.Category).wav"
    $synth.SetOutputToWaveFile($wrongFile)
    $synth.Speak($item.Wrong)
}

$synth.Dispose()
Write-Output "Successfully generated 20 audio files for Test Paper 1."
