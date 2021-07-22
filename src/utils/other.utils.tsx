import {imageResizeAction} from './ProfileUtils/profilePhoto';
import {Dimensions, Alert} from 'react-native';
import {
  getBrand,
  getBuildNumber,
  getDevice,
  getDeviceId,
  getReadableVersion,
  isEmulator,
} from 'react-native-device-info';
import codePush from 'react-native-code-push';
import Config from 'react-native-config';
import {ScreenSyncType} from '../types/other-types';
import AsyncStorage from '@react-native-community/async-storage';
import RNProgressHud from 'progress-hud';
import {OfferStatus, TradeListType} from '../types/trade';
import TRADE_STATUS from '../constants/tradeStatus';
import moment from 'moment';

export const capitalizeWord = word => word.replace(/^\w/, c => c.toUpperCase());

export const deleteSame = (state, profileData) => {
  const updState = state;
  Object.keys(updState).map(propName => {
    if (updState[propName] === '') {
      updState[propName] = null;
    }
    if (updState[propName] === undefined || updState[propName] === profileData[propName]) {
      delete updState[propName];
    }
  });
  return updState;
};

export const checkAvatarStateChange = async (updState, state, profileData) => {
  let updatedState = {...updState, avatarURL: state.avatarURL};
  if (updatedState.avatarURL && updatedState.avatarURL !== profileData.avatarURL) {
    const file = await imageResizeAction(updatedState.avatarURL);
    updatedState = {...updatedState, file: file};
  }
  if (updatedState.avatarURL !== null && updatedState.avatarURL !== '') {
    delete updatedState.avatarURL;
  }
  if (updatedState.avatarURL === profileData.avatarURL) {
    delete updatedState.avatarURL;
  }
  return updatedState;
};

export const parseBottleSize = (capacity: string): string => {
  const size = parseFloat(capacity);
  if (size > 3) {
    return (size / 1000).toString();
  }
  return size.toString();
};

export const showAlert = (title: string, message: string, onAccept?: () => void) => {
  if (onAccept) {
    Alert.alert(title, message, [{onPress: () => {}, text: 'Cancel'}, {onPress: onAccept, text: 'Accept'}]);
  } else {
    Alert.alert(title, message, [{onPress: () => {}, text: 'OK'}]);
  }
};

export const parseFileName = (path: string): string => {
  const regexp = new RegExp(/[\w-]+\.\D*$/gim);

  if (path === '') {
    return;
  }
  const [result] = path.match(regexp);

  if (result) {
    return result;
  } else {
    return 'image.jpg';
  }
};

export const selectScreenSize = (smallDisplaySize: any, largeDisplaySize: any) => {
  const {width: screenWidth} = Dimensions.get('screen');

  if (screenWidth < 375) {
    return smallDisplaySize;
  } else {
    return largeDisplaySize;
  }
};

export const getMetadata = async () => {
  try {
    const codepush = await codePush.getUpdateMetadata();
    const deviceInfo = await getDevice();
    const emulator = await isEmulator();
    return {
      codePushBuildVersion: codepush.appVersion,
      codePushVersion: codepush.label,
      buildNumber: getBuildNumber(),
      apiLink: Config.API_HOST,
      readableVersion: getReadableVersion(),
      emulator,
      phone: {
        brand: getBrand(),
        industrialDesign: deviceInfo,
        deviceId: getDeviceId(),
      },
    };
  } catch (error) {
    // console.log(error);
  }
};

export const mapDesignationIdToName = (id: number, designationArray: {id: number; name: string}[]): string => {
  if (typeof designationArray === 'undefined' || designationArray.length < 1) {
    return '';
  }

  return designationArray.filter(el => el.id === id)[0].name;
};

export function renameKeyName(obj, oldName, newName) {
  const {[oldName]: value, ...remainingObj} = obj;
  return {
    ...remainingObj,
    [newName]: value,
  };
}

/**
 * The function marks the screen in AsyncStorage on which data need to be updated from the server
 * @param syncScreen {ScreenSyncType}
 * @returns void
 */
