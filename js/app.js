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
var inTextWidth = $(".in").width();
var stockTextWidth = $(".stock").width();
var dateTextWidth = $(".date").width();

randomiseBackground();
$(".date").easyAutocomplete(dateOptions);
$(".stock").easyAutocomplete(stockOptions);

$("input.in").keyup(function () {
	calculateResizeInputs(inTextWidth, "in");
});

$("input.in").blur(function() {
	$(".in").val(formatCurrency($(".in").val()));
	calculateResizeInputs(inTextWidth, "in");
});

$("input.stock").keyup(function() {
	calculateResizeInputs(stockTextWidth, "stock", true);
});

$("input.date").keyup(function() {
	calculateResizeInputs(dateTextWidth, "date", true);
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

function checkLeapYear() {
  // todo
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
