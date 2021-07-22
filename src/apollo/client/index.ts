export * from './state';
import {
  filterLocalMutations,
  communityLocalMutations,
  otherUtilMutations,
  inventoryLocalMutations,
  downloadImageMutations,
  profileMutations,
  filterWishlistLocalMutations,
  filterSaleLocalMutations,
} from './mutations';

export const mutations = {
  ...profileMutations,
  ...filterLocalMutations,
  ...communityLocalMutations,
  ...otherUtilMutations,
  ...inventoryLocalMutations,
  ...downloadImageMutations,
  ...filterWishlistLocalMutations,
  ...filterSaleLocalMutations,
};
