import gql from 'graphql-tag';

export const CREATE_OFFER_TO_BUY = gql`
  mutation createOffersToBuy($offersToBuy: [OfferToBuyInput!]!) {
    createOffersToBuy(offersToBuy: $offersToBuy)
  }
`;

export const BUY_ON_SALE = gql`
  mutation($offersToBuy: [OfferToBuyInput!]!) {
    createOffersToBuyCellrSale(offersToBuy: $offersToBuy)
  }
`;

export const UPDATE_SELL_OFFER = gql`
  mutation updateOfferToSell(
    $tradeOfferId: Int!
    $acceptCounter: Boolean!
    $quantity: Int
    $pricePerBottle: Float
    $note: String
  ) {
    updateOfferToSell(
      tradeOfferId: $tradeOfferId
      acceptCounter: $acceptCounter
      quantity: $quantity
      pricePerBottle: $pricePerBottle
      note: $note
    )
  }
`;

export const DECLINE_TRADE_OFFER = gql`
  mutation declineTradeOffer($tradeOfferId: Int!) {
    declineTradeOffer(tradeOfferId: $tradeOfferId)
  }
`;

export const UPDATE_OFFER_BY_BUYER = gql`
  mutation updateOfferToBuy(
    $tradeOfferId: Int!
    $acceptCounter: Boolean!
    $quantity: Int
    $pricePerBottle: Float
    $note: String
  ) {
    updateOfferToBuy(
      tradeOfferId: $tradeOfferId
      acceptCounter: $acceptCounter
      quantity: $quantity
      pricePerBottle: $pricePerBottle
      note: $note
    )
  }
`;

export const FINAL_ACCEPT_BY_BUYER = gql`
  mutation updateOfferToBuy($tradeOfferId: Int!) {
    updateOfferToBuy(tradeOfferId: $tradeOfferId, acceptCounter: false)
  }
`;
export const FINAL_ACCEPT_BY_SELLER = gql`
  mutation finalAcceptTradeOfferSeller($tradeOfferId: Int!) {
    finalAcceptTradeOfferBySeller(tradeOfferId: $tradeOfferId)
  }
`;

export const SUBMIT_FINAL_OFFER_BY_SELLER = gql`
  mutation acceptTradeOfferBySeller($tradeOfferId: Int!, $pricePerBottle: Float) {
    acceptTradeOfferBySeller(tradeOfferId: $tradeOfferId, pricePerBottle: $pricePerBottle)
  }
`;

export const RESTORE_TRADE_OFFER = gql`
  mutation restoreTradeOffer($tradeOfferId: Int!) {
    restoreTradeOffer(tradeOfferId: $tradeOfferId)
  }
`;

export const DO_PAYMENT_MUTATION = gql`
  mutation paymentStripeTest(
    $amount: Int!
    $description: String
    $stripeToken: String!
    $paymentInfo: JSON!
    $paymentType: PaymentType!
  ) {
    paymentStripeTest(
      amount: $amount
      description: $description
      stripeToken: $stripeToken
      paymentInfo: $paymentInfo
      paymentType: $paymentType
    )
  }
`;

export const DO_PAYMENT_MUTATION_LIVE = gql`
  mutation paymentStripeLive(
    $amount: Int!
    $description: String
    $stripeToken: String!
    $paymentInfo: JSON!
    $paymentType: PaymentType!
  ) {
    paymentStripeLive(
      amount: $amount
      description: $description
      stripeToken: $stripeToken
      paymentInfo: $paymentInfo
      paymentType: $paymentType
    )
  }
`;

export const SEND_PAYMENT_METHOD = gql`
  mutation paymentStripeWithIntentTest($amount: Int!, $description: String, $paymentMethod: String!) {
    paymentStripeWithIntentTest(amount: $amount, description: $description, paymentMethod: $paymentMethod)
  }
`;

export const SEND_PAYMENT_METHOD_LIVE = gql`
  mutation paymentStripeWithIntentLive($amount: Int!, $description: String, $paymentMethod: String!) {
    paymentStripeWithIntentLive(amount: $amount, description: $description, paymentMethod: $paymentMethod)
  }
`;

export const GET_HASH_FOR_ZELLE = gql`
  mutation($tradeOfferId: Float!) {
    getTradeOfferHash(tradeOfferId: $tradeOfferId)
  }
`;
