import gql from 'graphql-tag';

export const SIGN_UP_MUTATION = gql`
  mutation SignUp($email: String!) {
    signUp(email: $email)
  }
`;
