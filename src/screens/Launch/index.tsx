import React, {FC, useEffect, useState} from 'react';
import {View, StatusBar, StyleSheet, ImageBackground, SafeAreaView, TouchableOpacity} from 'react-native';
import ApolloClient from 'apollo-client';
import {useApolloClient} from '@apollo/react-hooks';
import {NavigationEvents} from 'react-navigation';
import SplashScreen from 'react-native-splash-screen';
import RNProgressHud from 'progress-hud';
import AsyncStorage from '@react-native-community/async-storage';

import Photos from '../../assets/photos';
import Routes from '../../constants/navigator-name';
import Navigation from '../../types/navigation';
import {LocalStorage} from '../../utils/LocalStorage';
import {setCodeData} from '../../apollo/updateCache/setCode';

import {ButtonNew} from '../../new_components';
import {CellrLogoIcon} from '../../assets/svgIcons';
import colors from '../../constants/colors';

type Props = {
  navigation: Navigation;
  userProfile: any;
};

const Launch: FC<Props> = ({navigation}) => {
  const client = useApolloClient();
  const [isLogged, setIsLogged] = useState(true);
  const [resetCount, setResetCount] = useState(0);

  useEffect(() => {
    RNProgressHud.show();
    getToken(client, setIsLogged, navigation);
  }, []);

  const resetState = async () => {
    if (resetCount >= 10) {
      setResetCount(0);
      AsyncStorage.clear();
    }
    setResetCount(count => count + 1);
  };

  return (
    <ImageBackground style={[flex1, relativePosition]} source={Photos.bgLaunchScreen} resizeMode="cover">
      <View style={imgBackdrop} />
      <NavigationEvents
        onWillFocus={async () => {
          StatusBar.setBarStyle('light-content');
        }}
      />
      {!isLogged && (
        <SafeAreaView style={safeAreaStyle}>
          {/*The invisible reset button intended to reset async storage by users without reinstalling the app*/}
          <TouchableOpacity style={invisibleReset} onPress={resetState} />
          <View style={logoContainer}>
            <CellrLogoIcon height={50} width={300} />
          </View>
          <View style={buttonContainer}>
            <ButtonNew
              text="GET STARTED"
              style={[buttonStyle, bottomMargin]}
              onPress={() => navigation.navigate(Routes.register.name)}
            />

            <ButtonNew
              text="SEE HOW IT WORKS"
              style={[buttonStyle, transparentButton, bottomMargin]}
              onPress={() => navigation.navigate(Routes.carouselScreen.name)}
            />

            <ButtonNew
              text="LOG IN"
              style={[buttonStyle, bgTransparent]}
              onPress={() => navigation.navigate(Routes.signIn.name)}
            />
          </View>
        </SafeAreaView>
      )}
    </ImageBackground>
  );
};

const getToken = async (client: ApolloClient<object>, setIsLogged: any, navigation: Navigation) => {
  const data = await LocalStorage.getAllData();
  if (data) {
    setCodeData(client, data);
    console.log('Token', data);
    navigation.navigate('DashStack');
  } else {
    SplashScreen.hide();
    RNProgressHud.dismiss();
    setIsLogged(false);
  }
};

const styles = StyleSheet.create({
  buttonStyle: {
    backgroundColor: colors.orangeDashboard,
    height: 50,
    minWidth: 300,
    width: '100%',
  },
  transparentButton: {
    borderWidth: 3,
    backgroundColor: 'transparent',
    borderColor: colors.orangeDashboard,
  },
  buttonContainer: {
    flex: 1,
    marginBottom: 10,
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  loginBtnStyle: {
    alignSelf: 'flex-end',
  },
  loginBtnText: {
    fontSize: 18,
    lineHeight: 24,
  },
  bottomMargin: {
    marginBottom: 10,
  },
  safeAreaStyle: {
    flex: 1,
    alignItems: 'center',
  },
  flex1: {flex: 1},
  invisibleReset: {width: 50, height: 250, position: 'absolute', top: 0, right: 0, opacity: 0},
  logoContainer: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  bgTransparent: {backgroundColor: 'transparent'},
  imgBackdrop: {width: '100%', height: '100%', position: 'absolute', backgroundColor: 'rgba(0,0,0,0.4)'},
  relativePosition: {position: 'relative'},
});

const {
  buttonStyle,
  buttonContainer,
  bottomMargin,
  safeAreaStyle,
  flex1,
  invisibleReset,
  transparentButton,
  logoContainer,
  bgTransparent,
  imgBackdrop,
  relativePosition,
} = styles;

export const LaunchScreen = Launch;
