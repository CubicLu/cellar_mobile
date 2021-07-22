import React, {FC, useRef, useState} from 'react';
import {View, Text, StyleSheet, TextInput, TouchableOpacity} from 'react-native';
import textStyle from '../../../constants/Styles/textStyle';

import {BottomSheetNew} from '../../../new_components';
import {LocationItem} from '../../../screens';
import colors from '../../../constants/colors';

type Props = {
  editActive: boolean;
  item: LocationItem;
  onChangeValue: (item: LocationItem) => void;
  setActiveRef: (ref: React.MutableRefObject<TextInput>) => void;
  onSelectLocation?: (location: LocationItem) => void;
};

const Input: FC<Props> = ({editActive, item, onChangeValue, setActiveRef, onSelectLocation}) => {
  const bottomSheet = useRef<any>();
  const inputRef = useRef<TextInput>(null);
  const [currentRowActive, setCurrentRowActive] = useState<boolean>(false);

  const onRename = () => {
    inputRef.current.blur();
    setCurrentRowActive(true);
    setActiveRef(inputRef);

    setTimeout(() => {
      inputRef.current.focus();
    }, 500);

    bottomSheet.current.close();
  };

  const onRowClick = () => {
    if (item.name === 'None') {
      if (!editActive && onSelectLocation) {
        onSelectLocation({id: 0, name: ''});
      }
      return;
    }

    if (editActive) {
      bottomSheet.current.open();
    } else if (onSelectLocation) {
      onSelectLocation(item);
    }
  };

  return (
    <TouchableOpacity onPress={onRowClick} style={inputRow}>
      {!currentRowActive && <View style={overlappingView} />}
      <TextInput
        ref={inputRef}
        value={item.name}
        style={[text]}
        onBlur={() => {
          setCurrentRowActive(false);
        }}
        onChangeText={text => onChangeValue({id: item.id, name: text})}
      />

      <BottomSheetNew sheetContainerBG="transparent" controls={false} onPressDone={() => {}} ref={bottomSheet}>
        <TouchableOpacity style={sheetContainer}>
          <TouchableOpacity style={buttonContainer} onPress={onRename}>
            <Text style={buttonText}>Rename</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </BottomSheetNew>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  text: {color: '#fff', ...textStyle.mediumText, fontSize: 20},
  inputRow: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    borderWidth: 1.5,
    borderTopColor: '#fff',
    borderBottomColor: '#fff',
    paddingVertical: 10,
    backgroundColor: '#000',
    position: 'relative',
    justifyContent: 'space-between',
  },
  overlappingView: {...StyleSheet.absoluteFillObject, backgroundColor: 'transparent', zIndex: 1},
  sheetContainer: {flex: 1, alignItems: 'flex-end', flexDirection: 'row-reverse', paddingBottom: 40},
  buttonContainer: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#000',
    paddingVertical: 10,
    backgroundColor: colors.orangeDashboard,
  },
  buttonText: {
    color: '#fff',
    marginHorizontal: 10,
    fontSize: 20,
    textAlign: 'center',
    ...textStyle.boldText,
    textTransform: 'uppercase',
  },
});

const {text, inputRow, overlappingView, sheetContainer, buttonContainer, buttonText} = styles;

export const DesignationInput = Input;
