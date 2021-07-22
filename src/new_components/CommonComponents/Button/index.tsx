import React from 'react';
import {Text, StyleSheet, TouchableOpacity, StyleProp, TextStyle} from 'react-native';
import textStyle from '../../../constants/Styles/textStyle';

interface Props {
  text: string;
  onPress: (event: Record<string, any>) => void;
  style: object;
  isDisabled?: boolean;
  textStyle?: StyleProp<TextStyle>;
  disabledOpacity?: boolean;
}

const Button: React.FC<Props> = ({text, style, onPress, isDisabled, textStyle, disabledOpacity}) => {
  return (
    <TouchableOpacity
      style={[
        container,
        style,
        {opacity: isDisabled ? 0.7 : 1},
        isDisabled && disabledOpacity ? {opacity: 0.5} : isDisabled && {backgroundColor: 'rgba(255,255,255,0.4)'},
      ]}
      onPress={onPress}
      disabled={isDisabled}>
      <Text style={[styleText, textStyle && textStyle]} adjustsFontSizeToFit allowFontScaling={false}>
        {text}
      </Text>
    </TouchableOpacity>
  );
};
export const ButtonNew = Button;

const styles = StyleSheet.create({
  container: {
    minHeight: 50,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  styleText: {
    color: 'white',
    fontSize: 21,
    ...textStyle.boldText,
  },
});
const {container, styleText} = styles;
