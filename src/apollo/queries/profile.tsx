import gql from 'graphql-tag';

export const GET_PROFILE = gql`
  query Profile {
    profile {
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
      subscriptionId
      authorizedTrader
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

export const GET_SYNC_STATUS = gql`
  query Profile {
    profile {
      syncWithCellarTrackerIsAllowed
    }
  }
`;
