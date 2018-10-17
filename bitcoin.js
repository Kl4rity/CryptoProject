// Is responsible for outputting the average price necessary to be included in a block based on past transactions
// --> for Bitcoin
// Bases calculations on the past X hours of transactions
BitcoinDataHandler = {
  lsApiJson : []
  ,lsExchangeRates : []
  , dataNameToDisplayNameAndList: {
    "confirmations" : "Confirmations",
    "hash" : "Hash",
    "previous_block_hash" : "Previous Hash",
    "chainwork" : "Chainwork",
    "difficulty" : "Difficulty",
    "fees": "Fees (BTC)",
    "reward" : "Reward (BTC)",
    "pool" : "Mining Pool",
    "transaction_count" : "Mined Transactions"
  }
  ,init : function(){
    // Request for Blocks

    var promise = BitcoinDataHandler.httpGetAsync("https://api.smartbit.com.au/v1/blockchain/blocks?limit=40");
    promise.then(function(blocks){
      lsApiJson = blocks;
      BitcoinDataHandler.showBlockData();
      return BitcoinDataHandler.httpGetAsync("https://api.smartbit.com.au/v1/exchange-rates");
    }).then(function(prices){
      lsExchangeRates = prices;
    }).then(function(){
      BitcoinDataHandler.bitcoinAvgTransactionFee();
      console.log('Bitcoin.js done.');
    })

    var promiseTime = BitcoinDataHandler.httpGetAsync("https://api.smartbit.com.au/v1/blockchain/chart/block-interval?from=2017-11-14").then(function(times){
      var nTotalTime = 0;
      var nAverageTime = 0;
      var nNumberOfBlocks = times.chart.data.length;
      for (var i = 0; i < times.chart.data.length; i++){
          nTotalTime += times.chart.data[i].y;
      }
      nAverageTimeMinutes = (nTotalTime / nNumberOfBlocks)/60;
      document.getElementById("Bitcoin-Block-Time").innerHTML = nAverageTimeMinutes.toFixed(2) + " m";
    });

  }
  ,bitcoinAvgTransactionFee : function () {
    var nBlockLevelAvg = BitcoinDataHandler.nCalculateBlockLevelAvg(lsApiJson);
    var nCurrentBitcoinPrice = BitcoinDataHandler.nGetCurrentBitcoinPrice();
    var nAvgPriceInUSD = nBlockLevelAvg * nCurrentBitcoinPrice;
    nAvgPriceInUSD = Math.round(nAvgPriceInUSD*100)/100;
    document.getElementById('Bitcoin-Price').innerHTML = nAvgPriceInUSD + " $";
  }
  ,nGetCurrentBitcoinPrice(){
    var nUSDPrice;
    lsExchangeRates.exchange_rates.forEach(function(currency){
      if (currency.code = "USD"){
        nUSDPrice = currency.rate;
      }
    });
    return nUSDPrice;
  }
  ,nGetCutOffTime : function (hours) {
    currentUnixTime = Math.round((Date.now()/1000));
    minutes = hours * 60;
    seconds = minutes * 60;
    cutOffTime = currentUnixTime - seconds;
    return cutOffTime;
  }
  ,lsSelectBlocksInTimeframe : function(){
    nUnixCutOffTime = BitcoinDataHandler.nGetCutOffTime(3);
    var lsBlocksInTimeframe = [];
    lsApiJson.blocks.forEach(function(aBlock){
      if (aBlock.time >= nUnixCutOffTime){
        lsBlocksInTimeframe.push(aBlock);
      }
    });
    return lsBlocksInTimeframe;
  }
  ,nCalculateBlockLevelAvg : function(){
    var lsBlocksInTimeframe = BitcoinDataHandler.lsSelectBlocksInTimeframe();
    var lsAvgFees = [];
    lsBlocksInTimeframe.forEach(function(aBlock){
      var nAvgFeeInBlock = (aBlock.fees / aBlock.transaction_count);
      lsAvgFees.push(nAvgFeeInBlock);
    });
    var nSumOfAverages = lsAvgFees.reduce(function(a,b){
      return a+b;
    });
    var nAvgFee = nSumOfAverages / lsAvgFees.length;
    return nAvgFee;
  }
  ,httpGetAsync : function(theURL){
    return new Promise(function(resolve, reject){
      var xmlHttp = new XMLHttpRequest();
      xmlHttp.open("GET", theURL, true);

        xmlHttp.onload = function (){
          if (xmlHttp.status == 200){
            resolve(JSON.parse(xmlHttp.responseText));
          } else {
            reject(xmlHttp.statusText);
          }
        };
        xmlHttp.onerror = function (){
          reject(xmlHttp.statusText);
        }
        xmlHttp.send(null);
    });
  }
  , showBlockData : function(){
    var dnBlockDataContainer = document.getElementById("BlockData");
    for (var i = 0; i < lsApiJson.blocks.length; i++){

      var ulBlock = document.createElement("ul");
      ulBlock.className += "collection with-header bitcoin-block";
      //Creating Header Line
      var liHeaderLine = document.createElement("li");
      liHeaderLine.className += "collection-header";
      liHeaderLine.innerHTML = "<h4>Block #" + lsApiJson.blocks[i].height + "</h4>";
      ulBlock.appendChild(liHeaderLine);

      for (var key in BitcoinDataHandler.dataNameToDisplayNameAndList){
        var liPieceOfBlockData = document.createElement("li");
        liPieceOfBlockData.className += "collection-item";
        if(key == "pool" && lsApiJson.blocks[i][key] != null){
          liPieceOfBlockData.innerHTML = "<strong>" + BitcoinDataHandler.dataNameToDisplayNameAndList[key] + " </strong> : " + lsApiJson.blocks[i][key]["link"];
        } else {
          liPieceOfBlockData.innerHTML = "<strong>" + BitcoinDataHandler.dataNameToDisplayNameAndList[key] + " </strong> : " + lsApiJson.blocks[i][key];
        }
        ulBlock.appendChild(liPieceOfBlockData);
      }

      dnBlockDataContainer.appendChild(ulBlock);
      dnDelimiter = document.createElement("br");
      dnDelimiter.className += " bitcoin-block";
      dnBlockDataContainer.appendChild(dnDelimiter);
    }
    dataSelect();
  }
};
