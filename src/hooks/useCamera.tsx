import {useCallback, useEffect, useState} from 'react';
import {Alert, Platform} from 'react-native';
import {PERMISSIONS, request} from 'react-native-permissions';
import ImagePicker from 'react-native-image-picker';
import RNProgressHud from 'progress-hud';

import {fadeAnimation, handleStorageResult, permissionCameraFlow} from '../utils/PhotoRecognitionUtils';

export const useCamera = () => {
  const [photoUrl, setPhotoUrl] = useState({uri: ''});
  const [hint, setHint] = useState(false);
  const [isCameraAllowed, setIsCameraAllowed] = useState(false);
  const [, updateState] = useState();
  const forceUpdate = useCallback(() => updateState({}), []);

  const requestCameraPermission = useCallback(() => {
    Platform.OS === 'ios'
      ? request(PERMISSIONS.IOS.CAMERA).then(result => {
          permissionCameraFlow(result, forceUpdate, setIsCameraAllowed, permissionAlert);
        })
      : request(PERMISSIONS.ANDROID.CAMERA).then(result => {
          permissionCameraFlow(result, forceUpdate, setIsCameraAllowed, permissionAlert);
        });
  }, [forceUpdate]);

  const requestStoragePermission = useCallback(() => {
    const showPicker = () => {
      const options = {
        quality: 0.5,
        storageOptions: {
          path: 'images',
          waitUntilSaved: false,
        },
      };

      ImagePicker.launchImageLibrary(options, response => {
        // console.log('Response = ', response);
        setHint(false);
        if (response.didCancel) {
          RNProgressHud.dismiss();
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
          RNProgressHud.dismiss();
        } else {
          const source = {uri: response.uri};
          // You can also display the image using data:
          // const source = { uri: 'data:image/jpeg;base64,' + response.data };
          setTimeout(() => {
            setPhotoUrl(source);
            RNProgressHud.show();
          }, 300);
        }
      });
    };

    Platform.OS === 'ios'
      ? showPicker()
      : request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE).then(result => {
          handleStorageResult(result, forceUpdate, showPicker, permissionAlert);
        });
  }, [forceUpdate]);

  useEffect(() => {
    requestCameraPermission();
  }, [requestCameraPermission]);

  return {
    photoUrl,
    setPhotoUrl,
    hint,
    setHint,
    isCameraAllowed,
    requestCameraPermission,
    requestStoragePermission,
    takePicture,
  };
};

const permissionAlert = (title, onConfirm) => {
  Alert.alert(
    'Permission required',
    `We need ${title} permissions to proceed`,
    [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'Open Settings',
        onPress: () => onConfirm(),
      },
    ],
    {cancelable: true},
  );
};

const takePicture = (camera, setImage, animation, setHint) => {
  const options = {
    quality: 1,
    base64: true,
    pauseAfterCapture: true,
  };
  (camera as any).current
    .takePictureAsync(options)
    .then(data => {
      const source = {uri: data.uri};
      setHint(false);
      fadeAnimation(animation);
      setImage(source);
    })
    .catch(err => console.log(err));
};
