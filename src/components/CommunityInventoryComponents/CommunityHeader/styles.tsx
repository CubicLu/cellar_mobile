import {StyleSheet} from 'react-native';
import textStyle from '../../../constants/Styles/textStyle';

export const styles = StyleSheet.create({
  container: {marginLeft: 90, marginBottom: 50},
  title: {
    fontSize: 45,
    lineHeight: 50,
    color: 'white',
    ...textStyle.mediumText,
  },
});
