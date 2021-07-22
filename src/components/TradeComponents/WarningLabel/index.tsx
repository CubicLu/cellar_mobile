import React, {FC} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import textStyle from '../../../constants/Styles/textStyle';
import {selectScreenSize} from '../../../utils/other.utils';

type Props = {
  text: string;
};

const Label: FC<Props> = ({text}) => {
  return (
    <View style={warningContainer}>
      <View style={warningIconContainer}>
        <FontAwesomeIcon size={25} color="#fff" name="exclamation" />
      </View>
      <View style={{padding: 20}}>
        <Text style={warningText}>{text}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  warningContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 20,
    minHeight: 100,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  warningIconContainer: {
    backgroundColor: '#E6750E',
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'absolute',
    left: 20,
  },

  warningText: {
    color: '#E6750E',
    fontSize: selectScreenSize(12, 14),
    ...textStyle.boldText,
    textTransform: 'uppercase',
  },
});

const {warningContainer, warningIconContainer, warningText} = styles;

export const WarningLabel = Label;
