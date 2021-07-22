import React, {FC, useState, useRef, useCallback} from 'react';
import RNProgressHud from 'progress-hud';
import {
  View,
  Text,
  SafeAreaView,
  Keyboard,
  TouchableOpacity,
  ScrollView,
  Platform,
  Image,
  KeyboardAvoidingView,
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import {OutlinedTextField} from 'react-native-material-textfield-label-fixed';
import {request, PERMISSIONS} from 'react-native-permissions';
import {useMutation} from '@apollo/react-hooks';
import {ReactNativeFile} from 'apollo-upload-client';
import AntDesign from 'react-native-vector-icons/AntDesign';

import {HeaderWithChevron} from '../../components';
import {ButtonNew} from '../../new_components';
import Colors from '../../constants/colors';
import {handleStorageResult} from '../../utils/PhotoRecognitionUtils';
import {permissionAlert} from '../Main/PhotoRecognition';
import {FEEDBACK_INTRO, FEEDBACK_MOTIVATION} from '../../constants/text';
import {SEND_FEEDBACK} from '../../apollo/mutations/sendFeedback';

import textStyle from '../../constants/Styles/textStyle';
import {CloseIcon, CameraWhiteIcon} from '../../assets/svgIcons';
import {showAlert, parseFileName} from '../../utils/other.utils';
import styles from './style';

type Props = {};

const Feedback: FC<Props> = () => {
  const [feedback, setFeedBack] = useState('');
  const feedbackRef = useRef();
  const [image, setImage] = useState({uri: ''});
  const [, updateState] = useState();
  const forceUpdate = useCallback(() => updateState({}), []);

  const [sendFeedback, {loading}] = useMutation(SEND_FEEDBACK, {
    onCompleted: data => {
      setFeedBack('');
      setImage({uri: ''});
      if (feedbackRef) {
        (feedbackRef as any).current.setValue('');
      }
      showAlert('', data.sendEmailFeedbackToSupport);

      RNProgressHud.dismiss();
    },
    onError: err => {
      RNProgressHud.dismiss();
      console.log(err);
    },
  });

  const onPickImage = useCallback(() => {
    const showPicker = () => {
      const options = {
        quality: 0.5,
        storageOptions: {
          path: 'images',
          waitUntilSaved: false,
        },
      };

      ImagePicker.launchImageLibrary(options, response => {
        if (response.didCancel) {
          RNProgressHud.dismiss();
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
          RNProgressHud.dismiss();
        } else {
          const source = response;
          setTimeout(() => {
            setImage(source);
          }, 0);
        }
      });
    };

    Platform.OS === 'ios'
      ? showPicker()
      : request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE).then(result => {
          handleStorageResult(result, forceUpdate, showPicker, permissionAlert);
        });
  }, [forceUpdate]);

  const onCancelSelection = () => {
    showAlert('This action will unattach a selected image', '', () => setImage({uri: ''}));
  };

  const onSubmit = useCallback(() => {
    const file = new ReactNativeFile({
      uri: image.uri,
      name: parseFileName(image.uri),
      type: 'image/jpg',
    });
    sendFeedback({variables: {file: image.uri !== '' ? file : null, feedback: feedback}});
    RNProgressHud.show();
  }, [feedback, image, sendFeedback]);

  return (
    <KeyboardAvoidingView style={flex1} behavior="padding">
      <SafeAreaView style={saveContainer}>
        <HeaderWithChevron title="Feedback" />
        <ScrollView indicatorStyle="white">
          <View style={infoContainer}>
            <Text style={infoText}>{FEEDBACK_INTRO}</Text>
            <Text style={[infoText, {marginTop: 20}]}>{FEEDBACK_MOTIVATION}</Text>
          </View>
          <OutlinedTextField
            value={feedback}
            label={'Feedback'}
            onChangeText={(val: string) => setFeedBack(val)}
            onSubmitEditing={() => Keyboard.dismiss()}
            keyboardType={'default'}
            tintColor={'white'}
            returnKeyType={'done'}
            lineWidth={2}
            activeLineWidth={2}
            fontSize={21}
            autoCorrect={false}
            disabledLineWidth={2}
            baseColor={Colors.inputBorderGrey}
            containerStyle={containerInput}
            inputContainerStyle={inputStyle}
            autoFocus={false}
            style={[styleMultiline, {marginLeft: 24}]}
            labelOffset={{
              x0: 10,
              x1: -2.5,
              y0: -10,
            }}
            contentInset={{
              left: 0,
              input: 0,
              label: 10,
              bottom: 0,
            }}
            multiline={true}
            blurOnSubmit={false}
            labelTextStyle={[{...textStyle.mediumText}]}
            error={''}
            errorColor={Colors.inputError}
            backgroundLabelColor={'black'}
            ref={feedbackRef}
          />
          {image.uri === '' ? (
            <TouchableOpacity style={attachBtn} onPress={onPickImage}>
              <CameraWhiteIcon width={20} height={23} />
              <Text style={attachBtnText}>Attach image</Text>
            </TouchableOpacity>
          ) : (
            <View style={attachRow}>
              <View style={flex1}>
                <Text numberOfLines={1} ellipsizeMode="head" style={fileNameText}>
                  Attached photo
                </Text>
              </View>
              <View style={imgTouchable}>
                <Image source={image} style={imgThumb} />
              </View>
              <TouchableOpacity onPress={onCancelSelection} style={deleteBtn}>
                <AntDesign color="#fff" name="close" size={20} />
              </TouchableOpacity>
            </View>
          )}
          <View style={{paddingHorizontal: 20}}>
            <ButtonNew
              style={buttonStyle}
              text="Send"
              onPress={onSubmit}
              isDisabled={(!feedback && !image.uri) || loading}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const {
  infoText,
  infoContainer,
  styleMultiline,
  containerInput,
  inputStyle,
  buttonStyle,
  saveContainer,
  attachRow,
  imgTouchable,
  attachBtn,
  attachBtnText,
  deleteBtn,
  flex1,
  fileNameText,
  imgThumb,
} = styles;

export const FeedBackScreen = Feedback;
