import gql from 'graphql-tag';

export const SALE_SEARCH = gql`
  query($marker: String, $q: String, $filters: [SearchInventoryFilter!], $first: Float = 25, $skip: Float = 0) {
    searchCellrSaleWines(marker: $marker, q: $q, filters: $filters, first: $first, skip: $skip) {
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

export const SALE_FILTERS = gql`
  query {
    filtersCellrSaleWines
  }
`;
