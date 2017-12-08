EthereumDataHandler = {
  oDataBlocks : {},
  nEthPriceUSD : 0,
  init : function(){
      var oBlocks = new XMLHttpRequest();
        oBlocks.open('GET', "https://etherchain.org/api/blocks/0/1", true);

        oBlocks.onload = function(){
          if(oBlocks.status == 200){
            EthereumDataHandler.oDataBlocks = JSON.parse(this.responseText);
            //return EthereumDataHandler.oDataBlocks;
            console.log(EthereumDataHandler.oDataBlocks);
          } else {
            console.log("ERROR:", this.statusText);
          }
        };
        oBlocks.onerror = function(){
          console.log('Network error');
        };
        oBlocks.send();


      var oEthPriceFeed = new XMLHttpRequest();
        oEthPriceFeed.open('GET', "https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=BTC,USD,EUR", true);

        oEthPriceFeed.onload = function(){
          if(oEthPriceFeed.status == 200){
            var oDataPrice = JSON.parse(this.responseText);
            EthereumDataHandler.nEthPriceUSD = oDataPrice["USD"];
            //return EthereumDataHandler.nEthPriceUSD;
            console.log(EthereumDataHandler.nEthPriceUSD);
          } else {
            console.log("ERROR:", this.statusText);
          }
        };
        oEthPriceFeed.onerror = function(){
          console.log('Network error');
        };
        oEthPriceFeed.send();
  console.log("done");
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
  }

  getAsyncRequest : function(url){
    
  }

};

console.log(EthereumDataHandler.nEthPriceUSD);
console.log(EthereumDataHandler.oDataBlocks);
EthereumDataHandler.init();


// console.log("The avg. transaction fee of the Ethereum Network is $" + EthereumDataHandler.averageFee() + ".");
