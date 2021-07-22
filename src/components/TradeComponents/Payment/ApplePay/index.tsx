import React, {FC, useEffect, useState} from 'react';
import stripe from 'tipsi-stripe';
import {Alert, View} from 'react-native';
import {useMutation} from '@apollo/react-hooks';

import {ApplePayIcon} from '../../../../assets/svgIcons';
import {PayButton} from '../../..';
import {usePaymentEndpoint} from '../../../../hooks';
import {CartItem} from '../../../../types/trade';
import {formatGQLError} from '../../../../utils/errorCodes';

type Props = {
  containerStyle: any;
  paymentInfo: any;
  cartItems: CartItem[];
  onCompletePayment: () => void;
};

export const ApplePay: FC<Props> = ({containerStyle, paymentInfo, cartItems, onCompletePayment}) => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const {paymentToken} = usePaymentEndpoint();
  const [allowed, setAllowed] = useState(null);
  const [payAction] = useMutation(paymentToken, {
    onCompleted: async data => {
      const [key] = Object.keys(data);
      await stripe.completeNativePayRequest();
      Alert.alert('', data[key], [{text: 'OK', onPress: onCompletePayment}]);
    },
    onError: error => {
      Alert.alert('Error', formatGQLError(error.message));
    },
  });

  useEffect(() => {
    async function getIsPaymentsAllowed() {
      const deviceSupportsNativePay = await stripe.deviceSupportsNativePay();
      setAllowed(deviceSupportsNativePay);
    }

    getIsPaymentsAllowed();
  }, []);

  useEffect(() => {
    if (status === 'Error: This device does not support Apple Pay') {
      Alert.alert(
        'Please setup apple pay',
        'By accepting this dialogue you will be automatically redirected to the Wallet',
        [
          {
            text: 'Cancel',
            onPress: () => {},
          },
          {
            text: 'Redirect',
            onPress: () => stripe.openNativePaySetup(),
          },
        ],
      );
    }
  }, [status]);

  function resetState() {
    setLoading(true);
    setStatus(null);
  }

  async function handleApplePayPress() {
    try {
      resetState();

      const payToken = await stripe.paymentRequestWithNativePay(
        {
          requiredBillingAddressFields: ['all'],
          requiredShippingAddressFields: ['all'],
          shippingMethods: [
            {
              id: 'Standard',
              label: 'Standard',
              detail: '$15.00',
              amount: '15.00',
            },
          ],
        },
        cartItems,
      );

      await payAction({
        variables: {
          ...paymentInfo,
          stripeToken: payToken.tokenId,
        },
      });
    } catch (error) {
      setLoading(false);
      setStatus(`Error: ${error.message}`);

      if (!error.message.includes('Cancelled by user')) {
        await stripe.cancelNativePayRequest();
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={containerStyle}>
      <PayButton
        loading={loading}
        disabled={!allowed}
        renderLogo={() => <ApplePayIcon width={213} height={60} />}
        disabledText="Apple Pay isn't supported by this device"
        onPress={handleApplePayPress}
      />
    </View>
  );
};
