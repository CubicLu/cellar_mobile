import RNProgressHud from 'progress-hud';
import React, {useCallback, useEffect, useState} from 'react';
import {View, StyleSheet, Text, TouchableOpacity, ScrollView, StatusBar, Alert} from 'react-native';
import {useMutation, useQuery} from '@apollo/react-hooks';
import {getStatusBarHeight} from 'react-native-iphone-x-helper';
import {NavigationEvents, NavigationScreenProp} from 'react-navigation';

import Colors from '../../../constants/colors';
import textStyle from '../../../constants/Styles/textStyle';
import {FilterCellView} from '../../../new_components';
import {timeoutError} from '../../../utils/errorCodes';
import {Routes} from '../../../constants';

import {checkActiveFilters, handleSearchFilters} from '../../../utils/inventory.utils';
import {HeaderWithChevron} from '../../../components';
import {CLEAR_SALE_LOCAL_FILTERS, SET_SALE_LOCAL_SUB_FILTERS} from '../../../apollo/client/mutations';
import {GET_LOCAL_SALE_STATE} from '../../../apollo/client/queries';
import {SALE_FILTERS} from '../../../apollo/queries/trading/Sale';

interface Props {
  navigation: NavigationScreenProp<any>;
}

/**
 * All info about this screen you can found here https://cellarventures.atlassian.net/wiki/spaces/CA/pages/50823192/Inventory+filter
 */

const Filter: React.FC<Props> = ({navigation}) => {
  const filterLevel = navigation.getParam('level');
  const setFilters = navigation.getParam('setFilters', '');
  const [clearDisabled, setClearDisabled] = useState(true);
  const [setSubFilters] = useMutation(SET_SALE_LOCAL_SUB_FILTERS);

  const {data: filters, loading, error} = useQuery(SALE_FILTERS, {
    onCompleted: data => {
      setSubFilters({variables: {subFilters: data.filtersCellrSaleWines}});
    },
    fetchPolicy: 'network-only',
    onError: err => {
      Alert.alert('Failed to load filters', err.message, [{onPress: () => navigation.goBack()}]);
    },
  });

  const [filterData, setFilteredData]: any = useState([]);
  const [clearFilters] = useMutation(CLEAR_SALE_LOCAL_FILTERS);
  const {data: saleState} = useQuery(GET_LOCAL_SALE_STATE);

  useEffect(() => {
    navigation.setParams({
      onSwipeBack: () => {
        handleSearchFilters(
          {saleFilters: saleState.saleFilters},
          {saleSubFilters: saleState.saleSubFilters},
          setFilters,
          ['saleFilters', 'saleSubFilters'],
        );
      },
    });
  }, [saleState]);

  useEffect(() => {
    if (error) {
      timeoutError(error);
    }
  }, [error]);

  const onPressBack = useCallback(async () => {
    if (saleState) {
      handleSearchFilters(
        {saleFilters: saleState.saleFilters},
        {saleSubFilters: saleState.saleSubFilters},
        setFilters,
        ['saleFilters', 'saleSubFilters'],
      );
      navigation.goBack();
    }
  }, [saleState]);

  useEffect(() => {
    if (filters) {
      if (filters.filtersCellrSaleWines) {
        setFilteredData(filters.filtersCellrSaleWines);
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
    if (saleState) {
      //checking is there any active filters if isn't then clear button will be disabled
      setClearDisabled(checkActiveFilters(saleState.saleFilters));
    }
  }, [saleState]);

  const handleFilters = title => {
    if (saleState) {
      const activeFilters = saleState.saleFilters.filter(el => {
        return el.hasOwnProperty(title);
      });
      return activeFilters.length > 0 ? activeFilters[0][title].length : 0;
    }
  };

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
              navigation.navigate(Routes.filters.brand, {
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
              navigation.navigate(Routes.filters.brand, {
                data: filterData.vintage,
                title: 'Vintage',
              })
            }
          />
          <FilterCellView
            title={'Varietal'}
            count={handleFilters('Varietal')}
            onPress={() =>
              navigation.navigate(Routes.filters.brand, {
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
              navigation.navigate(Routes.filters.brand, {
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
              navigation.navigate(Routes.subregion.name, {
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
              navigation.navigate(Routes.subregion.name, {
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
              navigation.navigate(Routes.subregion.name, {
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

export const SaleFilter = Filter;

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
