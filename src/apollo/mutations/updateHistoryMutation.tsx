import gql from 'graphql-tag';

export const UPDATE_HISTORY_MUTATION = gql`
  mutation UpdateHistory($historyId: Int!, $numberOfBottles: Int!, $date: DateTime!, $reason: Reasons, $note: String!) {
    updateHistory(historyId: $historyId, numberOfBottles: $numberOfBottles, date: $date, note: $note, reason: $reason) {
      bottlesInCellar
      message
    }
  }
`;
