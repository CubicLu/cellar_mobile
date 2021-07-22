import React, {FC, useEffect, useState} from 'react';
import {StyleSheet, SafeAreaView, View, Text, TouchableOpacity, Alert} from 'react-native';
import {NavigationScreenProp} from 'react-navigation';
import {WebView} from 'react-native-webview';
import RNProgressHud from 'progress-hud';
import {useLazyQuery, useMutation} from '@apollo/react-hooks';

import {HeaderWithChevron} from '../../';
import textStyle from '../../../constants/Styles/textStyle';
import {Routes} from '../../../constants';
import {SET_IS_WATCHED} from '../../../apollo/client/mutations';
import {GET_RELEASE_ITEM} from '../../../apollo/queries/faq';

type Props = {
  navigation: NavigationScreenProp<any>;
};

const ReleaseNoteView: FC<Props> = ({navigation}) => {
  const releaseNotes = navigation.getParam('releaseNotes');
  const [isPrevDisabled, setIsPrevDisabled] = useState(false);

  const [setWatched] = useMutation(SET_IS_WATCHED);
  const [getRelease] = useLazyQuery(GET_RELEASE_ITEM, {
    onCompleted: async data => {
      RNProgressHud.dismiss();
      navigation.navigate(Routes.releaseNotesWebView.name, {
        releaseNotes: data.releaseNotes,
      });
    },
    onError: error => {
      RNProgressHud.dismiss();
      Alert.alert('', error.message);
    },
    fetchPolicy: 'no-cache',
  });

  useEffect(() => {
    setWatched({
      variables: {
        release: releaseNotes.release,
      },
    });

    if (releaseNotes.release === '1') {
      setIsPrevDisabled(true);
    } else {
      setIsPrevDisabled(false);
    }
  }, [releaseNotes]);

  const getPreviousRelease = () => {
    RNProgressHud.show();
    getRelease({variables: {release: `${+releaseNotes.release - 1}`}});
  };

  return (
    <SafeAreaView style={container}>
      <HeaderWithChevron
        title={`Version ${releaseNotes.release}`}
        titleTextStyle={headerTitleText}
        customBack={() => navigation.navigate(Routes.infoContacts.name)}
      />
      <WebView style={container} source={{html: releaseNotes.page}} />
      <View style={buttonRow}>
        <TouchableOpacity style={buttonContainer} onPress={() => navigation.navigate(Routes.releaseList.name)}>
          <Text style={[buttonText]}>All updates</Text>
        </TouchableOpacity>
        <TouchableOpacity style={buttonContainer} disabled={isPrevDisabled} onPress={getPreviousRelease}>
          <Text style={[buttonText, isPrevDisabled && disabledText]}>Previous</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#000', zIndex: 5},
  headerTitleText: {color: '#fff', fontSize: 25, ...textStyle.boldText},
  buttonText: {color: '#fff', ...textStyle.mediumText, fontSize: 20},
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 50,
    borderWidth: 2,
    borderTopColor: '#fff',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledText: {color: 'rgba(255,255,255,0.3)'},
});

const {headerTitleText, disabledText, container, buttonText, buttonContainer, buttonRow} = styles;

export const ReleaseNotesWebView = ReleaseNoteView;
