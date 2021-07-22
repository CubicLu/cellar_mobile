import React, {FC, useState} from 'react';
import {TouchableOpacity, Alert} from 'react-native';
import stripe from 'tipsi-stripe';
import RNProgressHud from 'progress-hud';
import {PayButton} from '../PayButton';
import {useMutation} from '@apollo/react-hooks';
import {NavigationScreenProp, withNavigation} from 'react-navigation';

import {usePaymentEndpoint} from '../../../../hooks';
import {Routes} from '../../../../constants';
import {CartItem} from '../../../../types/trade';
import {StripeIcon} from '../../../../assets/svgIcons';
import {formatGQLError} from '../../../../utils/errorCodes';

type Props = {
  containerStyle: any;
  navigation: NavigationScreenProp<any>;
  cartItems: CartItem[];

  paymentInfo: any;
  onCompletePayment: () => void;
};

const ManualCardInput: FC<Props> = ({containerStyle, navigation, cartItems, onCompletePayment, paymentInfo}) => {
  const [loading, setLoading] = useState(false);
  const {paymentToken} = usePaymentEndpoint();
  const [payAction] = useMutation(paymentToken, {
    onCompleted: data => {
      const [key] = Object.keys(data);
      Alert.alert('', data[key], [{text: 'OK', onPress: onCompletePayment}]);
    },
    onError: error => Alert.alert('Error', formatGQLError(error.message)),
  });

  const onPayHandler = async card => {
    try {
      setLoading(true);
      RNProgressHud.show();
      const payment = await stripe.createTokenWithCard(card);

      await payAction({
        variables: {
          ...paymentInfo,
          stripeToken: payment.tokenId,
        },
      });
    } catch (error) {
      if (!error.message.includes('Cancelled by user')) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
      RNProgressHud.dismiss();
    }
  };

  return (
    <TouchableOpacity style={containerStyle}>
      <PayButton
        loading={loading}
        onPress={() => navigation.navigate(Routes.CardInput.name, {onPayHandler, cartItems})}
        renderLogo={() => <StripeIcon width={213} height={60} />}
      />
    </TouchableOpacity>
  );
};

export const ManualCardInputBtn = withNavigation(ManualCardInput);
