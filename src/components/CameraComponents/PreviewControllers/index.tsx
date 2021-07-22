import React, {FC} from 'react';
import {View, TouchableOpacity, StyleSheet, Text} from 'react-native';
import {RepeatIcon, PlusIcon} from '../../../assets/svgIcons';
import textStyles from '../../../constants/Styles/textStyle';

type Props = {
  onAccept: () => void;
  onDecline: () => void;
};

const Controllers: FC<Props> = ({onAccept, onDecline}) => {
  return (
    <>
      <Text style={text}>Preview</Text>
      <View style={container}>
        <TouchableOpacity style={[controller, {backgroundColor: '#e6750e'}]} onPress={onDecline}>
          <RepeatIcon width={45} height={45} />
        </TouchableOpacity>
        <TouchableOpacity style={[controller, {backgroundColor: '#0B2E33'}]} onPress={onAccept}>
          <PlusIcon width={34} height={34} />
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  controller: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 80,
  },
  text: {
    fontSize: 20,
    fontWeight: '500',
    lineHeight: 27,
    textAlign: 'center',
    ...textStyles.mediumText,
    color: '#fff',
    marginVertical: 24,
  },
});

const {container, controller, text} = styles;

export const PreviewControllers = Controllers;
