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
import {COMMUNITY_FILTER_LIST} from '../../apollo/queries/filtersList';
import {bottomTabData} from '../../constants/dashboard.constants';
import Navigation from '../../types/navigation';
import {timeoutError} from '../../utils/errorCodes';
import {DashboardUtils} from '../../utils/DashboardUtils';
import {DASHBOARD_ICON} from '../../constants/sizes';
import {statusBarColorChange} from '../../utils/statusBar';
import {ADD_COMM_LOCAL_FILTER, CLEAR_COMM_LOCAL_FILTERS} from '../../apollo/client/mutations';
import {Routes} from '../../constants';
import styles from '../Main/Dashboard/styles';
import {
  DashboardCellItem,
  SectionHeader,
  EmptyListDashboard,
  BackgroundGradient,
  TabItem,
  BottomSheetNew,
} from '../../new_components';
import {AlphabetList} from '../../components/CommonComponents/AlphbetList';
import {useDebounce} from '../../hooks';
import {groupStringArrayByFirstLetter} from '../../utils/SearchUtils';
import {UPPER_CASE_ALPHABET} from '../../constants/text';

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
  sheetCancelText,
  sheetRow,
  sheetRowText,
} = styles;

const Community: React.FC<DashboardProps> = ({navigation}) => {
  const scrollRef = useRef(null);
  const dashSwitcherRef = useRef(null);
  const [loadDashboard, {loading, data, error}] = useLazyQuery(COMMUNITY_FILTER_LIST, {});
  const [localData, setLocalData] = useState<any>([{data: [], title: ''}]);
  const [totalSum, setTotalSum] = useState(0);
  const [errorText, setError] = useState('');
  const [animation] = useState(new Animated.Value(1));
  const [selectedTab, selectTab] = useState(bottomTabData[0]);
  const [key, setKey] = useState(selectedTab.requestTitle);
  const dashboardUtils = new DashboardUtils();
  const [activeSymbol, setActiveSymbol] = useState('');
  const debounceString = useDebounce(activeSymbol, 500);

  const [firstLoad, setFirstLoad] = useState(true);
  const [addLocalFilter] = useMutation(ADD_COMM_LOCAL_FILTER);
  const [clearCommLocalFilters] = useMutation(CLEAR_COMM_LOCAL_FILTERS);

  const [missingLetters, setMissingLetters] = useState([]);

  useEffect(() => {
    if (data && selectedTab.requestTitle === 'producer') {
      const keys = Object.keys(groupStringArrayByFirstLetter(data.filtersCommunity.producer)[0]);

      setMissingLetters(UPPER_CASE_ALPHABET.filter(el => !keys.includes(el)));
    }
  }, [data, selectedTab]);

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
    dashboardUtils.scrollToIndex(debounceString, localData, scrollRef);
  }, [debounceString]);

  useEffect(() => {
    if (firstLoad) {
      setFirstLoad(false);
    }
  }, [firstLoad]);

  const getSum = useCallback(() => {
    if (data) {
      let sum = 0;
      const producerData = data.filtersCommunity.producer;
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
    setKey(selectedTab.requestTitle);
  }, [selectedTab]);

  useEffect(() => {
    dashboardUtils.onSelectCommunityTab(data, selectedTab, setLocalData);
  }, [data, selectedTab]);

  useEffect(() => {
    statusBarColorChange(navigation, 'light-content');
    loadDashboard();
  }, [loadDashboard]);

  const getIcon = title => {
    if (data) {
      const countryList = data.filtersCommunity.country;
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
    return {length: 55, offset: 55 * index - 55, index};
  };

  const renderItem = ({item}: any) =>
    !loading && (
      <DashboardCellItem
        item={item}
        totalSum={totalSum}
        tabName={selectedTab.requestTitle}
        onPress={async () => {
          RNProgressHud.show();
          await clearCommLocalFilters();
          await addLocalFilter({variables: {filter: item, category: selectedTab.title}});
          navigation.navigate(Routes.dashCommunity.name, {isDashboard: true});
        }}
      />
    );

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
                {selectedTab.requestTitle === 'producer' ? (
                  <>
                    <AlphabetList
                      disabledItems={missingLetters}
                      highlight={false}
                      onTextChange={symbol => setActiveSymbol(symbol)}
                    />
                    <FlatList
                      data={localData[0].data || []}
                      style={{paddingRight: 10}}
                      ref={scrollRef}
                      getItemLayout={onGetItemLayout}
                      indicatorStyle="white"
                      renderItem={renderItem}
                      showsVerticalScrollIndicator={true}
                    />
                  </>
                ) : (
                  <>
                    {!error && localData[0].data.length !== 0 && (
                      <SectionList
                        sections={localData || []}
                        style={{flex: 1}}
                        ref={scrollRef}
                        showsVerticalScrollIndicator={true}
                        indicatorStyle="white"
                        contentContainerStyle={sectionListContentContainer}
                        getItemLayout={onGetItemLayout}
                        keyExtractor={(item, index) => item + index}
                        renderItem={renderItem}
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
                  </>
                )}
                {!loading && error && <EmptyListDashboard isImportAllowed={false} errorTitle={errorText} />}
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
              <TouchableOpacity style={sheetRow} onPress={() => goToScreen('DashStack')}>
                <Text allowFontScaling={false} adjustsFontSizeToFit numberOfLines={1} style={sheetRowText}>
                  Dashboard - Inventory
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

export const DashboardCommunity = Community;
