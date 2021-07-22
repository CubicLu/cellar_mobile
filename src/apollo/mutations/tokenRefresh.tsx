import gql from 'graphql-tag';

export const TOKEN_REFRESH = gql`
  mutation GetToken($refreshToken: String!) {
    token(refreshToken: $refreshToken) {
      accessToken
      refreshToken
      user {
        email
      }
    }
  }
`;
