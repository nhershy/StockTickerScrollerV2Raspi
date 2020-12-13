# Stock Ticker Scroller V2

A modern version of the classic LED stock market ticker display, with nicely displayed logos. Optionally supports cryptocurrencies. Runs from your browser of choice. Made especially for the sophisticated schemer. 

"Beyond the point of averageness"

## Getting Started

This program relies on the [Finnhub](https://finnhub.io/) API to fetch current stock prices, and the [Nomics](https://nomics.com/) API to fetch current crypto prices. You will need to claim you free personal API for both of them key to have access to the data. Then, you must add your newly claimed keys to the `config.js` file. Within that same file you can modify which stocks and cryptos you would like to be displayed, as well as the scroll speed.

### Detailed How-To

1. Apply for your API key from Finnhub

```
https://finnhub.io/register
```

2. Apply for your API key from Nomics

```
https://p.nomics.com/pricing#free-plan
```

3. Open the `config.js` file. Paste your key into the respective variables, within the single quotes.

```
var finnhubApiKey = '';
var nomicsApiKey = '';
```

4. Modify the `cryptoSymbols`, `indexSymbols`, and/or `stockSymbols` variables to display your stocks/cryptos of interest. Can have from 1 - 20 total stocks/cryptos. If a new stock/crypto is added, you need to add a new logo within the `logos` folder. All logos must be 500x500 px, have a black background, and have the same name as the ticker/crypto symbol.

```
var cryptoSymbols = "ADA,BTC,ETH,LTC,XMR";
var indexSymbols = "DIA,QQQ,SPY,VT";
var stockSymbols = "AAPL,ACB,AMZN,AXP,DNKN,FB,GOOG,MSFT,NFLX,SPCE,TSLA";
```

5. Adjust the `SCROLL_SPEED` to your liking. The smaller the number, the faster it will scroll. 

```
const SCROLL_SPEED = 10000;
```

5. Install Apache webserver
Open a Linux terminal and type these commands one by one:

```
sudo apt update
sudo apt install apache2
```

6. Copy all files downloaded from this repository and place them in the **/var/www/html** folder.
*Note: make sure you place the files directly in the above folder, and do not place the parent folder within that folder.*

```
sudo cp -ar [LOCATION/OF/YOUR/FILES/*] /var/www/html
```

7. Run the program by opening up a browser and typing **localhost** in the searchbar and click enter.

## Author

 **Nicholas J Hershy**

## License

This project is licensed under the MIT License - see the `LICENSE` file for details
