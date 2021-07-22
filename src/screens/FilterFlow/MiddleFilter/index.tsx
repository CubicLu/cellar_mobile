import React, {useEffect, useState} from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import {useApolloClient, useQuery} from '@apollo/react-hooks';

import {LOCAL_FILTERS} from '../../../apollo/queries/localFilters';
import {Routes} from '../../../constants';
import {FilterObject} from '../../../types/localFilters';
import {resetSubFilters} from '../../../utils/handleLocalFilters';
import Colors from '../../../constants/colors';
import {getStatusBarHeight} from 'react-native-iphone-x-helper';
import {HeaderFilter} from '../../../new_components/FilterComponents/FilterHeader';
import {MiddleFilterItem} from '../../../new_components/FilterComponents/MiddleFilterItem';
import {NavigationScreenProp} from 'react-navigation';

interface InventoryProps {
  navigation: NavigationScreenProp<any>;
}

const MiddleFilter: React.FC<InventoryProps> = ({navigation}) => {
  const client = useApolloClient();
  const [data, setData] = useState([]);
  const [navData] = useState(navigation.getParam('subregions', []));
  const [title] = useState(navigation.getParam('title', []));
  const {data: localFilters} = useQuery(LOCAL_FILTERS);
  const [filterList, setFilterList] = useState([]);

  useEffect(() => {
    if (navData) {
      setData(Object.keys(navData));
    }
  }, [navData]);

  useEffect(() => {
    if (localFilters) {
      setFilterList(JSON.parse(localFilters.listData.list));
    }
  }, [client, localFilters]);

  const handleFilters = country => {
    let filterListByTitle: string[] | undefined = [];
    if (filterList.length) {
      filterList.map((item: FilterObject) => {
        if (item.title === title) {
          if (item.country.title === country) {
            filterListByTitle = item.data.values;
          }
        }
      });
    }
    return filterListByTitle.length;
  };

  return (
    <View style={container}>
      <HeaderFilter
        title={title}
        navigation={navigation}
        clearAll={() => resetSubFilters(title, client, localFilters)}
        isDisabled={!filterList.length}
        showClear={false}
      />
      <View style={flex1}>
        <FlatList
          contentContainerStyle={flatContainer}
          indicatorStyle={'white'}
          style={flex1}
          data={data}
          renderItem={({item}) => (
            <MiddleFilterItem
              name={item}
              onPress={() => {
                const filterLevel = navigation.getParam('level', '');

                filterLevel === 'Community' &&
                  navigation.navigate(Routes.filters.brand, {
                    data: navData[item.toString()],
                    title: title,
                    country: item,
                  });
                filterLevel === 'inventory' &&
                  navigation.navigate(Routes.filterItemsNewUI.name, {
                    data: navData[item.toString()],
                    title: title,
                    country: item,
                  });

                filterLevel === 'Wishlist' &&
                  navigation.navigate(Routes.WishlistFilterList.name, {
                    data: navData[item.toString()],
                    title: title,
                    country: item,
                  });

                filterLevel === 'Sale' &&
                  navigation.navigate(Routes.filters.brand, {
                    data: navData[item.toString()],
                    title: title,
                    country: item,
                  });
              }}
              selectedFilters={handleFilters(item)}
            />
          )}
        />
      </View>
    </View>
  );
};

export const MiddleFilterList = MiddleFilter;

const stylesMain = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: Colors.dashboardDarkTab,
    paddingTop: getStatusBarHeight(true),
  },
  flatContainer: {
    flexGrow: 1,
    paddingBottom: 50,
    paddingTop: 40,
  },
  flex1: {flex: 1},
});

const {container, flatContainer, flex1} = stylesMain;
