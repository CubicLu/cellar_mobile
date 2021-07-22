import gql from 'graphql-tag';

export const GET_CURRENT_OFFERS = gql`
  query currentOffers {
    currentOffers {
      offerToSell {
        offerId
        status
        tradeStatus
        lastNote
        isCountered
        buyerId
        wineInTrade {
          wineId
          wineTitle
          quantity
          sellerId
          pricePerBottle
          color
        }
        createdAt
        updatedAt
      }
      offerToBuy {
        offerId
        status
        tradeStatus
        lastNote
        isCountered
        buyerId
        wineInTrade {
          wineId
          wineTitle
          quantity
          sellerId
          pricePerBottle
          color
        }
        createdAt
        updatedAt
      }
    }
  }
`;

export const GET_TRANSACTION_RECEIPT = gql`
  query getReceipt($tradeOfferId: Int!) {
    transactionReceipt(tradeOfferId: $tradeOfferId) {
      tradeOfferId
      wineId
      wineName
      wineTitle
      quantity
      pricePerBottle
      totalPrice
      insurance
      status
      updatedAt
      totalPriceForSeller
      includeInsurance
      buyer {
        id
        firstName
        lastName
        userName
        prettyLocationName
        avatarURL
      }
      seller {
        id
        firstName
        userName
        lastName
        prettyLocationName
        avatarURL
      }
    }
  }
`;

export const TRANSACTION_RECEIPT_LIST = gql`
  query transactionReceiptList($first: Int, $skip: Int) {
    transactionReceiptList(first: $first, skip: $skip) {
      tradeOfferId
      wineName
      wineTitle
      quantity
      pricePerBottle
      totalPrice
      updatedAt
    }
  }
`;

export const GET_REJECTED_OFFERS = gql`
  query rejectedOffers($first: Int, $skip: Int) {
    rejectedOffers(first: $first, skip: $skip) {
      tradeOfferId
      wineId
      wineName
      wineTitle
      quantity
      pricePerBottle
      totalPrice
      updatedAt
      canBeRestored
      buyer {
        id
        firstName
        lastName
        prettyLocationName
        avatarURL
      }
      seller {
        id
        firstName
        lastName
        prettyLocationName
        avatarURL
      }
    }
  }
`;

export const GET_EXPIRED_OFFERS = gql`
  query expiredOffers {
    expiredOffers {
      expiredOffersToSell {
        tradeOfferId
        wineId
        wineName
        wineTitle
        quantity
        pricePerBottle
        totalPrice
        updatedAt
        buyer {
          id
          firstName
          lastName
          prettyLocationName
          avatarURL
        }
        seller {
          id
          firstName
          lastName
          prettyLocationName
          avatarURL
        }
      }
      expiredOffersToBuy {
        tradeOfferId
        wineName
        wineTitle
        quantity
        pricePerBottle
        totalPrice
        wineId
        updatedAt
        buyer {
          id
          firstName
          lastName
          prettyLocationName
          avatarURL
        }
        seller {
          id
          firstName
          lastName
          prettyLocationName
          avatarURL
        }
      }
    }
  }
`;

export const GET_PUBLIC_PROFILE = gql`
  query profilePublic($userId: Float!) {
    profilePublic(userId: $userId) {
      userName
      avatarURL
      prettyLocationName
    }
  }
`;

export const GET_OFFER_FROM_NOTIFICATION = gql`
  query($tradeOfferId: Int!) {
    tradeOffer(tradeOfferId: $tradeOfferId) {
      tradeOffer {
        offerId
        status
        tradeStatus
        includeInsurance
        insurance
        shippingFee
        totalPrice
        totalPriceForSeller
        lastNote
        isCountered
        buyerId
        wineInTrade {
          wineId
          wineName
          wineTitle
          seller {
            id
            firstName
            lastName
            userName
            prettyLocationName
            avatarURL
            authorizedTrader
          }
          sellerId
          color
          distance
          quantity
          pricePerBottle
        }
        createdAt
        updatedAt
      }
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
      tradeRole
    }
  }
`;
