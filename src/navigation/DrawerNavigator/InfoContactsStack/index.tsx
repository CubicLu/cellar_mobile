import {createStackNavigator} from 'react-navigation-stack';

import {InfoContactsScreen, FeedBackScreen, AboutAppScreen, ReleaseListScreen} from '../../../screens';
import {Routes} from '../../../constants';
import {FaqScreen, WebViewInfoScreen, ReleaseNotesWebView} from '../../../components';

export default createStackNavigator(
  {
    [Routes.infoContacts.name]: InfoContactsScreen,
    [Routes.faq.name]: FaqScreen,
    [Routes.webViewInfo.name]: WebViewInfoScreen,
    [Routes.feedBackScreen.name]: FeedBackScreen,
    [Routes.aboutAppScreen.name]: AboutAppScreen,
    [Routes.releaseNotesWebView.name]: ReleaseNotesWebView,
    [Routes.releaseList.name]: ReleaseListScreen,
  },
  {
    initialRouteName: Routes.infoContacts.name,
    headerMode: 'none',
  },
);

export const AboutStack = createStackNavigator(
  {
    [Routes.aboutAppScreen.name]: AboutAppScreen,
  },
  {headerMode: 'none'},
);
