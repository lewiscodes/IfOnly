randomiseBackground();
resizeInputs();

function randomiseBackground() {
  var randomNumber = Math.floor(Math.random() * 5) + 1;
  var image = new Image();
  image.onload = function() {
    window.document.body.background = image.src;
    window.document.body.className += "backgroundBody";
  }
  image.src = "./img/" + randomNumber + ".jpg";
}

function resizeInputs() {
  var inTextWidth = $(".in").width();
  var stockTextWidth = $(".stock").width();
  var dateTextWidth = $(".date").width();

  $("input.in").keyup(function () {
    calculateResizeInputs(inTextWidth, "in");
  });

  $("input.in").blur(function() {
    $(".in").val(formatCurrency($(".in").val()));
    calculateResizeInputs(inTextWidth, "in");
  });

  $("input.stock").keyup(function() {
    calculateResizeInputs(stockTextWidth, "stock");
  });

  $("input.date").keyup(function() {
    calculateResizeInputs(dateTextWidth, "date");
    formatDate($(".date").val());
  });
}

function formatDate(inputText) {
  var filteredDatesObject = {};
  var filteredDatesArray = jQuery.grep(dates, function(value) {
    return value.toUpperCase().indexOf(inputText.toUpperCase()) >= 0;
  });

  filteredDatesObject.type = "data";
  filteredDatesObject.value = filteredDatesArray;

  $(".date").easyAutocomplete(filteredDatesObject);
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

function calculateResizeInputs(originalTextWidth, className) {
  var visibleClass = "." + className;
  var hiddenClass = ".hidden_" + className;
  $(hiddenClass).text($(visibleClass).val());

  var hiddenTextWidth = $(hiddenClass).width();

  if (hiddenTextWidth > originalTextWidth) {
    $(visibleClass).css("width", hiddenTextWidth);
  } else if (hiddenTextWidth < originalTextWidth) {
    $(visibleClass).css("width", originalTextWidth);
  }
}
