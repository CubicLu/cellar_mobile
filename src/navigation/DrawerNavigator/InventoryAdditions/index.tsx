import {createStackNavigator} from 'react-navigation-stack';

import {Routes} from '../../../constants';
import {CameraScreen} from '../../../screens/Camera';
import {AddWineNewScreen} from '../../../screens/Main/AddWineNew';
import {LocaleListScreenNew} from '../../../new_components/AddWineComponents/LocaleList';
import {ProducerListNew} from '../../../new_components/AddWineComponents/ProducersList';
import {VarietalList} from '../../../new_components/AddWineComponents/VarietalList';
import {EditDesignationScreen} from '../../../screens/EditDesignation';
import {PhotoRecognitionScreen} from '../../../screens/Main/PhotoRecognition';

export default createStackNavigator(
  {
    [Routes.addWineNew.name]: AddWineNewScreen,
    [Routes.varietalList.name]: VarietalList,
    [Routes.inventoryAdditions.producerList]: ProducerListNew,
    [Routes.localeList.name]: LocaleListScreenNew,
    [Routes.camera.name]: CameraScreen,
    [Routes.inventoryAdditions.editLocation]: EditDesignationScreen,
    [Routes.photoRecognition.name]: PhotoRecognitionScreen,
  },
  {
    initialRouteName: Routes.addWineNew.name,
    headerMode: 'none',
  },
);
