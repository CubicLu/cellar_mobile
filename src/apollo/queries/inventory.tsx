import gql from 'graphql-tag';

export const GET_INVENTORY_LIST = gql`
  query Inventory($skip: Int, $first: Int) {
    inventory(skip: $skip, first: $first) {
      quantity
      wine {
        wineName
        vintage
        wineType
        color
        bottleCapacity
        currency
        price
        pictureURL
        rating
        id
        locale {
          appellation
          country
          id
        }
      }
    }
  }
`;

export const INVENTORY_SEARCH_QUERY = gql`
  query Search($marker: String, $q: String, $filters: [SearchInventoryFilter!], $first: Float = 25, $skip: Float = 0) {
    searchInventoryV3(marker: $marker, q: $q, filters: $filters, first: $first, skip: $skip) {
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
          drinkWindow {
            start
            end
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
    inventoryInfo {
      valuation
      quantity
      currency
      marketValuation
    }
    profile {
      syncWithCellarTrackerIsAllowed
    }
  }
`;

export const GET_DESIGNATION_LIST = gql`
  query cellarDesignations {
    cellarDesignations {
      id
      name
    }
  }
`;
