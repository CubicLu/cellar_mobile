import {Alert} from 'react-native';
import RNProgressHud from 'progress-hud';
import {AppConfig} from '../constants';

export const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const emailValidation = (email: string) => {
  if (!emailRegex.test(email)) {
    return 'Must be a valid email address';
  }
};

export const isNotEmail = (email: string) => {
  if (emailRegex.test(email)) {
    return 'Are you sure that your member name is email?';
  }
};

export const isDisabledButton = (email: string) => {
  return !email || !emailRegex.test(email);
};

export const timeoutError = error => {
  console.log('Err', error);
  if (/timeout/i.test(error.toString())) {
    Alert.alert('Error', 'Timeout exceed');
  } else {
    Alert.alert('Error', error.toString());
  }
  RNProgressHud.dismiss();
};

export const requiredEmailValidation = (email: string) => {
  if (email === '') {
    return '';
  }
  if (!emailRegex.test(email)) {
    return 'Must be a valid email address';
  }
  return '';
};

export const requiredLocationValidation = (location: string) => {
  return location.length > 0 ? '' : 'This is a required field';
};

export const requiredNameValidation = (name: string) => {
  const errorMessage = 'This is a required field';
  if (name) {
    return name.length > 0 ? '' : errorMessage;
  }
  return errorMessage;
};

export const requiredPriceValidation = (count: number, price: string) => {
  const priceNumber = Number(price);

  if (count < 1) {
    return '';
  }

  if (Number.isNaN(priceNumber)) {
    return 'Price must be a valid number';
  }

  if (priceNumber < AppConfig.MIN_PRICE) {
    return `Price must be greater or equal to ${AppConfig.MIN_PRICE}`;
  }

  if (price.toString().length < 1) {
    return 'Price is a required field';
  }

  return '';
};

export function formatGQLError(message: string) {
  return message.replace('GraphQL error:', '');
}
