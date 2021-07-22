import RNProgressHud from 'progress-hud';
import React, {useCallback, useEffect, useState} from 'react';
import {View, StyleSheet, Text, TouchableOpacity, ScrollView, StatusBar} from 'react-native';

import Colors from '../../../constants/colors';
import {getStatusBarHeight} from 'react-native-iphone-x-helper';
import textStyle from '../../../constants/Styles/textStyle';
import {FilterCellView} from '../../../new_components/FilterComponents/FilterCellView';
import {useMutation, useQuery} from '@apollo/react-hooks';
import {FILTERS_LIST} from '../../../apollo/queries/filtersList';
import {timeoutError} from '../../../utils/errorCodes';
import {NavigationEvents, NavigationScreenProp} from 'react-navigation';
import {Routes} from '../../../constants';
import {GET_LOCAL_FILTERS, GET_LOCAL_SUBFILTERS} from '../../../apollo/client/queries';
import {CLEAR_LOCAL_FILTERS, SET_LOCAL_SUB_FILTERS} from '../../../apollo/client/mutations';
import {checkActiveFilters, handleSearchFilters} from '../../../utils/inventory.utils';
import {HeaderWithChevron} from '../../../components/HeaderWithChevron';

interface InventoryProps {
  navigation: NavigationScreenProp<any>;
}

/**
 * All info about this screen you can found here https://cellarventures.atlassian.net/wiki/spaces/CA/pages/50823192/Inventory+filter
 */

const Filter: React.FC<InventoryProps> = ({navigation}) => {
  const filterLevel = navigation.getParam('level', 'inventory');
  const setFilters = navigation.getParam('setFilters', '');
  const [clearDisabled, setClearDisabled] = useState(true);
  const [setSubFilters] = useMutation(SET_LOCAL_SUB_FILTERS);
  const {data: filters, loading, error} = useQuery(FILTERS_LIST, {
    onCompleted: data => {
      setSubFilters({variables: {subFilters: data.filters}});
    },
    fetchPolicy: 'network-only',
  });

  const [filterData, setFilteredData]: any = useState([]);
  const {data: selectedFilters} = useQuery(GET_LOCAL_FILTERS);
  const [clearFilters] = useMutation(CLEAR_LOCAL_FILTERS);
  const {data: localSubFilters} = useQuery(GET_LOCAL_SUBFILTERS);

  useEffect(() => {
    navigation.setParams({
      onSwipeBack: () => {
        handleSearchFilters(selectedFilters, localSubFilters, setFilters, ['inventoryFilters', 'subFilters']);
      },
    });
  }, [selectedFilters, localSubFilters, setFilters]);

  useEffect(() => {
    setFilteredData(filters);
  }, [filters, setFilteredData]);

  useEffect(() => {
    if (error) {
      timeoutError(error);
    }
  }, [error]);

  useEffect(() => {
    if (filters) {
      if (filters.filtersCommunity) {
        setFilteredData(filters.filtersCommunity);
      } else {
        setFilteredData(filters.filters);
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
      setClearDisabled(checkActiveFilters(selectedFilters.inventoryFilters));
    }
  }, [selectedFilters]);

  const handleFilters = title => {
    if (selectedFilters) {
      const activeFilters = selectedFilters.inventoryFilters.filter(el => {
        return el.hasOwnProperty(title);
      });
      return activeFilters.length > 0 ? activeFilters[0][title].length : 0;
    }
  };

  const handleFilterApply = useCallback(async () => {
    handleSearchFilters(selectedFilters, localSubFilters, setFilters, ['inventoryFilters', 'subFilters']);
    //@ts-ignore
    navigation.popToTop();
  }, [selectedFilters, localSubFilters, setFilters]);

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
          customBack={handleFilterApply}
        />

        <ScrollView style={flex1} contentContainerStyle={scrollContentContainerStyle}>
          <FilterCellView
            title={'Producer'}
            count={handleFilters('Producer')}
            onPress={() =>
              navigation.navigate(Routes.filterItemsNewUI.name, {
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
              navigation.navigate(Routes.filterItemsNewUI.name, {
                data: filterData.vintage,
                title: 'Vintage',
              })
            }
          />
          <FilterCellView
            title={'Varietal'}
            count={handleFilters('Varietal')}
            onPress={() =>
              navigation.navigate(Routes.filterItemsNewUI.name, {
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
              navigation.navigate(Routes.filterItemsNewUI.name, {
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
              navigation.navigate(Routes.middleFilter.name, {
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
              navigation.navigate(Routes.middleFilter.name, {
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
              navigation.navigate(Routes.middleFilter.name, {
                subregions: filterData.appellation,
                title: 'Appellation',
                level: filterLevel,
              })
            }
          />

          <FilterCellView
            title={'Cellar Location'}
            count={handleFilters('cellarDesignation')}
            onPress={() =>
              navigation.navigate(Routes.filterItemsNewUI.name, {
                data: filterData.cellarDesignation,
                title: 'cellarDesignation',
              })
            }
          />
        </ScrollView>
      </View>
    </View>
  );
};

export const InventoryFilter = Filter;

export const stylesInventoryFilter = StyleSheet.create({
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
