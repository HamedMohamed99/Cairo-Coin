
# CairoCoin Django Full Stack

This part of the repository contains a Django full stack project consisting of two Django apps: `CairoCoin` and `CairoCoinPlus`.

## CairoCoin App

The `CairoCoin` app is designed to receive data from Google Sheets, process it, and save it to the PostgreSQL database. Additionally, it performs calculations on this data, such as applying a factor to the black market dollar price and calculating the daily change rate. Moreover, it calculates both daily and instantaneous indicators and retrieves the credit rating of Egypt from S&P and Moody's.

### Functionality

-   **Data Reception**: Receives data from Google Sheets.
-   **Data Processing**: Applies various calculations and manipulations to the received data.
-   **Database Storage**: Saves processed data to the PostgreSQL database.
-   **Indicators Calculation**: Computes daily and instantaneous indicators.
-   **Credit Rating Retrieval**: Retrieves the credit rating of Egypt from S&P and Moody's.

### Endpoints

-   `/api/v1/binance`: Endpoint to fetch binance data.
-   `/api/v1/black-market`: Endpoint to fetch black market data.
-   `/api/v1/gold`: Endpoint to fetch gold data.
-   `/api/v1/credit-rating`: Endpoint to fetch credit rating data.
-   `/api/v1/cib-arbitrage`: Endpoint to fetch cib arbitrage data.
-   `/api/v1/bankrate`: Endpoint to fetch bank rate data.
-   `/api/v1/blackmarket-foreigncurrency`: Endpoint to fetch blackmarket foreigncurrency data.
-   `/api/v1/bankrate-foreigncurrency`: Endpoint to fetch bankrate foreigncurrency data.

## CairoCoinPlus App

The `CairoCoinPlus` app consists of two frontend interfaces.

### Interface 1: API Account Management

This interface allows users to create API accounts and verify their emails by sending OTPs. Users can use these accounts to generate API keys and manage token usage.

### Interface 2: Lite Interface

This interface is designed for regular users to view some of the processed data in a lightweight manner.

### Functionality

-   **API Account Creation**: Allows users to create API accounts.
-   **Email Verification**: Sends OTPs for email verification.
-   **API Key Generation**: Generates API keys for authenticated users.
-   **Token Usage Management**: Enables users to manage token usage for API calls.
