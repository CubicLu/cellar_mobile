import gql from 'graphql-tag';

export const DELETE_HISTORY_MUTATION = gql`
  mutation DeleteHistory($historyId: Int!) {
    deleteHistory(historyId: $historyId) {
      bottlesInCellar
      message
    }
  }
`;
