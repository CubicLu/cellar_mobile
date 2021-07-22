import React, {FC, useRef, useState} from 'react';
import {View, StatusBar, StyleSheet, ImageBackground, SafeAreaView, Text, Alert, TextInput} from 'react-native';
import {useAsyncStorage} from '@react-native-community/async-storage';
import RNProgressHud from 'progress-hud';
import InputScrollView from 'react-native-input-scroll-view';
import SplashScreen from 'react-native-splash-screen';

import Photos from '../../assets/photos';
import Navigation from '../../types/navigation';
import {emailRegex, requiredEmailValidation} from '../../utils/errorCodes';
import {CellrLogoIcon} from '../../assets/svgIcons';
import {useApolloClient} from '@apollo/react-hooks';
import {useLazyQuery, useMutation} from 'react-apollo';
import {NavigationEvents} from 'react-navigation';

import {ButtonNew} from '../../new_components';
import colors from '../../constants/colors';
import {REQUEST_ACCESS, SIGN_IN_MUTATION} from '../../apollo/mutations/signIn';
import {Routes} from '../../constants';
import textStyle from '../../constants/Styles/textStyle';
import {setSignInData} from '../../apollo/updateCache/signIn';
import {CHECK_EMAIL_VERIFICATION} from '../../apollo/client/queries/other';
import {INIT_INV_FILTERS, SET_LOCAL_SUB_FILTERS} from '../../apollo/client/mutations';

type Props = {
  navigation: Navigation;
};

