import {StyleSheet} from 'react-native';
import textStyles from '../../../constants/Styles/textStyle';
import colors from '../../../constants/colors';
import textStyle from '../../../constants/Styles/textStyle';

export default StyleSheet.create({
  container: {
    backgroundColor: '#000',
    paddingHorizontal: 20,
    marginBottom: 22,
    flex: 1,
    paddingVertical: 20,
  },
  containerDarkBg: {
    backgroundColor: colors.dashboardDarkTab,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flex1: {flex: 1},
  bottlePickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  pickerRow: {marginTop: 20, alignItems: 'flex-start', flex: 1},
  nameText: {
    fontSize: 21,
    color: '#fff',
    ...textStyles.boldText,
  },
  geoText: {
    fontSize: 16,
    ...textStyles.mediumText,
    color: colors.textGray,
    lineHeight: 21,
  },
  chevronContainer: {
    transform: [{rotate: '90deg'}],
    paddingLeft: 5,
  },
  pickerContainer: {
    width: 60,
    paddingTop: 10,
    paddingBottom: 13,
    borderWidth: 2,
    borderColor: colors.inputBorderGrey,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 15,
    paddingRight: 12,
    height: 50,
  },
  inactiveOverlay: {
    position: 'absolute',
    top: -10,
    left: 0,
    right: -10,
    bottom: -10,
    zIndex: 1,
  },
  overlayBlackBg: {
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  overlayDarkTab: {
    backgroundColor: 'rgba(5,27,30, 0.5)',
  },
  inputContainer: {flex: 1.5, position: 'relative', marginLeft: 5},
  bottomPickerContainer: {
    width: '100%',
    backgroundColor: 'black',
  },
  inputLeftAccessory: {alignSelf: 'center'},
  customInputContainerStyle: {marginLeft: 10},
  invisible: {opacity: 0},
  flexRow: {flexDirection: 'row'},
  verifiedIconContainer: {marginLeft: 20},
  fs16: {fontSize: 16},
  fs12: {fontSize: 12},
  fs25: {fontSize: 25},
  bottlePickerTotalCount: {marginHorizontal: 10},
  verifiedTooltipText: {...textStyle.mediumText, color: colors.orangeDashboard},
});
