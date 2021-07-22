import React from 'react';
import {Text, Image, TouchableOpacity, StyleSheet, View} from 'react-native';
import Images from '../../../assets/images';
interface CellItemProps {
  name: string;
  onPress: () => void;
  selectedFilters: string[];
}

const Cell: React.FC<CellItemProps> = ({name, onPress, selectedFilters}) => {
  return (
    <TouchableOpacity style={style.container} onPress={() => onPress()}>
      <View style={style.innerContainer}>
        <Text style={{fontSize: 30}}>{name}</Text>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          {selectedFilters && selectedFilters.length !== 0 && (
            <Text style={{fontSize: 18}}>({selectedFilters.length})</Text>
          )}
          <Image source={Images.rightChevron} style={style.image} />
        </View>
      </View>
      {selectedFilters &&
        selectedFilters.map(item => {
          return (
            <View>
              <Text style={{fontSize: 25, marginLeft: 30, marginBottom: 5}}>- {item}</Text>
            </View>
          );
        })}
    </TouchableOpacity>
  );
};
export const FilterCell = Cell;

const style = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
  },
  innerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 60,
  },
  image: {
    height: 30,
    width: 30,
  },
});
