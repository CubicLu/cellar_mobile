/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Text, StyleSheet, TouchableOpacity, View} from 'react-native';
import {NavigationScreenProp} from 'react-navigation';

import textStyle from '../../../constants/Styles/textStyle';
import {Routes} from '../../../constants';

interface ItemProps {
  navigation: NavigationScreenProp<any>;
  onRefresh: () => void;
  el: any;
}

const History: React.FC<ItemProps> = ({navigation, onRefresh, el}) => {
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate(Routes.historyChange.name, {
          historyItem: el,
          onRefresh,
        });
      }}
      style={container}>
      <View style={containerInner}>
        <View style={[badge, {backgroundColor: el.note[0] === 'A' ? '#2A5358' : '#2ECC71'}]} />
        <Text style={bageText}>{el.note}</Text>
      </View>

      <View style={{flexDirection: 'row'}}>
        <View style={line} />
        <View>
          <Text style={[dateText, {marginBottom: el.purchaseNote ? 0 : 35}]}>
            on {new Date(el.purchaseDate).toDateString()}
          </Text>
          {el.purchaseNote && <Text style={purchaseNote}>{el.purchaseNote}</Text>}
        </View>
      </View>
    </TouchableOpacity>
  );
};
export const HistoryItemNew = History;

const style = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 32,
    paddingRight: 40,
    marginBottom: 10,
  },
  text: {
    textAlign: 'center',
    fontSize: 25,
    color: 'white',
    ...textStyle.mediumText,
    marginBottom: 200,
    marginTop: 20,
  },
  containerInner: {flexDirection: 'row', alignItems: 'center', marginBottom: 10},
  badge: {
    width: 16,
    height: 16,
    borderRadius: 100,
    marginRight: 10,
  },
  bageText: {color: 'white', fontSize: 18, letterSpacing: 0.9, ...textStyle.boldText},
  line: {height: '100%', width: 2, backgroundColor: 'white', marginLeft: 7.5, marginRight: 17},
  dateText: {color: '#FFFFFF', opacity: 0.5, fontSize: 16, letterSpacing: 0.8, ...textStyle.mediumText},
  purchaseNote: {color: '#FFFFFF', fontSize: 16, marginTop: 10, marginBottom: 35, ...textStyle.mediumText},
});

const {container, containerInner, badge, bageText, line, dateText, purchaseNote} = style;
