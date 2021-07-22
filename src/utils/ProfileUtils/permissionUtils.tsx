import ImagePicker from 'react-native-image-picker';
import RNProgressHud from 'progress-hud';
import {Alert} from 'react-native';
import {SET_AVATAR_URL} from '../../constants/ActionTypes/profile';
import {check, PERMISSIONS, RESULTS} from 'react-native-permissions';

export const requestCameraOrLib = (profileDispatch, method) => {
  const options = {
    quality: 0.5,
    storageOptions: {
      path: 'images',
      waitUntilSaved: false,
    },
  };

  method(options, response => {
    // console.log('Response = ', response);
    if (response.didCancel) {
      RNProgressHud.dismiss();
    } else if (response.error) {
      console.log('ImagePicker Error: ', response.error);
      Alert.alert('Error', response.error);
      RNProgressHud.dismiss();
    } else {
      // You can also display the image using data:
      // const source = { uri: 'data:image/jpeg;base64,' + response.data };
      profileDispatch({type: SET_AVATAR_URL, payload: response.uri});
      RNProgressHud.dismiss();
    }
  });
};

export const requestLib = profileDispatch => {
  const options = {
    quality: 0.5,
    storageOptions: {
      path: 'images',
      waitUntilSaved: false,
    },
  };

  ImagePicker.launchImageLibrary(options, response => {
    // console.log('Response = ', response);
    if (response.didCancel) {
      RNProgressHud.dismiss();
    } else if (response.error) {
      console.log('ImagePicker Error: ', response.error);
      Alert.alert('Error', response.error);
      RNProgressHud.dismiss();
    } else {
      // You can also display the image using data:
      // const source = { uri: 'data:image/jpeg;base64,' + response.data };
      profileDispatch({type: SET_AVATAR_URL, payload: response.uri});
      RNProgressHud.dismiss();
    }
  });
};

export const androidRequestLocationPermissions = async () => {
  try {
    const result = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);

    switch (result) {
      case RESULTS.UNAVAILABLE:
        console.log('This feature is not available (on this device / in this context)');
        break;
      case RESULTS.DENIED:
        console.log('The permission has not been requested / is denied but requestable');
        break;
      case RESULTS.GRANTED:
        console.log('The permission is granted');
        break;
      case RESULTS.BLOCKED:
        console.log('The permission is denied and not requestable anymore');
        break;
    }
  } catch (err) {
    console.log('Permissions Error', err);
  }
};
