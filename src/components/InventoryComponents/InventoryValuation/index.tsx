import React, {FC} from 'react';
import {View, Text, StyleSheet, TextProps} from 'react-native';

import textStyle from '../../../constants/Styles/textStyle';
import {formatInventoryValuation} from '../../../utils/currencies';
import colors from '../../../constants/colors';

type valuationDataType = {
  valuation: number;
  currency?: string;
  quantity?: number;
  marketValuation: number;
};

type Props = {
  data?: valuationDataType;
};

const PriceProps: TextProps = {
  numberOfLines: 1,
  adjustsFontSizeToFit: true,
};

const Valuation: FC<Props> = ({data}) => {
  return (
    <View style={container}>
      <View style={[valuationCell, blackBg]}>
        <Text {...PriceProps} style={[valuationText, valuationPrice]}>
          ${formatInventoryValuation(data.valuation || 0)}
        </Text>
        <Text style={valuationText}>Cellar Value</Text>
      </View>
      <View style={[valuationCell, grayBg]}>
        <Text {...PriceProps} style={[valuationText, valuationPrice]}>
          ${formatInventoryValuation(data.marketValuation || 0)}
        </Text>
        <Text style={valuationText}>Est. Market Price</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flexDirection: 'row', paddingBottom: 10},
  blackBg: {backgroundColor: '#000'},
  valuationCell: {
    backgroundColor: '#000',
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 10,
    justifyContent: 'space-between',
  },
  grayBg: {backgroundColor: colors.dashboardDarkTab},

  valuationPrice: {...textStyle.boldText, fontSize: 25},
  valuationText: {textAlign: 'center', color: '#fff', ...textStyle.mediumText, fontSize: 15},
});

const {container, valuationCell, valuationText, valuationPrice, grayBg, blackBg} = styles;

export const InventoryValuation = Valuation;
