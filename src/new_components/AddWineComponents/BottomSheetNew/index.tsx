import React from 'react';
import {Text, TouchableOpacity, StyleSheet, View} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import textStyle from '../../../constants/Styles/textStyle';
interface CellItemProps {
  children: any;
  ref: any;
  onPressDone: () => void;
  customCancelText?: string;
  customCancelAction?: () => void;
  sheetContainerBG?: string;
  controls?: boolean;
}

const BottomSheet: React.FC<CellItemProps> = React.forwardRef(
  ({children, onPressDone, sheetContainerBG, controls = true, customCancelText, customCancelAction}, ref) => (
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
          backgroundColor: sheetContainerBG ? sheetContainerBG : 'black',
        },
      }}>
      {controls && (
        <View style={style.container}>
          <TouchableOpacity
            onPress={() => {
              if (customCancelAction) {
                customCancelAction();
              } else {
                (ref as any).current.close();
              }
            }}>
            <Text style={{fontSize: 22, ...textStyle.mediumText, color: 'white'}}>
              {customCancelText ? customCancelText : 'Cancel'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onPressDone()}>
            <Text style={{fontSize: 22, ...textStyle.mediumText, color: 'white'}}>Done</Text>
          </TouchableOpacity>
        </View>
      )}
      {children}
    </RBSheet>
  ),
);

export const BottomSheetNew = BottomSheet;

const style = StyleSheet.create({
  container: {
    height: 40,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
