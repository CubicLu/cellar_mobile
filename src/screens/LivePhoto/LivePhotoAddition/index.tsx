import React, {FC, useEffect, useState} from 'react';
import {View, Text, StyleSheet, SafeAreaView, Image, TouchableOpacity, Keyboard} from 'react-native';
import RNProgressHud from 'progress-hud';
import {Input} from 'react-native-elements';
import {NavigationScreenProp} from 'react-navigation';
import InputScrollView from 'react-native-input-scroll-view';
import {useMutation} from '@apollo/react-hooks';

import {HeaderWithChevron} from '../../../components';
import {Routes} from '../../../constants';
import {CameraWhiteIcon} from '../../../assets/svgIcons';
import colors from '../../../constants/colors';
import textStyle from '../../../constants/Styles/textStyle';
import {ButtonNew} from '../../../new_components';
import {CREATE_STREAM_POST, UPDATE_STREAM_POST} from '../../../apollo/mutations/photoStream';
import {imageResizeAction} from '../../../utils/ProfileUtils/profilePhoto';
import {flagToUpdateScreen} from '../../../utils/other.utils';

type Props = {
  navigation: NavigationScreenProp<any>;
};

const onComplete = async (navigation: NavigationScreenProp<any>) => {
  await flagToUpdateScreen('Live-photos');
  RNProgressHud.dismiss();
  navigation.goBack();
};
const onError = error => {
  RNProgressHud.dismiss();
  console.log(error.message);
};

export const LivePhotoAddition: FC<Props> = ({navigation}) => {
  const [imageUrl, setImageUrl] = useState({uri: ''});
  const [message, setMessage] = useState('');
  const updatePayload = navigation.getParam('payload');

  const [publishPost] = useMutation(CREATE_STREAM_POST, {
    onCompleted: () => onComplete(navigation),
    onError: onError,
  });

  const [updatePost] = useMutation(UPDATE_STREAM_POST, {
    onCompleted: () => onComplete(navigation),
    onError: onError,
  });

  useEffect(() => {
    if (updatePayload) {
      setImageUrl({uri: updatePayload.imageUrl});
      setMessage(updatePayload.text);
    }
  }, [updatePayload]);

  async function onPublishPost(filePath) {
    const file = await imageResizeAction(filePath, 600, 500, 100);
    RNProgressHud.show();

    await publishPost({
      variables: {
        file: file,
        description: message.replace(/(\r\n|\n|\r)/gm, ' '),
      },
    });
  }

  async function onUpdatePost(id: number, description: string) {
    RNProgressHud.show();

    await updatePost({
      variables: {
        id,
        description: description.replace(/(\r\n|\n|\r)/gm, ' '),
      },
    });
  }

  return (
    <View style={container}>
      <SafeAreaView style={flex1}>
        <HeaderWithChevron title="Add Photo" />
        <InputScrollView contentContainerStyle={scrollContainer} indicatorStyle="white">
          <TouchableOpacity
            disabled={!!updatePayload}
            onPress={() => {
              RNProgressHud.show();
              setTimeout(() => {
                RNProgressHud.dismiss();
                navigation.navigate(Routes.camera.name, {
                  onSelect: val => setImageUrl(val),
                });
              }, 500);
            }}
            style={[imageContainer, imageUrl.uri === '' ? borderW2 : borderW0]}>
            {imageUrl.uri === '' ? (
              <View style={cameraIconContainer}>
                <CameraWhiteIcon height={40} width={35} />
              </View>
            ) : (
              <Image source={imageUrl} style={[image, fill100]} resizeMode={'contain'} />
            )}
          </TouchableOpacity>
          <Input
            value={message}
            onEndEditing={() => Keyboard.dismiss()}
            containerStyle={containerStyle}
            onChangeText={setMessage}
            inputContainerStyle={inputContainerStyle}
            multiline
            maxLength={280}
            inputStyle={inputStyle}
            placeholderTextColor="#666666"
            placeholder="Write a caption"
            scrollEnabled={false}
          />

          <View style={letterLimitContainer}>
            <Text style={[message.length < 280 ? colorWhite : colorRed]}>{message.length}/280</Text>
          </View>

          <ButtonNew
            text={updatePayload ? 'SAVE' : 'PUBLISH'}
            isDisabled={imageUrl.uri === ''}
            disabledOpacity
            style={buttonContainer}
            onPress={() => (updatePayload ? onUpdatePost(updatePayload.postID, message) : onPublishPost(imageUrl.uri))}
          />
        </InputScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#000'},
  imageContainer: {
    alignSelf: 'center',
    marginTop: 48,
    maxHeight: 300,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    borderColor: '#666666',
  },
  image: {
    height: '100%',
    alignSelf: 'center',
  },
  inputStyle: {color: '#fff', ...textStyle.mediumText, lineHeight: 28, minHeight: 100, height: '100%'},
  containerStyle: {paddingHorizontal: 0},
  inputContainerStyle: {
    borderWidth: 2,
    borderColor: '#666666',
    paddingHorizontal: 10,
    marginHorizontal: 0,
    marginTop: 10,
  },
  flex1: {flex: 1},
  scrollContainer: {paddingHorizontal: 20, flexGrow: 1, paddingBottom: 80},
  letterLimitContainer: {alignItems: 'flex-end', paddingTop: 5},
  buttonContainer: {backgroundColor: colors.orangeDashboard, marginTop: 20},
  colorRed: {color: 'red'},
  colorWhite: {color: '#fff'},
  fill100: {width: '100%', height: '100%'},
  borderW0: {borderWidth: 0},
  borderW2: {borderWidth: 2},
  cameraIconContainer: {height: 200, justifyContent: 'center', alignItems: 'center'},
});

const {
  imageContainer,
  image,
  containerStyle,
  inputContainerStyle,
  inputStyle,
  flex1,
  container,
  scrollContainer,
  letterLimitContainer,
  buttonContainer,
  colorRed,
  colorWhite,
  fill100,
  borderW0,
  borderW2,
  cameraIconContainer,
} = styles;
