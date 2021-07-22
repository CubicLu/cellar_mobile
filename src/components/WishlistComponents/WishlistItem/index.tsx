import React, {useState, FC} from 'react';
import {View, TouchableOpacity} from 'react-native';
import Highlighter from 'react-native-highlight-words';

import {useMutation} from '@apollo/react-hooks';
import {ADD_TO_WISHLIST, REMOVE_FROM_WISHLIST} from '../../../apollo/mutations/addOrRemoveWishlist';
import {HearthInactiveIcon, HearthActiveIcon} from '../../../assets/svgIcons';
import {WineListItemBody, WineListItemPhoto} from '../../../components';

import {styles, RightColProps} from '../../InventoryComponents/InventoryListItem';
const {
  container,
  h1,
  h2,
  highlight,
  infoContainer,
  producerContainer,
  bottleAbsContainer,
  bottleTouchable,
  bottleIconContainer,
} = styles;

export interface WishlistItemProps {
  item: {
    bottleCapacity: number;
    color: string;
    currency: string;
    pictureURL: any;
    expectedPrice: number;
    vintage: string;
    varietal: string;
    producer: string;
    wineType: string;
    rating: number;
    wineName: string;
    wineTitle: string;
    id: number;
    locale: {
      country: string;
      subregion: string;
      region: string;
      appellation: string;
    };
  };
  onItemPress: () => void;
}
const Item: FC<WishlistItemProps> = ({item, onItemPress}) => {
  const [isInWish, setInWish] = useState(true);

  const [addToWish, {loading: addLoading}] = useMutation(ADD_TO_WISHLIST, {
    onCompleted: data => {
      console.log(data);
      setInWish(true);
    },
    onError: error => {
      console.log(error);
    },
  });

  const [removeFromWish, {loading: removeLoading}] = useMutation(REMOVE_FROM_WISHLIST, {
    onCompleted: data => {
      console.log(data);
      setInWish(false);
    },
    onError: error => {
      console.log(error);
    },
  });

  return (
    <TouchableOpacity onPress={onItemPress} style={container}>
      <WineListItemPhoto pictureURL={item.pictureURL} color={item.color} />
      <View style={bottleAbsContainer}>
        <TouchableOpacity
          disabled={addLoading || removeLoading}
          onPress={() => {
            isInWish ? removeFromWish({variables: {wineId: item.id}}) : addToWish({variables: {wineId: item.id}});
          }}
          style={[bottleTouchable, {padding: 5}]}>
          <View style={bottleIconContainer}>
            {isInWish ? <HearthActiveIcon width={23} height={20} /> : <HearthInactiveIcon width={23} height={20} />}
          </View>
        </TouchableOpacity>
      </View>
      <View style={infoContainer}>
        <View>
          <View style={producerContainer}>
            <Highlighter
              {...RightColProps}
              autoEscape={true}
              highlightStyle={highlight}
              style={h1}
              searchWords={[]}
              textToHighlight={item.producer}
            />
          </View>
          {item.wineName !== '' && item.wineName && (
            <Highlighter
              {...RightColProps}
              autoEscape={true}
              highlightStyle={highlight}
              style={h2}
              searchWords={[]}
              textToHighlight={item.wineName.replace(`${item.producer}`, '').trim()}
            />
          )}
        </View>

        <WineListItemBody
          subregion={item.locale.subregion}
          searchWord={''}
          varietal={item.varietal}
          vintage={item.vintage}
        />
      </View>
    </TouchableOpacity>
  );
};

export const WishlistItem = Item;
