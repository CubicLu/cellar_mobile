import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Image, TouchableOpacity, ScrollView, Alert, Text} from 'react-native';
import {DrawerContentComponentProps} from 'react-navigation-drawer';
import {getStatusBarHeight} from 'react-native-iphone-x-helper';
import {useQuery, useMutation, useApolloClient} from '@apollo/react-hooks';

import Images from '../../../assets/images';
import {Routes} from '../../../constants';
import Colors from '../../../constants/colors';
import {logout} from '../../../utils/logout';
import AsyncStorage from '@react-native-community/async-storage';
import textStyle from '../../../constants/Styles/textStyle';
import {DrawerNewUICell} from '../../../new_components/DrawerComponents/DrawerCell';
import {VersionCell, TradeButton} from '../../../components';

import {
  INIT_COMM_FILTERS,
  SAVE_DESIGNATION_LIST,
  SET_COMM_LOCAL_SUB_FILTERS,
  INIT_RELEASE_LIST,
  UPDATE_LOCAL_PROFILE,
  CHECK_IMAGE_DOWNLOAD_LIST,
  CHUNK_SIZE,
} from '../../../apollo/client/mutations';

import {
  AddWineIcon,
  AddWishlistIcon,
  DashboardIcon,
  DrinkHistoryIcon,
  HeartIcon,
  InfoIcon,
  InventoryDrawerIcon,
  LogoutIcon,
  UserIcon,
  TabCommunityIcon,
  SaleDrawerIcon,
} from '../../../assets/svgIcons';

import {GET_LOCAL_RELEASE_NOTES} from '../../../apollo/client/queries/other';
import {INIT_APP} from '../../../apollo/queries/appInitialization';
import {GET_DESIGNATION_LIST} from '../../../apollo/queries/inventory';
import {GET_LOCAL_PROFILE, GET_IMAGE_LIST} from '../../../apollo/client/queries';
import NetInfo from '@react-native-community/netinfo';
import APP_CONFIG from '../../../constants/config';
import {useAppReview} from '../../../hooks';
import {SIGN_OUT} from '../../../apollo/mutations/SignOut';
import NotificationService from '../../../service/NotificationService';

/**
 * All info about this screen you can found here https://cellarventures.atlassian.net/wiki/spaces/CA/pages/50888736/Drawer
 */
