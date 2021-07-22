import React from 'react';
import {Text, TouchableOpacity, StyleSheet} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
interface CellItemProps {
  ref: any;
  onPressCamera: () => void;
  onPressLibrary: () => void;
  onPressRemove: () => void;
  onCancel: () => void;
}

const BottomSheet: React.FC<CellItemProps> = React.forwardRef(
  ({onPressCamera, onCancel, onPressLibrary, onPressRemove}, ref) => (
    <RBSheet
      // @ts-ignore
      ref={ref}
      animationType="fade"
      duration={300}
      height={270}
      customStyles={{
        container: style.container,
      }}>
      <TouchableOpacity onPress={onPressCamera} style={style.touchContainer}>
        <Text style={{color: 'black', fontSize: 22}}>Take photo</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onPressLibrary} style={[style.touchContainer, {marginTop: 10}]}>
        <Text style={{color: 'black', fontSize: 22}}>Pick from library</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onPressRemove} style={[style.touchContainer, {marginTop: 10}]}>
        <Text style={{color: 'black', fontSize: 22}}>Remove</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onCancel} style={[style.touchContainer, {marginTop: 10}]}>
        <Text style={{color: '#007AFF', fontSize: 22}}>Cancel</Text>
      </TouchableOpacity>
    </RBSheet>
  ),
);

export const BottomSheetPhoto = BottomSheet;

const style = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    paddingLeft: 20,
    paddingRight: 20,
  },
  touchContainer: {
    backgroundColor: 'white',
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
