import React, {FC} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ViewStyle, StyleProp} from 'react-native';
import textStyle from '../../../../constants/Styles/textStyle';

type Props = {
  loading?: boolean;
  disabled?: boolean;
  renderLogo?: () => React.ReactNode;
  disabledText?: string;
  onPress: Function;
  style?: StyleProp<ViewStyle>;
  text?: string;
};

export const PayButton: FC<Props> = ({loading, text, disabled, style, disabledText, onPress, renderLogo}) => {
  const handlePress = event => {
    if (loading || disabled) {
      return;
    }

    if (onPress) {
      onPress(event);
    }
  };

  return (
    <TouchableOpacity activeOpacity={0.6} style={[styles.button, style]} onPress={handlePress}>
      {loading && <ActivityIndicator animating size="large" color="#fff" />}
      {!loading && !disabled && <View>{(renderLogo && renderLogo()) || <Text>{text}</Text>}</View>}
      {!loading && disabled && (
        <Text allowFontScaling={false} adjustsFontSizeToFit numberOfLines={1} style={styles.disabledTextStyle}>
          {disabledText || (renderLogo && renderLogo()) || text}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '100%',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledTextStyle: {...textStyle.boldText, color: '#fff'},
});
