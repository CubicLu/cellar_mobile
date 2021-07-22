import React, {FC, useEffect, useRef, useState} from 'react';
import {View, StyleSheet, FlatList, SafeAreaView, RefreshControl} from 'react-native';
import {useQuery} from '@apollo/react-hooks';
import RNProgressHud from 'progress-hud';
import _ from 'lodash';

import {NavigationEvents, NavigationScreenProp} from 'react-navigation';
import {SALE_SEARCH} from '../../../apollo/queries/trading/Sale';
import {ActiveFiltersList, CommunityListItem, HeaderWithFilter, LoadingFooter} from '../../../components';
import {SearchBarStyled} from '../../../new_components';
import {usePagination, useSearch} from '../../../hooks';
import {FIRST, INIT, LOAD_MORE} from '../../../constants/inventory';
import SalesHeader from './SalesHeader';
import EmptyList from './EmptyList';
import {WineType} from '../../../types/wine';
import {Routes} from '../../../constants';
import {handleSearchFilters} from '../../../utils/inventory.utils';
import {GET_LOCAL_SALE_STATE} from '../../../apollo/client/queries';
import FilterType from '../../../types/filter';

type Props = {
  navigation: NavigationScreenProp<any>;
};

const Sales: FC<Props> = ({navigation}) => {
  const {search, debouncedSearch, setSearch, isSearchVisible, setIsSearchVisible, clearSearch, searchRef} = useSearch();
  const {invalidate, setInvalidate, loadingFooter, toggleLoadingFooter, reset: resetPagination} = usePagination();
  const scrollRef = useRef<FlatList<{wine: WineType}>>();

  const [refresh, setRefresh] = useState(false);
  const [filters, setFilters] = useState<FilterType[]>([]);

  const {data: searchData, loading: searchLoading, fetchMore} = useQuery(SALE_SEARCH, {
    variables: {
      skip: 0,
      first: FIRST,
      q: debouncedSearch,
      filters,
    },
    onCompleted: data => {
      if (data.searchCellrSaleWines.data.length < FIRST) {
        setInvalidate(false);
        toggleLoadingFooter(false);
      } else {
        setInvalidate(true);
        toggleLoadingFooter(true);
      }
    },
  });

  const {data} = useQuery(GET_LOCAL_SALE_STATE);

  const handleLoadMore = async () => {
    try {
      if (!searchLoading && invalidate) {
        toggleLoadingFooter(true);

        await fetchMore({
          variables: {
            skip: searchData.searchCellrSaleWines.data.length,
            marker: LOAD_MORE,
            first: FIRST,
            filters,
            q: debouncedSearch,
          },

          updateQuery: (previousResult: any, {fetchMoreResult}) => {
            if (fetchMoreResult.searchCellrSaleWines.data.length < FIRST) {
              setInvalidate(false);
              toggleLoadingFooter(false);
            }

            return {
              ...previousResult,
              searchCellrSaleWines: {
                data: _.uniqBy(
                  [...previousResult.searchCellrSaleWines.data, ...fetchMoreResult.searchCellrSaleWines.data],
                  e => e.wine.id,
                ),
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
          skip: 0,
          first: FIRST,
          filters,
          q: debouncedSearch,
          marker: INIT,
        } as any,
        updateQuery: (__, {fetchMoreResult}) => fetchMoreResult,
      });

      resetPagination();
    } catch (e) {
    } finally {
      setRefresh(false);
      toggleLoadingFooter(false);
      RNProgressHud.dismiss();
    }
  };

  useEffect(() => {
    if (data) {
      handleSearchFilters({saleFilters: data.saleFilters}, {saleSubFilters: data.saleSubFilters}, setFilters, [
        'saleFilters',
        'saleSubFilters',
      ]);
    }
  }, [data]);

  return (
    <View style={container}>
      <NavigationEvents
        onWillFocus={() => {
          // setInvalidate(true);
        }}
      />
      <SafeAreaView style={flex1}>
        <View style={safeContainer}>
          <HeaderWithFilter
            onBurger={() => navigation.openDrawer()}
            onPressFilter={() => navigation.navigate(Routes.SaleFilterScreen.name, {level: 'Sale', setFilters})}
            onPressSearch={() => {
              scrollRef.current.scrollToOffset({animated: true, offset: 0});
              setIsSearchVisible(v => !v);
            }}
          />

          <FlatList<{wine: WineType}>
            ref={scrollRef}
            data={searchData ? searchData.searchCellrSaleWines.data : []}
            contentContainerStyle={flexGrow}
            keyExtractor={item => `${item.wine.id}`}
            indicatorStyle="white"
            renderItem={({item}) => (
              <CommunityListItem
                search={debouncedSearch}
                wine={item as any}
                onItemPress={() =>
                  navigation.navigate(Routes.SaleWineDetails.name, {
                    wineId: item.wine.id,
                    disableEdit: true,
                    showAveragePrice: true,
                  })
                }
              />
            )}
            ListHeaderComponent={
              <>
                <SalesHeader />
                <ActiveFiltersList variant="sale" />
                {isSearchVisible && (
                  <SearchBarStyled
                    search={search}
                    loading={search !== debouncedSearch || searchLoading}
                    onClear={clearSearch}
                    setSearch={setSearch}
                    ref={searchRef}
                  />
                )}
              </>
            }
            refreshControl={<RefreshControl refreshing={refresh} onRefresh={onRefresh} tintColor={'#fff'} />}
            ListFooterComponent={loadingFooter && invalidate && <LoadingFooter color="#fff" />}
            onEndReached={handleLoadMore}
            ListEmptyComponent={<EmptyList loading={loadingFooter && invalidate} />}
          />
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  flex1: {flex: 1},
  container: {flex: 1, backgroundColor: '#000'},
  safeContainer: {flex: 1, position: 'relative'},
  flexGrow: {flexGrow: 1},
});

const {container, flex1, safeContainer, flexGrow} = styles;

export const SalesScreen = Sales;
