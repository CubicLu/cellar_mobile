import gql from 'graphql-tag';

export const COMMUNITY_SEARCH_QUERY = gql`
  query SearchCommunity($first: Float, $skip: Float, $q: String, $filters: [SearchInventoryFilter!], $marker: String) {
    searchCommunityV3(first: $first, skip: $skip, q: $q, filters: $filters, marker: $marker) {
      marker
      data {
        quantity
        wine {
          wineName
          wineTitle
          varietal
          vintage
          wineType
          producer
          color
          bottleCapacity
          currency
          price
          pictureURL
          rating
          id
          generalPriceInfo {
            market {
              avg
            }
          }
          locale {
            country
            subregion
            region
            appellation
          }
        }
      }
    }
  }
`;
