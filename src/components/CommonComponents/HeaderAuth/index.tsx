import React from 'react';
import {Text, StyleSheet, TouchableOpacity, Image, View, Platform} from 'react-native';

import Images from '../../../assets/images';
import Colors from '../../../constants/colors';
import Navigation from '../../../types/navigation';

interface HeaderProps {
  navigation: Navigation;
  onPress: () => void;
  disabled?: boolean;
  text: string;
  showXMark?: boolean;
}

const Header: React.FC<HeaderProps> = ({navigation, onPress, disabled, text, showXMark}) => {
  return (
    <View style={[statusBarContainer, {justifyContent: showXMark ? 'space-between' : 'flex-end'}]}>
      {showXMark && (
        <TouchableOpacity
          style={{
            height: '100%',
            width: 50,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => navigation.popToTop()}>
          <Image source={Images.xMark} style={{width: 30, height: 30}} />
        </TouchableOpacity>
      )}
      <TouchableOpacity disabled={disabled} style={{opacity: disabled ? 0.5 : 1}} onPress={onPress}>
        <Text style={{color: 'black', fontSize: 24}}>{text}</Text>
      </TouchableOpacity>
    </View>
  );
};
export const HeaderAuth = Header;

const styles = StyleSheet.create({
  statusBarContainer: {
    height: Platform.select({ios: 80, android: 60}),
    backgroundColor: 'white',
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft: 20,
    paddingRight: 20,
    shadowOffset: {width: 0, height: 3},
    shadowColor: 'black',
    shadowOpacity: 0.4,
  },
});
const {statusBarContainer} = styles;
