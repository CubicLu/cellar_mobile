import {createStackNavigator} from 'react-navigation-stack';

import {ProfileNew, BackupScreen, EditDesignationScreen} from '../../../screens';
import {Routes} from '../../../constants';
import {LocationListNewUI} from '../../../new_components/ProfileComponents/LocaleList';
import {LocationPicker} from '../../../screens/LocationPicker';
import {FaqScreen} from '../../../components';

const backupStack = createStackNavigator(
  {
    [Routes.backupScreen.name]: BackupScreen,
    [Routes.faq.name]: FaqScreen,
  },
  {
    initialRouteName: Routes.backupScreen.name,
    headerMode: 'none',
  },
);

export default createStackNavigator(
  {
    [Routes.profile.name]: ProfileNew,
    [Routes.localeListNewUI.name]: LocationListNewUI,
    [Routes.locationPicker.name]: LocationPicker,
    [Routes.backupStack.name]: backupStack,
    [Routes.inventoryAdditions.editLocation]: EditDesignationScreen,
  },
  {
    initialRouteName: Routes.profile.name,
    headerMode: 'none',
  },
);
