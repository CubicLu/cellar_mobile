import ApolloClient from 'apollo-client';

import CodeQuery from '../../types/queries/codeQuery';

export const setCodeData = (cache: ApolloClient<any>, queryData: CodeQuery) => {
  const data = {
    codeVerification: {
      __typename: 'AuthPayload',
      accessToken: queryData.accessToken,
      refreshToken: queryData.refreshToken,
      user: !queryData.user
        ? null
        : {
            __typename: 'User',
            email: queryData.user.email,
          },
    },
  };
  cache.writeData({data});
};
