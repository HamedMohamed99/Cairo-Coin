## Description

This repository contains Google Apps Script code files for automating tasks related to Google Sheets. The code collects data from multiple sources, performs calculations on a portion of the data, and then adds it to Google Sheets. Additionally, there is server code that reads all the data entered into the sheets, sorts it, and sends the data to a Django server as a POST request every 5 minutes. This process is driven by a time trigger in Google Sheets.


## Functionality

-   **Data Collection**: The code collects data from multiple sources, such as external APIs or other Google Sheets.
-   **Data Processing**: Calculations are performed on a portion of the collected data to derive insights or generate reports.
-   **Data Entry**: The processed data is then added to specific sheets within the Google Sheets document.
-   **Server Integration**: The server code reads all the data entered into the sheets, sorts it, and sends it to a Django server as a POST request every 5 minutes. This ensures that the server receives the latest data on a regular basis.
