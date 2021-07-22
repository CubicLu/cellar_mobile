import gql from 'graphql-tag';
import RNFS from 'react-native-fs';
import axios from 'axios';
import Config from 'react-native-config';

import {chunksFromArray} from '../../../utils/other.utils';
import {UploadImageType} from '../../../types/other-types';

export const CHUNK_SIZE = 10;

export const CHECK_IMAGE_DOWNLOAD_LIST = gql`
  mutation checkImageDownloadList($data: Object, $downloadingCount: Object) {
    checkImageDownloadList(data: $data, downloadingCount: $downloadingCount) @client
  }
`;

export const FETCH_IMAGES_TO_CACHE = gql`
  mutation downloadImages($wineList: Object) {
    downloadImages(wineList: $wineList) @client
  }
`;

export const UPLOAD_IMAGES = gql`
  mutation uploadImages($imageList: Object) {
    uploadImages(imageList: $imageList) @client
  }
`;

export const DELETE_IMAGE_FROM_CACHE = gql`
  mutation deleteImageFromCache($path: String) {
    deleteImageFromCache(path: $path) @client
  }
`;

export const UPDATE_DOWNLOAD_QUEUE = gql`
  mutation vivinoUpdateDownloadQueue($downloadedIds: [Int!]!) {
    vivinoUpdateDownloadQueue(downloadedIds: $downloadedIds)
  }
`;

export const downloadImageMutations = {
  checkImageDownloadList: async (_, variables, {client}) => {
    const {data: wineList, downloadingCount} = variables;

    if (downloadingCount < 1) {
      return {loadMore: false, left: 0};
    }

    await client.mutate({mutation: FETCH_IMAGES_TO_CACHE, variables: {wineList}});

    //uploading
    let cachedImagesList = await RNFS.readDir(`${RNFS.CachesDirectoryPath}/temp-images`);

    let reducedImageList = cachedImagesList.reduce((t, c) => {
      if (c.name === '.DS_Store') {
        return t;
      }

      return t.concat({
        name: 'photos',
        filename: `${c.name}`,
        filepath: c.path,
        filetype: 'image/jpeg',
      });
    }, []);

    const chunksArray = chunksFromArray(reducedImageList, CHUNK_SIZE / 2);

    await Promise.all(
      chunksArray.map(async chunk => {
        try {
          const {
            data: {uploadImages: downloadedIds},
          } = await client.mutate({
            mutation: UPLOAD_IMAGES,
            variables: {
              imageList: chunk,
            },
          });

          return await client.mutate({mutation: UPDATE_DOWNLOAD_QUEUE, variables: {downloadedIds}});
        } catch (e) {}
      }),
    );

    if (downloadingCount < CHUNK_SIZE) {
      return {loadMore: false, left: 0};
    } else {
      return {loadMore: true, left: downloadingCount - CHUNK_SIZE};
    }
  },

  downloadImages: async (_, variables, {client}) => {
    const {wineList} = variables;
    const cachesDirectoryPath = `${RNFS.CachesDirectoryPath}/temp-images`;
    await RNFS.mkdir(cachesDirectoryPath);
    const getName = (wineId: number, queryId: number) => `vivino_${wineId}_${queryId}`;

    return await Promise.all(
      wineList.map(wine => {
        const name = getName(wine.wineId, wine.id);

        return RNFS.downloadFile({
          // fromUrl: wine.wineImageUrls[0],
          fromUrl: wine.wineImageUrls[0],

          toFile: `${cachesDirectoryPath}/${name}.jpg`,
        }).promise.then(res => {
          if (res.statusCode === 403) {
            console.debug('Failed to download: ', wine.id);
            client.mutate({mutation: UPDATE_DOWNLOAD_QUEUE, variables: {downloadedIds: [wine.id]}});
          }
        });
      }),
    );
  },

  uploadImages: async (_, variables, {client}) => {
    const {imageList} = variables;

    const base64Images: UploadImageType[] = await Promise.all(
      imageList.map(async el => {
        const base64Image = await RNFS.readFile(el.filepath, 'base64');
        const splitted = el.filename.split('_');
        const name = `${splitted[0]}_${splitted[1]}`;
        const queryId = +splitted[2].replace('.jpg', '');

        return {
          data: base64Image,
          name: `${name}.jpg`,
          contentType: 'image',
          filepath: el.filepath,
          key: Config.LAMBDA_UPLOAD_KEY,
          queryId,
        };
      }),
    );

    return await Promise.all(
      base64Images.map(async imgOptions => {
        try {
          const {data} = await axios.post(Config.IMAGE_UPLOAD_URL, {
            ...imgOptions,
            authorization: Config.LAMBDA_UPLOAD_KEY,
          });

          if (data.statusCode === 201) {
            await client.mutate({
              mutation: DELETE_IMAGE_FROM_CACHE,
              variables: {
                path: imgOptions.filepath,
              },
            });
            return imgOptions.queryId;
          }
        } catch (e) {
          console.log(e, 'error');
        }
      }),
    );
  },

  deleteImageFromCache: async (_, {path}, __) => {
    return RNFS.unlink(path);
  },
};
