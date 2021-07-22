import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text, SafeAreaView, Image, TouchableOpacity, SectionList} from 'react-native';

import Images from '../../../assets/images';
import Navigation from '../../../types/navigation';
import {allCountries, statesList} from '../../../constants/countries';
import {SearchBar} from 'react-native-elements';

interface InventoryProps {
  navigation: Navigation;
  data: string[];
}

const Location: React.FC<InventoryProps> = ({navigation}) => {
  const [search, setSearch] = useState('');
  const [title] = useState(navigation.getParam('title', 'Country'));
  const [data] = useState(title === 'Country' ? allCountries : statesList);
  const [searchData, setSearchData]: any = useState(data);
  const updateSearch = val => {
    setSearch(val);
  };

  const goBack = name => {
    navigation.goBack();
    navigation.state.params.onSelect(name);
  };

  useEffect(() => {
    setSearchData(filterData(data, search));
  }, [search]);

  return (
    <SafeAreaView style={{height: '100%'}}>
      <View style={shadowContainer}>
        <View style={header}>
          <TouchableOpacity
            style={touchableStyle}
            onPress={() => {
              navigation.popToTop();
            }}>
            <Image source={Images.backArrow} style={backArrow} resizeMode={'stretch'} />
          </TouchableOpacity>
          <View style={topBarContent}>
            <Text style={{fontSize: 26}}>{title}</Text>
          </View>
        </View>
        <View style={filterContainer}>
          <SearchBar
            placeholder={'Search...'}
            onChangeText={updateSearch}
            value={search}
            containerStyle={searchContainer}
            inputContainerStyle={inputContainerStyle}
            inputStyle={{fontSize: 24, color: 'black'}}
            returnKeyType={'search'}
            autoCorrect={false}
            searchIcon={false}
            //@ts-ignore
            clearIcon={{size: 30}}
            autoFocus={false}
            selectionColor={'black'}
          />
        </View>
      </View>

      <SectionList
        sections={searchData}
        style={flatContainer}
        keyboardShouldPersistTaps={'always'}
        keyboardDismissMode={'on-drag'}
        contentContainerStyle={{paddingBottom: 100}}
        keyExtractor={(item, index) => item + index}
        renderItem={({item}: any) => (
          <TouchableOpacity style={cellContainer} onPress={() => goBack(item.name)}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={{fontSize: 22}}>{item.name}</Text>
              <Text style={{fontSize: 20}}>{item.value.toUpperCase()}</Text>
            </View>
          </TouchableOpacity>
        )}
        stickySectionHeadersEnabled={false}
        renderSectionHeader={({section}) => (
          <View style={{marginTop: 10}}>
            <Text style={{fontSize: 24, fontWeight: 'bold'}}>{section.title}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const filterData = (dataList, searchQuery) => {
  return dataList.reduce((result, sectionData) => {
    const {title, data} = sectionData;
    const filteredData = data.filter(
      element =>
        element.name.toLowerCase().match(searchQuery.toLowerCase()) ||
        element.value.toLowerCase().match(searchQuery.toLowerCase()),
    );
    if (filteredData.length !== 0) {
      result.push({
        title,
        data: filteredData,
      });
    }

    return result;
  }, []);
};
export const LocationListProfile = Location;
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
  cellContainer: {
    borderBottomWidth: 1,
    height: 50,
    justifyContent: 'center',
  },
  flatContainer: {
    flex: 1,
    paddingLeft: 20,
    paddingRight: 20,
  },
  searchContainer: {
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    borderBottomWidth: 0,
    paddingLeft: 0,
    paddingRight: 0,
    width: '100%',
  },
  inputContainerStyle: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderRadius: 8,
    borderBottomWidth: 1,
  },
  filterContainer: {
    width: '100%',
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 15,
    paddingRight: 15,
  },
  shadowContainer: {
    width: '100%',
    backgroundColor: 'white',
    shadowOffset: {width: 0, height: 3},
    shadowColor: 'black',
    shadowOpacity: 0.4,
    zIndex: 4,
    elevation: 2,
  },
});

const {
  header,
  backArrow,
  topBarContent,
  touchableStyle,
  cellContainer,
  flatContainer,
  searchContainer,
  inputContainerStyle,
  filterContainer,
  shadowContainer,
} = stylesMain;
