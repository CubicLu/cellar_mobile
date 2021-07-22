import React, {FC, useState} from 'react';
import {View, Text, StyleSheet, TextProps, TouchableOpacity} from 'react-native';

import textStyle from '../../../constants/Styles/textStyle';
import {WineType} from '../../../types/wine';
import {ADD_TO_WISHLIST, REMOVE_FROM_WISHLIST} from '../../../apollo/mutations/addOrRemoveWishlist';
import {useMutation} from '@apollo/react-hooks';
import RNProgressHud from 'progress-hud';
import {WishEmptyIcon, WishFilledIcon} from '../../../assets/svgIcons';

import {volumes} from '../../../utils/currencies';
import AsyncStorage from '@react-native-community/async-storage';

interface WineWithPrice extends WineType {
  pricePerBottle: number;
}

type Props = {
  wine: WineWithPrice;
};

const textLeftProps: TextProps = {
  numberOfLines: 2,
  allowFontScaling: true,
  adjustsFontSizeToFit: true,
  maxFontSizeMultiplier: 1.2,
};

const textRightProps: TextProps = {
  numberOfLines: 3,
  allowFontScaling: true,
  adjustsFontSizeToFit: true,
};

const DetailsBody: FC<Props> = ({wine}) => {
  return (
    <View style={detailsContainer}>
      <View style={titleContainer}>
        <Text numberOfLines={3} adjustsFontSizeToFit style={[text, title]}>
          {wine.wineTitle}
        </Text>
      </View>
      <View style={detailsRow}>
        <Text {...textLeftProps} style={[text, flex1]}>
          Vintage
        </Text>
        <Text {...textRightProps} style={[text, flex1, textRight]}>
          {wine.vintage}
        </Text>
      </View>
      <View style={detailsRow}>
        <Text {...textLeftProps} style={[text, flex1]}>
          Country
        </Text>
        <Text {...textRightProps} style={[text, flex1, textRight]}>
          {wine.locale.country}
        </Text>
      </View>
      <View style={detailsRow}>
        <Text {...textLeftProps} style={[text, flex1]}>
          Region
        </Text>
        <Text {...textRightProps} style={[text, flex1, textRight]}>
          {wine.locale.region}
        </Text>
      </View>
      <View style={detailsRow}>
        <Text {...textLeftProps} style={[text, flex1]}>
          Subregion
        </Text>
        <Text {...textRightProps} style={[text, flex1, textRight]}>
          {wine.locale.subregion}
        </Text>
      </View>
      <View style={detailsRow}>
        <Text {...textLeftProps} style={[text, flex1]}>
          Appellation
        </Text>
        <Text {...textRightProps} style={[text, flex1, textRight]}>
          {wine.locale.appellation}
        </Text>
      </View>
      <View style={detailsRow}>
        <Text {...textLeftProps} style={[text, flex1]}>
          Purchase price
        </Text>
        <Text {...textRightProps} style={[text, flex1, textRight]}>
          ${wine.pricePerBottle}
        </Text>
      </View>
      <View style={detailsRow}>
        <Text {...textLeftProps} style={[text, flex1]}>
          Bottle size
        </Text>
        <Text {...textRightProps} style={[text, flex1, textRight]}>
          {volumes(wine.bottleCapacity)}
        </Text>
      </View>
      <View style={detailsRow}>
        <Text {...textLeftProps} style={[text, flex1]}>
          Varietal
        </Text>
        <Text {...textRightProps} style={[text, flex1, textRight]}>
          {wine.varietal}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {color: '#fff', fontSize: 16, ...textStyle.mediumText},
  detailsRow: {flexDirection: 'row', alignItems: 'center'},
  flex1: {flex: 1},
  textRight: {...textStyle.boldText},
  title: {...textStyle.boldText, fontSize: 20},
  titleContainer: {paddingBottom: 20},
  detailsContainer: {flex: 1, paddingVertical: 20, marginLeft: 20},
});

const {text, detailsRow, flex1, title, textRight, titleContainer, detailsContainer} = styles;

export const HistoryDetailsBody = DetailsBody;
