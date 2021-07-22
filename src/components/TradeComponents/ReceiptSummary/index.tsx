import React, {FC} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import colors from '../../../constants/colors';
import textStyle from '../../../constants/Styles/textStyle';

type Props = {
  cartItems: {label: string; amount: number}[];
};

export const ReceiptSummary: FC<Props> = ({cartItems}) => {
  return (
    <View style={container}>
      {cartItems.map(({label, amount}, index) => {
        return (
          <View style={[totalContainer, !(index % 2) && blackPerlBackground]} key={label}>
            <Text style={[totalText, index === cartItems.length - 1 && boldText]}>{label}</Text>
            <Text style={[totalText, totalTextPrice, index === cartItems.length - 1 && boldText]}>{amount}</Text>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {marginHorizontal: 20, marginVertical: 20},
  totalContainer: {flexDirection: 'row', paddingVertical: 5, paddingHorizontal: 5},
  blackPerlBackground: {backgroundColor: colors.inventoryItemBg},
  totalText: {color: '#fff', flex: 1, fontSize: 20, ...textStyle.mediumText},
  totalTextPrice: {textAlign: 'right'},
  boldText: {...textStyle.boldText},
});

const {container, totalContainer, blackPerlBackground, totalText, totalTextPrice, boldText} = styles;
