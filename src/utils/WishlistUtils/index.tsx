import AsyncStorage from '@react-native-community/async-storage';
import {FIRST} from '../../constants/inventory';

export const onFocusSyncWishlist = async (wishlist, scrollRef, setInvalidate, setFlag) => {
  const syncString = await AsyncStorage.getItem('Wishlist');
  if (syncString) {
    const sync = JSON.parse(syncString);
    if (sync.sync) {
      wishlist({variables: {skip: 0, first: FIRST}});
      setInvalidate(true);
      setFlag(true);
      scrollRef.current && scrollRef.current.scrollToOffset({x: 0, animated: false});
      await AsyncStorage.setItem('Wishlist', JSON.stringify({sync: false}));
    }
  }
};
