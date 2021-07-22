import React, {useState, useCallback, useEffect} from 'react';
import {ReturnKeyTypeOptions, KeyboardTypeOptions, View} from 'react-native';
import {OutlinedTextField} from 'react-native-material-textfield-label-fixed';
import Colors from '../../../constants/colors';
import textStyle from '../../../constants/Styles/textStyle';

interface Props {
  placeHolder: string;
  value: string;
  onChange: (value: string) => void;
  onSubmitEditing?: () => void;
  getRef?: any;
  keyboardType: KeyboardTypeOptions;
  isPassword?: boolean;
  returnKeyType: ReturnKeyTypeOptions;
  error?: string;
  onBlurKeyboard?: boolean;
  autoFocus?: boolean;
  containerStyle?: any;
}

export const InputMultiline: React.FC<Props> = ({
  placeHolder,
  error,
  value: valueProps,
  onChange,
  onSubmitEditing,
  keyboardType = 'default',
  returnKeyType,
  getRef,
  onBlurKeyboard,
  autoFocus,
  containerStyle,
}) => {
  const [value, setValue] = useState(valueProps || '');
  const [localError, setError] = useState(error);

  useEffect(() => {
    setValue(valueProps);
  }, [valueProps]);

  useEffect(() => {
    setError(error);
  }, [error]);

  const handle = useCallback(
    el => {
      setValue(el.nativeEvent.text);
      onChange && onChange(el.nativeEvent.text);
      setError('');
    },
    [onChange],
  );

  return (
    <OutlinedTextField
      value={value}
      label={placeHolder}
      onChange={handle}
      onChangeText={(val: string) => setValue(val)}
      onSubmitEditing={onSubmitEditing}
      keyboardType={keyboardType}
      tintColor={'white'}
      returnKeyType={returnKeyType}
      lineWidth={2}
      maxLength={150}
      activeLineWidth={2}
      fontSize={21}
      autoCorrect={false}
      disabledLineWidth={2}
      baseColor={Colors.inputBorderGrey}
      containerStyle={[containerStyle, {width: '100%', alignItems: 'flex-start'}]}
      inputContainerStyle={{
        textAlign: 'left',
        paddingTop: 0,
        paddingBottom: 0,
        minHeight: 200,
      }}
      autoFocus={autoFocus || false}
      style={[
        {
          fontSize: 21,
          color: 'white',
          ...textStyle.boldText,
          alignSelf: 'flex-start',
          paddingTop: 0,
          paddingBottom: 0,
          marginLeft: 18,
        },
      ]}
      labelOffset={{
        x0: 10,
        x1: -7,
        y0: -10,
      }}
      contentInset={{
        left: 0,
        input: 0,
        label: 10,
        bottom: 0,
      }}
      multiline={true}
      blurOnSubmit={onBlurKeyboard || false}
      labelTextStyle={[{color: Colors.inputBorderGrey}]}
      error={localError}
      errorColor={Colors.inputError}
      backgroundLabelColor={'black'}
      ref={getRef}
    />
  );
};
