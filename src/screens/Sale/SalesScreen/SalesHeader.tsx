import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

import textStyle from '../../../constants/Styles/textStyle';

export default () => {
  return (
    <View style={container}>
      <Text numberOfLines={1} adjustsFontSizeToFit allowFontScaling={false} style={title}>
        Cellr Inventory
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingLeft: 90,
    paddingRight: 130,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {fontSize: 45, color: '#fff', ...textStyle.mediumText},
});

const {container, title} = styles;
