$(document).ready(function () {
    populateData();   // call for method to populate data in fields usimg data stored in local Storage with heading loginDetails
});
function populateData() {

    var sessionStorageData = JSON.parse(sessionStorage.getItem('loginDetails'));  // get data stored in local Storage with heading loginDetails

    if (sessionStorageData != null) {
        $('#salutation').append(sessionStorageData.DBData[0].INVESTOR_NAME);    // set data in the div with ID salutation
    }
}