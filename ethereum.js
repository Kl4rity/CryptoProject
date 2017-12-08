EthereumDataHandler = {
  oDataBlocks : {},
  nEthPriceUSD : 0,
  init : function(){
      // Request for Blocks
      var promise = EthereumDataHandler.httpGetAsync("https://etherchain.org/api/blocks/0/40");
      promise.then(function(blocks){
        EthereumDataHandler.oDataBlocks = blocks;
        return EthereumDataHandler.httpGetAsync("https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=BTC,USD,EUR");
      }).then(function(prices){
        EthereumDataHandler.nEthPriceUSD = prices["USD"];
      }).then(function(){
        EthereumDataHandler.averageFee();
        console.log('done.');
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
      var nInsert = Math.round((nTxfees/nTxcount) * nWeiToEth * EthereumDataHandler.nEthPriceUSD * 100)/100;
      document.getElementById('Ethereum-Price').innerHTML = "Current avg. Ethereum Transaction-Price: " + nInsert + "$";
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
  }

};
