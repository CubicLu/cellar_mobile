import gql from 'graphql-tag';

export const PHOTO_RECOGNITION_MUTATION = gql`
  mutation PhotoRecongnition($file: Upload!) {
    photoRecognition(file: $file) {
      wineId
      rank
    }
  }
`;
