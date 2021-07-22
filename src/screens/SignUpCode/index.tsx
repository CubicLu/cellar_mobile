import RNProgressHud from 'progress-hud';
import React, {useState, FC} from 'react';
import {View, TextInput, Alert} from 'react-native';
import {useApolloClient, useMutation, useQuery} from '@apollo/react-hooks';
import AsyncStorage from '@react-native-community/async-storage';

import {GET_SIGN_UP_DATA} from '../../apollo/queries/signUp';
import {setCodeData} from '../../apollo/updateCache/setCode';
import Colors from '../../constants/colors';
import Navigation from '../../types/navigation';
import ApolloClient from 'apollo-client';
import {CODE_VERIFICATION_MUTATION} from '../../apollo/mutations/verification';
import Photos from '../../assets/photos';
import {formatGQLError} from '../../utils/errorCodes';

import {HeaderWithAside, ConfirmationCodeInput} from '../../components';
import {ButtonNew} from '../../new_components';
import {loginCodeStyles, cellSize} from '../LoginCode';
import NotificationService from '../../service/NotificationService';

type Props = {
  navigation: Navigation;
};

const SignUpCode: FC<Props> = ({navigation}) => {
  const [disabled, setDisabled] = useState(true);
  const [code, setCode] = useState('');
  const client = useApolloClient();
  const {data: signUpData} = useQuery(GET_SIGN_UP_DATA);

  const [codeVerification, {loading}] = useMutation(CODE_VERIFICATION_MUTATION, {
    onCompleted: data => onCompletedVerification(data, client, navigation),
    onError: error => {
      Alert.alert('Error', formatGQLError(error.message));
    },
  });
  const sendCode = () => {
    RNProgressHud.show();
    setTimeout(() => {
      codeVerification({
        variables: {
          email: signUpData.signUp.email,
          verificationCode: code,
        },
      });
    }, 200);
  };
  return (
    <HeaderWithAside
      headerLeftContainerStyle={headerRightBg}
      headerTitleStyle={asideTitleContainer}
      asideSrc={Photos.bgAsideLoginScreen}
      text="Sign Up">
      {!loading && RNProgressHud.dismiss()}
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
        <ButtonNew text="Sign Up" style={button} isDisabled={disabled} disabledOpacity onPress={() => sendCode()} />
      </View>
    </HeaderWithAside>
  );
};

const onCompletedVerification = async (data: any, client: ApolloClient<object>, navigation: Navigation) => {
  if (data.codeVerification.accessToken) {
    setCodeData(client, data.codeVerification);
    navigation.navigate('ProfileAuth');
    await AsyncStorage.setItem('Code', JSON.stringify(data.codeVerification));
    await NotificationService.checkPermission();
  }
};

const {button, inputStyles, content, text, headerRightBg, asideTitleContainer} = loginCodeStyles;

export const SignUpCodeScreen = SignUpCode;
