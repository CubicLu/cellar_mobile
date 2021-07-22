import {ReactNativeFile} from 'apollo-upload-client';
import ImageResizer from 'react-native-image-resizer';
import {Alert} from 'react-native';

export const imageResizeAction = (uri, width = 1500, height = 1500, quality = 100) => {
  return ImageResizer.createResizedImage(uri, width, height, 'JPEG', quality)
    .then(response => {
      return new ReactNativeFile({
        uri: response.uri,
        name: 'image.jpg',
        type: 'image/jpg',
      });
    })
    .catch(err => {
      Alert.alert('Error', err);
    });
};
