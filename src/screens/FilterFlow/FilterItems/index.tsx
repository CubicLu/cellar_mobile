import _ from 'lodash';
import React, {useState, useEffect, useCallback} from 'react';
import {View, StyleSheet, Text, SafeAreaView, Image, TouchableOpacity, FlatList} from 'react-native';
import {useApolloClient, useQuery} from '@apollo/react-hooks';

import Images from '../../../assets/images';
import {LOCAL_FILTERS} from '../../../apollo/queries/localFilters';
import {ClearAll} from '../../../components/FilterComponents/ClearAll';
import {SelectingFilterCell} from '../../../components/FilterComponents/SelectingFilterCell';
import {FilterParams} from '../../../types/filter';
import Navigation from '../../../types/navigation';
import {FilterObject} from '../../../types/localFilters';
import {setFiltersStore, setSubregionsStore} from '../../../utils/handleLocalFilters';

interface InventoryProps {
  navigation: Navigation;
}

const FilterList: React.FC<InventoryProps> = ({navigation}) => {
  const client = useApolloClient();
  const {data: localFilters} = useQuery(LOCAL_FILTERS);
  // @ts-ignore
  const [data] = useState<FilterParams[]>(navigation.getParam('data', []));
  const [selectedArr, setSelected] = useState<number[]>([]);
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [title] = useState(navigation.getParam('title', 'err'));
  const [country] = useState(navigation.getParam('country', 'false'));
  const [, updateState] = useState();
  const forceUpdate = useCallback(() => updateState({}), []);

  useEffect(() => {
    handlingLocalFilters(localFilters, title, navigation, setSelected, setSelectedValues);
  }, [localFilters, navigation, title]);
  useEffect(() => {
    navigation.addListener('willBlur', () => {
      if (country === 'false') {
        setFiltersStore(client, selectedValues, selectedArr, title, localFilters);
      } else {
        setSubregionsStore(country, title, selectedValues, selectedArr, localFilters, client);
      }
    });
  });
  const selectRow = (item, index: number) => {
    if (_.includes(selectedArr, index) || _.includes(selectedValues, item.title)) {
      _.remove(selectedArr, n => {
        return n === index;
      });

      _.remove(selectedValues, n => {
        return n === item.title;
      });
    } else {
      selectedArr.push(index);
      selectedValues.push(item.title);
    }
    forceUpdate();
  };
  const clearAll = () => {
    setSelected([]);
    setSelectedValues([]);
    forceUpdate();
  };

  return (
    <SafeAreaView style={{height: '100%'}}>
      <View style={header}>
        <TouchableOpacity style={touchableStyle} onPress={() => navigation.pop(1)}>
          <Image source={Images.backArrow} style={backArrow} resizeMode={'stretch'} />
        </TouchableOpacity>
        <View style={topBarContent}>
          <Text style={{fontSize: 26}}>{country === 'false' ? title : country}</Text>
        </View>
        <ClearAll onPress={() => clearAll()} disabled={!selectedArr.length} />
      </View>
      <FlatList
        contentContainerStyle={{paddingBottom: 100}}
        style={{
          flex: 1,
          padding: 20,
        }}
        data={data}
        renderItem={({item, index}) => (
          <SelectingFilterCell index={index} item={item} selectedArr={selectedArr} selectRow={selectRow} />
        )}
        keyExtractor={(item: FilterObject) => item.title}
        scrollEnabled={true}
      />
    </SafeAreaView>
  );
};

export const FilterListScreen = FilterList;

const handlingLocalFilters = (localFilters, title, navigation, setSelected, setSelectedValues) => {
  if (localFilters) {
    const data = JSON.parse(localFilters.listData.list);
    if (data.length !== 0) {
      data.map(el => {
        if (el.title === title) {
          if (el.country) {
            if (el.country.title === navigation.getParam('country', 'false')) {
              setSelected(el.country.selectedArr);
              setSelectedValues(el.data.values);
            }
          } else {
            setSelected(el.selectedArr);
            setSelectedValues(el.data.values);
          }
        }
      });
    }
  }
};

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
  backArrow: {
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

const {header, backArrow, topBarContent, touchableStyle} = stylesMain;
