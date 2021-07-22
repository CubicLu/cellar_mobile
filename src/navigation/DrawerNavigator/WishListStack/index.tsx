import {createStackNavigator} from 'react-navigation-stack';
import Routes from '../../../constants/navigator-name';

import {
  WishlistScreen,
  ConsumptionScreen,
  HistoryChangeScreen,
  EditWineScreen,
  CameraScreen,
  MyCellarNewScreen,
  WineDetailsNewUI,
  WishlistLeaderboard,
  DashboardWishList,
  WishlistFilter,
  WishlistFilterItems,
  MiddleFilterList,
} from '../../../screens';

import {CountriesAddition, ProducerListScreen, LocaleListScreen} from '../../../components';

const WishlistFilterStack = createStackNavigator(
  {
    [Routes.WishlistFilters.name]: WishlistFilter,
  },
  {
    initialRouteName: Routes.WishlistFilters.name,
    headerMode: 'none',
    mode: 'modal',
  },
);

const getStateForActionScreensStack = WishlistFilterStack.router.getStateForAction;

// Register on swipe back gesture event function which will be received from InventoryFilter screen
WishlistFilterStack.router = {
  ...WishlistFilterStack.router,
  getStateForAction(action, state) {
    if (action.type === 'Navigation/BACK') {
      state.routes[0].params.onSwipeBack();
    }
    return getStateForActionScreensStack(action, state);
  },
};

export default createStackNavigator(
  {
    [Routes.wishlist.name]: WishlistScreen,
    [Routes.myCellar.name]: MyCellarNewScreen,
    [Routes.wineDetailsNewUI.name]: WineDetailsNewUI,
    [Routes.consumption.name]: ConsumptionScreen,
    [Routes.historyChange.name]: HistoryChangeScreen,
    [Routes.editWine.name]: EditWineScreen,
    [Routes.localeList.name]: LocaleListScreen,
    [Routes.camera.name]: CameraScreen,
    [Routes.countryAdditions.name]: CountriesAddition,
    [Routes.inventoryAdditions.producerList]: ProducerListScreen,
    [Routes.WishlistLeaderboard.name]: {
      screen: WishlistLeaderboard,
      navigationOptions: {
        gesturesEnabled: false,
      },
    },
    [Routes.WishlistFilters.name]: WishlistFilterStack,
    [Routes.WishlistFilterList.name]: WishlistFilterItems,
    [Routes.WishlistMiddleFilter.name]: MiddleFilterList,
  },
  {
    initialRouteName: Routes.wishlist.name,
    headerMode: 'none',
  },
);

export const WishlistStackForDashboard = createStackNavigator(
  {
    [Routes.dashboardWishlist.name]: DashboardWishList,
    [Routes.WishlistInDashStack.name]: WishlistScreen,
    [Routes.myCellar.name]: MyCellarNewScreen,
    [Routes.wineDetailsNewUI.name]: WineDetailsNewUI,
    [Routes.consumption.name]: ConsumptionScreen,
    [Routes.historyChange.name]: HistoryChangeScreen,
    [Routes.editWine.name]: EditWineScreen,
    [Routes.localeList.name]: LocaleListScreen,
    [Routes.camera.name]: CameraScreen,
    [Routes.countryAdditions.name]: CountriesAddition,
    [Routes.inventoryAdditions.producerList]: ProducerListScreen,

    [Routes.WishlistFilters.name]: WishlistFilterStack,
    [Routes.WishlistFilterList.name]: WishlistFilterItems,
    [Routes.WishlistMiddleFilter.name]: MiddleFilterList,
  },
  {
    headerMode: 'none',
    initialRouteName: Routes.dashboardWishlist.name,
  },
);
