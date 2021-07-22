import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification from 'react-native-push-notification';
import {navigate} from '../utils/navigation.service';
import {isEmulator} from 'react-native-device-info';
import RNProgressHud from 'progress-hud';
import AsyncStorage from '@react-native-community/async-storage';
import {Alert} from 'react-native';

import {mapStatusToScreen} from '../utils/TradeFlowUtils';
import {Routes} from '../constants';
import makeRequest from '../utils/makeRequest';
import {GET_OFFER_FROM_NOTIFICATION, GET_TRANSACTION_RECEIPT} from '../apollo/queries/trading';
import {TradeDetailsType} from '../types/trade';

class NotificationService {
  permission: boolean = null;
  private readonly TRANSITION = 500;

  async onRegister({token}) {
    await AsyncStorage.setItem('PUSH_TOKEN', token);
  }

  async getToken() {
    return await AsyncStorage.getItem('PUSH_TOKEN');
  }

  async checkPermission() {
    if (await isEmulator()) {
      return;
    }
    await PushNotificationIOS.requestPermissions();
  }

  onNotification({data, ...notification}) {
    switch (data.action) {
      case 'OPEN_ORDER':
        return this.openOrder(data.ID);

      case 'OPEN_RECEIPT':
        return this.openReceipt(data.ID);

      case 'OPEN_DECLINED':
        return this.openPast(data.ID);

      case 'NONE':
        return;

      default:
        console.log(data.action, 'ACTION_NOT_SUPPORTED');
    }

    // (required) Called when a remote is received or opened, or local notification is opened
    notification.finish(PushNotificationIOS.FetchResult.NoData);
  }

  async openOrder(ID) {
    try {
      const {
        data: {data: result, errors},
      } = await makeRequest(GET_OFFER_FROM_NOTIFICATION, {
        tradeOfferId: ID,
      });

      if (errors) {
        Alert.alert('Error', errors[0].message);
        return;
      }

      const {status, wine, role, dealDetails} = getPayload(result);

      this.showTransitionLoader();
      navigate(Routes.tradingOffers.name);
      mapStatusToScreen(status, dealDetails, {wine: wine}, role)();
    } catch (e) {
      Alert.alert('Error', e.message);
    }
  }

  async openReceipt(ID) {
    const {
      data: {data, errors},
    } = await makeRequest(GET_TRANSACTION_RECEIPT, {
      tradeOfferId: ID,
    });

    if (errors) {
      Alert.alert('Error', errors[0].message);
      return;
    }

    navigate(Routes.tradingReceiptScreen.name, {receiptDetails: data.transactionReceipt});
  }

  async openPast(ID) {
    try {
      const {
        data: {data: result, errors},
      } = await makeRequest(GET_OFFER_FROM_NOTIFICATION, {
        tradeOfferId: ID,
      });

      if (errors) {
        Alert.alert('Error', errors[0].message);
        return;
      }

      const {wine, dealDetails} = getPayload(result);
      this.showTransitionLoader();
      navigate(Routes.expiredOffers.name, {data: [{wine}, dealDetails]});
      setTimeout(() => navigate(Routes.PastOfferScreen.name, {data: [{wine}, dealDetails]}), 500);
    } catch (e) {
      Alert.alert(e.message);
    } finally {
      RNProgressHud.dismiss();
    }
  }

  private showTransitionLoader() {
    RNProgressHud.show();
    setTimeout(() => RNProgressHud.dismiss(), this.TRANSITION);
  }

  unsubscribe() {
    AsyncStorage.removeItem('PUSH_TOKEN').then(() => {
      PushNotification.abandonPermissions();
      PushNotification.removeAllDeliveredNotifications();
    });
  }
}

const handler = new NotificationService();

PushNotification.configure({
  requestPermissions: false,
  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },
  onNotification: handler.onNotification.bind(handler),
  onRegister: handler.onRegister.bind(handler),
});

function getPayload(result) {
  const status = result.tradeOffer.tradeOffer.tradeStatus;
  const wine = result.tradeOffer.wine;
  const role = result.tradeOffer.tradeRole;

  console.log(result, 'result');

  const dealDetails: TradeDetailsType = {
    buyerId: result.tradeOffer.tradeOffer.buyerId,
    dealId: result.tradeOffer.tradeOffer.offerId,
    isCountered: result.tradeOffer.tradeOffer.isCountered,
    sellerId: result.tradeOffer.tradeOffer.wineInTrade.seller.id,
    note: result.tradeOffer.tradeOffer.lastNote,
    requestedCount: result.tradeOffer.tradeOffer.wineInTrade.quantity,
    requestedPrice: result.tradeOffer.tradeOffer.wineInTrade.pricePerBottle,
    updatedAt: result.tradeOffer.tradeOffer.updatedAt,
    ...result.tradeOffer.tradeOffer,
    ...result.tradeOffer.tradeOffer.wineInTrade,
    buyer: {
      id: result.tradeOffer.tradeOffer.buyerId,
    },
    seller: {...result.tradeOffer.tradeOffer.wineInTrade.seller},
  };

  return {status, wine, role, dealDetails};
}

export default handler;
