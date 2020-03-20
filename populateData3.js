$(document).ready(function () {
    populateData();
});
function populateData() {

    var investorsTopLevelData = JSON.parse(sessionStorage.getItem('investorsTopLevel'));
    var homeScreenData = JSON.parse(sessionStorage.getItem('homeScreen'));

    if (homeScreenData != null&&investorsTopLevelData!=null) {
        var date = new Date();        
        var gainPerc=parseFloat(homeScreenData.Data[0].UNREL_GAINPER).toFixed(2);
        $('#monthOfInvestments').append(getMonthName(date.getMonth()));
        $('#investedAmount').append(numFormatter(parseInt(homeScreenData.Data[0].INVESTED_AMOUNT), "₹", 0, 0, "money").replace(/(\r\n|\n|\r)/gm, ""));
        $('#gainLoss').append(gainPerc);
        $('#gainLoss').append("%");
    }
}