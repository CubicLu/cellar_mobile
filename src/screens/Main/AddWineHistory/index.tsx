import React, {FC, useState, useEffect} from 'react';
import RNProgressHud from 'progress-hud';
import {View, StyleSheet, SafeAreaView, ImageBackground, FlatList, Text} from 'react-native';
import {useLazyQuery} from '@apollo/react-hooks';
import {NavigationScreenProp} from 'react-navigation';

import {ChartItem, HeaderWithChevron} from '../../../components';
import photo from '../../../assets/photos';
import {BackgroundGradient} from '../../../new_components';
import {GET_WINE_WITH_HISTORY} from '../../../apollo/queries/wine';
import Routes from '../../../constants/navigator-name';
import {renameKeyName} from '../../../utils/other.utils';
import textStyle from '../../../constants/Styles/textStyle';

type Props = {
  navigation: NavigationScreenProp<any>;
};

type HistoryItem = {
  id: number;
  numberOfBottles: number;
  quantity: number;
  wine: {
    id: number;
    wineTitle: string;
  };
};

const AddWineHistory: FC<Props> = ({navigation}) => {
  const month = navigation.state.params.month;
  const [preload, setPreload] = useState(null);
  const addedWines = navigation.state.params.initData.inventoryHistoryWines.data;
  const [total, setTotal] = useState(null);

  const [getWineDetails] = useLazyQuery(GET_WINE_WITH_HISTORY, {
    onCompleted: data => {
      RNProgressHud.dismiss();
      navigation.navigate(Routes.drinkHistoryDetails.name, {
        initData: renameKeyName(data, 'wineV2', 'wine'),
        getWineDetails,
      });
    },
    onError: error => {
      RNProgressHud.dismiss();
      console.log(error.message);
    },
    variables: {
      wineId: preload && preload.wine.id,
    },
    fetchPolicy: 'no-cache',
  });

  useEffect(() => {
    setTotal(
      addedWines &&
        addedWines
          .map(item => item.quantity)
          .reduce((sum, current) => {
            return sum + current;
          }, 0),
    );
  }, [addedWines]);

  return (
    <View style={[flex1, bgBlack]}>
      <SafeAreaView style={flex1}>
        <ImageBackground source={photo.bgAddHistory} style={imageBg}>
          <BackgroundGradient />
          <HeaderWithChevron title={`History: ${month}`} />
          <FlatList<HistoryItem>
            style={listContainer}
            keyExtractor={(item, index) => `${index}`}
            indicatorStyle="white"
            renderItem={({item}) => (
              <ChartItem
                title={item.wine.wineTitle}
                onClick={() => {
                  RNProgressHud.show();
                  setPreload(item);
                  getWineDetails();
                }}
                disablePercentage
                count={item.quantity}
                total={total}
              />
            )}
            data={addedWines}
            ListEmptyComponent={() => (
              <View style={emptyListContainer}>
                <Text style={emptyListText}>No wines in your History, yet</Text>
              </View>
            )}
          />
        </ImageBackground>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  flex1: {flex: 1},
  bgBlack: {backgroundColor: '#000'},
  imageBg: {height: '100%', width: '100%', zIndex: -1},
  listContainer: {paddingHorizontal: 10, paddingTop: 20},
  emptyListContainer: {marginTop: '25%'},
  emptyListText: {...textStyle.mediumText, textAlign: 'center', fontSize: 25, color: '#fff'},
});

const {flex1, imageBg, listContainer, bgBlack, emptyListContainer, emptyListText} = styles;

export const AddWineHistoryScreen = AddWineHistory;
