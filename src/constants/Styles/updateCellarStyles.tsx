import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  header: {
    height: 80,
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'white',
    shadowOffset: {width: 0, height: 3},
    shadowColor: 'black',
    shadowOpacity: 0.4,
  },
  touchableStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: 80,
  },
  topBarContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scrollContainer: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 20,
    flex: 1,
  },
  inputStyle: {
    marginTop: 20,
    marginBottom: 20,
    width: '100%',
    fontSize: 24,
  },
  bottomSheetContainer: {
    height: 300,
    width: '100%',
    backgroundColor: 'white',
  },
});
