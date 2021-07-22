import React, {FC} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import textStyle from '../../../constants/Styles/textStyle';

type Props = {
  text: string;
};

export const EmptyListComponent: FC<Props> = ({text}) => {
  return (
    <View style={container}>
      <Text style={messageText}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {paddingTop: '33%'},
  messageText: {color: '#fff', ...textStyle.mediumText, fontSize: 20, textAlign: 'center'},
});

const {messageText, container} = styles;
