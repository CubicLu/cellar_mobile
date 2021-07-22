import {ReactNativeFile} from 'apollo-upload-client';
import RNProgressHud from 'progress-hud';
import {Alert, Keyboard, Platform} from 'react-native';
import RNFS from 'react-native-fs';
import RNFetchBlob from 'rn-fetch-blob';
import AsyncStorage from '@react-native-community/async-storage';
import Navigation from '../types/navigation';

export const onPressImportLocal = async (
  login: string,
  password: string,
  navigation: Navigation,
  syncCellar: (object) => void,
  uploadFile: any,
) => {
  RNProgressHud.show();
  Keyboard.dismiss();
  const syncData = {login, password};
  try {
    const result = await RNFetchBlob.config({
      fileCache: true,
      timeout: 10000,
    }).fetch('GET', 'https://cellar-ventures.herokuapp.com/xml/middle-cellar.xml', {});
    const absPath = Platform.OS === 'android' ? 'file://' + result.path() : result.path();
    await AsyncStorage.setItem('Import', JSON.stringify(syncData));
    const file = new ReactNativeFile({
      uri: absPath,
      name: 'test',
      type: 'text/xml',
    });
    setTimeout(() => {
      uploadFile({variables: {file: file}});
    }, 1000);
  } catch (e) {
    Alert.alert('Error', 'An error occurred while receiving file');
    RNProgressHud.dismiss();
  }
};

export const onImportCellarProduction = async (
  login: string,
  password: string,
  navigation: Navigation,
  syncCellar: (object) => void,
  uploadFile: any,
) => {
  Keyboard.dismiss();
  RNProgressHud.show();
  const syncData = {login, password};
  try {
    const result = await RNFetchBlob.config({
      fileCache: true,
      timeout: 10000,
    }).fetch(
      'GET',
      `https://www.cellartracker.com/xlquery.asp?User=${encodeURIComponent(login)}&Password=${encodeURIComponent(
        password,
      )}&Format=xml`,
      {
        'Content-Type': 'text/xml',
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36',
      },
    );
    const absPath = Platform.OS === 'android' ? 'file://' + result.path() : result.path();
    RNFS.readFile(absPath).then(res => {
      if (/not logged/i.test(res.toString())) {
        Alert.alert('Error', 'Invalid login or password');
        RNProgressHud.dismiss();
      } else {
        AsyncStorage.setItem('Import', JSON.stringify(syncData));
        const file = new ReactNativeFile({
          uri: absPath,
          name: 'test',
          type: 'text/xml',
        });
        setTimeout(() => uploadFile({variables: {file: file}}), 1000);
      }
    });
  } catch (e) {
    Alert.alert('Error', 'An error occurred while receiving file');
    RNProgressHud.dismiss();
  }
};
