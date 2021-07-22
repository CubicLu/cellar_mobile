import {createStackNavigator} from 'react-navigation-stack';
import {createSwitchNavigator} from 'react-navigation';
import CONFIG from '../../../constants/config';

import {Routes} from '../../../constants';
import {LocaleListScreen, ProducerListScreen} from '../../../components';
import {
  TradeMainScreen,
  OffersScreen,
  CommunityWineDetailsScreen,
  NewSellOfferReceived,
  OfferWithCounterScreen,
  TradeOfferAcceptedScreen,
  TradeNoCounteredBuyOffer,
  TradeBuyOfferWithCounterScreen,
  FinalBuyOfferScreen,
  MyCellarNewScreen,
  CommunityFilterItemsNewUI,
  SellerPendingScreen,
  BuyerPendingScreen,
  FinalAcceptBySellerScreen,
  ExpiredOffersScreen,
  ReceiptsScreen,
  ConsumptionScreen,
  HistoryChangeScreen,
  CommunityInventoryScreen,
  CameraScreen,
  EditWineScreen,
  CommunityFilter,
  MiddleFilterList,
  TradeReceiptScreen,
  CellarImportScreen,
  DashboardCommunity,
  PurchaseHistoryScreen,
  CommunityDrinkHistoryScreen,
  WineDetailsNewUI,
  PastOfferScreen,
  LiveCommunityScreen,
  LivePhotoAddition,
  CardInputScreen,
  ZellePaymentScreen,
  DeliveryStepsScreen,
  SalesScreen,
  SaleWineDetailsScreen,
  SaleFilter,
  SaleFilterItems,
} from '../../../screens';
import {CommunityDrinkHistorySwitch} from '../DrinkHistorySwitch';

const CommFilterStack = createStackNavigator(
  {
    [Routes.filterNewUI.name]: CommunityFilter,
  },
  {
    initialRouteName: Routes.filterNewUI.name,
    headerMode: 'none',
  },
);

export const LiveCommunityStack = createStackNavigator(
  {
    [Routes.LivePhotoScreen.name]: LiveCommunityScreen,
    [Routes.LivePhotoAddition.name]: LivePhotoAddition,
    [Routes.camera.name]: CameraScreen,
  },
  {
    headerMode: 'none',
    mode: 'modal',
  },
);

const getStateForActionScreensStack = CommFilterStack.router.getStateForAction;

// Register on swipe back gesture event function which will be received from CommunityFilter screen
CommFilterStack.router = {
  ...CommFilterStack.router,
  getStateForAction(action, state) {
    if (action.type === 'Navigation/BACK') {
      state.routes[0].params.onSwipeBack();
    }
    return getStateForActionScreensStack(action, state);
  },
};

const TransactionReceiptsStack = createStackNavigator(
  {
    [Routes.tradingReceiptScreen.name]: TradeReceiptScreen,
    [Routes.receipts.name]: ReceiptsScreen,
    [Routes.CardInput.name]: CardInputScreen,
  },
  {
    initialRouteName: Routes.receipts.name,
    headerMode: 'none',
  },
);

const CurrentOffersStack = createStackNavigator(
  {
    [Routes.tradingMain.name]: TradeMainScreen,
    [Routes.tradingOffers.name]: OffersScreen,
    [Routes.tradingNewSellRequestReceived.name]: NewSellOfferReceived,
    [Routes.tradingOfferWithCounter.name]: OfferWithCounterScreen,
    [Routes.receipts.name]: ReceiptsScreen,
    [Routes.tradingOfferAccepted.name]: TradeOfferAcceptedScreen,
    [Routes.tradingReceiptScreen.name]: TradeReceiptScreen,
    [Routes.tradingOfferWithoutCounter.name]: TradeNoCounteredBuyOffer,
    [Routes.tradingBuyWithCounter.name]: TradeBuyOfferWithCounterScreen,
    [Routes.tradingFinalBuyOffer.name]: FinalBuyOfferScreen,
    [Routes.tradingBuyerPending.name]: BuyerPendingScreen,
    [Routes.tradingSellerPending.name]: SellerPendingScreen,
    [Routes.tradingFinalSellerAccept.name]: FinalAcceptBySellerScreen,
  },
  {
    initialRouteName: Routes.tradingOffers.name,
    headerMode: 'none',
  },
);

