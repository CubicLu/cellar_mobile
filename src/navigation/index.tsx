import React from 'react';
import {createAppContainer} from 'react-navigation';
import createAnimatedSwitchNavigator from 'react-navigation-animated-switch';
import {Transition} from 'react-native-reanimated';
import AuthNavigator from './AuthNavigator';
import AuthProfileStack from './AuthNavigator/AuthProfileStack';
import DrawerStackNavigator from './DrawerNavigator';

export default createAppContainer(
  // @ts-ignore
  createAnimatedSwitchNavigator(
    {
      Auth: AuthNavigator,
      ProfileAuth: AuthProfileStack,
      Drawer: DrawerStackNavigator,
    },
    {
      initialRouteName: 'Auth',
      transition: (
        <Transition.Together>
          <Transition.Out type="slide-left" durationMs={200} interpolation="easeInOut" />
        </Transition.Together>
      ),
    },
  ),
);
