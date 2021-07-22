import React, {useState, useCallback, useEffect, useMemo} from 'react';
import {KeyboardTypeOptions, Keyboard, View, Text, TouchableOpacity} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';

interface Props {
  placeHolder: string;
  value: string;
  onChange: (value: string) => void;
  keyboardType: KeyboardTypeOptions;
  multiline?: boolean;
  returnKeyType?: string;
  onSubmitEditing?: () => void;
  style: any;
  currency?: string;
  onPressCurrency?: () => void;
  validate?: string;
  autofocus?: boolean;
}

const InputText: React.FC<Props> = ({
  placeHolder,
  value: valueProps,
  onChange,
  keyboardType = 'default',
  multiline = false,
  returnKeyType = 'done',
  onSubmitEditing = () => Keyboard.dismiss(),
  currency,
  style,
  onPressCurrency,
  validate,
  autofocus = false,
}) => {
  const [value, setValue] = useState(valueProps || '');

  useEffect(() => {
    setValue(valueProps);
  }, [valueProps, placeHolder]);

  const handle = useCallback(
    el => {
      setValue(el.nativeEvent.text);
      onChange && onChange(el.nativeEvent.text);
    },
    [onChange],
  );

  const textValidate = useMemo(
    () => (
      <View style={{position: 'absolute', right: 0, top: 5}}>
        <Text style={{color: 'red'}}>{validate}</Text>
      </View>
    ),
    [validate],
  );

  return (
    <View>
      {textValidate}
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <TextInput
          value={value}
          autoCorrect={false}
          onChange={handle}
          placeholder={placeHolder}
          returnKeyType={returnKeyType}
          multiline={multiline}
          autoFocus={autofocus}
          placeholderTextColor={'gray'}
          onChangeText={(val: string) => setValue(val)}
          style={[{minHeight: 70, fontSize: 24, color: 'black'}, style]}
          autoCapitalize="sentences"
          onSubmitEditing={onSubmitEditing}
          secureTextEntry={false}
          keyboardType={keyboardType}
        />
        {currency && (
          <TouchableOpacity onPress={() => onPressCurrency()} style={{justifyContent: 'center'}}>
            <Text style={{fontSize: 20}}>{currency}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export const AdditionInputText = InputText;
