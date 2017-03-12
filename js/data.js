// https://www.quandl.com/api/v3/datasets/WIKI/AAPL.json
// https://www.quandl.com/api/v3/datasets/GOOG/LON_TSCO.json
var URL = "https://www.quandl.com/api/v3/datasets/";
var API_KEY = "api_key=LZ5yVTJ1qD8WbKyh2GRg";
var numberOfShares = 0;
var eachSharehNowWorth = 0;
var ifOnly = 0;

getData("2015-01-01", "2016-01-01", "WIKI/AAPL");

function getData(startDate, endDate, code) {
  $.getJSON(URL + code + ".json?" + API_KEY + "&start_date=" + startDate + "&end_date=" + endDate, function(data) {
    numberOfShares = howManyShares(1000, data);
    console.log(numberOfShares);
    eachSharehNowWorth = whatAreTheyWorthNow(numberOfShares, data);
    console.log(eachSharehNowWorth);
    ifOnly = "$" + parseInt(Math.floor(numberOfShares * eachSharehNowWorth)).toLocaleString();
    console.log(ifOnly);
    $(".ifOnly").text(ifOnly);
  })
}

function howManyShares(amountInvested, shares) {
  var openingPrice = shares.dataset.data[0][1];
  return Math.floor(amountInvested / openingPrice);
}

function whatAreTheyWorthNow(numberofShares ,shares) {
  var lastIndex = shares.dataset.data.length;
  return shares.dataset.data[lastIndex - 1][3];
}
