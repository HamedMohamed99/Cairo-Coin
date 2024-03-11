function gold_BTC() {
    // Define the URL and regex pattern
    var url = 'https://btcegyptgold.com/#home';
    var regex = /<h2>(.*?)<\/h2>[\s\S]*?<p class="(up|down)">([\s\S]*?)<\/p>[\s\S]*?<p class="(up|down)">([\s\S]*?)<\/p>/g;

    // Set the maximum number of retry attempts
    var maxRetries = 3;

    // Create a Set to store unique h2Content values
    var uniqueH2Contents = new Set();

    for (var retry = 1; retry <= maxRetries; retry++) {
        try {
            // Fetch HTML content with increased timeout (e.g., 30 seconds)
            var options = {
                muteHttpExceptions: true,
                timeout: 30000, // Adjust the timeout value as needed (in milliseconds)
            };
            var text = UrlFetchApp.fetch(url, options).getContentText();

            // Match the global regular expression against the HTML content
            var matches = getAllMatches(text, regex);

            // Check if any matches are found
            if (matches && matches.length > 0) {
                appendToColumn3('A', 5, new Date());
                // Matches found, proceed with handling each match
                for (var i = 0; i < matches.length; i++) {
                    var h2Content = matches[i][1];
                    var direction1 = matches[i][2];
                    var number1 = extractNumericPart(matches[i][3]);
                    var direction2 = matches[i][4];
                    var number2 = extractNumericPart(matches[i][5]);

                    // Check if h2Content is unique, if yes, process and store it
                    if (!uniqueH2Contents.has(h2Content) & h2Content != "Gold Price") {
                        uniqueH2Contents.add(h2Content);
                        var data = {
                            'direction_Buy': direction1,
                            'buy': number1,
                            'direction_Sell': direction2,
                            'sell': number2,
                        }

                        addDataToSheet(h2Content, data)

                    }
                }
                break; // Exit the loop if successful
            } else {
                Logger.log("No valid matches found. Retrying...");
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

// Helper function to get all matches from a global regex
function getAllMatches(input, regex) {
    var matches = [];
    var match;

    while ((match = regex.exec(input)) !== null) {
        matches.push(match);
    }

    return matches;
}

// Helper function to extract the numeric part from a string
function extractNumericPart(input) {
    // Use a regular expression to match the numeric part
    var match = input.match(/[\d.,]+/);

    // If a match is found, return the numeric part; otherwise, return the original string
    return match ? match[0] : input;
}



//--------------------------------------------------------------------------------------------------------------



function addDataToSheet(h2Content, data) {
    if (h2Content === "Personal") {
        appendToColumn3('J', 5, data.buy);
        appendToColumn3('K', 5, data.sell);
    }
    else if (h2Content === "10 Gram Ingot") {
        appendToColumn3('L', 5, data.buy);
        appendToColumn3('M', 5, data.sell);
    }
    else if (h2Content === "20 Gram Ingot") {
        appendToColumn3('N', 5, data.buy);
        appendToColumn3('O', 5, data.sell);
    }
    else if (h2Content === "Ounce (31.1 Grams)") {
        appendToColumn3('P', 5, data.buy);
        appendToColumn3('Q', 5, data.sell);
    }
    else if (h2Content === "50 Gram Ingot") {
        appendToColumn3('R', 5, data.buy);
        appendToColumn3('S', 5, data.sell);
    }
    else if (h2Content === "100 Gram Ingot") {
        appendToColumn3('T', 5, data.buy);
        appendToColumn3('U', 5, data.sell);
    }
    else if (h2Content === "1/2 Gold Pound") {
        appendToColumn3('V', 5, data.buy);
        appendToColumn3('W', 5, data.sell);
    }
    else if (h2Content === "Gold Pound (8 grams)") {
        appendToColumn3('X', 5, data.buy);
        appendToColumn3('Y', 5, data.sell);
    }
    else if (h2Content === "21K/ Gram") {
        appendToColumn3('B', 5, data.direction_Buy);
        appendToColumn3('C', 5, data.buy);
        appendToColumn3('D', 5, data.direction_Sell);
        appendToColumn3('E', 5, data.sell);
    }
    else if (h2Content === "24K/ Gram") {
        appendToColumn3('F', 5, data.direction_Buy);
        appendToColumn3('G', 5, data.buy);
        appendToColumn3('H', 5, data.direction_Sell);
        appendToColumn3('I', 5, data.sell);
    }
}



//--------------------------------------------------------------------------------------------------------------



function appendToColumn3(column, row, value) {
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

