import React, {useEffect, useRef, useState} from 'react';
import {NavigationEvents, NavigationScreenProp} from 'react-navigation';
import RNProgressHud from 'progress-hud';
import {useLazyQuery} from '@apollo/react-hooks';
import {
  StyleSheet,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  View,
  Animated,
  StatusBar,
  Dimensions,
  Alert,
} from 'react-native';
import {RNCamera} from 'react-native-camera';

import Images from '../../../assets/images';

import {HeaderWithChevron, CameraControllers, PreviewControllers, WinePicker} from '../../../components';
import {useCamera} from '../../../hooks/useCamera';
import {RECOGNIZE_PHOTO} from '../../../apollo/queries/photoRecognition';
import {imageResizeAction} from '../../../utils/ProfileUtils/profilePhoto';
import CONFIG from '../../../constants/config';

const {width} = Dimensions.get('window');
interface CameraProps {
  navigation: NavigationScreenProp<any>;
}

const PhotoRecognition: React.FC<CameraProps> = ({navigation}) => {
  const camera = useRef();
  const [animation] = useState(new Animated.Value(1));
  const [modalVisible, setModalVisible] = useState(false);
  const [recognizedWine, setRecognizedWine] = useState(null);

  const {
    photoUrl,
    setPhotoUrl,
    hint,
    takePicture,
    setHint,
    requestCameraPermission,
    isCameraAllowed,
    requestStoragePermission,
  } = useCamera();

  const [recognizePhoto, {data: recognizeData}] = useLazyQuery(RECOGNIZE_PHOTO, {
    fetchPolicy: 'no-cache',
    onCompleted: data => {
      setRecognizedWine(null);

      if (data.vuforia__recognizePicture.count) {
        setModalVisible(true);
      }
      RNProgressHud.dismiss();
      console.log('on complete', data);
    },
    onError: error => {
      RNProgressHud.dismiss();
      console.log('onError', error);
    },
  });

  const onTakePhoto = () => {
    if (isCameraAllowed) {
      RNProgressHud.show();

      takePicture(camera, setPhotoUrl, animation, setHint);
      return;
    }

    requestCameraPermission();
  };

  useEffect(() => {
    setPhotoUrl({uri: ''});
  }, []);

  const tryToRecognize = async filePath => {
    const file = await imageResizeAction(filePath, 1000, 1000);

    recognizePhoto({
      variables: {
        file: file,
      },
    });
  };

  useEffect(() => {
    if (photoUrl.uri) {
      tryToRecognize(photoUrl.uri);
    }
  }, [photoUrl]);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#041B1E'}}>
      <WinePicker
        list={recognizeData && recognizeData.vuforia__recognizePicture.targets}
        onSuccess={fields => {
          setRecognizedWine(prevState => {
            return {...prevState, ...fields};
          });
          setModalVisible(false);
        }}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />

      <NavigationEvents
        onDidBlur={() => {
          setPhotoUrl({uri: ''});
        }}
        onWillFocus={() => {
          StatusBar.setBarStyle('light-content');
        }}
      />
      <HeaderWithChevron title="Add image" />

      <Animated.View style={[flex1, {opacity: animation}]}>
        {photoUrl.uri !== '' ? (
          <View style={[photoContainer, {paddingHorizontal: 25}]}>
            <Image resizeMode="contain" source={photoUrl} style={fill100} />
          </View>
        ) : (
          <RNCamera
            ref={camera}
            style={fill100}
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
            <View style={flex1}>
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
      {photoUrl.uri === '' ? (
        <View style={bottomContainer}>
          <CameraControllers onTakePhoto={onTakePhoto} onChoseGallery={() => requestStoragePermission()} />
        </View>
      ) : (
        <PreviewControllers
          onAccept={() => {
            navigation.state.params.onSelect({imageURI: photoUrl, ...recognizedWine});
            navigation.goBack();
          }}
          onDecline={() => {
            setPhotoUrl({uri: ''});
            setRecognizedWine(null);
          }}
        />
      )}
    </SafeAreaView>
  );
};

export const PhotoRecognitionScreen = PhotoRecognition;

const stylesMain = StyleSheet.create({
  fill100: {height: '100%', width: '100%'},
  flex1: {flex: 1},
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
  fill100,
  flex1,
} = stylesMain;

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
