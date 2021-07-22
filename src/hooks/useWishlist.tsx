import {useState} from 'react';
import {useMutation} from '@apollo/react-hooks';
import RNProgressHud from 'progress-hud';

import {ADD_TO_WISHLIST, REMOVE_FROM_WISHLIST} from '../apollo/mutations/addOrRemoveWishlist';
import {flagToUpdateScreen} from '../utils/other.utils';

export const useWishlist = (isInWishlist: boolean) => {
  const [isInWish, setInWish] = useState(isInWishlist);

  const [addToWish] = useMutation(ADD_TO_WISHLIST, {
    onCompleted: async () => {
      RNProgressHud.dismiss();
      setInWish(true);
      await flagToUpdateScreen('Wishlist');
    },
    onError: error => {
      console.log(error);
      RNProgressHud.dismiss();
    },
  });

  const [removeFromWish] = useMutation(REMOVE_FROM_WISHLIST, {
    onCompleted: async () => {
      RNProgressHud.dismiss();
      setInWish(false);
      await flagToUpdateScreen('Wishlist');
    },
    onError: error => {
      console.log(error);
      RNProgressHud.dismiss();
    },
  });

  return {isInWish, addToWish, removeFromWish};
};
