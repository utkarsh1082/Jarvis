$(document).ready(function () {
    populateData();
});

function populateData() {
// to populate field with data from local storage
    var investorsTopLevelData = JSON.parse(sessionStorage.getItem('investorsTopLevel'));
    var homeScreenData = JSON.parse(sessionStorage.getItem('homeScreen'));
    if (homeScreenData != null&&investorsTopLevelData!=null) {
        var monthNames = ["January", "February", "March", "April", "May","June","July", "August", "September", "October", "November","December"];
        var date = new Date();
        var gainPerc=parseFloat(homeScreenData.Data[0].UNREL_GAINPER).toFixed(2);
        // to set data of particular div's
        $('#month').append(monthNames[date.getMonth()]);
        $('#current_value').append(numFormatter(parseInt(homeScreenData.Data[0].MTM), "₹", 0, 0, "money").replace(/(\r\n|\n|\r)/gm, ""));
        $('#invested_value').append(numFormatter(parseInt(homeScreenData.Data[0].INVESTED_AMOUNT), "₹", 2, 0, "money").replace(/(\r\n|\n|\r)/gm, ""));
        $('#gain').append((gainPerc.toString()+"%").replace(/(\r\n|\n|\r)/gm, ""));
        $('#irr').append((((parseFloat(homeScreenData.Data[0].XIRR)*100).toFixed(2))+ "%").replace(/(\r\n|\n|\r)/gm, ""));
        $('#no_of_goals').append((homeScreenData.Data[0].GOALS));
        console.log(homeScreenData.Data[0].INVESTED_AMOUNT+" "+(parseFloat(homeScreenData.Data[0].XIRR)*100));
    }
}