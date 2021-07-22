import {ReactNativeFile} from 'apollo-upload-client';
import {Alert, Animated} from 'react-native';
import {openSettings, RESULTS} from 'react-native-permissions';
import ImageResizer from 'react-native-image-resizer';
import RNProgressHud from 'progress-hud';
import {hasProperties} from '../other.utils';

export const fadeAnimation = animation => {
  Animated.sequence([
    Animated.timing(animation, {
      toValue: 0,
      duration: 0,
    }),
    Animated.timing(animation, {
      toValue: 1,
      duration: 300,
    }),
  ]).start();
};

export const takePicture = (animation, camera, setImage, uploadImageServer) => {
  const options = {
    quality: 1,
    base64: true,
    pauseAfterCapture: true,
  };
  (camera as any).current
    .takePictureAsync(options)
    .then(data => {
      const source = {uri: data.uri};
      setImage(source);
      fadeAnimation(animation);
      uploadImageServer(data.uri);
    })
    .catch(err => console.log(err));
};

export const permissionCameraFlow = (result, forceUpdate, setGivenCamera, permissionAlert) => {
  switch (result) {
    case RESULTS.UNAVAILABLE:
      Alert.alert('Error', 'This feature is not available (on this device / in this context)');
      break;
    case RESULTS.DENIED:
      console.log('The permission has not been requested / is denied but requestable');
      break;
    case RESULTS.GRANTED:
      forceUpdate();
      setGivenCamera(true);
      break;
    case RESULTS.BLOCKED:
      permissionAlert('camera', () => {
        openSettings().catch(() => console.log('cannot open settings'));
      });
      console.log('The permission is denied and not requestable anymore');
      break;
  }
};

export const handleStorageResult = (result, forceUpdate, showPicker, permissionAlert) => {
  switch (result) {
    case RESULTS.UNAVAILABLE:
      Alert.alert('Error', 'This feature is not available (on this device / in this context)');
      break;
    case RESULTS.DENIED:
      console.log('The permission has not been requested / is denied but requestable');
      break;
    case RESULTS.GRANTED:
      forceUpdate();
      showPicker();
      break;
    case RESULTS.BLOCKED:
      permissionAlert('photo library', () => {
        openSettings().catch(() => console.log('cannot open settings'));
      });
      console.log('The permission is denied and not requestable anymore');
      break;
  }
};

export const imageResizerAction = (uri, uploadPhoto) => {
  ImageResizer.createResizedImage(uri, 1500, 1500, 'JPEG', 100)
    .then(response => {
      // response.uri is the URI of the new image that can now be displayed, uploaded...
      console.log(response.size);
      const file = new ReactNativeFile({
        uri: response.uri,
        name: 'image',
        type: 'image/jpg',
      });
      console.log(file);
      uploadPhoto({variables: {file: file}});
      RNProgressHud.show();
    })
    .catch(err => {
      Alert.alert('Error', err);
      // Oops, something went wrong. Check that the filename is correct and
      // inspect err to get more details.
    });
};

export const parseVuforiaMetadata = (json: string) => {
  try {
    const wine = JSON.parse(json);
    const isValidObject = hasProperties(wine, ['producer', 'locale', 'wineName', 'vintage', 'varietal']);

    if (isValidObject) {
      return wine;
    }

    return isValidObject;
  } catch (e) {
    return false;
  }
};
