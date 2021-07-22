import gql from 'graphql-tag';

export const BACKUP_PROFILE = gql`
  mutation createBackup {
    createBackup {
      message
      numberOfInventoryWines
      numberOfHistoryWines
      numberOfWishlistWines
    }
  }
`;
