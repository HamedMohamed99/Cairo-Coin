// Computed pricing
function gold_CC() {
    var sheetBm = SpreadsheetApp.getActive().getSheetByName('Dollar-Data');
    var sheetFactors = SpreadsheetApp.getActive().getSheetByName('Control');
    var sheetG = SpreadsheetApp.getActive().getSheetByName('Gold');

    var buy_bm = sheetBm.getRange("W4").getValue();
    var gold_global = sheetG.getRange("AB5").getValue();
    var buy_bm_factor = sheetFactors.getRange("I2").getValue();
    var gold_buy_factor = sheetFactors.getRange("L2").getValue();
    var gold_sell_factor = sheetFactors.getRange("L3").getValue();

    var gold_buy24 = (buy_bm * (100 - buy_bm_factor + gold_buy_factor) / 100) * gold_global;
    var gold_buy21 = gold_buy24 * 21 / 24;

    var gold_sell24 = gold_buy24 * (100 - gold_sell_factor) / 100;
    var gold_sell21 = gold_buy21 * (100 - gold_sell_factor) / 100;

    // Round down to the nearest multiple of 10
    gold_buy24 = Math.floor(gold_buy24 / 10) * 10;
    gold_buy21 = Math.floor(gold_buy21 / 10) * 10;
    gold_sell24 = Math.floor(gold_sell24 / 10) * 10;
    gold_sell21 = Math.floor(gold_sell21 / 10) * 10;

    appendToColumn('AV', 5, new Date());

    // Valid matches, proceed with appending to the sheet for 24
    appendToColumn('AY', 5, gold_buy24); // buy price for 24
    appendToColumn('AZ', 5, gold_sell24); // sell price for 24

    // Append to the sheet for 21
    appendToColumn('AW', 5, gold_buy21); // buy price for 21
    appendToColumn('AX', 5, gold_sell21); // sell price for 21

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
