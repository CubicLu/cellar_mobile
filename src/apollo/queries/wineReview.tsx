import gql from 'graphql-tag';

export const GET_REVIEW_LIST = gql`
  query($first: Int, $skip: Int) {
    wineReviewMasterList(first: $first, skip: $skip) {
      data {
        avgRating
        wine {
          wineTitle
          varietal
          locale {
            subregion
          }
          id
          color
          pictureURL
        }
        data {
          historyId
          userPublic {
            userName
            avatarURL
            authorizedTrader
            prettyLocationName
          }
          rating
          drinkNote
          drinkDate
        }
      }
    }
  }
`;
