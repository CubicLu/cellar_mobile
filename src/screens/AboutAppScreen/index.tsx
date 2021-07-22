import React, {FC, useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import codePush, {LocalPackage} from 'react-native-code-push';
import {getBuildNumber, getVersion} from 'react-native-device-info';
import Clipboard from '@react-native-community/clipboard';
import {useAsyncStorage} from '@react-native-community/async-storage';

import {HeaderWithAside} from '../../components';
import Photos from '../../assets/photos';
import {CellrLogoIcon} from '../../assets/svgIcons';
import textStyle from '../../constants/Styles/textStyle';

type Props = {};

const About: FC<Props> = () => {
  const [codePushResp, setCodePushResp] = useState<LocalPackage>(null);
  const appVersion = getVersion();
  const {getItem} = useAsyncStorage('PUSH_TOKEN');

  const copyToClipboard = () => {
    getItem().then(token => {
      Clipboard.setString(token);
      console.log(token);
    });
  };

  useEffect(() => {
    codePush.getUpdateMetadata().then(res => setCodePushResp(res));
  }, []);

  return (
    <HeaderWithAside headerTitleTextStyle={headerTitleText} asideSrc={Photos.bgAsideLoginScreen} text="About">
      <TouchableOpacity activeOpacity={1} onLongPress={copyToClipboard} style={logoContainer}>
        <CellrLogoIcon width={243} height={50} />
      </TouchableOpacity>

      <View style={container}>
        <Text style={infoText}>
          v.{appVersion} Build:{getBuildNumber()}
          {codePushResp && `(${codePushResp.label.substring(1, codePushResp.label.length)})`}
        </Text>
      </View>
    </HeaderWithAside>
  );
};

const styles = StyleSheet.create({
  headerTitleText: {paddingTop: 20},
  infoText: {...textStyle.mediumText, color: '#fff', fontSize: 20},
  logoContainer: {alignItems: 'center'},
  container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
});

const {infoText, logoContainer, container, headerTitleText} = styles;

export const AboutAppScreen = About;
