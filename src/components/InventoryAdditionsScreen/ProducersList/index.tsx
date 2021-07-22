import React, {useEffect, useRef, useState} from 'react';
import {View, StyleSheet, Text, SafeAreaView, Image, TouchableOpacity, FlatList} from 'react-native';

import Images from '../../../assets/images';
import Navigation from '../../../types/navigation';
import {SearchBar} from 'react-native-elements';
import {useLazyQuery} from '@apollo/react-hooks';
import {WINE_PRODUCERS} from '../../../apollo/queries/wineProducers';
import {FIRST, FIRST_PRODUCERS} from '../../../constants/inventory';
import {LoadingFooter} from '../../InventoryComponents/LoadingFooter';
import RNProgressHud from 'progress-hud';
import {useDebounce} from '../../../hooks';
import moment from 'moment';

interface InventoryProps {
  navigation: Navigation;
  data: string[];
}

const ProducerList: React.FC<InventoryProps> = ({navigation}) => {
  const isEdit = navigation.getParam('isEdit', false);
  const scrollRef = useRef();
  const [search, setSearch] = useState('');
  const [skip, setSkip] = useState(0);
  const [flag, setFlag] = useState(true);
  const [loadingFooter, setLoadingFooter] = useState(false);
  const [invalidate, setInvalidate] = useState(true);
  const [searchData, setSearchData]: any = useState([]);
  const [firstLoad, setFirstLoad]: any = useState(true);
  const [marker, setMarker] = useState(moment().unix());
  const debouncedSearchTerm = useDebounce(search, 500);
  const [errorString, setErrorString] = useState(null);
  const updateSearch = val => {
    setSearch(val);
  };
  const GET_LIST: any = navigation.getParam('getList', WINE_PRODUCERS);

  const [getList, {data, error}] = useLazyQuery(GET_LIST, {
    fetchPolicy: 'network-only',
  });

  const goBack = name => {
    navigation.goBack();
    navigation.state.params.onSelect(name);
  };
  const handleLoadMore = () => {
    if (flag && !loadingFooter) {
      setLoadingFooter(true);
      setSkip(skip + FIRST_PRODUCERS);
    }
  };

  useEffect(() => {
    if (error) {
      setErrorString(error.message.toString());
      console.log(error.message);
      RNProgressHud.dismiss();
    }
  }, [errorString]);

  useEffect(() => {
    if (data) {
      if (errorString) {
        setErrorString(null);
      }
      if (moment(marker).isBefore(moment(data.marker))) {
        setMarker(data.marker);
        if (data.wineProducers.data.length < FIRST) {
          setFlag(false);
        }
        if (invalidate) {
          let invData;
          if (search !== '' && isEdit) {
            invData = [{name: search}].concat(data.wineProducers.data);
          } else {
            invData = data.wineProducers.data;
          }
          setSearchData(invData);
          setInvalidate(false);
        } else {
          searchData.push(...data.wineProducers.data);
          setSearchData(searchData);
        }
        setLoadingFooter(false);
        setTimeout(() => {
          RNProgressHud.dismiss();
        }, 300);
      }
    }
  }, [data]);

  useEffect(() => {
    if (firstLoad) {
      RNProgressHud.show();
      setFirstLoad(false);
    }
    const reqMarker = moment().unix();
    setMarker(reqMarker);
    const variables = {
      first: FIRST_PRODUCERS,
      skip,
      q: debouncedSearchTerm,
      marker: reqMarker.toString(),
    };
    getList({
      variables,
    });
  }, [debouncedSearchTerm, skip]);

  useEffect(() => {
    setInvalidate(true);
    setFlag(true);
    setSkip(0);
    scrollRef.current && (scrollRef as any).current.scrollToOffset({x: 0, animated: false});
  }, [debouncedSearchTerm]);

  return (
    <SafeAreaView style={{height: '100%'}}>
      <View style={shadowContainer}>
        <View style={header}>
          <TouchableOpacity
            style={touchableStyle}
            onPress={() => {
              navigation.goBack();
            }}>
            <Image source={Images.backArrow} style={backArrow} resizeMode={'stretch'} />
          </TouchableOpacity>
          <View style={topBarContent}>
            <Text style={{fontSize: 26}}>Producer</Text>
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

      {!errorString && (
        <FlatList
          style={flatContainer}
          ref={scrollRef}
          keyboardShouldPersistTaps={'always'}
          keyboardDismissMode={'on-drag'}
          data={searchData}
          contentContainerStyle={{paddingBottom: 100}}
          keyExtractor={(item, index) => index.toString()}
          onEndReachedThreshold={1.0}
          maxToRenderPerBatch={30}
          initialNumToRender={20}
          onEndReached={handleLoadMore}
          disableVirtualization={true}
          ListFooterComponent={loadingFooter && <LoadingFooter />}
          renderItem={({item}: any) => (
            <TouchableOpacity style={cellContainer} onPress={() => goBack(item.name)}>
              <Text numberOfLines={1} style={{fontSize: 22, width: '100%'}}>
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}
      {errorString && (
        <View style={errorContainer}>
          <Text style={{fontSize: 24, marginBottom: 150}}>{errorString}</Text>
        </View>
      )}
    </SafeAreaView>
  );
};
export const ProducerListScreen = ProducerList;
export const stylesListProducers = StyleSheet.create({
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  errorContainer,
} = stylesListProducers;
