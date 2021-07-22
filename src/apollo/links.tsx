import ApolloLinkTimeout from 'apollo-link-timeout';
import {createUploadLink} from 'apollo-upload-client';
import {setContext} from 'apollo-link-context';
import {LocalStorage} from '../utils/LocalStorage';
import Config from 'react-native-config';
import {getMetadata} from '../utils/other.utils';
import {WebSocketLink} from 'apollo-link-ws';
import {SubscriptionClient} from 'subscriptions-transport-ws';
import NotificationService from '../service/NotificationService';

// Request timeout link to prevent infinity loading
export const timeoutLink = new ApolloLinkTimeout(15000);
//Link for uploading media files
export const uploadLink = createUploadLink({
  uri: Config.API_HOST,
});
//Link for appending Bearer token to request for authorization in backend system
export const authLink = setContext(async (req, {headers}) => {
  const token = await LocalStorage.getAccessCode();
  const deviceToken = await NotificationService.getToken();

  if (token) {
    return {
      ...headers,
      headers: {
        Authorization: `Bearer ${token}`,
        Metadata: JSON.stringify(await getMetadata()),
        DeviceToken: deviceToken,
      },
    };
  }
  return {
    ...headers,
  };
});

const ws = new SubscriptionClient((Config.API_HOST as string).replace(/^https?/, 'ws'), {
  reconnect: true,
});
export const wsLink = new WebSocketLink(ws);
