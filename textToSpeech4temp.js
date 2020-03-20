
var ids = [], i, k, prevTime = -1, currentTime = -1, messages, msg, synth = window.speechSynthesis, curMessages = getMessages(), prevInd = -1, curInd = -1;
$(document).ready(function () {

});

var video = videojs('#myVideo4');
video.on('play', function () {
    if (synth.paused)
        synth.resume();
    else {
        createDonutChart();
        speakText(0);
    }
});

video.on('pause', function () {
    synth.pause();
});

video.on('timeupdate', function () {
    var currentTime = video.currentTime();
    curInd = getCurrentIndex(currentTime);
    updateText(currentTime);
    //console.log("changed " + prevTime + " " + currentTime + " " + curInd);
    if (prevTime != -1 && ((currentTime - prevTime > 1) || (prevTime - currentTime > 1))) {
        synth.cancel();
        messages = "";
        if (curInd < curMessages.length && curInd >= 0)
            speakText(curInd);
        console.log("changed " + prevTime + " " + currentTime + " " + curInd);
    }
    prevTime = currentTime;
    prevInd = curInd;
});

function updateText(currentTime) {
    var showElements = [];
    var hideElements = [];
    for (i = 0; i < curMessages.length; i++) {
        if (curMessages[i].showTime <= currentTime && curMessages[i].hideTime >= currentTime) {
            //   console.log("show " + curMessages[i].elementId)
            showElements.push(curMessages[i]);
        }
        else {
            //    console.log("hide " + curMessages[i].elementId)
            hideElements.push(curMessages[i]);
        }
    }
    showText(showElements);
    //hideText(hideElements);
}

function showText(showElements) {
    for (i = 0; i < showElements.length; i++) {
        $("#" + showElements[i].elementId).show();
    }
}
function hideText(hideElements) {
    for (i = 0; i < hideElements.length; i++) {
        $("#" + hideElements[i].elementId).hide();
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
            "elementId": "month",
            "preMessageText": "This is Your portfolio as of ",
            "postMessageText": "",
            "animation": "",
            "showTime": 0.1,
            "hideTime": 20,
            "speakTime": 0.1
        },
        {
            "elementId": "current_value",
            "preMessageText": "Your current Value is",
            "postMessageText": "",
            "animation": "",
            "showTime": 0.5,
            "hideTime": 20,
            "speakTime": 2
        },
        {
            "elementId": "invested_value",
            "preMessageText": "You invested",
            "postMessageText": "",
            "animation": "",
            "showTime": 3,
            "hideTime": 20,
            "speakTime": 6
        },
        {
            "elementId": "gain",
            "preMessageText": "Your gain is",
            "postMessageText": "",
            "animation": "",
            "showTime": 1,
            "hideTime": 20,
            "speakTime": 10
        },
        {
            "elementId": "irr",
            "preMessageText": "Your I R R is",
            "postMessageText": "",
            "animation": "",
            "showTime": 1,
            "hideTime": 20,
            "speakTime": 12
        },
        {
            "elementId": "no_of_goals",
            "preMessageText": "Your number of goals are",
            "postMessageText": "",
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
    //  console.log(text);
    if (msg.text != 'undefined') { }
    //synth.speak(msg);
}

function setMessageText(message, currentElementId) {
    var msgText = message.preMessageText;
    msgText += $(currentElementId).text();
    // console.log(msgText);
    msgText += " " + message.postMessageText;
    return msgText.replace(/(\r\n|\n|\r)/gm, "");
}
function createDonutChart() {
    $("#sector1").show();
    console.log(sector1[0] + " " + sector1[1] + " " + sector2[0] + " " + sector2[1]);
    Highcharts.chart('donutChart', {
        chart: {
            backgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
        },
        title: {
            text: ''
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                innerSize: '60%',
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: false,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    }
                }
            }
        },
        series: [{
            name: 'Mutual Funds',
            colorByPoint: true,
            data: [
                [sector1[0], sector1[1]],
                [sector2[0], sector2[1]],
                [sector3[0], sector3[1]],
                [sector4[0], sector4[1]],
                [sector5[0], sector5[1]]
            ]
        }],
        innerSize: '92%', exporting: {
            enabled: false
        }
    });
}