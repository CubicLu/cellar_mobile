import React, {useEffect, useState} from 'react';
import {Alert, ScrollView, StyleSheet, View, Dimensions} from 'react-native';
import {getStatusBarHeight} from 'react-native-iphone-x-helper';
import Config from 'react-native-config';
import RNProgressHud from 'progress-hud';
import {useLazyQuery, useMutation, useQuery} from '@apollo/react-hooks';
import NetInfo from '@react-native-community/netinfo';
import {LocalStorage} from '../../../utils/LocalStorage';

import Photos from '../../../assets/photos';
import {Routes} from '../../../constants';
import {InfoItem} from '../../../components/InfoContactsComponents/InfoItem';
import Navigation from '../../../types/navigation';
import {statusBarColorChange} from '../../../utils/statusBar';
import {GET_LOCAL_RELEASE_NOTES} from '../../../apollo/client/queries/other';
import {GET_RELEASE_ITEM, GET_RELEASE_LIST} from '../../../apollo/queries/faq';
import {CHECK_IMAGE_DOWNLOAD_LIST, CHUNK_SIZE, INIT_RELEASE_LIST} from '../../../apollo/client/mutations';
import {GET_IMAGE_LIST, GET_LOCAL_PROFILE} from '../../../apollo/client/queries';
import {HeaderWithAside} from '../../../components';
import {useAppReview} from '../../../hooks';

interface Props {
  navigation: Navigation;
}

/**
 * All info about this screen you can found here https://cellarventures.atlassian.net/wiki/spaces/CA/pages/12779548/Info+Contacts+screen
 */

const InfoContacts: React.FC<Props> = ({navigation}) => {
  const [preload, setPreload] = useState(null);
  const [token, setToken] = useState('');
  const [loadingError, setLoadingError] = useState(false);
  const {data: indicator} = useQuery(GET_LOCAL_RELEASE_NOTES);
  const {data: localProfile} = useQuery(GET_LOCAL_PROFILE);
  const [saveUnwatched] = useMutation(INIT_RELEASE_LIST);
  const showReviewPopup = useAppReview();

  const [getImageList, {fetchMore}] = useLazyQuery(GET_IMAGE_LIST, {
    onCompleted: response => {
      checkDownloadList({variables: {...response.vivinoGetDownloadQueue}});
    },
    fetchPolicy: 'no-cache',
  });

  const [checkDownloadList] = useMutation(CHECK_IMAGE_DOWNLOAD_LIST, {
    onCompleted: ({checkImageDownloadList: {loadMore, left}}) => {
      console.debug(`loadMore:${loadMore}, left: [${left}]`);

      if (loadMore) {
        fetchMore({
          variables: {
            first: CHUNK_SIZE,
          },
          updateQuery: (_, {fetchMoreResult}) => {
            checkDownloadList({
              variables: {
                data: fetchMoreResult.vivinoGetDownloadQueue.data,
                downloadingCount: fetchMoreResult.vivinoGetDownloadQueue.downloadingCount,
              },
            });
          },
        });
      }
    },
  });

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
      setLoadingError(true);
    },
    fetchPolicy: 'no-cache',
  });

  const [getReleaseList] = useLazyQuery(GET_RELEASE_LIST, {
    fetchPolicy: 'network-only',
    onCompleted: async data => {
      RNProgressHud.dismiss();
      await saveUnwatched({
        variables: {releaseList: data.releasesList.releases, watched: localProfile.userProfile.readedReleaseNotes},
      });

      setPreload(data.releasesList.releases[0]);
    },
    onError: error => {
      RNProgressHud.dismiss();
      Alert.alert('', error.message);
      setLoadingError(true);
    },
  });

  const unsubscribe = NetInfo.addEventListener(state => {
    if (state.isInternetReachable && loadingError) {
      loadReleaseList();
    }
  });

  useEffect(() => {
    loadReleaseList();
    getToken();
  }, []);

  function loadReleaseList() {
    setLoadingError(false);
    RNProgressHud.show();
    getReleaseList();
  }

  const onRedirectReleaseList = () => {
    RNProgressHud.show();

    try {
      getRelease({variables: {release: preload.release}});
    } catch (e) {
      RNProgressHud.dismiss();
      Alert.alert('', 'Failed to load "What\'s New"');
    }
  };

  useEffect(() => {
    statusBarColorChange(navigation, 'light-content');

    return () => unsubscribe();
  }, []);

  const getToken = async () => {
    const accessToken = await LocalStorage.getAccessCode();
    setToken(accessToken);
  };

  return (
    <HeaderWithAside
      headerTitleStyle={asideTitle}
      headerTitleTextStyle={headerTitle}
      text="Info & Contacts"
      asideSrc={Photos.splash}
      drawer>
      <View style={{flex: 1, alignItems: 'flex-end'}}>
        <ScrollView
          contentContainerStyle={{flexGrow: 1, justifyContent: 'center', alignItems: 'center'}}
          style={{marginBottom: getStatusBarHeight(true)}}>
          <InfoItem title={'FAQ'} onPress={() => navigation.navigate(Routes.faq.name, {})} />
          <InfoItem
            title={'Contact Us'}
            onPress={() =>
              navigation.navigate(Routes.webViewInfo.name, {
                link: `${Config.API_PUBLIC}/contacts.html`,
                title: 'Contact Us',
              })
            }
          />
          <InfoItem
            title={'About Us'}
            onPress={() =>
              navigation.navigate(Routes.webViewInfo.name, {
                link: `${Config.API_PUBLIC}/about.html`,
                title: 'About Us',
              })
            }
          />
          <InfoItem title={'Feedback'} onPress={() => navigation.navigate(Routes.feedBackScreen.name)} />

          <InfoItem
            title={'Privacy & Security'}
            onPress={() =>
              navigation.navigate(Routes.webViewInfo.name, {
                link: `${Config.API_PUBLIC}/policies.html`,
                title: 'Privacy & Security',
              })
            }
          />
          <InfoItem title={'About this App'} onPress={() => navigation.navigate(Routes.aboutAppScreen.name)} />

          <InfoItem
            title={'Import instructions'}
            onPress={() =>
              navigation.navigate(Routes.webViewInfo.name, {
                link: `${Config.API_PUBLIC}/importFromVivino.html`,
                title: 'CELLR Import Instructions',
                token,
                callback: getImageList,
              })
            }
          />

          <InfoItem
            indicator={indicator && indicator.whatNewIndicator}
            title={"What's New"}
            onPress={onRedirectReleaseList}
          />
          <InfoItem title={'Submit a review'} onPress={() => showReviewPopup()} />
        </ScrollView>
      </View>
    </HeaderWithAside>
  );
};

export const InfoContactsScreen = InfoContacts;

const styles = StyleSheet.create({
  asideTitle: {
    paddingTop: 20,
  },
  headerTitle: {
    fontSize: Dimensions.get('screen').width < 375 ? 22 : 35,
  },
});

const {asideTitle, headerTitle} = styles;
