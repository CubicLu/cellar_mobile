import ApolloClient from 'apollo-client';

import AuthQuery from '../../types/queries/authQuery';

export const setSignInData = (cache: ApolloClient<any>, queryData: AuthQuery, email: string) => {
  const data = {
    signIn: {
      __typename: 'Auth',
      success: true,
      email,
    },
  };
  cache.writeData({data});
};
