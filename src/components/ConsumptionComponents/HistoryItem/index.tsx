import React from 'react';
import {Text, StyleSheet, TouchableOpacity} from 'react-native';
export interface InventoryItemProps {
  date: string;
  note: string;
  purchaseNote: string;
  onPress: () => void;
}

const Item: React.FC<InventoryItemProps> = ({date, note, purchaseNote, onPress}) => {
  return (
    <TouchableOpacity onPress={() => onPress()} style={container}>
      <Text style={{fontSize: 15}}>
        {note} on {new Date(date).toDateString()}
      </Text>
      {purchaseNote && <Text style={{fontSize: 15}}>{purchaseNote}</Text>}
    </TouchableOpacity>
  );
};
export const HistoryItem = Item;

const styles = StyleSheet.create({
  container: {
    paddingBottom: 10,
    paddingTop: 10,
    borderBottomWidth: 1,
    paddingLeft: 10,
    paddingRight: 10,
  },
});
const {container} = styles;
