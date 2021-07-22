import React from 'react';
import {StyleSheet, Image, TouchableOpacity, Keyboard} from 'react-native';
import Images from '../../../assets/images';
interface EmptyProps {
  navigation: any;
}

const NavBar: React.FC<EmptyProps> = ({navigation}) => {
  return navigation.getParam('isDashboard', 'false') === 'true' ? (
    <TouchableOpacity
      style={touchableStyle}
      onPress={() => {
        Keyboard.dismiss();
        navigation.popToTop();
      }}>
      <Image source={Images.backArrow} style={{width: 30, height: 30}} resizeMode={'stretch'} />
    </TouchableOpacity>
  ) : (
    <TouchableOpacity
      style={touchableStyle}
      onPress={() => {
        Keyboard.dismiss();
        navigation.openDrawer();
      }}>
      <Image source={Images.burgerIcon} style={burgerIcon} resizeMode={'stretch'} />
    </TouchableOpacity>
  );
};
export const InventoryNavBar = NavBar;

const style = StyleSheet.create({
  burgerIcon: {
    width: 30,
    height: 20,
  },
  touchableStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    width: 60,
  },
});

const {burgerIcon, touchableStyle} = style;
