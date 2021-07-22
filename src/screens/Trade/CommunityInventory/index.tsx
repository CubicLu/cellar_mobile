import RNProgressHud from 'progress-hud';
import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  StatusBar,
  ImageBackground,
  Alert,
} from 'react-native';
import {NavigationEvents} from 'react-navigation';
import {useMutation, useQuery} from '@apollo/react-hooks';

import {
  CommunityInventoryHeader,
  CommunityListItem,
  LoadingFooter,
  EmptyMessage,
  ActiveFiltersList,
} from '../../../components';
import {InventoryItemProps, BackgroundGradient, SearchBarStyled} from '../../../new_components';
import {Routes} from '../../../constants';
import {FIRST, INIT, LOAD_MORE} from '../../../constants/inventory';
import Navigation from '../../../types/navigation';
import FilterType from '../../../types/filter';
import {handleSearchFilters} from '../../../utils/inventory.utils';
import Photos from '../../../assets/photos';
import {BurgerIcon, ChevronLeftIcon, FilterIcon, SearchIcon} from '../../../assets/svgIcons';
import {styles} from './styles';
import {GET_LOCAL_COMM_STATE} from '../../../apollo/client/queries';
import {COMMUNITY_FILTER_LIST} from '../../../apollo/queries/filtersList';
import {RESET_ALL_COMM_LOCAL_FILTERS, SET_COMM_LOCAL_SUB_FILTERS} from '../../../apollo/client/mutations';
import _ from 'lodash';
import {usePagination, useDebounce} from '../../../hooks';
import textStyle from '../../../constants/Styles/textStyle';
import {COMMUNITY_SEARCH_QUERY} from '../../../apollo/queries/community';

interface InventoryProps {
  navigation: Navigation;
}

const {
  wrapper,
  flatStyle,
  burgerContainer,
  burgerTouchable,
  filterContainer,
  filterTouchable,
  searchContainer,
} = styles;

