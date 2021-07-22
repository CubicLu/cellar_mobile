import React from 'react';
import {Text, StyleSheet, TouchableHighlight} from 'react-native';

import Colors from '../../../constants/colors';
import _ from 'lodash';
import textStyle from '../../../constants/Styles/textStyle';

interface SelectingFilterProps {
  index: number;
  onPress: () => void;
  selectedArr: string[];
  borderStyle?: any;
  title: string;
}

const SelectingFilter: React.FC<SelectingFilterProps> = ({onPress, index, selectedArr, borderStyle, title}) => {
  return (
    <TouchableHighlight
      onPress={onPress}
      style={[
        container,
        {backgroundColor: _.includes(selectedArr, title) ? Colors.orangeDashboard : 'black'},
        borderStyle,
      ]}>
      <Text style={text}>{title}</Text>
    </TouchableHighlight>
  );
};
export const FilterItemNewCell = SelectingFilter;

const styles = StyleSheet.create({
  container: {
    minHeight: 60,
    width: '100%',
    borderTopWidth: 3,
    borderColor: 'white',
    justifyContent: 'center',
    paddingLeft: 10,
    paddingTop: 5,
    paddingBottom: 5,
  },
  text: {
    ...textStyle.mediumText,
    color: 'white',
    fontSize: 24,
  },
});
const {container, text} = styles;
