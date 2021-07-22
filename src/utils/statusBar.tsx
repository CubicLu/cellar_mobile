import {Platform, StatusBar} from 'react-native';

export const statusBarColorChange = (navigation, barStyle) => {
  navigation.addListener('willFocus', () => {
    StatusBar.setBarStyle(barStyle);
    {
      Platform.OS === 'android' && StatusBar.setBackgroundColor('black');
    }
  });
};
