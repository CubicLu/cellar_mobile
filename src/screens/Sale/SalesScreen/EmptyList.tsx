import React, {FC} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import textStyle from '../../../constants/Styles/textStyle';

type Props = {
  loading: boolean;
};

const EmptyList: FC<Props> = ({loading}) => {
  if (loading) {
    return null;
  }

  return (
    <View style={container}>
      <Text style={text}>Nothing found</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  text: {color: '#fff', ...textStyle.mediumText, fontSize: 25},
});

const {container, text} = styles;

export default EmptyList;
