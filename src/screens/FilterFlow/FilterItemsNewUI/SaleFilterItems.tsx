import _ from 'lodash';
import React, {useState, useEffect, useCallback, useRef} from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import {useApolloClient, useQuery, useMutation} from '@apollo/react-hooks';

import {LOCAL_FILTERS} from '../../../apollo/queries/localFilters';
import {FilterParams} from '../../../types/filter';
import {FilterObject} from '../../../types/localFilters';
import {setFiltersStore, setSubregionsStore} from '../../../utils/handleLocalFilters';
import Colors from '../../../constants/colors';
import {getStatusBarHeight} from 'react-native-iphone-x-helper';
import {FilterItemNewCell} from '../../../new_components/FilterComponents/FilterItemCell';
import {HeaderFilter} from '../../../new_components/FilterComponents/FilterHeader';
import {SearchBarStyled} from '../../../new_components/CommonComponents/SearchBarNew';
import {GET_LOCAL_SALE_FILTERS} from '../../../apollo/client/queries';
import {ADD_LOCAL_SALE_FILTER, CLEAR_ONE_LOCAL_SALE_FILTER} from '../../../apollo/client/mutations';
import {NavigationScreenProp} from 'react-navigation';
import {AlphabetList} from '../../../components/CommonComponents/AlphbetList';
import {groupStringArrayByFirstLetter, searchStringInArray} from '../../../utils/SearchUtils';
import {UPPER_CASE_ALPHABET} from '../../../constants/text';

interface InventoryProps {
  navigation: NavigationScreenProp<any>;
}

/**
 * All info about this screen you can found here:
 * Vintage: https://cellarventures.atlassian.net/wiki/spaces/CA/pages/50790453/Vintage
 * Varietal: https://cellarventures.atlassian.net/wiki/spaces/CA/pages/50888764/Varietal
 * Country: https://cellarventures.atlassian.net/wiki/spaces/CA/pages/50757699/Country
 */

const FilterList: React.FC<InventoryProps> = ({navigation}) => {
  const client = useApolloClient();
  const {data: localFilters} = useQuery(LOCAL_FILTERS);
  const disableAlphabet = navigation.getParam('alphabet', false);

  // @ts-ignore
  const [initList] = useState<FilterParams[]>(navigation.getParam('data', []));
  const [data, setData] = useState<FilterParams[]>(initList);
  const [selectedArr, setSelected] = useState<number[]>([]);
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [title] = useState(navigation.getParam('title', 'err'));
  const [country] = useState(navigation.getParam('country', 'false'));
  const [search, setSearch] = useState('');
  const searchRef = useRef(null);
  const {data: selectedFilters} = useQuery(GET_LOCAL_SALE_FILTERS);
  const [addLocalFilter] = useMutation(ADD_LOCAL_SALE_FILTER);
  const [selectedList, setSelectedList] = useState([]);
  const [disabledLetters, setDisabledLetters] = useState<string[]>([]);

  const [clearSelection] = useMutation(CLEAR_ONE_LOCAL_SALE_FILTER);

  let [titleFallback, setTitleFallback] = useState(null);

  useEffect(() => {
    if (selectedFilters && selectedFilters.saleFilters.length > 0) {
      let saleFilters = selectedFilters.saleFilters;
      setSelectedList(saleFilters.filter(el => el[title] !== selectedList[title])[0][title]);
    }
  }, [selectedFilters]);

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

  const onSearchChange = useCallback(() => {
    const searchRegexp = new RegExp(search, 'i');
    const searchResult = _.filter(initList, el => searchRegexp.test(el.title));
    setData(searchResult);
  }, [search, initList]);

  useEffect(onSearchChange, [initList, search]);

  useEffect(() => {
    if (title === 'cellarDesignation') {
      setTitleFallback('Cellar Location');
    }
  }, [title]);

  useEffect(() => {
    const keys = Object.keys(groupStringArrayByFirstLetter(initList)[0]);
    setDisabledLetters(UPPER_CASE_ALPHABET.filter(el => !keys.includes(el)));
  }, []);

  useEffect(() => {
    searchStringInArray(initList, search, setData);
  }, [initList, search]);

  return (
    <View style={container}>
      <HeaderFilter
        title={titleFallback || title}
        navigation={navigation}
        clearAll={() =>
          clearSelection({
            variables: {
              title,
            },
          })
        }
        isDisabled={selectedList.length < 1}
        showClear={true}
      />
      <View style={searchContainer}>
        <SearchBarStyled search={search} setSearch={setSearch} ref={searchRef} />
      </View>
      <View style={{flex: 1, position: 'relative'}}>
        {disableAlphabet && (
          <AlphabetList
            onTextChange={section => setSearch(`${section}:`)}
            highlight={true}
            disabledItems={disabledLetters}
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
              onPress={() => {
                addLocalFilter({variables: {filter: item, category: title}});
              }}
              borderStyle={{borderBottomWidth: data.length - 1 === index ? 3 : 0}}
              title={item.title}
            />
          )}
          keyExtractor={(item: FilterObject) => item.title}
          scrollEnabled={true}
        />
      </View>
    </View>
  );
};

export const SaleFilterItems = FilterList;

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
  container: {
    // height: '100%',
    flex: 1,
    backgroundColor: Colors.dashboardDarkTab,
    paddingTop: getStatusBarHeight(true),
  },
  flatContainer: {
    flexGrow: 1,
    paddingBottom: 50,
  },
  searchContainer: {marginVertical: 20},
});

const {flatContainer, container, searchContainer} = stylesMain;
