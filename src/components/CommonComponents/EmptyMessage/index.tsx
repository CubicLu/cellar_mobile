import React from 'react';
import {Text, StyleSheet, View, Image} from 'react-native';
import Images from '../../../assets/images';
import Colors from '../../../constants/colors';
interface EmptyProps {
  emptyMessage: string;
}

const Empty: React.FC<EmptyProps> = ({emptyMessage}) => {
  return (
    <View style={container}>
      <Image source={Images.wineIcon} style={{height: 100, width: 100}} />
      <Text style={text}>{emptyMessage}</Text>
    </View>
  );
};
export const EmptyMessage = Empty;

const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    alignItems: 'center',
    borderTopWidth: 2,
    borderColor: Colors.lightGray,
  },
  text: {
    textAlign: 'center',
    fontSize: 25,
    marginBottom: 200,
  },
});

const {container, text} = style;
