import RNProgressHud from 'progress-hud';
import React, {useEffect, useRef, useState, useCallback} from 'react';
import {NavigationEvents} from 'react-navigation';
import {
  StyleSheet,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  View,
  Animated,
  Alert,
  Platform,
  StatusBar,
} from 'react-native';
import {request, PERMISSIONS} from 'react-native-permissions';
import {RNCamera} from 'react-native-camera';
import ImagePicker from 'react-native-image-picker';
import {useMutation} from '@apollo/react-hooks';

import Images from '../../../assets/images';
import {PHOTO_RECOGNITION_MUTATION} from '../../../apollo/mutations/photoRecognitionMutation';
import {FailSuccessView} from '../../../components/PhotoRecognitionComponents/FailSuccesView';
import {Routes} from '../../../constants';
import Navigation from '../../../types/navigation';
import {timeoutError} from '../../../utils/errorCodes';
import {
  handleStorageResult,
  imageResizerAction,
  permissionCameraFlow,
  takePicture,
} from '../../../utils/PhotoRecognitionUtils';

interface InventoryProps {
  navigation: Navigation;
}

/**
 * All info about this screen you can found here https://cellarventures.atlassian.net/wiki/spaces/CA/pages/27459585/Camera+screen
 */

const PhotoRecognition: React.FC<InventoryProps> = ({navigation}) => {
  const [image, setImage] = useState({uri: ''});
  const camera = useRef();
  const [animation] = useState(new Animated.Value(1));
  const [isGivenCamera, setGivenCamera] = useState(false);
  const [, updateState] = useState();
  const forceUpdate = useCallback(() => updateState({}), []);
  const [isFailed, setIsFailed] = useState(false);
  const [visible, setVisible] = useState(true);

  const [uploadPhoto, {loading}] = useMutation(PHOTO_RECOGNITION_MUTATION, {
    onCompleted: data => {
      RNProgressHud.dismiss();
      console.log(data);
      if (data.photoRecognition.wineId === null) {
        setIsFailed(true);
      } else {
        setIsFailed(false);
        setTimeout(() => {
          navigation.navigate(Routes.wineDetails.name, {
            wineId: data.photoRecognition.wineId,
            rank: data.photoRecognition.rank,
          });
        }, 800);
      }
    },
    onError: error => {
      RNProgressHud.dismiss();
      setIsFailed(true);
      timeoutError(error);
    },
  });

  const uploadImageServer = useCallback(
    uri => {
      imageResizerAction(uri, uploadPhoto);
    },
    [uploadPhoto],
  );

  const requestCameraPermission = useCallback(() => {
    Platform.OS === 'ios'
      ? request(PERMISSIONS.IOS.CAMERA).then(result => {
          permissionCameraFlow(result, forceUpdate, setGivenCamera, permissionAlert);
        })
      : request(PERMISSIONS.ANDROID.CAMERA).then(result => {
          permissionCameraFlow(result, forceUpdate, setGivenCamera, permissionAlert);
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
        RNProgressHud.show();
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
            setImage(source);
            uploadImageServer(response.uri);
          }, 300);
        }
      });
    };

    Platform.OS === 'ios'
      ? showPicker()
      : request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE).then(result => {
          handleStorageResult(result, forceUpdate, showPicker, permissionAlert);
        });
  }, [forceUpdate, uploadImageServer]);

  useEffect(() => {
    requestCameraPermission();
  }, [requestCameraPermission]);

  return (
    <SafeAreaView style={{height: '100%'}}>
      <NavigationEvents
        onDidBlur={() => {
          setImage({uri: ''});
          setIsFailed(false);
          setVisible(false);
        }}
        onWillFocus={() => {
          setVisible(true);
          StatusBar.setBarStyle('dark-content');
        }}
      />
      <View style={header}>
        <TouchableOpacity
          style={touchableStyle}
          onPress={() => {
            navigation.openDrawer();
          }}>
          <Image source={Images.burgerIcon} style={burgerIcon} resizeMode={'stretch'} />
        </TouchableOpacity>
        <View style={topBarContent}>
          <Text style={{fontSize: 26}}>Camera</Text>
        </View>
      </View>
      <Animated.View style={[photoContainer, {opacity: animation}]}>
        {image.uri !== '' ? (
          <View style={photoContainer}>
            <View style={{height: '70%', width: '100%'}}>
              <Image resizeMode="contain" source={image} style={{height: '100%', width: '100%'}} />
            </View>

            {!loading && (
              <FailSuccessView
                onPress={() => {
                  navigation.navigate(Routes.inventoryAdditions.name, {
                    isStack: true,
                  });
                }}
                isFailed={isFailed}
              />
            )}
          </View>
        ) : (
          <RNCamera
            ref={camera}
            style={{height: '100%', width: '100%'}}
            type={RNCamera.Constants.Type.back}
            captureAudio={false}
            flashMode={'off'}
            androidCameraPermissionOptions={{
              title: 'Permission to use camera',
              message: 'We need your permission to use your camera',
              buttonPositive: 'Ok',
              buttonNegative: 'Cancel',
            }}
          />
        )}
      </Animated.View>
      {image.uri === '' ? (
        <View style={bottomContainer}>
          <TouchableOpacity
            onPress={() => {
              isGivenCamera ? takePicture(animation, camera, setImage, uploadImageServer) : requestCameraPermission();
            }}
            style={iconTouchable}>
            <Image source={Images.camera} style={{height: 50, width: 50}} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => requestStoragePermission()} style={iconTouchable}>
            <Image source={Images.gallery} style={{height: 50, width: 50}} />
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <View
            style={[
              bottomContainer,
              {
                justifyContent: 'center',
              },
            ]}>
            <TouchableOpacity
              onPress={() => {
                setImage({uri: ''});
              }}
              style={iconTouchable}>
              <Image source={Images.repeat} style={{height: 50, width: 50}} />
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

export const PhotoRecognitionScreen = PhotoRecognition;

export const permissionAlert = (title, onConfirm) => {
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
const stylesMain = StyleSheet.create({
  header: {
    height: 80,
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'white',
    shadowOffset: {width: 0, height: 3},
    zIndex: 5,
    shadowColor: 'black',
    shadowOpacity: 0.4,
  },
  burgerIcon: {
    width: 30,
    height: 20,
  },
  topBarContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 40,
    alignItems: 'center',
  },
  touchableStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    width: 60,
  },
  photoContainer: {
    flex: 15,
    height: '100%',
    width: '100%',
    alignItems: 'center',
  },
  bottomContainer: {
    width: '100%',
    height: '10%',
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'flex-end',
  },
  iconTouchable: {
    width: '50%',
    alignItems: 'center',
    height: '100%',
    justifyContent: 'center',
  },
});
const {header, burgerIcon, topBarContent, touchableStyle, photoContainer, bottomContainer, iconTouchable} = stylesMain;
