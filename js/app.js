var URL = "https://www.quandl.com/api/v3/datasets/";
var API_KEY = "api_key=LZ5yVTJ1qD8WbKyh2GRg";
var ajaxSpinner = "<div class='spinner'><img src='./img/spinner.gif'/></div>"
var numberOfShares = 0;
var eachSharehNowWorth = 0;
var ifOnly = 0;
var options = generateMobileOptions();
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
setupDeviceSpecifics();
$(window).resize(function() {setupDeviceSpecifics()});

$("input.in").blur(function() {
  if ($("input.in").val() !== '') {
    $(".in").val(formatCurrency($(".in").val(),0));
  	validateCurrency($(".in").val());
  }
});

$('input.in').on('focus', function() {
	var formattedNumber = parseInt($('input.in').val().replace('$', '').replace(',', '').replace('.', ''));
	formattedNumber = !isNaN(formattedNumber) ? formattedNumber : '';
	$('input.in').val(formattedNumber);
});

$("input.stock").blur(function() {
	if (getTicker() !== '') {
    validateTicker(getTicker());
  }
});

$("button").on("click tap touch", function() {
	var ticker = getTicker();
	if (validateCurrency($(".in").val()) && validateTicker(ticker) && validateDate($("input.date").val())) {
		// adds AJAX spinners on click
		$("body").append(ajaxSpinner);
		$(".ifOnly").text("");

		var url = $.grep(stock, function(x){ return x.name == ticker; })[0].url;
		// format dates
		var todayDate = new Date().toISOString().slice(0,10);
		var date = $("input.date").val();

		if (getDevice() === "desktop") {
			var year = parseInt(date.substr(date.length - 4));
			var month = date.substring(date.indexOf(" ") + 1);
			month = month.substring(0, month.length - 5);
			month = getMonthNumber(month);
			var day = date.substr(0 ,date.indexOf(' '));
			day = day.length === 1 ? '0' + day : day;
			date = year + "-" + month + "-" + day;
		}

		getData(date, todayDate, url);
		$(".dataTable").css("display","inline-table");
		$(".secondary").css("display","block");
	}
});

function getTicker() {
	if (getDevice() === 'desktop') {
		return $("input.stock").val();
	} else {
		return $("select.stock").find(":selected").text();
	}
}

function resizeElements(el) {
	var device = getDevice();
	var int = null;

  function resize() {
		if (el.val().length <= 10) {
			int = 22;
		} else if (el.val().length <= 20) {
			int = 20;
		} else {
			int = 18;
		}

    el.width(((el.val().length+1) * int) + 'px');
  }

  el.on('keyup keypress focus blur change', resize)
  resize();
}

function removeResizeElements(el) {
	el.off('keyup keypress focus blur change')
	el.css("width", '');
}

