function google(currency, column) {
    // Define the URL and regex pattern
    var url = `https://www.google.com/finance/quote/USD-${currency}`;
    var regexValue = /<div class="YMlKec fxKbKc">(.*?)<\/div>/;
  
    // Set the maximum number of retry attempts
    var maxRetries = 3;
  
    for (var retry = 1; retry <= maxRetries; retry++) {
      try {
        var options = {
          muteHttpExceptions: true,
          timeout: 10000, // Adjust the timeout value as needed (in milliseconds)
        };
        var text = UrlFetchApp.fetch(url, options).getContentText();
  
        // Match the regular expression against the HTML content
        var matchValue = text.match(regexValue);
        
  
        // Check if a valid match is found
        if (matchValue && matchValue.length > 1 ) {
          // Valid match, proceed with appending to the sheet
          appendToColumn(column, 3, matchValue[1]);
          break
  
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
  
  function bankRates() {
    appendToColumn('A', 3, new Date());
    google("eur", "C")
    google("sar", "D")
    google("qar", "E")
    google("aed", "F")
    google("kwd", "G")
    google("jod", "H")
    google("bhd", "I")
    google("omr", "J")
    google("gbp", "K")
  }
  
  //-------------------------------------------------------------------------------------------
  
  function appendToColumn(column, row, value) {
    // Open the sheet by name
    var sheet = SpreadsheetApp.getActive().getSheetByName('Bank-Rates');
    // Get the values in the specified column
    var columnValues = sheet.getRange(column + row +':' + column + '3000').getValues();
    // Insert the new value at the beginning of the array
    columnValues.unshift([value]);
    
    var columnIndex = sheet.getRange(column + row).getColumn();
  
    // Update the values in the specified column
    sheet.getRange(row, columnIndex, columnValues.length).setValues(columnValues);
  
  }