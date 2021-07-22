import React, {FC} from 'react';
import {View, Text, StyleSheet, TouchableWithoutFeedback, SafeAreaView} from 'react-native';
import {NavigationRoute} from 'react-navigation';
import {isIphoneX} from 'react-native-iphone-x-helper';

import CONFIG from '../../../constants/config';

const iphoneX: boolean = isIphoneX();

type Props = any;

const BottomTabBar: FC<Props> = props => {
  const {activeTintColor, inactiveTintColor, navigation, getLabelText, renderIcon, showLabel} = props;

  const renderTabBarButton = (route: NavigationRoute, idx: any) => {
    const currentIndex = navigation.state.index;
    const color = currentIndex === idx ? activeTintColor : inactiveTintColor;
    const label = getLabelText({route, focused: currentIndex === idx, index: idx});
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          if (currentIndex != idx) {
            navigation.navigate(route.routeName);
          } else {
            navigation.popToTop();
            navigation.popToTop();
          }
        }}
        key={route.routeName}>
        <View style={buttonContainer}>
          <View style={buttonIconContainer}>
            {renderIcon({route, tintColor: color, focused: currentIndex === idx, index: idx})}
          </View>
          {showLabel && (
            <Text allowFontScaling={false} numberOfLines={1} style={[{color}, buttonText, {...props.labelStyle}]}>
              {label}
            </Text>
          )}
        </View>
      </TouchableWithoutFeedback>
    );
  };

  let TabBars = navigation.state.routes.map((route, index) => renderTabBarButton(route, index));

  return (
    <SafeAreaView style={[barSafeContainer, props.style, iphoneX && largeScreenHeight]}>
      {TabBars}
      {/*<TouchableWithoutFeedback onPress={() => navigation.toggleDrawer()}>*/}
      {/*  <View style={barContainer}>*/}
      {/*    <Text style={[props.labelStyle, {color: props.inactiveTintColor}]}>Open drawer</Text>*/}
      {/*  </View>*/}
      {/*</TouchableWithoutFeedback>*/}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  largeScreenHeight: {height: CONFIG.IPHONE_X_BOTTOM_TAB_NAVIGATOR_HEIGHT},
  barSafeContainer: {
    height: CONFIG.NOT_IPHONE_X_BOTTOM_TAB_NAVIGATOR_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    height: '100%',
    marginTop: iphoneX ? 10 : 0,
  },
  buttonText: {textAlign: 'center'},
  buttonIconContainer: {justifyContent: 'center', alignItems: 'center'},
});

const {barSafeContainer, buttonContainer, buttonText, buttonIconContainer, largeScreenHeight} = styles;

export const BottomTabBarComponent = BottomTabBar;
