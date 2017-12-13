// script.js is responsible for inserting the HTML containing the data generated by ethereum.js and bitcoin.js
document.getElementById("load-data").onclick = function (){
    BitcoinDataHandler.init();
    EthereumDataHandler.init();
}
