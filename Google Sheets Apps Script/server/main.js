function sendData() {
    var sheet0 = SpreadsheetApp.getActive().getSheetByName('Control');
    var sheet1 = SpreadsheetApp.getActive().getSheetByName('Dollar-Data');
    var sheet2 = SpreadsheetApp.getActive().getSheetByName('Binance');
    var sheet3 = SpreadsheetApp.getActive().getSheetByName('Gold');
    var sheet4 = SpreadsheetApp.getActive().getSheetByName('Arbitrage');
    var sheet5 = SpreadsheetApp.getActive().getSheetByName('Bank-Rates');

    var blackMarket = {
        'sarf': {
            'buy': sheet1.getRange("F4").getValue(),
            'sell': sheet1.getRange("G4").getValue(),
        },
        'egcurrency': {
            'buy': sheet1.getRange("B4").getValue(),
            'sell': sheet1.getRange("C4").getValue(),
        },
        'GPN': {
            'buy': sheet1.getRange("J4").getValue(),
        },
        'realegp': {
            'buy': sheet1.getRange("M4").getValue(),
        },
        'parallelrate': {
            'sell': sheet1.getRange("P4").getValue(),
        },
        'souqtoday': {
            'buy': sheet1.getRange("S4").getValue(),
            'sell': sheet1.getRange("T4").getValue(),
        },
    }

    var valuebuy = sheet1.getRange("W4").getValue();
    var valuesell = sheet1.getRange("X4").getValue();
    var sellDainamicFactor = sheet0.getRange("I3").getValue();
    var buyDainamicFactor = sheet0.getRange("I2").getValue();

    var sellmin = valuebuy * (100 - 2 - buyDainamicFactor) / 100;
    var sellReal = valuesell * (100 - sellDainamicFactor) / 100;

    if (sellReal > sellmin) {
        var blackMarketAverage = {
            'average_buy': valuebuy,
            'average_sell': sellmin,
        }

        var blackMarketFactors = {
            'factor_buy': buyDainamicFactor,
            'factor_sell': 0,
        }
    } else {
        var blackMarketAverage = {
            'average_buy': valuebuy,
            'average_sell': valuesell,
        }

        var blackMarketFactors = {
            'factor_buy': buyDainamicFactor,
            'factor_sell': sellDainamicFactor,
        }
    }



    var binance = {
        'buy_egp': sheet2.getRange("B3").getValue(),
        'sell_egp': sheet2.getRange("C3").getValue(),
    }

    var gold_BTC = {
        'buy21': sheet3.getRange("C5").getValue(),
        'sell21': sheet3.getRange("E5").getValue(),
        'buy24': sheet3.getRange("G5").getValue(),
        'sell24': sheet3.getRange("I5").getValue(),
    }

    var gold_BTC_ingot = {
        'buy_5g': sheet3.getRange("J5").getValue(),
        'sell_5g': sheet3.getRange("K5").getValue(),
        'buy_10g': sheet3.getRange("L5").getValue(),
        'sell_10g': sheet3.getRange("M5").getValue(),
        'buy_20g': sheet3.getRange("N5").getValue(),
        'sell_20g': sheet3.getRange("O5").getValue(),
        'buy_ounce': sheet3.getRange("P5").getValue(),
        'sell_ounce': sheet3.getRange("Q5").getValue(),
        'buy_50g': sheet3.getRange("R5").getValue(),
        'sell_50g': sheet3.getRange("S5").getValue(),
        'buy_100g': sheet3.getRange("T5").getValue(),
        'sell_100g': sheet3.getRange("U5").getValue(),
        'buy_halfPound': sheet3.getRange("V5").getValue(),
        'sell_halfPound': sheet3.getRange("W5").getValue(),
        'buy_pound': sheet3.getRange("X5").getValue(),
        'sell_pound': sheet3.getRange("Y5").getValue(),
    }

    var gold_GPN = {
        'buy21': sheet3.getRange("AE5").getValue(),
        'sell21': sheet3.getRange("AF5").getValue(),
        'buy24': sheet3.getRange("AG5").getValue(),
        'sell24': sheet3.getRange("AH5").getValue(),
    }

    var gold_ERA = {
        'buy21': sheet3.getRange("AK5").getValue(),
        'sell21': sheet3.getRange("AL5").getValue(),
        'buy24': sheet3.getRange("AM5").getValue(),
        'sell24': sheet3.getRange("AN5").getValue(),
    }

    var gold_SAGHA = {
        'buy21': sheet3.getRange("AQ5").getValue(),
        'sell21': sheet3.getRange("AR5").getValue(),
        'buy24': sheet3.getRange("AS5").getValue(),
        'sell24': sheet3.getRange("AT5").getValue(),
    }

    var gold_CC = {
        'buy21': sheet3.getRange("AW5").getValue(),
        'sell21': sheet3.getRange("AX5").getValue(),
        'buy24': sheet3.getRange("AY5").getValue(),
        'sell24': sheet3.getRange("AZ5").getValue(),
    }

    var gpnBuy24 = gold_GPN.buy24;
    var gpnSell24 = gold_GPN.sell24;
    var gpnBuy21 = gold_GPN.buy21;
    var gpnSell21 = gold_GPN.sell21;
    var eraBuy24 = gold_ERA.buy24;
    var eraSell24 = gold_ERA.sell24;
    var eraBuy21 = gold_ERA.buy21;
    var eraSell21 = gold_ERA.sell21;
    var saghaBuy24 = gold_SAGHA.buy24;
    var saghaSell24 = gold_SAGHA.sell24;
    var saghaBuy21 = gold_SAGHA.buy21;
    var saghaSell21 = gold_SAGHA.sell21;
    var ccBuy24 = gold_CC.buy24;
    var ccSell24 = gold_CC.sell24;
    var ccBuy21 = gold_CC.buy21;
    var ccSell21 = gold_CC.sell21;

    // Define functions to calculate gold ingot prices
    function calculateGoldIngotPrice(baseValue, additionalValue, quantity) {
        return roundToDecimal((baseValue + additionalValue) * quantity, 2);
    }

    function calculateGoldIngotPrices(baseValues, buy24, sell24, buy21, sell21) {
        const buy_5g = calculateGoldIngotPrice(baseValues.buy_5g, buy24, 5);
        const sell_5g = calculateGoldIngotPrice(baseValues.sell_5g, sell24, 5);
        const buy_10g = calculateGoldIngotPrice(baseValues.buy_10g, buy24, 10);
        const sell_10g = calculateGoldIngotPrice(baseValues.sell_10g, sell24, 10);
        const buy_20g = calculateGoldIngotPrice(baseValues.buy_20g, buy24, 20);
        const sell_20g = calculateGoldIngotPrice(baseValues.sell_20g, sell24, 20);
        const buy_ounce = calculateGoldIngotPrice(baseValues.buy_ounce, buy24, 31.1);
        const sell_ounce = calculateGoldIngotPrice(baseValues.sell_ounce, sell24, 31.1);
        const buy_50g = calculateGoldIngotPrice(baseValues.buy_50g, buy24, 50);
        const sell_50g = calculateGoldIngotPrice(baseValues.sell_50g, sell24, 50);
        const buy_100g = calculateGoldIngotPrice(baseValues.buy_100g, buy24, 100);
        const sell_100g = calculateGoldIngotPrice(baseValues.sell_100g, sell24, 100);
        const buy_halfPound = calculateGoldIngotPrice(baseValues.buy_halfPound, buy21, 4);
        const sell_halfPound = calculateGoldIngotPrice(baseValues.sell_halfPound, sell21, 4);
        const buy_pound = calculateGoldIngotPrice(baseValues.buy_pound, buy21, 8);
        const sell_pound = calculateGoldIngotPrice(baseValues.sell_pound, sell21, 8);

        return {
            buy_5g,
            sell_5g,
            buy_10g,
            sell_10g,
            buy_20g,
            sell_20g,
            buy_ounce,
            sell_ounce,
            buy_50g,
            sell_50g,
            buy_100g,
            sell_100g,
            buy_halfPound,
            sell_halfPound,
            buy_pound,
            sell_pound,
        };
    }

    // Set base values (common for all three)
    const baseValues = {
        buy_5g: sheet0.getRange("E2").getValue(),
        sell_5g: sheet0.getRange("F2").getValue(),
        buy_10g: sheet0.getRange("E3").getValue(),
        sell_10g: sheet0.getRange("F3").getValue(),
        buy_20g: sheet0.getRange("E4").getValue(),
        sell_20g: sheet0.getRange("F4").getValue(),
        buy_ounce: sheet0.getRange("E5").getValue(),
        sell_ounce: sheet0.getRange("F5").getValue(),
        buy_50g: sheet0.getRange("E6").getValue(),
        sell_50g: sheet0.getRange("F6").getValue(),
        buy_100g: sheet0.getRange("E7").getValue(),
        sell_100g: sheet0.getRange("F7").getValue(),
        buy_halfPound: sheet0.getRange("E9").getValue(),
        sell_halfPound: sheet0.getRange("F9").getValue(),
        buy_pound: sheet0.getRange("E8").getValue(),
        sell_pound: sheet0.getRange("F8").getValue(),
    };

    // Usage
    const gold_GPN_ingot = calculateGoldIngotPrices(baseValues, gpnBuy24, gpnSell24, gpnBuy21, gpnSell21);

    const gold_ERA_ingot = calculateGoldIngotPrices(baseValues, saghaBuy24, saghaSell24, saghaBuy21, saghaSell21);

    const gold_SAGHA_ingot = calculateGoldIngotPrices(baseValues, eraBuy24, eraSell24, eraBuy21, eraSell21);

    const gold_CC_ingot = calculateGoldIngotPrices(baseValues, ccBuy24, ccSell24, ccBuy21, ccSell21);


    var gold_usd = {
        'global_price': sheet3.getRange("AB5").getValue(),
    }

    var arbitrage = {
        'comi': sheet4.getRange("D4").getValue(),
        'egstock': sheet4.getRange("C4").getValue(),
        'cbkd': sheet4.getRange("G4").getValue(),
        'ukstock': sheet4.getRange("F4").getValue(),
    }

    var bankrate = {
        'usd': sheet5.getRange("B3").getValue(),
        'eur': sheet5.getRange("C3").getValue(),
        'sar': sheet5.getRange("D3").getValue(),
        'kwd': sheet5.getRange("G3").getValue(),
        'aed': sheet5.getRange("F3").getValue(),
        'Qar': sheet5.getRange("E3").getValue(),
        'jod': sheet5.getRange("H3").getValue(),
        'bhd': sheet5.getRange("I3").getValue(),
        'omr': sheet5.getRange("J3").getValue(),
        'gbp': sheet5.getRange("K3").getValue(),

    }

    var gold_Final;
    var gold_Final_ingot;

    switch (sheet0.getRange("B6").getValue()) {
        case 1:
            gold_Final = gold_BTC;
            gold_Final_ingot = gold_BTC_ingot;
            break;
        case 2:
            gold_Final = gold_GPN;
            gold_Final_ingot = gold_GPN_ingot;
            break;
        case 3:
            gold_Final = gold_SAGHA;
            gold_Final_ingot = gold_SAGHA_ingot;
            break;
        case 4:
            gold_Final = gold_ERA;
            gold_Final_ingot = gold_ERA_ingot;
            break;
        default:
            gold_Final = gold_ERA;
            gold_Final_ingot = gold_ERA_ingot;
            break;
    }

    if (gold_Final.buy24 < gold_CC.buy24) {
        gold_Final = gold_CC;
        gold_Final_ingot = gold_CC_ingot;
    }

    var baseObj = {
        "blackMarket": blackMarket,
        "blackMarketAverage": blackMarketAverage,
        "blackMarketFactors": blackMarketFactors,
        "binance": binance,
        "gold_BTC": gold_BTC,
        "gold_BTC_ingot": gold_BTC_ingot,
        "gold_GPN": gold_GPN,
        "gold_GPN_ingot": gold_GPN_ingot,
        "gold_ERA": gold_ERA,
        "gold_ERA_ingot": gold_ERA_ingot,
        "gold_SAGHA": gold_SAGHA,
        "gold_SAGHA_ingot": gold_SAGHA_ingot,
        "gold_CC": gold_CC,
        "gold_CC_ingot": gold_CC_ingot,
        "gold_Final": gold_Final,
        "gold_Final_ingot": gold_Final_ingot,
        "gold_usd": gold_usd,
        "arbitrage": arbitrage,
        "bankrate": bankrate,
    };

    var headers = {
        "Content-Type": "application/json"
    };

    var url = "https://cairo-coin.azurewebsites.net/new-data";

    var options = {
        "method": "post",
        "payload": JSON.stringify(baseObj),
        "headers": headers,
    };

    var response = UrlFetchApp.fetch(url, options);
    console.log(response.getContentText())

}

//-------------------------------------------------------------------------------------------

function roundToDecimal(number, decimalPlaces) {
    var multiplier = Math.pow(10, decimalPlaces);
    return Math.round(number * multiplier) / multiplier;
}
