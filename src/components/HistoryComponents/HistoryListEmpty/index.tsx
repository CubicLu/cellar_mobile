import React, {FC} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import textStyle from '../../../constants/Styles/textStyle';

type Props = {
  loading: boolean;
};

export const HistoryListEmpty: FC<Props> = ({loading}) => {
  return (
    !loading && (
      <View style={emptyListContainer}>
        <Text style={emptyListText}>No wines in your History, yet</Text>
      </View>
    )
  );
};

const styles = StyleSheet.create({
  emptyListContainer: {marginTop: '25%'},
  emptyListText: {...textStyle.mediumText, textAlign: 'center', fontSize: 25, color: '#fff'},
});

const {emptyListContainer, emptyListText} = styles;
