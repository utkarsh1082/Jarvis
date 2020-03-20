
var ids = [], i, k,flag=1, prevTime = -1, currentTime = -1, messages, msg, synth = window.speechSynthesis, curMessages = getMessages(), prevInd = -1, curInd = -1;

$(document).ready(function () {
    for (i = 0; i < curMessages.length; i++) {
        $("#" + curMessages[i].elementId).hide();
    }
    console.log($("#active_sip").text());
    synth.cancel();
    speakText(0);
});

var video = videojs('#myVideo3');

videojs('myVideo3', { controlBar: { fullscreenToggle: false } }).ready(function () {
    myPlayer = this;
    myPlayer.on("fullscreenchange", function () {
        if (myPlayer.isFullscreen()) {
            myPlayer.exitFullscreen();
        }
    });
});
video.on('play', function () {

    if (flag) {
        synth.cancel(); /* Cancelling synth initially if there is anything saved in cache from previous run */
    }
    if (synth.paused && flag == 0)
        synth.resume();
    else {
        flag = 0;
        speakText(0);
    }
});

video.on('pause', function () {
    synth.pause();
});

video.on('ended', function () {
    flag = 1;
    video3.hide();
    video4.show();
    $.getScript("populateData4.js");
    $.getScript("textToSpeech4.js");
    video4.play();
});


video.on('timeupdate', function () {
    var currentTime = video.currentTime();
    curInd = getCurrentIndex(currentTime);
    updateText(currentTime);
    // console.log("changed " + prevTime + " " + currentTime + " " + curInd);
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
               console.log("show " + curMessages[i].elementId)
            $("#" + curMessages[i].elementId).show();
        }
        else {
                console.log("hide " + curMessages[i].elementId)
            $("#" + curMessages[i].elementId).hide();
        }
    }
}

function speakText(curInd) {
    for (i = curInd; i < curMessages.length; i++)
        if (curMessages[i] != undefined && curMessages[i].speakTime != -1)
            changeTextToSpeech(curMessages[i]);
}

function getMessages() {
    var messagesStruct = [
        {
            "elementId": "monthOfInvestments",
            "preMessageText": "In the Month of ",
            "postMessageText": "",
            "animation": "",
            "showTime": 0.1,
            "hideTime": 20,
            "speakTime": 0.001
        },
        {
            "elementId": "investedAmount",
            "preMessageText": "You have invested ",
            "postMessageText": "",
            "animation": "",
            "showTime": 0.5,
            "hideTime": 20,
            "speakTime": 2
        },
        {
            "elementId": "withdrawnAmount",
            "preMessageText": "and withdrawn ",
            "postMessageText": "",
            "animation": "",
            "showTime": 1.5,
            "hideTime": 20,
            "speakTime": 3
        },
        {
            "elementId": "gainLoss",
            "preMessageText": ["Your gain is", "Your Loss is"],
            "postMessageText": "",
            "animation": "",
            "showTime": 3,
            "hideTime": 20,
            "speakTime": 6
        },
        {
            "elementId": "activeSip",
            "preMessageText": "Your having ",
            "postMessageText": "active S I P",
            "animation": "",
            "showTime": 3,
            "hideTime": 20,
            "speakTime": 9
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
    msg.rate=1.25;
    console.log(text);
    if (msg.text != 'undefined')
        synth.speak(msg);
}

function setMessageText(message, currentElementId) {

    if (currentElementId == '#gainLoss') {
        var dif = parseInt($(currentElementId).text());
        console.log(dif + " " + typeof (dif) + " " + $(currentElementId).text() + " " + typeof ($(currentElementId).text()));
        if (dif >= 0)
            var msgText = message.preMessageText[0];
        else
            var msgText = message.preMessageText[1];
    }
    else
        var msgText = message.preMessageText;
    msgText += $(currentElementId).text();
    console.log(msgText);
    msgText += " " + message.postMessageText;
    return msgText.replace(/(\r\n|\n|\r)/gm, "");
}