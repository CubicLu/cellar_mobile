import {createStackNavigator} from 'react-navigation-stack';

import {Routes} from '../../../constants';
import {PhotoRecognitionScreen} from '../../../screens/Main/PhotoRecognition';
import {WineDetailsNewUI} from '../../../screens';
import InventoryAdditionStack from '../InventoryAdditions';
import {MyCellarNewScreen} from '../../../screens';
import {ConsumptionScreen} from '../../../screens/Consumption';
import {CameraScreen} from '../../../screens/Camera';
import {CountriesAddition} from '../../../components/InventoryAdditionsScreen/CountryList';
import {ProducerListScreen} from '../../../components/InventoryAdditionsScreen/ProducersList';

export default createStackNavigator(
  {
    [Routes.photoRecognition.name]: PhotoRecognitionScreen,
    [Routes.wineDetails.name]: WineDetailsNewUI,
    [Routes.camera.name]: CameraScreen,

    [Routes.countryAdditions.name]: CountriesAddition,
    [Routes.inventoryAdditions.producerList]: ProducerListScreen,
    [Routes.myCellar.name]: MyCellarNewScreen,
    [Routes.consumption.name]: ConsumptionScreen,
    InventoryAdditionPhotoStack: InventoryAdditionStack,
  },
  {
    initialRouteName: Routes.photoRecognition.name,
    headerMode: 'none',
  },
);
