import React, {useEffect, useRef, useState, FC} from 'react';
import {Text, View, StyleSheet, Alert, Keyboard} from 'react-native';
import {useApolloClient, useMutation} from '@apollo/react-hooks';
import AsyncStorage from '@react-native-community/async-storage';
import RNProgressHud from 'progress-hud';
import {NavigationScreenProp} from 'react-navigation';

import {onPressImportLocal, onImportCellarProduction} from '../../utils/cellarSync';
import {CELLAR_TRACKER_SYNC_MUTATION} from '../../apollo/mutations/cellarSync';
import {flagsToUpdateAll} from '../../utils/inventory.utils';
import textStyle from '../../constants/Styles/textStyle';
import {timeoutError} from '../../utils/errorCodes';
import Colors from '../../constants/colors';
import Photos from '../../assets/photos';
import {isNotEmail} from '../../utils/errorCodes';

import {HeaderWithAside} from '../../components';
import {InputNew, ButtonNew} from '../../new_components';

type Props = {
  navigation: NavigationScreenProp<any>;
};

const CellarImport: FC<Props> = ({navigation}) => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [errorText, setError] = useState('');

  const redirectedFrom = navigation.getParam('from');

  const loginRef = useRef(null);
  const passwordRef = useRef(null);

  const client = useApolloClient();
  const [syncCellar] = useMutation(CELLAR_TRACKER_SYNC_MUTATION, {
    onCompleted: data => onCompleted(data, login, password, client, navigation),
    onError: error => {
      Alert.alert('Error', error.graphQLErrors[0].message);
    },
  });

  const [uploadFile] = useMutation(CELLAR_TRACKER_SYNC_MUTATION, {
    onCompleted: data => onCompleted(data, login, password, client, navigation),
    onError: error => {
      if (/Unrecognized token/i.test(error.toString())) {
        Alert.alert('Error', 'Heroku error');
      } else {
        timeoutError(error);
      }
      RNProgressHud.dismiss();
    },
  });

  const onChangeEmail = (val: string) => {
    setLogin(val);
    setError('');
  };

  const onChangePassword = (val: string) => {
    setPassword(val);
    setError('');
  };

  const focusTheField = () => {
    passwordRef.current.focus();
  };

  useEffect(() => {
    AsyncStorage.getItem('Import').then(res => {
      if (res) {
        const syncData = JSON.parse(res);
        loginRef.current.setValue(syncData.login);
        passwordRef.current.setValue(syncData.password);
        setLogin(syncData.login);
        setPassword(syncData.password);
      }
    });
  }, []);

  return (
    <HeaderWithAside
      customBackRoute={redirectedFrom}
      text="Import"
      headerTitleTextStyle={headerTitleText}
      asideSrc={Photos.bgAsideImportScreen}>
      <View style={{flex: 1}}>
        <Text style={titleText}>Import from Cellar Tracker</Text>

        <InputNew
          placeHolder="Member name"
          value={login}
          autoCapitalize="none"
          onChange={onChangeEmail}
          onSubmitEditing={() => focusTheField()}
          keyboardType="email-address"
          returnKeyType="next"
          error={isNotEmail(login)}
          x1={2}
          autoFocus
          requiredColorValidation={Colors.inputBorderGrey}
          containerStyle={{marginTop: 20}}
        />
        <View style={hint}>
          <Text style={hintText}>Use your Member name from CellarTracker</Text>
        </View>

        <InputNew
          placeHolder="Password"
          value={password}
          autoCapitalize="none"
          onChange={onChangePassword}
          onSubmitEditing={() => onImportCellarProduction(login, password, navigation, syncCellar, uploadFile)}
          keyboardType="default"
          returnKeyType={'go'}
          getRef={passwordRef}
          error={errorText}
          x1={2}
          isPassword={true}
          requiredColorValidation={Colors.inputBorderGrey}
          containerStyle={{marginTop: 10}}
        />
        <View style={hint}>
          <Text style={hintText}>Use your password from CellarTracker</Text>
        </View>
        <ButtonNew
          onPress={() => onImportCellarProduction(login, password, navigation, syncCellar, uploadFile)}
          isDisabled={!login || !password}
          style={buttonStyle}
          text={'IMPORT'}
        />
      </View>
    </HeaderWithAside>
  );
};

const onCompleted = async (data, login, password, client, navigation) => {
  if (data.cellarTrackerSync) {
    Keyboard.dismiss();
    const syncData = {login, password};
    const emptyData = {
      listData: {
        __typename: 'List',
        list: '[]',
      },
    };
    client.writeData({data: emptyData});
    await AsyncStorage.setItem('Import', JSON.stringify(syncData));
    await flagsToUpdateAll();
    RNProgressHud.dismiss();
    Alert.alert('Success', data.cellarTrackerSync);
    navigation.navigate('InventoryStack');
  }
};

const styles = StyleSheet.create({
  titleText: {
    ...textStyle.mediumText,
    color: '#fff',
    fontSize: 21,
    lineHeight: 28,
  },
  buttonStyle: {
    minHeight: 50,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    backgroundColor: Colors.orangeDashboard,
    marginTop: 30,
  },
  headerTitleText: {fontSize: 50},
  hint: {
    flexDirection: 'column',
    position: 'relative',
    minHeight: 40,
    justifyContent: 'center',
    backgroundColor: 'rgba(232,104,0,1)',
    paddingLeft: 5,
    paddingRight: 20,
  },
  hintText: {
    color: '#fff',
    ...textStyle.mediumText,
    fontSize: 16,
  },
});

const {titleText, buttonStyle, headerTitleText, hint, hintText} = styles;

export const CellarImportScreen = CellarImport;
