import gql from 'graphql-tag';

export const UPDATE_WINE = gql`
  mutation UpdateWine(
    $wineId: Int!
    $file: Upload
    $wineName: String
    $country: String
    $region: String
    $subregion: String
    $appellation: String
    $producer: String
    $cost: Float
    $vintage: String
    $cellarDesignationId: Float
    $varietal: String
    $bottleCapacity: Float
    $allowForTrading: Boolean
    $drinkDateStart: DateTime
    $drinkDateEnd: DateTime
  ) {
    updateWineV2(
      file: $file
      wineId: $wineId
      wineName: $wineName
      country: $country
      region: $region
      subregion: $subregion
      appellation: $appellation
      producer: $producer
      pricePerBottle: $cost
      vintage: $vintage
      cellarDesignationId: $cellarDesignationId
      varietal: $varietal
      bottleCapacity: $bottleCapacity
      allowForTrading: $allowForTrading
      drinkDateStart: $drinkDateStart
      drinkDateEnd: $drinkDateEnd
    ) {
      message
      data {
        wine {
          id
        }
        quantity
      }
    }
  }
`;
