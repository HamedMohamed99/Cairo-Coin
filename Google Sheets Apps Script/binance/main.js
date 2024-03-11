function fetchP2PData(page, tradeType, payTypes) {
    var baseObj = {
        "page": page,
        "rows": 20,
        "publisherType": null,
        "asset": "USDT",
        "tradeType": tradeType,
        "fiat": "EGP",
        "payTypes": payTypes
    };

    var headers = {
        "Content-Type": "application/json"
    };

    var url = "https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search";

    var options = {
        "method": "post",
        "contentType": "application/json",
        "payload": JSON.stringify(baseObj),
        "headers": headers
    };

    var response = UrlFetchApp.fetch(url, options);

    if (response.getResponseCode() === 200) {
        var jsonOutput = JSON.parse(response.getContentText());
        return jsonOutput;
    } else {
        throw new Error("Failed to fetch P2P data");
    }
}

function check(arr) {
    var threshold = arr[4][0] * 0.05;
    // Check if arr[0][0] is outside the threshold range
    if (arr[0][0] < arr[4][0] - threshold || arr[0][0] > arr[4][0] + threshold) {
        return true;
    } else {
        return false;
    }
}

function start(arr, amount, limit) {
    var totalEg = 0;
    var totalDollar = 0;
    while (check(arr)) {
        arr = arr.slice(1);
    }

    for (var i = 0; i < arr.length; i++) {
        var element = arr[i];

        if (element[1] > 199 && element[2] > 20) {
            if (element[1] > limit) {
                element[1] = limit;
            }

            if (totalDollar + element[1] > amount) {
                totalEg += element[0] * (amount - totalDollar);
                return totalEg / amount;
            }

            totalEg += element[0] * element[1];
            totalDollar += element[1];
        }
    }
    return totalEg / totalDollar;
}

function main(operation, payTypes) {
    var sheet_binance_full = SpreadsheetApp.getActive().getSheetByName('Binance-FullPayTypes');

    var all_paytypes_buy = [];
    var all_paytypes_sell = [];
    var binance_cc_buy_list = [];
    var binance_cc_sell_list = [];

    for (var p = 0; p < payTypes.length; p++) {
        var payType = payTypes[p];

        var firstPage = fetchP2PData(1, operation, [payTypes]);

        if (firstPage.success) {
            var totalPages = Math.ceil(firstPage.total / 20);
            var totalElements = firstPage.data;
            var totalPrices = [];

            for (var page = 2; page <= totalPages; page++) {
                var pageResult = fetchP2PData(page, answers.operation, [answers.payTypes]);

                if (pageResult.success) {
                    totalElements = totalElements.concat(pageResult.data);
                }
            }
        }

        if (operation === "SELL") {
            totalElements.sort(function (a, b) {
                return parseFloat(b.adv.price) - parseFloat(a.adv.price);
            });
        } else {
            totalElements.sort(function (a, b) {
                return parseFloat(a.adv.price) - parseFloat(b.adv.price);
            });
        }

        for (var e = 0; e < totalElements.length; e++) {
            totalPrices.push([
                parseFloat(totalElements[e].adv.price),
                parseFloat(totalElements[e].adv.tradableQuantity),
                parseFloat(totalElements[e].adv.dynamicMaxSingleTransQuantity)
            ]);
        }
        var amount_binance_cc = (payType === "Vodafonecash") ? 5000 : 2500;

        if (operation === "BUY") {
            all_paytypes_buy.push([
                start(totalPrices, 1000, 500),
                start(totalPrices, 5000, 1000),
                start(totalPrices, 10000, 1000),
                start(totalPrices, 50000, 5000),
                start(totalPrices, 100000, 10000),
            ]);
            binance_cc_buy_list.push(start(totalPrices, amount_binance_cc, 1000));
        }

        else {
            all_paytypes_sell.push([
                start(totalPrices, 1000, 500),
                start(totalPrices, 5000, 1000),
                start(totalPrices, 10000, 1000),
                start(totalPrices, 50000, 5000),
                start(totalPrices, 100000, 10000),
            ]);
            binance_cc_sell_list.push(start(totalPrices, amount_binance_cc, 1000));
        }
    }

    function appendWithAlphabet(data, startChar) {
        var alphabetLength = 26; // Assuming the English alphabet

        for (var i = 0; i < data.length; i++) {
            var currentSubarray = data[i];
            var currentSubarray_length = currentSubarray.length

            for (var j = 0; j < currentSubarray_length; j++) {
                var currentValue = currentSubarray[j];

                // Calculate the order in the alphabet
                var orderInAlphabet = (startChar + (i * (currentSubarray_length)) * 2 + j);

                // Convert the order to the corresponding alphabet character or characters
                var currentAlphabetChar = (orderInAlphabet < alphabetLength) ? String.fromCharCode('A'.charCodeAt(0) + orderInAlphabet) : 'A';

                // If the order exceeds the alphabet, add the next letter
                if (orderInAlphabet >= alphabetLength) {
                    currentAlphabetChar += String.fromCharCode('A'.charCodeAt(0) + (orderInAlphabet - alphabetLength));
                }
                sheet_binance_full.getRange(currentAlphabetChar + "5").setValue(roundToDecimal(currentValue, 2));
            }
        }
    }

    var startChar = (operation === "BUY") ? 1 : 6;

    sheet_binance_full.getRange("A5").setValue(new Date());

    if (operation === "BUY") {
        appendToColumn2('b', 3, roundToDecimal(calculateAverage(binance_cc_buy_list), 2));
        appendWithAlphabet(all_paytypes_buy, startChar);
    } else {
        appendToColumn2('c', 3, roundToDecimal(calculateAverage(binance_cc_sell_list), 2));
        appendWithAlphabet(all_paytypes_sell, startChar);
    }



}

function binance() {
    appendToColumn2('A', 3, new Date());
    main("BUY", ["Vodafonecash", "Bank", "Instapay"]);
    main("SELL", ["Vodafonecash", "Bank", "Instapay"]);
}

//-------------------------------------------------------------------------------------------

function roundToDecimal(number, decimalPlaces) {
    var multiplier = Math.pow(10, decimalPlaces);
    return Math.round(number * multiplier) / multiplier;
}

//-------------------------------------------------------------------------------------------

function appendToColumn2(column, row, value) {
    // Open the sheet by name
    var sheet = SpreadsheetApp.getActive().getSheetByName('Binance');

    // Get the values in the specified column
    var columnValues = sheet.getRange(column + row + ':' + column + '3000').getValues();

    // Insert the new value at the beginning of the array
    columnValues.unshift([value]);

    var columnIndex = sheet.getRange(column + row).getColumn();

    // Update the values in the specified column
    sheet.getRange(row, columnIndex, columnValues.length).setValues(columnValues);

}

//-----------------------------------------------------------------------------------------------

// Helper function to calculate the average of a list of numbers
function calculateAverage(list) {
    var sum = list.reduce(function (acc, num) {
        return acc + num;
    }, 0);

    return list.length > 0 ? sum / list.length : 0;
}
