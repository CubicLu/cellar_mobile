import React, {FC} from 'react';
import {View, StyleSheet, TouchableOpacity, Dimensions} from 'react-native';

import {BurgerIcon, ChevronLeftIcon, FilterIcon, SearchIcon} from '../../../assets/svgIcons';
import colors from '../../../constants/colors';

type Props = {
  chevron?: boolean;
  onBurger: () => void;
  onPressFilter: () => void;
  onPressSearch: () => void;
};

const screenWidth = Dimensions.get('screen').width;

export const HeaderWithFilter: FC<Props> = ({chevron, onBurger, onPressFilter, onPressSearch}) => {
  return (
    <View style={container}>
      <TouchableOpacity style={leftButtonContainer} onPress={onBurger}>
        {chevron ? <ChevronLeftIcon height={20} width={20} /> : <BurgerIcon height={13} width={20} />}
      </TouchableOpacity>
      <View style={rightContainer}>
        <TouchableOpacity style={filterButtonContainer} onPress={onPressSearch}>
          <SearchIcon height={25} width={25} />
        </TouchableOpacity>
        <TouchableOpacity style={[filterButtonContainer, orangeBg]} onPress={onPressFilter}>
          <FilterIcon height={25} width={25} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  filterButtonContainer: {
    width: 60,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.inventoryItemBg,
  },
  orangeBg: {
    backgroundColor: colors.orangeDashboard,
  },
  leftButtonContainer: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.dashboardRed,
  },
  container: {
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: screenWidth,
  },
  rightContainer: {
    flexDirection: 'row',
  },
});

const {filterButtonContainer, orangeBg, container, leftButtonContainer, rightContainer} = styles;
