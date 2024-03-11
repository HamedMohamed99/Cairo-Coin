function realegp() {
    // Define the URL and regex pattern
    var url = 'https://realegp.com/usd';
    var regexBuy = /<span class="fixed-num price-num">(.*?)<\/span>/;

    // Set the maximum number of retry attempts
    var maxRetries = 3;

    for (var retry = 1; retry <= maxRetries; retry++) {
        try {
            // Fetch HTML content
            var text = UrlFetchApp.fetch(url).getContentText();

            // Match the regular expression against the HTML content
            var matchBuy = text.match(regexBuy);

            // Check if a valid match is found
            if (matchBuy && matchBuy.length > 1) {
                // Valid match, proceed with appending to the sheet
                appendToColumn('L', 4, new Date());
                appendToColumn('M', 4, matchBuy[1]);
                break; // Exit the loop if successful
            } else {
                Logger.log("Invalid match. Retrying...");
            }
        } catch (error) {
            Logger.log("Error occurred:", error);
            Logger.log("Retrying...");
        }
    }

    // If the function fails after the maximum retry attempts, set cells to 0
    if (retry > maxRetries) {
        // set Cells To Zero
        appendToColumn('L', 4, new Date());
        appendToColumn('M', 4, 0);
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
