import gql from 'graphql-tag';

export const SIGN_IN_MUTATION = gql`
  mutation SignIn($email: String!) {
    signIn(email: $email)
  }
`;
export const REQUEST_ACCESS = gql`
  mutation requestAccess($email: String!, $fullName: String!) {
    requestAccess(email: $email, fullName: $fullName)
  }
`;
