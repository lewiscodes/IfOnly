var URL = "https://www.quandl.com/api/v3/datasets/";
var API_KEY = "api_key=LZ5yVTJ1qD8WbKyh2GRg";
var ajaxSpinner = "<img src='./img/spinner.gif'/>";
var numberOfShares = 0;
var eachSharehNowWorth = 0;
var ifOnly = 0;
var inTextWidth = $(".in").width();
var stockTextWidth = $(".stock").width();
var dateTextWidth = $(".date").width();

var dateOptions = {
	data: dates,
  theme: "dark",
	list: {
    maxNumberOfElements: 3,
		match: {
			enabled: true
		},
    showAnimation: {
			type: "slide", //normal|slide|fade
			time: 400
		},
		hideAnimation: {
			type: "slide", //normal|slide|fade
			time: 400
		}
	}
};

var stockOptions = {
    data: stock,
    getValue: "name",
		theme: "dark",
    template: {
      type: "description",
      fields: {
          description: "code"
      }
    },
    list: {
			maxNumberOfElements: 7,
      match: {
          enabled: true
      },
			showAnimation: {
				type: "slide", //normal|slide|fade
				time: 400
			},
			hideAnimation: {
				type: "slide", //normal|slide|fade
				time: 400
			}
    }
};

randomiseBackground();
$(".date").easyAutocomplete(dateOptions);
$(".stock").easyAutocomplete(stockOptions);

$("input.in").keyup(function () {
	calculateResizeInputs(inTextWidth, "in");
});

$("input.in").blur(function() {
	$(".in").val(formatCurrency($(".in").val(),0));
	validateCurrency($(".in").val());
	calculateResizeInputs(inTextWidth, "in");
});

$("input.stock").keyup(function() {
	calculateResizeInputs(stockTextWidth, "stock", true);
});

$("input.stock").blur(function() {
	validateTicker($("input.stock").val());
});

$("input.date").keyup(function() {
	calculateResizeInputs(dateTextWidth, "date", true);
});

$("input.date").blur(function() {
	var test = validateDate($("input.date").val());
	if (validateDate($("input.date").val())) {
		$("input.date").val(checkLeapYear($("input.date").val()));
	}
});

$("button").click(function() {
	// if all input validation passes
	if (validateCurrency($(".in").val()) && validateTicker($("input.stock").val()) && validateDate($("input.date").val())) {
		// adds AJAX spinners on click
		$(".dataTable .row .data").append(ajaxSpinner);
		$(".ifOnly").text("");
		$(".ifOnly").append(ajaxSpinner);

		var ticker = $("input.stock").val();
		var url = $.grep(stock, function(x){ return x.name == ticker; })[0].url;
		// format dates
		var todayDate = new Date().toISOString().slice(0,10);
		var date = $("input.date").val();
		var year = parseInt(date.substr(date.length - 4));
		var month = date.substring(date.indexOf(" ") + 1);
		month = month.substring(0, month.length - 5);
		month = getMonth(month);
		var day = date.substr(0 ,date.indexOf(' '));
		day  = day.substring(0, day.length - 2);
		date = year + "-" + month + "-" + day;

		getData(date, todayDate, url);
		$(".dataTable").css("display","inline-table");
		$(".secondary").css("display","block");
	}
});

function randomiseBackground() {
  var randomNumber = Math.floor(Math.random() * 5) + 1;
  var image = new Image();
  image.onload = function() {
    window.document.body.background = image.src;
		// adding class causes bachground to fade in
    window.document.body.className += "backgroundBody";
  }
  image.src = "./img/" + randomNumber + ".jpg";
}

function checkLeapYear(input) {
	var date = input.slice(0, -5);
	if (date.toUpperCase() === "29TH FEBRUARY") {
		var year = input.substr(input.length - 4)
		var isLeapYear = ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);

		if (isLeapYear) {
			return input;
		} else {
			return "28th February " + year;
		}
	} else {
		return input;
	}
}

function formatCurrency(inputText, dp) {

  var formatted0 = (parseInt(inputText).toLocaleString());
	var formatted2 = (parseFloat(inputText).toFixed(2).toLocaleString())

  if (isNaN(inputText)) {
    return("");
  } else {
		if (dp === 0) {
			return("$" + formatted0);
		} else {
			return("$" + formatted2);
		}
  }
}

