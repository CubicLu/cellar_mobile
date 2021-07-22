import React from 'react';
import {Text, TouchableOpacity, StyleSheet} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import textStyle from '../../../constants/Styles/textStyle';
import Colors from '../../../constants/colors';
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
        <Text style={style.text}>Take photo</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onPressLibrary} style={[style.touchContainer, {marginTop: 10}]}>
        <Text style={style.text}>Pick from library</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onPressRemove} style={[style.touchContainer, {marginTop: 10}]}>
        <Text style={style.text}>Remove</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onCancel} style={[style.touchContainer, {marginTop: 10}]}>
        <Text style={[style.text, {color: Colors.orangeDashboard}]}>Cancel</Text>
      </TouchableOpacity>
    </RBSheet>
  ),
);

export const PhotoSheetNew = BottomSheet;

const style = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    paddingLeft: 20,
    paddingRight: 20,
  },
  touchContainer: {
    backgroundColor: 'black',
    height: 50,
    borderColor: Colors.inputBorderGrey,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    ...textStyle.mediumText,
    color: 'white',
    fontSize: 22,
  },
});
