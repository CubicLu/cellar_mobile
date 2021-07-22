import React from 'react';
import {Text, StyleSheet, View, TouchableOpacity, TextProps} from 'react-native';
import Highlighter from 'react-native-highlight-words';

import colors from '../../../constants/colors';
import textStyle from '../../../constants/Styles/textStyle';
import {WineOrangeIcon} from '../../../assets/svgIcons';
import {WineListItemPhoto, WineListItemBody} from '../..';

export interface InventoryItemProps {
  quantity: number;
  pricePerBottle: number;
  wine: {
    bottleCapacity: number;
    wineName: string;
    wineTitle: string;
    color: string;
    currency: string;
    pictureURL: any;
    price: number;
    vintage: string;
    varietal: string;
    producer: string;
    wineType: string;
    rating: number;
    id: number;
    locale: {
      country: string;
      subregion: string;
      region: string;
      appellation: string;
    };
    cellarDesignationId: number;
  };
  search?: string;
  onNavigateToCellar?: () => void;
  onItemPress: () => void;
}

export const RightColProps: TextProps = {
  numberOfLines: 2,
  adjustsFontSizeToFit: true,
};

const Item: React.FC<InventoryItemProps> = ({quantity, wine, search, onNavigateToCellar, onItemPress}) => {
  return (
    <TouchableOpacity onPress={onItemPress} style={container}>
      <WineListItemPhoto pictureURL={wine.pictureURL + '?' + new Date()} color={wine.color} />

      <View style={infoContainer}>
        <View style={bottleAbsContainer}>
          <TouchableOpacity onPress={onNavigateToCellar} style={bottleTouchable}>
            <View style={bottleIconContainer}>
              <WineOrangeIcon width={20} height={30} />
            </View>
            <Text allowFontScaling={false} style={bottleCountText}>
              {quantity}
            </Text>
          </TouchableOpacity>
        </View>
        <View>
          <View style={producerContainer}>
            <Highlighter
              {...RightColProps}
              autoEscape={true}
              highlightStyle={highlight}
              style={h1}
              searchWords={[search]}
              textToHighlight={wine.producer}
            />
          </View>
          {wine.wineName !== '' && wine.wineName && (
            <Highlighter
              {...RightColProps}
              autoEscape={true}
              highlightStyle={highlight}
              style={h2}
              searchWords={[search]}
              textToHighlight={wine.wineName.replace(`${wine.producer}`, '').trim()}
            />
          )}
        </View>

        <WineListItemBody
          subregion={wine.locale.subregion}
          searchWord={search}
          varietal={wine.varietal}
          vintage={wine.vintage}
          locationId={wine.cellarDesignationId}
        />
      </View>
    </TouchableOpacity>
  );
};
export const InventoryListItem = Item;

export const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.dashboardDarkTab,
    marginBottom: 10,
    flexDirection: 'row',
    minHeight: 150,
  },

  h1: {
    ...textStyle.boldText,
    color: '#fff',
    fontSize: 20,
  },
  producerContainer: {marginRight: 55},
  h2: {
    ...textStyle.mediumText,
    fontSize: 17,
    color: '#fff',
  },

  highlight: {...textStyle.boldText, color: colors.orangeDashboard},
  infoContainer: {flex: 3, paddingVertical: 15, paddingLeft: 15, marginBottom: 10},
  bottleAbsContainer: {position: 'absolute', top: 0, right: 10, zIndex: 1},
  bottleTouchable: {flexDirection: 'row', alignItems: 'flex-end', alignSelf: 'flex-end', marginTop: 10},
  bottleCountText: {
    ...textStyle.mediumText,
    color: colors.orangeDashboard,
    fontSize: 25,
  },
  bottleIconContainer: {paddingBottom: 7},
});
const {
  container,
  h1,
  h2,
  highlight,
  infoContainer,
  producerContainer,
  bottleAbsContainer,
  bottleTouchable,
  bottleCountText,
  bottleIconContainer,
} = styles;
