import RNProgressHud from 'progress-hud';
import React, {useState, useEffect} from 'react';
import {Text, StatusBar, View, Alert, ScrollView, StyleSheet} from 'react-native';
import Navigation from '../../../types/navigation';
import Colors from '../../../constants/colors';
import {useLazyQuery} from '@apollo/react-hooks';
import {WINE_HISTORY} from '../../../apollo/queries/wineHistory';
import {Routes} from '../../../constants';
import {WINE} from '../../../apollo/queries/wine';
import {NavigationEvents} from 'react-navigation';
import {getStatusBarHeight} from 'react-native-iphone-x-helper';
import {HeaderFilter} from '../../../new_components/FilterComponents/FilterHeader';
import {stylesWineDetails} from '../../WineDetailsNewUI';
import {WineBody} from '../../../new_components/WineDetailsComponents/WineBody';
import {ActionView} from '../../../new_components/ConsumptionComponents/ActionView';
import textStyle from '../../../constants/Styles/textStyle';
import {HistoryItemNew} from '../../../new_components/ConsumptionComponents/HistoryItem';
import {ImagePreviewer} from '../../../components';
import {renameKeyName} from '../../../utils/other.utils';

interface InventoryProps {
  navigation: Navigation;
}

/**
 * All info about this screen you can found here https://cellarventures.atlassian.net/wiki/spaces/CA/pages/50626661/My+Cellar
 */

const MyCellar: React.FC<InventoryProps> = ({navigation}) => {
  // @ts-ignore
  const [wineInfo] = useState(navigation.getParam('data', {}).wine);
  // @ts-ignore
  const [quantity] = useState(navigation.getParam('data', {}).quantity);
  const [wineHistory, {loading, data: historyData, error}] = useLazyQuery(WINE_HISTORY, {
    fetchPolicy: 'network-only',
  });
  const [getWine, {loading: loadWine, data: wineModel, error: wineError}] = useLazyQuery(WINE, {
    fetchPolicy: 'network-only',
  });
  const [modalActive, setModalActinve] = useState(false);

  useEffect(() => {
    RNProgressHud.show();
    setTimeout(() => {
      wineHistory({variables: {wineId: wineInfo.id}});
      getWine({variables: {wineId: wineInfo.id}});
    }, 300);
  }, [getWine, wineHistory, wineInfo.id]);

  useEffect(() => {
    if (wineError) {
      Alert.alert('Error', wineError.message);
    }
    if (error) {
      Alert.alert('Error', error.message);
    }
  }, [error, loadWine, loading, wineError]);

  const onRefresh = () => {
    RNProgressHud.show();
    getWine({variables: {wineId: wineInfo.id}});
    wineHistory({variables: {wineId: wineInfo.id}});
  };

  const toggleModal = () => setModalActinve(v => !v);

  return (
    <View style={{height: '100%', paddingTop: getStatusBarHeight(true), backgroundColor: Colors.dashboardDarkTab}}>
      {!loadWine && !loading && RNProgressHud.dismiss()}
      <NavigationEvents
        onWillFocus={() => {
          StatusBar.setBarStyle('light-content');
        }}
      />
      <HeaderFilter title={'My Cellar'} navigation={navigation} showClear={false} />
      <View style={{flex: 1}}>
        <ScrollView contentContainerStyle={{flexGrow: 1, paddingBottom: 40}} style={container}>
          <WineBody
            onShowModal={toggleModal}
            color={wineInfo.color}
            wineModel={wineModel && renameKeyName(wineModel, 'wineV2', 'wine')}>
            {wineModel && (
              <>
                <ImagePreviewer
                  imgUri={wineModel.wineV2.wine.pictureURL}
                  isVisible={modalActive}
                  toggleVisibility={toggleModal}
                />

                <View style={styles.verticalLine} />
              </>
            )}
          </WineBody>
          <ActionView
            onPressDrink={() =>
              navigation.navigate(Routes.consumption.name, {
                title: 'Drink wine',
                isDrink: true,
                wineId: wineInfo.id,
                onRefresh,
              })
            }
            onPressAdd={() =>
              navigation.navigate(Routes.consumption.name, {
                title: 'Add to cellar',
                isDrink: false,
                wineId: wineInfo.id,
                onRefresh,
              })
            }
            quantity={wineModel ? wineModel.wineV2.quantity : quantity}
          />

          <View style={{width: '100%', paddingLeft: 20, paddingRight: 20}}>
            {historyData && historyData.wineHistory.length > 0 && (
              <Text style={{...textStyle.mediumText, fontSize: 24, color: 'white', marginBottom: 20}}>History</Text>
            )}
            {historyData && historyData.wineHistory && renderHistory(historyData.wineHistory, navigation, onRefresh)}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  verticalLine: {
    height: '105%',
    width: 50,
    position: 'absolute',
    backgroundColor: '#7C0C07',
    zIndex: -1,
    left: 0,
  },
});

const renderHistory = (history, navigation, onRefresh) => {
  return history.map(el => (
    <HistoryItemNew key={Math.random()} el={el} navigation={navigation} onRefresh={onRefresh} />
  ));
};
export const MyCellarNewScreen = MyCellar;

const {container} = stylesWineDetails;
