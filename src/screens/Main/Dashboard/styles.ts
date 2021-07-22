import {StyleSheet} from 'react-native';
import Colors from '../../../constants/colors';
import testStyle from '../../../constants/Styles/textStyle';
import colors from '../../../constants/colors';

export default StyleSheet.create({
  pickerContainer: {},
  container: {flex: 1, backgroundColor: '#000'},
  imageBg: {height: '100%', width: '100%', zIndex: -1},
  flex1: {flex: 1},
  burgerContainer: {
    backgroundColor: Colors.dashboardRed,
  },
  burgerTouchable: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerContainer: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'},
  headerTitleText: {fontSize: 34, color: '#fff', marginLeft: 20, ...testStyle.robotoRegular},
  dotsContainer: {padding: 20},
  pickerContentContainer: {paddingTop: 0},
  animatedContainer: {flex: 1, marginTop: 10},
  sectionListContentContainer: {flexGrow: 1, paddingBottom: 40},
  subListImage: {height: 30, width: 30},
  sheetRow: {
    borderWidth: 2,
    borderColor: '#fff',
    paddingVertical: 10,
    backgroundColor: '#000',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  sheetRowText: {
    color: '#fff',
    fontSize: 18,
    ...testStyle.robotoRegular,
    textAlign: 'center',
  },
  sheetCancelText: {
    color: colors.orangeDashboard,
  },
});
