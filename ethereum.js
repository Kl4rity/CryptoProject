EthereumDataHandler = {
  oDataBlocks : {},
  nEthPriceUSD : 0,
  nEthAvgBlockTime : 0,
  init : function(){
      // Request for Blockdata and Price and call averageFee function
      var pFeeRequest = EthereumDataHandler.httpGetAsync("https://etherchain.org/api/blocks/0/40");
      pFeeRequest.then(function(blocks){
        EthereumDataHandler.oDataBlocks = blocks;
        EthereumDataHandler.showBlockData();
        return EthereumDataHandler.httpGetAsync("https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=BTC,USD,EUR");
      }).then(function(){
        EthereumDataHandler.nEthPriceUSD = prices["USD"];
      }).then(function(){
        EthereumDataHandler.averageFee();
      }).catch(function(error){
        document.getElementById('Ethereum-Price').innerHTML = "Data not available.";
        EthereumDataHandler.showBlockData();
      })

      //Request for average Blocktime and call averageBlocktime function
      var pTimeRequest = EthereumDataHandler.httpGetAsync("https://api.nanopool.org/v1/eth/network/avgblocktime");
      pTimeRequest.then(function(time){
        EthereumDataHandler.nEthAvgBlockTime = time["data"];
      }).then(function(){
        EthereumDataHandler.averageBlockTime();
      }).catch(function(error){
        document.getElementById('Ethereum-Block-Time').innerHTML = "Data not available.";
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
    var nAvgTime = Math.round(EthereumDataHandler.nEthAvgBlockTime * 100)/100;
    document.getElementById('Ethereum-Block-Time').innerHTML = nAvgTime + " s";
  },

  httpGetAsync : function(theURL){
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
  },

  showBlockData : function(){
    var dnBlockDataContainer = document.getElementById("BlockData");
    for (var i = 0; i < oDataBlocks.data.length; i++){
      var dnBlockDataP = document.createElement("p");
      dnBlockDataP.className += " preformatted";
      dnBlockDataP.className += " ethereum-block";
      dnBlockDataContainer.appendChild(dnBlockDataP);
      dnBlockDataP.innerHTML = JSON.stringify(oDataBlocks.data[i], null, "\t");
      dnDelimiter = document.createElement("br");
      dnBlockDataContainer.appendChild(dnDelimiter);
    }
  },

  showBlockDataReplacer : function(key, value){
    if (key == "[" || key == "]" ){
      return "";
    }
    return value;
  }

};
