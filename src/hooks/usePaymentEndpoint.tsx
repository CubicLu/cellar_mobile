import CONFIG from '../constants/config';

import {
  DO_PAYMENT_MUTATION_LIVE,
  DO_PAYMENT_MUTATION,
  SEND_PAYMENT_METHOD,
  SEND_PAYMENT_METHOD_LIVE,
} from '../apollo/mutations/trading';

export const usePaymentEndpoint = () => {
  if (CONFIG.LIVE_PAYMENTS) {
    return {
      paymentToken: DO_PAYMENT_MUTATION_LIVE,
      paymentMethod: SEND_PAYMENT_METHOD_LIVE,
    };
  } else {
    return {
      paymentToken: DO_PAYMENT_MUTATION,
      paymentMethod: SEND_PAYMENT_METHOD,
    };
  }
};