const CommunityInventory: React.FC<InventoryProps> = ({navigation}) => {
  const {invalidate, setInvalidate, loadingFooter, toggleLoadingFooter, reset: resetPagination} = usePagination();

  const isDashboard = navigation.getParam('isDashboard', false);
  const [refresh, setRefresh] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [emptyMessage] = useState('');
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<FilterType[]>([]);
  const [localSearch, setLocalSearch] = useState('');

  const searchRef = useRef(null);
  const scrollRef = useRef(null);

  const debouncedSearchTerm = useDebounce(search, 500);
  const [clearAllLocalFilters] = useMutation(RESET_ALL_COMM_LOCAL_FILTERS);

  const [setSubFilters] = useMutation(SET_COMM_LOCAL_SUB_FILTERS);

  const {
    data: {communityFilters, communitySubFilters},
  } = useQuery(GET_LOCAL_COMM_STATE);

  useQuery(COMMUNITY_FILTER_LIST, {
    onCompleted: data => {
      setSubFilters({variables: {subFilters: data.filtersCommunity}});
      handleSearchFilters({communityFilters}, {communitySubFilters}, setFilters, [
        'communityFilters',
        'communitySubFilters',
      ]);
    },
  });

  const {data: searchData, fetchMore, loading: searchLoading, error: searchError} = useQuery(COMMUNITY_SEARCH_QUERY, {
    variables: {
      first: FIRST,
      filters,
      q: debouncedSearchTerm,
      marker: INIT,
    },
    onCompleted: () => {
      RNProgressHud.dismiss();
      // setEmptyMessage('');
    },
    onError: error => {
      Alert.alert('', error.message);
      toggleLoadingFooter(false);
      RNProgressHud.dismiss();
    },
  });

  const handleLoadMore = async () => {
    try {
      if (!searchLoading && invalidate) {
        toggleLoadingFooter(true);

        await fetchMore({
          variables: {
            //@ts-ignore
            skip: searchData.searchCommunityV3.data.length,

            marker: LOAD_MORE,
            first: FIRST,
            filters,
            q: debouncedSearchTerm,
          },

          updateQuery: (previousResult, {fetchMoreResult}) => {
            if (fetchMoreResult.searchCommunityV3.data.length < FIRST) {
              setInvalidate(false);
              toggleLoadingFooter(false);
            }

            return {
              ...previousResult,
              searchCommunityV3: {
                data: _.uniqBy(
                  [...previousResult.searchCommunityV3.data, ...fetchMoreResult.searchCommunityV3.data],
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
      // setEmptyMessage(e.message);
    } finally {
      setRefresh(false);
      toggleLoadingFooter(false);
      RNProgressHud.dismiss();
    }
  };

  return (
    <SafeAreaView style={wrapper}>
      <NavigationEvents
        onWillFocus={async () => {
          StatusBar.setBarStyle('light-content');
        }}
        onDidFocus={() => {
          setInvalidate(true);
          handleSearchFilters({communityFilters}, {communitySubFilters}, setFilters, [
            'communityFilters',
            'communitySubFilters',
          ]);
        }}
      />
      <ImageBackground
        source={Photos.inventoryBg}
        style={{
          height: '100%',
          width: '100%',
        }}>
        <BackgroundGradient />
        <View style={burgerContainer}>
          <TouchableOpacity
            style={burgerTouchable}
            onPress={async () => {
              if (isDashboard) {
                await clearAllLocalFilters();
                navigation.popToTop();
              } else {
                navigation.openDrawer();
              }
            }}>
            {isDashboard ? <ChevronLeftIcon height={20} width={20} /> : <BurgerIcon height={13} width={20} />}
          </TouchableOpacity>
        </View>
        <View style={[filterContainer, searchContainer]}>
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
            onPress={() => {
              navigation.navigate(Routes.filterNewUI.name, {
                level: 'Community',
                isDashboard,
                setFilters: async newFilters => {
                  setFilters(newFilters);
                },
              });
            }}>
            <FilterIcon height={25} width={25} />
          </TouchableOpacity>
        </View>
        <View style={{flex: 1}}>
          {emptyMessage !== '' ? (
            <EmptyMessage emptyMessage={emptyMessage} />
          ) : (
            <FlatList
              style={flatStyle}
              ref={scrollRef}
              indicatorStyle={'white'}
              ListHeaderComponent={
                <View>
                  <CommunityInventoryHeader />
                  <ActiveFiltersList variant="community" />
                  {showSearch && (
                    <SearchBarStyled
                      search={search}
                      setSearch={setSearch}
                      ref={searchRef}
                      loading={search !== debouncedSearchTerm || searchLoading}
                      onClear={() => {
                        setInvalidate(true);
                        setLocalSearch('');
                        setSearch('');
                      }}
                    />
                  )}
                </View>
              }
              scrollIndicatorInsets={{bottom: 100}}
              refreshControl={<RefreshControl refreshing={refresh} onRefresh={onRefresh} tintColor={'#fff'} />}
              contentContainerStyle={{paddingBottom: 150}}
              data={searchData && searchData.searchCommunityV3.data}
              maxToRenderPerBatch={FIRST}
              initialNumToRender={FIRST}
              disableVirtualization={false}
              renderItem={args => renderListItem(args, localSearch, navigation)}
              ListEmptyComponent={
                searchError && (
                  <View style={{paddingTop: '33%'}}>
                    <Text style={{fontSize: 20, color: '#fff', textAlign: 'center', ...textStyle.mediumText}}>
                      {searchError.message}
                    </Text>
                  </View>
                )
              }
              onEndReachedThreshold={1.0}
              onEndReached={handleLoadMore}
              keyExtractor={(item: InventoryItemProps): string => item.wine.id.toString()}
              ListFooterComponent={loadingFooter && <LoadingFooter color="#fff" />}
              scrollEnabled={true}
            />
          )}
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

function renderListItem({item}, localSearch, navigation) {
  return (
    <CommunityListItem
      wine={item}
      search={localSearch}
      onItemPress={() =>
        navigation.navigate(Routes.wineDetailsNewUI.name, {
          wineId: item.wine.id,
          disableEdit: true,
          showAveragePrice: true,
        })
      }
    />
  );
}

export const CommunityInventoryScreen = CommunityInventory;
