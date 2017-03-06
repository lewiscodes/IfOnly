// https://www.quandl.com/api/v3/datasets/WIKI/AAPL.json
// https://www.quandl.com/api/v3/datasets/GOOG/LON_TSCO.json
var URL = "https://www.quandl.com/api/v3/datasets/";
var API_KEY = "api_key=LZ5yVTJ1qD8WbKyh2GRg";

getData("2015-01-01", "2016-01-01", "WIKI/AAPL");

function getData(startDate, endDate, code) {
  $.getJSON(URL + code + ".json?" + API_KEY + "&start_date=" + startDate + "&end_date=" + endDate, function(data) {
    console.log(data);
  })
}
