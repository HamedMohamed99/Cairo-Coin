function parallelrate() {
    // Define the API URL
    var apiUrl = 'https://www.parallelrate.org/api/currentprice?currency=USDPEGP';
    var maxRetries = 3;

    for (var retry = 1; retry <= maxRetries; retry++) {
        try {
            // Fetch JSON data from the API
            var response = UrlFetchApp.fetch(apiUrl);
            var jsonData = JSON.parse(response.getContentText());

            // Extract the required information
            var matchBuy = jsonData.USDPEGP;

            // Check if a match is found
            if (matchBuy !== undefined) {
                // Append data to the specified columns
                appendToColumn('O', 4, new Date());
                appendToColumn('P', 4, matchBuy);
                // Exit the loop if successful
                break;
            } else {
                Logger.log("Invalid data format. No match found.");
            }
        } catch (error) {
            Logger.log("Error occurred:", error);
            // Log the error and retry if not on the last attempt
            if (retry < maxRetries) {
                Logger.log("Retrying...");
                Utilities.sleep(3000); // Wait for 3 seconds before retrying
            } else {
                Logger.log("Maximum retries reached. Setting cell values to 0.");
                // Set cell values to 0 or handle as needed
                appendToColumn('O', 4, new Date());
                appendToColumn('P', 4, 0);
            }
        }
    }
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
