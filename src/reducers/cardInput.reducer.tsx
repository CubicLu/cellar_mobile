import {
  SET_CARD_NUMBER,
  SET_CARD_EXPIRATION_MONTH,
  SET_CARD_EXPIRATION_YEAR,
  SET_CARD_CVC,
  SET_NAME,
  SET_ADDRESS_LINE_1,
  SET_ADDRESS_LINE_2,
  SET_ZIP_CODE,
  SET_ADDRESS_COUNTRY,
  SET_ADDRESS_STATE,
  SET_ADDRESS_CITY,
} from '../constants/ActionTypes/cardInput';

export type CardData = {
  number: string;
  expMonth: number | string;
  expYear: number | string;
  cvc: string;
  name: string;
  currency: 'usd';
  addressLine1: string;
  addressLine2: string;
  addressCity: string;
  addressState: string;
  addressCountry: string;
  addressZip: string;
};

export const initState: CardData = {
  number: '',
  expMonth: '',
  expYear: '',
  cvc: '',
  // optional
  name: '',
  currency: 'usd',
  addressLine1: '',
  addressLine2: '',
  addressCity: '',
  addressState: '',
  addressCountry: '',
  addressZip: '',
};

export const cardInputReducer = (state, action) => {
  const {type, payload} = action;

  switch (type) {
    case SET_CARD_NUMBER:
      return {
        ...state,
        number: payload,
      };

    case SET_CARD_EXPIRATION_MONTH:
      return {
        ...state,
        expMonth: +payload,
      };

    case SET_CARD_EXPIRATION_YEAR:
      return {
        ...state,
        expYear: +payload,
      };
    case SET_CARD_CVC:
      return {
        ...state,
        cvc: payload,
      };

    case SET_NAME:
      return {
        ...state,
        name: payload,
      };

    case SET_ADDRESS_LINE_1:
      return {
        ...state,
        addressLine1: payload,
      };

    case SET_ADDRESS_LINE_2:
      return {
        ...state,
        addressLine2: payload,
      };

    case SET_ZIP_CODE:
      return {
        ...state,
        addressZip: payload,
      };

    case SET_ADDRESS_COUNTRY: {
      return {
        ...state,
        addressCountry: payload,
      };
    }

    case SET_ADDRESS_STATE: {
      return {
        ...state,
        addressState: payload,
      };
    }

    case SET_ADDRESS_CITY:
      return {...state, addressCity: payload};

    default:
      return state;
  }
};
