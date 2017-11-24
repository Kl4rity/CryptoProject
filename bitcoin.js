// Is responsible for outputting the average price necessary to be included in a block based on past transactions
// --> for Bitcoin
// Bases calculations on the past X hours of transactions
BitcoinDataHandler = {
  httpGetAsync : function(theUrl){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function(){
      if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
        lsBlocks.push(xmlHttp.responseText);
        console.log(lsBlocks);
      }
      xmlHttp.open("GET", theURL, true);
      xmlHttp.send(null);
    }
  }
  , nGetCutOffTime : function (hours) {
    currentUnixTime = Math.round((Date.now()/1000));
    minutes = hours * 60;
    seconds = minutes * 60;
    cutOffTime = currentUnixTime - seconds;
    return cutOffTime;
  }
};

console.log(BitcoinDataHandler.nGetCutOffTime(3));
console.log(BitcoinDataHandler.httpGetAsync("https://api.smartbit.com.au/v1/blockchain/blocks?limit=40"));
console.log(BitcoinDataHandler.lsBlocks);
