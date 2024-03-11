function souqtoday() {
    // Define the URL and regex patterns
    var url = "https://souq-today.com/ar/currency/usd";

    var regexBuy = /سعر الشراء\s*([\d.]+)/;
    var regexSell = /<div style="font-size:120px;line-height:1.1;color: #1d3147;" class="mb-5">(.*?)<\/div>/;

    // Set the maximum number of retry attempts
    var maxRetries = 3;

    for (var retry = 1; retry <= maxRetries; retry++) {
        try {
            // Fetch HTML content
            var text = UrlFetchApp.fetch(url).getContentText();

            // Match the regular expressions against the HTML content
            var matchBuy = text.match(regexBuy);
            var matchSell = text.match(regexSell);

            // Check if matches are found and are valid numbers
            if (matchBuy && matchBuy.length > 1 && matchSell && matchSell.length > 1 && !isNaN(matchBuy[1]) && !isNaN(matchSell[1])) {
                // Matches are valid, proceed with appending to the sheet
                appendToColumn('R', 4, new Date());
                appendToColumn('S', 4, matchBuy[1]);
                appendToColumn('T', 4, matchSell[1]);
                break; // Exit the loop if successful
            } else {
                Logger.log("Invalid match or numbers. Retrying...");
            }
        } catch (error) {
            Logger.log("Error occurred:", error);
            Logger.log("Retrying...");
        }
    }

    // If the function fails after the maximum retry attempts, set cells to 0
    if (retry > maxRetries) {
        // set Cells To Zero
        appendToColumn('R', 4, new Date());
        appendToColumn('S', 4, 0);
        appendToColumn('T', 4, 0);
        Logger.log("Function failed after max retries. Cells set to 0.");
    }

    Logger.log("Function completed.");
}

//----------------------------------------------------------------------------------------------------------------------

function appendToColumn(column, row, value) {
    // Open the sheet by name
    var sheet = SpreadsheetApp.getActive().getSheetByName('Dollar-Data');

    // Get the values in the specified column
    var columnValues = sheet.getRange(column + row + ':' + column + '3000').getValues();

    // Insert the new value at the beginning of the array
    columnValues.unshift([value]);

    var columnIndex = sheet.getRange(column + row).getColumn();

    // Update the values in the specified column
    sheet.getRange(row, columnIndex, columnValues.length).setValues(columnValues);

}
