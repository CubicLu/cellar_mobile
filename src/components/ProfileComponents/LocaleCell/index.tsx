import React from 'react';
import {Text, TouchableOpacity, StyleSheet} from 'react-native';
interface CellItemProps {
  title: string;
  displayValue: string;
  onPress: () => void;
}

const Cell: React.FC<CellItemProps> = ({title, displayValue, onPress}) => (
  <TouchableOpacity onPress={onPress} style={style.container}>
    <Text style={{fontSize: 22}}>{title}</Text>
    <Text style={{fontSize: 20}}>{displayValue}</Text>
  </TouchableOpacity>
);

export const LocaleCell = Cell;

const style = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    minHeight: 70,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
