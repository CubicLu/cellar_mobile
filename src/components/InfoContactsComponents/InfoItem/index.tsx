import React from 'react';
import {Text, TouchableOpacity, StyleSheet, View} from 'react-native';
import textStyle from '../../../constants/Styles/textStyle';
import Colors from '../../../constants/colors';
interface InfoItemProps {
  title: string;
  onPress: () => void;
  indicator?: boolean;
}

const Item: React.FC<InfoItemProps> = ({title, onPress, indicator = false}) => (
  <View style={{flexDirection: 'row', justifyContent: 'center'}}>
    <TouchableOpacity onPress={onPress} style={style.container}>
      <Text style={style.text}>{title}</Text>
      {indicator && <View style={style.indicator} />}
    </TouchableOpacity>
  </View>
);

export const InfoItem = Item;

const style = StyleSheet.create({
  container: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: 'white',
    marginTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
    flexDirection: 'row',
  },
  text: {
    ...textStyle.mediumText,
    marginBottom: 20,
    fontSize: 24,
    color: 'white',
  },
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 10,
    backgroundColor: Colors.orangeDashboard,
    alignSelf: 'center',
    marginBottom: 20,
    marginLeft: 10,
  },
});
