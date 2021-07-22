import RNProgressHud from 'progress-hud';
import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  StatusBar,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  Platform,
} from 'react-native';
import {getStatusBarHeight} from 'react-native-iphone-x-helper';
import {NavigationEvents} from 'react-navigation';
import {useMutation, useQuery} from '@apollo/react-hooks';
import AsyncStorage from '@react-native-community/async-storage';
import _ from 'lodash';

import Photos from '../../../assets/photos/index';
import {BurgerIcon, ChevronLeftIcon, FilterIcon, SearchIcon} from '../../../assets/svgIcons';
import Colors from '../../../constants/colors';
import Navigation from '../../../types/navigation';

import FilterType from '../../../types/filter';
import {Routes} from '../../../constants';

import {
  InventoryItemProps,
  LoadingFooter,
  InventoryValuation,
  ActiveFiltersList,
  InventoryListItem,
} from '../../../components';
import {GET_LOCAL_INVENTORY_STATE} from '../../../apollo/client/queries';
import {FILTERS_LIST} from '../../../apollo/queries/filtersList';
import {CLEAR_ALL_INV_FILTERS, SET_LOCAL_SUB_FILTERS} from '../../../apollo/client/mutations';
import {handleSearchFilters} from '../../../utils/inventory.utils';
import {SYNC_MESSAGE, FIRST, EMPTY_MESSAGE, LOAD_MORE, INIT} from '../../../constants/inventory';
import {BackgroundGradient, InventoryHeader, InventoryEmptyMessage, SearchBarStyled} from '../../../new_components';
import {usePagination, useDebounce} from '../../../hooks';
import {INVENTORY_SEARCH_QUERY} from '../../../apollo/queries/inventory';

interface InventoryProps {
  navigation: Navigation;
}

/**
 * All info about this screen you can found here https://cellarventures.atlassian.net/wiki/spaces/CA/pages/27262977/Inventory+screen
 */

