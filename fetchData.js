$(document).ready(function () {
    setData();
});
var url = 'http://localhost:8081/portfolioData.json'
// function setData() {
//     fetch(url)
//         .then((resp) => resp.json())
//         .then(data => {
//             $('#salutation').append(data[0].investorName);
//             console.log(data[0].investorName+" "+$('#salutation').html())
//         });
// }
function setData() {
    var sessionStorageData = JSON.parse(sessionStorage.getItem('portfolio'));
    if ((typeof (Storage) == "undefined") || (sessionStorageData == null))
        makeAJAXcall("GET");
    else
        populateData();
}

function makeAJAXcall(type, schemeId, rowNo) {
    var requestBody = {

    };
    var request = $.ajax({
        type: type,
        url: url,
        dataType: "text",
        data: JSON.stringify(requestBody),
        contentType: "application/json"
    });
    request.done(function (msg) {
        if (msg) {
            sessionStorage.setItem('portfolio', msg);
            populateData();
        } else {
            alert("Cannot find this id !");
        }
    })
        .fail(function (xhr) {
            console.log('error common back', xhr);
        });
    return request;
}

function populateData(rowNo, schemeId) {

    var sessionStorageData = JSON.parse(sessionStorage.getItem('portfolio'));

    if (sessionStorageData != null) {
        $('#salutation').append(sessionStorageData.slide1.investorName);
    }
}