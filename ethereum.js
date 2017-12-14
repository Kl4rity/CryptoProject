EthereumDataHandler = {
  oDataBlocks : {},
  nEthPriceUSD : 0,
  nEthAvgBlockTime : 0,
  init : function(){
      // Request for Blocks
      var pRequest = EthereumDataHandler.httpGetAsync("https://api.nanopool.org/v1/eth/network/avgblocktime");
      pRequest.then(function(time){
        EthereumDataHandler.nEthAvgBlockTime = time["data"];
      }).then(function(){
        EthereumDataHandler.averageBlockTime();
        return EthereumDataHandler.httpGetAsync("https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=BTC,USD,EUR");
      }).then(function(prices){
        EthereumDataHandler.nEthPriceUSD = prices["USD"];
        return EthereumDataHandler.httpGetAsync("https://etherchain.org/api/blocks/0/40");
      }).then(function(blocks){
        EthereumDataHandler.oDataBlocks = blocks;
      }).then(function(){
        EthereumDataHandler.averageFee();
      }).catch(function(error){
        document.getElementById('Ethereum-Price').innerHTML = "Data not available.";
      })
  },

  averageFee : function(){
    const nWeiToEth = 1/(10**18);
    nTxcount = 0;
    EthereumDataHandler.oDataBlocks.data.forEach(function(block){
      nTxcount = nTxcount + block.tx_count;
    });
    nTxfees = 0;
    EthereumDataHandler.oDataBlocks.data.forEach(function(block){
      nTxfees = nTxfees + block.totalFee;
    });
      var nFee = Math.round((nTxfees/nTxcount) * nWeiToEth * EthereumDataHandler.nEthPriceUSD * 100)/100;
      document.getElementById('Ethereum-Price').innerHTML = nFee + "$";
  },

  averageBlockTime : function(){
    var nAvgTime = Math.round(EthereumDataHandler.nEthAvgBlockTime * 1000)/1000;
    document.getElementById('Ethereum-Block-Time').innerHTML = nAvgTime + "s";
  },

  httpGetAsync : function(theURL){
    return new Promise(function(resolve, reject){
      var xmlHttp = new XMLHttpRequest();
      xmlHttp.open("GET", theURL, true);
      //xmlHttp.withCredentials = true;

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
