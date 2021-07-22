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
  Platform,
  StatusBar,
  Dimensions,
} from 'react-native';
import {request, PERMISSIONS} from 'react-native-permissions';
import {RNCamera} from 'react-native-camera';
import ImagePicker from 'react-native-image-picker';

import Images from '../../assets/images';
import Navigation from '../../types/navigation';
import {fadeAnimation, handleStorageResult, permissionCameraFlow} from '../../utils/PhotoRecognitionUtils';
import {permissionAlert} from '../Main/PhotoRecognition';
import {HeaderWithChevron, CameraControllers, PreviewControllers} from '../../components';

const {width} = Dimensions.get('window');
interface CameraProps {
  navigation: Navigation;
}

/**
 * Screen for taking photo and set in Add wine or Edit wine
 * All info about this screen you can found here https://cellarventures.atlassian.net/wiki/spaces/CA/pages/27459585/Camera+screen
 */
const Camera: React.FC<CameraProps> = ({navigation}) => {
  const [image, setImage] = useState({uri: ''});
  const camera = useRef();
  const [animation] = useState(new Animated.Value(1));
  const [isGivenCamera, setGivenCamera] = useState(false);
  const [, updateState] = useState();
  const forceUpdate = useCallback(() => updateState({}), []);
  const [hint, setHint] = useState(false);

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
            setImage(source);
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
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#041B1E'}}>
      <NavigationEvents
        onDidBlur={() => {
          setImage({uri: ''});
        }}
        onWillFocus={() => {
          StatusBar.setBarStyle('light-content');
        }}
      />
      <HeaderWithChevron title="Add image" />
      <Animated.View style={[{flex: 1}, {opacity: animation}]}>
        {image.uri !== '' ? (
          <View style={[photoContainer, {paddingHorizontal: 25}]}>
            <Image resizeMode="contain" source={image} style={{height: '100%', width: '100%'}} />
          </View>
        ) : (
          <RNCamera
            ref={camera}
            style={{height: '100%', width: '100%'}}
            type={RNCamera.Constants.Type.back}
            onMountError={error => {
              console.log('on mount error!', error);
            }}
            captureAudio={false}
            flashMode={'off'}
            androidCameraPermissionOptions={{
              title: 'Permission to use camera',
              message: 'We need your permission to use your camera',
              buttonPositive: 'Ok',
              buttonNegative: 'Cancel',
            }}>
            <View style={{flex: 1}}>
              <Image source={Images.frame} style={photoImg} resizeMode={'stretch'} />
              <View style={frameContainer}>
                <TouchableOpacity onPress={() => setHint(true)} disabled={hint} style={{opacity: hint ? 0.5 : 1}}>
                  <Image source={Images.help} style={hintImg} />
                </TouchableOpacity>

                {hint && (
                  <TouchableOpacity onPress={() => setHint(false)} style={hintHideContainer}>
                    <Text>OK</Text>
                  </TouchableOpacity>
                )}
                <View style={{height: 50, width: 30}} />
              </View>
            </View>
          </RNCamera>
        )}

        {hint && (
          <View pointerEvents="box-none" style={hintContainer}>
            <Text style={hintText}>Position the wine bottle within this frame</Text>
          </View>
        )}
      </Animated.View>
      {image.uri === '' ? (
        <View style={bottomContainer}>
          <CameraControllers
            onTakePhoto={() =>
              isGivenCamera ? takePicture(camera, setImage, animation, setHint) : requestCameraPermission()
            }
            onChoseGallery={() => requestStoragePermission()}
          />
        </View>
      ) : (
        <PreviewControllers
          onAccept={() => {
            navigation.state.params.onSelect(image);
            navigation.goBack();
          }}
          onDecline={() => {
            setImage({uri: ''});
          }}
        />
      )}
    </SafeAreaView>
  );
};

export const CameraScreen = Camera;

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

const stylesMain = StyleSheet.create({
  photoContainer: {
    alignItems: 'center',
    paddingTop: 23,
  },
  bottomContainer: {
    width: '100%',
    minHeight: '10%',
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'flex-end',
  },
  frameContainer: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: '12%',
    height: 50,
    width: width - 80,
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  hintHideContainer: {
    height: 30,
    width: 60,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hintContainer: {
    position: 'absolute',
    alignSelf: 'center',
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  hintText: {
    color: 'white',
    fontSize: 24,
    textAlign: 'center',
    width: '70%',
  },
  hintImg: {height: 30, width: 30},
  photoImg: {height: '100%', width: '100%'},
});
const {
  photoContainer,
  bottomContainer,
  frameContainer,
  hintHideContainer,
  hintContainer,
  hintText,
  photoImg,
  hintImg,
} = stylesMain;
