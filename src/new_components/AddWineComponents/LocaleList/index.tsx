import React, {useEffect, useRef, useState} from 'react';
import {View, Text, FlatList, StyleSheet, StatusBar, KeyboardAvoidingView} from 'react-native';
import moment from 'moment';

import Navigation from '../../../types/navigation';
import {useLazyQuery} from '@apollo/react-hooks';
import {FIRST_PRODUCERS} from '../../../constants/inventory';
import RNProgressHud from 'progress-hud';
import {useDebounce} from '../../../hooks';
import {fallbackLocale, LocaleFunctions} from '../../../utils/LocaleUtils';
import {GET_LOCALE_LIST} from '../../../apollo/queries/findLocale';
import {getStatusBarHeight} from 'react-native-iphone-x-helper';
import Colors from '../../../constants/colors';
import {NavigationEvents} from 'react-navigation';
import {HeaderFilter} from '../../FilterComponents/FilterHeader';
import {SearchBarStyled} from '../../CommonComponents/SearchBarNew';
import {FilterItemNewCell} from '../../FilterComponents/FilterItemCell';
import {AddLocationFooter, LoadingFooter} from '../../../components';

interface InventoryProps {
  navigation: Navigation;
}
const LocaleList: React.FC<InventoryProps> = ({navigation}) => {
  const isEdit = navigation.getParam('isEdit', false);
  const scrollRef = useRef();
  const [search, setSearch] = useState('');
  const [skip, setSkip] = useState(0);
  const [flag, setFlag] = useState(true);
  const [showFooter, setShowFooter] = useState(false);
  const [loadingFooter, setLoadingFooter] = useState(false);
  const [invalidate, setInvalidate] = useState(true);
  const [searchData, setSearchData]: any = useState([]);
  const [firstLoad, setFirstLoad]: any = useState(true);
  const [marker, setMarker] = useState(moment().unix());
  const debouncedSearchTerm = useDebounce(search, 500);
  const [errorString, setErrorString] = useState(null);
  const [showInput, setShowInput] = useState(false);
  const [customVal, setCustomVal] = useState<string>('');

  const requestModel: any = navigation.getParam('model', fallbackLocale);

  const [getList, {data, error}] = useLazyQuery(GET_LOCALE_LIST, {
    fetchPolicy: 'no-cache',
    onCompleted: () => setShowFooter(true),
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
    <KeyboardAvoidingView behavior="padding" style={container}>
      <NavigationEvents
        onWillFocus={async () => {
          StatusBar.setBarStyle('light-content');
        }}
      />
      <HeaderFilter title={requestModel.title} navigation={navigation} showClear={false} />
      <View style={{marginTop: 20, marginBottom: 20}}>
        <SearchBarStyled search={search} setSearch={setSearch} ref={null} />
      </View>

      <View style={{flex: 1}}>
        {!errorString && (
          <FlatList
            ref={scrollRef}
            data={Array.from(new Set(searchData))}
            style={flatContainer}
            keyboardShouldPersistTaps={'always'}
            contentContainerStyle={{flexGrow: 1, paddingBottom: 50}}
            keyExtractor={(item, index) => index.toString()}
            onEndReachedThreshold={1.0}
            maxToRenderPerBatch={30}
            initialNumToRender={20}
            keyboardDismissMode="on-drag"
            onEndReached={handleLoadMore}
            disableVirtualization={true}
            ListFooterComponent={
              <>
                {showFooter && (
                  <AddLocationFooter
                    showInput={showInput}
                    toggle={() => setShowInput(v => !v)}
                    customVal={customVal}
                    setCustomVal={val => setCustomVal(val)}
                    addField={() => {
                      setSearchData(sData => [...sData, {name: customVal}]);
                      setCustomVal('');
                      setShowInput(false);
                    }}
                  />
                )}
                {/*{loadingFooter && <LoadingFooter />}*/}
              </>
            }
            renderItem={({item, index}: any) => (
              <FilterItemNewCell
                index={index}
                onPress={() => goBack(item.name)}
                borderStyle={{borderBottomWidth: searchData.length - 1 === index ? 3 : 0}}
                title={item.name}
              />
            )}
          />
        )}

        {errorString && (
          <View style={{flex: 1, alignContent: 'center', justifyContent: 'center'}}>
            <Text style={{fontSize: 24, marginBottom: 150, color: 'white', textAlign: 'center'}}>{errorString}</Text>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};
export const LocaleListScreenNew = LocaleList;

const stylesMain = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: Colors.dashboardDarkTab,
    paddingTop: getStatusBarHeight(true),
  },
  flatContainer: {
    flex: 1,
  },
});

const {flatContainer, container} = stylesMain;
