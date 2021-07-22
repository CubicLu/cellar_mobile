import {StyleSheet} from 'react-native';
import Colors from '../../../constants/colors';
import textStyle from '../../../constants/Styles/textStyle';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.inventoryItemBg,
    marginBottom: 20,
    minHeight: 300,
  },
  innerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 320,
    width: '100%',
    paddingTop: 10,
    paddingBottom: 10,
  },
  imageContainer: {
    marginLeft: 18,
    justifyContent: 'center',
    maxHeight: 300,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  title: {
    color: 'white',
    fontSize: 24,
    ...textStyle.boldText,
    marginBottom: 10,
  },
  text: {
    color: 'white',
    fontSize: 16,
    width: '50%',
    ...textStyle.mediumText,
  },
  colorContainer: {
    height: '100%',
    width: 50,
    position: 'absolute',
  },
  contentStyle: {
    width: '70%',
    marginLeft: 18,
    marginTop: 20,
    marginBottom: -5,
    alignSelf: 'flex-start',
  },
  flexRow: {
    flexDirection: 'row',
  },
});
