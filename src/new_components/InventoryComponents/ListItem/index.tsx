import React from 'react';
import {Text, StyleSheet, View, TouchableOpacity} from 'react-native';
import Highlighter from 'react-native-highlight-words';
import {useQuery} from '@apollo/react-hooks';

import Colors from '../../../constants/colors';
import {volumes, formatPrice} from '../../../utils/currencies';
import {WineOrangeIcon} from '../../../assets/svgIcons';
import textStyle from '../../../constants/Styles/textStyle';
import {WineImage} from '../../../components';
import {GET_LOCAL_DESIGNATION_LIST} from '../../../apollo/client/queries/InventoryLocalQueries';
import {mapDesignationIdToName} from '../../../utils/other.utils';

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
  searchParam?: string;
  moreAction?: () => void;
  onNavigateToCellar?: () => void;
  onItemPress: () => void;
}

const Item: React.FC<InventoryItemProps> = ({
  quantity,
  pricePerBottle,
  wine,
  search,
  searchParam,
  onItemPress,
  onNavigateToCellar,
}) => {
  const {data: localDesignationList} = useQuery(GET_LOCAL_DESIGNATION_LIST);

  return (
    <TouchableOpacity style={container} onPress={onItemPress}>
      <View style={[colorContainer, {backgroundColor: wine.color}]} />
      <View style={innerContainer}>
        <WineImage uri={wine.pictureURL} />

        <View style={contentStyle}>
          <Highlighter
            autoEscape={true}
            highlightStyle={{...textStyle.boldText, color: Colors.orangeDashboard}}
            style={[title]}
            searchWords={[search]}
            textToHighlight={wine.wineTitle}
            numberOfLines={3}
            adjustsFontSizeToFit
          />
          <View style={{flexDirection: 'row'}}>
            <Text style={[text, {width: '50%'}]}>Vintage</Text>
            <Highlighter
              autoEscape={true}
              highlightStyle={{...textStyle.boldText, color: Colors.orangeDashboard}}
              style={[text, {...textStyle.boldText}]}
              searchWords={searchParam === 'vintage' ? [search] : [search]}
              textToHighlight={`${wine.vintage}`}
              numberOfLines={2}
            />
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text style={[text, {width: '50%'}]}>Country: </Text>
            <Highlighter
              autoEscape={true}
              highlightStyle={{...textStyle.boldText, color: Colors.orangeDashboard}}
              style={[text, {...textStyle.boldText}]}
              searchWords={searchParam === 'country' ? [search] : [search]}
              textToHighlight={`${wine.locale.country}`}
              numberOfLines={2}
            />
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text style={[text, {width: '50%'}]}>Region: </Text>
            <Highlighter
              autoEscape={true}
              highlightStyle={{...textStyle.boldText, color: Colors.orangeDashboard}}
              style={[text, {...textStyle.boldText}]}
              searchWords={searchParam === 'country' ? [search] : [search]}
              textToHighlight={`${wine.locale.region || 'None'}`}
              numberOfLines={2}
            />
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text style={[text, {width: '50%'}]}>Subregion: </Text>
            <Highlighter
              autoEscape={true}
              highlightStyle={{...textStyle.boldText, color: Colors.orangeDashboard}}
              style={[text, {...textStyle.boldText}]}
              searchWords={searchParam === 'subregion' ? [search] : [search]}
              textToHighlight={`${wine.locale.subregion || 'None'}`}
              numberOfLines={2}
            />
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text style={[text, {width: '50%'}]}>Appellation: </Text>
            <Highlighter
              autoEscape={true}
              highlightStyle={{...textStyle.boldText, color: Colors.orangeDashboard}}
              style={[text, {...textStyle.boldText}]}
              searchWords={searchParam === 'country' ? [search] : [search]}
              textToHighlight={`${wine.locale.appellation || 'None'}`}
              numberOfLines={2}
            />
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text style={[text, {width: '50%'}]}>Cost per bottle:</Text>
            <Text style={[text, {...textStyle.boldText}]}>${formatPrice(pricePerBottle)}</Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text style={[text, {width: '50%'}]}>Bottle size:</Text>
            <Text numberOfLines={2} style={[text, {...textStyle.boldText}]}>
              {volumes(wine.bottleCapacity)}
            </Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text style={text}>Varietal: </Text>
            <Text numberOfLines={2} style={[text, {...textStyle.boldText}]}>
              {wine.varietal}
            </Text>
          </View>
          {wine.cellarDesignationId !== 0 && (
            <View style={{flexDirection: 'row'}}>
              <Text style={text}>Location: </Text>
              <Text numberOfLines={2} style={[text, {...textStyle.boldText}]}>
                {mapDesignationIdToName(wine.cellarDesignationId, localDesignationList.designationList)}
              </Text>
            </View>
          )}
          <TouchableOpacity
            onPress={onNavigateToCellar}
            style={{flexDirection: 'row', alignItems: 'flex-end', alignSelf: 'flex-end', marginTop: 10}}>
            <View style={{paddingBottom: 7}}>
              <WineOrangeIcon width={20} height={30} />
            </View>
            <Text
              allowFontScaling={false}
              style={{
                ...textStyle.mediumText,
                color: Colors.orangeDashboard,
                fontSize: 25,
              }}>
              {quantity}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};
export const InventoryListItemNewUI = Item;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.inventoryItemBg,
    marginBottom: 20,
    minHeight: 300,
  },
  innerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 300,
    width: '100%',
    paddingTop: 10,
    paddingBottom: 10,
  },
  imageContainer: {
    marginLeft: 18,
    justifyContent: 'center',
    maxHeight: 300,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  title: {
    color: 'white',
    fontSize: 24,
    ...textStyle.boldText,
    marginBottom: 10,
  },
  text: {
    color: 'white',
    fontSize: 16,
    width: '50%',
    ...textStyle.mediumText,
  },
  colorContainer: {
    height: '100%',
    width: 50,
    position: 'absolute',
  },
  contentStyle: {
    width: '70%',
    marginLeft: 18,
    marginTop: 20,
    marginBottom: -5,
    alignSelf: 'flex-start',
  },
});
const {container, innerContainer, title, text, colorContainer, contentStyle} = styles;
