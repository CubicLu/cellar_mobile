import gql from 'graphql-tag';
import {CHUNK_SIZE} from '../mutations';

export const GET_IMAGE_LIST = gql`
  query vivinoGetDownloadQueue {
    vivinoGetDownloadQueue(first: ${CHUNK_SIZE}) {
      downloadingCount
      data {
        id
        wineId
        wineImageUrls
      }
    }
  }
`;
