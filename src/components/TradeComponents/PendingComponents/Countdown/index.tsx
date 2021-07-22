import React, {FC} from 'react';
import {View, Text, StyleSheet, TextProps} from 'react-native';
import moment from 'moment';
import textStyle from '../../../../constants/Styles/textStyle';

type Props = {
  updatedAt: Date;
};

const textProps: TextProps = {
  allowFontScaling: true,
  adjustsFontSizeToFit: true,
  numberOfLines: 1,
};

export const Countdown: FC<Props> = ({updatedAt}) => {
  return (
    <View style={container}>
      <View style={[row, gap]}>
        <Text {...textProps} style={[left, text]}>
          Date
        </Text>
        <Text {...textProps} style={[right, text]}>
          {moment(updatedAt).format('MM/DD/YYYY')}
        </Text>
      </View>
      <View style={row}>
        <Text {...textProps} style={[left, text]}>
          Left
        </Text>
        <Text {...textProps} style={[right, text]}>
          {moment(updatedAt)
            .add(5, 'days')
            .calendar()
            .toString()}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {backgroundColor: '#64091C', paddingHorizontal: 20, paddingVertical: 20},
  row: {
    flexDirection: 'row',
  },
  gap: {marginBottom: 10},
  left: {flex: 2},
  right: {flex: 3},
  text: {...textStyle.mediumText, color: '#fff', fontSize: 20},
});

const {container, row, left, right, text, gap} = styles;
