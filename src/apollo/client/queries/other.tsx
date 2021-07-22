import gql from 'graphql-tag';

export const GET_LOCAL_RELEASE_NOTES = gql`
  query getReleaseNotes {
    releaseNotes @client
    whatNewIndicator @client
  }
`;

export const GET_LOCAL_RELEASE_LIST = gql`
  query getReleaseList {
    releaseList @client
  }
`;

export const GET_SUBSCRIPTION_STATE = gql`
  query unreadTradeMessages {
    unreadTradeMessages @client {
      unansweredTradeMessages {
        numberOfCurrentTradeOffers
        numberOfPastTradeOffers
        numberOfTransactionReceiptsTradeOffers
        numberOfUnansweredTradeOffers
      }
    }
  }
`;

export const CHECK_EMAIL_VERIFICATION = gql`
  query emailIsVerified($email: String!) {
    emailIsVerified(email: $email) {
      isVerified
      verifiedStatus
    }
  }
`;
