import RNProgressHud from 'progress-hud';
import React, {useCallback, useEffect, useState} from 'react';
import {View, StyleSheet, Text, TouchableOpacity, ScrollView, StatusBar, Alert} from 'react-native';
import {useMutation, useQuery} from '@apollo/react-hooks';
import {getStatusBarHeight} from 'react-native-iphone-x-helper';
import {NavigationEvents, NavigationScreenProp} from 'react-navigation';

import Colors from '../../../constants/colors';
import textStyle from '../../../constants/Styles/textStyle';
import {FilterCellView} from '../../../new_components';
import {WISHLIST_FILTER_LIST} from '../../../apollo/queries/filtersList';
import {timeoutError} from '../../../utils/errorCodes';
import {Routes} from '../../../constants';
import {GET_LOCAL_WISHLIST_FILTERS} from '../../../apollo/client/queries';

import {checkActiveFilters, handleSearchFilters} from '../../../utils/inventory.utils';
import {HeaderWithChevron} from '../../../components';
import {CLEAR_WISHLIST_LOCAL_FILTERS, SET_WISHLIST_LOCAL_SUB_FILTERS} from '../../../apollo/client/mutations';
import {GET_LOCAL_WISHLIST_SUBFILTERS} from '../../../apollo/client/queries';

interface Props {
  navigation: NavigationScreenProp<any>;
}

/**
 * All info about this screen you can found here https://cellarventures.atlassian.net/wiki/spaces/CA/pages/50823192/Inventory+filter
 */

