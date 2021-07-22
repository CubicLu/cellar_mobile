import React, {FC, ReactNode} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ViewStyle, StyleProp, TextStyle} from 'react-native';
import {NavigationScreenProp, withNavigation} from 'react-navigation';

import textStyle from '../../../constants/Styles/textStyle';
import {BurgerIcon} from '../../../assets/svgIcons';
import Colors from '../../../constants/colors';

type Props = {
  text: string;
  navigation: NavigationScreenProp<any>;
  titleContainerStyle?: StyleProp<ViewStyle>;
  titleTextStyle?: StyleProp<TextStyle>;
  renderRightButton?: () => ReactNode;
};

const BurgerHeader: FC<Props> = ({text, navigation, titleContainerStyle, titleTextStyle, renderRightButton}) => {
  return (
    <View style={container}>
      <View style={burgerContainer}>
        <TouchableOpacity style={burgerTouchable} onPress={() => navigation.openDrawer()}>
          <BurgerIcon height={13} width={20} />
        </TouchableOpacity>
      </View>
      <View style={[titleContainer, titleContainerStyle]}>
        <Text numberOfLines={1} allowFontScaling={false} adjustsFontSizeToFit style={[titleText, titleTextStyle]}>
          {text}
        </Text>
      </View>
      {renderRightButton && renderRightButton()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flexDirection: 'row', height: 80},
  burgerContainer: {
    width: 80,
    backgroundColor: Colors.dashboardRed,
    position: 'absolute',
    zIndex: 3,
  },
  burgerTouchable: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {color: '#fff', ...textStyle.mediumText, fontSize: 35, marginRight: 20},
  titleContainer: {marginLeft: 90, alignItems: 'center', justifyContent: 'center', flex: 1},
});

const {burgerContainer, burgerTouchable, titleText, titleContainer, container} = styles;

export const HeaderWithBurger = withNavigation(BurgerHeader);
