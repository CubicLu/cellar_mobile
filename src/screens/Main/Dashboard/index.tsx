import RNProgressHud from 'progress-hud';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  View,
  TouchableOpacity,
  FlatList,
  ImageBackground,
  Text,
  StatusBar,
  Animated,
  Image,
  SafeAreaView,
} from 'react-native';
import {NavigationEvents} from 'react-navigation';
import {useLazyQuery, useMutation} from '@apollo/react-hooks';

import {BurgerIcon, HorizontalDotsIcon} from '../../../assets/svgIcons';
import {FILTERS_LIST} from '../../../apollo/queries/filtersList';
import {GET_SYNC_STATUS} from '../../../apollo/queries/profile';
import {inventoryTabData} from '../../../constants/dashboard.constants';
import Navigation from '../../../types/navigation';
import {timeoutError} from '../../../utils/errorCodes';
import {DashboardUtils} from '../../../utils/DashboardUtils';
import {DASHBOARD_ICON} from '../../../constants/sizes';
import {statusBarColorChange} from '../../../utils/statusBar';
import {ADD_LOCAL_FILTER, CLEAR_ALL_INV_FILTERS} from '../../../apollo/client/mutations';
import {Routes} from '../../../constants';
import styles from './styles';
import {
  BottomSheetNew,
  BackgroundGradient,
  TabItem,
  DashboardCellItem,
  EmptyListDashboard,
} from '../../../new_components';

import {useDebounce} from '../../../hooks';
import {groupStringArrayByFirstLetter} from '../../../utils/SearchUtils';
import {UPPER_CASE_ALPHABET} from '../../../constants/text';
import {DashboardSwitcher} from '../../../components/DashboardComponents/DashboardSwitcher';
import SplashScreen from 'react-native-splash-screen';

interface DashboardProps {
  navigation: Navigation;
}

const {
  container,
  dotsContainer,
  headerContainer,
  pickerContentContainer,
  animatedContainer,
  subListImage,
  headerTitleText,
  flex1,
  imageBg,
  pickerContainer,
  burgerTouchable,
  burgerContainer,
  sheetRow,
  sheetRowText,
  sheetCancelText,
} = styles;

const Dashboard: React.FC<DashboardProps> = ({navigation}) => {
  const scrollRef = useRef(null);
  const dashSwitcherRef = useRef(null);
  const [loadDashboard, {loading, data, error}] = useLazyQuery(FILTERS_LIST, {
    fetchPolicy: 'network-only',
    variables: {
      filters: [
        {
          field: 'price',
          values: [
            JSON.stringify({max: 30}),
            JSON.stringify({min: 30, max: 50}),
            JSON.stringify({min: 50, max: 80}),
            JSON.stringify({min: 80, max: 125}),
            JSON.stringify({min: 125, max: 250}),
            JSON.stringify({min: 250}),
          ],
        },
      ],
    },
  });
  const [localData, setLocalData] = useState<any>([{data: [], title: ''}]);
  const [totalSum, setTotalSum] = useState(0);
  const [errorText, setError] = useState('');
  const [animation] = useState(new Animated.Value(1));
  const [selectedTab, selectTab] = useState(inventoryTabData[0]);
  const [_, setKey] = useState(selectedTab.requestTitle);
  const dashboardUtils = new DashboardUtils();
  const [syncWithCellarTrackerIsAllowed, setSyncWithCellarTrackerIsAllowed] = useState(false);
  const [loadSyncStatus, {data: syncResp}] = useLazyQuery(GET_SYNC_STATUS);
  const [firstLoad, setFirstLoad] = useState(true);
  const [addLocalFilter] = useMutation(ADD_LOCAL_FILTER);
  const [clearAllLocalFilters] = useMutation(CLEAR_ALL_INV_FILTERS);
  const [activeSymbol, setActiveSymbol] = useState('');
  const debounceString = useDebounce(activeSymbol, 500);
  const [missingLetters, setMissingLetters] = useState([]);

  useEffect(() => {
    if (data && selectedTab.requestTitle === 'producer') {
      const keys = Object.keys(groupStringArrayByFirstLetter(data.filters.producer)[0]);

      setMissingLetters(UPPER_CASE_ALPHABET.filter(el => !keys.includes(el)));
    }
  }, [data, selectedTab]);

  useEffect(() => {
    setTimeout(() => SplashScreen.hide(), 200);
  }, []);

  useEffect(() => {
    dashboardUtils.scrollToIndex(debounceString, localData, scrollRef);
  }, [debounceString]);

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

    if (data && data.filters.appellation.length < 1) {
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
      const producerData = data.filters.producer;
      producerData.map(el => {
        sum += el.count;
      });
      setTotalSum(sum);
    }
  }, [data]);

  useEffect(() => {
    getSum();
  }, [getSum, data]);

  useEffect(() => {
    setKey(selectedTab.requestTitle);
  }, [selectedTab]);

  useEffect(() => {
    dashboardUtils.onSelectTab(data, selectedTab, setLocalData);
  }, [data, selectedTab]);

  useEffect(() => {
    statusBarColorChange(navigation, 'light-content');
    loadDashboard();
  }, [loadDashboard]);

  const getIcon = title => {
    if (data) {
      const countryList = data.filters.country;
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

  const onGetItemLayout = (args, index) => {
    return {length: 55, offset: 55 * index, index};
  };

  const renderItem = ({item}: any, customOnPress, props) => {
    return (
      <DashboardCellItem
        item={item}
        totalSum={totalSum}
        tabName={selectedTab.requestTitle}
        onPress={async () => {
          RNProgressHud.show();
          await clearAllLocalFilters();
          await addLocalFilter({variables: {filter: item, category: selectedTab.title}});
          navigation.navigate(Routes.inventoryStackForDashboard.name, {isDashboard: true});
        }}
        {...customOnPress && {onPress: customOnPress}}
        {...props}
      />
    );
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
                  data={inventoryTabData || []}
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
                        selectTab(inventoryTabData[index]);
                      }}
                    />
                  )}
                />
              </View>
              <Animated.View style={[animatedContainer, {opacity: animation}]}>
                <DashboardSwitcher
                  producer={{
                    disabledItems: missingLetters,
                    highlight: false,
                    onTextChange: symbol => setActiveSymbol(symbol),
                  }}
                  data={localData || []}
                  getItemLayout={onGetItemLayout}
                  scrollRef={scrollRef}
                  variant={selectedTab.requestTitle}
                  renderItem={renderItem}
                  getIcon={getIcon}
                />
                {!loading && (error || (data && data.filters.producer.length === 0)) && (
                  <EmptyListDashboard isImportAllowed={syncWithCellarTrackerIsAllowed} errorTitle={errorText} />
                )}
              </Animated.View>
            </View>
            <BottomSheetNew
              controls={false}
              sheetContainerBG="transparent"
              onPressDone={() => {}}
              ref={dashSwitcherRef}>
              <TouchableOpacity style={sheetRow} onPress={() => goToScreen(Routes.WishlistStackForDashboard.name)}>
                <Text allowFontScaling={false} adjustsFontSizeToFit numberOfLines={1} style={sheetRowText}>
                  Dashboard - Wish List
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

export const DashboardScreen = Dashboard;
