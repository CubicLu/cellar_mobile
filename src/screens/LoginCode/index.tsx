import RNProgressHud from 'progress-hud';
import React, {useState, FC} from 'react';
import {StyleSheet, Alert, View, TextInput, Dimensions} from 'react-native';
import {useApolloClient, useLazyQuery, useMutation, useQuery} from '@apollo/react-hooks';
import AsyncStorage from '@react-native-community/async-storage';
import ApolloClient from 'apollo-client';
import {isNull} from 'lodash';

import {HeaderWithAside, ConfirmationCodeInput} from '../../components';
import {ButtonNew} from '../../new_components';

import textStyles from '../../constants/Styles/textStyle';
import Photos from '../../assets/photos';
import Colors from '../../constants/colors';
import Navigation from '../../types/navigation';

import {GET_SIGN_IN_DATA} from '../../apollo/queries/signIn';
import {CODE_VERIFICATION_MUTATION} from '../../apollo/mutations/verification';
import {setCodeData} from '../../apollo/updateCache/setCode';
import {Routes} from '../../constants';
import {formatGQLError} from '../../utils/errorCodes';
import {GET_PROFILE} from '../../apollo/queries/profile';
import NotificationService from '../../service/NotificationService';

type Props = {navigation: Navigation};

export const cellSize = Dimensions.get('screen').width < 375 ? 40 : 50;

const LoginCode: FC<Props> = ({navigation}) => {
  const [disabled, setDisabled] = useState(true);
  const [code, setCode] = useState('');
  const client = useApolloClient();
  const {data: signInData} = useQuery(GET_SIGN_IN_DATA);

  const [getProfile] = useLazyQuery(GET_PROFILE, {
    onCompleted: ({profile}) => {
      RNProgressHud.dismiss();

      if (isNull(profile.location.latitude)) {
        navigation.navigate(Routes.authProfile.name, {profile});
        return;
      }

      navigation.navigate(Routes.dashboard.name);
    },
    onError: () => {
      RNProgressHud.dismiss();
      navigation.navigate(Routes.dashboard.name);
    },
    fetchPolicy: 'no-cache',
  });

  const [codeVerification] = useMutation(CODE_VERIFICATION_MUTATION, {
    onCompleted: data => onCompletedVerification(data, client, navigation),
    onError: error => {
      RNProgressHud.dismiss();
      Alert.alert('Error', formatGQLError(error.message));
    },
  });

  const sendCode = () => {
    RNProgressHud.show();
    setTimeout(() => {
      codeVerification({
        variables: {
          email: signInData.signIn.email,
          verificationCode: code,
        },
      });
    }, 200);
  };

  const onCompletedVerification = async (data: any, client: ApolloClient<object>, navigation: Navigation) => {
    if (data.codeVerification.accessToken) {
      setCodeData(client, data.codeVerification);
      await AsyncStorage.setItem('LoginEmail', navigation.state.params.email);
      await AsyncStorage.setItem('Code', JSON.stringify(data.codeVerification));
      await AsyncStorage.setItem('requestAccessСonfirm', JSON.stringify(true));
      await NotificationService.checkPermission();
      await getProfile();
    }
  };

  return (
    <HeaderWithAside
      headerLeftContainerStyle={headerRightBg}
      asideSrc={Photos.bgAsideLoginScreen}
      headerTitleStyle={asideTitleContainer}
      text="Log In">
      <View style={content}>
        <TextInput
          editable={false}
          style={text}
          value="Open your email to get code to Login"
          multiline={true}
          numberOfLines={2}
        />
        <ConfirmationCodeInput
          codeLength={4}
          activeColor={Colors.inputBorderGrey}
          inactiveColor={Colors.inputBorderGrey}
          //@ts-ignore
          keyboardType="numeric"
          autoFocus={true}
          inputPosition="center"
          size={cellSize}
          onFulfill={() => null}
          containerStyle={{
            flex: 0,
            width: '100%',
          }}
          codeInputStyle={inputStyles}
          onCodeChange={code => {
            if (code.length === 4) {
              setDisabled(false);
              setCode(code);
            } else {
              setDisabled(true);
            }
          }}
        />
        <ButtonNew text="Log in" style={button} isDisabled={disabled} disabledOpacity onPress={() => sendCode()} />
      </View>
    </HeaderWithAside>
  );
};

export const loginCodeStyles = StyleSheet.create({
  content: {height: '100%', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'},
  button: {backgroundColor: '#0B2E33', marginTop: 31},
  inputStyles: {borderWidth: 1.5, color: '#fff', ...textStyles.boldText, fontSize: 30},
  text: {color: '#fff', ...textStyles.mediumText, fontSize: 16},
  headerRightBg: {backgroundColor: '#0B2E33'},
  asideTitleContainer: {paddingTop: 20},
});

const {button, inputStyles, content, text, headerRightBg, asideTitleContainer} = loginCodeStyles;

export const LoginCodeScreen = LoginCode;
