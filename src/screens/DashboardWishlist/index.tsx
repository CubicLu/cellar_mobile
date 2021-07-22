import RNProgressHud from 'progress-hud';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  View,
  TouchableOpacity,
  FlatList,
  ImageBackground,
  Text,
  SectionList,
  StatusBar,
  Animated,
  Image,
  SafeAreaView,
} from 'react-native';
import {NavigationEvents} from 'react-navigation';
import {useLazyQuery, useMutation} from '@apollo/react-hooks';

import {BurgerIcon, HorizontalDotsIcon} from '../../assets/svgIcons';
import {WISHLIST_FILTER_LIST} from '../../apollo/queries/filtersList';
import {GET_SYNC_STATUS} from '../../apollo/queries/profile';
import {bottomTabData} from '../../constants/dashboard.constants';
import Navigation from '../../types/navigation';
import {timeoutError} from '../../utils/errorCodes';
import {DashboardUtils} from '../../utils/DashboardUtils';
import {DASHBOARD_ICON} from '../../constants/sizes';
import {statusBarColorChange} from '../../utils/statusBar';
import {Routes} from '../../constants';
import styles from '../Main/Dashboard/styles';
import {
  BottomSheetNew,
  BackgroundGradient,
  TabItem,
  DashboardCellItem,
  SectionHeader,
  EmptyListDashboard,
} from '../../new_components';
import {ADD_LOCAL_WISHLIST_FILTER, CLEAR_WISHLIST_LOCAL_FILTERS} from '../../apollo/client/mutations';

interface DashboardProps {
  navigation: Navigation;
}

const {
  container,
  dotsContainer,
  headerContainer,
  pickerContentContainer,
  animatedContainer,
  sectionListContentContainer,
  subListImage,
  headerTitleText,
  flex1,
  imageBg,
  pickerContainer,
  burgerTouchable,
  burgerContainer,
  sheetRow,
  sheetCancelText,
  sheetRowText,
} = styles;

