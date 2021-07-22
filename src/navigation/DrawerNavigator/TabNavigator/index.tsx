import {createBottomTabNavigator} from 'react-navigation-tabs';
import React from 'react';
import {BottomTabBarComponent} from '../../../components';
import {InventorySwitchNavigator} from '../NewInventoryStack';
import {CommunitySwitchNavigator, LiveCommunityStack} from '../CommunityNavigator';
import textStyle from '../../../constants/Styles/textStyle';
import {HomeIcon, LivePhotoIcon, ReviewTabIcon, TabCommunityIcon} from '../../../assets/svgIcons';
import {ReviewStack} from '../ReviewNavigator';
import {Routes} from '../../../constants';

export const BottomTabNavigator = createBottomTabNavigator(
  {
    InventoryTab: {
      screen: InventorySwitchNavigator,
      navigationOptions: {
        title: 'Home',
        tabBarIcon: ({tintColor}) => {
          return <HomeIcon color={tintColor} width={18} height={22} />;
        },
      },
    },
    [Routes.ReviewTab.name]: {
      screen: ReviewStack,
      navigationOptions: {
        title: 'Review',
        tabBarIcon: ({tintColor}) => {
          return <ReviewTabIcon color={tintColor} width={18} height={22} />;
        },
      },
    },
    CommunityTab: {
      screen: CommunitySwitchNavigator,
      navigationOptions: {
        title: 'Community',

        tabBarIcon: ({tintColor}) => {
          return <TabCommunityIcon color={tintColor} width={18} height={22} />;
        },
      },
    },
    LivePhotoTab: {
      screen: LiveCommunityStack,
      navigationOptions: {
        title: 'Live',

        tabBarIcon: ({tintColor}) => {
          return <LivePhotoIcon color={tintColor} width={25} height={22} />;
        },
      },
    },
  },
  {
    tabBarComponent: BottomTabBarComponent,
    tabBarOptions: {
      activeTintColor: '#fff',
      inactiveTintColor: 'gray',
      labelStyle: {
        ...textStyle.mediumText,
        fontSize: 14,
      },
      showLabel: true,
      style: {backgroundColor: '#64091C'},
    },
  },
);
