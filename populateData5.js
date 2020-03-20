var data=[];
$(document).ready(function () {
   populateData();
});
function populateData() {
    var mutualFundsInd = 0, topSectorsInd = 1, topStocksInd = 0;
    sectorLevelData = JSON.parse(sessionStorage.getItem('sectorLevel'));
    topLevelData = JSON.parse(sessionStorage.getItem('investorsTopLevel'));
    
    if (sectorLevelData != null && topLevelData != null) {
        for (i = 0; i < topLevelData.Data.length; i++) {
            if (topLevelData.Data[i].DATA_LEVEL == 'INVESTORSCHEME') {
                $('#mutualFunds' + (mutualFundsInd + 1).toString()).append(topLevelData.Data[i].RTA_SHORT_SCHEME_NAME);
                var mutualFundsData = parseFloat(topLevelData.Data[i].MTM).toFixed(2);
                $('#mutualFundsData' + (mutualFundsInd + 1).toString()).append(mutualFundsData);
                mutualFundsInd++;
            }
        }
        var topSectorsMap = new Map();
        for (i = 0; i < sectorLevelData.DBData.length; i++) {
            if (topSectorsMap.has(sectorLevelData.DBData[i].SECTOR)) {
                var value = parseFloat(topSectorsMap.get(sectorLevelData.DBData[i].SECTOR)) + sectorLevelData.DBData[i].WEIGHTS;
                topSectorsMap.set(sectorLevelData.DBData[i].SECTOR, value);
            }
            else
                topSectorsMap.set(sectorLevelData.DBData[i].SECTOR, +sectorLevelData.DBData[i].WEIGHTS);
        }
        topSectorsMap[Symbol.iterator] = function* () {
            yield* [...this.entries()].sort((a, b) => b[0] - a[0]);
        }
        var mapSize = topSectorsMap.size;
        if (mapSize > 5)
            mapSize = 5;

        for (let [key, value] of topSectorsMap){
            if(mapSize==0)
                break;
                $('#topSectors' + (topSectorsInd)).append(key);
                $('#topSectorsData' + (topSectorsInd)).append(parseFloat(value).toFixed(2));
                mapSize--;
                topSectorsInd++;
        }
        // for(i=0;i<data.topStocks.length;i++){
        //     $('#topStocks'+(i+1).toString()).append(data.topStocks[i][0]);
        //     $('#topStocksData'+(i+1).toString()).append(data.topStocks[i][1]);
        // }
    }
}