import RNProgressHud from 'progress-hud';
import React, {useEffect, useState, useRef} from 'react';
import {View, StyleSheet, SafeAreaView, FlatList, RefreshControl, StatusBar, ImageBackground} from 'react-native';
import {NavigationEvents} from 'react-navigation';
import {useQuery} from '@apollo/react-hooks';
import AsyncStorage from '@react-native-community/async-storage';
import _ from 'lodash';

import {WISHLIST_SEARCH_QUERY} from '../../../apollo/queries/wishlist';

import {timeoutError} from '../../../utils/errorCodes';
import Navigation from '../../../types/navigation';
import {FIRST} from '../../../constants/inventory';
import {Routes} from '../../../constants';
import Photos from '../../../assets/photos';

import {
  WishlistItem,
  WishlistEmpty,
  WishlistHeader,
  LoadingFooter,
  HeaderWithFilter,
  ActiveFiltersList,
} from '../../../components';
import {BackgroundGradient, SearchBarStyled} from '../../../new_components';
import Colors from '../../../constants/colors';
import {usePagination, useSearch} from '../../../hooks';
import FilterType from '../../../types/filter';
import {handleSearchFilters} from '../../../utils/inventory.utils';
import {GET_LOCAL_WISHLIST_FILTERS, GET_LOCAL_WISHLIST_SUBFILTERS} from '../../../apollo/client/queries';
import {useNetInfo} from '@react-native-community/netinfo';

interface InventoryProps {
  navigation: Navigation;
}

/**
 * All info about this screen you can found here https://cellarventures.atlassian.net/wiki/spaces/CA/pages/27459592/Wishlist
 */

