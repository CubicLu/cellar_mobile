import React, {useEffect, useRef, useState} from 'react';
import {View, StyleSheet, Text, FlatList, StatusBar, LayoutRectangle} from 'react-native';

import Navigation from '../../../types/navigation';
import {useLazyQuery} from '@apollo/react-hooks';
import {WINE_PRODUCERS} from '../../../apollo/queries/wineProducers';
import {FIRST, FIRST_PRODUCERS} from '../../../constants/inventory';
import RNProgressHud from 'progress-hud';
import {useDebounce} from '../../../hooks';
import moment from 'moment';
import Colors from '../../../constants/colors';
import {getStatusBarHeight} from 'react-native-iphone-x-helper';
import {NavigationEvents} from 'react-navigation';
import {HeaderFilter} from '../../FilterComponents/FilterHeader';
import {SearchBarStyled} from '../../CommonComponents/SearchBarNew';
import {FilterItemNewCell} from '../../FilterComponents/FilterItemCell';
import {LoadingFooter, AlphabetList} from '../../../components';

interface InventoryProps {
  navigation: Navigation;
  data: string[];
}

/**
 * All info about this screen you can found here https://cellarventures.atlassian.net/wiki/spaces/CA/pages/50790443/Producer
 */

const ProducerList: React.FC<InventoryProps> = ({navigation}) => {
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
          if (search !== '') {
            if (/^([A-Za-z]|#):/gm.test(search)) {
              invData = data.wineProducers.data;
            } else {
              invData = [{name: search}].concat(data.wineProducers.data);
            }
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
    <View style={container}>
      <NavigationEvents
        onWillFocus={async () => {
          StatusBar.setBarStyle('light-content');
        }}
      />
      <HeaderFilter title={'Producer'} navigation={navigation} showClear={false} />
      <View style={{marginTop: 20, marginBottom: 20}}>
        <SearchBarStyled search={search} setSearch={setSearch} ref={null} />
      </View>

      <View style={{flex: 1, position: 'relative'}}>
        <AlphabetList
          highlight={/^([A-Za-z]|#):/gm.test(search)}
          onTextChange={(letter: string) => setSearch(`${letter}: `)}
        />

        {!errorString && (
          <FlatList
            ref={scrollRef}
            data={searchData}
            style={flatContainer}
            keyboardShouldPersistTaps={'always'}
            contentContainerStyle={{flexGrow: 1, paddingBottom: 50}}
            keyExtractor={(item, index) => index.toString()}
            onEndReachedThreshold={1.0}
            maxToRenderPerBatch={30}
            initialNumToRender={20}
            onEndReached={handleLoadMore}
            disableVirtualization={true}
            ListFooterComponent={loadingFooter && <LoadingFooter />}
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
    </View>
  );
};
export const ProducerListNew = ProducerList;

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
