import Routes from '../../constants/navigator-name';
import TRADE_STATUS from '../../constants/tradeStatus';
import {CardData} from '../../reducers/cardInput.reducer';
import {navigate} from '../navigation.service';
import {
  SELLER_CONGRATS_MESSAGE,
  SELLER_CONGRATS_TIP,
  BUYER_CONGRATS_TIP,
  BUYER_CONGRATS_MESSAGE,
  OFFERS_TO_BUY,
  OFFERS_TO_SELL,
} from '../../constants/text';
import {
  OfferToBuyInput,
  OfferStatus,
  TradeDetailsType,
  TradeListType,
  CardType,
  ReceiptDetailsType,
  TradeRole,
} from '../../types/trade';

export const reduceBottleCount = (list: OfferToBuyInput[]): string => {
  return list.reduce((t, c) => t + c.quantity, 0).toString();
};

export const reducePrice = (list: OfferToBuyInput[]): string => {
  return list
    .reduce((t, c) => {
      if (c.quantity > 0) {
        return t + c.pricePerBottle * c.quantity;
      }
      return t;
    }, 0)
    .toFixed(2)
    .toString();
};

/**
 * This function handles navigation from the 'Current Offers' screen it maps status to the corresponding screen.
 * @param status {OfferStatus} received from backend response depend on the current deal phase
 * @param details {TradeDetailsType} information about a deal.
 * @param wineData preloaded information about a wine.
 * @param listType {TradeListType} Status for buyer/seller can be the same so depend on that string the user will be redirected to the right screen
 * @returns {Function}
 */
export const mapStatusToScreen = (
  status: OfferStatus,
  details: TradeDetailsType,
  wineData,
  listType: TradeListType,
): (() => void) => {
  if (listType === 'BUYER_LIST') {
    switch (status) {
      case TRADE_STATUS.CREATED:
        return () =>
          navigate(Routes.tradingBuyerPending.name, {
            tradeDetails: {...details, status: status},
            wine: wineData,
          });

      case TRADE_STATUS.SELLER_MODIFIED:
        return () =>
          navigate(details.isCountered ? Routes.tradingBuyWithCounter.name : Routes.tradingOfferWithoutCounter.name, {
            tradeDetails: details,
            wine: wineData,
          });

      case TRADE_STATUS.BUYER_ACCEPTED:
        return () =>
          navigate(Routes.tradingBuyerPending.name, {
            tradeDetails: {...details, status: status},
            wine: wineData,
          });

      case TRADE_STATUS.BUYER_MODIFIED:
        return () =>
          navigate(Routes.tradingBuyerPending.name, {
            tradeDetails: {...details, status: status},
            wine: wineData,
          });

      case TRADE_STATUS.DEAL_ACCEPTED:
        return () =>
          navigate(Routes.tradingOfferAccepted.name, {
            message: {
              mainText: BUYER_CONGRATS_MESSAGE,
              tipText: BUYER_CONGRATS_TIP,
            },
            tradeDetails: details,
          });

      default:
        return () => {};
    }
  } else {
    switch (status) {
      case TRADE_STATUS.CREATED:
        return () => navigate(Routes.tradingNewSellRequestReceived.name, {tradeDetails: details, wine: wineData});

      case TRADE_STATUS.SELLER_MODIFIED:
        return () =>
          navigate(Routes.tradingSellerPending.name, {
            tradeDetails: {...details, status: status},
            wine: wineData,
          });

      case TRADE_STATUS.BUYER_ACCEPTED:
        return () => navigate(Routes.tradingFinalSellerAccept.name, {tradeDetails: details, wine: wineData});

      case TRADE_STATUS.BUYER_MODIFIED:
        return () =>
          navigate(details.isCountered ? Routes.tradingOfferWithCounter.name : Routes.tradingFinalBuyOffer.name, {
            tradeDetails: details,
            wine: wineData,
          });

      case TRADE_STATUS.DEAL_ACCEPTED:
        return () =>
          navigate(Routes.tradingOfferAccepted.name, {
            message: {
              mainText: SELLER_CONGRATS_MESSAGE,
              tipText: SELLER_CONGRATS_TIP,
            },
            tradeDetails: details,
          });

      default:
        return () => {};
    }
  }
};

