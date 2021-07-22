import {createStackNavigator} from 'react-navigation-stack';

import Routes from '../../constants/navigator-name';
import {LoginCodeScreen, SignUpCodeScreen} from '../../screens';
import LaunchNavigator from '../LaunchNavigator';
import {WebViewInfoScreen} from '../../components';

export default createStackNavigator(
  {
    LaunchNav: LaunchNavigator,
    [Routes.loginCode.name]: LoginCodeScreen,
    [Routes.signUpCode.name]: SignUpCodeScreen,
    [Routes.agreementScreen.name]: WebViewInfoScreen,
  },
  {
    initialRouteName: 'LaunchNav',
    headerMode: 'none',
  },
);
