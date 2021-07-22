import React, {FC} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, TextInput} from 'react-native';

import {AddLocationIcon} from '../../../assets/svgIcons';
import textStyle from '../../../constants/Styles/textStyle';

type Props = {
  customVal: string;
  toggle: () => void;
  setCustomVal: (value: string) => void;
  showInput: boolean;
  addField: () => void;
};

const AddFooter: FC<Props> = ({customVal, setCustomVal, addField, showInput, toggle}) => {
  return (
    <View style={container}>
      {showInput ? (
        <View style={inputRow}>
          <TextInput
            value={customVal}
            autoFocus
            style={[missingText, inputContainer]}
            placeholder="Add new"
            placeholderTextColor="#ccc"
            onChangeText={setCustomVal}
          />
          <TouchableOpacity style={okContainer} onPress={addField}>
            <Text style={missingText}>OK</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={missingTouchable} onPress={toggle}>
          <Text style={missingText}>Add missing</Text>
          <AddLocationIcon width={30} height={30} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {marginTop: 10},
  missingTouchable: {flexDirection: 'row', paddingVertical: 10, paddingLeft: 10, justifyContent: 'center'},
  missingText: {fontSize: 24, color: '#fff', ...textStyle.mediumText, marginRight: 5},
  inputRow: {
    flexDirection: 'row',
    borderBottomWidth: 3,
    borderColor: '#fff',
    borderTopWidth: 3,
    paddingHorizontal: 10,
    backgroundColor: '#000',
  },
  inputContainer: {
    flex: 1,
    paddingVertical: 10,
  },
  okContainer: {backgroundColor: '#000', alignItems: 'center', justifyContent: 'center'},
});

const {missingTouchable, missingText, inputContainer, okContainer, inputRow, container} = styles;

export const AddLocationFooter = AddFooter;
