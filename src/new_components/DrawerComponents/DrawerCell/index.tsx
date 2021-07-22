import React from 'react';
import {Text, StyleSheet, TouchableHighlight, View} from 'react-native';

import Colors from '../../../constants/colors';
import textStyle from '../../../constants/Styles/textStyle';

interface CellItemProps {
  image: any;
  title: string;
  onPress: () => void;
  indicator?: boolean;
}

const CellItem: React.FC<CellItemProps> = ({image, title, onPress, indicator = false}) => {
  return (
    <TouchableHighlight onPress={onPress} style={container} activeOpacity={1} underlayColor={Colors.darkRedDrawer}>
      <>
        <View style={imageStyle}>{image}</View>
        <Text maxFontSizeMultiplier={1.15} style={text}>
          {title}
        </Text>
        {indicator && <View style={indicatorStyles} />}
      </>
    </TouchableHighlight>
  );
};
export const DrawerNewUICell = CellItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 40,
    paddingRight: 19,
  },
  imageStyle: {
    marginRight: 20,
  },
  text: {
    fontSize: 24,
    color: 'white',
    ...textStyle.mediumText,
    width: '80%',
  },
  indicatorStyles: {
    width: 10,
    height: 10,
    borderRadius: 10,
    backgroundColor: Colors.orangeDashboard,
    alignSelf: 'center',
    paddingBottom: 5,
  },
});
const {container, imageStyle, text, indicatorStyles} = styles;
