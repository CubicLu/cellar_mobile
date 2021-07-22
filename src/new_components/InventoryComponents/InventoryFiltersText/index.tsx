import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import textStyle from '../../../constants/Styles/textStyle';
import Colors from '../../../constants/colors';

interface itemProps {
  formattedFilters: any;
}

const InventoryFilters: React.FC<itemProps> = ({formattedFilters}) => {
  return (
    <View style={{flex: 1, minHeight: 40}}>
      {formattedFilters && formattedFilters.length !== 0 ? (
        <ScrollView
          horizontal
          contentContainerStyle={{flexGrow: 1, paddingRight: 6}}
          style={{
            width: '100%',
            flex: 1,
          }}>
          {formattedFilters.map((el, index) => {
            return el.values.map((val, indexInner) => (
              <View
                key={el + indexInner}
                style={[
                  container,
                  {
                    marginLeft: index === 0 && indexInner === 0 ? 10 : 6,
                  },
                ]}>
                <Text style={text}>{val}</Text>
              </View>
            ));
          })}
        </ScrollView>
      ) : (
        <View />
      )}
    </View>
  );
};
export const InventoryFiltersText = InventoryFilters;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.orangeDashboard,
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 5,
    paddingBottom: 5,
    marginBottom: 7,
  },
  text: {
    fontSize: 18,
    color: 'white',
    ...textStyle.mediumText,
  },
});
const {container, text} = styles;
