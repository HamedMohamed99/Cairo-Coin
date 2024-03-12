
## Description

This Apps Script file is responsible for reading previously entered data in the Google Sheets, gathering and organizing it for sending to the server in a POST request. Additionally, it performs some operations such as calculating the price of gold ingots for each source of gold pricing and calculating the selling price for the US dollar in the black market. It also compares it with the price in the sheets, giving priority to the sheet's price if it is lower than the purchase price.

### Functionality

-   **Data Reading and Gathering**: The script reads previously entered data in the Google Sheets, gathers it, and organizes it for further processing.
-   **Gold Ingots Price Calculation**: The script calculates the price of gold ingots for each source of gold pricing.
-   **Selling Price Calculation**: It calculates the selling price for the US dollar in the black market and compares it with the price in the sheets, giving priority to the sheet's price if it is lower than the purchase price.
-   **Server Communication**: It sends the gathered and organized data to the server in a POST request.
