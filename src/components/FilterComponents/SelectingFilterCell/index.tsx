import React from 'react';
import {Text, StyleSheet, TouchableHighlight} from 'react-native';

import Colors from '../../../constants/colors';
import _ from 'lodash';

interface SelectingFilterProps {
  selectRow: (item: any, index: number) => void;
  index: number;
  item: any;
  selectedArr: number[];
}

const SelectingFilter: React.FC<SelectingFilterProps> = ({item, index, selectRow, selectedArr}) => {
  return (
    <TouchableHighlight
      onPress={() => selectRow(item, index)}
      style={[
        container,
        {
          backgroundColor: _.includes(selectedArr, index) ? Colors.lightGray : 'transparent',
        },
      ]}
      activeOpacity={1}
      underlayColor={Colors.moreLightGray}>
      <>
        <Text style={text}>{item.title}</Text>
      </>
    </TouchableHighlight>
  );
};
export const SelectingFilterCell = SelectingFilter;

const styles = StyleSheet.create({
  container: {
    minHeight: 60,
    borderBottomWidth: 1,
    justifyContent: 'center',
  },
  text: {
    fontSize: 25,
    paddingLeft: 5,
    paddingRight: 5,
  },
});
const {container, text} = styles;
