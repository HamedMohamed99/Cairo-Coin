function gold_SAGHA() {
    // Define the URL
    var url = 'https://market.isagha.com/prices'; // Replace with the actual URL

    // Set the maximum number of retry attempts
    var maxRetries = 3;

    for (var retry = 1; retry <= maxRetries; retry++) {
        try {
            // Fetch HTML content
            var text = UrlFetchApp.fetch(url).getContentText();

            // Extract data from the HTML content for عيار 24
            var regex24 = /<span>عيار 24[\s\S]*?<div class="value">([\s\S]*?)<\/div>[\s\S]*?<div class="value">([\s\S]*?)<\/div>/i;

            // Extract data from the HTML content for عيار 21
            var regex21 = /<span>عيار 21[\s\S]*?<div class="value">([\s\S]*?)<\/div>[\s\S]*?<div class="value">([\s\S]*?)<\/div>/i;

            // Test the regex patterns
            var matches24 = text.match(regex24);
            var matches21 = text.match(regex21);

            // Check if valid matches are found for both types
            if (matches24 && matches24.length === 3 && matches21 && matches21.length === 3) {
                
                appendToColumn('AP', 5, new Date());
                
                // Valid matches, proceed with appending to the sheet for عيار 24
                appendToColumn('AS', 5, matches24[1]); // Sell price for عيار 24
                appendToColumn('AT', 5, matches24[2]); // Buy price for عيار 24

                // Append to the sheet for عيار 21
                appendToColumn('AQ', 5, matches21[1]); // Sell price for عيار 21
                appendToColumn('AR', 5, matches21[2]); // Buy price for عيار 21

                break; // Exit the loop if successful
            } else {
                Logger.log("Invalid matches. Retrying...");
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
