import React, {FC, useEffect, useRef, useState} from 'react';
import {StyleSheet} from 'react-native';
import {Picker} from '@davidgovea/react-native-wheel-datepicker';

import {InfoCell} from '../../../new_components/CommonComponents/InfoCell';
import {getYearRange} from '../../../constants/yearsArr';
import {BottomSheetNew} from '../../../new_components/AddWineComponents/BottomSheetNew';

type Props = {
  variant: 'start-date' | 'end-date';
  content: string;
  onPressDone: (val) => void;
  onPressCancel: (Function) => void;
  errorText: string;
};

type onPressArg = () => void;

function renderPicker({variant, content, errorText}: Props, onPressCell: onPressArg) {
  switch (variant) {
    case 'start-date':
      return (
        <InfoCell
          title={'Drink Window: Begin'}
          content={content}
          onPress={onPressCell}
          error={errorText}
          rotate={true}
          required={false}
        />
      );

    case 'end-date':
      return (
        <InfoCell
          title={'Drink Window: End'}
          content={content}
          onPress={onPressCell}
          error={errorText}
          rotate={true}
          required={false}
        />
      );
  }
}

const DrinkWindow: FC<Props> = props => {
  const {onPressCancel, onPressDone, content} = props;
  const [selected, setSelected] = useState(content);
  const ref = useRef<any>();

  useEffect(() => {
    setSelected(content === '' ? `${new Date().getFullYear()}` : content);
  }, [content]);

  const onPress = () => {
    (ref as any).current.open();
  };

  return (
    <>
      {renderPicker(props, onPress)}
      <BottomSheetNew
        customCancelText="Clear"
        customCancelAction={() => onPressCancel(() => ref.current.close())}
        onPressDone={() => {
          onPressDone(selected);
          (ref as any).current.close();
        }}
        ref={ref}>
        <Picker
          style={bottomSheetContainer}
          // @ts-ignore
          itemStyle={whiteColor}
          selectedValue={selected}
          pickerData={getYearRange(2010, new Date().getFullYear() + 15)}
          onValueChange={value => setSelected(value)}
        />
      </BottomSheetNew>
    </>
  );
};

const styles = StyleSheet.create({
  bottomSheetContainer: {
    width: '100%',
    backgroundColor: 'black',
  },
  whiteColor: {color: '#fff'},
});

const {bottomSheetContainer, whiteColor} = styles;

export const DrinkWindowPicker = DrinkWindow;