const Inventory: React.FC<InventoryProps> = ({navigation}) => {
  const {invalidate, setInvalidate, loadingFooter, toggleLoadingFooter, reset: resetPagination} = usePagination();
  const [refresh, setRefresh] = useState(false);

  const [emptyMessage, setEmptyMessage] = useState('');
  const [isDashboard] = useState<any>(navigation.getParam('isDashboard', false));
  const scrollRef = useRef(null);
  const searchRef = useRef(null);
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const [filters, setFilters] = useState<FilterType[]>([]);
  const debouncedSearchTerm = useDebounce(search, 500);

  const {data: invData} = useQuery(GET_LOCAL_INVENTORY_STATE);

  const [clearAllLocalFilters] = useMutation(CLEAR_ALL_INV_FILTERS);
  const [setSubFilters] = useMutation(SET_LOCAL_SUB_FILTERS);

  useQuery(FILTERS_LIST, {
    onCompleted: data => {
      setSubFilters({variables: {subFilters: data.filters}});
      if (isDashboard) {
        invData && handleSearchFilters(invData, invData, setFilters, ['inventoryFilters', 'subFilters']);
      }
    },
  });

  const {data: searchData, fetchMore, loading} = useQuery(INVENTORY_SEARCH_QUERY, {
    variables: {
      first: FIRST,
      filters,
      q: debouncedSearchTerm,
    },
    onCompleted: data => {
      if (data.searchInventoryV3.data.length < FIRST) {
        setInvalidate(false);
        toggleLoadingFooter(false);
      }
      RNProgressHud.dismiss();
      setEmptyMessage('');
    },
    onError: () => {
      RNProgressHud.dismiss();
    },
  });

  // useEffect(() => {
  //   if (filterList) {
  //     setSubFilters({variables: {subFilters: filterList.filters}});
  //     handleSearchFilters(invData, invData, setFilters, ['inventoryFilters', 'subFilters']);
  //   }
  //   console.log('handle search');
  // }, [filterList, invData]);

  useEffect(() => {
    RNProgressHud.show();

    setTimeout(() => {
      RNProgressHud.dismiss();
    }, 5000);
  }, []);

  const handleLoadMore = async () => {
    toggleLoadingFooter(true);

    if (!loading && invalidate) {
      await fetchMore({
        variables: {
          //@ts-ignore
          skip: searchData.searchInventoryV3.data.length,
          marker: LOAD_MORE,
          first: FIRST,
          filters,
          q: debouncedSearchTerm,
        },

        updateQuery: (previousResult, {fetchMoreResult}) => {
          if (fetchMoreResult.searchInventoryV3.data.length < FIRST) {
            setInvalidate(false);
          }

          return {
            ...previousResult,
            searchInventoryV3: {
              data: _.uniqBy([...previousResult.searchInventoryV3.data, ...fetchMoreResult.searchInventoryV3.data], e =>
                [e.wine.id, e.wine.cellarDesignationId].join(),
              ),
            },
          };
        },
      });

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
          filters,
          q: debouncedSearchTerm,
          marker: INIT,
        },
        updateQuery: (__, {fetchMoreResult}) => fetchMoreResult,
      });

      resetPagination();
    } catch (e) {
      setEmptyMessage(e.message);
    } finally {
      setRefresh(false);
      RNProgressHud.dismiss();
    }
  };

  return (
    <View style={container}>
      <NavigationEvents
        onWillFocus={async () => {
          StatusBar.setBarStyle('light-content');
          const syncString = await AsyncStorage.getItem('Inventory');
          setInvalidate(true);
          if (syncString) {
            const sync = JSON.parse(syncString);
            if (sync.sync) {
              RNProgressHud.show();
              scrollRef.current && scrollRef.current.scrollToOffset({x: 0, animated: false});
              await AsyncStorage.setItem('Inventory', JSON.stringify({sync: false}));
              await onRefresh();
            }
          }
        }}
        onDidFocus={() => {
          invData && handleSearchFilters(invData, invData, setFilters, ['inventoryFilters', 'subFilters']);
        }}
      />
      <View style={outerContainer} />
      <ImageBackground source={Photos.inventoryBg} style={bgImage}>
        <BackgroundGradient />
        <View style={burgerContainer}>
          <TouchableOpacity
            style={burgerTouchable}
            onPress={() => {
              if (isDashboard) {
                clearAllLocalFilters();
                navigation.popToTop();
              } else {
                navigation.openDrawer();
              }
            }}>
            {isDashboard ? <ChevronLeftIcon height={20} width={20} /> : <BurgerIcon height={13} width={20} />}
          </TouchableOpacity>
        </View>
        <View style={[filterContainer, {right: 60, backgroundColor: Colors.inventoryItemBg}]}>
          <TouchableOpacity
            style={filterTouchable}
            onPress={() => {
              setSearch('');
              setShowSearch(!showSearch);
              scrollRef.current && scrollRef.current.scrollToOffset({x: 0, animated: true});
            }}>
            <SearchIcon height={25} width={25} />
          </TouchableOpacity>
        </View>
        <View style={filterContainer}>
          <TouchableOpacity
            style={filterTouchable}
            onPress={async () =>
              navigation.navigate(Routes.filter.name, {
                setFilters: async newFilters => {
                  setFilters(newFilters);
                },
              })
            }>
            <FilterIcon height={25} width={25} />
          </TouchableOpacity>
        </View>
        <View style={flex1}>
          {emptyMessage !== '' ? (
            <InventoryEmptyMessage
              isImportAllowed={searchData && searchData.profile.syncWithCellarTrackerIsAllowed}
              emptyMessage={
                searchData && searchData.profile.syncWithCellarTrackerIsAllowed ? SYNC_MESSAGE : emptyMessage
              }
            />
          ) : (
            <FlatList<InventoryItemProps>
              style={flex1}
              keyboardShouldPersistTaps={'handled'}
              indicatorStyle={'white'}
              ref={scrollRef}
              onLayout={() => RNProgressHud.dismiss()}
              ListHeaderComponent={
                emptyMessage === '' && (
                  <>
                    <InventoryHeader />
                    {searchData && !searchData.profile.syncWithCellarTrackerIsAllowed && (
                      <>
                        <InventoryValuation data={searchData.inventoryInfo} />
                        {showSearch && (
                          <SearchBarStyled
                            search={search}
                            onClear={async () => {
                              setSearch('');
                              await onRefresh();
                            }}
                            setSearch={setSearch}
                            ref={searchRef}
                          />
                        )}
                        <ActiveFiltersList variant="inventory" />
                      </>
                    )}
                  </>
                )
              }
              refreshControl={<RefreshControl refreshing={refresh} onRefresh={onRefresh} tintColor={'white'} />}
              contentContainerStyle={flatContentContainerStyle}
              data={searchData && searchData.searchInventoryV3.data}
              maxToRenderPerBatch={FIRST}
              initialNumToRender={FIRST}
              keyboardDismissMode={'on-drag'}
              removeClippedSubviews={false}
              disableVirtualization={true}
              renderItem={({item}) => (
                <InventoryListItem
                  pricePerBottle={item.pricePerBottle}
                  quantity={item.quantity}
                  wine={item.wine}
                  search={search}
                  onItemPress={() =>
                    navigation.navigate(Routes.wineDetailsNewUI.name, {
                      wineId: item.wine.id,
                      color: item.wine.color,
                      pricePerBottle: item.pricePerBottle,
                      wine: item,
                    })
                  }
                  onNavigateToCellar={() => {
                    navigation.navigate(Routes.myCellar.name, {
                      data: {
                        wine: item.wine,
                        quantity: item.quantity,
                      },
                    });
                  }}
                />
              )}
              ListEmptyComponent={
                searchData && (
                  <InventoryEmptyMessage
                    isImportAllowed={searchData.profile.syncWithCellarTrackerIsAllowed}
                    emptyMessage={searchData.profile.syncWithCellarTrackerIsAllowed ? SYNC_MESSAGE : EMPTY_MESSAGE}
                  />
                )
              }
              onEndReachedThreshold={1.0}
              onEndReached={handleLoadMore}
              keyExtractor={(item, index): string => `${index}${item.wine.id}`}
              ListFooterComponent={invalidate && loadingFooter && <LoadingFooter color={'white'} />}
              scrollEnabled={true}
            />
          )}
        </View>
      </ImageBackground>
    </View>
  );
};

export const InventoryNewUIScreen = Inventory;

const stylesMain = StyleSheet.create({
  container: {height: '100%', backgroundColor: 'black'},
  burgerContainer: {
    width: 80,
    backgroundColor: Colors.dashboardRed,
    position: 'absolute',
    zIndex: 3,
  },
  burgerTouchable: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterContainer: {
    width: 60,
    backgroundColor: Colors.orangeDashboard,
    position: 'absolute',
    zIndex: 3,
    right: 0,
  },
  filterTouchable: {
    width: 60,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerContainer: {
    ...Platform.select({
      ios: {height: getStatusBarHeight(true)},
      android: {height: 0},
    }),
    width: '100%',
    backgroundColor: Colors.inventoryItemBg,
  },
  bgImage: {
    height: '100%',
    width: '100%',
  },
  flex1: {flex: 1},
  flatContentContainerStyle: {paddingBottom: 150, flexGrow: 1},
});

const {
  burgerContainer,
  burgerTouchable,
  filterContainer,
  filterTouchable,
  outerContainer,
  container,
  bgImage,
  flex1,
  flatContentContainerStyle,
} = stylesMain;
