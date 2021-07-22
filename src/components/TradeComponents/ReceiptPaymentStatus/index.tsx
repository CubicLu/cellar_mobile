import React, {FC} from 'react';
import {View, Text, StyleSheet} from 'react-native';

import {TradeRole} from '../../../types/trade';
import {ButtonNew} from '../../../new_components';
import colors from '../../../constants/colors';
import textStyle from '../../../constants/Styles/textStyle';

type Props = {
  role: TradeRole;
  status: 'DEAL_ACCEPTED' | 'PAID';
  onPressDelivery: () => void;
};

const PaymentStatus: FC<Props> = ({role, onPressDelivery, status}) => {
  if (status === 'DEAL_ACCEPTED') {
    if (role === 'Seller') {
      return <TextBlock text="Waiting for payment from the buyer" />;
    }
  }
  if (status === 'PAID') {
    if (role === 'Seller') {
      return (
        <TextBlock text="The buyer paid for the transaction">
          <ButtonNew text="SHIPMENT" style={buttonContainer} onPress={onPressDelivery} />
        </TextBlock>
      );
    }
    if (role === 'Buyer') {
      return (
        <TextBlock text="You have already paid for this deal">
          <ButtonNew text="SHIPMENT" style={buttonContainer} onPress={onPressDelivery} />
        </TextBlock>
      );
    }
  }
  return null;
};

type TextBlock = {
  text: string;
};

const TextBlock: FC<TextBlock> = ({text, children}) => (
  <>
    <View style={tbContainer}>
      <Text style={tbText}>{text}</Text>
      {children}
    </View>
  </>
);

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.orangeDashboard,
    marginTop: 20,
  },
  tbContainer: {flex: 1, marginHorizontal: 20, paddingTop: 20},
  tbText: {color: '#fff', fontSize: 20, textAlign: 'center', ...textStyle.mediumText},
});

const {buttonContainer, tbContainer, tbText} = styles;

export const ReceiptPaymentStatus = PaymentStatus;