const Drawer: React.ComponentType<DrawerContentComponentProps> = ({navigation}) => {
  const client = useApolloClient();
  const {data: localProfile} = useQuery(GET_LOCAL_PROFILE);
  const [isChanged, setIsChanged] = useState(false);
  const [invalidate, setInvalidate] = useState(false);
  const [initError, setInitError] = useState(false);
  const [avatar, setAvatar] = useState();
  const [email, setEmail] = useState('');

  const [removeNotificationToken] = useMutation(SIGN_OUT, {
    onError: () => logout(client),
    onCompleted: () => logout(client),
  });

  const [setLocalProfile] = useMutation(UPDATE_LOCAL_PROFILE);

  const {data: indicator} = useQuery(GET_LOCAL_RELEASE_NOTES);
  const [initReleaseList] = useMutation(INIT_RELEASE_LIST);

  const [initCommunityFilters] = useMutation(INIT_COMM_FILTERS, {});
  const [setCommSubFilters] = useMutation(SET_COMM_LOCAL_SUB_FILTERS);

  const [saveDesignationList] = useMutation(SAVE_DESIGNATION_LIST);

  useAppReview();
  const {fetchMore} = useQuery(GET_IMAGE_LIST, {
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

  useEffect(() => {
    if (localProfile) {
      setAvatar(localProfile.userProfile.avatarURL);
    }
  }, [localProfile]);

  useEffect(() => {
    (async () => await NotificationService.checkPermission())();
  });

  useQuery(GET_DESIGNATION_LIST, {
    onCompleted: data => {
      saveDesignationList({
        variables: {
          list: data.cellarDesignations,
        },
      });
    },
  });

  async function onCompleteInit(data) {
    //profile init
    await setLocalProfile({variables: {userProfile: {...data.profile}}});
    setEmail(data.profile.email);
    setAvatar(data.profile.avatarURL);

    //filters init
    await initCommunityFilters();
    await setCommSubFilters({variables: {subFilters: data.filtersCommunity}});

    //release notes init
    await initReleaseList({
      variables: {releaseList: data.releasesList.releases, watched: data.profile.readedReleaseNotes},
    });

    //cellar designation init
    await saveDesignationList({
      variables: {
        list: data.cellarDesignations,
      },
    });
  }

  const {fetchMore: refetchInit} = useQuery(INIT_APP, {
    onCompleted: onCompleteInit,
    onError: () => {
      setInitError(true);
    },
  });

  const unsubscribe = NetInfo.addEventListener(async state => {
    if (state.isConnected && initError) {
      await refetchInit({
        updateQuery: (__, {fetchMoreResult}) => {
          onCompleteInit(fetchMoreResult);
          return fetchMoreResult;
        },
      });
      setInitError(false);
      unsubscribe();
    }
  });

  const onChangeTest = val => {
    setIsChanged(val);
  };

  const onSelectTest = val => {
    setInvalidate(val);
  };

  const onPressItem = (routeName, param) => {
    //Needs to show alert if some profile data was changed
    if (isChanged && navigation.state.index === 0 && navigation.state.isDrawerOpen) {
      Alert.alert(
        'Alert',
        'Are you sure you want to leave this page? Changes made to this page haven’t been saved yet.',
        [
          {
            text: 'Cancel',
            onPress: () => {},
            style: 'cancel',
          },
          {
            text: 'OK',
            onPress: () => {
              navigation.navigate(routeName, param);
              AsyncStorage.setItem('ResetProfile', JSON.stringify({reset: true}));
              setTimeout(() => {
                navigation.closeDrawer();
              });
            },
          },
        ],
        {cancelable: false},
      );
    } else {
      navigation.navigate(routeName, param);
      navigation.closeDrawer();
    }
  };

  const onUserPress = () => {
    navigation.closeDrawer();
    navigation.navigate(Routes.profile.name, {
      onChange: onChangeTest,
      invalidate,
      onSelect: onSelectTest,
    });
  };

  const onPressSecuredRoute = ({userProfile}: any, callback) => {
    const {authorizedTrader} = userProfile;

    if (authorizedTrader) {
      navigation.closeDrawer();
      callback();
    } else {
      Alert.alert('', 'This functionality is currently being tested in Beta for Authorized Users');
    }
  };

  return (
    <View style={container}>
      <ScrollView contentContainerStyle={{flexGrow: 1, paddingBottom: 40}} style={drawerContainer}>
        <TouchableOpacity style={accountContainer} onPress={() => onUserPress()}>
          <Image
            source={avatar ? {uri: avatar, cache: 'force-cache'} : Images.user}
            onError={() => setAvatar(undefined)}
            style={photoPlaceholder}
          />
          <Text
            allowFontScaling={false}
            adjustsFontSizeToFit
            numberOfLines={1}
            style={{...textStyle.mediumText, fontSize: 24, color: 'white', marginTop: 10}}>
            {email}
          </Text>
        </TouchableOpacity>
        <DrawerNewUICell
          title={'Dashboard'}
          image={<DashboardIcon height={18} width={18} />}
          onPress={() => onPressItem(Routes.dashboard.name, {})}
        />

        <DrawerNewUICell
          title={'Inventory'}
          image={<InventoryDrawerIcon height={18} width={18} />}
          onPress={() => onPressItem('InventoryStack', {})}
        />

        <DrawerNewUICell
          title={'Wish List'}
          image={<HeartIcon height={18} width={18} />}
          onPress={() => onPressItem('WishStack', {})}
        />

        <DrawerNewUICell
          title={'Community'}
          image={<TabCommunityIcon color="#a26b77" height={18} width={18} />}
          onPress={() =>
            onPressItem(Routes.communityInventory.name, {
              isWishlist: false,
            })
          }
        />

        {/* commented by customer request
        <DrawerNewUICell
          title={'Camera'}
          image={<CameraIcon height={18} width={18} />}
          onPress={() => onPressItem('PhotoRecognitionStack', {})}
        /> */}
        <DrawerNewUICell
          title={'Add Inventory'}
          image={<AddWineIcon height={18} width={18} />}
          onPress={() => onPressItem('InventoryAdditionStack', {})}
        />
        <DrawerNewUICell
          title={'Add Wish List'}
          image={<AddWishlistIcon height={18} width={18} />}
          onPress={() => onPressItem('AddWish', {})}
        />

        <DrawerNewUICell
          title={'History'}
          image={<DrinkHistoryIcon height={20} width={20} />}
          onPress={() => onPressItem(Routes.HistorySwitch.name, {})}
        />

        {/*<DrawerNewUICell*/}
        {/*  title={'Sync Now'}*/}
        {/*  image={<HeartIcon height={18} width={18} />}*/}
        {/*  onPress={() => onPressItem(Routes.cellarImport.name, {})}*/}
        {/*/>*/}

        <DrawerNewUICell
          title={'User Profile'}
          image={<UserIcon height={18} width={18} />}
          onPress={() => onUserPress()}
        />
        <DrawerNewUICell
          title={'Info & Contacts'}
          image={<InfoIcon height={18} width={18} />}
          onPress={() => onPressItem(Routes.infoContacts.name, {})}
          indicator={indicator && indicator.whatNewIndicator}
        />

        <DrawerNewUICell
          title={'CELLR Sale'}
          image={<SaleDrawerIcon height={20} width={18} />}
          onPress={() => onPressSecuredRoute(localProfile, () => onPressItem(Routes.SaleStack.name, {}))}
        />

        <DrawerNewUICell
          title={'Logout'}
          image={<LogoutIcon height={18} width={18} />}
          onPress={removeNotificationToken}
        />

        {APP_CONFIG.EXTERNAL_BUILD ? null : (
          <View style={tradeBtnContainer}>
            <TradeButton
              text={'BUY / TRADE'}
              onPress={() => onPressSecuredRoute(localProfile, () => navigation.navigate(Routes.tradingMain.name))}
            />
          </View>
        )}
        <VersionCell />
      </ScrollView>
    </View>
  );
};

export const DrawerNewUIScreen = Drawer;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: getStatusBarHeight(true),
    backgroundColor: Colors.darkRedDrawer,
  },
  accountContainer: {
    width: '100%',
    backgroundColor: Colors.darkRedDrawer,
    padding: 30,
  },
  photoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  drawerContainer: {
    height: '90%',
    width: '100%',
    backgroundColor: Colors.dashboardRed,
    // paddingTop: 30,
    flex: 1,
  },
  tradeBtnContainer: {
    paddingHorizontal: 42,
    marginTop: 41,
  },
});

const {container, accountContainer, photoPlaceholder, drawerContainer, tradeBtnContainer} = styles;
