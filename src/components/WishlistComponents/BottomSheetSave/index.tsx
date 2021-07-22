import React from 'react';
import {Text, TouchableOpacity, StyleSheet} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
interface CellItemProps {
  ref: any;
  onPressInventory: () => void;
  onPressWishlist: () => void;

  onCancel: () => void;
}

const BottomSheet: React.FC<CellItemProps> = React.forwardRef(({onPressInventory, onCancel, onPressWishlist}, ref) => (
  <RBSheet
    // @ts-ignore
    ref={ref}
    animationType="fade"
    duration={300}
    height={210}
    customStyles={{
      container: style.container,
    }}>
    <TouchableOpacity onPress={onPressInventory} style={style.touchContainer}>
      <Text style={{color: 'black', fontSize: 22}}>Save to Inventory</Text>
    </TouchableOpacity>

    <TouchableOpacity onPress={onPressWishlist} style={[style.touchContainer, {marginTop: 10}]}>
      <Text style={{color: 'black', fontSize: 22}}>Save to Wishlist</Text>
    </TouchableOpacity>

    <TouchableOpacity onPress={() => onCancel()} style={[style.touchContainer, {marginTop: 10}]}>
      <Text style={{color: '#007AFF', fontSize: 22}}>Cancel</Text>
    </TouchableOpacity>
  </RBSheet>
));

export const BottomSheetSave = BottomSheet;

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
