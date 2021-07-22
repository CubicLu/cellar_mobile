import RNProgressHud from 'progress-hud';
import AsyncStorage from '@react-native-community/async-storage';
import {Routes} from '../constants';
import {navigate} from './navigation.service';
import NotificationService from '../service/NotificationService';

export const logout = async client => {
  await AsyncStorage.removeItem('Code');
  await AsyncStorage.removeItem('Import');
  await AsyncStorage.removeItem('Dashboard');
  await AsyncStorage.removeItem('Filters');
  NotificationService.unsubscribe();
  navigate(Routes.launch.name, {});
  await client.resetStore();
  RNProgressHud.dismiss();
};
