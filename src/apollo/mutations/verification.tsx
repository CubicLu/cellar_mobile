import gql from 'graphql-tag';

export const CODE_VERIFICATION_MUTATION = gql`
  mutation CodeVerification($email: String!, $verificationCode: String!) {
    codeVerification(email: $email, verificationCode: $verificationCode) {
      accessToken
      refreshToken
      user {
        email
      }
    }
  }
`;
