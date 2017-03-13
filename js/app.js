// https://www.quandl.com/api/v3/datasets/WIKI/AAPL.json
// https://www.quandl.com/api/v3/datasets/GOOG/LON_TSCO.json
var URL = "https://www.quandl.com/api/v3/datasets/";
var API_KEY = "api_key=LZ5yVTJ1qD8WbKyh2GRg";
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
	$(".in").val(formatCurrency($(".in").val()));
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
	getData("2015-01-01", "2016-01-01", "WIKI/AAPL");
});

function randomiseBackground() {
  var randomNumber = Math.floor(Math.random() * 5) + 1;
  var image = new Image();
  image.onload = function() {
    window.document.body.background = image.src;
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

function formatCurrency(inputText) {
  var formatted = (parseInt(inputText).toLocaleString())

  if (isNaN(inputText)) {
    return("");
  } else {
    return("$" + formatted);
  }
}

function calculateResizeInputs(originalTextWidth, className, additionalElement) {
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
    numberOfShares = howManyShares(1000, data);
    eachSharehNowWorth = whatAreTheyWorthNow(numberOfShares, data);
    ifOnly = formatCurrency(Math.floor(numberOfShares * eachSharehNowWorth));
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

function validateCurrency(input) {
	var currency = input.substring(1);
	currency = currency.replace(/,/g, '');
	currency = parseFloat(currency)

	if (isNaN(currency)) {
		$("input.in").css("border-color","red");
		return false;
	} else {
		$("input.in").css("border-color","inherit");
		return true;
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
