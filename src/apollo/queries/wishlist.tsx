import gql from 'graphql-tag';

export const WISH_LIST = gql`
  query Wishlist($first: Float, $skip: Float) {
    wishesV2(first: $first, skip: $skip) {
      countOfWinesInWishList
      wishList {
        wineName
        wineTitle
        varietal
        vintage
        wineType
        producer
        color
        bottleCapacity
        currency
        expectedPrice
        pictureURL
        rating
        id
        expectedPrice
        locale {
          country
          subregion
          region
          appellation
        }
      }
    }
  }
`;

export const CHECK_WISHLIST_WINE = gql`
  query checkWineInWishlist(
    $producer: String
    $designation: String
    $vintage: String
    $locale: LocaleInput
    $varietal: String
    $bottleCapacity: Float
  ) {
    checkWineInWishlist(
      producer: $producer
      designation: $designation
      vintage: $vintage
      locale: $locale
      varietal: $varietal
      bottleCapacity: $bottleCapacity
    )
  }
`;

export const GET_WISHLIST_LEADERBOARD = gql`
  query usersLeaderboard($first: Float, $skip: Float) {
    usersLeaderboard(first: $first, skip: $skip) {
      totalCount
      data {
        userPublic {
          userName
          prettyLocationName
        }
        rank
        score
      }
      currentUser {
        user {
          firstName
          lastName
          location {
            prettyLocationName
          }
        }
        rank
        score
      }
    }
  }
`;

export const WISHLIST_SEARCH_QUERY = gql`
  query searchWishlist($first: Float, $skip: Float, $q: String, $filters: [SearchInventoryFilter!], $marker: String) {
    searchWishlist(first: $first, skip: $skip, q: $q, filters: $filters, marker: $marker) {
      marker
      countOfWinesInWishList
      wishList {
        wineName
        wineTitle
        varietal
        vintage
        wineType
        producer
        color
        bottleCapacity
        currency
        expectedPrice
        pictureURL
        rating
        id
        expectedPrice
        locale {
          country
          subregion
          region
          appellation
        }
      }
    }
  }
`;
