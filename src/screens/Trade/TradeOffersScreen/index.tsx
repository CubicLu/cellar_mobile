import React, {FC, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ImageBackground,
  TouchableOpacity,
  SectionList,
  Alert,
} from 'react-native';
import {withNavigation, NavigationScreenProp, NavigationEvents} from 'react-navigation';
import {useLazyQuery, useMutation} from '@apollo/react-hooks';
import RNProgressHud from 'progress-hud';

import {LeafIcon, BurgerIcon} from '../../../assets/svgIcons';
import {BackgroundGradient} from '../../../new_components';
import {OfferListItem} from '../../../components';
import {TradePreloadItem} from '../../../types/trade';
import {selectScreenSize} from '../../../utils/other.utils';
import {GET_CURRENT_OFFERS} from '../../../apollo/queries/trading';
import {WINE} from '../../../apollo/queries/wine';
import {getListType, mapStatusToScreen} from '../../../utils/TradeFlowUtils';
import {checkSyncStatus} from '../../../utils/other.utils';

import textStyles from '../../../constants/Styles/textStyle';
import Colors from '../../../constants/colors';
import Photos from '../../../assets/photos';
import {Routes} from '../../../constants';
import {OFFERS_TO_BUY, OFFERS_TO_SELL} from '../../../constants/text';
import {RESET_WS_FIELD} from '../../../apollo/client/mutations';

type Props = {
  navigation: NavigationScreenProp<any>;
};

export const Offers: FC<Props> = ({navigation}) => {
  const [preload, setPreload] = useState<TradePreloadItem>(null);
  const [offers, setOffers] = useState({offerToBuy: [], offerToSell: []});
  const [resetWSField] = useMutation(RESET_WS_FIELD);
  console.log(JSON.stringify(preload));

  const [getCurrentOffers, {data: remoteOffers, stopPolling, startPolling}] = useLazyQuery(GET_CURRENT_OFFERS, {
    onCompleted: async data => {
      setOffers(data.currentOffers);
      RNProgressHud.dismiss();
    },
    onError: error => {
      RNProgressHud.dismiss();
      Alert.alert(error.message);
    },
    fetchPolicy: 'network-only',
    pollInterval: 5000,
  });

  useEffect(() => {
    if (remoteOffers) {
      setOffers(remoteOffers.currentOffers);
    }
  }, [remoteOffers]);

  const [getWineById] = useLazyQuery(WINE, {
    fetchPolicy: 'no-cache',
    onError: () => {
      RNProgressHud.dismiss();
    },
    onCompleted: ({wineV2}) => {
      RNProgressHud.dismiss();
      console.log(wineV2, 'wineV2');
      mapStatusToScreen(
        preload.tradeStatus,
        {
          dealId: preload.offerId,
          requestedCount: preload.wineInTrade.quantity,
          requestedPrice: preload.wineInTrade.pricePerBottle,
          sellerId: preload.wineInTrade.sellerId,
          buyerId: preload.buyerId,
          updatedAt: preload.updatedAt,
          isCountered: preload.isCountered,
          note: preload.lastNote,
        },
        wineV2,
        preload.tradeList,
      )();
    },
  });

  useEffect(() => {
    getCurrentOffers();
  }, []);

  const preloadAndRedirect = (item, title) => {
    RNProgressHud.show();
    setPreload({...item, tradeList: getListType(title)});

    getWineById({variables: {wineId: item.wineInTrade.wineId}});
  };

  return (
    <SafeAreaView style={safeContainer}>
      <NavigationEvents
        onDidFocus={async () => {
          startPolling && startPolling(5000);
          await checkSyncStatus('CurrentOffers', getCurrentOffers);

          await resetWSField({
            variables: {
              payload: Routes.tradingOffers.name,
            },
          });
        }}
        onWillBlur={stopPolling}
      />
      <View style={container}>
        <TouchableOpacity onPress={() => navigation.openDrawer()} style={burgerContainer}>
          <BurgerIcon width={30} height={30} />
        </TouchableOpacity>
        <ImageBackground source={Photos.bgOffersScreen} style={bgStyles} />
        <BackgroundGradient />

        {offers && (
          <SectionList
            ListHeaderComponent={
              <View style={logoContainer}>
                <Text allowFontScaling={false} numberOfLines={2} style={headerText}>
                  Offers
                </Text>
                <LeafIcon width={81} height={54} />
              </View>
            }
            refreshing={false}
            onRefresh={() => getCurrentOffers()}
            sections={[
              {title: OFFERS_TO_SELL, data: offers.offerToSell},
              {title: OFFERS_TO_BUY, data: offers.offerToBuy},
            ]}
            renderSectionHeader={({section}) => (
              <View style={listHeaderContainer}>
                <Text allowFontScaling={false} style={listHeaderText}>
                  {section.title}
                </Text>
              </View>
            )}
            keyExtractor={item => item.offerId}
            renderItem={({item, section}) => (
              <OfferListItem
                status={item.tradeStatus}
                onPress={() => preloadAndRedirect(item, section.title)}
                title={item.wineInTrade.wineTitle}
                bottleCount={item.wineInTrade.quantity}
                color={item.wineInTrade.color}
                isCountered={item.isCountered}
                section={getListType(section.title)}
              />
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export const OffersScreen = withNavigation(Offers);

const styles = StyleSheet.create({
  safeContainer: {flex: 1, backgroundColor: '#000'},
  container: {flex: 1, position: 'relative'},
  burgerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: 80,
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: Colors.darkRedDrawer,
    zIndex: 1,
  },
  headerText: {
    fontSize: 40,
    lineHeight: 53,
    color: '#fff',
    ...textStyles.mediumText,
    marginRight: 20,
  },
  bgStyles: {position: 'absolute', zIndex: -1, left: 0, top: 0, right: 0, bottom: '30%'},
  logoContainer: {
    paddingLeft: 100,
    marginBottom: selectScreenSize(40, 75),
    marginTop: 20,
    flexDirection: 'row',
  },
  listHeaderContainer: {
    paddingVertical: 18,
    paddingLeft: 20,
    marginBottom: 10,
    backgroundColor: Colors.dashboardRed,
  },
  listHeaderText: {
    fontSize: 18,
    color: '#fff',
    ...textStyles.boldText,
    textTransform: 'uppercase',
    marginLeft: 70,
  },
});

const {
  burgerContainer,
  headerText,
  bgStyles,
  logoContainer,
  container,
  safeContainer,
  listHeaderContainer,
  listHeaderText,
} = styles;
