import React from 'react';
import {Text, StyleSheet, TouchableOpacity, View} from 'react-native';

interface CellItemProps {
  item: any;
  onPress: () => void;
  totalSum: number;
}

const DashboardCell: React.FC<CellItemProps> = ({onPress, item, totalSum}) => {
  return (
    <TouchableOpacity onPress={() => onPress()} style={container}>
      <View style={backLayerProgress}>
        <View
          style={[
            frontLayerProgress,
            {
              width: `${(item.count / totalSum) * 100}%`,
            },
          ]}
        />
        <Text style={text}>
          {item.title.length < 20 ? item.title : item.title.substring(0, 25) + '...'} (
          {((item.count / totalSum) * 100).toFixed(2)}%)
        </Text>
      </View>
      <View style={countBox}>
        <Text style={{fontSize: 20}}>{item.count}</Text>
      </View>
    </TouchableOpacity>
  );
};
export const DashboardCellItem = DashboardCell;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  backLayerProgress: {
    width: '85%',
    height: 40,
    borderRadius: 40,
    backgroundColor: 'rgba(230,213,214, 1)',
    justifyContent: 'center',
  },
  text: {
    alignSelf: 'center',
    fontSize: 16,
    width: '80%',
  },
  frontLayerProgress: {
    minWidth: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(211,141,140, 1)',
    position: 'absolute',
  },
  countBox: {
    height: 40,
    width: '15%',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
});
const {container, backLayerProgress, text, frontLayerProgress, countBox} = styles;
