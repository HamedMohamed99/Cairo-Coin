function egcurrency() {
    // Define the URL and regex patterns
    var url = "https://egcurrency.com/ar/market/us-dollar";
    var regexBuy = /<a class="fw-bolder margin-me-4 link-info" style="font-size: 4rem;"[^>]*>(.*?)<\/a>/;
    var regexSell = /<p class="text-muted fw-bolder fs-5">سعر البيع:\s*<b[^>]*>(.*?)<\/b>\s*جنيه مصري<\/p>/;

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
                appendToColumn('A', 4, new Date());
                appendToColumn('B', 4, matchBuy[1]);
                appendToColumn('C', 4, matchSell[1]);
                break; // Exit the loop if successful
            } else {
                Logger.log("Invalid match or numbers. Retrying...");
            }
        } catch (error) {
            Logger.log("Error occurred:", error);
            Logger.log("Retrying...");
        }
    }
    if (retry > maxRetries) {
        // set Cells To Zero
        appendToColumn('A', 4, new Date());
        appendToColumn('B', 4, 0);
        appendToColumn('C', 4, 0);
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
