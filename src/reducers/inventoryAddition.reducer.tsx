import {countriesList} from '../constants/countries';
import {
  BOTTLE_COUNT,
  BOTTLE_NOTE,
  BOTTLE_SIZE,
  WINE_NAME,
  CLEAR_ALL,
  COST,
  CURRENCY,
  DELIVERY_DATE,
  DISPLAY_BOTTLE_COUNT,
  DISPLAY_BOTTLE_SIZE,
  DISPLAY_CURRENCY,
  DISPLAY_DELIVERY_DATE,
  DISPLAY_PURCHASE_DATE,
  DISPLAY_VINTAGE,
  PRODUCER,
  PURCHASE_DATE,
  PURCHASE_NOTE,
  SET_APPELLATION,
  SET_COUNTRY,
  SET_REGION,
  SET_SUB_REGION,
  SET_VARIETAL,
  VINTAGE,
  SET_IMAGE,
  SET_DATA_EDIT,
  SET_DESIGNATION,
  SET_LOCATION_SUGGESTION,
  SET_DRINK_WINDOW_END,
  SET_DRINK_WINDOW_START,
  CLEAR_DRINK_WINDOW,
} from '../constants/ActionTypes/inventoryAdditions';
import {VARIETALS} from '../constants/varietals';
const now = new Date();

export enum Currencies {
  USD = 'USD',
  EUR = 'EUR',
  GBP = 'GBP',
}

export const initState = {
  producer: '',
  wineName: '',
  cost: '',
  purchaseNote: '',
  vintage: now.getFullYear(),
  displayVintage: '',
  bottleCount: 1,
  displayBottleCount: 1,
  currency: 'USD',
  displayCurrency: Currencies.USD,
  purchaseDate: now,
  displayPurchaseDate: now.toDateString(),
  deliveryDate: now,
  displayDeliveryDate: now.toDateString(),
  bottleSize: '750ml',
  displayBottleSize: '750ml',
  bottleNote: '',
  countriesList: Object.keys(countriesList),
  regionsList: [],
  subregionsList: [],
  appellationList: [],
  country: '',
  region: '',
  subregion: '',
  appellation: '',
  varietal: '',
  varietalList: VARIETALS,
  imageURI: 'default',
  cellarDesignation: {id: 0, name: ''},
  drinkWindowStart: '',
  drinkWindowEnd: '',
};

export const inventoryAdditionReducer = (state, action) => {
  switch (action.type) {
    case SET_LOCATION_SUGGESTION:
      return {
        ...state,
        country: action.payload.country,
        region: action.payload.region,
        subregion: action.payload.subregion,
        appellation: action.payload.appellation,
      };

    case PRODUCER:
      return {
        ...state,
        producer: action.payload,
      };

    case WINE_NAME:
      return {
        ...state,
        wineName: action.payload,
      };

    case COST:
      return {
        ...state,
        cost: action.payload,
      };

    case VINTAGE:
      return {
        ...state,
        vintage: action.payload,
      };

    case DISPLAY_VINTAGE:
      return {
        ...state,
        displayVintage: action.payload,
      };

    case BOTTLE_COUNT:
      return {
        ...state,
        bottleCount: action.payload,
      };

    case DISPLAY_BOTTLE_COUNT:
      return {
        ...state,
        displayBottleCount: action.payload,
      };

    case CURRENCY:
      return {
        ...state,
        currency: action.payload,
      };

    case DISPLAY_CURRENCY:
      return {
        ...state,
        displayCurrency: action.payload,
      };

    case PURCHASE_DATE:
      return {
        ...state,
        purchaseDate: action.payload,
      };

    case DISPLAY_PURCHASE_DATE:
      return {
        ...state,
        displayPurchaseDate: action.payload,
      };

    case DELIVERY_DATE:
      return {
        ...state,
        deliveryDate: action.payload,
      };

    case DISPLAY_DELIVERY_DATE:
      return {
        ...state,
        displayDeliveryDate: action.payload,
      };

    case BOTTLE_SIZE:
      return {
        ...state,
        bottleSize: action.payload,
      };

    case DISPLAY_BOTTLE_SIZE:
      return {
        ...state,
        displayBottleSize: action.payload,
      };

    case PURCHASE_NOTE:
      return {
        ...state,
        purchaseNote: action.payload,
      };

    case BOTTLE_NOTE:
      return {
        ...state,
        bottleNote: action.payload,
      };

    case SET_COUNTRY:
      return {
        ...state,
        ...action.payload,
      };

    case SET_REGION:
      return {
        ...state,
        ...action.payload,
      };

    case SET_SUB_REGION:
      return {
        ...state,
        ...action.payload,
      };
    case SET_APPELLATION:
      return {
        ...state,
        appellation: action.payload,
      };
    case SET_VARIETAL:
      return {
        ...state,
        varietal: action.payload,
      };
    case SET_IMAGE:
      return {
        ...state,
        imageURI: action.payload,
      };
    case SET_DATA_EDIT:
      return {
        ...state,
        ...action.payload,
      };
    case SET_DESIGNATION: {
      return {
        ...state,
        cellarDesignation: action.payload,
      };
    }
    case SET_DRINK_WINDOW_START: {
      return {
        ...state,
        drinkWindowStart: action.payload,
      };
    }
    case SET_DRINK_WINDOW_END: {
      return {
        ...state,
        drinkWindowEnd: action.payload,
      };
    }

    case CLEAR_DRINK_WINDOW: {
      return {
        ...state,
        drinkWindowStart: '',
        drinkWindowEnd: '',
      };
    }

    case 'SET_FULL_WINE': {
      return {
        ...state,
        ...action.payload,
      };
    }

    case CLEAR_ALL:
      return initState;

    default:
      throw new Error('Unknown Action');
  }
};
