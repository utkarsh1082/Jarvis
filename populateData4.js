var goals=[];
$(document).ready(function () {
    populateData();
});
function populateData() {

    var sessionStorageData = JSON.parse(sessionStorage.getItem('investorsTopLevel'));
    if (sessionStorageData != null) {
        goals= sessionStorageData.Data;
    }
}