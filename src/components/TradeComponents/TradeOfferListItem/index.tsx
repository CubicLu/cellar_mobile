import React, {FC} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import textStyles from '../../../constants/Styles/textStyle';
import Colors from '../../../constants/colors';
import {OfferStatus, TradeListType} from '../../../types/trade';
import {selectScreenSize, getReadableStatus} from '../../../utils/other.utils';

type Props = {
  title: string;
  onPress: () => void;
  status: OfferStatus;
  bottleCount: number;
  color?: string;
  section: TradeListType;
  isCountered: boolean;
};

const ListItem: FC<Props> = ({title, onPress, status, bottleCount, color = '#fff', section, isCountered}) => {
  const greenStatus = /DEAL_ACCEPTED/gim.test(status);

  return (
    <TouchableOpacity style={listRow} onPress={onPress}>
      <View style={[colorHL, {backgroundColor: color}]} />
      <View style={listItemContainer}>
        <View>
          <Text allowFontScaling={false} style={listItemHeader}>
            {title}
          </Text>
        </View>
        <View>
          <Text maxFontSizeMultiplier={1.15} style={[listItemStatus, greenStatus && greenStatusStyle]}>
            {getReadableStatus(status, section, isCountered)}
          </Text>
        </View>
      </View>
      <View style={bottleCountContainer}>
        <Text style={listItemCount}>{bottleCount}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  colorHL: {width: 20, backgroundColor: '#fff', height: '100%'},
  listContainer: {
    marginBottom: 30,
  },
  listHeaderContainer: {
    paddingVertical: 18,
    paddingLeft: 20,
    marginBottom: 10,
    backgroundColor: Colors.dashboardRed,
  },
  listHeaderText: {
    fontSize: 11,
    color: '#fff',
    ...textStyles.boldText,
    textTransform: 'uppercase',
  },
  listRow: {
    flexDirection: 'row',
    minHeight: 90,
    alignItems: 'center',
    marginBottom: 10,
  },
  listItemHeader: {
    fontSize: selectScreenSize(16, 22),
    lineHeight: selectScreenSize(18, 24),
    ...textStyles.boldText,
    color: '#fff',
  },
  listItemContainer: {
    paddingLeft: 20,
    paddingRight: selectScreenSize(5, 0),
    flex: 1,
  },
  listItemStatus: {
    fontSize: 14,
    lineHeight: 18,
    color: '#E6750E',
    ...textStyles.boldText,
  },
  greenStatusStyle: {
    color: '#2ECC71',
  },
  listItemCount: {
    fontSize: 16,
    color: '#fff',
    ...textStyles.boldText,
  },
  bottleCountContainer: {justifyContent: 'center', alignItems: 'center', width: 45},
});

const {
  listRow,
  listItemHeader,
  listItemContainer,
  listItemStatus,
  listItemCount,
  greenStatusStyle,
  colorHL,
  bottleCountContainer,
} = styles;

export const OfferListItem = ListItem;
