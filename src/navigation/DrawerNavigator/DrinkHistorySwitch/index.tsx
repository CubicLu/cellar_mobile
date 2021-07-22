import {createStackNavigator} from 'react-navigation-stack';
import Routes from '../../../constants/navigator-name';
import {
  HistoryWineDetails,
  DrinkHistoryScreen,
  HistoryChangeScreen,
  AddWineHistoryScreen,
  PurchaseHistoryScreen,
  CommunityDrinkHistoryScreen,
  CommunityHistoryWineDetails,
} from '../../../screens';
import {createSwitchNavigator} from 'react-navigation';

const DrinkHistoryStack = createStackNavigator(
  {
    [Routes.drinkHistory.name]: DrinkHistoryScreen,
    [Routes.historyChange.name]: HistoryChangeScreen,
    [Routes.drinkHistoryDetails.name]: HistoryWineDetails,
  },
  {headerMode: 'none'},
);

const purchaseHistoryStack = createStackNavigator(
  {
    Root: PurchaseHistoryScreen,
    [Routes.addWineHistory.name]: AddWineHistoryScreen,
    [Routes.drinkHistoryDetails.name]: HistoryWineDetails,
  },
  {headerMode: 'none'},
);

const communityDrinkHistoryStack = createStackNavigator(
  {
    [Routes.communityDrinkHistory.name]: CommunityDrinkHistoryScreen,
    [Routes.historyChange.name]: HistoryChangeScreen,
    [Routes.drinkHistoryDetails.name]: CommunityHistoryWineDetails,
  },
  {headerMode: 'none'},
);

export const InventoryDrinkHistorySwitch = createSwitchNavigator(
  {
    [Routes.drinkHistory.name]: DrinkHistoryStack,
    [Routes.purchaseHistory.name]: purchaseHistoryStack,
  },
  {initialRouteName: Routes.drinkHistory.name},
);

export const CommunityDrinkHistorySwitch = createSwitchNavigator(
  {
    [Routes.communityDrinkHistory.name]: communityDrinkHistoryStack,
  },
  {initialRouteName: Routes.communityDrinkHistory.name},
);
