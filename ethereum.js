EthereumDataHandler = {
  oDataBlocks : {},
  nEthPriceUSD : 0,
  init : function(){
      // Request for Blocks
      var promise = EthereumDataHandler.httpGetAsync("https://etherchain.org/api/blocks/0/1");
      promise.then(function(blocks){
        oDataBlocks = blocks;
        return EthereumDataHandler.httpGetAsync("https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=BTC,USD,EUR");
      }).then(function(prices){
        nEthPriceUSD = prices["USD"];
      }).then(function(){
        EthereumDataHandler.averageFee();
        console.log('done.');
      })
  },

//console.log(oDataBlocks);
//console.log(nEthPriceUSD);

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
      return Math.round((nTxfees/nTxcount) * nWeiToEth * EthereumDataHandler.nEthPriceUSD * 100)/100;
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

console.log(EthereumDataHandler.nEthPriceUSD);
console.log(EthereumDataHandler.oDataBlocks);
EthereumDataHandler.averageFee();


// console.log("The avg. transaction fee of the Ethereum Network is $" + EthereumDataHandler.averageFee() + ".");
