
## Description

This repository contains multiple Apps Script files: **Btc.gs**, **Era.gs**, **Sagha.gs**, and **Global.gs**. Each script is responsible for fetching data from a specified source URL, using regular expressions to extract targeted data from the fetched content, and appending it to the top of its respective column in the Google Sheets document. The scripts attempt to fetch the data three times, triggering an error if all attempts fail.

## Functionality

-   **Data Fetching**: The scripts fetch data from specified source URLs.
-   **Data Extraction**: Regular expressions are employed to extract targeted data from the fetched content.
-   **Data Appending**: Extracted data is appended to the top of its respective column in the Google Sheets document.
-   **Error Handling**: If all fetch attempts fail, the scripts trigger an error.

## CairoCoin.js

This Apps Script file (`CairoCoin.js`) is responsible for calculating pricing based on the black market exchange rate of the US dollar. It takes the black market exchange rate of the US dollar, adds a margin to it, and multiplies it by the global gold price to obtain the final pricing for gold.

### Functionality

-   **Pricing Calculation**: The script calculates pricing based on the black market exchange rate of the US dollar.
