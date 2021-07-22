import {createStackNavigator} from 'react-navigation-stack';
import {Routes} from '../../../constants';
import {ReviewScreen, CommunityHistoryWineDetails} from '../../../screens';

export const ReviewStack = createStackNavigator(
  {
    [Routes.ReviewScreen.name]: ReviewScreen,
    [Routes.drinkHistoryDetails.name]: CommunityHistoryWineDetails,
  },
  {
    headerMode: 'none',
  },
);
