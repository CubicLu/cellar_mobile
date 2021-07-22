import React, {FC, useEffect, useState} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import Colors from '../../../constants/colors';
import textStyle from '../../../constants/Styles/textStyle';

type Props = {
  data: [];
};

export const InventoryFiltersText: FC<Props> = ({data}) => {
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    if (data) {
      setSelected(
        data.reduce((t, c) => {
          const key = Object.keys(c)[0];
          let values = [];
          if (c[key]) {
            values = c[key].reduce((total, current) => {
              return total.concat(current.title);
            }, []);
          }

          return t.concat([...values]);
        }, []),
      );
    }
  }, [data]);

  return (
    <ScrollView
      horizontal
      contentContainerStyle={{flexGrow: 1, paddingRight: 6}}
      style={{
        width: '100%',
        flex: 1,
      }}>
      {selected.map((val, index) => (
        <View key={val} style={[container, {marginLeft: index === 0 ? 10 : 6}]}>
          <Text style={text}>{val}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

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