function getMonthNumber(input) {
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

function getMonthName(input) {
	if (input == "1") {
		return "January";
	} else if (input == "2") {
		return "February";
	} else if (input == "3") {
		return "March";
	} else if (input == "4") {
		return "April";
	} else if (input == "5") {
		return "May";
	} else if (input == "6") {
		return "June";
	} else if (input == "7") {
		return "July";
	} else if (input == "8") {
		return "August";
	} else if (input == "9") {
		return "September";
	} else if (input == "10") {
		return "October";
	} else if (input == "11") {
		return "November";
	} else {
		return "December";
	};
};

function formatDate(date) {
	var year = parseInt(date.substr(0, 4));
	var month = getMonthName(parseInt(date.substr(5, 2)));
	var day = getDayPrefix(parseInt(date.substr(8, 2)));
	return day + " " + month + " " + year;
}

function validateDate(input) {
	if (getDevice() === 'desktop') {
		var year = parseInt(input.substr(input.length - 4));
		var monthDay = dates.indexOf(input.slice(0, -5).trim());
	
		if (isNaN(year) === false && monthDay !== -1) {
			$("input.date").css("color", "inherit").css("border-color","inherit");
			return true;
		} else {
			$("input.date").css("color", "red").css("border-color","red");
			return false;
		}
	} else {
		var year = parseInt(input.substr(0, 4));
		var month = input.substr(5, 2);
		var day = input.substr(7, 2);

		if (isNaN(year) === false) {
			if ((month === '01' || month === '03' || month === '05' || month === '07' || month === '08' || month === '10' || month === '12') && day <= '31') {
				$("input.date").css("color", "inherit").css("border-color","inherit");
				return true;
			} else if (month === '04' || month === '06' || month === '09' || month === '11') {
				$("input.date").css("color", "inherit").css("border-color","inherit");
				return true;
			} else if (month === '02' && day <= '29') {
				$("input.date").css("color", "inherit").css("border-color","inherit");
				return true;
			}
		} 

		$("input.date").css("color", "red").css("border-color","red");
		return false;
	}
};

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

function generateMobileOptions() {
  var options = "<select name='stock' class='stock'><option></option>";
  for (var x=0; x<stock.length; x++) {
    if (stock[x].code === "AAPL") {
      options += '<option value="'+ stock[x].url + '" selected>' + stock[x].name + '</option>'
    } else {
      options += '<option value="'+ stock[x].url + '">' + stock[x].name + '</option>'
    }
  }
  options += "</select>"

  return options;
}

function getDevice() {
	var width = $(window).width();

	if (width <= 640) {
		return "mobile";
	} else if (width > 640 && width < 1025) {
		return "tablet";
	} else {
		return "desktop";
	}
}

function positionDatePicker() {
	var datePicker = $(".ui-datepicker");
	var dateInput = $(".date");
	var marginNeeded = (dateInput.outerWidth() - datePicker.outerWidth()) / 2;
	datePicker.css("margin-left", marginNeeded);
}

function setupDeviceSpecifics() {
	var device = getDevice();

	if (device === "desktop") {
    if (!$(".stock").is("input")) {
      $(".stock").replaceWith('<input type="text" class="stock" placeholder="Apple Inc."/>');
    }

		$(".stock").easyAutocomplete(stockOptions);
		$(".date").attr("type", "text");
		$(".date").datepicker({ dateFormat: 'd MM yy', onSelect: function() {resizeElements($(".date"))}});
    resizeElements($(".in"));
		resizeElements($(".stock"));
		positionDatePicker();
	} else {
    if (!$(".stock").is("select")) {
      $(".stock").replaceWith(options);
    }

		$(".date").attr("type", "date");
    $('.date').val(new Date().toISOString().split('T')[0]);
		$(".date").datepicker("destroy");
    removeResizeElements($(".in"));
    removeResizeElements($(".stock"));
    removeResizeElements($(".date"));
	}
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

function getData(startDate, endDate, code) {
  $.getJSON(URL + code + ".json?" + API_KEY + "&start_date=" + startDate + "&end_date=" + endDate, function(data) {
		var amountInvested = validateCurrency($(".in").val());
		numberOfShares = howManyShares(amountInvested, data, code);
		addTableData(".numberOfShares",numberOfShares, 1500);
		eachSharehNowWorth = whatAreTheyWorthNow(numberOfShares, data);
		addTableData(".salePrice", formatCurrency(eachSharehNowWorth, 2), 1750);
		ifOnly = formatCurrency(Math.floor(numberOfShares * eachSharehNowWorth), 0);
		$(".ifOnly").text(ifOnly);
		findBestPrice(data.dataset.data, numberOfShares, eachSharehNowWorth, code);
  })
}

function howManyShares(amountInvested, shares, code) {
	var index = 0;
	if (code.substring(0, 5) === "WIKI/") {
		index = 8;
	} else {
		index = 3;
	}
	var lastIndex = shares.dataset.data.length;
	var openingPrice = shares.dataset.data[lastIndex - 1][index];
	updateInputsWithCorrectData(shares.dataset.data[lastIndex - 1], amountInvested, openingPrice);
	addTableData(".purchasePrice", formatCurrency(openingPrice, 2), 1000);
  return Math.floor(amountInvested / openingPrice);
}

function updateInputsWithCorrectData(data, amountInvested, openingPrice) {
	// update initial amount invested with actual amount spent based on actual initial share price.
	var howManyShares = Math.floor(amountInvested / openingPrice);
	var actualAmountInvested = formatCurrency(howManyShares * openingPrice, 0);
	$("input.in").val(actualAmountInvested);

	// update investment date based on earliest available date.
	var earliestInvestableDate = data[0];
	if (getDevice === "desktop") {
		$("input.date").val(formatDate(earliestInvestableDate));
	} else {
		$("input.date").val(earliestInvestableDate);
	}
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
		return currency;
	}
}

function validateTicker(input) {
	if (getDevice() === 'desktop') {
		var test = $.grep(stock, function(x){ return x.name == input; });
		if (test.length > 0) {
			$("input.stock").css("border-color","inherit");
			return true;
		} else {
			$("input.stock").val("");
			$("input.stock").css("border-color","red");
			return false;
		}
	} else {
		return true;
	}
}

function getDayPrefix(input) {
	input = input.toString();

	if (input === "01" || input === "1" || input === "21" | input == "31") {
		return input + "st";
	} else if (input === "02" || input === "2" || input === "22") {
		return input + "nd";
	} else if (input === "03" || input === "3" || input === "23") {
		return input + "rd";
	} else {
		return input + "th";
	}
}

function addTableData(className, data, delay) {
	$(".data" + className).text(data)
}

function findBestPrice(input, numberOfShares, originalValue, code) {

	var index = 0;
	if (code.substring(0, 5) === "WIKI/") {
		index = 8;
	} else {
		index = 3;
	}

	var highestPrice = 0;
	var dateOfHighestPrice = null;
	for (var x = 0; x < input.length; x++) {
		if (input[x][index] >= highestPrice) {
			highestPrice = input[x][index];
			dateOfHighestPrice = input[x][0];
		}
	}

	var wouldHaveBeenWorth = highestPrice * numberOfShares;
	var difference = wouldHaveBeenWorth - (numberOfShares * originalValue);

	window.setTimeout(function() {$(".ifOnlyDate").text(formatDate(dateOfHighestPrice))}, 2000);
	window.setTimeout(function() {$(".ifOnlyShare").text(formatCurrency(highestPrice, 2))}, 2250);
	window.setTimeout(function() {$(".ifOnlyTotal").text(formatCurrency(difference, 0))}, 2500);
	// removes Ajax Spinner form page
	window.setTimeout(function() {$(".spinner").remove()}, 3000)
}
