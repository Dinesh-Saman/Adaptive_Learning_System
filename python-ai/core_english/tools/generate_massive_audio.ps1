Add-Type -AssemblyName System.Speech
$synth = New-Object System.Speech.Synthesis.SpeechSynthesizer
$voices = $synth.GetInstalledVoices() | Where-Object { $_.Enabled }

$categories = @(
    @{ Class=0; Words=@("school","very","three","fan","bus","friend","cake","house","zoo","computer","water","think","food","good","happy","student","village","thick","family","cat") },
    @{ Class=1; Words=@("ischool","ispoon","istation","istudy","istudent","ismile","ispeak","istop","isky","isport") },
    @{ Class=2; Words=@("wery","wan","walley","wisit","wowel","wiew","wideo","willage","woice","wote") },
    @{ Class=3; Words=@("tree","tink","dis","dat","tursday","tin","ting","tumb","tank","tought") },
    @{ Class=4; Words=@("pan","pilm","pood","pone","pish","pamily","pact","pive","pour","poot") },
    @{ Class=5; Words=@("busa","milka","booka","gooda","cata","doga","beda","cupa","baga","mana") },
    @{ Class=6; Words=@("buh","goo","tha","wha","ol","frien","ca","ba","ho","col") },
    @{ Class=7; Words=@("nex","fren","stam","tex","fac","des","tes","ac","lef","pos") },
    @{ Class=8; Words=@("kek","bot","gret","not","mak","tak","lat","saf","gam","nam") },
    @{ Class=9; Words=@("ouse","appy","ello","at","and","igh","elp","old","ear","eart") },
    @{ Class=10; Words=@("soo","bisy","pleas","eesy","sero","sise","sone","sip","soom","sest") },
    @{ Class=11; Words=@("hol","hut","cap","bas","bol","nat","kat","pat","tap","map") },
    @{ Class=12; Words=@("com-pu-ter","ba-na-na","to-mor-row","po-ta-to","to-ma-to","um-brel-la","e-le-phant","im-por-tant","un-der-stand","to-ge-ther") }
)

$outputDir = "d:\Kids\python-ai\training_data_massive"
New-Item -ItemType Directory -Force -Path $outputDir | Out-Null

$count = 0
foreach ($cat in $categories) {
    foreach ($word in $cat.Words) {
        foreach ($voice in $voices) {
            $synth.SelectVoice($voice.VoiceInfo.Name)
            foreach ($rate in @(-4, -1, 2, 5)) {
                $synth.Rate = $rate
                $filename = "$outputDir\class_$($cat.Class)_$count.wav"
                $synth.SetOutputToWaveFile($filename)
                $synth.Speak($word)
                $count++
            }
        }
    }
}
$synth.Dispose()
Write-Output "Successfully generated $count diverse audio files across multiple speeds and voices."
