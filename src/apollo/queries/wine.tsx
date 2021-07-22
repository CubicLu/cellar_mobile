import gql from 'graphql-tag';

export const WINE = gql`
  query Wine($wineId: Int!) {
    wineV2(wineId: $wineId) {
      wine {
        id
        pictureURL
        wineName
        wineTitle
        producer
        color
        vintage
        varietal
        bottleCapacity
        price
        wineType
        inWishList
        marketPrice
        allowForTrading
        drinkWindow {
          start
          end
        }
        generalPriceInfo {
          market {
            avg
          }
        }
        locale {
          country
          region
          subregion
          appellation
        }
        inWishList
        cellarDesignationId
      }
      quantity
      pricePerBottle
    }
  }
`;

export const COMMUNITY_WINE = gql`
  query Wine($wineId: Int!) {
    winesInTrade(wineId: $wineId) {
      wineInTrade {
        wineId
        distance
        seller {
          userName
          avatarURL
          authorizedTrader
          prettyLocationName
          id
          avatarURL
        }
        quantity
        sellerId
      }
    }
    wineV2(wineId: $wineId) {
      wine {
        id
        pictureURL
        wineName
        wineTitle
        producer
        color
        vintage
        varietal
        bottleCapacity
        price
        wineType
        generalPriceInfo {
          market {
            avg
          }
        }
        locale {
          country
          region
          subregion
          appellation
        }
        inWishList
      }
      quantity
      pricePerBottle
    }
  }
`;

export const GET_WINE_WITH_HISTORY = gql`
  query Wine($wineId: Int!) {
    wineV2(wineId: $wineId) {
      wine {
        id
        pictureURL
        wineName
        wineTitle
        producer
        color
        vintage
        varietal
        bottleCapacity
        price
        wineType
        locale {
          country
          region
          subregion
          appellation
        }
        inWishList
      }
      quantity
      pricePerBottle
    }

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

export const SALE_WINE = gql`
  query Wine($wineId: Int!) {
    winesInTradeCellrSale(wineId: $wineId) {
      wineInTrade {
        wineId
        distance
        pricePerBottle
        seller {
          userName
          avatarURL
          authorizedTrader
          prettyLocationName
          id
          avatarURL
        }
        quantity
        sellerId
      }
    }
    wineV2(wineId: $wineId) {
      wine {
        id
        pictureURL
        wineName
        wineTitle
        producer
        color
        vintage
        varietal
        bottleCapacity
        price
        wineType
        generalPriceInfo {
          market {
            avg
          }
        }
        locale {
          country
          region
          subregion
          appellation
        }
        inWishList
      }
      quantity
      pricePerBottle
    }
  }
`;
