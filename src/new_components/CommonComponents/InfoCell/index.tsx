import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View, StyleProp, TextStyle} from 'react-native';
import textStyle from '../../../constants/Styles/textStyle';
import Colors from '../../../constants/colors';
import {ChevronRightIcon, LocationIcon} from '../../../assets/svgIcons';

interface itemProps {
  title: string;
  content: string;
  onPress: () => void;
  error: string;
  disabled?: boolean;
  rotate?: boolean;
  required?: boolean;
  containerStyle?: any;
  showArrow?: boolean;
  isChevron?: boolean;
  contentTextStyle?: StyleProp<TextStyle>;
  emptyTitleContainerStyle?: any;
}

export const ChevronItem = ({rotate, chevron}) => (
  <View style={[chevronContainer, {transform: [{rotate: rotate ? '90deg' : '0deg'}]}]}>
    {chevron ? <ChevronRightIcon height={15} width={15} /> : <LocationIcon height={20} width={20} />}
  </View>
);

const Info: React.FC<itemProps> = ({
  title,
  onPress,
  content,
  error,
  disabled,
  rotate,
  required,
  containerStyle,
  showArrow = true,
  isChevron = true,
  contentTextStyle,
  emptyTitleContainerStyle,
}) => {
  const color = () => {
    if (disabled) {
      return 'white';
    }
    if (required && content === '') {
      return Colors.inputError;
    }
    if (error !== '') {
      return Colors.inputError;
    }
    return Colors.inputBorderGrey;
  };

  return (
    <TouchableOpacity onPress={onPress} disabled={disabled}>
      <View
        style={[
          container,
          containerStyle,
          {
            borderColor: color(),
            opacity: disabled ? 0.4 : 1,
          },
        ]}>
        {content !== '' ? (
          <View style={innerContainer}>
            <View style={topLabel}>
              <Text allowFontScaling={false} style={titleText}>
                {title}
              </Text>
            </View>
            <View style={contentContainer}>
              <Text style={[contentText, contentTextStyle && contentTextStyle]}>{content}</Text>
            </View>
            {showArrow && <ChevronItem rotate={rotate} chevron={isChevron} />}
          </View>
        ) : (
          <View style={[emptyTitleContainer, emptyTitleContainerStyle && emptyTitleContainerStyle]}>
            <Text allowFontScaling={false} style={emptyTitle}>
              {title}
            </Text>
            {showArrow && <ChevronItem rotate={rotate} chevron={isChevron} />}
          </View>
        )}
      </View>
      {error !== '' && (
        <View style={errorContainer}>
          <Text style={errorText}>{error}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export const InfoCell = Info;

const styles = StyleSheet.create({
  container: {
    minHeight: 50,
    width: '100%',
    borderWidth: 2,
    marginTop: 20,
    justifyContent: 'center',
  },
  topLabel: {
    paddingLeft: 8.2,
    paddingRight: 8.2,
    backgroundColor: 'black',
    position: 'absolute',
    top: -14,
    left: 12,
  },
  contentText: {
    ...textStyle.boldText,
    fontSize: 21,
    color: 'white',
    marginTop: 5,
    marginBottom: 5,
  },
  titleText: {
    ...textStyle.mediumText,
    fontSize: 16.8,
    color: 'white',
  },
  emptyTitleContainer: {
    backgroundColor: 'black',
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 21,
    flexDirection: 'row',
    alignItems: 'center',
  },
  emptyTitle: {
    ...textStyle.mediumText,
    fontSize: 21,
    color: 'white',
    width: '85%',
  },
  errorContainer: {
    backgroundColor: Colors.inputError,
    justifyContent: 'center',
    minHeight: 50,
  },
  errorText: {
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 20,
    marginRight: 20,
    ...textStyle.mediumText,
    fontSize: 14,
    color: 'white',
  },
  innerContainer: {
    flexDirection: 'row',
    paddingLeft: 21,
  },
  chevronContainer: {
    width: '15%',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  contentContainer: {
    width: '85%',
    paddingTop: 5,
    paddingBottom: 5,
  },
});
const {
  container,
  topLabel,
  contentText,
  titleText,
  emptyTitleContainer,
  emptyTitle,
  errorContainer,
  errorText,
  innerContainer,
  chevronContainer,
  contentContainer,
} = styles;
