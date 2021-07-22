import React, {FC, useCallback, useEffect, useState} from 'react';
import RNProgressHud from 'progress-hud';
import {View, StyleSheet, SafeAreaView, Alert, ScrollView, Text, TouchableOpacity} from 'react-native';
import {NavigationEvents, NavigationScreenProp} from 'react-navigation';
import AsyncStorage from '@react-native-community/async-storage';
import {ApolloError} from 'apollo-client';
import {useLazyQuery, useMutation} from '@apollo/react-hooks';

import {HeaderFilter, WineDetailsFooter, InventoryWineBody, ImageWithPreview, BottleNotes} from '../../new_components';
import {ADD_TO_WISHLIST, REMOVE_FROM_WISHLIST} from '../../apollo/mutations/addOrRemoveWishlist';
import {Routes} from '../../constants';
import {WINE} from '../../apollo/queries/wine';
import {renameKeyName, formatDrinkWindow} from '../../utils/other.utils';
import colors from '../../constants/colors';
import {WINE_NOTES} from '../../apollo/queries/wineHistory';
import {UPDATE_WINE} from '../../apollo/mutations/updateWine';
import images from '../../assets/images';
import {CloseIconWhite} from '../../assets/svgIcons';
import textStyles from '../../constants/Styles/textStyle';
import Header from '../../new_components/WineDetailsComponents/Header';

type Props = {
  navigation: NavigationScreenProp<any>;
};

const InventoryWineDetails: FC<Props> = ({navigation}) => {
  const [wine, setWine] = useState(navigation.getParam('wine'));
  const [inWish, setInWish] = useState(wine && wine.wine.inWishList);
  const [allowForTrading, setAllowForTrading] = useState(wine && wine.wine.allowForTrading);

  const [getBottleNotes, {loading: notesLoading, data: bottleNotes}] = useLazyQuery(WINE_NOTES, {
    fetchPolicy: 'network-only',
  });

  const [removeFromWish, {loading: WLRemoveLoading}] = useMutation(REMOVE_FROM_WISHLIST, {
    onCompleted: async data => {
      console.log(data);
      setInWish(false);
      await AsyncStorage.setItem('Wishlist', JSON.stringify({sync: true}));
    },
    onError,
    variables: {wineId: wine.wine.id},
  });

  const [addToWish, {loading: WLAddLoading}] = useMutation(ADD_TO_WISHLIST, {
    onCompleted: async data => {
      console.log(data);
      setInWish(true);
      await AsyncStorage.setItem('Wishlist', JSON.stringify({sync: true}));
    },
    onError,
    variables: {wineId: wine.wine.id},
  });

  const onAddWishHandler = useCallback(async () => {
    if (inWish) {
      await removeFromWish();
    } else {
      await addToWish();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inWish]);

  const [updateWineAction, {loading: AllowForTradeLoading}] = useMutation(UPDATE_WINE, {
    variables: {
      wineId: wine.wine.id,
      allowForTrading: !allowForTrading,
    },
    onCompleted: async () => {
      setAllowForTrading(!allowForTrading);
    },
  });

  function onError(error: ApolloError) {
    console.log(error.message);
    Alert.alert('', error.message);
  }

  const onPressBottle = useCallback(
    () =>
      navigation.navigate(Routes.myCellar.name, {
        data: {
          wine: wine.wine,
          quantity: wine.quantity,
        },
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [wine],
  );

  const [getWine] = useLazyQuery(WINE, {
    fetchPolicy: 'no-cache',
    onCompleted: data => {
      RNProgressHud.dismiss();
      const temp = renameKeyName(data, 'wineV2', 'wine');
      setWine(temp.wine);
      setInWish(temp.wine.inWishList);
    },
    onError: () => {
      navigation.navigate(Routes.inventoryNewUI.name);
    },
  });

  const onLoadWine = (id: number) => {
    RNProgressHud.show();
    setTimeout(() => {
      getWine({variables: {wineId: id}});
    }, 300);
  };

  useEffect(() => {
    getBottleNotes({variables: {wineId: wine.wine.id}});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wine]);

  useEffect(() => {
    console.log('Відкриит скрін');
    return () => {
      console.log('Закрити скрін');
    };
  }, []);

  return (
    <View style={screenContainer}>
      <SafeAreaView>
        <Header label="Wine Details" goBack={() => navigation.goBack()} />
        <ScrollView style={scrollContainer}>
          <NavigationEvents
            onWillFocus={async () => {
              const syncString = await AsyncStorage.getItem('Inventory');

              if (syncString) {
                const sync = JSON.parse(syncString);
                if (sync.sync) {
                  RNProgressHud.show();
                  onLoadWine(wine.wine.id);
                }
              }
            }}
          />
          <View style={flexRow}>
            <ImageWithPreview
              isImageExist={wine.wine.pictureURL !== ''}
              pictureURL={wine.wine.pictureURL}
              color={wine.wine.color}
              onPressWish={onAddWishHandler}
              inWishList={inWish}
              loading={WLRemoveLoading || WLAddLoading || AllowForTradeLoading}
            />

            <InventoryWineBody
              onPressEdit={() => {
                navigation.navigate(Routes.editWine.name, {
                  wine: wine.wine,
                  onSelect: onLoadWine,
                  pricePerBottle: wine.pricePerBottle,
                });
              }}
              wineTitle={wine.wine.wineTitle}
              vintage={wine.wine.vintage}
              country={wine.wine.locale.country}
              region={wine.wine.locale.region}
              subregion={wine.wine.locale.subregion}
              appellation={wine.wine.locale.appellation}
              pricePerBottle={wine.pricePerBottle}
              bottleCapacity={wine.wine.bottleCapacity}
              varietal={wine.wine.varietal}
              drinkWindow={formatDrinkWindow(wine.wine.drinkWindow)}
              marketPrice={wine.wine.marketPrice}
              cellarDesignationId={wine.wine.cellarDesignationId}>
              <View style={footerContainer}>
                <WineDetailsFooter
                  onPressBottle={onPressBottle}
                  bottleCount={wine.quantity}
                  allowForTrading={allowForTrading}
                  onPressAllowForTrading={updateWineAction}
                  onPressWish={onAddWishHandler}
                  inWishList={inWish}
                  loading={WLRemoveLoading || WLAddLoading || AllowForTradeLoading}
                />
              </View>
            </InventoryWineBody>
          </View>
          {bottleNotes && <BottleNotes data={bottleNotes.wineHistory} loading={!notesLoading} />}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    alignItems: 'center',
    paddingBottom: 20,
  },
  text: {fontSize: 24, color: 'white', ...textStyles.mediumText},
  screenContainer: {flex: 1, backgroundColor: colors.dashboardDarkTab},
  flexRow: {position: 'relative'},
  footerContainer: {marginTop: 20},
  scrollContainer: {height: '95%'},
  backContainer: {height: 30, width: 30, justifyContent: 'center', alignItems: 'flex-end'},
});

const {screenContainer, flexRow, footerContainer, scrollContainer, container, text, backContainer} = styles;

export const InventoryWineDetailsScreen = InventoryWineDetails;
