import React, {FC, useEffect, useState} from 'react';
import {View, StyleSheet, Text, Dimensions, TouchableOpacity, Linking, Platform} from 'react-native';
import RNExitApp from 'react-native-exit-app';

import {AlertLogoIcon} from '../../../assets/svgIcons';
import textStyle from '../../../constants/Styles/textStyle';
import colors from '../../../constants/colors';
import ForceUpdateService from '../../../service/ForceUpdateService';
import config from '../../../constants/config';

type Props = {};
const screenWidth = Dimensions.get('screen').width;

export const ForceUpdate: FC<Props> = ({children}) => {
  const [show, setShow] = useState(false);
  const [isForced, setIsForced] = useState(false);

  useEffect(() => {
    (async () => {
      await ForceUpdateService.compareVersions(
        () => {
          console.log('Current version is actual');
          setShow(false);
        },
        () => {
          console.log('Current version is outdated');
          setShow(true);
        },
        onForced,
      );
    })();
  }, []);

  const onSkip = () => {
    ForceUpdateService.ignoreVersion(() => {
      setShow(false);
    });
  };

  const onForced = () => {
    setIsForced(true);
    setShow(true);
  };

  const onUpdate = () => {
    Linking.openURL(Platform.select({ios: config.APP_STORE_LINK, android: 'google.com'})).then(RNExitApp.exitApp);
  };

  return (
    <View style={flex1}>
      <View style={flex1}>{children}</View>
      {show && (
        <View style={[StyleSheet.absoluteFill, overlay]}>
          <View style={requestContainer}>
            <View style={descriptionContainer}>
              <View style={logoContainer}>
                <AlertLogoIcon width={50} height={50} />
              </View>
              <Text style={[text, h2, boldText]}>Update Available</Text>
              <Text style={[text, h3]}>New version of Cellr is available</Text>
            </View>
            <View style={buttonsContainer}>
              {!isForced && (
                <TouchableOpacity onPress={onSkip} style={buttonContainer}>
                  <Text style={[text, buttonText]}>Not Now</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={onUpdate} style={buttonContainer}>
                <Text style={[buttonText, text, boldText, buttonActiveText]}>Update</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  flex1: {flex: 1},
  overlay: {justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)'},
  requestContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    width: screenWidth * 0.8,
    minHeight: 250,
  },
  descriptionContainer: {justifyContent: 'center', alignItems: 'center', flex: 1},
  buttonText: {textAlign: 'center', fontSize: 16},
  buttonContainer: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  text: {...textStyle.mediumText, color: '#6f6f6f'},
  h2: {fontSize: 20},
  h3: {fontSize: 16},
  boldText: {fontWeight: 'bold'},
  buttonActiveText: {color: colors.darkRedDrawer},
  buttonsContainer: {flexDirection: 'row', flex: 0.5},
  logoContainer: {
    paddingVertical: 15,
  },
});

const {
  flex1,
  overlay,
  buttonText,
  h2,
  h3,
  text,
  boldText,
  buttonActiveText,
  buttonContainer,
  requestContainer,
  descriptionContainer,
  buttonsContainer,
  logoContainer,
} = styles;
