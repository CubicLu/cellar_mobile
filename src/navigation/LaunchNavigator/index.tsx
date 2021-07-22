import {createStackNavigator} from 'react-navigation-stack';

import Routes from '../../constants/navigator-name';
import {CarouselScreen, LaunchScreen, LoginScreen, RegisterScreen, InviteRequestScreen} from '../../screens';
import {createSwitchNavigator} from 'react-navigation';

const LaunchStack = createStackNavigator(
  {
    [Routes.launch.name]: LaunchScreen,
    [Routes.register.name]: RegisterScreen,
    [Routes.signIn.name]: LoginScreen,
    [Routes.carouselScreen.name]: CarouselScreen,
  },
  {
    initialRouteName: Routes.launch.name,
    headerMode: 'none',
    mode: 'modal',
  },
);
export default createSwitchNavigator(
  {
    [Routes.inviteRequest.name]: InviteRequestScreen,
    Launch: LaunchStack,
  },
  {
    initialRouteName: Routes.inviteRequest.name,
  },
);
