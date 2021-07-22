import RNProgressHud from 'progress-hud';
import React, {useState, useRef, useEffect, FC} from 'react';
import {View, StyleSheet, StatusBar, Text, TouchableOpacity, TextInput, Alert} from 'react-native';
import {useApolloClient, useMutation} from '@apollo/react-hooks';
import ApolloClient from 'apollo-client';
import {NavigationEvents} from 'react-navigation';
import AsyncStorage from '@react-native-community/async-storage';

import {HeaderWithAside} from '../../components';
import {InputNew} from '../../new_components';

import textStyles from '../../constants/Styles/textStyle';
import Photos from '../../assets/photos';
import Colors from '../../constants/colors';
import {setSignInData} from '../../apollo/updateCache/signIn';
import {Routes} from '../../constants';
import Navigation from '../../types/navigation';
import {emailValidation} from '../../utils/errorCodes';
import {SIGN_IN_MUTATION} from '../../apollo/mutations/signIn';
import {requiredEmailValidation} from '../../utils/errorCodes';

type Props = {
  navigation: Navigation;
};

const Login: FC<Props> = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [errorText, setError] = useState('');
  const inputRef = useRef(null);
  const client = useApolloClient();
  const [signIn, {loading}] = useMutation(SIGN_IN_MUTATION, {
    onCompleted: data => onCompleteLogin(data, client, email, navigation),
    onError: error => {
      if (error.graphQLErrors.length > 0) {
        setError(error.graphQLErrors[0].message);
      } else {
        Alert.alert('Error', error.message);
      }
    },
  });
  const onChangeEmail = (val: string) => {
    setEmail(val);
    setError('');
  };

  useEffect(() => {
    AsyncStorage.getItem('LoginEmail').then(res => {
      if (res) {
        inputRef.current.setValue(res);
        setEmail(res);
      }
    });
  }, []);
  return (
    <HeaderWithAside
      text="Log In"
      asideSrc={Photos.bgAsideLoginScreen}
      headerLeftContainerStyle={backArrowContainer}
      headerTitleStyle={asideTitle}
      renderHeaderRightButton={() => (
        <TouchableOpacity style={nextBtnContainer} onPress={() => signInAction(signIn, email, setError)}>
          <Text style={nextBtnText}>Next</Text>
        </TouchableOpacity>
      )}>
      <StatusBar backgroundColor={'white'} barStyle="light-content" />
      <NavigationEvents
        onWillFocus={() => {
          inputRef.current.focus();
        }}
      />
      {!loading && RNProgressHud.dismiss()}
      <View style={contantContainer}>
        <InputNew
          placeHolder={'Enter your email'}
          value={email}
          onChange={onChangeEmail}
          onSubmitEditing={() => signInAction(signIn, email, setError)}
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
        <View />
      </View>
    </HeaderWithAside>
  );
};

export const signInAction = (signIn: any, email: string, setError: any) => {
  if (email) {
    RNProgressHud.show();
    setTimeout(() => {
      if (emailValidation(email)) {
        setError('Email is not valid');
        RNProgressHud.dismiss();
      } else {
        signIn({variables: {email}});
      }
    }, 500);
  }
};

export const onCompleteLogin = async (
  data: any,
  client: ApolloClient<object>,
  email: string,
  navigation: Navigation,
) => {
  if (data.signIn) {
    setSignInData(client, data.signIn, email);
    AsyncStorage.setItem('requestAccessСonfirm', JSON.stringify(true));
    navigation.navigate(Routes.loginCode.name, {email});
  }
};

export const loginScreenStyles = StyleSheet.create({
  nextBtnContainer: {
    paddingHorizontal: 12,
    paddingVertical: 21,
    backgroundColor: '#0B2E33',
  },
  nextBtnText: {
    fontSize: 25,
    lineHeight: 33,
    color: '#fff',
    ...textStyles.mediumText,
  },
  backArrowContainer: {
    backgroundColor: '#0B2E33',
  },
  tipText: {
    marginTop: 5,
    color: '#fff',
    ...textStyles.mediumText,
  },
  contantContainer: {
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  asideTitle: {paddingTop: 20},
});

const {nextBtnContainer, nextBtnText, backArrowContainer, tipText, contantContainer, asideTitle} = loginScreenStyles;

export const LoginScreen = Login;
