import RNProgressHud from 'progress-hud';
import React, {useCallback, useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, ScrollView, StatusBar} from 'react-native';
import {useApolloClient, useMutation, useQuery} from '@apollo/react-hooks';
import {NavigationEvents} from 'react-navigation';

import Navigation from '../../../types/navigation';

import {FilterCellView} from '../../../new_components';
import {timeoutError} from '../../../utils/errorCodes';
import {resetFiltersApollo} from '../../../utils/handleLocalFilters';
import {Routes} from '../../../constants';

import {GET_COMM_LOCAL_SUBFILTERS, GET_LOCAL_COMMUNITY_FILTERS} from '../../../apollo/client/queries';
import {CLEAR_COMM_LOCAL_FILTERS, SET_COMM_LOCAL_SUB_FILTERS} from '../../../apollo/client/mutations';
import {COMMUNITY_FILTERS} from '../../../apollo/queries/communityFilter';
import {LOCAL_FILTERS} from '../../../apollo/queries/localFilters';

import {checkActiveFilters, handleSearchFilters} from '../../../utils/inventory.utils';
import {HeaderWithChevron} from '../../../components';
import {stylesInventoryFilter} from '../InventoryFilter';

interface InventoryProps {
  navigation: Navigation;
}

/**
 * All info about this screen you can found here https://cellarventures.atlassian.net/wiki/spaces/CA/pages/50823192/Inventory+filter
 */

const Filter: React.FC<InventoryProps> = ({navigation}) => {
  const client = useApolloClient();
  const filterLevel = navigation.getParam('level', 'community');
  const {data: filters, loading, error} = useQuery(COMMUNITY_FILTERS, {
    onCompleted: data => setCommunitySubFilters({variables: {subFilters: data.filtersCommunity}}),
  });
  const {data: localFilters} = useQuery(LOCAL_FILTERS);
  const {data: selectedFilters} = useQuery(GET_LOCAL_COMMUNITY_FILTERS);
  const {data: communityLocalSubFilters} = useQuery(GET_COMM_LOCAL_SUBFILTERS);

  const [filterData, setFilteredData]: any = useState([]);
  const [clearFilters] = useMutation(CLEAR_COMM_LOCAL_FILTERS);
  const [setCommunitySubFilters] = useMutation(SET_COMM_LOCAL_SUB_FILTERS);
  const setFilters = navigation.getParam('setFilters', '');
  const [clearDisabled, setClearDisabled] = useState(true);

  useEffect(() => {
    setFilteredData(filters);
  }, [filters, setFilteredData]);
  useEffect(() => {
    if (error) {
      timeoutError(error);
    }
  }, [error]);

  const onPressBack = useCallback(async () => {
    handleSearchFilters(selectedFilters, communityLocalSubFilters, setFilters, [
      'communityFilters',
      'communitySubFilters',
    ]);

    //@ts-ignore
    if (navigation.state.params.isDashboard) {
      navigation.popToTop();
      return;
    }
    navigation.navigate(Routes.communityInventory.name);
  }, [selectedFilters, communityLocalSubFilters, setFilters]);

  const handleResetFilters = async () => {
    await clearFilters();
  };

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
    if (!localFilters) {
      RNProgressHud.show();
      resetFiltersApollo(client);
    }
  }, [client, localFilters]);
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
      setClearDisabled(checkActiveFilters(selectedFilters.communityFilters));
    }
  }, [selectedFilters]);

  const handleFilters = title => {
    if (selectedFilters) {
      const activeFilters = selectedFilters.communityFilters.filter(el => {
        return el.hasOwnProperty(title);
      });
      return activeFilters.length > 0 ? activeFilters[0][title].length : 0;
    }
  };

  useEffect(() => {
    //@ts-ignore
    navigation.setParams({
      onSwipeBack: () => {
        handleSearchFilters(selectedFilters, communityLocalSubFilters, setFilters, [
          'communityFilters',
          'communitySubFilters',
        ]);
      },
    });
  }, [selectedFilters, communityLocalSubFilters, setFilters]);

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
              filterLevel === 'Community' &&
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

export const CommunityFilter = Filter;

const {
  resetBtnText,
  resetBtnContainer,
  container,
  flex1,
  scrollContentContainerStyle,
  inactiveText,
} = stylesInventoryFilter;
