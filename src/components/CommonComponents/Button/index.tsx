import React from 'react';
import {Text, StyleSheet, TouchableOpacity} from 'react-native';

interface Props {
  text: string;
  onPress: (event: Record<string, any>) => void;
  style: object;
  isDisabled?: boolean;
}

const ButtonView: React.FC<Props> = ({text, style, onPress, isDisabled}) => {
  return (
    <TouchableOpacity
      style={[container, style, {opacity: isDisabled ? 0.5 : 1}]}
      onPress={onPress}
      disabled={isDisabled}>
      <Text style={{color: 'white', fontSize: 16}} allowFontScaling={false}>
        {text}
      </Text>
    </TouchableOpacity>
  );
};
export const Button = ButtonView;

const styles = StyleSheet.create({
  container: {
    height: 60,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 7,
  },
});
const {container} = styles;
