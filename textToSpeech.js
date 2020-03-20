
var ids = [], i, k, flag = 1, prevTime = -1, currentTime = -1, messages, msg, synth = window.speechSynthesis, curMessages = getMessages(), prevInd = -1, curInd = -1;

$(document).ready(function () {
    for (i = 0; i < curMessages.length; i++) {
        $("#" + curMessages[i].elementId).hide();
    }
    // console.log($("#current_value").text());
});

var video = videojs('#myVideo');
video.on('play', function () {

    if (flag) {
        synth.cancel(); /* Cancelling synth initially if there is anything saved in cache from previous run */        
    }
    if (synth.paused && flag == 0)
        synth.resume();
    else{
        flag = 0;
        speakText(0);
    }
});

video.on('pause', function () {
    synth.pause();
});

video.on('ended', function () {
    flag = 1;
    $('#myVideo').hide();
});

video.on('timeupdate', function () {
    var currentTime = video.currentTime();
    curInd = getCurrentIndex(currentTime);
    updateText(currentTime);
    //  console.log("changed " + prevTime + " " + currentTime + " " + curInd);
    if (prevTime != -1 && ((currentTime - prevTime > 1) || (prevTime - currentTime > 1))) {
        synth.cancel();
        messages = "";
        updateText(curInd);
        if (curInd < curMessages.length && curInd >= 0)
            speakText(curInd - 1);
        //   console.log("changed " + prevTime + " " + currentTime + " " + curInd);
    }
    prevTime = currentTime;
    prevInd = curInd;
});

function updateText(currentTime) {
    for (i = 0; i < curMessages.length; i++) {
        if (curMessages[i].showTime <= currentTime && curMessages[i].hideTime >= currentTime) {
            //   console.log("show " + curMessages[i].elementId)
            $("#" + curMessages[i].elementId).show();
        }
        else {
            //    console.log("hide " + curMessages[i].elementId)
            $("#" + curMessages[i].elementId).hide();
        }
    }
}
function speakText(curInd) {
    for (i = curInd; i < curMessages.length; i++)
        if (curMessages[i] != undefined)
            changeTextToSpeech(curMessages[i]);
}

function getMessages() {
    var messagesStruct = [
        {
            "elementId": "intro",
            "preMessageText": "",
            "postMessageText": "",
            "animation": "",
            "showTime": 0.2,
            "hideTime": 3.8,
            "speakTime": 0.2
        },
        {
            "elementId": "salutation",
            "preMessageText": "",
            "postMessageText": "",
            "animation": "",
            "showTime": 4,
            "hideTime": 6,
            "speakTime": 3.8
        }
    ]
    return messagesStruct;
}

function getCurrentIndex(currentTime) {
    if (currentTime < curMessages[0].showTime)
        return -1;
    for (i = 0; i < curMessages.length; i++) {
        if (curMessages[i].speakTime > currentTime)
            return i;
    }
    return curMessages.length;
}
function changeTextToSpeech(message) {
    var currentElementId = "#" + message.elementId;
    var text = setMessageText(message, currentElementId);
    var msg = new SpeechSynthesisUtterance();
    msg.text = text;
    // console.log(text);
    if (msg.text != 'undefined')
        synth.speak(msg);
}

function setMessageText(message, currentElementId) {

    var msgText = message.preMessageText;
    $(".overlay").children().map(function () {
        var current_class = (('.' + $(this).attr('class')));
        //   console.log(current_class);
        $(current_class).children().map(function () {
            if (('#' + $(this).attr('id')) == currentElementId) {
                //           console.log(('#' + $(this).attr('id')));
                msgText += $(currentElementId).text();
            }
        });
    });
    //   console.log(msgText);
    msgText += " " + message.postMessageText;
    return msgText.replace(/(\r\n|\n|\r)/gm, "");
}