
var oBlocks = new XMLHttpRequest();
    oBlocks.open('GET', "https://etherchain.org/api/blocks/0/20", true);

    oBlocks.onload = function(){
      if(oBlocks.status == 200){
        var oData = JSON.parse(this.responseText);
        return oData;
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
        var oData = JSON.parse(this.responseText);
        var nEthPriceUSD = oData["USD"];
        return nEthPriceUSD;
        } else {
          console.log("ERROR:", this.statusText);
        }
      };
      oEthPriceFeed.onerror = function(){
        console.log('Network error');
      };
      oEthPriceFeed.send();


var fAverageFee = function(){
  const nWeiToEth = 1/(10**18);
  nTxcount = 0;
  oData.data.forEach(function(block){
    nTxcount = nTxcount + block.tx_count;
  });
  nTxfees = 0;
  oData.data.forEach(function(block){
    nTxfees = nTxfees + block.totalFee;
  });
  return Math.round((nTxfees/nTxcount) * nWeiToEth * nEthPriceUSD * 100)/100;
};

console.log("The avg. transaction fee of the Ethereum Network is $" + fAverageFee() + ".");
