import {createStackNavigator} from 'react-navigation-stack';
import {createSwitchNavigator} from 'react-navigation';

import {Routes} from '../../../constants';
import {CountriesAddition, LocaleListScreen} from '../../../components';
import {ProducerListNew, LocaleListScreenNew, VarietalList} from '../../../new_components';
import ProfileStack from '../ProfileStack';
import PhotoRecognitionStack from '../PhotoRecognitionStack';
import InventoryAdditionStack from '../InventoryAdditions';
import InfoContactsStack, {AboutStack} from '../InfoContactsStack';
import AddWishStack from '../AddWishlistStack';
import WishListStack, {WishlistStackForDashboard} from '../WishListStack';
import {InventoryDrinkHistorySwitch} from '../DrinkHistorySwitch';

import {
  CameraScreen,
  EditWineScreen,
  InventoryFilterItems,
  InventoryFilter,
  InventoryNewUIScreen,
  MiddleFilterList,
  MyCellarNewScreen,
  EditDesignationScreen,
  HistoryChangeScreen,
  InventoryWineDetailsScreen,
  CellarImportScreen,
  DashboardScreen,
  ConsumptionScreen,
} from '../../../screens';

const InvFilterStack = createStackNavigator(
  {
    [Routes.filter.name]: InventoryFilter,
  },
  {
    initialRouteName: Routes.filter.name,
    headerMode: 'none',
    mode: 'modal',
  },
);

const getStateForActionScreensStack = InvFilterStack.router.getStateForAction;

// Register on swipe back gesture event function which will be received from InventoryFilter screen
InvFilterStack.router = {
  ...InvFilterStack.router,
  getStateForAction(action, state) {
    if (action.type === 'Navigation/BACK') {
      state.routes[0].params.onSwipeBack();
    }
    return getStateForActionScreensStack(action, state);
  },
};

const InventoryStack = createStackNavigator(
  {
    /*
     * Filters
     * */
    InvFiltersStack: InvFilterStack,
    [Routes.filterItemsNewUI.name]: InventoryFilterItems,
    [Routes.middleFilter.name]: MiddleFilterList,
    /**
     * /Filters
     * */
    [Routes.inventoryNewUI.name]: InventoryNewUIScreen,
    [Routes.myCellar.name]: MyCellarNewScreen,
    [Routes.consumption.name]: ConsumptionScreen,
    [Routes.historyChange.name]: HistoryChangeScreen,
    [Routes.wineDetailsNewUI.name]: InventoryWineDetailsScreen,
    [Routes.editWine.name]: EditWineScreen,
    [Routes.varietalList.name]: VarietalList,
    [Routes.localeList.name]: LocaleListScreenNew,
    [Routes.camera.name]: CameraScreen,
    [Routes.countryAdditions.name]: CountriesAddition,
    [Routes.inventoryAdditions.producerList]: ProducerListNew,
    [Routes.inventoryAdditions.editLocation]: EditDesignationScreen,
  },
  {
    initialRouteName: Routes.inventoryNewUI.name,
    headerMode: 'none',
  },
);

export const InventoryStackForDashboard = createStackNavigator(
  {
    /*
     * Filters
     * */
    InvFiltersStack: InvFilterStack,
    [Routes.filterItemsNewUI.name]: InventoryFilterItems,
    [Routes.middleFilter.name]: MiddleFilterList,
    /**
     * /Filters
     * */
    DashboardInventory: InventoryNewUIScreen,
    [Routes.myCellar.name]: MyCellarNewScreen,
    [Routes.consumption.name]: ConsumptionScreen,
    [Routes.historyChange.name]: HistoryChangeScreen,
    [Routes.wineDetailsNewUI.name]: InventoryWineDetailsScreen,
    [Routes.editWine.name]: EditWineScreen,
    [Routes.varietalList.name]: VarietalList,
    [Routes.localeList.name]: LocaleListScreenNew,
    [Routes.camera.name]: CameraScreen,
    [Routes.countryAdditions.name]: CountriesAddition,
    [Routes.inventoryAdditions.producerList]: ProducerListNew,
    [Routes.inventoryAdditions.editLocation]: EditDesignationScreen,
  },
  {
    initialRouteName: 'DashboardInventory',
    headerMode: 'none',
  },
);

export const InventoryDashStack = createStackNavigator(
  {
    [Routes.dashboard.name]: DashboardScreen,
    [Routes.localeList.name]: LocaleListScreen,
    [Routes.camera.name]: CameraScreen,
    [Routes.inventoryStackForDashboard.name]: InventoryStackForDashboard,
  },
  {headerMode: 'none', initialRouteName: Routes.dashboard.name},
);

export const InventorySwitchNavigator = createSwitchNavigator(
  {
    ProfileStack: ProfileStack,
    InventoryStack: InventoryStack,
    DashStack: InventoryDashStack,
    PhotoRecognitionStack: PhotoRecognitionStack,
    InventoryAdditionStack: InventoryAdditionStack,
    [Routes.cellarImport.name]: CellarImportScreen,
    [Routes.infoContacts.name]: InfoContactsStack,
    AddWish: AddWishStack,
    WishStack: WishListStack,
    AboutStack: AboutStack,
    [Routes.HistorySwitch.name]: InventoryDrinkHistorySwitch,
    [Routes.WishlistStackForDashboard.name]: WishlistStackForDashboard,
  },
  {
    backBehavior: 'none',
  },
);
