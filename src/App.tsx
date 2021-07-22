import React from 'react';
import {createAppContainer, NavigationContainer} from 'react-navigation';
import {Text, TextInput, TouchableOpacity, YellowBox} from 'react-native';
import AppNavigation from './navigation';
import {setTopLevelNavigator} from './utils/navigation.service';
import codePush from 'react-native-code-push';
import APP_CONFIG from './constants/config';
import {ForceUpdate} from './components';

console.disableYellowBox = true;
YellowBox.ignoreWarnings(['Task orphaned', 'Require cycle: node_modules', 'Missing field']);

const AppContainer: NavigationContainer = createAppContainer(AppNavigation);

// @ts-ignore
TouchableOpacity.defaultProps = {...TouchableOpacity.defaultProps, activeOpacity: 0.7};

// @ts-ignore
TextInput.defaultProps = Text.defaultProps || {};
// @ts-ignore
TextInput.defaultProps.allowFontScaling = false;

/**
 * Code Push default initialization according to official doc.
 * Check for update on every app resume
 */
let codePushOptions = {
  checkFrequency: __DEV__ ? codePush.CheckFrequency.MANUAL : codePush.CheckFrequency.ON_APP_RESUME,
  installMode: APP_CONFIG.EXTERNAL_BUILD ? codePush.InstallMode.ON_NEXT_RESUME : codePush.InstallMode.IMMEDIATE,
};

const App = () => {
  return (
    <ForceUpdate>
      <AppContainer
        ref={navRef => {
          setTopLevelNavigator(navRef);
        }}
      />
    </ForceUpdate>
  );
};

//HOC for codePush
export default codePush(codePushOptions)(App);
