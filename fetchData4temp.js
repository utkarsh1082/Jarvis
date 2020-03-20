var sector1,sector2,sector3,sector4,sector5;
$(document).ready(function () {
    setData();
});
var url = 'http://localhost/portfolioData.json'
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

function populateData() {

    var sessionStorageData = JSON.parse(sessionStorage.getItem('portfolio'));

    if (sessionStorageData != null) {
       sector1=sessionStorageData.slide4.sector1;       
       sector2=sessionStorageData.slide4.sector2;
       sector3=sessionStorageData.slide4.sector3;
       sector4=sessionStorageData.slide4.sector4;
       sector5=sessionStorageData.slide4.sector5;
       var total=sector1[1]+sector2[1]+sector3[1]+sector4[1]+sector5[1];
       $('#sector1').append(sector1[0]+"<br>"+sector1[1]);
       $('#sector2').append(sector2[0]+"<br>"+sector2[1]);
       $('#sector3').append(sector3[0]+"<br>"+sector3[1]);
       $('#sector4').append(sector4[0]+"<br>"+sector4[1]);
       $('#sector5').append(sector5[0]+"<br>"+sector5[1]);
    }
    
    console.log(sector1[0]+" "+ sector1[1]+" "+ sector2[0]+" "+sector2[1]);
}