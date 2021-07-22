import React, {FC} from 'react';
import {View, Text, StyleSheet, StyleProp, ViewStyle, TextProps} from 'react-native';
import {selectScreenSize} from '../../../utils/other.utils';

import textStyle from '../../../constants/Styles/textStyle';

type Props = {
  containerStyles?: StyleProp<ViewStyle>;
  detailsObj: {
    bottles: number;
    pricePerBottle: number;
  };
};

const textProps: TextProps = {
  adjustsFontSizeToFit: true,
  allowFontScaling: false,
  numberOfLines: 1,
};

const PriceSummary: FC<Props> = ({containerStyles, detailsObj}) => {
  const {bottles, pricePerBottle} = detailsObj;
  return (
    <View style={[container, containerStyles && containerStyles]}>
      <View>
        <Text {...textProps} style={h1Text}>
          {bottles}
        </Text>
        <Text {...textProps} style={text}>
          Bottles
        </Text>
      </View>
      <View style={[flex1, paddingHorizontal]}>
        <Text {...textProps} style={h1Text}>
          ${pricePerBottle.toFixed(2)}
        </Text>
        <Text style={text}>Per Bottle</Text>
      </View>
      <View style={flex1}>
        <Text {...textProps} style={h1Text}>
          ${(bottles * pricePerBottle).toFixed(2)}
        </Text>
        <Text style={text} {...textProps}>
          TotalPrice
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  flex1: {flex: 1},
  container: {
    flexDirection: 'row',
    marginHorizontal: 20,
    alignItems: 'center',
  },
  h1Text: {
    fontSize: selectScreenSize(25, 40),
    color: '#fff',
    ...textStyle.boldText,
    textAlign: 'center',
  },
  text: {
    fontSize: selectScreenSize(14, 16),
    lineHeight: 21,
    ...textStyle.mediumText,
    color: '#fff',
    textAlign: 'center',
  },
  paddingHorizontal: {paddingHorizontal: 20},
});

const {container, h1Text, text, flex1, paddingHorizontal} = styles;

export const TradePriceSummary = PriceSummary;
