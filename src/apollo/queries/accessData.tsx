import gql from 'graphql-tag';

export const GET_ACCESS_DATA = gql`
  {
    codeVerification @client {
      accessToken
      refreshToken
      user @client {
        email
      }
    }
  }
`;
