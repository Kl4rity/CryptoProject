// Is responsible for outputting the average price necessary to be included in a block based on past transactions
// --> for Bitcoin
// Bases calculations on the past X hours of transactions
BitcoinDataHandler = {
  nGetCutOffTime : function (hours) {
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
    console.log(lsBlocksInTimeframe);
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
    console.log(nAvgFee);
  }
  ,httpGetAsync : function(theURL){
    var xmlHttp = new XMLHttpRequest();
      xmlHttp.open("GET", theURL, true);
      xmlHttp.send(null);
      xmlHttp.onreadystatechange = function(){
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
          var lsBlocks = JSON.parse(xmlHttp.responseText);
          console.log(lsBlocks);
          BitcoinDataHandler.nCalculateBlockLevelAvg(lsBlocks);
        }
    }
  }
};

// Minimum fee for block

// Define the functions and call them onreadystatechange.

console.log(BitcoinDataHandler.httpGetAsync("https://api.smartbit.com.au/v1/blockchain/blocks?limit=40"));
