import _ from 'lodash';
import React, {useState, useEffect, useRef} from 'react';
import {View, StyleSheet, SafeAreaView, FlatList} from 'react-native';
import {useQuery, useMutation} from '@apollo/react-hooks';

import {FilterParams} from '../../../types/filter';
import Navigation from '../../../types/navigation';
import Colors from '../../../constants/colors';
import {FilterItemNewCell} from '../../../new_components/FilterComponents/FilterItemCell';
import {HeaderFilter} from '../../../new_components/FilterComponents/FilterHeader';
import {SearchBarStyled} from '../../../new_components/CommonComponents/SearchBarNew';
import {GET_LOCAL_COMMUNITY_FILTERS} from '../../../apollo/client/queries';
import {ADD_COMM_LOCAL_FILTER, CLEAR_ONE_COMM_LOCAL_FILTER} from '../../../apollo/client/mutations';
import {AlphabetList} from '../../../components';
import {UPPER_CASE_ALPHABET} from '../../../constants/text';
import {groupStringArrayByFirstLetter, searchStringInArray} from '../../../utils/SearchUtils';

interface InventoryProps {
  navigation: Navigation;
}

/**
 * All info about this screen you can found here:
 * Vintage: https://cellarventures.atlassian.net/wiki/spaces/CA/pages/50790453/Vintage
 * Varietal: https://cellarventures.atlassian.net/wiki/spaces/CA/pages/50888764/Varietal
 * Country: https://cellarventures.atlassian.net/wiki/spaces/CA/pages/50757699/Country
 */

const FilterList: React.FC<InventoryProps> = ({navigation}) => {
  const initList = navigation.getParam('data', []);
  const disableAlphabet = navigation.getParam('alphabet', false);
  const [data, setData] = useState<FilterParams[]>(initList);
  const [title] = useState(navigation.getParam('title', 'err'));
  const [search, setSearch] = useState('');
  const searchRef = useRef(null);
  const {data: selectedFilters} = useQuery(GET_LOCAL_COMMUNITY_FILTERS);
  const [addLocalFilter] = useMutation(ADD_COMM_LOCAL_FILTER);
  const [selectedList, setSelectedList] = useState([]);
  const [disabledLetters, setDisabledLetters] = useState<string[]>([]);
  const [clearSelection] = useMutation(CLEAR_ONE_COMM_LOCAL_FILTER, {
    variables: {
      title,
    },
  });

  useEffect(() => {
    if (selectedFilters && selectedFilters.communityFilters.length > 0) {
      let inventoryFilters = selectedFilters.communityFilters;
      setSelectedList(inventoryFilters.filter(el => el[title] !== selectedList[title])[0][title]);
    }
  }, [selectedFilters]);

  useEffect(() => {
    const keys = Object.keys(groupStringArrayByFirstLetter(initList)[0]);
    setDisabledLetters(UPPER_CASE_ALPHABET.filter(el => !keys.includes(el)));
  }, []);

  useEffect(() => {
    searchStringInArray(initList, search, setData);
  }, [initList, search]);

  return (
    <View style={{flex: 1}}>
      <SafeAreaView style={container}>
        <HeaderFilter
          title={title}
          navigation={navigation as any}
          clearAll={() => clearSelection()}
          isDisabled={selectedList.length < 1}
          showClear={true}
        />
        <View style={searchContainer}>
          <SearchBarStyled search={search} setSearch={setSearch} ref={searchRef} />
        </View>
        <View style={{flex: 1, position: 'relative'}}>
          {disableAlphabet && (
            <AlphabetList
              disabledItems={disabledLetters}
              onTextChange={section => setSearch(`${section}:`)}
              highlight={/^(\D|#):/i.test(search)}
            />
          )}
          <FlatList
            contentContainerStyle={flatContainer}
            indicatorStyle={'white'}
            style={{flex: 1}}
            //@ts-ignore
            data={data}
            renderItem={({item, index}) => (
              <FilterItemNewCell
                index={index}
                isActive={_.includes(selectedList, item)}
                onPress={() => addLocalFilter({variables: {filter: item, category: title}})}
                borderStyle={{borderBottomWidth: data.length - 1 === index ? 3 : 0}}
                title={item.title}
              />
            )}
            keyExtractor={(item: any) => item.title}
            scrollEnabled={true}
          />
        </View>
      </SafeAreaView>
    </View>
  );
};

export const CommunityFilterItemsNewUI = FilterList;

const stylesMain = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: Colors.dashboardDarkTab,
    // paddingTop: getStatusBarHeight(true),
  },
  flatContainer: {
    flexGrow: 1,
    paddingBottom: 50,
  },
  searchContainer: {marginVertical: 20},
});

const {flatContainer, container, searchContainer} = stylesMain;
