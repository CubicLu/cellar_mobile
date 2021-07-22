import {StyleSheet} from 'react-native';
import Colors from '../../../constants/colors';
import textStyle from '../../../constants/Styles/textStyle';

export const styles = StyleSheet.create({
  wrapper: {
    height: '110%',
    backgroundColor: 'black',
  },
  burgerContainer: {
    width: 80,
    backgroundColor: Colors.dashboardRed,
    position: 'absolute',
    zIndex: 3,
  },
  burgerTouchable: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterContainer: {
    width: 60,
    backgroundColor: Colors.orangeDashboard,
    position: 'absolute',
    zIndex: 3,
    right: 0,
  },
  filterTouchable: {
    width: 60,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    right: 60,
    backgroundColor: Colors.inventoryItemBg,
  },
  heading: {
    marginLeft: 40,
    marginBottom: 15,
    color: 'white',
    fontSize: 18,
    ...textStyle.mediumText,
  },
  flatStyle: {
    flex: 1,
    paddingVertical: 20,
  },
});
