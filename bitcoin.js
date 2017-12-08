// Is responsible for outputting the average price necessary to be included in a block based on past transactions
// --> for Bitcoin
// Bases calculations on the past X hours of transactions
BitcoinDataHandler = {
  lsApiJson : []
  ,lsExchangeRates : []
  ,init : function(){
    // Request for Blocks

    var promise = BitcoinDataHandler.httpGetAsync("https://api.smartbit.com.au/v1/blockchain/blocks?limit=40");
    promise.then(function(blocks){
      lsApiJson = blocks;
      return BitcoinDataHandler.httpGetAsync("https://api.smartbit.com.au/v1/exchange-rates");
    }).then(function(prices){
      lsExchangeRates = prices;
    }).then(function(){
      BitcoinDataHandler.bitcoinAvgTransactionFee();
      console.log('done.');
    })

    // var xhrBlocks = new XMLHttpRequest();
    //   xhrBlocks.open("GET", "https://api.smartbit.com.au/v1/blockchain/blocks?limit=40", true);
    //
    //   xhrBlocks.onload = function (){
    //     if (xhrBlocks.status == 200){
    //       lsApiJson = JSON.parse(xhrBlocks.responseText);
    //       console.log(lsApiJson);
    //     }
    //   };
    //
    //   xhrBlocks.send(null);
    //
    //   // Request for Price
    // var xhrPrice = new XMLHttpRequest();
    //     xhrPrice.open("GET", "https://api.smartbit.com.au/v1/exchange-rates", true);
    //
    //     xhrPrice.onload = function (){
    //       if (xhrPrice.status == 200){
    //         lsExchangeRates = JSON.parse(xhrPrice.responseText);
    //         console.log(lsExchangeRates);
    //       }
    //     };
    //
    //     xhrPrice.send(null);

  }
  ,bitcoinAvgTransactionFee : function () {
    var nBlockLevelAvg = BitcoinDataHandler.nCalculateBlockLevelAvg(lsApiJson);
    var nCurrentBitcoinPrice = BitcoinDataHandler.nGetCurrentBitcoinPrice();
    var nAvgPriceInUSD = nBlockLevelAvg * nCurrentBitcoinPrice;
    nAvgPriceInUSD = Math.round(nAvgPriceInUSD*100)/100;
    console.log(nAvgPriceInUSD);
    document.getElementById('Bitcoin-Price').innerHTML = "Current avg. Bitcoin Transaction-Price: " + nAvgPriceInUSD + "$";
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
};
