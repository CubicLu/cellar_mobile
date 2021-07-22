import React, {FC, useEffect, useState} from 'react';
import {Text, StyleSheet, TouchableOpacity} from 'react-native';
import {getVersion, getBuildNumber} from 'react-native-device-info';
import {NavigationScreenProp, withNavigation} from 'react-navigation';
import textStyle from '../../../constants/Styles/textStyle';
import {Routes} from '../../../constants';
import codePush, {LocalPackage} from 'react-native-code-push';
type Props = {
  navigation: NavigationScreenProp<any>;
};

const Cell: FC<Props> = ({navigation}) => {
  const [codePushResp, setCodePushResp] = useState<LocalPackage>(null);
  useEffect(() => {
    codePush.getUpdateMetadata().then(res => setCodePushResp(res));
  }, []);
  const appVersion = getVersion();
  return (
    <TouchableOpacity style={container} onPress={() => navigation.navigate(Routes.aboutAppScreen.name)}>
      <Text style={versionText}>
        v.{appVersion} Build:{getBuildNumber()}
        {codePushResp && `(${codePushResp.label.substring(1, codePushResp.label.length)})`}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 50,
    paddingBottom: 30,
    alignSelf: 'flex-end',
  },
  versionText: {
    fontSize: 16,
    color: '#fff',
    textDecorationLine: 'underline',
    ...textStyle.mediumText,
  },
});

const {container, versionText} = styles;

export const VersionCell = withNavigation(Cell);
