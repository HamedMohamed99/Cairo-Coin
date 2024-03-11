function cbkd() {
    // Define the URL and regex pattern
    var url = 'https://www.marketwatch.com/investing/stock/cbkd?countrycode=uk';
    var regexValue = /<(bg-quote|span) class="value"[^>]*>(.*?)<\/(bg-quote|span)>/;
    var regexState = /<div class="status">(.*?)<\/div>/;

    // Set the maximum number of retry attempts
    var maxRetries = 3;

    for (var retry = 1; retry <= maxRetries; retry++) {
        try {
            // Fetch HTML content
            var text = UrlFetchApp.fetch(url).getContentText();

            // Match the regular expression against the HTML content
            var matchValue = text.match(regexValue);
            var matchState = text.match(regexState);

            // Check if a valid match is found
            if (matchValue && matchValue.length > 1 && matchState && matchState.length > 1) {
                // Valid match, proceed with appending to the sheet
                appendToColumn('F', 4, matchState[1]);
                appendToColumn('G', 4, matchValue[2]);
                return matchValue[2]

            } else {
                Logger.log("Invalid match. Retrying...");
            }
        } catch (error) {
            Logger.log("Error occurred:", error);
            Logger.log("Retrying...");
        }
    }

    // If the function fails after the maximum retry attempts
    if (retry > maxRetries) {
        Logger.log("Function failed after max retries.");
    }

    Logger.log("Function completed.");
}


//-------------------------------------------------------------------------------------------


function comi() {
    // Define the URL and regex pattern
    var url = 'https://www.marketwatch.com/investing/stock/comi?countryCode=EG';
    var regexValue = /<(bg-quote|span) class="value"[^>]*>(.*?)<\/(bg-quote|span)>/;
    var regexState = /<div class="status">(.*?)<\/div>/;

    // Set the maximum number of retry attempts
    var maxRetries = 3;

    for (var retry = 1; retry <= maxRetries; retry++) {
        try {
            // Fetch HTML content
            var text = UrlFetchApp.fetch(url).getContentText();

            // Match the regular expression against the HTML content
            var matchValue = text.match(regexValue);
            var matchState = text.match(regexState);

            // Check if a valid match is found
            if (matchValue && matchValue.length > 1 && matchState && matchState.length > 1) {
                // Valid match, proceed with appending to the sheet
                appendToColumn('C', 4, matchState[1]);
                appendToColumn('D', 4, matchValue[2]);
                return matchValue[2]

            } else {
                Logger.log("Invalid match. Retrying...");
            }
        } catch (error) {
            Logger.log("Error occurred:", error);
            Logger.log("Retrying...");
        }
    }

    // If the function fails after the maximum retry attempts
    if (retry > maxRetries) {
        Logger.log("Function failed after max retries.");
    }

    Logger.log("Function completed.");
}

function arbitrage() {
    appendToColumn('A', 4, new Date());
    var comiResult = comi();
    var cbkdResult = cbkd();
    appendToColumn('I', 4, roundToDecimal((comiResult / cbkdResult), 2));
}


//-------------------------------------------------------------------------------------------


function roundToDecimal(number, decimalPlaces) {
    var multiplier = Math.pow(10, decimalPlaces);
    return Math.round(number * multiplier) / multiplier;
}


//-------------------------------------------------------------------------------------------


function appendToColumn(column, row, value) {
    // Open the sheet by name
    var sheet = SpreadsheetApp.getActive().getSheetByName('Arbitrage');

    // Get the values in the specified column
    var columnValues = sheet.getRange(column + row + ':' + column + '3000').getValues();

    // Insert the new value at the beginning of the array
    columnValues.unshift([value]);

    var columnIndex = sheet.getRange(column + row).getColumn();

    // Update the values in the specified column
    sheet.getRange(row, columnIndex, columnValues.length).setValues(columnValues);

}