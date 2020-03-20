$(document).ready(function () {
    setData();    // method to fetch data from server set in local storage on document ready
});

// Api's to fetch data
var loginUrl = 'http://localhost:8081/Login.json';
var homeScreenDataUrl='http://localhost:8081/HomeScreenTopLevelData.json';
var investorsTopLevelDataUrl='http://localhost:8081/FetchInvestorsTopLevelData.json';
var sectorLevelDataUrl='http://localhost:8081/SectorLevelData.json';
var portfolioDataUrl='http://localhost:8081/portfolioData.json';

function setData() {
    // to get Data from local storage with the given headings like loginDetails, homeScreen etc.
    var loginDetailsStorageData = JSON.parse(sessionStorage.getItem('loginDetails'));
    var homeScreenStorageData = JSON.parse(sessionStorage.getItem('homeScreen'));
    var investorsTopLevelStorageData = JSON.parse(sessionStorage.getItem('investorsTopLevel'));
    var sectorLevelStorageData = JSON.parse(sessionStorage.getItem('sectorLevel'));
    var portfolioStorageData = JSON.parse(sessionStorage.getItem('portfolio'));
    // to check if storage type of the this particular heading is undefined or data under this heading is NULL
    if ((typeof (Storage) == "undefined") || (loginDetailsStorageData == null))
        makeAJAXcall("POST",'loginDetails',loginUrl); // if above condition is true, an AJAX call is made to URL and data is fetched
    if ((typeof (Storage) == "undefined") || (homeScreenStorageData == null))
        makeAJAXcall("POST",'homeScreen',homeScreenDataUrl);
    if ((typeof (Storage) == "undefined") || (investorsTopLevelStorageData == null))
        makeAJAXcall("POST",'investorsTopLevel',investorsTopLevelDataUrl);
    if((typeof (Storage) == "undefined") || (sectorLevelStorageData == null))
        makeAJAXcall("GET",'sectorLevel',sectorLevelDataUrl);        
    if((typeof (Storage) == "undefined") || (portfolioStorageData == null))
    makeAJAXcall("GET",'portfolio',portfolioDataUrl);
}

// method to make AJAX call to server and fetch data 
function makeAJAXcall(type,location,url) {
    var requestBody = {  // request body of AJAX call
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
            sessionStorage.setItem(location, msg);   // if message is not NULL the data is stored under the given location heading
        } else {
            alert("Cannot find this id !");
        }
    })
        .fail(function (xhr) {
            console.log('error common back', xhr);
        });
    return request;
}
