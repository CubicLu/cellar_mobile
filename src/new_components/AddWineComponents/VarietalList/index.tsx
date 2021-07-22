import React, {useState, useEffect} from 'react';
import {View, StyleSheet, FlatList} from 'react-native';

import Navigation from '../../../types/navigation';
import Colors from '../../../constants/colors';
import {NOT_LISTED} from '../../../constants/countries';
import {getStatusBarHeight} from 'react-native-iphone-x-helper';
import {HeaderFilter} from '../../FilterComponents/FilterHeader';
import {FilterItemNewCell} from '../../FilterComponents/FilterItemCell';

interface InventoryProps {
  navigation: Navigation;
  data: string[];
}

const Varietal: React.FC<InventoryProps> = ({navigation}) => {
  const [data, setData]: any = useState([]);
  const goBack = name => {
    navigation.goBack();
    navigation.state.params.onSelect(name);
  };
  useEffect(() => {
    const navData = navigation.getParam('data', false);
    if (navData) {
      setData(navData.concat(NOT_LISTED));
    }
  }, [navigation]);
  return (
    <View style={container}>
      <HeaderFilter title={'Varietal'} navigation={navigation} showClear={false} />

      <View style={{flex: 1, marginTop: 20}}>
        <FlatList
          data={data}
          style={flatContainer}
          keyboardShouldPersistTaps={'always'}
          contentContainerStyle={{flexGrow: 1, paddingBottom: 50}}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item, index}: any) => (
            <FilterItemNewCell
              index={index}
              onPress={() => goBack(item)}
              selectedArr={[]}
              borderStyle={{borderBottomWidth: data.length - 1 === index ? 3 : 0}}
              title={item}
            />
          )}
        />
      </View>
    </View>
  );
};

export const VarietalList = Varietal;

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
