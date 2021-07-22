import React, {useCallback, useRef, useState} from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import {WebView, WebViewMessageEvent, WebViewNavigation} from 'react-native-webview';

import Navigation from '../../../types/navigation';
import Colors from '../../../constants/colors';
import {HeaderWithChevron} from '../../HeaderWithChevron';

interface InventoryProps {
  navigation: Navigation;
}

const WebViewInfo: React.FC<InventoryProps> = ({navigation}) => {
  const token = navigation.getParam('token', {});
  const uri = navigation.getParam('link', '');
  const callback = navigation.getParam('callback', '');

  const [navState, setNavState] = useState<WebViewNavigation>();
  const [title, setTitle] = useState('');
  const webViewRef = useRef(null);

  const goBack = useCallback(() => {
    if (navState && uri !== navState.url) {
      webViewRef.current.goBack();
    } else {
      navigation.goBack();
    }
  }, [navState]);

  const onNavigationStateChange = (state: WebViewNavigation) => {
    if (state.title) {
      setTitle(state.title);
    }

    setNavState(state);
  };

  let INJECTED_JS = `window.localStorage.setItem("token","${token}"); \n`;

  const onMessage = useCallback(
    (e: WebViewMessageEvent) => {
      const data = JSON.parse(e.nativeEvent.data);

      if (data.hasOwnProperty('download') && data.download) {
        callback();
      }

      console.log();
    },
    [callback],
  );

  return (
    <SafeAreaView style={safeContainer}>
      <HeaderWithChevron title={title} customBack={goBack} />
      <WebView
        source={{uri}}
        ref={webViewRef}
        startInLoadingState={true}
        injectedJavaScript={INJECTED_JS}
        onNavigationStateChange={onNavigationStateChange}
        onMessage={onMessage}
      />
    </SafeAreaView>
  );
};

export const WebViewInfoScreen = WebViewInfo;

const style = StyleSheet.create({
  safeContainer: {height: '100%', backgroundColor: 'black', flex: 1},
  backContainer: {
    backgroundColor: Colors.dashboardRed,
  },
  backTouchable: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const {backContainer, backTouchable, safeContainer} = style;
