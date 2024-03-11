
## Description

This part contains a two projects of React Native Expo apps that utilizes a WebView to display a website within the mobile app. The WebView is customized to inject JavaScript code to the website every time the user navigates back to the app, allowing for real-time data updates.

**The project includes features such as:**
-   **Customized loading page:** When the app is opened, a customized loading page is displayed to the user. This loading page disappears after the WebView has fully loaded the website.
-   **Handling internet connection:** The app checks for internet connectivity and displays an error page if there is no internet connection or if the connection is slow.
-   **Handling errors in WebView:** The app handles errors that occur within the WebView, such as if the website fails to load.
-   **JavaScript injection:** JavaScript code is injected into the website every time the user navigates back to the app, enabling data updates.


## Project Structure

-   `App.js`: This file contains the main component of the app, which renders the WebView and implements the described features.
-   `Loader.js`: This file contains a loader component used for displaying loading indicators.
-   `PageLoader.js`: This file contains a component for displaying a loading indicator with progress.

## Screenshots

![plus](https://i.ibb.co/QvnbFww/plus-frameless.png)
--
![lite](https://i.ibb.co/9r6rV3R/lite-frameless.png)
### Dependencies
-   `react-native`
-   `react-native-webview`
-   `@react-native-community/netinfo`
