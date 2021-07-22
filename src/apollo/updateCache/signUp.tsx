import ApolloClient from 'apollo-client';

import AuthQuery from '../../types/queries/authQuery';

export const setSignUpData = (cache: ApolloClient<any>, queryData: AuthQuery, email: string) => {
  const data = {
    signUp: {
      __typename: 'Auth',
      success: true,
      email,
    },
  };
  cache.writeData({data});
};
