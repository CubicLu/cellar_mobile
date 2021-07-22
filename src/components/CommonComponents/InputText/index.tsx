import React from 'react';
import {StyleSheet} from 'react-native';
import {Input, InputProps} from 'react-native-elements';
import textStyle from '../../../constants/Styles/textStyle';

interface Props extends InputProps {}

export const InputText: React.FC<Props> = props => {
  const {inputStyle, inputContainerStyle, containerStyle} = props;
  return (
    <Input
      {...props}
      inputContainerStyle={[defaultInputContainerStyle, inputContainerStyle]}
      inputStyle={[defaultInputStyle, inputStyle]}
      containerStyle={[defaultContainerStyle, containerStyle]}
    />
  );
};

const styles = StyleSheet.create({
  defaultInputStyle: {color: '#fff', ...textStyle.mediumText},
  defaultInputContainerStyle: {
    borderBottomWidth: 0,
  },
  defaultContainerStyle: {paddingHorizontal: 0, borderWidth: 2, borderColor: 'gray'},
});

const {defaultInputStyle, defaultInputContainerStyle, defaultContainerStyle} = styles;
