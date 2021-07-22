import React from 'react';
import {StyleSheet, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const Gradient = () => {
  return (
    <View style={container}>
      <LinearGradient colors={['transparent', 'black']} style={gradient} />
      <View style={blackView} />
    </View>
  );
};
export const BackgroundGradient = Gradient;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    height: '100%',
    width: '100%',
  },
  blackView: {height: '100%', width: '100%', backgroundColor: 'black'},
  gradient: {
    height: 400,
    width: '100%',
  },
});
const {container, blackView, gradient} = styles;
