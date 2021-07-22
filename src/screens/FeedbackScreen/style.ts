import Colors from '../../constants/colors';
import {StyleSheet} from 'react-native';
import textStyle from '../../constants/Styles/textStyle';

export default StyleSheet.create({
  saveContainer: {backgroundColor: '#000', flex: 1},
  infoText: {
    color: '#fff',
    ...textStyle.mediumText,
  },
  infoContainer: {
    paddingHorizontal: 20,
    marginTop: 47,
  },
  styleMultiline: {
    fontSize: 21,
    color: 'white',
    ...textStyle.boldText,
    alignSelf: 'flex-start',
    paddingTop: 0,
    paddingBottom: 0,
    marginLeft: 18,
    overflow: 'scroll',
  },
  containerInput: {
    marginTop: 20,
    minHeight: 200,
    width: '100%',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
  },
  inputStyle: {
    paddingTop: 0,
    paddingBottom: 0,
    minHeight: 200,
  },
  buttonStyle: {
    minHeight: 50,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
    backgroundColor: Colors.orangeDashboard,
  },
  attachRow: {
    marginHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 20,
  },
  imgTouchable: {padding: 2, borderWidth: 1, borderColor: Colors.inputBorderGrey, marginLeft: 10},
  attachBtn: {
    height: 50,
    borderWidth: 2,
    borderColor: Colors.inputBorderGrey,
    paddingHorizontal: 20,
    marginHorizontal: 20,
    marginTop: 20,
    alignItems: 'center',
    flexDirection: 'row',
  },
  attachBtnText: {color: '#fff', marginLeft: 17, fontSize: 21, ...textStyle.mediumText, lineHeight: 28},
  deleteBtn: {
    width: 30,
    alignItems: 'flex-end',
    flexDirection: 'column',
    height: 54,
    justifyContent: 'flex-start',
    padding: 5,
  },
  flex1: {
    flex: 1,
  },
  fileNameText: {color: '#E6750E', fontSize: 21, ...textStyle.mediumText},
  imgThumb: {width: 55, height: 55},
});
