import React, {useState, useCallback, useEffect} from 'react';
import {ReturnKeyTypeOptions, KeyboardTypeOptions, StyleSheet, ViewStyle, View, Text, StyleProp} from 'react-native';
import {OutlinedTextField} from 'react-native-material-textfield-label-fixed';
import Colors from '../../../constants/colors';
import textStyle from '../../../constants/Styles/textStyle';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {TouchableOpacity} from 'react-native-gesture-handler';

type Position = {
  x0: number;
  x1: number;
  y0: number;
};
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
  requiredColorValidation: string;
  x1?: number;
  autoCapitalize?: 'characters' | 'words' | 'sentences' | 'none';
  inputContainerStyle?: ViewStyle;
  multiline?: boolean;
  prefix?: string;
  renderLeftAccessory?: Function;
  labelOffset?: Position;
  contentInset?: {
    left: number;
    input: number;
    label: number;
    bottom: number;
  };
  customContainerStyle?: StyleProp<ViewStyle>;
  backgroundLabelColor?: string;
}

export const InputNew: React.FC<Props> = ({
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
  requiredColorValidation,
  x1,
  autoCapitalize,
  inputContainerStyle,
  multiline,
  isPassword,
  renderLeftAccessory,
  labelOffset = {
    x0: 12,
    x1: 0,
    y0: -10,
  },
  contentInset = {
    left: 0,
    input: 3,
    label: 10,
    bottom: 0,
  },
  customContainerStyle,
  backgroundLabelColor = 'black',
}) => {
  const [value, setValue] = useState(valueProps || '');
  const [isPasswordVisible, setIsPasswordVisible] = useState(isPassword);
  const [localError, setError] = useState(error);

  useEffect(() => {
    setValue(valueProps);
  }, [valueProps]);

  useEffect(() => {
    setError(error);
  }, [error]);

  const renderPasswordAccessory = () => {
    let name = isPasswordVisible ? 'visibility-off' : 'visibility';

    return (
      <TouchableOpacity style={pwdAccessory} onPress={() => setIsPasswordVisible(v => !v)}>
        <MaterialIcon size={19} name={name} color={requiredColorValidation} suppressHighlighting={true} />
      </TouchableOpacity>
    );
  };

  const handle = useCallback(
    el => {
      setValue(el.nativeEvent.text);
      onChange && onChange(el.nativeEvent.text);
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
      activeLineWidth={2}
      fontSize={21}
      autoCorrect={false}
      multiline={multiline || false}
      disabledLineWidth={2}
      maxLength={100}
      baseColor={requiredColorValidation}
      containerStyle={[{width: '100%'}, containerStyle]}
      inputContainerStyle={[{height: 50}, inputContainerStyle]}
      autoFocus={autoFocus || false}
      style={[mainStyle, {marginLeft: 22}, customContainerStyle && customContainerStyle]}
      labelOffset={{...labelOffset, ...(x1 && {x1})}}
      contentInset={contentInset}
      renderLeftAccessory={renderLeftAccessory && renderLeftAccessory}
      blurOnSubmit={onBlurKeyboard || false}
      labelTextStyle={[{...textStyle.mediumText}]}
      error={localError}
      titleTextStyle={titleStyle}
      autoCapitalize={autoCapitalize || 'sentences'}
      errorColor={Colors.inputError}
      backgroundLabelColor={backgroundLabelColor}
      ref={getRef}
      secureTextEntry={isPasswordVisible || false}
      renderRightAccessory={isPassword ? renderPasswordAccessory : null}
    />
  );
};

const style = StyleSheet.create({
  titleStyle: {
    ...textStyle.mediumText,
    fontSize: 14,
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 20,
    marginRight: 20,
  },
  mainStyle: {
    fontSize: 21,
    color: 'white',
    ...textStyle.boldText,
    alignSelf: 'center',
  },
  pwdAccessory: {flex: 1, alignItems: 'center', justifyContent: 'center'},
});

const {titleStyle, mainStyle, pwdAccessory} = style;