const WishList: React.FC<DashboardProps> = ({navigation}) => {
  const scrollRef = useRef(null);
  const dashSwitcherRef = useRef(null);
  const [loadDashboard, {loading, data, error}] = useLazyQuery(WISHLIST_FILTER_LIST, {
    fetchPolicy: 'network-only',
  });
  const [localData, setLocalData] = useState<any>([{data: [], title: ''}]);
  const [totalSum, setTotalSum] = useState(0);
  const [errorText, setError] = useState('');
  const [animation] = useState(new Animated.Value(1));
  const [selectedTab, selectTab] = useState(bottomTabData[0]);
  const dashboardUtils = new DashboardUtils();
  const [syncWithCellarTrackerIsAllowed, setSyncWithCellarTrackerIsAllowed] = useState(false);
  const [loadSyncStatus, {data: syncResp}] = useLazyQuery(GET_SYNC_STATUS);
  const [firstLoad, setFirstLoad] = useState(true);
  const [clearWishlistFilters] = useMutation(CLEAR_WISHLIST_LOCAL_FILTERS);
  const [addLocalFilter] = useMutation(ADD_LOCAL_WISHLIST_FILTER);

  useEffect(() => {
    if (loading) {
      RNProgressHud.show();
    } else {
      RNProgressHud.dismiss();
    }
    if (error) {
      console.log('Dashboard Error', error);
      timeoutError(error);
      setError(error.message.toString());
    }
  }, [error, loading]);

  useEffect(() => {
    updateSyncStatus(syncResp);
  }, [syncResp]);

  useEffect(() => {
    if (firstLoad) {
      setFirstLoad(false);
      loadSyncStatus();
    }
  }, [firstLoad, loadSyncStatus]);

  useEffect(() => {
    typeof data === 'undefined' && loadSyncStatus();

    setSyncWithCellarTrackerIsAllowed(syncResp && syncResp.profile.syncWithCellarTrackerIsAllowed);

    if (data && data.filtersWishlist.appellation.length < 1) {
      loadSyncStatus();
    }
  }, [data, loadSyncStatus, syncResp]);

  function updateSyncStatus(response) {
    if (response) {
      setSyncWithCellarTrackerIsAllowed(response.profile.syncWithCellarTrackerIsAllowed);
    }
  }

  const getSum = useCallback(() => {
    if (data) {
      let sum = 0;
      const producerData = data.filtersWishlist.producer;
      producerData.map(el => {
        sum += el.count;
      });
      setTotalSum(sum);
    }
  }, [data]);

  useEffect(() => {
    getSum();
  }, [getSum]);

  useEffect(() => {
    dashboardUtils.onSelectWishlistTab(data, selectedTab, setLocalData);
  }, [data, selectedTab]);

  useEffect(() => {
    statusBarColorChange(navigation, 'light-content');
    loadDashboard();
  }, [loadDashboard]);

  const getIcon = title => {
    if (data) {
      const countryList = data.filtersWishlist.country;
      let icon = '';
      countryList.map(el => {
        if (el.title === title) {
          icon = el.icon;
        }
      });
      if (icon) {
        return <Image source={{uri: icon, cache: 'force-cache'}} style={subListImage} />;
      }
      return selectedTab.headerIcon ? selectedTab.headerIcon(30, 30) : <View />;
    }
    return <View />;
  };

  const goToScreen = (route: string) => {
    dashSwitcherRef.current.close();
    navigation.navigate(route);
  };

  return (
    <View style={container}>
      <SafeAreaView>
        <StatusBar barStyle={'light-content'} />
        <NavigationEvents onWillFocus={async () => DashboardUtils.onFocusSync(loadDashboard)} />
        <ImageBackground source={selectedTab.bgImage} style={imageBg}>
          <BackgroundGradient />
          <SafeAreaView style={flex1}>
            <View style={flex1}>
              <View style={pickerContainer}>
                <View style={headerContainer}>
                  <View style={burgerContainer}>
                    <TouchableOpacity
                      style={burgerTouchable}
                      onPress={() => {
                        navigation.openDrawer();
                      }}>
                      <BurgerIcon height={13} width={20} />
                    </TouchableOpacity>
                  </View>
                  <View style={flex1}>
                    <Text style={headerTitleText}>{selectedTab.title}</Text>
                  </View>
                  <TouchableOpacity onPress={() => (dashSwitcherRef as any).current.open()} style={dotsContainer}>
                    <HorizontalDotsIcon width={26} height={6} />
                  </TouchableOpacity>
                </View>
                <FlatList
                  data={bottomTabData || []}
                  contentContainerStyle={pickerContentContainer}
                  keyExtractor={item => item.title}
                  showsVerticalScrollIndicator={false}
                  horizontal
                  indicatorStyle="white"
                  renderItem={({item, index}: any) => (
                    <TabItem
                      icon={item.icon(DASHBOARD_ICON, DASHBOARD_ICON, item.title === selectedTab.title)}
                      title={item.title}
                      selectedTabTitle={selectedTab.title}
                      onPress={() => {
                        DashboardUtils.fadeAnimation(animation, scrollRef, localData);
                        selectTab(bottomTabData[index]);
                      }}
                    />
                  )}
                />
              </View>
              <Animated.View style={[animatedContainer, {opacity: animation}]}>
                {!error && localData[0].data.length !== 0 && (
                  <SectionList
                    sections={localData || []}
                    style={{flex: 1}}
                    ref={scrollRef}
                    showsVerticalScrollIndicator={true}
                    indicatorStyle="white"
                    contentContainerStyle={sectionListContentContainer}
                    keyExtractor={(item, index) => item + index}
                    renderItem={({item}: any) =>
                      !loading && (
                        <DashboardCellItem
                          item={item}
                          totalSum={totalSum}
                          tabName={selectedTab.requestTitle}
                          onPress={async () => {
                            await clearWishlistFilters();
                            await addLocalFilter({variables: {filter: item, category: selectedTab.title}});
                            navigation.navigate(Routes.WishlistInDashStack.name, {isDashboard: true});
                          }}
                        />
                      )
                    }
                    stickySectionHeadersEnabled={false}
                    renderSectionHeader={({section}) => {
                      const index = localData.indexOf(section);
                      return (
                        section.title !== '' && (
                          <SectionHeader title={section.title} icon={getIcon(section.title)} index={index} />
                        )
                      );
                    }}
                  />
                )}
                {!loading && (error || (data && data.filtersWishlist.producer.length === 0)) && (
                  <EmptyListDashboard isImportAllowed={syncWithCellarTrackerIsAllowed} errorTitle={errorText} />
                )}
              </Animated.View>
            </View>
            <BottomSheetNew
              controls={false}
              sheetContainerBG="transparent"
              onPressDone={() => {}}
              ref={dashSwitcherRef}>
              <TouchableOpacity style={sheetRow} onPress={() => goToScreen(Routes.dashboard.name)}>
                <Text allowFontScaling={false} adjustsFontSizeToFit numberOfLines={1} style={sheetRowText}>
                  Dashboard - Inventory
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={sheetRow} onPress={() => goToScreen('dashboardCommunity')}>
                <Text allowFontScaling={false} adjustsFontSizeToFit numberOfLines={1} style={sheetRowText}>
                  Dashboard - Community
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={sheetRow} onPress={() => dashSwitcherRef.current.close()}>
                <Text
                  allowFontScaling={false}
                  adjustsFontSizeToFit
                  numberOfLines={1}
                  style={[sheetRowText, sheetCancelText]}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </BottomSheetNew>
          </SafeAreaView>
        </ImageBackground>
      </SafeAreaView>
    </View>
  );
};

export const DashboardWishList = WishList;
