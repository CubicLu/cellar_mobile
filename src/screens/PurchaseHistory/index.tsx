import React, {FC, useEffect, useState, useRef} from 'react';
import RNProgressHud from 'progress-hud';
import {View, StyleSheet, SafeAreaView, ImageBackground, Alert, Text, TouchableOpacity} from 'react-native';
import {useLazyQuery} from '@apollo/react-hooks';
import {NavigationScreenProp, withNavigation, SectionList} from 'react-navigation';

import {ChartItem, HistoryListEmpty, HeaderWithBurger} from '../../components';
import photo from '../../assets/photos';
import {BackgroundGradient, BottomSheetNew} from '../../new_components';
import Routes from '../../constants/navigator-name';
import {GET_MONTH_HISTORY, GET_PURCHASE_HISTORY} from '../../apollo/queries/wineHistory';
import textStyle from '../../constants/Styles/textStyle';
import colors from '../../constants/colors';
import moment from 'moment';
import {HorizontalDotsIcon} from '../../assets/svgIcons';

type Props = {
  navigation: NavigationScreenProp<any>;
};

const PurchaseHistory: FC<Props> = ({navigation}) => {
  const [preload, setPreload] = useState('');
  const [total, setTotal] = useState(null);
  const [filtredData, setFiltredData] = useState(null);
  const dashSwitcherRef = useRef(null);

  const [initPurchaseHistory, {data: purchaseHistory, loading}] = useLazyQuery(GET_PURCHASE_HISTORY, {
    fetchPolicy: 'network-only',
    onCompleted: data => {
      RNProgressHud.dismiss();
      setTotal(
        data.inventoryHistoryInfo.data
          .map(item => item.quantity)
          .reduce((sum, current) => {
            return sum + current;
          }, 0),
      );
      getUniqueYears(data.inventoryHistoryInfo.data);
    },
    onError: error => {
      Alert.alert('', error.message);
      RNProgressHud.dismiss();
    },
  });

  const getUniqueYears = data => {
    const allYears = data.map(item => {
      return moment.utc(item.date).get('year');
    });

    const filteredYear = allYears.filter((item, n) => !allYears.includes(item, n + 1));

    const collectList = filteredYear.map(year => ({
      year,
      data: data.filter(item => moment.utc(item.date).get('year') === year),
    }));
    setFiltredData(collectList);
  };

  function onLoadHistory() {
    if (!purchaseHistory) {
      RNProgressHud.show();
    }
    initPurchaseHistory();
  }

  useEffect(onLoadHistory, []);

  const [getWineMonth] = useLazyQuery(GET_MONTH_HISTORY, {
    fetchPolicy: 'no-cache',
    variables: {
      startAt: preload,
      stopAt: moment(
        new Date(new Date(preload).setFullYear(new Date(preload).getFullYear())).setMonth(
          new Date(preload).getMonth() + 1,
        ),
      ).format(),
      //.format() - convert to iso
      //setMonth doesn't work with default iso format.
      //To do this, convert through new Date and then back using moment and format
    },
    onCompleted: data => {
      RNProgressHud.dismiss();
      navigation.navigate(Routes.addWineHistory.name, {
        initData: data,
        month: moment.utc(preload).format('MMMM'),
        getWineMonth,
      });
    },
    onError: error => {
      RNProgressHud.dismiss();
      console.log(error.message);
    },
  });
  const goToScreen = (route: string) => {
    dashSwitcherRef.current.close();
    navigation.navigate(route);
  };

  return (
    <View style={[flex1, bgBlack]}>
      <SafeAreaView style={flex1}>
        <ImageBackground source={photo.bgAddHistory} style={imageBg}>
          <BackgroundGradient />

          <TouchableOpacity style={dotsIcon} onPress={() => (dashSwitcherRef as any).current.open()}>
            <HorizontalDotsIcon height={20} width={20} />
          </TouchableOpacity>

          <HeaderWithBurger text="Purchase History" titleContainerStyle={{paddingRight: 60}} />
          <SectionList
            sections={filtredData}
            style={listContainer}
            keyExtractor={(item, index) => `${index}`}
            indicatorStyle="white"
            stickySectionHeadersEnabled={false}
            renderSectionHeader={({section}) => <Text style={sectionHeader}>{section.year}</Text>}
            renderItem={({item}) => (
              <ChartItem
                title={moment.utc(item.date).format('MMMM')}
                disablePercentage
                onClick={() => {
                  RNProgressHud.show();
                  setPreload(item.date);
                  getWineMonth();
                }}
                total={total}
                count={item.quantity}
              />
            )}
            ListEmptyComponent={<HistoryListEmpty loading={loading} />}
          />
          <BottomSheetNew controls={false} sheetContainerBG="transparent" onPressDone={() => {}} ref={dashSwitcherRef}>
            <TouchableOpacity style={sheetRow} onPress={() => goToScreen(Routes.drinkHistory.name)}>
              <Text allowFontScaling={false} adjustsFontSizeToFit numberOfLines={1} style={sheetRowText}>
                Drink History
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={sheetRow} onPress={() => goToScreen(Routes.communityDrinkHistory.name)}>
              <Text allowFontScaling={false} adjustsFontSizeToFit numberOfLines={1} style={sheetRowText}>
                Community History
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={sheetRow} onPress={() => dashSwitcherRef.current.close()}>
              <Text
                allowFontScaling={false}
                adjustsFontSizeToFit
                numberOfLines={1}
                style={[sheetRowText, sheetCancelText]}>
                Cancel
              </Text>
            </TouchableOpacity>
          </BottomSheetNew>
        </ImageBackground>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  flex1: {flex: 1},
  bgBlack: {backgroundColor: '#000'},
  imageBg: {height: '100%', width: '100%', zIndex: -1},
  listContainer: {paddingHorizontal: 10},
  dotsIcon: {
    right: 0,
    position: 'absolute',
    top: 0,
    zIndex: 1,
    width: 60,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.orangeDashboard,
  },
  sectionHeader: {
    paddingVertical: 10,
    paddingLeft: 10,
    marginTop: 20,
    marginBottom: 10,
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  burgerTouchable: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerContainer: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 40},
  headerTitleText: {fontSize: 34, color: '#fff', marginLeft: 20, ...textStyle.robotoRegular},
  sheetRow: {
    borderWidth: 2,
    borderColor: '#fff',
    paddingVertical: 10,
    backgroundColor: '#000',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  sheetRowText: {
    color: '#fff',
    fontSize: 18,
    ...textStyle.robotoRegular,
    textAlign: 'center',
  },
  sheetCancelText: {
    color: colors.orangeDashboard,
  },
});

const {
  flex1,
  imageBg,
  listContainer,
  bgBlack,
  sectionHeader,
  sheetRowText,
  sheetCancelText,
  dotsIcon,
  sheetRow,
} = styles;

export const PurchaseHistoryScreen = withNavigation(PurchaseHistory);
