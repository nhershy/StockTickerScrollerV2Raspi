let FULL_TICKER_LIST;
let FULL_TICKER_COUNT;
let SCROLL_DURATION = 0;
let HERSHKOVITZ_IMG_HEIGHT = 0;
let ANIMATION_LOOPS = 0;
let NOMICS_ONLINE = true;
let FINNHUB_ONLINE = true;

const FORMATTER = new Intl.NumberFormat('en-US', {
   minimumFractionDigits: 2,
   maximumFractionDigits: 2,
});

$(function() {
  FULL_TICKER_LIST = createFullTickerList();
  FULL_TICKER_COUNT = FULL_TICKER_LIST.length;
  SCROLL_DURATION = SCROLL_SPEED * FULL_TICKER_COUNT;
  HERSHKOVITZ_IMG_HEIGHT = $(window).height();

  if (FULL_TICKER_COUNT > 60) {
    $("#startBtn").hide();
    alert('You have exceeded the allowed number of stocks/indices/cryptos.' +
         '\nTotal maximum allowed are 60. Please reduce your choices.');
  }
  else {
    var windowHeight = $(window).height();
    var windowHeight55Percent = windowHeight * 0.55;
    $("#startBtn").css("height", windowHeight55Percent);
  }
});

var startBtnClick = async function() {
  $("#startBtn").hide();
  goFullScreen();
  await theMeat();
}

var theMeat = async function() {
  // reset to true at beginning of loop
  NOMICS_ONLINE = true;
  FINNHUB_ONLINE = true;

  insertFillerBlurb("Beginning");
  insertFillerBlurb("Beginning2");
  insertFillerBlurb("Beginning3");
  insertFillerBlurb("Beginning4");
  for (var i = 0; i < FULL_TICKER_COUNT; i++) {
    if (FULL_TICKER_LIST[i].type === "crypto") {
      retrieveCryptoData(FULL_TICKER_LIST[i].tickerSymbol);
    }
    else {
      if (FINNHUB_ONLINE) {
        retrieveStockData(FULL_TICKER_LIST[i].tickerSymbol);
      }
    }
  }
  insertFillerBlurb("Ending");
  await marqueeScrollAnimation();
}

// ============================== API CALLS ====================================

var retrieveStockData = function(tickerSymbol) {
  $.ajax({
    url: 'https://finnhub.io/api/v1/quote',
    type: 'GET',
    async : false,
    data: {
      symbol: tickerSymbol,
      token: finnhubApiKey
    },
    dataType: 'json',
    success: function(response) {
      if (response == null) {
        FINNHUB_ONLINE = false;
        displayOfflineMsg("finnhub_offline");
      }
      else {
        var currentPriceString = response.c;
        var previousClosePriceString = response.pc;
        var currentPrice = parseFloat(currentPriceString);
        var previousClosePrice = parseFloat(previousClosePriceString);
        var percentChangeString = calculatePercentChange(currentPrice, previousClosePrice);
        var percentChange = FORMATTER.format(parseFloat(percentChangeString.replace('%', ''))) + '%';
        var positiveChange = percentChangeString.indexOf('-') >= 0 ? false : true;
        percentChange = (positiveChange) ? "+".concat(percentChange) : percentChange;

        appendDataToDom(tickerSymbol, FORMATTER.format(currentPrice), percentChange, positiveChange);
      }
    }
  });
}

var retrieveCryptoData = function(cryptoSymbol) {
  var apiUrl = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=";

  if (cryptoSymbol == "BTC") {
    apiUrl = apiUrl.concat("bitcoin");
  }
  else if (cryptoSymbol == "ETH") {
    apiUrl = apiUrl.concat("ethereum");
  }
  else {
    return;
  }

  $.ajax({
    url: apiUrl,
    type: 'GET',
    async : false,
    dataType: 'json',
    success: function(response) {
      if (response == null) {
        // nothing
      }
      else {
        var currentPriceString = response[0].current_price;
        var currentPrice = FORMATTER.format(parseFloat(currentPriceString));
        var percentChangeString = response[0].price_change_percentage_24h;
        var percentChange = FORMATTER.format(parseFloat(percentChangeString)) + '%';
        var positiveChange = percentChangeString >= 0 ? true : false;
        percentChange = (positiveChange) ? "+".concat(percentChange) : percentChange;

        appendDataToDom(cryptoSymbol, currentPrice, percentChange, positiveChange);
      }
    }
  });
}

// ============================== DISPLAY DATA ====================================

var appendDataToDom = function(symbol, currentPrice, percentChange, positiveChange) {
  var anchorDiv = $('#anchorDiv');
  var idName = symbol + "Container";
  anchorDiv.append('<div id="' + idName + '" class="stockContainer">');
  var elementContainer = $("#" + idName);
  elementContainer.append('<img src="logos\\' + symbol + '.png">');
  elementContainer.append('<p>' + symbol + '&nbsp;</p>');
  elementContainer.append('<p>$' + currentPrice + '&nbsp;</p>');
  if (positiveChange) {
    elementContainer.append('<p class="positiveChange">' + percentChange + '</p>');
  }
  else {
    elementContainer.append('<p class="negativeChange">' + percentChange + '</p>');
  }
}