const SalesStack = createStackNavigator(
  {
    [Routes.SaleScreen.name]: SalesScreen,
    [Routes.SaleWineDetails.name]: SaleWineDetailsScreen,
    [Routes.SaleFilterScreen.name]: SaleFilter,
    [Routes.filters.brand]: SaleFilterItems,
    [Routes.subregion.name]: MiddleFilterList,
  },
  {headerMode: 'none'},
);

const CommunityStack = createStackNavigator(
  {
    [Routes.filters.brand]: CommunityFilterItemsNewUI,
    [Routes.subregion.name]: MiddleFilterList,
    [Routes.communityInventory.name]: CommunityInventoryScreen,
    [Routes.myCellar.name]: MyCellarNewScreen,
    [Routes.consumption.name]: ConsumptionScreen,
    [Routes.historyChange.name]: HistoryChangeScreen,
    ...(CONFIG.EXTERNAL_BUILD
      ? {[Routes.wineDetailsNewUI.name]: WineDetailsNewUI}
      : {
          [Routes.wineDetailsNewUI.name]: CommunityWineDetailsScreen,
          ReceiptsStack: TransactionReceiptsStack,
          CurrentOffersStack: CurrentOffersStack,
          [Routes.tradingMain.name]: TradeMainScreen,
          [Routes.expiredOffers.name]: ExpiredOffersScreen,
          [Routes.PastOfferScreen.name]: PastOfferScreen,
          [Routes.DeliverySteps.name]: DeliveryStepsScreen,
          [Routes.ZellePaymentScreen.name]: ZellePaymentScreen,
        }),
    [Routes.localeList.name]: LocaleListScreen,
    [Routes.editWine.name]: EditWineScreen,
    [Routes.inventoryAdditions.producerList]: ProducerListScreen,
    [Routes.camera.name]: CameraScreen,
    Filters: CommFilterStack,
    LiveCommunityStack: LiveCommunityStack,
  },
  {
    headerMode: 'none',
    initialRouteName: Routes.communityInventory.name,
  },
);

export const CommunityStackForDashboard = createStackNavigator(
  {
    [Routes.filters.brand]: CommunityFilterItemsNewUI,
    [Routes.subregion.name]: MiddleFilterList,
    [Routes.CommunityStackForDashboard.name]: CommunityInventoryScreen,
    [Routes.myCellar.name]: MyCellarNewScreen,
    [Routes.consumption.name]: ConsumptionScreen,
    [Routes.historyChange.name]: HistoryChangeScreen,

    ...(CONFIG.EXTERNAL_BUILD
      ? {[Routes.wineDetailsNewUI.name]: WineDetailsNewUI}
      : {[Routes.wineDetailsNewUI.name]: CommunityWineDetailsScreen}),

    [Routes.localeList.name]: LocaleListScreen,
    [Routes.editWine.name]: EditWineScreen,
    [Routes.inventoryAdditions.producerList]: ProducerListScreen,
    [Routes.camera.name]: CameraScreen,
    Filters: CommFilterStack,
    LiveCommunityStack: LiveCommunityStack,
  },
  {headerMode: 'none', initialRouteName: Routes.CommunityStackForDashboard.name},
);

const CommunityDashStack = createStackNavigator(
  {
    [Routes.dashboard.name]: DashboardCommunity,
    [Routes.localeList.name]: LocaleListScreen,
    [Routes.camera.name]: CameraScreen,
    [Routes.dashCommunity.name]: CommunityStackForDashboard,
  },
  {headerMode: 'none'},
);

export const CommunitySwitchNavigator = createSwitchNavigator(
  {
    dashboardCommunity: CommunityDashStack,
    [Routes.purchaseHistory.name]: PurchaseHistoryScreen,
    [Routes.communityDrinkHistory.name]: CommunityDrinkHistoryScreen,
    [Routes.cellarImport.name]: CellarImportScreen,
    CommunityInventoryStack: CommunityStack,
    [Routes.HistorySwitch.name]: CommunityDrinkHistorySwitch,
    [Routes.SaleStack.name]: SalesStack,
  },
  {
    backBehavior: 'none',
    initialRouteName: 'CommunityInventoryStack',
  },
);
