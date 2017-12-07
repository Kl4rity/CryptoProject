
var oBlocks = new XMLHttpRequest();
    oBlocks.open("GET", "https://etherchain.org/api/blocks/0/20", false);
    oBlocks.send();


var oEthPriceFeed = new XMLHttpRequest();
    oEthPriceFeed.open("GET", "https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=BTC,USD,EUR", false);
    oEthPriceFeed.send();

var oData = JSON.parse(oBlocks.responseText);
var oEthPrice = JSON.parse(oEthPriceFeed.responseText);
var nEthPriceUSD = oEthPrice["USD"];

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
