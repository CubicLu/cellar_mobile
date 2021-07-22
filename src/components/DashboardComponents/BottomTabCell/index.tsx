import React from 'react';
import {Text, StyleSheet, Image, TouchableOpacity} from 'react-native';

interface CellItemProps {
  backgroundColor: string;
  onPress: () => void;
  item: string;
  image: any;
}

const BottomCell: React.FC<CellItemProps> = ({onPress, item, backgroundColor, image}) => {
  return (
    <TouchableOpacity onPress={onPress} style={[container, {backgroundColor: backgroundColor}]}>
      <Image source={image} style={imageStyle} />
      <Text style={text}>{item.replace(/^\w/, c => c.toUpperCase())}</Text>
    </TouchableOpacity>
  );
};
export const BottomTabCell = BottomCell;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    width: 120,
  },
  imageStyle: {
    height: 30,
    width: 30,
  },
  text: {
    fontSize: 20,
  },
});
const {container, imageStyle, text} = styles;
