import {ApolloClient, InMemoryCache} from 'apollo-boost';

import {ApolloLink, split} from 'apollo-link';
import {onError} from 'apollo-link-error';
import React from 'react';
import {ApolloProvider} from 'react-apollo';
import stripe from 'tipsi-stripe';

import App from './App';
import refreshToken from './utils/refreshToken';
import {authLink, timeoutLink, uploadLink, wsLink} from './apollo/links';
import {logout} from './utils/logout';
import {mutations, initState} from './apollo/client';
import {getMainDefinition} from 'apollo-utilities';
import CONFIG from './constants/config';

const STRIPE_LIVE_KEY =
  'pk_live_51IIatmCdBcttcYVmk3XarnYpwgAWh9L2yoMuWJCnbCbkMmTJQkkfImWRqIT2Gqy4o3YDl22iHGWReTWi7kbHz2lB00xwpiq6NI';

const STRIPE_TEST_KEY =
  'pk_test_51IIatmCdBcttcYVm5ZTJFpJjd2VGYy3Tq2xb1SpkHXTlHhnui7Y4xlQZaXDxr3dSIKeUsdjKd71ftdDxfxC0gxX900JcpVF2Vl';

/**
 * Interaction with Apollo GraphQL
 */
export default () => {
  stripe.setOptions({
    publishableKey: CONFIG.LIVE_PAYMENTS ? STRIPE_LIVE_KEY : STRIPE_TEST_KEY,
    merchantId: CONFIG.STAGING_BUILD ? 'merchant.org.reactjs.native.Celler' : 'merchant.test.name.com1',
    androidPayMode: 'test', // Android only
  });

  const cache = new InMemoryCache({addTypename: false});
  //Error link catches all the errors and handle it
  const errorLink = onError(({graphQLErrors, operation, forward}) => {
    if (graphQLErrors) {
      graphQLErrors.map(err => console.log('Error', err));
      //@ts-ignore
      switch (graphQLErrors[0].statusCode) {
        case 401:
          //in case of token expiration initiate process of refreshing and repeating request
          return refreshToken(operation, client, forward);
        case 403:
          console.log('Error', graphQLErrors[0].message);
          if (graphQLErrors[0].message.includes('expired')) {
            logout(client);
          }
          break;
      }
    }
  });

  const link = split(
    // split based on operation type
    ({query}) => {
      const definition = getMainDefinition(query);
      return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
    },
    wsLink,
    ApolloLink.from([errorLink, timeoutLink, authLink, uploadLink]),
  );

  const client = new ApolloClient({
    cache,
    link,
    //@ts-ignore
    resolvers: {
      Mutation: mutations,
    },
  });

  cache.writeData({
    data: initState,
  });

  return (
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  );
};
