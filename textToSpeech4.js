
var ids = [], i, k, prevTime = -1, flag = 1, currentTime = -1, messages, msg,
    synth = window.speechSynthesis,
    curMessages = getMessages(),
    prevInd = -1, curInd = -1;
$(document).ready(function () {
    $('#imageBox1').show();
    for (i = 0; i < curMessages.length; i++) {
        if (curMessages[i].elementId != "")
            $("#" + curMessages[i].elementId).hide();
    }
    createText();
    synth.cancel();
    speakText(0);
});

var video = videojs('#myVideo4');

videojs('myVideo4', { controlBar: { fullscreenToggle: false } }).ready(function () {
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
    video.hide();
    video5.show();
    $.getScript("populateData5.js");
    $.getScript("textToSpeech5.js");
    video5.play();
});

video.on('timeupdate', function () {
    var currentTime = video.currentTime();
    curInd = getCurrentIndex(currentTime);
    // console.log("changed " + prevTime + " " + currentTime + " " + curInd);
    if (prevTime != -1 && ((currentTime - prevTime > 1) || (prevTime - currentTime > 1))) {
        synth.cancel();
        messages = "";
        if (curInd < curMessages.length && curInd >= 0)
            speakText(curInd - 1);
        //   console.log("changed " + prevTime + " " + currentTime + " " + curInd);
    }
    prevTime = currentTime;
    prevInd = curInd;
});
function speakText(curInd) {
    for (i = curInd; i < 2 * goals.length + 1; i++) {
        if (curMessages[i] != undefined) {
            changeTextToSpeech(curMessages[i], i);
        }
    }
}

function createText() {
    if(goals.length>3)
        goals.length=3;
    for (i = 0; i < (goals.length); i++) {
        console.log(goals.length);
        if (i > 0) {
            var cln = $('#imageBox1').clone(true);
            var id = ('#imageBox' + (i + 1).toString());
            $(id).append(cln);
            console.log(goals[i][0] + goals[i][1] + id);
        }
        createDonutChart(i);
        addIcon(i);
        setText(i);
    }
}

function getMessages() {
    var messagesStruct = [
        {
            "elementId": "",
            "preMessageText": "Your top goals are ",
            "postMessageText": "",
            "animation": "",
            "showTime": 0.1,
            "hideTime": 20,
            "speakTime": 0.0001
        },
        {
            "elementId": "nameOfGoals1",
            "preMessageText": "",
            "postMessageText": "",
            "animation": "",
            "showTime": 0.5,
            "hideTime": 20,
            "speakTime": 1.5
        },
        {
            "elementId": "dataOfGoals1",
            "preMessageText": "with investment of  ",
            "postMessageText": "",
            "animation": "",
            "showTime": 3,
            "hideTime": 20,
            "speakTime": 3
        },
        {
            "elementId": "nameOfGoals2",
            "preMessageText": "",
            "postMessageText": "",
            "animation": "",
            "showTime": 0.5,
            "hideTime": 20,
            "speakTime": 6
        },
        {
            "elementId": "dataOfGoals2",
            "preMessageText": " with investment of ",
            "postMessageText": "",
            "animation": "",
            "showTime": 3,
            "hideTime": 20,
            "speakTime": 10
        },
        {
            "elementId": "nameOfGoals3",
            "preMessageText": "",
            "postMessageText": "",
            "animation": "",
            "showTime": 0.5,
            "hideTime": 20,
            "speakTime": 12
        },
        {
            "elementId": "dataOfGoals3",
            "preMessageText": "with investment of ",
            "postMessageText": "",
            "animation": "",
            "showTime": 3,
            "hideTime": 20,
            "speakTime": 15
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
function changeTextToSpeech(message, ind) {
    var currentElementId = "#" + message.elementId;
    var text = setMessageText(message, currentElementId);
    var msg = new SpeechSynthesisUtterance();
    msg.text = text;
    //  console.log(text);
    if (msg.text != 'undefined') {
        synth.speak(msg);
        if (ind == 2 * goals.length) {
            //  synth.cancel();
        }
        console.log("speaking " + msg.text);
    }
}

function setMessageText(message, currentElementId) {
    var msgText = message.preMessageText;
    if (currentElementId != '#')
        msgText += $(currentElementId).text();
    msgText += " " + message.postMessageText;
    return msgText.replace(/(\r\n|\n|\r)/gm, "");
}
function createDonutChart(ind) {
    var progressBar = new ProgressBar.Circle('#donutChart' + (ind + 1).toString(), {
        color: '#993333',
        strokeWidth: 10,
        trailColor: '#f2b0a5',
        duration: 2000,
        easing: 'easeInOut'
    });
    progressBar.animate(parseFloat(goals[ind].GOAL_ACH_PER)*0.01);
}

function addIcon(ind) {
    var icon = goals[ind].GOAL_ICON;
    document.getElementById('icon' + (ind + 1).toString()).innerHTML = '<i class="fa fa-' + icon + ' aria-hidden="true"></i>';
}

function setText(ind) {
    var nameText = goals[ind].GOAL_NAME;
    var dataText = numFormatter(parseFloat(goals[ind].GOAL_TGT_AMT),'₹',2,0,'money');
    console.log(ind + 1 + " " + nameText + " nameOfGoals" + (ind + 1).toString());
    document.getElementById('nameOfGoals' + (ind + 1).toString()).innerHTML = nameText;
    $('#nameOfGoals'+ (ind + 1).toString()).show();
    document.getElementById('dataOfGoals' + (ind + 1).toString()).innerHTML = dataText;
    $('#dataOfGoals'+ (ind + 1).toString()).show();
}