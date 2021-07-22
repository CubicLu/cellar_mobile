import React, {FC} from 'react';
import {View, Text, StyleSheet, ViewStyle, StyleProp, TextStyle} from 'react-native';

import textStyle from '../../../constants/Styles/textStyle';

type Props = {
  text: string;
  containerStyles?: StyleProp<ViewStyle>;
  textStyles?: StyleProp<TextStyle>;
  numberOfLines?: number;
};

export const QuotesComment: FC<Props> = ({text, containerStyles, textStyles, numberOfLines = 1}) => {
  return (
    <View style={[commentContainer, containerStyles]}>
      <Text numberOfLines={numberOfLines} ellipsizeMode="tail" style={[commentText, textStyles]}>
        <Text style={quoteText}>“</Text>
        {text}
        <Text style={quoteText}>”</Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  commentContainer: {marginLeft: 10, padding: 5, flexDirection: 'row'},
  commentText: {color: 'gray', ...textStyle.mediumItalic, paddingHorizontal: 10},
  endQuote: {alignSelf: 'flex-end'},
  quoteText: {fontSize: 20},
});

const {commentContainer, commentText, quoteText} = styles;
