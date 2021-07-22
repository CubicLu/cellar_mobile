import React, {FC} from 'react';
import {withNavigation, NavigationScreenProp, NavigationEvents} from 'react-navigation';
import {getStatusBarHeight} from 'react-native-iphone-x-helper';

import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Keyboard,
  ImageSourcePropType,
  StyleProp,
  ViewStyle,
  StatusBar,
  TextStyle,
  Dimensions,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';

import {ChevronLeftIcon, BurgerIcon} from '../../../assets/svgIcons';

import Colors from '../../../constants/colors';
import textStyle from '../../../constants/Styles/textStyle';

const screenHeight = Dimensions.get('screen').height;

type Props = {
  text: string;
  asideSrc: ImageSourcePropType;
  navigation: NavigationScreenProp<any>;
  renderHeaderRightButton?: () => React.ReactNode;
  headerTitleStyle?: StyleProp<ViewStyle>;
  headerTitleTextStyle?: StyleProp<TextStyle>;
  headerLeftContainerStyle?: StyleProp<ViewStyle>;
  customBackRoute?: string;
  drawer?: boolean;
};

const Header: FC<Props> = ({
  children,
  navigation,
  text,
  asideSrc,
  renderHeaderRightButton,
  headerTitleStyle,
  customBackRoute,
  headerTitleTextStyle,
  headerLeftContainerStyle,
  drawer,
}) => {
  return (
    <View style={container}>
      <NavigationEvents
        onWillFocus={() => {
          StatusBar.setBarStyle('light-content');
        }}
      />
      <ImageBackground source={asideSrc} style={asideImg} resizeMode={'cover'} />
      {drawer ? (
        <TouchableOpacity
          style={[leftBtnContainer, headerLeftContainerStyle && headerLeftContainerStyle, {}]}
          onPress={() => {
            navigation.openDrawer();
            Keyboard.dismiss();
          }}>
          <BurgerIcon height={25} width={20} />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={[leftBtnContainer, headerLeftContainerStyle && headerLeftContainerStyle, {}]}
          onPress={() => {
            customBackRoute ? navigation.navigate(customBackRoute) : navigation.goBack();
            Keyboard.dismiss();
          }}>
          <ChevronLeftIcon height={25} width={20} />
        </TouchableOpacity>
      )}

      {renderHeaderRightButton && <View style={rightBtnContainer}>{renderHeaderRightButton()}</View>}
      <KeyboardAvoidingView style={keyboardAvoiding} behavior={'padding'}>
        <ScrollView contentContainerStyle={{flexGrow: 1}}>
          <View style={[headerTitleContainer, headerTitleStyle && headerTitleStyle]}>
            <Text
              numberOfLines={2}
              allowFontScaling={false}
              style={[
                headerText,
                headerTitleTextStyle && headerTitleTextStyle,
                renderHeaderRightButton && {paddingRight: 80},
              ]}>
              {text}
            </Text>
          </View>
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#000', paddingTop: getStatusBarHeight(true)},
  headerText: {
    ...textStyle.mediumText,
    fontSize: 35,
    color: 'white',
  },
  headerTitleContainer: {
    height: 80,
    marginBottom: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    flexShrink: 1,
  },
  leftBtnContainer: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.dashboardRed,
    marginRight: 20,
    alignSelf: 'flex-start',
    position: 'absolute',
    left: 0,
    top: getStatusBarHeight(true),
    zIndex: 1,
  },
  rightBtnContainer: {
    flex: 1,
    position: 'absolute',
    right: 0,
    top: getStatusBarHeight(true),
    zIndex: 1,
  },
  asideImg: {
    position: 'absolute',
    top: getStatusBarHeight(true) + 80,
    left: 0,
    width: 80,
    height: screenHeight,
  },
  keyboardAvoiding: {
    flex: 1,
    paddingLeft: 100,
    paddingRight: 20,
  },
});

const {
  headerText,
  leftBtnContainer,
  asideImg,
  headerTitleContainer,
  rightBtnContainer,
  container,
  keyboardAvoiding,
} = styles;

export const HeaderWithAside = withNavigation(Header);