var insertFillerBlurb = function(identifier) {
  var anchorDiv = $('#anchorDiv');
  var idName = "fillerBlurb" + identifier + "Container";
  anchorDiv.append('<div id="' + idName + '" class="stockContainer">');
  var elementContainer = $("#" + idName);
  var pictureUrlLocation = "other\\filler";
  elementContainer.append('<img src="logos\\' + pictureUrlLocation + '.png">');
  elementContainer.append('<p style="color:black !important;">' + "?" + '&nbsp;</p>');
}

var displayOfflineMsg = function(imgName) {
  var anchorDiv = $('#anchorDiv');
  var idName = imgName + "Container";
  anchorDiv.append('<div id="' + idName + '" class="stockContainer">');
  var elementContainer = $("#" + idName);
  var pictureUrlLocation = "other\\" + imgName;
  elementContainer.append('<img src="logos\\' + pictureUrlLocation + '.png">');
  elementContainer.append('<p style="color:black !important;">' + "?" + '&nbsp;</p>');
}

// ===================== CREATING UNIFIED LIST OF INPUT DATA =========================

var createFullTickerList = function() {
  var cryptos = getCryptoSymbols();
  var indices = getIndexSymbols();
  var stocks = getStockSymbols();

  var fullTickerList = [];

  for(var i = 0; i < cryptos.length; i++) {
    fullTickerList.push({
      "tickerSymbol":cryptos[i],
      "type":"crypto"
    });
  }

  for(var i = 0; i < indices.length; i++) {
    fullTickerList.push({
      "tickerSymbol":indices[i],
      "type":"stock"
    });
   }

  for(var i = 0; i < stocks.length; i++) {
    fullTickerList.push({
      "tickerSymbol":stocks[i],
      "type":"stock"
    });
   }

   return fullTickerList;
}

var getStockSymbols = function() {
  if (jQuery.isEmptyObject(stockSymbols)) {
    return [];
  }
  else {
    return stockSymbols.split(',');
  }
}

var getCryptoSymbols = function() {
  if (jQuery.isEmptyObject(cryptoSymbols)) {
    return [];
  }
  else {
    return cryptoSymbols.split(',');
  }
}

var getIndexSymbols = function() {
  if (jQuery.isEmptyObject(indexSymbols)) {
    return [];
  }
  else {
    return indexSymbols.split(',');
  }
}

// ============================== JQUERY ANIMATIONS ====================================

var marqueeScrollAnimation = async function() {
  var scrollWidth = $('#anchorDiv').get(0).scrollWidth;
  var clientWidth = $('#anchorDiv').get(0).clientWidth;
  $('#anchorDiv').animate({ scrollLeft: scrollWidth - clientWidth },
  {
      duration: SCROLL_DURATION,
      easing: "linear",
      complete: async function() {
        stopAnimationScroll();
        resetScrollPosition();
        clearAllContent();
        await hershkovitzImageLoadingDialog();
      }
  });
}

var hershkovitzImageLoadingDialog = async function() {
  $('#hershkovitzLogo').css('display','block');
  $('#hershkovitzLogo').css('opacity','1');
  await growAndShrinkImageAnimation();
}

var growAndShrinkImageAnimation = async function() {
  await growImage();
}

var growImage = async function() {
  if (ANIMATION_LOOPS < 6) {
    $('#hershkovitzLogo').animate({height: (HERSHKOVITZ_IMG_HEIGHT + 160), 'marginTop': '-=50px'}, 800, async function () {
        ANIMATION_LOOPS += 1;
        await shrinkImage();
    });
  }
  else {
    ANIMATION_LOOPS = 0;
    $('#hershkovitzLogo').animate({opacity: 0}, 1200, async function () {
      $('#hershkovitzLogo').css('display','none');
      await theMeat();
    });
  }
}

var shrinkImage = async function() {
  if (ANIMATION_LOOPS < 6) {
    $('#hershkovitzLogo').animate({height: (HERSHKOVITZ_IMG_HEIGHT + 25), 'marginTop': '40px'}, 800, async function () {
        ANIMATION_LOOPS += 1;
        await growImage();
    });
  }
  else {
    ANIMATION_LOOPS = 0;
    $('#hershkovitzLogo').animate({opacity: 0}, 1200, async function () {
      $('#hershkovitzLogo').css('display','none');
      await theMeat();
    });
  }
}

// ==============================  HELPERS ====================================

var goFullScreen = function() {
  var elem = document.body;
  rfs = elem.requestFullscreen
    || elem.webkitRequestFullScreen
    || elem.mozRequestFullScreen
    || elem.msRequestFullscreen;

  rfs.call(elem);
}

var clearAllContent = function() {
  $("#anchorDiv").empty();
}

var resetScrollPosition = function() {
  $('#anchorDiv').scrollLeft(0);
}

var stopAnimationScroll = function() {
  $('#anchorDiv').stop();
}

var calculatePercentChange = function(currentPrice, previousClosePrice) {
  // Subtract the old price from the new price and divide the difference by the old price.
  // Then, multiply by 100 to get the percent change.
  var percentChange = ((currentPrice - previousClosePrice) / previousClosePrice) * 100;
  return percentChange.toString();
}
