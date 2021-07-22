import gql from 'graphql-tag';

export const GET_SIGN_UP_DATA = gql`
  {
    signUp @client {
      success
      email
    }
  }
`;
