import gql from 'graphql-tag';

export const CELLAR_TRACKER_SYNC_MUTATION = gql`
  mutation CellarTrackerSync($file: Upload!) {
    cellarTrackerSync(file: $file)
  }
`;
