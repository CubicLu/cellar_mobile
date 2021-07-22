import React, {useEffect, useRef, useState} from 'react';
import {View, StyleSheet, Text, SectionList, TouchableHighlight, StatusBar} from 'react-native';

import Navigation from '../../../types/navigation';
import {allCountries, statesList} from '../../../constants/countries';
import Colors from '../../../constants/colors';
import {getStatusBarHeight} from 'react-native-iphone-x-helper';
import {HeaderFilter} from '../../FilterComponents/FilterHeader';
import {SearchBarStyled} from '../../CommonComponents/SearchBarNew';
import textStyle from '../../../constants/Styles/textStyle';
import {NavigationEvents} from 'react-navigation';

interface InventoryProps {
  navigation: Navigation;
  data: string[];
}

const Location: React.FC<InventoryProps> = ({navigation}) => {
  const [search, setSearch] = useState('');
  const searchRef = useRef();
  const [title] = useState(navigation.getParam('title', 'Country'));
  const [data] = useState(title === 'Country' ? allCountries : statesList);
  const [searchData, setSearchData]: any = useState(data);

  const goBack = name => {
    navigation.goBack();
    navigation.state.params.onSelect(name);
  };

  useEffect(() => {
    if ((searchRef as any).current.props.sections.length > 0) {
      (searchRef as any).current.scrollToLocation({
        sectionIndex: 0,
        itemIndex: 0,
        animated: false,
        viewOffset: 300,
      });
    }
    setSearchData(filterData(data, search));
  }, [search]);

  return (
    <View style={container}>
      <NavigationEvents
        onWillFocus={async () => {
          StatusBar.setBarStyle('light-content');
        }}
      />
      <HeaderFilter title={title} navigation={navigation} showClear={false} />
      <View style={{marginTop: 20, marginBottom: 20}}>
        <SearchBarStyled search={search} setSearch={setSearch} ref={searchRef} />
      </View>

      <View style={{flex: 1}}>
        <SectionList
          ref={searchRef}
          sections={searchData}
          style={flatContainer}
          keyboardShouldPersistTaps={'always'}
          contentContainerStyle={{flexGrow: 1, paddingBottom: 50}}
          keyExtractor={(item, index) => item + index}
          renderItem={({item}: any) => (
            <TouchableHighlight
              underlayColor={Colors.orangeDashboard}
              style={itemContainer}
              onPress={() => goBack(item.name)}>
              <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={itemText}>{item.name}</Text>
                <Text style={itemText}>{item.value.toUpperCase()}</Text>
              </View>
            </TouchableHighlight>
          )}
          stickySectionHeadersEnabled={false}
          renderSectionHeader={({section}) => (
            <View style={itemContainer}>
              <Text style={[itemText, {color: Colors.semiTransWhite}]}>{section.title}</Text>
            </View>
          )}
        />
      </View>
    </View>
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
export const LocationListNewUI = Location;
const stylesMain = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: Colors.dashboardDarkTab,
    paddingTop: getStatusBarHeight(true),
  },
  flatContainer: {
    flex: 1,
  },
  itemContainer: {
    minHeight: 60,
    width: '100%',
    borderTopWidth: 3,
    borderColor: 'white',
    justifyContent: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 5,
    backgroundColor: 'black',
  },
  itemText: {
    ...textStyle.mediumText,
    color: 'white',
    fontSize: 24,
  },
});

const {flatContainer, container, itemContainer, itemText} = stylesMain;
