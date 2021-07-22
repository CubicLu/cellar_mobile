import AsyncStorage from '@react-native-community/async-storage';
import NotificationService from '../service/NotificationService';

export class LocalStorage {
  static async getAccessCode() {
    try {
      const data = await AsyncStorage.getItem('Code');
      if (data) {
        const token = JSON.parse(data);
        return token.accessToken;
      }
    } catch (e) {
      return null;
    }
  }

  static async getRefresh() {
    try {
      const data = await AsyncStorage.getItem('Code');
      if (data) {
        const token = JSON.parse(data);
        return token.refreshToken;
      }
    } catch (e) {
      return null;
    }
  }

  static async getAllData() {
    try {
      const data = await AsyncStorage.getItem('Code');
      const notificationToken = await NotificationService.getToken();

      if (data) {
        return {...JSON.parse(data), notificationToken};
      }
    } catch (e) {
      return null;
    }
  }
}
