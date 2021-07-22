import React, {FC} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Foundation from 'react-native-vector-icons/Foundation';

import textStyle from '../../../constants/Styles/textStyle';
import colors from '../../../constants/colors';

type Props = {
  rating: number;
  size?: number;
};

export const RateValue: FC<Props> = ({rating, size = 15}) => {
  return (
    <View style={container}>
      <Foundation name="star" color={colors.orangeDashboard} size={size} />
      <Text style={[rateText, {fontSize: size - 1}]}> {rating}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flexDirection: 'row', alignItems: 'center', marginLeft: 5},
  rateText: {...textStyle.mediumText, fontSize: 14, color: '#fff'},
});

const {container, rateText} = styles;
