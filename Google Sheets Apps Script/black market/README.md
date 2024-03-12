
## Description

This part of the repository contains multiple Apps Script files: **EGcurrency.gs**, **GoldPriceNow.gs**, **Sarf.gs**, **RealEGP.gs**, **ParellelRate.gs**, and **SouqToday.gs**. Each script is responsible for fetching data from a specified source URL, utilizing regular expressions to extract targeted data from the fetched content, and appending it to the top of its respective column in the Google Sheets document. The scripts attempt to fetch the data three times, triggering an error if all attempts fail.

## Functionality

-   **Data Fetching**: The scripts fetch data from specified source URLs.
-   **Data Extraction**: Regular expressions are employed to extract targeted data from the fetched content.
-   **Data Appending**: Extracted data is appended to the top of its respective column in the Google Sheets document.
-   **Error Handling**: If all fetch attempts fail, the scripts trigger an error.

## Final.js

This Apps Script file (`Final.js`) is responsible for calculating the average price of the US dollar in the black market from previous values, considering not to include zero values. Subsequently, it calculates the operations' coefficients based on the daily change rate.

### Functionality

-   **Average Price Calculation**: The script calculates the average price of the US dollar in the black market from previous values, excluding zero values.
-   **Operations Coefficients Calculation**: Based on the daily change rate, the script calculates the coefficients for operations.
