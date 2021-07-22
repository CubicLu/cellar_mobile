import React, {FC, useState} from 'react';
import RNProgressHud from 'progress-hud';
import {View, Text, TouchableOpacity} from 'react-native';
import {useMutation} from '@apollo/react-hooks';
import AsyncStorage from '@react-native-community/async-storage';

import styles from './styles';
import {formatAvgPrice, volumes} from '../../../utils/currencies';
import {WishEmptyIcon, WishFilledIcon} from '../../../assets/svgIcons';
import {ADD_TO_WISHLIST, REMOVE_FROM_WISHLIST} from '../../../apollo/mutations/addOrRemoveWishlist';

type Props = {
  wine: {
    wine: {
      id: number;
      producer: string;
      vintage: string;
      wineTitle: string;
      locale: {
        ppellation: string;
        country: string;
        region: string;
        subregion: string;
        appellation: string;
      };
      bottleCapacity: number;
      varietal: string;
      price: number;
      inWishList: boolean;
      generalPriceInfo: {
        market: {
          avg: number;
        };
      };
    };
    quantity: number;
  };
  wishListButton?: boolean;
};

const WineBody: FC<Props> = ({wine: {wine}, wishListButton = false}) => {
  const [isInWish, setInWish] = useState(wine.inWishList);

  const [removeFromWish] = useMutation(REMOVE_FROM_WISHLIST, {
    onCompleted: async () => {
      RNProgressHud.dismiss();
      setInWish(false);
      await AsyncStorage.setItem('Wishlist', JSON.stringify({sync: true}));
    },
    onError: error => {
      console.log(error);
      RNProgressHud.dismiss();
    },
  });

  const [addToWish] = useMutation(ADD_TO_WISHLIST, {
    onCompleted: async () => {
      RNProgressHud.dismiss();
      setInWish(true);
      await AsyncStorage.setItem('Wishlist', JSON.stringify({sync: true}));
    },
    onError: error => {
      console.log(error);
      RNProgressHud.dismiss();
    },
  });

  return (
    <View style={container}>
      <View style={bodyContainer}>
        <View style={bodyRow}>
          <View style={wineBodyColl}>
            <Text style={text}>Producer</Text>
          </View>
          <View style={wineBodyColl}>
            <Text style={textRightColl}>{wine.producer}</Text>
          </View>
        </View>
        <View style={bodyRow}>
          <View style={wineBodyColl}>
            <Text style={text}>Vintage</Text>
          </View>
          <View style={wineBodyColl}>
            <Text style={textRightColl}>{wine.vintage}</Text>
          </View>
        </View>
        <View style={bodyRow}>
          <View style={wineBodyColl}>
            <Text style={text}>Country</Text>
          </View>
          <View style={wineBodyColl}>
            <Text style={textRightColl}>{wine.locale.country}</Text>
          </View>
        </View>
        <View style={bodyRow}>
          <View style={wineBodyColl}>
            <Text style={text}>Region</Text>
          </View>
          <View style={wineBodyColl}>
            <Text style={textRightColl}>{wine.locale.region}</Text>
          </View>
        </View>
        <View style={bodyRow}>
          <View style={wineBodyColl}>
            <Text style={text}>Subregion</Text>
          </View>
          <View style={wineBodyColl}>
            <Text style={textRightColl}>{wine.locale.subregion}</Text>
          </View>
        </View>
        <View style={bodyRow}>
          <View style={wineBodyColl}>
            <Text style={text}>Appellation</Text>
          </View>
          <View style={wineBodyColl}>
            <Text style={textRightColl}>{wine.locale.appellation}</Text>
          </View>
        </View>
        <View style={bodyRow}>
          <View style={wineBodyColl}>
            <Text style={text}>Varietal</Text>
          </View>
          <View style={wineBodyColl}>
            <Text style={textRightColl}>{wine.varietal}</Text>
          </View>
        </View>
        <View style={bodyRow}>
          <View style={wineBodyColl}>
            <Text style={text}>Est. Market Price</Text>
          </View>
          <View style={wineBodyColl}>
            <Text style={textRightColl}>{formatAvgPrice(wine.generalPriceInfo.market.avg)}</Text>
          </View>
        </View>
        <View style={bodyRow}>
          <View style={wineBodyColl}>
            <Text style={text}>Bottle capacity</Text>
          </View>
          <View style={wineBodyColl}>
            <Text style={textRightColl}>{volumes(wine.bottleCapacity)}</Text>
          </View>
        </View>
        {wishListButton && (
          <View style={[bodyRow, {justifyContent: 'flex-end'}]}>
            <TouchableOpacity
              activeOpacity={0.5}
              style={buttonPadding}
              onPress={() => {
                RNProgressHud.show();
                isInWish ? removeFromWish({variables: {wineId: wine.id}}) : addToWish({variables: {wineId: wine.id}});
              }}
              disabled={false}>
              <View>
                {isInWish ? <WishFilledIcon width={25} height={25} /> : <WishEmptyIcon width={25} height={25} />}
              </View>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const {wineBodyColl, text, textRightColl, bodyRow, bodyContainer, container, buttonPadding} = styles;

export const CommunityDetailWineBody = WineBody;
