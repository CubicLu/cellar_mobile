import React, {FC, useMemo} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

import {CheckBox, ApplePay, ManualCardInputBtn} from '../../';
import {ZelleIcon} from '../../../assets/svgIcons';
import textStyle from '../../../constants/Styles/textStyle';
import {selectScreenSize} from '../../../utils/other.utils';
import {generateCartItems} from '../../../utils/payments';
import {Routes} from '../../../constants';
import {navigate} from '../../../utils/navigation.service';

export type BuyerFooterProps = {
  insuranceAmount: number;
  insurance: boolean;
  totalPrice: number;
  quantity: number;
  pricePerBottle: number;
  setInsurance: any;
  wineTitle: string;
  tradeOfferId: number;
  onCompletePayment: () => void;
};

const Footer: FC<BuyerFooterProps> = ({
  insurance,
  insuranceAmount,
  setInsurance,
  totalPrice,
  quantity,
  pricePerBottle,
  wineTitle,
  tradeOfferId,
  onCompletePayment,
}) => {
  const cartItems = useMemo(
    () => generateCartItems(wineTitle, quantity, pricePerBottle, insurance ? insuranceAmount : 0),
    [wineTitle, quantity, pricePerBottle, insurance, insuranceAmount],
  );

  const paymentInfo = useMemo(() => {
    return {
      amount: +(totalPrice * 100).toFixed(2),
      paymentInfo: JSON.stringify({tradeOfferId: +tradeOfferId, includeInsurance: insurance}),
      paymentType: 'TRADE_OFFER',
    };
  }, [totalPrice, tradeOfferId, insurance]);

  return (
    <>
      <View style={payNowContainer}>
        <Text style={payNowTitle}>Pay now</Text>
        <View style={hr} />
        <View>
          <CheckBox
            value={insurance}
            onValueChange={() => setInsurance(v => !v)}
            variant="fill"
            textStyle={checkBoxTextStyle}
            text="Include Insurance coverage (3%)"
          />
          <View style={gap} />
          <CheckBox
            variant="fill"
            disabled
            value={true}
            onValueChange={() => {}}
            textStyle={checkBoxTextStyle}
            text="Include Shipping fee ($15)"
          />
        </View>
        <View style={[totalPriceContainer, vw100]}>
          <Text style={totalText}>${totalPrice.toFixed(2)}</Text>
          <Text style={totalDescription}>Total price</Text>
        </View>
        <Text style={h5}>Pay now with:</Text>
      </View>

      <View style={buttonsContainer}>
        <ApplePay
          onCompletePayment={onCompletePayment}
          containerStyle={payButton}
          paymentInfo={paymentInfo}
          cartItems={cartItems}
        />

        <ManualCardInputBtn
          onCompletePayment={onCompletePayment}
          cartItems={cartItems}
          containerStyle={payButton}
          paymentInfo={paymentInfo}
        />

        <TouchableOpacity
          style={payButton}
          onPress={() =>
            navigate(Routes.ZellePaymentScreen.name, {
              tradeOfferId: tradeOfferId,
              totalPrice: quantity * pricePerBottle + 15,
              cartItems,
            })
          }>
          <ZelleIcon width={213} height={60} />
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  payNowContainer: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  placeHolder: {height: selectScreenSize(50, 100)},
  hr: {backgroundColor: '#FFF', height: 2, width: '100%', marginVertical: 20},
  checkBoxText: {
    color: '#fff',
    ...textStyle.mediumText,
    fontSize: 21,
  },
  totalPriceContainer: {
    backgroundColor: '#fff',
    alignItems: 'center',
    marginVertical: 20,
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
  payNowTitle: {
    color: '#fff',
    ...textStyle.mediumText,
    fontSize: 50,
    lineHeight: 66,
    marginTop: 10,
  },
  checkBoxTextStyle: {
    color: '#fff',
    fontSize: 18,
    ...textStyle.mediumText,
  },
  payButton: {
    backgroundColor: '#E6750E',
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  h5: {fontSize: 16, lineHeight: 21, ...textStyle.boldText, color: '#fff', marginBottom: 20},
  gap: {marginTop: 20},
  vw100: {width: '100%'},
  buttonsContainer: {flexDirection: 'column', paddingHorizontal: 20},
});

const {
  payButton,
  payNowTitle,
  totalDescription,
  checkBoxTextStyle,
  totalText,
  payNowContainer,
  hr,
  totalPriceContainer,
  h5,
  gap,
  vw100,
  buttonsContainer,
} = styles;

export const BuyerFooter = Footer;
