import gql from 'graphql-tag';

export const ADD_OR_REMOVE_BOTTLES = gql`
  mutation AddOrRemoveBottles(
    $wineId: Int!
    $numberOfBottles: Int!
    $date: DateTime!
    $note: String!
    $reason: Reasons
    $cellarDesignationId: Float
    $bottleNote: String
    $rating: Int
  ) {
    addOrRemoveBottlesV2(
      wineId: $wineId
      numberOfBottles: $numberOfBottles
      date: $date
      note: $note
      reason: $reason
      cellarDesignationId: $cellarDesignationId
      bottleNote: $bottleNote
      rating: $rating
    ) {
      bottlesInCellar
      message
    }
  }
`;