/**
 * Maps section list title to {TradeListType}
 * @param value any string
 * @returns {TradeListType} or empty string if it is not matched to pattern
 */
export const getListType = (value: string): TradeListType | '' => {
  if (value === OFFERS_TO_BUY) {
    return 'BUYER_LIST';
  }
  if (value === OFFERS_TO_SELL) {
    return 'SELLER_LIST';
  }
  return '';
};

/**
 * Function take string representation of the card number and return card type
 * @param cardNumber string card number
 * @returns {CardType} or {undefined} if {cardNumber} not matches any pattern
 */
export function getCardType(cardNumber: string): CardType | undefined {
  const numberFormatted = cardNumber.replace(/\D/g, '');

  let patterns = {
    VISA: /^4[0-9]{12}(?:[0-9]{3})?$/,
    MASTER: /^5[1-5][0-9]{14}$/,
    // AMEX: /^3[47][0-9]{13}$/,
    // ELO: /^((((636368)|(438935)|(504175)|(451416)|(636297))\d{0,10})|((5067)|(4576)|(4011))\d{0,12})$/,
    // AURA: /^(5078\d{2})(\d{2})(\d{11})$/,
    // JCB: /^(?:2131|1800|35\d{3})\d{11}$/,
    // DINERS: /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/,
    // DISCOVERY: /^6(?:011|5[0-9]{2})[0-9]{12}$/,
    // HIPERCARD: /^(606282\d{10}(\d{3})?)|(3841\d{15})$/,
    // ELECTRON: /^(4026|417500|4405|4508|4844|4913|4917)\d+$/,
    // MAESTRO: /^(5018|5020|5038|5612|5893|6304|6759|6761|6762|6763|0604|6390)\d+$/,
    // DANKORT: /^(5019)\d+$/,
    // INTERPAYMENT: /^(636)\d+$/,
    // UNIONPAY: /^(62|88)\d+$/,
  };

  for (let key in patterns) {
    if (patterns[key].test(numberFormatted)) {
      return key as CardType;
    }
  }
}

export function validateCardNumber(cardNumber: string) {
  return cardNumber.replace(/\s/gim, '').length === 16;
}

export function isCardYearValid(YY: number) {
  return (
    YY >=
    +new Date()
      .getFullYear()
      .toString()
      .substr(2)
  );
}

export function validateCardForm(cardNumber: string, MM: number, YY: number, cvv: string) {
  return validateCardNumber(cardNumber) && MM <= 12 && MM !== 0 && isCardYearValid(YY) && cvv.length === 3;
}

export const validateRequiredCardFields = (card: CardData): boolean => {
  const {
    addressCity,
    addressCountry,
    addressLine1,
    addressState,
    addressZip,
    cvc,
    expMonth,
    expYear,
    name,
    number: cardNumber,
  } = card;

  return (
    validateCardForm(cardNumber, +expMonth, +expYear, cvc) &&
    !!addressCity &&
    !!addressCountry &&
    !!addressLine1 &&
    !!addressState &&
    !!addressZip &&
    !!name
  );
};

export function formatMonthOutput(text: number): string {
  if (!text) {
    return '';
  }

  if (text > 1 && text < 10) {
    return `0${text}`;
  }
  return `${text}`;
}

export function formatYearOutput(text: number): string {
  if (!text) {
    return '';
  }

  return `${text}`;
}

export function getPriceDependOnRole(details: ReceiptDetailsType, role: TradeRole, buyerInsurance: boolean) {
  const {insurance, totalPriceForSeller, totalPrice, includeInsurance} = details;

  if (role === 'Seller') {
    return totalPriceForSeller;
  } else {
    return calculateStripeFee(totalPrice + (!includeInsurance ? (buyerInsurance ? insurance : 0) : 0)) / 100;
  }
}

/**
 * Function calculates price plus stripe fee
 * @param expectedPrice string card number
 * @returns {number} the amount of money to be withdrawn from the buyer expectedPrice + stripe fee amount
 */
export function calculateStripeFee(expectedPrice: number) {
  const FIXED_FEE = 0;
  const PERCENTAGE_FEE = 0.03;

  return Math.ceil(Number((expectedPrice + FIXED_FEE) / (1 - PERCENTAGE_FEE)) * 100);
}
