
var ids = [], i, k, flag = 1, prevTime = -1, currentTime = -1, messages, msg, synth = window.speechSynthesis, curMessages = getMessages(), prevInd = -1, curInd = -1;
synth.cancel();

$(document).ready(function () {
    // to hide all elements initially
    for (i = 0; i < curMessages.length; i++) {
        $("#" + curMessages[i].elementId).hide();
    }
    console.log($("#current_value").text());
    synth.cancel();
    // start speaking
    speakText(0);
});

var video2 = videojs('#myVideo2');

// to restrict control bar from able to make video full screen
videojs('myVideo2', { controlBar: { fullscreenToggle: false } }).ready(function () {
    myPlayer = this;
    myPlayer.on("fullscreenchange", function () {
        if (myPlayer.isFullscreen()) {
            myPlayer.exitFullscreen();
        }
    });
});
video2.on('show', function () {
    console.log('#foo is now visible');
});

// event fired on video play
video2.on('play', function () {

    
    if (flag)           // if video is started for the first time, the flag is set
        synth.cancel(); /* Cancelling synth initially if there is anything saved in cache from previous run */
    if (synth.paused && flag == 0)  // if video is paused and flag is not set
        synth.resume();             // the speech will be resumed
    else {
        flag = 0;                   // to make flag value to 0 such that we know that the video has started
        speakText(0);               // to start speaking text with first index
    }
});

video2.on('pause', function () {
    synth.pause();           // to pause speech on video pause
});


video2.on('ended', function () {     // event triggered on end of video
    flag = 1;                       // to define that new video is starting
    $('#myVideo2').hide();          // to hide the first video
    video3.show();                  // to show the first video
    $.getScript("populateData3.js");  // to load populateData script for 2nd video
    $.getScript("textToSpeech3.js");    // to load textToSpeech script for 2nd video
    video3.play();                      // to play 2nd video
});

video2.on('timeupdate', function () {        // event occured when time of the video is updated
    var currentTime = video.currentTime();  // to get current time of video
    curInd = getCurrentIndex(currentTime);  // to get CurrentIndex of the text to be spoken
    updateText(currentTime);                // to update the text being shown according to cuurentr time

    if (prevTime != -1 && ((currentTime - prevTime > 0.2) || (prevTime - currentTime > 0.2))) {   // if the current time is changed by the user as the difference between previous and current time would differ more than 0.2s
        synth.cancel();                                 // whole synthesis is cancelled 
        messages = "";                                  // current messages are blanked
        updateText(curInd);                             // text is updated according to current index
        if (curInd <= curMessages.length && curInd >= 0)
            speakText(curInd - 1);                      // to speak text of the current index

    }
    prevTime = currentTime;                         // to update prev time 
    prevInd = curInd;                               // to update current time 
});

function updateText(currentTime) {
    for (i = 0; i < curMessages.length; i++) {
        if (curMessages[i].showTime <= currentTime && curMessages[i].hideTime >= currentTime) {
            //    console.log("show " + curMessages[i].elementId)
            $("#" + curMessages[i].elementId).show();
        }
        else {
            //  console.log("hide " + curMessages[i].elementId)
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
            "elementId": "current_value",
            "preMessageText": "The total value of your investments is ",
            "postMessageText": "", 
            "animation": "",
            "showTime": 0.5,
            "hideTime": 20,
            "speakTime": 2
        },
        {
            "elementId": "invested_value",
            "preMessageText": "You have invested a total of ",
            "postMessageText": "",
            "animation": "",
            "showTime": 3,
            "hideTime": 20,
            "speakTime": 6
        },
        {
            "elementId": "gain",
            "preMessageText": "This implies a gain of ",
            "postMessageText": "",
            "animation": "",
            "showTime": 1,
            "hideTime": 20,
            "speakTime": 10
        },
        {
            "elementId": "irr",
            "preMessageText": "and an I R R of ",
            "postMessageText": "",
            "animation": "",
            "showTime": 1,
            "hideTime": 20,
            "speakTime": 12
        },
        {
            "elementId": "no_of_goals",
            "preMessageText": "Your investments are allocated to",
            "postMessageText": "goals",
            "animation": "",
            "showTime": 3,
            "hideTime": 20,
            "speakTime": 16
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
    //console.log(text);
    if (msg.text != 'undefined')
        synth.speak(msg);
}

function setMessageText(message, currentElementId) {
    var msgText = message.preMessageText;
    msgText += $(currentElementId).text();
    //console.log(msgText);
    msgText += " " + message.postMessageText;
    return msgText.replace(/(\r\n|\n|\r)/gm, "");
}