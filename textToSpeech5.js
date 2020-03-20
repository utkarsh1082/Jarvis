
var ids = [], i, k, prevTime = -1, flag = 1, currentTime = -1, messages, msg, synth = window.speechSynthesis, curMessages = getMessages(), prevInd = -1, curInd = -1;

function getMessages() {
    var messagesStruct = [
        {
            "elementId": "mutualFunds",
            "preMessageText": "Your maximum investment is in ",
            "postMessageText": "",
            "animation": "",
            "showTime": 0.0001,
            "hideTime": 29,
            "speakTime": 0
        },
        {
            "elementId": "topSectors",
            "preMessageText": "At sector level, yourmaximum exposure is in",
            "postMessageText": "",
            "animation": "",
            "showTime": 4,
            "hideTime": 29,
            "speakTime": 10
        },
        {
            "elementId": "topStocks",
            "preMessageText": "The stocks with maximum exposure include ",
            "postMessageText": " \n Thank you. Have a great day Pranav",
            "animation": "",
            "showTime": 9.5,
            "hideTime": 29,
            "speakTime": 20
        }
    ]
    return messagesStruct;
}
$(document).ready(function () {
    for (i = 0; i < curMessages.length; i++) {
        if (curMessages[i].elementId != "") {
         //   console.log("#" + curMessages[i].elementId);
            $("#" + curMessages[i].elementId).children().map(function () {
                var current_id = (('#' + $(this).attr('id')));
           //     console.log(current_id);
                if (current_id != "#undefined")
                    $(current_id).hide();
            });
        }
    }
    for (i = 0; i < data.mutualFunds.length; i++)
        createBarChartMutualFunds(i);           // to create bar charts according to    data
    for (i = 0; i < data.topSectors.length; i++) {
        attachIcon(i);                      // add icon with fontAwesome
        createBarChartTopSectors(i);        // to create Bar chart of TopSectors
    synth.cancel();
    speakText(0);
});

var video5 = videojs('#myVideo5');

// to restrict control bar from able to make video full screen
videojs('myVideo5', { controlBar: { fullscreenToggle: false } }).ready(function () {
    myPlayer = this;
    myPlayer.on("fullscreenchange", function () {
        if (myPlayer.isFullscreen()) {
            myPlayer.exitFullscreen();
        }
    });
}); 


// event fired on video play
video5.on('play', function () {

    
    if (flag)           // if video is started for the first time, the flag is set
        synth.cancel(); /* Cancelling synth initially if there is anything saved in cache from previous run */
    if (synth.paused && flag == 0)  // if video is paused and flag is not set
        synth.resume();             // the speech will be resumed
    else {
        flag = 0;                   // to make flag value to 0 such that we know that the video has started
        speakText(0);               // to start speaking text with first index
    }
});

video5.on('pause', function () {
    synth.pause();           // to pause speech on video pause
});


video2.on('ended', function () {     // event triggered on end of video
    flag = 1;                       // to define that new video is starting
    $('#myVideo5').hide();          // to hide the first video
});

video5.on('timeupdate', function () {        // event occured when time of the video is updated
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

function speakText(curInd) {
    for (i = curInd; i < curMessages.length; i++){
        if (curMessages[i] != undefined){
            changeTextToSpeech(curMessages[i]);
        }
    }
}

function updateText(currentTime) {
    for (i = 0; i < curMessages.length; i++) {
        if (curMessages[i].elementId != "") {
            $("#" + curMessages[i].elementId).children().map(function () {
                var current_id = (('#' + $(this).attr('id')));
                if (current_id != "#undefined") {
                    if (curMessages[i].showTime <= currentTime && curMessages[i].hideTime >= currentTime)
                        $(current_id).show();
                    else
                        $(current_id).hide();
                }
            });
        }
    }
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
function changeTextToSpeech(message, ind) {
    var currentElementId = message.elementId;
    var text = setMessageText(message, currentElementId);
    var msg = new SpeechSynthesisUtterance();
    msg.text = text;
    msg.rate = 0.95;
    if (msg.text != 'undefined') {
        synth.speak(msg);
    }
}

function setMessageText(message, currentElementId) {
    var msgText = message.preMessageText;
 //   console.log(currentElementId);
    if (currentElementId != '') {
        if (currentElementId == 'mutualFunds') {
            for (i = 0; i < 2; i++) {
                msgText += $('#mutualFunds' + (i + 1).toString()).text();
                if(i==0)
                    msgText += "&";
            }
        }
        else if (currentElementId == 'topSectors') {
            for (i = 0; i < 2; i++) {
                msgText += $('#topSectors' + (i + 1).toString()).text();
                if(i==0)
                    msgText += "&";
            }
        }
        else if (currentElementId == 'topStocks') {

            for (i = 1; i <= 5; i++) {
                $("#textBlock" + i.toString()).show();
            }
            for (i = 0; i < 3; i++) {
                msgText += $('#topStocks' + (i + 1).toString()).text();
                if(i==0)                    
                    msgText += "followed by";
                else if(i==1)
                msgText += "& ";
            }
        }
    }
    //  console.log(msgText);*/
    msgText += " " + message.postMessageText;
    return msgText;
}
// method to create bar charts for MutualsFunds using high charts
function createBarChartMutualFunds(ind) {
    var progressBar = new ProgressBar.Line('#mutualFundsBar' + (ind + 1).toString(), {
        color: '#993333',
        strokeWidth: 3,
        trailColor: '#f2b0a5',
        duration: 2000,
        easing: 'easeInOut',
        trailWidth: 3
    });
    progressBar.animate(data.mutualFunds[i][1] * 0.01);
}
// attach icon using fontAwesome
function attachIcon(ind) {
    document.getElementById('topSectorsIcon' + (ind + 1).toString()).innerHTML = '<i class="fas fa-' + data.topSectors[ind][2] + ' aria-hidden="true"></i>';
}

// method to create bar charts for TopSectors using high charts
function createBarChartTopSectors(ind) {
    var progressBar = new ProgressBar.Line('#topSectorsBar' + (ind + 1).toString(), {
        color: '#993333',
        strokeWidth: 3,
        trailColor: '#f2b0a5',
        duration: 2000,
        easing: 'easeInOut',
        trailWidth: 3
    });
    progressBar.animate(data.topSectors[i][1] * 0.01);
}
