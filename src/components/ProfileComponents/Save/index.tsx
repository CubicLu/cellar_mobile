import React from 'react';
import {Text, TouchableOpacity, StyleSheet} from 'react-native';
interface CellItemProps {
  onPress: () => void;
  disabled: boolean;
}

const SaveBtn: React.FC<CellItemProps> = ({onPress, disabled}) => {
  return (
    <TouchableOpacity onPress={() => onPress()} disabled={disabled} style={style.clearAllStyle}>
      <Text style={[style.clearAllText, {opacity: disabled ? 0.5 : 1}]}>Save</Text>
    </TouchableOpacity>
  );
};
export const Save = SaveBtn;

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
