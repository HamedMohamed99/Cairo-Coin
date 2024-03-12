## Description

This Apps Script files is responsible for fetching data from a specified sources URL. It utilizes regular expressions to extract the targeted data from the fetched content. Once the data is extracted, it appends it to the top of its respective column in the Google Sheets document.
The script attempts to fetch the data three times. If all attempts fail, it triggers an error


## Functionality

-   **Data Fetching**: The script fetches data from a specified source URL.
-   **Data Extraction**: Regular expressions are used to extract the targeted data from the fetched content.
-   **Data Appending**: The extracted data is appended to the top of its respective column in the Google Sheets document.
- **Error Handling**: If all fetch attempts fail, the script triggers an error
