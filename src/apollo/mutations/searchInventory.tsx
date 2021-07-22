import gql from 'graphql-tag';

export const SEARCH_MUTATION = gql`
  mutation Search($first: Float, $skip: Float, $q: String, $filters: [SearchInventoryFilter!]) {
    search(first: $first, skip: $skip, q: $q, filters: $filters) {
      quantity
      wine {
        wineName
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
export const INVENTORY_SEARCH_MUTATION = gql`
  mutation Search(
    $marker: String
    $q: String
    $filters: [SearchInventoryFilter!]
    $first: Float = 25
    $skip: Float = 0
  ) {
    searchInventoryV2(marker: $marker, q: $q, filters: $filters, first: $first, skip: $skip) {
      marker
      data {
        quantity
        pricePerBottle
        wine {
          cellarDesignationId
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
          inWishList
          marketPrice
          allowForTrading
          id
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
