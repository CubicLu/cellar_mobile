import React from 'react';
import {Text, StyleSheet, TouchableHighlight, View} from 'react-native';

import textStyle from '../../../constants/Styles/textStyle';
import Colors from '../../../constants/colors';
import {ChevronRightIcon} from '../../../assets/svgIcons';

interface SelectingFilterProps {
  onPress: any;
  name: string;
  selectedFilters: number;
}

const MiddleFilter: React.FC<SelectingFilterProps> = ({name, onPress, selectedFilters}) => {
  return (
    <TouchableHighlight onPress={onPress} style={[container]}>
      <View style={innerContainer}>
        <View style={countBox}>
          {selectedFilters > 0 && (
            <View style={countContainer}>
              <Text
                style={{
                  ...textStyle.mediumText,
                  color: 'white',
                  fontSize: 16,
                }}>
                {selectedFilters}
              </Text>
            </View>
          )}
        </View>
        <View style={{width: '80%'}}>
          <Text style={text}>{name}</Text>
        </View>
        <View style={chevronContainer}>
          <ChevronRightIcon height={15} width={15} />
        </View>
      </View>
    </TouchableHighlight>
  );
};
export const MiddleFilterItem = MiddleFilter;

const styles = StyleSheet.create({
  container: {
    minHeight: 60,
    width: '100%',
    borderTopWidth: 3,
    borderColor: 'white',
    justifyContent: 'center',
    backgroundColor: 'black',
  },
  text: {
    ...textStyle.mediumText,
    color: 'white',
    fontSize: 24,
  },
  countBox: {
    width: '10%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  countContainer: {
    height: 25,
    width: 25,
    borderRadius: 14,
    backgroundColor: Colors.orangeDashboard,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chevronContainer: {
    minHeight: 60,
    width: '10%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 5,
    paddingBottom: 5,
  },
});
const {container, text, countBox, countContainer, chevronContainer, innerContainer} = styles;