const Wishlist: React.FC<InventoryProps> = ({navigation}) => {
  const {
    incrementSkip,
    invalidate,
    setInvalidate,
    loadingFooter,
    toggleLoadingFooter,
    reset: resetPagination,
    skip,
  } = usePagination();

  const netInfo = useNetInfo();

  const [refresh, setRefresh] = useState(false);
  const [isDashboard] = useState(navigation.getParam('isDashboard', false));
  const scrollRef = useRef(null);
  const [errorMessage, setErrorMessage] = useState('');
  const {search, debouncedSearch, setSearch, isSearchVisible, setIsSearchVisible, clearSearch, searchRef} = useSearch();
  const [filters, setFilters] = useState<FilterType[]>([]);
  const {data: selectedFilters} = useQuery(GET_LOCAL_WISHLIST_FILTERS);
  const {data: localSubFilters} = useQuery(GET_LOCAL_WISHLIST_SUBFILTERS);

  const {data: searchData, fetchMore, loading, error} = useQuery(WISHLIST_SEARCH_QUERY, {
    onCompleted: data => {
      data.searchWishlist.wishList.length < FIRST && setInvalidate(false);
      setErrorMessage('');
    },
    variables: {
      first: FIRST,
      q: debouncedSearch,
      filters,
    },
  });

  useEffect(() => {
    if (error && netInfo.isInternetReachable) {
      onRefresh();
    }
  }, [error, netInfo]);

  const handleLoadMore = async () => {
    incrementSkip(25);

    if (!loading && loadingFooter && invalidate) {
      await fetchMore({
        variables: {skip: skip + FIRST},

        updateQuery: (previousResult: any, {fetchMoreResult}: any) => {
          if (fetchMoreResult.searchWishlist.wishList.length < FIRST) {
            setInvalidate(false);
          }

          return {
            ...previousResult,
            searchWishlist: {
              wishList: _.uniqBy(
                [...previousResult.searchWishlist.wishList, ...fetchMoreResult.searchWishlist.wishList],
                'id',
              ),
            },
          };
        },
      });
      toggleLoadingFooter();
    }
  };

  useEffect(() => {
    if (error) {
      setErrorMessage(error.message.toString());
      timeoutError(error);
    }
  }, [error, loading]);

  const onRefresh = async (silent: boolean = false) => {
    silent && setRefresh(true);
    try {
      await fetchMore({
        variables: {
          skip: 0,
          first: 25,
        },
        updateQuery: (__, {fetchMoreResult}) => fetchMoreResult,
      });

      resetPagination();
    } catch (e) {
      console.debug(e);
    } finally {
      setRefresh(false);
      RNProgressHud.dismiss();
    }
  };

  return (
    <SafeAreaView style={safeView}>
      <View style={relativeContainer}>
        <NavigationEvents
          onWillFocus={async () => {
            StatusBar.setBarStyle('light-content');
            const syncString = await AsyncStorage.getItem('Wishlist');
            setInvalidate(true);

            handleSearchFilters(selectedFilters, localSubFilters, setFilters, [
              'wishlistFilters',
              'wishlistSubFilters',
            ]);

            if (syncString) {
              const sync = JSON.parse(syncString);
              if (sync.sync) {
                RNProgressHud.show();
                await onRefresh(true);
                if (scrollRef) {
                  scrollRef.current && scrollRef.current.scrollToOffset({x: 0, animated: false});
                }
                await AsyncStorage.setItem('Wishlist', JSON.stringify({sync: false}));
              }
            }
          }}
        />

        <ImageBackground source={Photos.bgWishlist} style={bgImage}>
          <BackgroundGradient />

          <View style={flex1}>
            <HeaderWithFilter
              chevron={isDashboard}
              onPressFilter={() =>
                navigation.navigate(Routes.WishlistFilters.name, {
                  level: 'Wishlist',
                  setFilters: async newFilters => {
                    setFilters(newFilters);
                  },
                })
              }
              onPressSearch={() => setIsSearchVisible(v => !v)}
              onBurger={() => {
                if (isDashboard) {
                  navigation.popToTop();
                } else {
                  navigation.openDrawer();
                }
              }}
            />

            {!error ? (
              <FlatList
                style={flex1}
                ref={scrollRef}
                indicatorStyle={'white'}
                ListHeaderComponent={
                  <>
                    <WishlistHeader count={searchData && searchData.searchWishlist.countOfWinesInWishList} />
                    <ActiveFiltersList variant="wishlist" />

                    {isSearchVisible && (
                      <SearchBarStyled
                        search={search}
                        onClear={() => {
                          setInvalidate(true);
                          clearSearch();
                        }}
                        loading={loading}
                        setSearch={setSearch}
                        ref={searchRef}
                      />
                    )}
                  </>
                }
                refreshControl={<RefreshControl refreshing={refresh} tintColor={'#fff'} onRefresh={onRefresh} />}
                contentContainerStyle={{paddingBottom: 150}}
                data={searchData && searchData.searchWishlist.wishList}
                ListEmptyComponent={() =>
                  refresh || (!loading && (searchData && searchData.searchWishlist.wishList.length === 0)) ? (
                    <WishlistEmpty errorMessage={''} />
                  ) : (
                    <View />
                  )
                }
                maxToRenderPerBatch={FIRST}
                disableVirtualization={true}
                initialNumToRender={FIRST}
                onEndReachedThreshold={1.0}
                onEndReached={handleLoadMore}
                // @ts-ignore
                renderItem={({item}) => (
                  <WishlistItem
                    item={item}
                    onItemPress={() =>
                      navigation.navigate(Routes.wineDetailsNewUI.name, {
                        wineId: item.id,
                        disableEdit: true,
                        expectedPrice: item.expectedPrice,
                      })
                    }
                  />
                )}
                keyExtractor={(item: any): string => `${item.id}`}
                ListFooterComponent={invalidate && loadingFooter && <LoadingFooter color="#fff" />}
                scrollEnabled={true}
              />
            ) : (
              !loading && <WishlistEmpty errorMessage={errorMessage} />
            )}
          </View>
        </ImageBackground>
      </View>
    </SafeAreaView>
  );
};

export const WishlistScreen = Wishlist;

const styles = StyleSheet.create({
  safeView: {
    height: '110%',
    backgroundColor: '#000',
  },
  relativeContainer: {
    flex: 1,
    position: 'relative',
  },
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
  bgImage: {
    height: '100%',
    width: '100%',
  },
  flex1: {
    flex: 1,
  },
});

const {safeView, flex1, bgImage, relativeContainer} = styles;
