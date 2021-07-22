import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  StatusBar,
  FlatList,
  TouchableHighlight,
} from 'react-native';

import Images from '../../../assets/images';
import Navigation from '../../../types/navigation';
import Colors from '../../../constants/colors';
import {NOT_LISTED} from '../../../constants/countries';

interface InventoryProps {
  navigation: Navigation;
  data: string[];
}

const Countries: React.FC<InventoryProps> = ({navigation}) => {
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
    <SafeAreaView style={{height: '100%'}}>
      <View style={header}>
        <TouchableOpacity
          style={touchableStyle}
          onPress={() => {
            navigation.goBack();
          }}>
          <Image source={Images.backArrow} style={backArrow} resizeMode={'stretch'} />
        </TouchableOpacity>
        <View style={topBarContent}>
          <Text style={{fontSize: 26}}>{navigation.getParam('title', 'Country')}</Text>
        </View>
      </View>
      <FlatList
        contentContainerStyle={{paddingBottom: 100}}
        style={flatContainer}
        data={data}
        renderItem={({item}: any) => (
          <TouchableHighlight
            activeOpacity={1}
            underlayColor={Colors.lightGray}
            style={cellContainer}
            onPress={() => goBack(item)}>
            <Text style={{fontSize: 24}}>{item}</Text>
          </TouchableHighlight>
        )}
        keyExtractor={(item, index) => index.toString()}
        scrollEnabled={true}
      />
    </SafeAreaView>
  );
};

export const CountriesAddition = Countries;

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
    height: 60,
    justifyContent: 'center',
  },
  flatContainer: {
    flex: 1,
    padding: 20,
  },
});

const {header, backArrow, topBarContent, touchableStyle, cellContainer, flatContainer} = stylesMain;
