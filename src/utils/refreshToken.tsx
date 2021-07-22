import {Observable} from 'apollo-link';
import axios from 'axios';
import {print} from 'graphql';
import RNProgressHud from 'progress-hud';
import AsyncStorage from '@react-native-community/async-storage';

import {LocalStorage} from './LocalStorage';
import {setCodeData} from '../apollo/updateCache/setCode';
import {logout} from './logout';
import {Alert} from 'react-native';
import {TOKEN_REFRESH} from '../apollo/mutations/tokenRefresh';
import Config from 'react-native-config';

export default (operation, client, forward) =>
  // @ts-ignore
  new Observable(async observer => {
    const oldHeaders = operation.getContext().headers;
    RNProgressHud.show();
    const refreshToken = await LocalStorage.getRefresh();

    axios
      .post(Config.API_HOST, {
        query: print(TOKEN_REFRESH),
        variables: {
          refreshToken,
        },
      })
      .then(data => {
        try {
          console.log('DATA', data);
          if (data.data.data) {
            AsyncStorage.setItem('Code', JSON.stringify(data.data.data.token));
            setCodeData(client, data.data.data.token);
            operation.setContext({
              headers: {
                ...oldHeaders,
                authorization: `Bearer ${data.data.data.token.accessToken}`,
              },
            });

            const subscriber = {
              next: observer.next.bind(observer),
              error: observer.error.bind(observer),
              complete: observer.complete.bind(observer),
            };

            setTimeout(() => {
              return forward(operation).subscribe(subscriber);
            }, 2000);
          }

          //in case of some errors initiate Logout process to Launch screen and remove stored access data
          if (data.data.errors) {
            switch (data.data.errors[0].statusCode) {
              case 403:
                logout(client);
                break;
              default:
                RNProgressHud.dismiss();
                Alert.alert('Error', data.data.errors[0].message);
                break;
            }
          }
        } catch (e) {
          Alert.alert('Error', e);
          logout(client);
        }
      })
      .catch(() => {
        logout(client);
      });
  });
