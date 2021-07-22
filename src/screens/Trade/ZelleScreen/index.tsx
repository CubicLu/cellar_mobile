import React, {FC, useEffect} from 'react';
import {View, Text, StyleSheet, SafeAreaView, ScrollView} from 'react-native';
import {useMutation} from '@apollo/react-hooks';
import {NavigationScreenProp} from 'react-navigation';

import {HeaderWithChevron, InputText, ReceiptSummary} from '../../../components';
import {GET_HASH_FOR_ZELLE} from '../../../apollo/mutations/trading';
import textStyle from '../../../constants/Styles/textStyle';
import colors from '../../../constants/colors';

type Props = {
  navigation: NavigationScreenProp<any>;
};

const removeBankFee = (cartItems: any[]) => {
  const filters = ['Bank fee', 'Total'];

  const cart = cartItems.filter(el => !filters.includes(el.label));

  let total = cart.reduce((t, c) => {
    return t + Number(c.amount);
  }, 0);

  return [...cart, {amount: total.toFixed(2), label: 'Total'}];
};

export const ZellePaymentScreen: FC<Props> = ({navigation}) => {
  const tradeOfferId = navigation.getParam('tradeOfferId');
  const totalPrice = navigation.getParam('totalPrice', '0');
  const cartItems = navigation.getParam('cartItems');

  const [getHashcode, {data}] = useMutation(GET_HASH_FOR_ZELLE, {
    variables: {
      tradeOfferId,
    },
    fetchPolicy: 'no-cache',
  });

  useEffect(() => {
    tradeOfferId && getHashcode();
  }, [tradeOfferId]);

  return (
    <View style={container}>
      <SafeAreaView>
        <ScrollView style={scrollContainer}>
          <HeaderWithChevron titleTextStyle={headerText} title="Pay with Zelle" />
          <View style={descriptionContainer}>
            <Text style={[informationText, descriptionText]}>
              Copy all the fields to Zelle application. {'\n'}When the payment will be received it will be processed
              manually.
            </Text>
          </View>

          <View style={rowContainer}>
            <Text style={informationText}>Amount</Text>
            <InputText
              leftIcon={<Text style={leftIcon}>$</Text>}
              leftIconContainerStyle={leftIconContainer}
              containerStyle={containerStyle}
              inputContainerStyle={amountInputContainer}
              selectTextOnFocus={true}
              value={`${totalPrice}`}
            />
          </View>
          <View style={rowContainer}>
            <Text style={informationText}>Recipient</Text>
            <InputText
              containerStyle={containerStyle}
              inputContainerStyle={inputContainerStyle}
              selectTextOnFocus={true}
              value="support@cellr.com"
            />
          </View>

          <View style={rowContainer}>
            <Text style={informationText}>Payment description</Text>
            <InputText
              containerStyle={containerStyle}
              inputContainerStyle={inputContainerStyle}
              multiline
              selectTextOnFocus={true}
              value={data && data.getTradeOfferHash}
            />
          </View>
          <Text style={[informationText, warning]}>Don't modify the Payment description field!</Text>

          <ReceiptSummary cartItems={removeBankFee(cartItems)} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#000'},
  headerText: {fontSize: 30},
  rowContainer: {paddingHorizontal: 10, marginBottom: 10},
  descriptionContainer: {paddingHorizontal: 10, paddingVertical: 20},
  amountInputContainer: {paddingHorizontal: 0},
  descriptionText: {textAlign: 'center'},
  scrollContainer: {flexGrow: 1},
  informationText: {color: '#fff', ...textStyle.mediumText},
  inputContainer: {
    borderBottomWidth: 0,
    paddingHorizontal: 10,
  },
  containerStyle: {borderWidth: 2, borderColor: 'gray'},
  warning: {textDecorationLine: 'underline', textAlign: 'center', color: colors.orangeDashboard},
  leftIcon: {color: '#fff', textAlign: 'center', fontSize: 18},
  leftIconContainer: {alignItems: 'flex-start', marginLeft: 5},
  inputContainerStyle: {paddingHorizontal: 10},
});

const {
  container,
  descriptionContainer,
  descriptionText,
  informationText,
  scrollContainer,
  rowContainer,
  warning,
  leftIcon,
  leftIconContainer,
  containerStyle,
  inputContainerStyle,
  amountInputContainer,
  headerText,
} = styles;
