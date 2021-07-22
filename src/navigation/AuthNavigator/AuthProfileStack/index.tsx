import {createStackNavigator} from 'react-navigation-stack';

import Routes from '../../../constants/navigator-name';
import {ProfileAuthScreen} from '../../../screens/AuthProfile';
import {LocationListNewUI} from '../../../new_components/ProfileComponents/LocaleList';
import {LocationPicker} from '../../../screens/LocationPicker';

export default createStackNavigator(
  {
    [Routes.authProfile.name]: ProfileAuthScreen,
    [Routes.authLocationPicker.name]: LocationPicker,
  },
  {
    initialRouteName: Routes.authProfile.name,
    headerMode: 'none',
  },
);
