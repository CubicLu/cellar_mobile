import React, {FC} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import textStyle from '../../../constants/Styles/textStyle';
import {selectScreenSize} from '../../../utils/other.utils';

type Props = {};

const Label: FC<Props> = () => {
  return (
    <View style={counterStatusContainer}>
      <Text allowFontScaling={false} adjustsFontSizeToFit={true} style={counterStatusText}>
        Final offer
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  counterStatusContainer: {
    backgroundColor: '#fff',
    flexDirection: 'column',
    paddingLeft: 20,
    paddingRight: selectScreenSize(5, 20),
    paddingVertical: 18,
    // maxWidth: selectScreenSize('50%', '40%'),
    maxWidth: '45%',
  },

  counterStatusText: {
    color: '#64091C',
    fontSize: 18,
    lineHeight: 25,
    ...textStyle.boldText,
    textTransform: 'uppercase',
  },
});

const {counterStatusContainer, counterStatusText} = styles;

export const FinalOfferLabel = Label;
