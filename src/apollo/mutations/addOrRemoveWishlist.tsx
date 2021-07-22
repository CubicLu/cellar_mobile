import gql from 'graphql-tag';

export const ADD_TO_WISHLIST = gql`
  mutation AddToWishes($wineId: Int!) {
    addToWishes(wineId: $wineId)
  }
`;

export const REMOVE_FROM_WISHLIST = gql`
  mutation DeleteFromWishes($wineId: Int!) {
    deleteFromWishes(wineId: $wineId)
  }
`;

export const ADD_CUSTOM_WINE_TO_WISHLIST = gql`
  mutation addWishlist($file: Upload, $wine: WineInput!) {
    addWishlist(file: $file, wine: $wine)
  }
`;
