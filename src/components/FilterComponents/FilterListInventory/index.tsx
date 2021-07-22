import React from 'react';
import {Text, StyleSheet, View} from 'react-native';

interface FilterListProps {
  filters: any;
}

const FilterList: React.FC<FilterListProps> = ({filters}) => {
  return (
    <View style={container}>
      {filters.map(el => {
        return el.values.map(val => (
          <View style={innerContainer}>
            <Text style={text}>{val}</Text>
          </View>
        ));
      })}
    </View>
  );
};
export const FilterListView = FilterList;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingLeft: 15,
    paddingRight: 15,
  },
  text: {
    fontSize: 20,
  },
  innerContainer: {
    borderWidth: 1,
    padding: 5,
    borderRadius: 7,
    marginLeft: 9,
    marginBottom: 7,
  },
});
const {container, text, innerContainer} = styles;
