import {
  SET_AVATAR_URL,
  SET_COUNTRY_PROFILE,
  SET_CURRENCY,
  SET_DEFAULT_CURRENCY,
  SET_EMAIL,
  SET_FAVORITE_PLACE,
  SET_FAVORITE_WINERIES,
  SET_FIRST_NAME,
  SET_FIRST_WINE,
  SET_LAST_NAME,
  SET_REMOTE_DATA,
  SET_RESTAURANT,
  SET_STATE_PROFILE,
  SET_LOCATION,
} from '../constants/ActionTypes/profile';
import moment from 'moment';

export const profileInitState = {
  email: '',
  firstName: '',
  lastName: '',
  favoritePlaceToTravel: '',
  favoriteWineries: '',
  firstWine: '',
  mustGoRestaurant: '',
  avatarURL: '',
  createdAt: moment(),
  country: 'null',
  location: {
    prettyLocationName: '',
  },
  subdivision: '',
  defaultCurrency: 'USD',
};

export const profileReducer = (state, action) => {
  switch (action.type) {
    case SET_REMOTE_DATA: {
      return {
        ...action.payload,
        currency: action.payload.defaultCurrency,
      };
    }
    case SET_EMAIL:
      return {
        ...state,
        email: action.payload,
      };
    case SET_FIRST_NAME:
      return {
        ...state,
        firstName: action.payload,
      };
    case SET_LAST_NAME:
      return {
        ...state,
        lastName: action.payload,
      };
    case SET_FAVORITE_PLACE:
      return {
        ...state,
        favoritePlaceToTravel: action.payload,
      };
    case SET_FAVORITE_WINERIES:
      return {
        ...state,
        favoriteWineries: action.payload,
      };
    case SET_FIRST_WINE:
      return {
        ...state,
        firstWine: action.payload,
      };
    case SET_RESTAURANT:
      return {
        ...state,
        mustGoRestaurant: action.payload,
      };
    case SET_AVATAR_URL:
      return {
        ...state,
        avatarURL: action.payload,
      };
    case SET_COUNTRY_PROFILE:
      return {
        ...state,
        country: action.payload,
      };
    case SET_STATE_PROFILE:
      return {
        ...state,
        subdivision: action.payload,
      };
    case SET_CURRENCY:
      return {
        ...state,
        currency: action.payload,
      };
    case SET_DEFAULT_CURRENCY:
      return {
        ...state,
        defaultCurrency: action.payload,
      };
    case SET_LOCATION:
      return {
        ...state,
        location: action.payload,
      };

    default:
      throw new Error('Unknown Action');
  }
};
