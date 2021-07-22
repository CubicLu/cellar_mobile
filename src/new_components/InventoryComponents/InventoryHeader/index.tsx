import React from 'react';
import {Text, StyleSheet, View, Dimensions} from 'react-native';
import textStyle from '../../../constants/Styles/textStyle';
import {InventoryIcon} from '../../../assets/svgIcons';

const screenWidth = Dimensions.get('screen').width;

const Header = () => {
  return (
    <View style={container}>
      <View>
        <InventoryIcon height={50} width={105} />
        <Text numberOfLines={1} allowFontScaling={false} adjustsFontSizeToFit style={text}>
          Inventory
        </Text>
      </View>
    </View>
  );
};
export const InventoryHeader = Header;

const styles = StyleSheet.create({
  container: {
    width: screenWidth - 60 * 2 - 100,
    marginLeft: 90,
    marginBottom: 30,
    marginTop: 20,
  },
  text: {
    fontSize: 45,
    color: 'white',
    ...textStyle.mediumText,
  },
});
const {container, text} = styles;
