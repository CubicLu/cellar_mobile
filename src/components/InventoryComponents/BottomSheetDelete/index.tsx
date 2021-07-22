import React from 'react';
import {Text, TouchableOpacity, StyleSheet} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
interface CellItemProps {
  ref: any;
  onPressDelete: () => void;
  onCancel: () => void;
  title: string;
}

const BottomSheet: React.FC<CellItemProps> = React.forwardRef(({title, onPressDelete, onCancel}, ref) => (
  <RBSheet
    // @ts-ignore
    ref={ref}
    animationType="fade"
    duration={300}
    height={150}
    customStyles={{
      container: container,
    }}>
    <TouchableOpacity onPress={() => onPressDelete()} style={touchContainer}>
      <Text style={buttonText}>{title}</Text>
    </TouchableOpacity>

    <TouchableOpacity onPress={() => onCancel()} style={[touchContainer, {marginTop: 10}]}>
      <Text style={[buttonText, cancelBtnStyle]}>Cancel</Text>
    </TouchableOpacity>
  </RBSheet>
));

export const BottomSheetDelete = BottomSheet;

const style = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    paddingLeft: 20,
    paddingRight: 20,
  },
  touchContainer: {
    backgroundColor: '#000',
    borderWidth: 2,
    borderColor: '#666',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  cancelBtnStyle: {
    color: '#E6750E',
  },
});

const {container, touchContainer, buttonText, cancelBtnStyle} = style;
