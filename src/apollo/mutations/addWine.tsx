import gql from 'graphql-tag';

export const ADD_WINE_MUTATION = gql`
  mutation AddWine(
    $wine: WineInputV2!
    $numberOfBottles: Int!
    $bottleNote: String
    $purchaseDate: DateTime!
    $deliveryDate: DateTime
    $purchaseNote: String
    $addToWishList: Boolean
    $file: Upload
  ) {
    addWineV2(
      file: $file
      wine: $wine
      numberOfBottles: $numberOfBottles
      bottleNote: $bottleNote
      purchaseDate: $purchaseDate
      deliveryDate: $deliveryDate
      purchaseNote: $purchaseNote
      addToWishList: $addToWishList
    )
  }
`;
