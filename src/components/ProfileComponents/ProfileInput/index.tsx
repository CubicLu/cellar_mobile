import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Text, StyleSheet, View, TextInput} from 'react-native';
interface InputProps {
  value: string;
  headerTitle: string;
  onChange: (string) => any;
  placeholder: string;
  validate?: string;
  autoCapitalize?: any;
}

const Input: React.FC<InputProps> = ({
  value: valueProps,
  onChange,
  placeholder,
  headerTitle,
  validate,
  autoCapitalize,
}) => {
  const [value, setValue] = useState(valueProps || '');

  useEffect(() => {
    setValue(valueProps);
  }, [valueProps, placeholder]);

  const handle = useCallback(
    el => {
      setValue(el.nativeEvent.text);
      onChange && onChange(el.nativeEvent.text);
    },
    [onChange],
  );

  const textValidate = useMemo(() => <Text style={style.errorText}>{validate}</Text>, [validate]);
  return (
    <View style={style.container}>
      <View style={style.errorContainer}>
        <Text style={style.headerTitleStyle}>{headerTitle}</Text>
        {textValidate}
      </View>
      <TextInput
        value={value}
        autoCorrect={false}
        onChange={handle}
        placeholder={placeholder}
        blurOnSubmit={true}
        onChangeText={(val: string) => setValue(val)}
        returnKeyType={'done'}
        placeholderTextColor={'gray'}
        underlineColorAndroid="rgba(0,0,0,0)"
        style={style.inputStyle}
        autoCapitalize={autoCapitalize || 'sentences'}
        onSubmitEditing={() => {}}
      />
    </View>
  );
};

export const ProfileInput = Input;

const style = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    marginTop: 10,
    minHeight: 70,
    justifyContent: 'center',
  },
  errorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputStyle: {
    width: '100%',
    fontSize: 22,
    marginBottom: 5,
    marginTop: 5,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    minWidth: '10%',
    textAlign: 'right',
  },
  headerTitleStyle: {
    fontSize: 16,
    minWidth: '10%',
  },
});
