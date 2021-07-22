import React from 'react';
import {Text, StyleSheet, Image, TouchableHighlight, ImageProps} from 'react-native';

import Colors from '../../../constants/colors';

interface CellItemProps {
  image: ImageProps;
  title: string;
  onPress: () => void;
}

const CellItem: React.FC<CellItemProps> = ({image, title, onPress}) => {
  return (
    <TouchableHighlight onPress={onPress} style={container} activeOpacity={1} underlayColor={Colors.lightGray}>
      <>
        <Image source={image} style={imageStyle} />
        <Text style={text}>{title}</Text>
      </>
    </TouchableHighlight>
  );
};
export const DrawerCell = CellItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  imageStyle: {
    height: 30,
    width: 30,
    marginRight: 30,
    opacity: 0.7,
  },
  text: {
    fontSize: 18,
  },
});
const {container, imageStyle, text} = styles;
