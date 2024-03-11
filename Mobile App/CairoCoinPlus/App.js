import React from 'react';
import { WebView } from "react-native-webview";
import { View, StatusBar, Image, Text, AppState } from 'react-native';
import NetInfo from "@react-native-community/netinfo";
import Loader from './Loader';
import PageLoader from './PageLoader';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      webViewLoaded: false,
      isConnected: true,
      showTimeoutView: false,
      errorOccurred: false,
      timeoutId: null,
      loadingProgress: 0,
      appState: AppState.currentState // Initialize app state
    };
  }

  componentDidMount() {
    // Subscribe to network state changes
    NetInfo.addEventListener(state => {
      this.setState({ isConnected: state.isConnected });
    });

    // Subscribe to app state changes
    AppState.addEventListener('change', this.handleAppStateChange);

    // Set a timeout to display the timeout view after 10 seconds
    const timeoutId = setTimeout(() => {
      this.setState({ showTimeoutView: true });
    }, 20000); // 20000 milliseconds = 20 seconds

    this.setState({ timeoutId });
  }

  handleAppStateChange = (nextAppState) => {
    if (this.state.appState === 'active' && nextAppState !== 'active') {
      // App has gone to the background or inactive, clear the interval
    } else if (this.state.appState !== 'active' && nextAppState === 'active') {
      // App has come to the foreground, start the interval and call getHomeSubDate
      if (this.webViewRef) {
        this.webViewRef.injectJavaScript('getHomeSubDate();');
      } else {
        console.warn('webViewRef is not yet initialized');
      }
    }
    this.setState({ appState: nextAppState });
  };


  handleWebViewError() {
    // Handle WebView error
    this.setState({ errorOccurred: true });
  }

  handleWebViewLoad() {
    // Clear the timeout when the web view is loaded successfully
    const { timeoutId } = this.state;
    clearTimeout(timeoutId);
    this.setState({ showTimeoutView: false, webViewLoaded: true });
  }

  handleLoadProgress = ({ nativeEvent }) => {
    const { progress } = nativeEvent;
    this.setState({ loadingProgress: progress * 100 });
  }

  render() {
    const { isConnected, showTimeoutView, errorOccurred, loadingProgress } = this.state;
    const INJECTEDJAVASCRIPT = `const meta = document.createElement('meta'); meta.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta); `

    // Render timeout view if no internet connection or timeout occurred
    if (!isConnected) {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: "center", backgroundColor: '#1f1f1f' }}>
          <Image
            source={require('./assets/splash-blank.png')}
            resizeMode="cover"
            style={{ width: '100%', height: '100%', backgroundColor: '#1f1f1f', position: 'absolute' }}
          />
          <Text style={{ fontSize: 30, color: '#ffffff80', paddingBottom: 10, fontWeight: 900 }}>No internet connection</Text>
          <View style={{ paddingTop: 600, position: 'absolute' }}>
            <Loader />
          </View>
        </View>
      );
    } else if(showTimeoutView || errorOccurred){
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent:"center" , backgroundColor: '#1f1f1f'}}>
          <Image
            source={require('./assets/splash-blank.png')}
            resizeMode="cover"
            style={{ width: '100%', height: '100%', backgroundColor: '#1f1f1f', position: 'absolute' }}
          />
          <Text style={{ fontSize: 30, color: '#ffffff80', paddingBottom: 10, fontWeight: 900}}>Bad internet connection</Text>
          <View style={{paddingTop: 600,  position: 'absolute'}}>
                <Loader /> 
          </View>
        </View>
      );
    }

    // Render web view if connected and no timeout
    return (
      <View style={{ flex: 1, backgroundColor: '#1f1f1f' }}>
        <StatusBar backgroundColor="#1f1f1f" barStyle="light-content" />
        {!this.state.webViewLoaded && (
          <View style={{ alignItems: 'center', justifyContent: "center", position: 'relative' }}>
            <Image
              source={require('./assets/splash.png')}
              resizeMode="cover"
              style={{ width: '100%', height: '100%', backgroundColor: '#1f1f1f' }}
            />
            <View style={{ paddingTop: 600, position: 'absolute' }}>
              <PageLoader progress={loadingProgress} />
            </View>
          </View>
        )}
        
        <WebView
          ref={webViewRef => this.webViewRef = webViewRef}
          source={{ uri: 'https://cairo-coin.azurewebsites.net/Plus/home' }}
          userAgent="UserFromAppPlus"
          style={{ flex: 1, marginTop: 0, backgroundColor: '#1f1f1f' }}
          injectedJavaScript={INJECTEDJAVASCRIPT}
          scrollEnabled
          onLoadProgress={this.handleLoadProgress}
          onLoad={() => this.handleWebViewLoad()}
          onError={() => this.handleWebViewError()}
        />
      </View>
    );
  }
}