import React, {FC, useCallback, useRef, useState} from 'react';
import RNProgressHud from 'progress-hud';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ImageBackground,
  FlatList,
  Alert,
  RefreshControl,
  StatusBar,
  TouchableOpacity,
  Text,
} from 'react-native';
import {useLazyQuery, useQuery} from '@apollo/react-hooks';
import {NavigationEvents, NavigationScreenProp} from 'react-navigation';

import {HistoryHeader, HistoryListEmpty, HistoryListItem, LoadingFooter} from '../../../components';
import photo from '../../../assets/photos';
import {BackgroundGradient, BottomSheetNew} from '../../../new_components';
import {GET_WINE_WITH_HISTORY} from '../../../apollo/queries/wine';
import Routes from '../../../constants/navigator-name';
import {GET_DRINK_HISTORY} from '../../../apollo/queries/wineHistory';
import AsyncStorage from '@react-native-community/async-storage';
import {renameKeyName} from '../../../utils/other.utils';
import {usePagination, useSearch} from '../../../hooks';
import {FIRST} from '../../../constants/inventory';
import textStyle from '../../../constants/Styles/textStyle';

import {BurgerIcon, SearchIcon, HorizontalDotsIcon} from '../../../assets/svgIcons';
import colors from '../../../constants/colors';

type Props = {
  navigation: NavigationScreenProp<any>;
};

type HistoryItem = {
  id: number;
  numberOfBottles: number;
  numberOfNotes: number;
  wine: {
    id: number;
    wineTitle: string;
  };
};

