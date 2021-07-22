import {createStackNavigator} from 'react-navigation-stack';

import {Routes} from '../../../constants';
import {CountriesAddition} from '../../../components/InventoryAdditionsScreen/CountryList';
import {CameraScreen} from '../../../screens/Camera';
import {LocaleListScreenNew} from '../../../new_components/AddWineComponents/LocaleList';
import {ProducerListNew} from '../../../new_components/AddWineComponents/ProducersList';
import {AddWishlistScreen} from '../../../screens/Main/AddWishlist';
import {VarietalList} from '../../../new_components/AddWineComponents/VarietalList';

export default createStackNavigator(
  {
    [Routes.addWishlist.name]: AddWishlistScreen,
    [Routes.varietalList.name]: VarietalList,
    [Routes.inventoryAdditions.producerList]: ProducerListNew,
    [Routes.localeList.name]: LocaleListScreenNew,
    [Routes.camera.name]: CameraScreen,
  },
  {
    initialRouteName: Routes.addWishlist.name,
    headerMode: 'none',
  },
);
