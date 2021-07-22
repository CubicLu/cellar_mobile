import React from 'react';
import {Text, TouchableOpacity, StyleSheet, View} from 'react-native';
interface CellItemProps {
  title: string;
  displayValue: string;
  onPress: () => void;
  disabled?: boolean;
  required?: boolean;
  visibleNotListed?: boolean;
}

const AdditionClickableCell: React.FC<CellItemProps> = ({
  title,
  displayValue,
  onPress,
  disabled = false,
  required = false,
  visibleNotListed,
}) =>
  (!disabled || visibleNotListed) && (
    <View style={{marginTop: 5}}>
      {required && displayValue === '' && (
        <View style={{position: 'absolute', right: 0}}>
          <Text style={{color: 'red'}}>Required</Text>
        </View>
      )}
      <TouchableOpacity
        disabled={disabled}
        style={[style.rowStyle, {opacity: disabled ? 0.5 : 1}]}
        onPress={() => onPress()}>
        <Text style={{fontSize: 24, minWidth: '35%'}}>{title}</Text>
        <Text numberOfLines={1} style={{fontSize: 20, maxWidth: '65%', textAlign: 'right'}}>
          {displayValue}
        </Text>
      </TouchableOpacity>
    </View>
  );

export const AdditionClickableCellComponent = AdditionClickableCell;

const style = StyleSheet.create({
  rowStyle: {
    height: 70,
    width: '100%',
    borderBottomWidth: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
});
