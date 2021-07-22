import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text, SafeAreaView, Image, TouchableOpacity, FlatList} from 'react-native';
import {useApolloClient, useQuery} from '@apollo/react-hooks';

import {LOCAL_FILTERS} from '../../../apollo/queries/localFilters';
import Images from '../../../assets/images';
import {ClearAll} from '../../../components/FilterComponents/ClearAll';
import {FilterCell} from '../../../components/FilterComponents/FilterCell';
import {Routes} from '../../../constants';
import {FilterObject} from '../../../types/localFilters';
import Navigation from '../../../types/navigation';
import {resetSubFilters} from '../../../utils/handleLocalFilters';
import {capitalizeWord} from '../../../utils/other.utils';

interface InventoryProps {
  navigation: Navigation;
}

const Subregion: React.FC<InventoryProps> = ({navigation}) => {
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
    return filterListByTitle;
  };

  return (
    <SafeAreaView style={{height: '100%'}}>
      <View style={header}>
        <TouchableOpacity style={touchableStyle} onPress={() => navigation.goBack()}>
          <Image source={Images.backArrow} style={[burgerIcon]} resizeMode={'stretch'} />
        </TouchableOpacity>
        <View style={topBarContent}>
          <Text style={{fontSize: 26}}>{title}</Text>
        </View>
        <ClearAll onPress={() => resetSubFilters(title, client, localFilters)} disabled={!filterList.length} />
      </View>

      <FlatList
        contentContainerStyle={{paddingBottom: 100}}
        style={{padding: 20}}
        data={data}
        renderItem={({item}) => (
          <FilterCell
            name={capitalizeWord(item)}
            onPress={() => {
              navigation.navigate(Routes.filterItemsNewUI.name, {
                data: navData[item.toString()],
                title: title,
                country: item,
              });
            }}
            selectedFilters={handleFilters(item)}
          />
        )}
        keyExtractor={(item: FilterObject) => item.title}
        scrollEnabled={true}
      />
    </SafeAreaView>
  );
};

export const SubregionList = Subregion;

const stylesMain = StyleSheet.create({
  header: {
    height: 80,
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'white',
    shadowOffset: {width: 0, height: 3},
    shadowColor: 'black',
    shadowOpacity: 0.4,
  },
  burgerIcon: {
    width: 30,
    height: 30,
  },
  topBarContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 40,
    alignItems: 'center',
  },
  touchableStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    width: 60,
  },
});

const {header, burgerIcon, topBarContent, touchableStyle} = stylesMain;
