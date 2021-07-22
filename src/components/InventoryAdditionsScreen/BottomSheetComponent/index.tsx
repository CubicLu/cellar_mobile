import React from 'react';
import {Text, TouchableOpacity, StyleSheet, View} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
interface CellItemProps {
  children: any;
  ref: any;
  onPressDone: () => void;
}

const BottomSheet: React.FC<CellItemProps> = React.forwardRef(({children, onPressDone}, ref) => (
  <RBSheet
    // @ts-ignore
    ref={ref}
    animationType="fade"
    duration={300}
    customStyles={{
      container: {
        width: '100%',
        paddingLeft: 20,
        paddingRight: 20,
      },
    }}>
    <View style={style.container}>
      <TouchableOpacity onPress={() => (ref as any).current.close()}>
        <Text style={{fontSize: 22}}>Cancel</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onPressDone()}>
        <Text style={{fontSize: 22}}>Done</Text>
      </TouchableOpacity>
    </View>
    {children}
  </RBSheet>
));

export const BottomSheetComponent = BottomSheet;

const style = StyleSheet.create({
  container: {
    height: 40,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
