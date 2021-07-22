import React, {FC, useState} from 'react';
import {Text, StyleSheet, Keyboard, TouchableOpacity, KeyboardAvoidingView} from 'react-native';

import textStyle from '../../../constants/Styles/textStyle';
import Collapsible from 'react-native-collapsible';
import {Input} from 'react-native-elements';

type Props = {
  message: string;
  setMessage: (val: string) => void;
  isHidden: boolean;
  getButtonText: (boolean) => string;
};

export const CommentInput: FC<Props> = ({message, setMessage, isHidden, getButtonText}) => {
  const [collapsed, setCollapsed] = useState(true);

  if (isHidden) {
    return null;
  }

  return (
    <KeyboardAvoidingView behavior="padding" style={container}>
      <TouchableOpacity onPress={() => setCollapsed(v => !v)}>
        <Text allowFontScaling={false} style={buttonText}>
          <Text>{getButtonText(collapsed)}</Text>
        </Text>
      </TouchableOpacity>
      <Collapsible collapsed={collapsed}>
        <Input
          value={message}
          onEndEditing={() => Keyboard.dismiss()}
          containerStyle={containerStyle}
          onChangeText={setMessage}
          inputContainerStyle={inputContainerStyle}
          multiline
          inputStyle={inputStyle}
          placeholderTextColor="#666666"
          placeholder="Type your comment"
        />
      </Collapsible>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {marginTop: 20, justifyContent: 'flex-end'},
  buttonText: {textAlign: 'right', color: '#E6750E', fontSize: 21, ...textStyle.mediumText},
  inputStyle: {color: '#fff', ...textStyle.mediumText, lineHeight: 28, minHeight: 100, height: '100%'},
  containerStyle: {paddingHorizontal: 0},
  inputContainerStyle: {
    borderWidth: 2,
    borderColor: '#666666',
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: 0,
    marginTop: 10,
    maxHeight: 300,
  },
});

const {buttonText, inputStyle, inputContainerStyle, containerStyle, container} = styles;
