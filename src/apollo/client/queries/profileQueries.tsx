import gql from 'graphql-tag';

export const GET_LOCAL_PROFILE = gql`
  query getLocalProfile {
    userProfile @client {
      authorizedTrader
      id
      firstName
      lastName
      email
      emailVerified
      sex
      avatarURL
      defaultCurrency
      verificationCode
      #refreshToken
      country
      subdivision
      firstWine
      favoriteWineries
      favoritePlaceToTravel
      mustGoRestaurant
      createdAt
      updatedAt
      syncWithCellarTrackerIsAllowed
      readedReleaseNotes
      location {
        longitude
        latitude
        country
        city
        prettyLocationName
        state
        stateAbbreviation
        subdivision
      }
    }
  }
`;

export const GET_SUBSCRIPTION_ID = gql`
  query subscriptionId {
    userProfile @client {
      subscriptionId
    }
  }
`;