export const flagToUpdateScreen = async (syncScreen: ScreenSyncType) => {
  await AsyncStorage.setItem(syncScreen, JSON.stringify({sync: true}));
};

/**
 * The function check AsyncStorage for selected screen.
 * If in the storage exist flag for that screen then callback will be called.
 * @param syncScreen {ScreenSyncType}
 * @param callback any function
 * @returns void
 */
export const checkSyncStatus = async (syncScreen: ScreenSyncType, callback: Function) => {
  const syncString = await AsyncStorage.getItem(syncScreen);

  if (syncString) {
    const sync = JSON.parse(syncString);
    if (sync.sync) {
      RNProgressHud.show();
      callback && callback();
      await AsyncStorage.setItem(syncScreen, JSON.stringify({sync: false}));
    }
  }
};

/**
 * Convert status to human readable version. Second optional boolean argument will toggle to DB values
 * @param status {OfferStatus} from database
 * @param section {TradeListType}
 * @param isCountered
 * @param isDebugging it is an optional parameter by default it is set to false.
 * If this argument is set to true then will be returned value without any changes
 * @returns human readable string
 */
export const getReadableStatus = (
  status: OfferStatus,
  section: TradeListType,
  isCountered: boolean,
  isDebugging = false,
) => {
  let newStatus = '';
  const pending = 'Pending';

  if (section === 'BUYER_LIST') {
    switch (status) {
      case TRADE_STATUS.CREATED:
      case TRADE_STATUS.BUYER_ACCEPTED:
      case TRADE_STATUS.BUYER_MODIFIED:
        newStatus = pending;
        break;

      case TRADE_STATUS.SELLER_MODIFIED:
        newStatus = isCountered ? 'Offer received (with counter)' : 'Offer received (without counter)';
        break;

      case TRADE_STATUS.DEAL_ACCEPTED:
        newStatus = 'Offer to buy accepted';
        break;
    }
  }

  if (section === 'SELLER_LIST') {
    switch (status) {
      case 'CREATED':
        newStatus = 'New request received';
        break;

      case TRADE_STATUS.SELLER_MODIFIED:
        newStatus = pending;
        break;

      case TRADE_STATUS.DEAL_ACCEPTED:
        newStatus = 'Offer to sell accepted';
        break;

      case TRADE_STATUS.BUYER_MODIFIED:
        newStatus = 'Buyer countered';
        break;

      case TRADE_STATUS.BUYER_ACCEPTED:
        newStatus = 'Final offer accepted by buyer';
        break;
    }
  }

  if (isDebugging) {
    return `${status} => ${newStatus}`;
  }

  return newStatus;
};

/**
 * Convert an array into array of arrays
 * @param array The array to be split
 * @param size Maximum internal array length
 * @returns Array of arrays
 */
export const chunksFromArray = (array: any[], size: number) => {
  const _size = +size.toFixed(0);
  return array.length ? [array.slice(0, _size), ...chunksFromArray(array.slice(_size), _size)] : [];
};

export const formatDrinkWindow = ({start, end}): string | null => {
  const startYear = moment.utc(start).get('year');
  const endYear = moment.utc(end).get('year');

  if (startYear <= 1000 || endYear <= 1000) {
    return null;
  }

  return `${startYear} - ${endYear}`;
};

/**
 * Function checking object for listed fields
 * @param object Object which will be checked for field
 * @param fieldList Array of strings which will be checked in the object
 * @returns boolean
 */
export const hasProperties = (object: any, fieldList: string[]) => fieldList.every(key => key in object);

/**
 * Function compares two dates and returns latest date but rightly formatted
 * @param startAt Start date string
 * @param endAt End date string
 * @returns string representation of the latest date
 */
export const compareEditionDate = (startAt: string, endAt: string) => {
  const momentStart = moment(startAt);
  const momentEnd = moment(endAt);

  if (momentEnd.isAfter(momentStart)) {
    return 'Edited ' + momentEnd.format('MMM D, h:mm A');
  }

  return momentStart.format('MMM D, h:mm A');
};
