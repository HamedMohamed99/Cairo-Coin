## Description

This Apps Script files **Btc, Era, Sagha and Global** is responsible for fetching data from a specified source URL. It utilizes regular expressions to extract the targeted data from the fetched content. Once the data is extracted, it appends it to the top of its respective column in the Google Sheets document.
The script attempts to fetch the data three times. If all attempts fail, it triggers an error


## Functionality

-   **Data Fetching**: The script fetches data from a specified source URL.
-   **Data Extraction**: Regular expressions are used to extract the targeted data from the fetched content.
-   **Data Appending**: The extracted data is appended to the top of its respective column in the Google Sheets document.
- **Error Handling**: If all fetch attempts fail, the script triggers an error


## CairoCoin.js

This Apps Script file (`CairoCoin.js`) is responsible for calculating pricing based on the black market exchange rate of the US dollar. It takes the black market exchange rate of the US dollar, adds a margin to it, and multiplies it by the global gold price to obtain the final pricing for gold.

### Functionality

-   **Pricing Calculation**: The script calculates pricing based on the black market exchange rate of the US dollar.
