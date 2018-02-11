SUMMARY
A single page web application that tells the user how much money they could have made (or lost) if they has invested in a certain stock at a certain time in the past. The user is prompted to input the amount they would have invested, select a stock invested in (made up of stocks from the FTSE100 and S&P500 stock exchanges) and a date in the past that the figurative investment was made. The user is then presented with what the original investment would be worth today. The app then goes on to break down that value, by displaying the price the shares would have been bought for, how many shares would have been bought and what each share would be worth today.. It then goes on to calculate what date in the past would have been the optimum date to sell the shares at, and how much more the investment would have been worth if it had been sold at that date.

TECHNICAL INFORMATION
The logic is all performed using jQuery. The site is fully responsive across mobile, tablet and desktop viewports using a mixture of media queries in CSS and logic in jQuery. The background images are all open source (https://unsplash.com/). The stock input uses a standard HTML5 select element at mobile and tablet viewports, and a jQuery plugin (http://easyautocomplete.com/) at desktop widths. The date picker uses a standard HTML5 date input element at mobile and tablet viewports and another jQuery plugin (https://xdsoft.net/jqplugins/datetimepicker) for desktop. The API for the stock analysis is provided by Quandl (https://blog.quandl.com/api-for-stock-data). The ajaxSpinner is generated using www.loading.io.

FUTURE ENHANCEMENTS
* Ensure date valdation accounts for different date formats on mobile and tablet viewports (on button click).
* Mobile styling for secondary page.
* Tablet styling for secondary page.
* Desktop styling for secondary page.
* Look at the posibility of integration for Crypto currencies.
* Change ajax spinners for something less clunky.

KNOWN BUGS
* Date formats when switching between desktop and mobile viewports.