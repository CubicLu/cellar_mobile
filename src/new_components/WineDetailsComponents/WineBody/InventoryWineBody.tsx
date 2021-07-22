/* eslint-disable react-native/no-inline-styles */
import React, {FC} from 'react';
import {View, Text, StyleSheet, TextProps, Dimensions} from 'react-native';
import {mapDesignationIdToName} from '../../../utils/other.utils';
import {useQuery} from '@apollo/react-hooks';

import textStyle from '../../../constants/Styles/textStyle';
import {GET_LOCAL_DESIGNATION_LIST} from '../../../apollo/client/queries/InventoryLocalQueries';
import {formatPrice, volumes} from '../../../utils/currencies';
import colors from '../../../constants/colors';
import {ButtonNew} from '../../CommonComponents/Button';
import textStyles from '../../../constants/Styles/textStyle';

type Props = {
  wineTitle: string;
  vintage?: string;
  country?: string;
  region?: string;
  subregion?: string;
  appellation?: string;
  pricePerBottle?: number;
  bottleCapacity?: number;
  varietal?: string;
  marketPrice?: number;
  cellarDesignationId?: number;
  onPressEdit?: () => void;
  drinkWindow?: string;
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

const WineBody: FC<Props> = ({
  wineTitle,
  vintage,
  country,
  region,
  subregion,
  appellation,
  pricePerBottle,
  bottleCapacity,
  varietal,

  cellarDesignationId = 0,
  children,
  onPressEdit,
}) => {
  const {data: localDesignationList} = useQuery(GET_LOCAL_DESIGNATION_LIST);

  return (
    <>
      <View style={detailsContainer}>
        <View style={redContainer}>
          {/* <View style={triangle} /> */}

          <Text {...textRightProps} style={[text, flex1, vintageText]}>
            {vintage}
          </Text>
          <Text numberOfLines={3} adjustsFontSizeToFit style={[text, title]}>
            {wineTitle}
          </Text>
          <View style={bootleContainer}>
            <Text {...textLeftProps} style={[text, flex1]}>
              Bottle size:{volumes(bottleCapacity)}
            </Text>
            {children}
          </View>
        </View>

        <View style={infoContainer}>
          <View>
            <Text style={[text, priceLeft]}>${formatPrice(pricePerBottle)}</Text>
            <Text style={[text, {marginRight: 15}]}>Purchase Price</Text>
          </View>
          <View style={borderVertical} />
          <View>
            <Text style={[text, priceRight]}>$0.00</Text>
            <Text style={[text, {marginLeft: 15}]}>Estimated market price</Text>
          </View>
        </View>
        {country && (
          <View style={detailsRow}>
            <Text {...textLeftProps} style={[text, flex1]}>
              Country
            </Text>
            <Text {...textRightProps} style={[text, flex1, textRight]}>
              {country}
            </Text>
          </View>
        )}
        {region && (
          <View style={detailsRow}>
            <Text {...textLeftProps} style={[text, flex1]}>
              Region
            </Text>
            <Text {...textRightProps} style={[text, flex1, textRight]}>
              {region}
            </Text>
          </View>
        )}
        {subregion && (
          <View style={detailsRow}>
            <Text {...textLeftProps} style={[text, flex1]}>
              Subregion
            </Text>
            <Text {...textRightProps} style={[text, flex1, textRight]}>
              {subregion}
            </Text>
          </View>
        )}
        {appellation && (
          <View style={detailsRow}>
            <Text {...textLeftProps} style={[text, flex1]}>
              Appellation
            </Text>
            <Text {...textRightProps} style={[text, flex1, textRight]}>
              {appellation}
            </Text>
          </View>
        )}
        {typeof pricePerBottle !== 'undefined' && (
          <View style={detailsRow}>
            <Text {...textLeftProps} style={[text, flex1]}>
              Purchase Price
            </Text>
            <Text {...textRightProps} style={[text, flex1, textRight]}>
              ${formatPrice(pricePerBottle)}
            </Text>
          </View>
        )}

        {/* {typeof marketPrice !== 'undefined' && (
        <View style={detailsRow}>
          <Text {...textLeftProps} style={[text, flex1]}>
            Est. Market Price
          </Text>
          <Text {...textRightProps} style={[text, flex1, textRight]}>
            ${formatPrice(marketPrice)}
          </Text>
        </View>
      )} */}
        {/* {(bottleCapacity || bottleCapacity === 0) && (
        <View style={detailsRow}>
          <Text {...textLeftProps} style={[text, flex1]}>
            Bottle size
          </Text>
          <Text {...textRightProps} style={[text, flex1, textRight]}>
            {volumes(bottleCapacity)}
          </Text>
        </View>
      )} */}
        {/* {!!drinkWindow && (
        <View style={detailsRow}>
          <Text {...textLeftProps} style={[text, flex1]}>
            Drink Window
          </Text>
          <Text {...textRightProps} style={[text, flex1, textRight]}>
            {drinkWindow}
          </Text>
        </View>
      )} */}
        {cellarDesignationId !== 0 && (
          <View style={detailsRow}>
            <Text {...textLeftProps} style={[text, flex1]}>
              Location
            </Text>
            <Text {...textRightProps} style={[text, flex1, textRight]}>
              {mapDesignationIdToName(cellarDesignationId, localDesignationList.designationList)}
            </Text>
          </View>
        )}

        {varietal && (
          <View style={detailsRow}>
            <Text {...textLeftProps} style={[text, flex1]}>
              Varietal
            </Text>
            <Text {...textRightProps} style={[text, flex1, textRight]}>
              {varietal}
            </Text>
          </View>
        )}
        <ButtonNew text="EDIT WINE" onPress={onPressEdit} style={buttonText} textStyle={button} />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  text: {color: '#fff', fontSize: 16, ...textStyle.mediumText},
  detailsRow: {flexDirection: 'row', alignItems: 'center', marginLeft: 20},
  flexRow: {flexDirection: 'row'},
  flex1: {flex: 1},
  textRight: {...textStyle.boldText},
  title: {...textStyle.boldText, fontSize: 36},
  titleContainer: {paddingBottom: 20, paddingRight: 10},
  titleRightPadding: {paddingRight: 60},
  detailsContainer: {
    position: 'relative',
    backgroundColor: 'black',
    zIndex: 1,
  },
  editContainer: {
    position: 'absolute',
    height: 34,
    width: 34,
    right: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    padding: 5,
  },
  triangle: {
    borderRightWidth: Dimensions.get('screen').width,
    borderBottomWidth: 40,
    borderBottomColor: colors.dashboardRed,
    borderRightColor: 'red',
    borderColor: 'white',
    position: 'absolute',
    zIndex: 1,
    top: -40,
  },
  vintageText: {fontSize: 30, ...textStyle.mediumText},
  bootleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 25,
    marginBottom: 20,
  },
  redContainer: {
    backgroundColor: colors.dashboardRed,
    paddingLeft: 20,
  },
  infoContainer: {
    flexDirection: 'row',
    paddingLeft: 20,
    paddingVertical: 30,
    backgroundColor: colors.dashboardDarkTab,
    marginBottom: 20,
    alignItems: 'center',
  },
  button: {
    backgroundColor: 'transparent',
    paddingVertical: 13,
    borderWidth: 3,
    borderColor: colors.orangeDashboard,
    marginVertical: 40,
    width: '90%',
    textAlign: 'center',
  },
  buttonText: {
    fontSize: 18,
    textTransform: 'uppercase',
    letterSpacing: 1.35,
    ...textStyles.boldText,
  },
  priceLeft: {fontSize: 30, marginRight: 15, ...textStyle.boldText},
  priceRight: {fontSize: 30, marginLeft: 15, ...textStyle.boldText},
  borderVertical: {borderWidth: 1, borderStyle: 'dashed', borderColor: 'white', height: '120%'},
});

const {
  text,
  detailsRow,
  flex1,
  title,
  textRight,
  detailsContainer,
  triangle,
  vintageText,
  bootleContainer,
  redContainer,
  infoContainer,
  button,
  buttonText,
  priceLeft,
  priceRight,
  borderVertical,
} = styles;

export const InventoryWineBody = WineBody;
