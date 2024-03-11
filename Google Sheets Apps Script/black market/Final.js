function average() {
    var buy_list = [];
    var sell_list = [];

    var sheet = SpreadsheetApp.getActive().getSheetByName('Dollar-Data');

    // Helper function to check if a value is a valid number and not equal to 0
    function isValidNumber(value) {
        return !isNaN(value) && value !== 0;
    }

    // Helper function to add value to the appropriate list based on the variable name
    function addToBuySellList(variable, value) {
        if (isValidNumber(value)) {
            if (variable.endsWith("_Sell")) {
                sell_list.push(value);
            } else if (variable.endsWith("_Buy")) {
                buy_list.push(value);
            }
        }
    }

    // Check each variable and add to buy or sell list
    addToBuySellList("egcurrency_Buy", sheet.getRange("B4").getValue());
    addToBuySellList("egcurrency_Sell", sheet.getRange("C4").getValue());
    addToBuySellList("sarf_Buy", sheet.getRange("F4").getValue());
    addToBuySellList("sarf_Sell", sheet.getRange("G4").getValue());
    addToBuySellList("gpn_Buy", sheet.getRange("J4").getValue());
    addToBuySellList("realegp_Buy", sheet.getRange("M4").getValue());
    addToBuySellList("parallelrate_Sell", sheet.getRange("P4").getValue());
    addToBuySellList("souqtoday_Buy", sheet.getRange("S4").getValue());
    addToBuySellList("souqtoday_Sell", sheet.getRange("T4").getValue());

    // Calculate average for buy and sell lists
    var buyAverage = calculateAverage(buy_list);
    var sellAverage = calculateAverage(sell_list);

    appendToColumn('V', 4, new Date());
    var averageForFactor = calculateAverageForFactor();

    if (buyAverage != 0) {
        appendToColumn('W', 4, roundToDecimal((buyAverage), 2));
        var buyFactor = Math.min((0 + (100 * (buyAverage - averageForFactor[0]) / averageForFactor[0]) / 20), 2);
        appendToColumn('z', 4, roundToDecimal((buyFactor), 2));
    }

    if (sellAverage != 0) {
        appendToColumn('X', 4, roundToDecimal((sellAverage), 2));
        var sellFactor = Math.min((0 + (100 * (sellAverage - averageForFactor[1]) / averageForFactor[1]) / 10), 3);
        appendToColumn('AA', 4, roundToDecimal((sellFactor), 2));
    }
}



//----------------------------------------------------------------------------------------------------------------------



// Helper function to calculate the average of a list of numbers
function calculateAverage(list) {
    var sum = list.reduce(function (acc, num) {
        return acc + num;
    }, 0);

    return list.length > 0 ? sum / list.length : 0;
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



//-------------------------------------------------------------------------------------------



function roundToDecimal(number, decimalPlaces) {
    var multiplier = Math.pow(10, decimalPlaces);
    return Math.round(number * multiplier) / multiplier;
}


//----------------------------------------------------------------------------------------------------------------------


function calculateAverageForFactor() {
    // Get the active sheet
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Dollar-Data');

    // Set the range to the first 100 cells in column A (A1:A100)
    var range = sheet.getRange("W291:W582");

    // Get values from the range
    var values = range.getValues();

    // Calculate the average
    var sum = 0;
    var count = 0;

    for (var i = 0; i < values.length; i++) {
        if (values[i][0] !== "") { // Only consider non-empty cells
            sum += values[i][0];
            count++;
        }
    }

    var averageBuy = count > 0 ? sum / count : 0;

    // Set the range to the first 100 cells in column A (A1:A100)
    range = sheet.getRange("X291:X582"); // Changed variable name to avoid redeclaration

    // Get values from the range
    values = range.getValues();

    // Calculate the average
    sum = 0;
    count = 0;

    for (var i = 0; i < values.length; i++) {
        if (values[i][0] !== "") { // Only consider non-empty cells
            sum += values[i][0];
            count++;
        }
    }

    var averageSell = count > 0 ? sum / count : 0;

    return [averageBuy, averageSell];
}