import gql from 'graphql-tag';

export const INIT_APP = gql`
  query releasesList {
    releasesList {
      releases {
        release
        from
      }
    }
    filters
    filtersCommunity
    cellarDesignations {
      id
      name
    }
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
export const TRADE_MESSAGES_SUBSCRIPTION = gql`
  subscription unreadTradeMessagesSubscription($subscriptionId: String!) {
    unreadTradeMessagesSubscription(subscriptionId: $subscriptionId) {
      numberOfUnansweredTradeOffers
      unansweredTradeMessages {
        numberOfCurrentTradeOffers
        numberOfPastTradeOffers
        numberOfTransactionReceiptsTradeOffers
        numberOfUnansweredTradeOffers
      }
    }
  }
`;

export const INIT_UNREAD_TRADE_OFFERS = gql`
  query unreadTradeMessages {
    unreadTradeMessages {
      unansweredTradeMessages {
        numberOfCurrentTradeOffers
        numberOfPastTradeOffers
        numberOfTransactionReceiptsTradeOffers
        numberOfUnansweredTradeOffers
      }
    }
  }
`;

export const GET_APP_VERSION = gql`
  query {
    versionCheck {
      version
      isForced
    }
  }
`;
