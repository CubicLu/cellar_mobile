import React, {FC, useCallback, useEffect, useState} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';

import textStyle from '../../../constants/Styles/textStyle';
import Colors from '../../../constants/colors';
import {switchIcon} from '../../../utils/inventory.utils';
type Props = {
  data: {
    inventoryFilters: [];
  };
};

const Icon: FC<Props> = ({data}) => {
  const [icons, setIcons] = useState([]);

  const renderIcons = useCallback(() => {
    if (data) {
      setIcons(
        data.map(el => {
          const [key] = Object.keys(el);
          if (el[key].length > 0) {
            return (
              <View style={outerContainer} key={key}>
                {switchIcon(key)}
                <View style={container}>
                  <View style={countContainer}>
                    <Text style={text}>{el[key].length}</Text>
                  </View>
                </View>
              </View>
            );
          }
        }),
      );
    }
  }, [data]);

  useEffect(() => {
    if (data) {
      renderIcons();
    }
  }, [data]);
  return (
    <View style={{flex: 1, minHeight: 60}}>
      <ScrollView
        horizontal
        contentContainerStyle={{flexGrow: 1, paddingRight: 6}}
        style={{
          width: '100%',
          flex: 1,
        }}>
        {data && icons}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: -4,
    left: 0,
    right: 0,
    alignSelf: 'center',
  },
  text: {
    ...textStyle.mediumText,
    fontSize: 16,
    color: 'white',
  },
  countContainer: {
    backgroundColor: Colors.orangeDashboard,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 20,
    minHeight: 20,
  },
  outerContainer: {
    marginBottom: 20,
    marginLeft: 10,
  },
});
const {container, text, countContainer, outerContainer} = styles;

export const FilterIcons = Icon;
