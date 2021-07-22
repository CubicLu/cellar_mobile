import {Dimensions} from 'react-native';
import {createStackNavigator} from 'react-navigation-stack';

import {DrawerNewUIScreen} from '../../screens';
import {createDrawerNavigator} from 'react-navigation-drawer';

import {BottomTabNavigator} from './TabNavigator';

const width = Dimensions.get('window').width;

const stack = createDrawerNavigator(
  {
    drawerTab: BottomTabNavigator,
  },
  {contentComponent: DrawerNewUIScreen, drawerWidth: width - 71},
);

export default createStackNavigator(
  {
    MainDrawer: stack,
  },
  {
    initialRouteName: 'MainDrawer',
    headerMode: 'none',
  },
);