const InviteRequest: FC<Props> = ({navigation}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [lastRequestedEmail, setLastRequestedEmail] = useState(null);
  const {getItem, setItem} = useAsyncStorage('LoginEmail');
  const {getItem: getLastRequest, setItem: setLastRequest} = useAsyncStorage('requestedEmail');

  const [initInventoryFilters] = useMutation(INIT_INV_FILTERS);
  const [setInventorySubFilters] = useMutation(SET_LOCAL_SUB_FILTERS);

  const [signIn] = useMutation(SIGN_IN_MUTATION, {
    variables: {
      email: email || lastRequestedEmail,
    },
    onCompleted: async data => {
      setSignInData(client, data, email || lastRequestedEmail);

      navigation.navigate(Routes.loginCode.name, {email: email || lastRequestedEmail});
    },
  });

  const [requestAccess] = useMutation(REQUEST_ACCESS, {
    onCompleted: data => {
      RNProgressHud.dismiss();
      setLastRequest(email);
      Alert.alert('', data.requestAccess, [
        {
          text: 'OK',
        },
      ]);
    },
    onError: error => {
      RNProgressHud.dismiss();
      const conflict = 'Your prior request has been received and will be processed in the 24hr window';

      if (error.message.includes(conflict)) {
        Alert.alert('Error', conflict);
        return;
      } else {
        Alert.alert('Error', error.message);
      }
    },
  });

  const [checkVerificationStatus] = useLazyQuery(CHECK_EMAIL_VERIFICATION, {
    variables: {
      email: lastRequestedEmail,
    },
    onCompleted: async response => {
      console.log(response, 'response');

      if (response.emailIsVerified.verifiedStatus === 'VERIFIED') {
        RNProgressHud.dismiss();
        Alert.alert('', 'Your email is already verified. Do you want to login with this email?', [
          {
            text: 'Yes',
            onPress: () => signIn(),
          },
          {
            text: 'No',
            onPress: () => {},
          },
        ]);
        return;
      }
      if (response.emailIsVerified.verifiedStatus === 'NOT_REGISTERED') {
        RNProgressHud.dismiss();
        console.log('not registed');
        await requestAccess({variables: {email, fullName: name}});
        return;
      }

      if (response.emailIsVerified.isVerified) {
        RNProgressHud.dismiss();
        await setItem(lastRequestedEmail || email);
        navigation.navigate(Routes.launch.name);
        return;
      }

      RNProgressHud.dismiss();
    },
    onError: error => {
      Alert.alert('Error', error.message);
      RNProgressHud.dismiss();
    },
    pollInterval: 30000,
    fetchPolicy: 'no-cache',
  });

  async function loadEmailFromCache() {
    try {
      const [prevEmail, reviewEmail] = await Promise.all([getItem(), getLastRequest()]);

      if (prevEmail) {
        navigation.navigate(Routes.launch.name);
        return;
      }

      if (reviewEmail) {
        SplashScreen.hide();
        RNProgressHud.show();
        setLastRequestedEmail(reviewEmail);
        checkVerificationStatus();
        return;
      }
      SplashScreen.hide();
      RNProgressHud.dismiss();
    } catch (e) {
      console.log(e, 'Error while loadEmailFromCache()');
    }
  }

  const client = useApolloClient();

  const emailRef = useRef();

  const onRequestAccess = () => {
    if (requiredEmailValidation(email) === '' && email.length > 0) {
      RNProgressHud.show();
      checkVerificationStatus({
        variables: {
          email,
        },
      });
    }
  };

  return (
    <View style={container}>
      <ImageBackground style={[flex1, StyleSheet.absoluteFillObject]} source={Photos.splash} resizeMode="cover" />
      <NavigationEvents
        onWillBlur={async () => {
          await initInventoryFilters();
          await setInventorySubFilters();
        }}
        onWillFocus={async () => {
          await loadEmailFromCache();
          StatusBar.setBarStyle('light-content');
        }}
      />
      <SafeAreaView style={safeAreaStyle}>
        <View style={iconContainer}>
          <CellrLogoIcon width={161} height={33} />
        </View>
        <InputScrollView topOffset={150} keyboardDismissMode="on-drag" style={contentContainer}>
          <View style={scrollContainer}>
            <View style={descriptionContainer}>
              <Text adjustsFontSizeToFit numberOfLines={1} allowFontScaling={false} style={header}>
                Request for Invite
              </Text>
              <Text style={description} maxFontSizeMultiplier={1.1}>
                CELLR is currently operating across 14 countries on an invite only basic, represents holdings across
                some of the most prominent wine producer names and vintages, & we are dedicated to building a quality
                community
              </Text>
            </View>
            <View style={formContainer}>
              <View style={[inputContainerStyle, bottomGap]}>
                <TextInput
                  placeholder={'Full Name'}
                  placeholderTextColor={'grey'}
                  keyboardType={'default'}
                  returnKeyType={'next'}
                  selectionColor={'white'}
                  editable
                  style={inputStyle}
                  onChangeText={e => setName(e)}
                  onSubmitEditing={() => emailRef.current && (emailRef.current as any).focus()}
                  value={name}
                />
              </View>
              <View style={flex1}>
                <View style={inputContainerStyle}>
                  <TextInput
                    ref={emailRef}
                    placeholder={'Email'}
                    placeholderTextColor={'grey'}
                    keyboardType={'email-address'}
                    returnKeyType={'send'}
                    selectionColor={'white'}
                    autoCapitalize={'none'}
                    autoCorrect={false}
                    editable
                    style={[inputStyle, requiredEmailValidation(email) && errorBorder]}
                    onChangeText={e => setEmail(e)}
                    onSubmitEditing={onRequestAccess}
                    value={email}
                  />
                </View>

                <View style={errorWrapper}>
                  {!!requiredEmailValidation(email) && (
                    <View style={errorContainer}>
                      <Text style={errorMessage}>{requiredEmailValidation(email)}</Text>
                    </View>
                  )}
                </View>
                <ButtonNew
                  disabledOpacity
                  text="SUBMIT"
                  isDisabled={!(name.length < 1) && !emailRegex.test(email)}
                  style={[buttonStyle, bottomMargin]}
                  onPress={onRequestAccess}
                />
                <View />
              </View>
            </View>
          </View>
        </InputScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {backgroundColor: 'rgba(255,0,0,0.05)', flex: 1},
  contentContainer: {paddingHorizontal: 30, flexGrow: 1},
  buttonStyle: {
    backgroundColor: colors.orangeDashboard,
    height: 50,
    minWidth: 300,
    width: '100%',
    marginTop: 21,
  },
  customField: {
    marginBottom: 21,
  },
  bottomMargin: {
    marginBottom: 21,
  },
  inputContainerStyle: {
    backgroundColor: 'rgba(14, 14, 14, 0.7)',
  },
  inputStyle: {
    borderColor: '#fff',
    borderWidth: 2,
    borderStyle: 'solid',
    height: 50,
    fontSize: 21,
    color: 'white',
    ...textStyle.mediumText,
    paddingLeft: 20,
  },
  errorBorder: {
    borderColor: colors.inputError,
    borderWidth: 2,
    borderStyle: 'solid',
  },
  errorWrapper: {minHeight: 50},
  errorContainer: {
    backgroundColor: colors.inputError,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  errorMessage: {
    fontSize: 14,
    textAlign: 'left',
    color: 'white',
    ...textStyle.mediumText,
  },
  header: {
    color: '#fff',
    fontSize: 40,
    marginBottom: 13,
    ...textStyle.mediumText,
    letterSpacing: 0.8,
  },
  description: {
    color: '#FFF',
    fontSize: 16,
    ...textStyle.mediumText,
    lineHeight: 16,
  },
  descriptionContainer: {flex: 0.9, justifyContent: 'center'},
  safeAreaStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  formContainer: {justifyContent: 'center', flexGrow: 1},
  flex1: {flex: 1},
  bottomGap: {marginBottom: 20},
  iconContainer: {marginTop: 50},
  scrollContainer: {minHeight: 650, justifyContent: 'space-around'},
});

const {
  container,
  inputContainerStyle,
  contentContainer,
  description,
  header,
  buttonStyle,
  bottomMargin,
  inputStyle,
  errorMessage,
  errorContainer,
  safeAreaStyle,
  errorBorder,
  descriptionContainer,
  flex1,
  formContainer,
  bottomGap,
  errorWrapper,
  iconContainer,
  scrollContainer,
} = styles;

export const InviteRequestScreen = InviteRequest;
