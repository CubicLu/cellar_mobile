import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  searchWrapper: {
    width: '100%',
    height: 80,
    backgroundColor: '#041B1E',
    position: 'absolute',
    zIndex: 3,
  },
  innerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchContainer: {
    width: '85%',
  },
  closeIcon: {
    marginHorizontal: 15,
  },
});
