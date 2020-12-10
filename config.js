var finnhubApiKey = '';
var nomicsApiKey = '';

// Can have maximum 60 total different stocks/indices/cryptos
var cryptoSymbols = "ADA,BTC,DASH,ETH,LTC,MIOTA,NANO,XMR,XRP";
var indexSymbols = "DIA,QQQ,SPY,VT";
var stockSymbols = "AAPL,ACB,AMZN,AXP,DIS,DNKN,FB,GOOG,MCD,MSFT,NFLX,NVDA,PFE,PYPL,SBUX,SPCE,TSLA";

// Very slow - 30000
// Slow - 25000
// Medium - 20000
// Fast - 15000
// Very fast - 10000
const SCROLL_SPEED = 13000;