const DrinkHistory: FC<Props> = ({navigation}) => {
  const [preload, setPreload] = useState(null);
  const {search, debouncedSearch, setSearch, isSearchVisible, setIsSearchVisible, clearSearch, searchRef} = useSearch();
  const {invalidate, setInvalidate, loadingFooter, toggleLoadingFooter, reset: resetPagination} = usePagination();
  const [refresh, setRefresh] = useState(false);
  const dashSwitcherRef = useRef(null);
  const scrollRef = useRef<FlatList<HistoryItem>>();

  const {data: drinkHistory, fetchMore, loading} = useQuery(GET_DRINK_HISTORY, {
    onCompleted: data => {
      if (data.allHistory.data.length < FIRST) {
        setInvalidate(false);
        toggleLoadingFooter(false);
      }
    },
    onError: error => {
      Alert.alert('', error.message);
      RNProgressHud.dismiss();
    },
    variables: {
      first: FIRST,
      skip: 0,
      q: debouncedSearch,
    },
  });
  const [getWineDetails] = useLazyQuery(GET_WINE_WITH_HISTORY, {
    onCompleted: data => {
      RNProgressHud.dismiss();
      navigation.navigate(Routes.drinkHistoryDetails.name, {
        initData: renameKeyName(data, 'wineV2', 'wine'),
        getWineDetails,
      });
    },
    onError: error => {
      RNProgressHud.dismiss();
      console.log(error.message);
    },
    variables: {
      wineId: preload && preload.wine.id,
    },
    fetchPolicy: 'no-cache',
  });

  const handleLoadMore = async () => {
    try {
      if (!loading && invalidate) {
        toggleLoadingFooter(true);

        await fetchMore({
          variables: {
            //@ts-ignore
            skip: drinkHistory.allHistory.data.length,
            first: FIRST,
            q: debouncedSearch,
          },

          updateQuery: (previousResult, {fetchMoreResult}) => {
            //@ts-ignore
            if (fetchMoreResult.allHistory.data.length < FIRST) {
              setInvalidate(false);
              toggleLoadingFooter(false);
            }

            return {
              //@ts-ignore
              ...previousResult,
              allHistory: {
                data: [...previousResult.allHistory.data, ...fetchMoreResult.allHistory.data],
              },
            };
          },
        });

        RNProgressHud.dismiss();
      }
    } catch (e) {
      console.debug(e);
    } finally {
      RNProgressHud.dismiss();
    }
  };

  const onRefresh = async (silent: boolean = false) => {
    silent && setRefresh(true);
    setInvalidate(true);

    try {
      await fetchMore({
        variables: {
          //@ts-ignore
          skip: 0,
          first: FIRST,
          q: debouncedSearch,
        },
        updateQuery: (__, {fetchMoreResult}) => fetchMoreResult,
      });

      resetPagination();
    } catch (e) {
      // setEmptyMessage(e.message);
    } finally {
      setRefresh(false);
      toggleLoadingFooter(false);
      RNProgressHud.dismiss();
    }
  };

  const onPressSearch = useCallback(() => {
    setIsSearchVisible(val => !val);
    if (!isSearchVisible) {
      //@ts-ignore
      scrollRef.current && scrollRef.current.scrollToOffset({x: 0, animated: true});
      //@ts-ignore
      searchRef.current && searchRef.current.focus();
    }
  }, [setIsSearchVisible, isSearchVisible, searchRef]);

  const goToScreen = (route: string) => {
    dashSwitcherRef.current.close();
    navigation.navigate(route);
  };

  return (
    <View style={[flex1, bgBlack]}>
      <NavigationEvents
        onWillFocus={async () => {
          const syncString = await AsyncStorage.getItem('DrinkHistory');
          StatusBar.setBarStyle('light-content');
          setInvalidate(true);

          if (syncString) {
            const sync = JSON.parse(syncString);
            if (sync.sync) {
              RNProgressHud.show();
              await AsyncStorage.setItem('DrinkHistory', JSON.stringify({sync: false}));
              await onRefresh();
            }
          }
        }}
      />
      <SafeAreaView style={flex1}>
        <ImageBackground source={photo.inventoryBg} style={imageBg}>
          <BackgroundGradient />

          <TouchableOpacity onPress={() => navigation.openDrawer()} style={burgerContainer}>
            <BurgerIcon width={20} height={13} />
          </TouchableOpacity>

          <TouchableOpacity style={searchIconContainer} onPress={onPressSearch}>
            <SearchIcon height={20} width={20} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[searchIconContainer, dotsIcon]}
            onPress={() => (dashSwitcherRef as any).current.open()}>
            <HorizontalDotsIcon height={20} width={20} />
          </TouchableOpacity>

          <FlatList<HistoryItem>
            style={listContainer}
            ref={scrollRef}
            keyExtractor={(item, index) => `${index}`}
            indicatorStyle="white"
            refreshControl={<RefreshControl refreshing={refresh} onRefresh={onRefresh} tintColor={'#fff'} />}
            data={drinkHistory ? drinkHistory.allHistory.data : []}
            initialNumToRender={FIRST}
            maxToRenderPerBatch={FIRST}
            onEndReached={handleLoadMore}
            ListEmptyComponent={<>{debouncedSearch === '' && <HistoryListEmpty loading={loading} />}</>}
            ListFooterComponent={loadingFooter && invalidate && <LoadingFooter color="#fff" />}
            renderItem={({item}) => (
              <HistoryListItem
                variant="drink-history"
                wine={item.wine}
                onClick={() => {
                  RNProgressHud.show();
                  setPreload(item);
                  getWineDetails();
                }}
                bottleCount={item.numberOfBottles}
                bubbleCount={item.numberOfNotes}
              />
            )}
            ListHeaderComponent={
              <HistoryHeader
                isSearchVisible={isSearchVisible}
                search={search}
                title="History"
                setSearch={setSearch}
                searchRef={searchRef}
                debouncedSearchTerm={debouncedSearch}
                searchLoading={loading}
                onSearchClear={() => {
                  setInvalidate(true);
                  clearSearch();
                }}
              />
            }
          />
          <BottomSheetNew controls={false} sheetContainerBG="transparent" onPressDone={() => {}} ref={dashSwitcherRef}>
            <TouchableOpacity style={sheetRow} onPress={() => goToScreen(Routes.communityDrinkHistory.name)}>
              <Text allowFontScaling={false} adjustsFontSizeToFit numberOfLines={1} style={sheetRowText}>
                Community History
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={sheetRow} onPress={() => goToScreen(Routes.purchaseHistory.name)}>
              <Text allowFontScaling={false} adjustsFontSizeToFit numberOfLines={1} style={sheetRowText}>
                Purchase History
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
        </ImageBackground>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  flex1: {flex: 1},
  bgBlack: {backgroundColor: '#000'},
  imageBg: {height: '100%', width: '100%', zIndex: -1},
  listContainer: {paddingHorizontal: 0, marginTop: 0},
  burgerContainer: {
    backgroundColor: '#64091C',
    position: 'absolute',
    zIndex: 1,
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchIconContainer: {
    position: 'absolute',
    right: 60,
    top: 0,
    zIndex: 1,
    width: 60,
    height: 80,
    backgroundColor: '#0B2E33',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotsIcon: {
    right: 0,
    backgroundColor: colors.orangeDashboard,
  },
  sheetRow: {
    borderWidth: 2,
    borderColor: '#fff',
    paddingVertical: 10,
    backgroundColor: '#000',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  sheetRowText: {
    color: '#fff',
    fontSize: 18,
    ...textStyle.robotoRegular,
    textAlign: 'center',
  },
  sheetCancelText: {
    color: colors.orangeDashboard,
  },
  sheetActiveText: {
    color: colors.orangeDashboard,
  },
});

const {
  flex1,
  imageBg,
  listContainer,
  bgBlack,
  burgerContainer,
  searchIconContainer,
  dotsIcon,
  sheetRowText,
  sheetCancelText,
  sheetRow,
} = styles;

export const DrinkHistoryScreen = DrinkHistory;
