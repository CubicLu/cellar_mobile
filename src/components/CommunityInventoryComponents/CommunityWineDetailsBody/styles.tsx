import {StyleSheet} from 'react-native';
import Colors from '../../../constants/colors';
import textStyles from '../../../constants/Styles/textStyle';

export default StyleSheet.create({
  container: {
    backgroundColor: Colors.dashboardDarkTab,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  wineBodyColl: {
    width: '50%',
  },
  titleText: {
    color: '#fff',
    fontSize: 24,
    ...textStyles.boldText,
  },
  text: {
    fontSize: 16,
    ...textStyles.mediumText,
    color: '#fff',
  },
  bodyContainer: {
    marginTop: 24,
    paddingBottom: 26,
  },
  textRightColl: {
    fontSize: 16,
    ...textStyles.boldText,
    color: '#fff',
  },
  bodyRow: {flexDirection: 'row'},
  buttonPadding: {padding: 5},
});
