import React, {FC} from 'react';
import {FlatList} from 'react-native';
import {useQuery} from '@apollo/react-hooks';

import {
  GET_LOCAL_COMM_STATE,
  GET_LOCAL_INVENTORY_STATE,
  GET_LOCAL_WISHLIST_STATE,
  GET_LOCAL_SALE_STATE,
} from '../../../apollo/client/queries';
import {ActiveFilterListItem} from '../../../components';

type Screen = 'community' | 'inventory' | 'wishlist' | 'sale';

const mapQueryToScreen = (variant: Screen) => {
  switch (variant) {
    case 'community':
      return [GET_LOCAL_COMM_STATE, 'communityFilters'];

    case 'inventory':
      return [GET_LOCAL_INVENTORY_STATE, 'inventoryFilters'];

    case 'wishlist':
      return [GET_LOCAL_WISHLIST_STATE, 'wishlistFilters'];

    case 'sale':
      return [GET_LOCAL_SALE_STATE, 'saleFilters'];

    default:
      return [];
  }
};

type Props = {
  variant: Screen;
};

const ActiveFilters: FC<Props> = ({variant}) => {
  const [QUERY, KEY] = mapQueryToScreen(variant);
  const {data} = useQuery(QUERY);

  return (
    <FlatList<any>
      data={data && data[KEY]}
      horizontal
      indicatorStyle="white"
      keyExtractor={(item, index) => `${index}`}
      renderItem={({item}) => <ActiveFilterListItem item={item} />}
    />
  );
};

export const ActiveFiltersList = ActiveFilters;
