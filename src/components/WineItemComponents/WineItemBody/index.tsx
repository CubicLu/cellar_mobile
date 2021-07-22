import React, {FC} from 'react';
import {View, Text, StyleSheet, TextProps} from 'react-native';
import Highlighter from 'react-native-highlight-words';
import {useQuery} from '@apollo/react-hooks';

import textStyle from '../../../constants/Styles/textStyle';
import colors from '../../../constants/colors';
import {mapDesignationIdToName} from '../../../utils/other.utils';
import {GET_LOCAL_DESIGNATION_LIST} from '../../../apollo/client/queries/InventoryLocalQueries';

const LeftColProps: TextProps = {
  adjustsFontSizeToFit: true,
  numberOfLines: 1,
};
const RightColProps: TextProps = {
  numberOfLines: 2,
  adjustsFontSizeToFit: true,
};

type Props = {
  searchWord: string;
  vintage?: string;
  subregion?: string;
  varietal?: string;
  locationId?: number;
  bottleCount?: number;
};

const WineItemBody: FC<Props> = ({bottleCount, searchWord = '', vintage, locationId, varietal, subregion}) => {
  const {data: localDesignationList} = useQuery(GET_LOCAL_DESIGNATION_LIST);

  return (
    <View>
      {!!vintage && (
        <View style={infoRow}>
          <View style={flex1}>
            <Text {...LeftColProps} style={[text]}>
              Vintage
            </Text>
          </View>
          <View style={columnRight}>
            <Highlighter
              {...RightColProps}
              autoEscape={true}
              highlightStyle={highlight}
              style={[text, textStyle.boldText]}
              searchWords={[searchWord]}
              textToHighlight={`${vintage}`}
            />
          </View>
        </View>
      )}
      {!!subregion && (
        <View style={infoRow}>
          <View style={flex1}>
            <Text {...LeftColProps} style={[text]}>
              Subregion
            </Text>
          </View>
          <View style={columnRight}>
            <Highlighter
              {...RightColProps}
              autoEscape={true}
              highlightStyle={highlight}
              style={[text, textStyle.boldText]}
              searchWords={[searchWord]}
              textToHighlight={`${subregion || 'None'}`}
            />
          </View>
        </View>
      )}
      {!!varietal && (
        <View style={infoRow}>
          <View style={flex1}>
            <Text {...LeftColProps} style={[text]}>
              Varietal
            </Text>
          </View>
          <View style={columnRight}>
            <Highlighter
              {...RightColProps}
              autoEscape={true}
              highlightStyle={highlight}
              style={[text, textStyle.boldText]}
              searchWords={[searchWord]}
              textToHighlight={`${varietal || 'None'}`}
            />
          </View>
        </View>
      )}
      {!!bottleCount && (
        <View style={infoRow}>
          <View style={flex1}>
            <Text {...LeftColProps} numberOfLines={2} style={[text]}>
              Bottles
            </Text>
          </View>
          <View style={columnRight}>
            <Highlighter
              {...RightColProps}
              autoEscape={true}
              highlightStyle={highlight}
              style={[text, textStyle.boldText]}
              searchWords={[searchWord]}
              textToHighlight={`${bottleCount}`}
            />
          </View>
        </View>
      )}

      {!!locationId && (
        <View style={infoRow}>
          <View style={flex1}>
            <Text {...LeftColProps} style={[text]}>
              Location
            </Text>
          </View>
          <View style={columnRight}>
            <Text numberOfLines={2} style={[text, {...textStyle.boldText}]}>
              {mapDesignationIdToName(locationId, localDesignationList.designationList)}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    color: '#fff',
    fontSize: 15,
    ...textStyle.mediumText,
  },
  columnRight: {flex: 2, paddingRight: 20, paddingLeft: 10},
  highlight: {...textStyle.boldText, color: colors.orangeDashboard},
  infoRow: {flexDirection: 'row', flex: 1},
  flex1: {flex: 1},
});
const {text, highlight, infoRow, flex1, columnRight} = styles;

export const WineListItemBody = WineItemBody;
