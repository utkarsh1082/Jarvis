
var ids = [], i, k, flag = 1, prevTime = -1, currentTime = -1, messages, msg, synth = window.speechSynthesis, curMessages = getMessages(), prevInd = -1, curInd = -1;

var video = videojs('#myVideo1');   // to make an instance of all videos with videojs libarary
var video2 = videojs('#myVideo2');
var video3 = videojs('#myVideo3');
var video4 = videojs('#myVideo4');
var video5 = videojs('#myVideo5');
$(document).ready(function () {
    // to hide all elements initially
    for (i = 0; i < curMessages.length; i++) {
        $("#" + curMessages[i].elementId).hide();
    }
    for (i = 1; i <= 5; i++) {
        console.log("#textBlock" + i.toString());
        $("#textBlock" + i.toString()).hide();
    }
    $('#imageBox1').hide();
    $('#withdrawnAmount').hide();
    $('#activeSip').hide();
    video2.hide();
    video3.hide();
    video4.hide();
    video5.hide();
});

// to restrict control bar from able to make video full screen
videojs('myVideo1', { controlBar: { fullscreenToggle: false } }).ready(function () {
    myPlayer = this;
    myPlayer.on("fullscreenchange", function () {
        if (myPlayer.isFullscreen()) {
            myPlayer.exitFullscreen();  // to exit full screen as soon as video is made full screen
        }
    });
});

// event fired on video play
video.on('play', function () {

    if (flag)           // if video is started for the first time, the flag is set
        synth.cancel(); /* Cancelling synth initially if there is anything saved in cache from previous run */
    if (synth.paused && flag == 0)  // if video is paused and flag is not set
        synth.resume();             // the speech will be resumed
    else {
        flag = 0;                   // to make flag value to 0 such that we know that the video has started
        speakText(0);               // to start speaking text with first index
    }
});

video.on('pause', function () {
    synth.pause();                  // to pause speech on video pause
});

video.on('ended', function () {     // event triggered on end of video
    flag = 1;                       // to define that new video is starting
    $('#myVideo1').hide();          // to hide the first video
    video2.show();                  // to show the first video
    $.getScript("populateData2.js");  // to load populateData script for 2nd video
    $.getScript("textToSpeech2.js");    // to load textToSpeech script for 2nd video
    video2.play();                      // to play 2nd video
});

video.on('timeupdate', function () {        // event occured when time of the video is updated
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
    // show text whose show time is between the current time
    for (i = 0; i < curMessages.length; i++) {
        if (curMessages[i].showTime <= currentTime && curMessages[i].hideTime >= currentTime) {
            //   console.log("show " + curMessages[i].elementId)
            $("#" + curMessages[i].elementId).show();
        }
        // to hide all other messages
        else {
            //    console.log("hide " + curMessages[i].elementId)
            $("#" + curMessages[i].elementId).hide();
        }
    }
}
// to speak text from current index
function speakText(curInd) {
    for (i = curInd; i < curMessages.length; i++)
        if (curMessages[i] != undefined)
            changeTextToSpeech(curMessages[i]);
}
// to get current messages
function getMessages() {
    var messagesStruct = [
        {
            "elementId": "intro",   // set the ID of the div to be modified and spoken
            "preMessageText": "",   // set message to spoken before message in div
            "postMessageText": "",  // set message to spoken after message in div
            "animation": "",        // to set animation of the particular text
            "showTime": 0.2,        // to set show time of the text
            "hideTime": 3.8,      // to set hide time of the text
            "speakTime": 0.2          // to set hide time of the text
        },
        {
            "elementId": "salutation",
            "preMessageText": "",
            "postMessageText": "",
            "animation": "",
            "showTime": 3.9,
            "hideTime": 4.5,
            "speakTime": 3.5
        }
    ]
    return messagesStruct;
}
// to get current index
function getCurrentIndex(currentTime) {
    if (currentTime < curMessages[0].showTime)         // if current time is less than showTime of first message, it means nothing to be spoken
        return -1;
    for (i = 0; i < curMessages.length; i++) {          // looped until we get first object not to speak
        if (curMessages[i].speakTime > currentTime)
            return i;
    }
    return curMessages.length;
}
// to change text to speech
function changeTextToSpeech(message) {
    var currentElementId = "#" + message.elementId;     // to set the current elementID
    var text = setMessageText(message, currentElementId);   // to set message Text to be spoken
    var msg = new SpeechSynthesisUtterance();       // initiallise a new instance
    msg.text = text;            // set text to be spoken
    msg.voice=1;                // set voice of the text spoken
    // console.log(text);
    if (msg.text != 'undefined')        
        synth.speak(msg);   // start speakin text
}

function setMessageText(message, currentElementId) {

    var msgText = message.preMessageText;     // set message as preMessage text
    if (currentElementId != '#')
        msgText += $(currentElementId).text();      // add text of the particular div
    //  console.log(msgText);
    msgText += " " + message.postMessageText;       // add message of postMessage text
    return msgText.replace(/(\r\n|\n|\r)/gm, "");      // return message by removing all blank spaces
}