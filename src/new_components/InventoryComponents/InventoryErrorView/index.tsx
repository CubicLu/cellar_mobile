import React from 'react';
import {Text, StyleSheet, View} from 'react-native';
import textStyle from '../../../constants/Styles/textStyle';

const Error = ({message}) => {
  return (
    <View style={container}>
      <Text style={text}>{message}</Text>
    </View>
  );
};
export const InventoryErrorView = Error;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    ...textStyle.mediumText,
    color: 'white',
  },
});
const {container, text} = styles;
