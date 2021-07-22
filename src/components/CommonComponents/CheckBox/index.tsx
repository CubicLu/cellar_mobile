import React, {FC} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, StyleProp, TextStyle} from 'react-native';
import {CheckIcon, CheckMark} from '../../../assets/svgIcons';

type CheckboxVariantType = 'default' | 'fill';

type Props = {
  value: boolean;
  onValueChange: () => void;
  text: string;
  textStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
  backgroundColor?: string;
  variant: CheckboxVariantType;
  containerStyles?: StyleProp<TextStyle>;
};

function getCheckBox(variant, props: Props) {
  const {value, backgroundColor = '#E6750E', containerStyles} = props;

  switch (variant) {
    case 'default': {
      return (
        <View style={[icon, defaultIconContainer, containerStyles && containerStyles]}>
          {value && <CheckIcon width={37} height={37} />}
        </View>
      );
    }

    case 'fill': {
      return (
        <>
          <View style={[backgroundColor && value && {backgroundColor}, fillIconContainer]}>
            {value && <CheckMark color="#fff" width={18} height={15} />}
          </View>
        </>
      );
    }
  }
}

export const CheckBox: FC<Props> = props => {
  const {onValueChange, disabled, variant = 'default', text, textStyle} = props;

  return (
    <TouchableOpacity activeOpacity={0.7} style={[container]} disabled={disabled} onPress={onValueChange}>
      {getCheckBox(variant, props)}
      <Text maxFontSizeMultiplier={2} style={textStyle}>
        {text}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  icon: {
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  defaultIconContainer: {
    borderWidth: 1,
    minWidth: 40,
    minHeight: 40,
  },
  fillIconContainer: {
    padding: 2,
    height: 37,
    width: 37,
    borderWidth: 2,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
});

const {container, defaultIconContainer, fillIconContainer, icon} = styles;