const Filter: React.FC<Props> = ({navigation}) => {
  const filterLevel = navigation.getParam('level', 'inventory');
  const setFilters = navigation.getParam('setFilters', '');
  const [clearDisabled, setClearDisabled] = useState(true);
  const [setSubFilters] = useMutation(SET_WISHLIST_LOCAL_SUB_FILTERS);
  const {data: filters, loading, error} = useQuery(WISHLIST_FILTER_LIST, {
    onCompleted: data => {
      setSubFilters({variables: {subFilters: data.filtersWishlist}});
    },
    fetchPolicy: 'network-only',
    onError: error => {
      Alert.alert('Failed to load filters', error.message, [{onPress: () => navigation.popToTop()}]);
    },
  });

  const [filterData, setFilteredData]: any = useState([]);
  const [clearFilters] = useMutation(CLEAR_WISHLIST_LOCAL_FILTERS);
  const {data: selectedFilters} = useQuery(GET_LOCAL_WISHLIST_FILTERS);
  const {data: localSubFilters} = useQuery(GET_LOCAL_WISHLIST_SUBFILTERS);

  useEffect(() => {
    navigation.setParams({
      onSwipeBack: () => {
        handleSearchFilters(selectedFilters, localSubFilters, setFilters, ['wishlistFilters', 'wishlistSubFilters']);
      },
    });
  }, [selectedFilters, localSubFilters, setFilters]);

  useEffect(() => {
    if (error) {
      timeoutError(error);
    }
  }, [error]);

  const onPressBack = useCallback(async () => {
    handleSearchFilters(selectedFilters, localSubFilters, setFilters, ['wishlistFilters', 'wishlistSubFilters']);
    navigation.dismiss();
  }, [selectedFilters, localSubFilters, setFilters]);

  useEffect(() => {
    if (filters) {
      if (filters.filtersWishlist) {
        setFilteredData(filters.filtersWishlist);
      }
    }
  }, [filters]);

  useEffect(() => {
    if (loading) {
      RNProgressHud.show();
    } else {
      RNProgressHud.dismiss();
    }
  }, [loading]);

  useEffect(() => {
    if (selectedFilters) {
      //checking is there any active filters if isn't then clear button will be disabled
      setClearDisabled(checkActiveFilters(selectedFilters.wishlistFilters));
    }
  }, [selectedFilters]);

  const handleFilters = title => {
    if (selectedFilters) {
      const activeFilters = selectedFilters.wishlistFilters.filter(el => {
        return el.hasOwnProperty(title);
      });
      return activeFilters.length > 0 ? activeFilters[0][title].length : 0;
    }
  };

  // const handleFilterApply = useCallback(async () => {
  //   handleSearchFilters(selectedFilters, localSubFilters, setFilters, ['wishlistFilters', 'wishlistSubFilters']);
  //   //@ts-ignore
  //   navigation.popToTop();
  // }, [selectedFilters, localSubFilters, setFilters]);

  const handleResetFilters = async () => {
    await clearFilters();
  };

  return (
    <View style={container}>
      {!loading && RNProgressHud.dismiss()}
      <NavigationEvents
        onWillFocus={async () => {
          StatusBar.setBarStyle('light-content');
        }}
      />
      <View style={flex1}>
        <HeaderWithChevron
          title="Filters"
          renderRightButton={() => (
            <TouchableOpacity style={resetBtnContainer} disabled={!clearDisabled} onPress={handleResetFilters}>
              <Text
                allowFontScaling={false}
                numberOfLines={1}
                adjustsFontSizeToFit
                style={[resetBtnText, !clearDisabled && inactiveText]}>
                Clear All
              </Text>
            </TouchableOpacity>
          )}
          customBack={onPressBack}
        />

        <ScrollView style={flex1} contentContainerStyle={scrollContentContainerStyle}>
          <FilterCellView
            title={'Producer'}
            count={handleFilters('Producer')}
            onPress={() =>
              navigation.navigate(Routes.WishlistFilterList.name, {
                data: filterData.producer,
                title: 'Producer',
                alphabet: true,
              })
            }
          />
          <FilterCellView
            title={'Vintage'}
            count={handleFilters('Vintage')}
            onPress={() =>
              navigation.navigate(Routes.WishlistFilterList.name, {
                data: filterData.vintage,
                title: 'Vintage',
              })
            }
          />
          <FilterCellView
            title={'Varietal'}
            count={handleFilters('Varietal')}
            onPress={() =>
              navigation.navigate(Routes.WishlistFilterList.name, {
                data: filterData.varietal,
                title: 'Varietal',
                alphabet: true,
              })
            }
          />
          <FilterCellView
            title={'Country'}
            count={handleFilters('Country')}
            onPress={() =>
              navigation.navigate(Routes.WishlistFilterList.name, {
                data: filterData.country,
                title: 'Country',
                alphabet: true,
              })
            }
          />
          <FilterCellView
            title={'Region'}
            count={handleFilters('Region')}
            onPress={() =>
              navigation.navigate(Routes.WishlistMiddleFilter.name, {
                subregions: filterData.region,
                title: 'Region',
                level: filterLevel,
              })
            }
          />
          <FilterCellView
            title={'Subregion'}
            count={handleFilters('Subregion')}
            onPress={() =>
              navigation.navigate(Routes.WishlistMiddleFilter.name, {
                subregions: filterData.subregion,
                title: 'Subregion',
                level: filterLevel,
              })
            }
          />
          <FilterCellView
            title={'Appellation'}
            count={handleFilters('Appellation')}
            onPress={() =>
              navigation.navigate(Routes.WishlistMiddleFilter.name, {
                subregions: filterData.appellation,
                title: 'Appellation',
                level: filterLevel,
              })
            }
          />
        </ScrollView>
      </View>
    </View>
  );
};

export const WishlistFilter = Filter;

const stylesInventoryFilter = StyleSheet.create({
  container: {height: '100%', backgroundColor: Colors.dashboardDarkTab, paddingTop: getStatusBarHeight(true)},
  flex1: {flex: 1},
  scrollContentContainerStyle: {flexGrow: 1, paddingBottom: 40, paddingTop: 30},
  applyContainer: {
    minHeight: 60,
    width: '80%',
    marginLeft: '10%',
    marginRight: '10%',
    backgroundColor: Colors.orangeDashboard,
    justifyContent: 'center',
    alignItems: 'center',
  },
  applyText: {
    color: 'white',
    ...textStyle.boldText,
    fontSize: 24,
  },
  resetBtnText: {...textStyle.mediumText, fontSize: 18, color: '#fff'},
  resetBtnContainer: {
    paddingHorizontal: 15,
    height: '100%',
    flex: 0,
    justifyContent: 'center',
  },
  inactiveText: {
    color: 'rgba(255,255,255,0.2)',
  },
});

const {
  container,
  resetBtnText,
  resetBtnContainer,
  flex1,
  scrollContentContainerStyle,
  inactiveText,
} = stylesInventoryFilter;
