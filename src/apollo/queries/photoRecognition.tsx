import gql from 'graphql-tag';

export const RECOGNIZE_PHOTO = gql`
  query vuforia__recognizePicture($file: Upload!) {
    vuforia__recognizePicture(file: $file) {
      count
      targets {
        name
        metadata
      }
    }
  }
`;
