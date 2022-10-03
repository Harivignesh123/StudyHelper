if(document.addEventListener){
    document.addEventListener("DOMContentLoaded",function(){
        speechSynthesis.getVoices();
    },false);    
}
else{
    document.attachEvent("onDOMContentLoaded",function(){
        speechSynthesis.getVoices();
    });
}

function getVoices() {
    return speechSynthesis.getVoices();
}
function textToSpeak(content){
    const voice=getVoices();
    speak(content,voice[2]);
}

function speak(t1,v1){
    let utterence= new SpeechSynthesisUtterance();
    utterence.voice=v1;
    utterence.text=t1;
    speechSynthesis.speak(utterence);
    
}

export{textToSpeak};