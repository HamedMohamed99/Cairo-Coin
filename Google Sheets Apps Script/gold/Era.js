function gold_ERA() {
    // Define the URL
    var url = 'https://egypt.gold-era.com/gold-price/';

    // Set the maximum number of retry attempts
    var maxRetries = 3;

    for (var retry = 1; retry <= maxRetries; retry++) {
        try {
            // Fetch HTML content
            var text = UrlFetchApp.fetch(url).getContentText();

            // Updated regex to match the new HTML structure
            var regex = /<td>([\d,]+)£<\/td><td>([\d,]+)£<\/td><td>([\d,]+)£<\/td><td>([\d,]+)£<\/td>/g;

            var matches = getAllMatches(text, regex);

            // Check if a valid match is found
            if (matches && matches.length === 2) {
                // Valid match, proceed with appending to the sheet
                appendToColumn('AJ', 5, new Date());
                appendToColumn('AK', 5, matches[0][1].replace(/,/g, ''));
                appendToColumn('AM', 5, matches[0][2].replace(/,/g, ''));
                appendToColumn('AL', 5, matches[1][1].replace(/,/g, ''));
                appendToColumn('AN', 5, matches[1][2].replace(/,/g, ''));

                break; // Exit the loop if successful
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
        Logger.log("Function failed after max retries");
    }

    Logger.log("Function completed.");
}

//--------------------------------------------------------------------------------------------------------------

function appendToColumn(column, row, value) {
    // Open the sheet by name
    var sheet = SpreadsheetApp.getActive().getSheetByName('Gold');

    // Get the values in the specified column
    var columnValues = sheet.getRange(column + row + ':' + column + '3000').getValues();

    // Insert the new value at the beginning of the array
    columnValues.unshift([value]);

    var columnIndex = sheet.getRange(column + row).getColumn();

    // Update the values in the specified column
    sheet.getRange(row, columnIndex, columnValues.length).setValues(columnValues);

}