function calculateResizeInputs(originalTextWidth, className, additionalElement) {
	// adds input text to an identically styled span;
		// measures the width of that span
		// uses that to determine if the input has to be wider
  var visibleClass = "." + className;
  var hiddenClass = ".hidden_" + className;
  $(hiddenClass).text($(visibleClass).val());

  var hiddenTextWidth = $(hiddenClass).width();

  if (hiddenTextWidth > originalTextWidth) {
    $(visibleClass).css("width", hiddenTextWidth);

		if (additionalElement) {
			$($(visibleClass).parent()).css("width", hiddenTextWidth);
		}
  } else if (hiddenTextWidth < originalTextWidth) {
		$(visibleClass).css("width", originalTextWidth);

		if (additionalElement) {
			$($(visibleClass).parent()).css("width", originalTextWidth);
		}
  }
}

function getData(startDate, endDate, code) {
  $.getJSON(URL + code + ".json?" + API_KEY + "&start_date=" + startDate + "&end_date=" + endDate, function(data) {
		var amountInvested = validateCurrency($(".in").val());
    numberOfShares = howManyShares(amountInvested, data);
		addTableData(".numberOfShares",numberOfShares, 1500);
    eachSharehNowWorth = whatAreTheyWorthNow(numberOfShares, data);
		addTableData(".salePrice", formatCurrency(eachSharehNowWorth, 2), 1750);
    ifOnly = formatCurrency(Math.floor(numberOfShares * eachSharehNowWorth), 0);
    $(".ifOnly").text(ifOnly);
		findBestPrice(data.dataset.data, numberOfShares, eachSharehNowWorth);
  })
}

function howManyShares(amountInvested, shares) {
	var lastIndex = shares.dataset.data.length;
  var openingPrice = shares.dataset.data[lastIndex - 1][8];
	addTableData(".purchasePrice", formatCurrency(openingPrice, 2), 1000);
  return Math.floor(amountInvested / openingPrice);
}

function whatAreTheyWorthNow(numberofShares ,shares) {
  return shares.dataset.data[0][3];
}

function validateCurrency(input) {
	var currency = input.substring(1);
	currency = currency.replace(/,/g, '');
	currency = parseFloat(currency)

	if (isNaN(currency)) {
		$("input.in").css("border-color","red");
		return false;
	} else {
		$("input.in").css("border-color","inherit");
		// return true;
		return currency;
	}
}

function validateTicker(input) {
	var test = $.grep(stock, function(x){ return x.name == input; });
	if (test.length > 0) {
		$("input.stock").css("border-color","inherit");
		return true;
	} else {
		$("input.stock").val("");
		$("input.stock").css("border-color","red");
		return false;
	}
}

function validateDate(input) {
	var year = parseInt(input.substr(input.length - 4));
	var monthDay = dates.indexOf(input.slice(0, -5).trim());

	if (isNaN(year) === false && monthDay !== -1) {
		$("input.date").css("color", "inherit").css("border-color","inherit");
		return true;
	} else {
		$("input.date").css("color", "red").css("border-color","red");
		return false;
	}
}

function getMonth(input) {
	if (input.toUpperCase() === "JANUARY") {
		return "01";
	} else if (input.toUpperCase() === "FEBRUARY") {
		return "02";
	} else if (input.toUpperCase() === "MARCH") {
		return "03";
	} else if (input.toUpperCase() === "APRIL") {
		return "04";
	} else if (input.toUpperCase() === "MAY") {
		return "05";
	} else if (input.toUpperCase() === "JUNE") {
		return "06";
	} else if (input.toUpperCase() === "JULY") {
		return "07";
	} else if (input.toUpperCase() === "AUGUST") {
		return "08";
	} else if (input.toUpperCase() === "SEPTEMBER") {
		return "09";
	} else if (input.toUpperCase() === "OCTOBER") {
		return "10";
	} else if (input.toUpperCase() === "NOVEMBER") {
		return "11";
	} else {
		return "12";
	}
}

function addTableData(className, data, delay) {
	window.setTimeout(function() {$(".data" + className).text(data);}, delay);
}

function findBestPrice(input, numberOfShares, originalValue) {
	var highestPrice = 0;
	var dateOfHighestPrice = null;
	for (var x = 0; x < input.length; x++) {
		if (input[x][8] >= highestPrice) {
			highestPrice = input[x][8];
			dateOfHighestPrice = input[x][0];
		}
	}

	var wouldHaveBeenWorth = highestPrice * numberOfShares;
	var difference = wouldHaveBeenWorth - (numberOfShares * originalValue);

	$(".ifOnlyDate").text(dateOfHighestPrice);
	$(".ifOnlyShare").text(formatCurrency(highestPrice, 2));
	$(".ifOnlyTotal").text(formatCurrency(difference, 0));
}
