import React, {FC} from 'react';
import {View, Text, StyleSheet} from 'react-native';

import textStyle from '../../../constants/Styles/textStyle';

export type SellerFooterProps = {
  totalPrice: number;
};

export const SellerFooter: FC<SellerFooterProps> = ({totalPrice}) => {
  return (
    <View>
      <View style={[totalPriceContainer]}>
        <Text style={totalText}>${totalPrice.toFixed(2)}</Text>
        <Text style={totalDescription}>Total price</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  totalPriceContainer: {
    backgroundColor: '#fff',
    alignItems: 'center',
    marginVertical: 20,
    marginHorizontal: 20,
  },
  totalText: {
    ...textStyle.boldText,
    fontSize: 40,
    paddingTop: 22,
    lineHeight: 53,
  },
  totalDescription: {
    ...textStyle.mediumText,
    fontSize: 16,
    paddingTop: 3,
    paddingBottom: 22,
    lineHeight: 21,
  },
});

const {totalPriceContainer, totalDescription, totalText} = styles;
