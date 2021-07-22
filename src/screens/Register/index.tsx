import ApolloClient from 'apollo-client';
import RNProgressHud from 'progress-hud';
import React, {useState, FC, useRef} from 'react';
import {Text, View, StyleSheet, StatusBar, TextInput, TouchableOpacity, Alert} from 'react-native';
import {useMutation, useApolloClient} from '@apollo/react-hooks';
import AsyncStorage from '@react-native-community/async-storage';
import {NavigationEvents} from 'react-navigation';
import Config from 'react-native-config';

import {HeaderWithAside} from '../../components';
import {InputNew} from '../../new_components';
import {onCompleteLogin, signInAction, loginScreenStyles} from '../Login';

import {formatGQLError, requiredEmailValidation} from '../../utils/errorCodes';
import {emailValidation} from '../../utils/errorCodes';
import Navigation from '../../types/navigation';
import Colors from '../../constants/colors';
import Photos from '../../assets/photos';
import {Routes} from '../../constants';
import {setSignUpData} from '../../apollo/updateCache/signUp';
import {SIGN_UP_MUTATION} from '../../apollo/mutations/signUp';
import {SIGN_IN_MUTATION} from '../../apollo/mutations/signIn';

interface RegisterProps {
  navigation: Navigation;
}

const Register: FC<RegisterProps> = ({navigation}) => {
  const [errorText, setError] = useState('');
  const [email, setEmail] = useState('');
  const client = useApolloClient();
  const inputRef = useRef();
  const [signUp, {loading: signUpLoading}] = useMutation(SIGN_UP_MUTATION, {
    onCompleted: data => onCompleteSignUp(data, client, email, navigation),
    onError: error => {
      if (error.graphQLErrors.length < 1) {
        Alert.alert('Error', error.message);
      } else {
        setError(error.graphQLErrors[0].message);
        //@ts-ignore
        if (error.graphQLErrors[0].statusCode === 409) {
          signInAlert(() => signInAction(signIn, email, setError));
        }
      }
    },
  });
  const [signIn, {loading: signInLoading}] = useMutation(SIGN_IN_MUTATION, {
    onCompleted: data => onCompleteLogin(data, client, email, navigation),
    onError: error => Alert.alert('Error', formatGQLError(error.message)),
  });
  const onChangeEmail = (val: string) => {
    setError('');
    setEmail(val);
  };

  return (
    <HeaderWithAside
      text="Sign Up"
      asideSrc={Photos.bgAsideLoginScreen}
      headerLeftContainerStyle={backArrowContainer}
      headerTitleStyle={asideTitle}
      headerTitleTextStyle={{fontSize: 33}}
      renderHeaderRightButton={() => (
        <TouchableOpacity style={nextBtnContainer} onPress={() => signUpAction(signUp, email, setError)}>
          <Text style={nextBtnText}>Next</Text>
        </TouchableOpacity>
      )}>
      <StatusBar backgroundColor={'white'} barStyle="light-content" />
      <NavigationEvents
        onWillFocus={() => {
          (inputRef as any).current.focus();
        }}
      />

      {!signUpLoading && !signInLoading && RNProgressHud.dismiss()}

      <View style={contantContainer}>
        <InputNew
          placeHolder={'Enter your email'}
          value={email}
          onChange={onChangeEmail}
          onSubmitEditing={() => signUpAction(signUp, email, setError)}
          keyboardType={'email-address'}
          returnKeyType={'go'}
          x1={2}
          requiredColorValidation={Colors.inputBorderGrey}
          error={requiredEmailValidation(email) || (errorText !== '' && errorText)}
          autoCapitalize="none"
          getRef={inputRef}
        />
        <TextInput
          editable={false}
          value="We`ll send you a quick email to confirm your address"
          multiline
          style={tipText}
        />
        <View style={relativeContainer}>
          <TouchableOpacity
            style={overlappingTouchable}
            onPress={() => {
              navigation.navigate(Routes.agreementScreen.name, {
                link: `${Config.API_PUBLIC}/customerAgreement.html`,
              });
            }}
          />
          <TextInput
            editable={false}
            value="By clicking here, you agree to our"
            multiline
            style={[tipText, agreementText]}
          />
          <TextInput
            editable={false}
            value="Customer Agreement"
            multiline
            style={[tipText, agreementText, {textDecorationLine: 'underline'}]}
          />
        </View>
        <View />
      </View>
    </HeaderWithAside>
  );
};

const signUpAction = (signUp: any, email: string, setError: any) => {
  if (email) {
    RNProgressHud.show();
    setTimeout(() => {
      if (emailValidation(email)) {
        setError('Email is not valid');
        RNProgressHud.dismiss();
      } else {
        try {
          signUp({variables: {email}});
        } catch (e) {
          console.log(e, 'сработал кетч');
        }
      }
    }, 500);
  }
};

const onCompleteSignUp = (data: any, client: ApolloClient<object>, email: string, navigation: Navigation) => {
  if (data.signUp) {
    setSignUpData(client, data.signUp, email);
    navigation.navigate(Routes.signUpCode.name);
    AsyncStorage.setItem('LoginEmail', email);
  }
};

const signInAlert = (onPress: () => void) => {
  Alert.alert(
    'Attention',
    'This email is already assigned to another account. Do you want to login with this email?',
    [
      {
        text: 'Cancel',
        onPress: () => {},
        style: 'cancel',
      },
      {text: 'OK', onPress: onPress},
    ],
    {cancelable: false},
  );
};

const styles = StyleSheet.create({
  agreementText: {color: '#E6750E', fontSize: 16, lineHeight: 21},
  overlappingTouchable: {...StyleSheet.absoluteFillObject, backgroundColor: 'transparent', zIndex: 1},
  relativeContainer: {position: 'relative', alignItems: 'center', flex: 0},
});
const {nextBtnContainer, nextBtnText, backArrowContainer, tipText, contantContainer, asideTitle} = loginScreenStyles;
const {agreementText, overlappingTouchable, relativeContainer} = styles;
export const RegisterScreen = Register;
