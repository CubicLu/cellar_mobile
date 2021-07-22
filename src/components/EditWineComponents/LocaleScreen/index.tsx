import React, {useEffect, useRef, useState} from 'react';
import {View, Text, SafeAreaView, Image, TouchableOpacity, FlatList} from 'react-native';

import Images from '../../../assets/images';
import Navigation from '../../../types/navigation';
import {SearchBar} from 'react-native-elements';
import {useLazyQuery} from '@apollo/react-hooks';
import {FIRST_PRODUCERS} from '../../../constants/inventory';
import {LoadingFooter} from '../../InventoryComponents/LoadingFooter';
import RNProgressHud from 'progress-hud';
import {useDebounce} from '../../../hooks';
import moment from 'moment';
import {stylesListProducers} from '../../InventoryAdditionsScreen/ProducersList';
import {fallbackLocale, LocaleFunctions} from '../../../utils/LocaleUtils';
import {GET_LOCALE_LIST} from '../../../apollo/queries/findLocale';

interface InventoryProps {
  navigation: Navigation;
}
const LocaleList: React.FC<InventoryProps> = ({navigation}) => {
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
  const requestModel: any = navigation.getParam('model', fallbackLocale);

  const [getList, {data, error}] = useLazyQuery(GET_LOCALE_LIST, {
    fetchPolicy: 'no-cache',
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
  }, [error]);

  useEffect(() => {
    LocaleFunctions.handleResponse(
      data,
      errorString,
      setErrorString,
      marker,
      setMarker,
      requestModel,
      setFlag,
      invalidate,
      search,
      setSearchData,
      setInvalidate,
      searchData,
      setLoadingFooter,
      isEdit,
    );
  }, [data]);

  useEffect(() => {
    LocaleFunctions.serverLocaleRequest(
      firstLoad,
      setFirstLoad,
      setMarker,
      skip,
      debouncedSearchTerm,
      requestModel,
      getList,
    );
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
            <Text style={{fontSize: 26}}>{requestModel.title}</Text>
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
export const LocaleListScreen = LocaleList;

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
