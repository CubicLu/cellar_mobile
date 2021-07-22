import {StyleSheet} from 'react-native';
import Colors from '../../../constants/colors';
import textStyles from '../../../constants/Styles/textStyle';
import textStyle from '../../../constants/Styles/textStyle';

export default StyleSheet.create({
  text: {
    fontSize: 16,
    ...textStyles.mediumText,
    color: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  bottleCount: {
    color: '#fff',
    fontSize: 40,
    textAlign: 'center',
    ...textStyles.boldText,
  },
  btnText: {
    fontSize: 18,
    ...textStyles.boldText,
    textTransform: 'uppercase',
    letterSpacing: 1.35,
  },
  acceptBtn: {
    backgroundColor: Colors.orangeDashboard,
    paddingVertical: 13,
  },
  cancelBtn: {
    backgroundColor: 'transparent',
    paddingVertical: 13,
    borderWidth: 3,
    borderColor: Colors.orangeDashboard,
    marginTop: 10,
  },
  btnContainer: {
    marginTop: 16,
    paddingHorizontal: 20,
  },
  bgImage: {
    top: 0,
    left: 0,
    right: 0,
    height: 300,
    position: 'absolute',
  },
  scrollContainer: {position: 'relative'},
  errorContainer: {flex: 1},
  errorText: {
    color: '#fff',
    fontSize: 21,
    ...textStyles.mediumText,
    textAlign: 'center',
  },
  blackBg: {
    backgroundColor: '#000',
  },
  flex1: {flex: 1},
  listHeaderContainer: {height: 226, backgroundColor: 'transparent'},
  firstIndexPadding: {paddingTop: 32},
  footerTotalContainer: {
    marginTop: 20,
    marginBottom: 10,
    alignItems: 'center',
  },
  textAlignCenter: {textAlign: 'center'},
  headerTitleText: {color: '#fff', fontSize: 24, ...textStyles.boldText, lineHeight: 24},
  listFooterContainer: {paddingBottom: 10},
  communityWineDetailsFooter: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
  hrContainer: {alignItems: 'center'},
  noBottlesText: {...textStyle.mediumText, color: '#fff', textAlign: 'center', fontSize: 20},
  emptyListContainer: {paddingVertical: 20},
  checkBoxText: {
    color: '#fff',
    ...textStyle.mediumText,
    fontSize: 21,
  },
});
