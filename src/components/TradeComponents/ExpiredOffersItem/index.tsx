import React, {FC} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import textStyle from '../../../constants/Styles/textStyle';
import moment from 'moment';

type Props = {
  price: number;
  date: string;
  wineTitle: string;
  tradeOfferId: number;
  updatedAt: Date;
  onPress: () => void;
};

const ExpiredOffer: FC<Props> = ({price, date, wineTitle, updatedAt, onPress}) => {
  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
      <View style={receiptContainer}>
        <View style={receiptDetails}>
          <View style={receiptDate}>
            <Text style={dateText}>{moment(date).format('L')}</Text>
          </View>
          <Text style={[text, wineName]}>{wineTitle}</Text>
        </View>
        <View style={receiptPrice}>
          <Text style={[text, winePrice]}>{`$${price}`}</Text>
          <Text style={[text, winePrice, dateNodeText]}>{moment(updatedAt).fromNow()}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  receiptContainer: {
    backgroundColor: '#041B1E',
    width: '100%',
    height: 97,
    marginVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  receiptDate: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  receiptDetails: {
    width: '70%',
  },
  receiptPrice: {
    width: '30%',
    height: 50,
    justifyContent: 'space-between',
  },
  dateText: {
    color: 'white',
    fontSize: 16,
    lineHeight: 21,
    ...textStyle.robotoRegular,
  },
  wineName: {
    paddingVertical: 5,
    fontSize: 16,
    ...textStyle.robotoBold,
  },
  winePrice: {
    fontSize: 20,
    textAlign: 'right',
  },
  text: {
    color: 'white',
    lineHeight: 21,
    ...textStyle.robotoBold,
  },
  dateNodeText: {
    fontSize: 14,
    color: 'white',
  },
});

const {
  receiptContainer,
  receiptPrice,
  receiptDetails,
  receiptDate,
  text,
  dateText,
  wineName,
  winePrice,
  dateNodeText,
} = styles;

export const ExpiredOfferItem = ExpiredOffer;
