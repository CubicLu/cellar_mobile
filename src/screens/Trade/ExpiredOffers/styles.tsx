import {StyleSheet, Dimensions} from 'react-native';
import Colors from '../../../constants/colors';
import textStyle from '../../../constants/Styles/textStyle';
import colors from '../../../constants/colors';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    flex: 1,
  },
  arrowTouchable: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowContainer: {
    backgroundColor: Colors.dashboardRed,
    width: 80,
    height: 80,
  },
  saveContainer: {flex: 1, position: 'relative'},
  absBtnContainer: {
    position: 'absolute',
    left: 20,
    bottom: 20,
    right: 20,
    backgroundColor: 'transparent',
    zIndex: 1,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleText: {
    fontWeight: '500',
    fontSize: Dimensions.get('screen').width < 375 ? 25 : 35,
    lineHeight: 45,
    ...textStyle.robotoRegular,
    color: '#fff',
  },

  btn: {backgroundColor: colors.orangeDashboard},
  btnText: {
    color: '#fff',
    textTransform: 'uppercase',
  },
  listButtonSpace: {
    height: 60,
  },
  switchBtnContainer: {
    paddingVertical: 15,
    backgroundColor: colors.orangeDashboard,
    flex: 0.3,
    height: '100%',
    justifyContent: 'center',
  },
  switchBtnText: {
    color: '#fff',
    fontSize: 16,
    ...textStyle.robotoRegular,
    textAlign: 'center',
  },
  selectAllBtnText: {
    color: '#E6750E',
    fontSize: 16,
    marginLeft: 20,
    padding: 5,
    ...textStyle.robotoRegular,
  },
  listStyles: {flexGrow: 1},
  listHeaderContainer: {minHeight: 55, justifyContent: 'center'},
  headerText: {fontSize: 35},
});
