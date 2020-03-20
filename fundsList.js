var mainText=document.getElementById("text");

var url='http://fundoo-lab.valuefy.net//api/LivePrice/FundsList?limit=10&offset=1';
var postUrl='http://fundoo-lab.valuefy.net//api/LivePrice';
var mybody = document.getElementsByTagName("body")[0];
var i=0,mycurrent_cell,currenttext,mycurrent_row;
var filterText=$("input:text").val();
var mytable = document.createElement("table"),mytablebody = document.createElement("tbody");
console.log(filterText);
createTable(filterText);
function createTable(filterText){
fetch(url)
.then((resp)=>resp.json())
.then(data => {
	for (var i = 0; i < 8; i++) {		
		switch(i%8){
		case 0:
			mycurrent_row = document.createElement("tr");
			break;
		case 1:
			 writeDataInCell("Scheme Id");
			break;
		case 2:
			 writeDataInCell("Scheme name");
			break;
		case 3:
			 writeDataInCell("Scheme full name");
			break;
		case 4:
			 writeDataInCell("Scheme amfi code");
			break;
		case 5:
			writeDataInCell("Get Nav Details");
			break;
		case 6:
			writeDataInCell("Latest Nav");
			break;
		case 7:
            writeDataInCell("Latest Nav Date");
			mytablebody.appendChild(mycurrent_row);
			break;
		}
	}
	mytable.appendChild(mytablebody);
	for (var i = 0; i < 80; i++) {
		var regxFilterString= new RegExp(filterText);
		var ind=Math.floor(i/8);
		console.log(regxFilterString+ " "+ filterText);
		if(filterText==""||regxFilterString.test(data[ind].scheme_name)){
		switch(i%8){
		case 0:
			mycurrent_row = document.createElement("tr");
			break;
		case 1:
			writeDataInCell(data[ind].scheme_id);
			break;
		case 2:
            writeDataInCell(data[ind].scheme_name);
			break;
		case 3:
			writeDataInCell(data[ind].scheme_full_name);
			break;
		case 4:
			writeDataInCell(data[ind].scheme_amfi_code);
			break;
		case 5:
			mycurrent_cell = document.createElement("td");
			var button = document.createElement('input');
			button.setAttribute('type', 'button');
			button.setAttribute('value', 'Read Table Data');
			button.setAttribute('onclick', 'getNavDetails('+data[ind].scheme_id+','+(ind+1)+')');
            mycurrent_cell.appendChild(button);
			mycurrent_row.appendChild(mycurrent_cell);
			break;
		case 6:
			writeDataInCell(0);
			break;
		case 7:
			writeDataInCell(0);	
			mytablebody.appendChild(mycurrent_row);
			break;
		}
		}
	}
	mytable.appendChild(mytablebody);
        
   	mybody.appendChild(mytable);
});
}
function getDataFromServer(){
	fetch(url)
	.then((resp)=>resp.json())
	.then(data => {
		return data;
		})
}
function writeDataInCell(currenttextOfCell){
	mycurrent_cell = document.createElement("td");
	currenttext = document.createTextNode(currenttextOfCell);
	mycurrent_cell.appendChild(currenttext);
	mycurrent_row.appendChild(mycurrent_cell);
}

function getNavDetails(schemeId,rowNo){
	var sessionStorageData=JSON.parse(sessionStorage.getItem('livePrice'));
	if ((typeof(Storage) == "undefined")||(sessionStorageData==null)){
			makeAJAXcall("POST",schemeId,rowNo); //.then(populateData(rowNo,schemeId));
	}
	else{
		populateData(rowNo,schemeId);
	}
}

function makeAJAXcall(type,schemeId,rowNo,callback){
	var requestBody = {    
		"instrumentType": 0,
		"fundId": schemeId,
		"priceDate": null,
		"securityISIN": null,
		"latestNav": null,
		"latestNavDate": null
	  };
	var request=$.ajax({
           type: type,
           url: "http://fundoo-lab.valuefy.net/api/LivePrice",
           dataType: "text",
		   data: JSON.stringify(requestBody),
		   contentType: "application/json"
   });	
	request.done(function (msg) {
		   if (msg) {
			   sessionStorage.setItem('livePrice', msg);
				populateData(rowNo,schemeId);			   
		   } else {
			   alert("Cannot find this id !");
		   }
	   })
	   .fail(function(xhr) {
		console.log('error common back', xhr);
	});
	return request;
}

function populateData(rowNo,schemeId){
	
	var sessionStorageData=JSON.parse(sessionStorage.getItem('livePrice'));
		
	if(sessionStorageData!=null){
		if(sessionStorageData.fundConstituents[0].fundId!=schemeId){
			makeAJAXcall("POST",schemeId,rowNo);
		}
		else{
		console.log(sessionStorageData.fundConstituents[0].fundId);
		mytable.rows[rowNo].cells[5].innerHTML = sessionStorageData.instrumentPrices[0].latestNav;
	    var date=new Date(sessionStorageData.instrumentPrices[0].latestNavDate);
	    mytable.rows[rowNo].cells[6].innerHTML = date.toDateString();
		}
	}
}
function updateTable(){
	var newFilterText=$("input:text").val();
	console.log(newFilterText);
	createTable(newFilterText);
}