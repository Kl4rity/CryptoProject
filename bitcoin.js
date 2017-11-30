// Is responsible for outputting the average price necessary to be included in a block based on past transactions
// --> for Bitcoin
// Bases calculations on the past X hours of transactions
BitcoinDataHandler = {
  bitcoinAvgTransactionFee : function () {
    var lsBCData = BitcoinDataHandler.httpGetSync("https://api.smartbit.com.au/v1/blockchain/blocks?limit=40");
    var nBlockLevelAvg = BitcoinDataHandler.nCalculateBlockLevelAvg(lsBCData);
    var nCurrentBitcoinPrice = BitcoinDataHandler.nGetCurrentBitcoinPrice();
    var nAvgPriceInUSD = nBlockLevelAvg * nCurrentBitcoinPrice;
    nAvgPriceInUSD = Math.round(nAvgPriceInUSD*100)/100;
    console.log(nAvgPriceInUSD);
  }
  , nGetCurrentBitcoinPrice(){
    var lsPriceData = BitcoinDataHandler.httpGetSync("https://api.smartbit.com.au/v1/exchange-rates");
    var nUSDPrice;
    lsPriceData.exchange_rates.forEach(function(currency){
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
  ,lsSelectBlocksInTimeframe : function(lsBlocks){
    nUnixCutOffTime = BitcoinDataHandler.nGetCutOffTime(3);
    var lsBlocksInTimeframe = [];
    lsBlocks.blocks.forEach(function(aBlock){
      if (aBlock.time >= nUnixCutOffTime){
        lsBlocksInTimeframe.push(aBlock);
      }
    });
    return lsBlocksInTimeframe;
  }
  ,nCalculateBlockLevelAvg : function(lsBlocks){
    var lsBlocksInTimeframe = BitcoinDataHandler.lsSelectBlocksInTimeframe(lsBlocks);
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
  ,httpGetSync : function(theURL){
    var xmlHttp = new XMLHttpRequest();
      xmlHttp.open("GET", theURL, false);
      xmlHttp.send(null);
      var lsApiJson = JSON.parse(xmlHttp.responseText);
      return lsApiJson;
  }
};

// Minimum fee for block

// Define the functions and call them onreadystatechange.
BitcoinDataHandler.bitcoinAvgTransactionFee();
