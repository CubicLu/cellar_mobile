import axios from 'axios';
import Config from 'react-native-config';
import {print, DocumentNode} from 'graphql';
import {getMetadata} from './other.utils';
import {LocalStorage} from './LocalStorage';
import NotificationService from '../service/NotificationService';

const axiosInstance: any = axios.create();

async function makeRequest(query: DocumentNode, variables?: any): Promise<any> {
  const token = await LocalStorage.getAccessCode();
  const deviceToken = await NotificationService.getToken();

  try {
    return await axiosInstance({
      url: Config.API_HOST,
      method: 'post',

      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        Metadata: JSON.stringify(await getMetadata()),
        DeviceToken: deviceToken,
      },

      data: {
        query: print(query),
        variables,
      },
    });
  } catch (e) {
    return {
      data: {
        data: null,
        errors: [e],
      },
    };
  }
}

export default makeRequest;
