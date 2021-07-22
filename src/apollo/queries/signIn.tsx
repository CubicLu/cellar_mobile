import gql from 'graphql-tag';

export const GET_SIGN_IN_DATA = gql`
  {
    signIn @client {
      success
      email
    }
  }
`;
