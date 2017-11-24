var rawdata = [];
var blocks = new XMLHttpRequest();
    blocks.open("GET", "https://etherchain.org/api/txs/0/5", false);
    blocks.send();

rawdata.push(blocks.responseText);

console.log(rawdata);
