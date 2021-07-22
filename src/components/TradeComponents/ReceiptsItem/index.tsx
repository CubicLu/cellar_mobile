import React, {FC} from 'react';
import {View, Text, StyleSheet, Alert, TouchableOpacity} from 'react-native';
import textStyle from '../../../constants/Styles/textStyle';
import moment from 'moment';
import {NavigationScreenProp} from 'react-navigation';
import {useLazyQuery} from 'react-apollo';
import {GET_TRANSACTION_RECEIPT} from '../../../apollo/queries/trading';
import RNProgressHud from 'progress-hud';
import {Routes} from '../../../constants';

type Props = {
  price: number;
  date: string;
  wineTitle: string;
  navigation: NavigationScreenProp<any>;
  tradeOfferId: number;
  transactionReceipt: object;
};

const ReceiptsItemContainer: FC<Props> = ({price, date, wineTitle, navigation, tradeOfferId}) => {
  const [getReceipt] = useLazyQuery(GET_TRANSACTION_RECEIPT, {
    variables: {tradeOfferId: tradeOfferId},
    onCompleted: data => {
      RNProgressHud.dismiss();
      navigation.navigate(Routes.tradingReceiptScreen.name, {receiptDetails: data.transactionReceipt});
    },
    onError: error => {
      RNProgressHud.dismiss();
      Alert.alert(error.message);
    },
    fetchPolicy: 'no-cache',
  });

  return (
    <TouchableOpacity onPress={() => getReceipt()}>
      <View style={receiptContainer}>
        <View style={receiptDetails}>
          <Text style={dateText}>{moment(date).format('MM/DD/YYYY')}</Text>
          <Text style={[text, wineName]}>{wineTitle}</Text>
        </View>
        <View style={receiptPrice}>
          <Text style={[text, winePrice]}>{`$${price}`}</Text>
          <Text style={[text, winePrice, showMore]}>Show more</Text>
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
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  showMore: {
    fontSize: 14,
    color: '#E6750E',
  },
});

const {receiptContainer, receiptPrice, receiptDetails, text, dateText, wineName, winePrice, showMore} = styles;

export const ReceiptsItem = ReceiptsItemContainer;
