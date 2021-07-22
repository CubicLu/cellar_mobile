import gql from 'graphql-tag';

export const WINE_HISTORY = gql`
  query WineHistory($wineId: Int!) {
    wineHistory(wineId: $wineId) {
      id
      numberOfBottles
      bottleNote
      purchaseDate
      deliveryDate
      purchaseNote
      note
      reason
      wine {
        id
        producer
        wineType
        wineName
        vintage
        currency
        price
        pictureURL
      }
    }
  }
`;

export const WINE_NOTES = gql`
  query WineHistory($wineId: Int!) {
    wineHistory(wineId: $wineId) {
      bottleNote
    }
  }
`;

export const GET_DRINK_HISTORY = gql`
  query AllHistory($first: Int, $skip: Int, $q: String) {
    allHistory(first: $first, skip: $skip, q: $q) {
      totalQuantity
      data {
        numberOfBottles
        numberOfNotes
        wine {
          id
          wineTitle
          producer
          wineName
          color
        }
      }
    }
  }
`;
export const GET_PURCHASE_HISTORY = gql`
  query inventoryHistoryInfo {
    inventoryHistoryInfo {
      data {
        date
        quantity
      }
    }
  }
`;
export const GET_MONTH_HISTORY = gql`
  query inventoryHistoryWines($q: String, $startAt: DateTime, $stopAt: DateTime, $filters: [SearchInventoryFilter!]) {
    inventoryHistoryWines(q: $q, startAt: $startAt, stopAt: $stopAt, filters: $filters) {
      data {
        wine {
          wineTitle
          id
          wineName
          producer
          bottleCapacity
          locale {
            country
          }
        }
        quantity
      }
    }
  }
`;

export const GET_COMMUNITY_HISTORY = gql`
  query communityInventoryHistoryWines($first: Float, $skip: Float, $q: String) {
    communityInventoryHistoryWines(q: $q, skip: $skip, first: $first) {
      data {
        wine {
          id
          color
          wineName
          wineTitle
          producer
          rating
          locale {
            country
          }
        }
        lastReview {
          rating
          drinkNote
          userPublic {
            userName
            avatarURL
          }
        }
        countOfReviews
        quantity
      }
    }
  }
`;

export const GET_REVIEWS = gql`
  query wineReviewList($wineId: Int!, $first: Int, $skip: Int) {
    wineReviewList(wineId: $wineId, first: $first, skip: $skip) {
      countOfReviews
      data {
        drinkNote
        drinkDate
        rating
        historyId
        userPublic {
          userName
          avatarURL
        }
      }
    }
  }
`;
