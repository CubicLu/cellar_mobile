import React from 'react';
import {Text, TouchableOpacity, StyleSheet} from 'react-native';
interface CellItemProps {
  onPress: () => void;
  disabled: boolean;
  text?: string;
}

const Clear: React.FC<CellItemProps> = ({onPress, disabled, text}) => {
  return (
    <TouchableOpacity onPress={() => onPress()} disabled={disabled} style={style.clearAllStyle}>
      <Text style={[style.clearAllText, {opacity: disabled ? 0.5 : 1}]}>{text ? text : 'Clear all'}</Text>
    </TouchableOpacity>
  );
};
export const ClearAll = Clear;

const style = StyleSheet.create({
  clearAllStyle: {
    marginRight: 20,
    height: '80%',
    justifyContent: 'center',
  },
  clearAllText: {
    fontSize: 20,
    fontWeight: '700',
  },
});
