import React, {FC} from 'react';
import {View, Text, StyleSheet} from 'react-native';

import {switchIcon} from '../../../utils/inventory.utils';
import textStyle from '../../../constants/Styles/textStyle';
import colors from '../../../constants/colors';

type FilterType = {
  [key: string]: {
    title: string;
    count: number;
  }[];
};

type Props = {
  item: FilterType;
};

const FilterListItem: FC<Props> = ({item}) => {
  const [key] = Object.keys(item);

  if (item[key].length === 0) {
    return null;
  }

  const formatTitle = (title, key) => {
    if (key === 'Price') {
      const price = JSON.parse(title);

      return `${price.min ? (price.max ? '$' + price.min : '>') : '<'}${`${
        price.hasOwnProperty('min') && price.hasOwnProperty('max') ? ' - ' : ''
      }`} ${price.max ? '$' + price.max : '$' + price.min}`;
    } else {
      return title;
    }
  };

  const sortFn = (a, b) => {
    if (a.title < b.title) {
      return -1;
    }
    if (a.title > b.title) {
      return 1;
    }
    return 0;
  };

  return (
    <View style={horizontalContainer}>
      <View>
        {switchIcon(key)}
        <View style={badgeContainer}>
          <View style={badgeBackground}>
            <Text style={badgeText}>{item[key].length}</Text>
          </View>
        </View>
      </View>
      <View style={activeFiltersTextRow}>
        {item[key].sort(sortFn).map(({title}, index) => (
          <View key={index} style={activeFilterTextContainer}>
            <Text style={activeFilterText}>{formatTitle(title, key)}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  horizontalContainer: {paddingLeft: 20, paddingBottom: 15, flexDirection: 'row'},
  badgeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: -4,
    left: 0,
    right: 0,
    alignSelf: 'center',
  },
  badgeText: {
    ...textStyle.mediumText,
    fontSize: 15,
    color: 'white',
  },
  badgeBackground: {
    backgroundColor: colors.orangeDashboard,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 20,
    minHeight: 20,
  },
  activeFiltersTextRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginLeft: 0,
    borderTopLeftRadius: 10,
    overflow: 'hidden',
  },
  activeFilterTextContainer: {borderRadius: 5, overflow: 'hidden', marginLeft: 10},
  activeFilterText: {
    color: '#fff',
    backgroundColor: colors.orangeDashboard,
    padding: 5,
    borderRadius: 14,
    ...textStyle.mediumText,
  },
});

const {
  horizontalContainer,
  badgeContainer,
  badgeText,
  badgeBackground,
  activeFiltersTextRow,
  activeFilterTextContainer,
  activeFilterText,
} = styles;

export const ActiveFilterListItem = FilterListItem;
