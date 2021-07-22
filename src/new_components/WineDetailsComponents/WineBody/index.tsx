import React from 'react';
import {Text, StyleSheet, View, TouchableOpacity} from 'react-native';
import {useQuery} from '@apollo/react-hooks';

import textStyle from '../../../constants/Styles/textStyle';
import {volumes, formatPrice} from '../../../utils/currencies';
import {WineImage} from '../../../components';
import {mapDesignationIdToName} from '../../../utils/other.utils';
import {GET_LOCAL_DESIGNATION_LIST} from '../../../apollo/client/queries/InventoryLocalQueries';

interface EmptyProps {
  wineModel: any;
  color: string;
  children?: any;
  onShowModal: () => void;
  showAveragePrice?: any;
  expectedPrice?: number | undefined;
}

const Body: React.FC<EmptyProps> = ({wineModel, color, children, onShowModal, showAveragePrice, expectedPrice}) => {
  const isImageSetted = wineModel && wineModel.wine.wine.pictureURL !== '';
  const {data: localDesignationList} = useQuery(GET_LOCAL_DESIGNATION_LIST);
  console.log(color);
  return (
    <View style={{minHeight: 300}}>
      <View style={[innerContainer]}>
        {wineModel && (
          <>
            {wineModel.wine.wine.pictureURL === '' ? (
              <WineImage uri={wineModel.wine.wine.pictureURL} />
            ) : (
              <TouchableOpacity onPress={onShowModal}>
                <WineImage uri={wineModel.wine.wine.pictureURL} />
              </TouchableOpacity>
            )}

            <View style={contentStyle}>
              <Text numberOfLines={3} adjustsFontSizeToFit style={[title, {width: '80%'}]}>
                {wineModel.wine.wine.wineTitle}
              </Text>
              <View style={{flexDirection: 'row'}}>
                <Text style={[text, {width: '50%'}]}>Vintage</Text>
                <Text numberOfLines={2} style={[text, {...textStyle.boldText}]}>
                  {wineModel.wine.wine.vintage}
                </Text>
              </View>
              <View style={{flexDirection: 'row'}}>
                <Text style={[text, {width: '50%'}]}>Country: </Text>
                <Text numberOfLines={2} style={[text, {...textStyle.boldText}]}>
                  {wineModel.wine.wine.locale.country}
                </Text>
              </View>
              <View style={{flexDirection: 'row'}}>
                <Text style={[text, {width: '50%'}]}>Region: </Text>
                <Text numberOfLines={2} style={[text, {...textStyle.boldText}]}>
                  {wineModel.wine.wine.locale.region || 'None'}
                </Text>
              </View>
              <View style={{flexDirection: 'row'}}>
                <Text style={[text, {width: '50%'}]}>Subregion: </Text>
                <Text numberOfLines={2} style={[text, {...textStyle.boldText}]}>
                  {wineModel.wine.wine.locale.subregion || 'None'}
                </Text>
              </View>
              <View style={{flexDirection: 'row'}}>
                <Text style={[text, {width: '50%'}]}>Appellation: </Text>
                <Text numberOfLines={2} style={[text, {...textStyle.boldText}]}>
                  {wineModel.wine.wine.locale.appellation || 'None'}
                </Text>
              </View>
              {showAveragePrice ? (
                <View style={{flexDirection: 'row'}}>
                  <Text style={[text, {width: '50%'}]}>Average price:</Text>
                  <Text style={[text, {...textStyle.boldText}]}>${formatPrice(wineModel.wine.wine.price)}</Text>
                </View>
              ) : (
                <View style={{flexDirection: 'row'}}>
                  <Text style={[text, {width: '50%'}]}>{expectedPrice ? 'Expected price' : 'Purchase Price'}:</Text>
                  <Text style={[text, {...textStyle.boldText}]}>
                    ${formatPrice(expectedPrice || wineModel.wine.pricePerBottle)}
                  </Text>
                </View>
              )}
              <View style={{flexDirection: 'row'}}>
                <Text style={[text, {width: '50%'}]}>{'Est. Market Price'}:</Text>
                <Text style={[text, {...textStyle.boldText}]}>${formatPrice(wineModel.wine.wine.marketPrice)}</Text>
              </View>
              <View style={{flexDirection: 'row'}}>
                <Text style={[text, {width: '50%'}]}>Bottle size:</Text>
                <Text numberOfLines={2} style={[text, {...textStyle.boldText}]}>
                  {volumes(wineModel.wine.wine.bottleCapacity)}
                </Text>
              </View>

              {wineModel.wine.wine.cellarDesignation !== 'Unknown' && !showAveragePrice && (
                <View style={{flexDirection: 'row'}}>
                  <Text style={text}>Location: </Text>
                  <Text numberOfLines={2} style={[text, {...textStyle.boldText}]}>
                    {mapDesignationIdToName(
                      wineModel.wine.wine.cellarDesignationId,
                      localDesignationList.designationList,
                    )}
                  </Text>
                </View>
              )}
              <View style={{flexDirection: 'row', marginBottom: 30}}>
                <Text style={text}>Varietal: </Text>
                <Text numberOfLines={1} style={[text, {...textStyle.boldText}]}>
                  {wineModel.wine.wine.varietal}
                </Text>
              </View>
            </View>
          </>
        )}
        {children}
      </View>
    </View>
  );
};
export const WineBody = Body;

const stylesWineDetails = StyleSheet.create({
  innerContainer: {
    // flexDirection: 'row',
    alignItems: 'center',
    minHeight: 300,
    width: '100%',
    paddingTop: 10,
    paddingBottom: 10,
  },
  imageContainer: {
    marginLeft: 10,
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
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
});
const {innerContainer, title, text, colorContainer, contentStyle} = stylesWineDetails;
