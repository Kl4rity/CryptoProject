
var oBlocks = new XMLHttpRequest();
    oBlocks.open("GET", "https://etherchain.org/api/blocks/0/2", false);
    oBlocks.send();


var oData = JSON.parse(oBlocks.responseText);

var fAverageFee = function(){
  var nTxcount = 0;
  nTxcount = nTxcount + oData.data.forEach(function(block){
    console.log(block.tx_count);
    return block.tx_count;
  });
  var nTxfees = 0;
  nTxfees = nTxfees + oData.data.forEach(function(block){
    console.log(block.totalFee);
    return block.totalFee;
  });
  return nTxfees;
  return nTxcount;
}
console.log(oBlocks);
console.log(oData);
console.log(fAverageFee());
