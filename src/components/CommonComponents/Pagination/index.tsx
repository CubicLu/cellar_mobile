import React, {FC} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Dimensions} from 'react-native';

import textStyle from '../../../constants/Styles/textStyle';

type Props = {
  active: number;
  changePageAction: (any) => void;
  pages: any[];
  hide: boolean;
};

const screenWidth = Dimensions.get('screen').width;

export const Pagination: FC<Props> = ({active, pages, changePageAction, hide}) => {
  if (hide) {
    return null;
  }

  const renderElement = page => {
    if (page === 'start-ellipsis' || page === 'end-ellipsis') {
      return (
        <View key={page}>
          <Text style={text}>...</Text>
        </View>
      );
    }

    if (page === 'previous' || page === 'next') {
      return (
        <TouchableOpacity key={page} onPress={() => changePageAction(page)} style={[cell, activeCell]}>
          <Text style={[text, textActive]}>{`${page}`.charAt(0).toUpperCase() + `${page}`.substring(1)}</Text>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        key={page}
        onPress={() => changePageAction(page)}
        style={[cell, page === active && activeCell, typeof page === 'string' && navBtn]}>
        <Text style={[text, page === active && textActive]}>
          {`${page}`.charAt(0).toUpperCase() + `${page}`.substring(1)}
        </Text>
      </TouchableOpacity>
    );
  };

  return <View style={container}>{pages.map(renderElement)}</View>;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    flex: 1,
    marginVertical: 20,
    maxWidth: screenWidth,
  },
  text: {
    ...textStyle.robotoBold,
    color: 'rgb(89,89,89)',
  },
  textActive: {
    color: '#fff',
  },
  cell: {
    backgroundColor: 'rgb(29,29,29)',
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeCell: {
    backgroundColor: 'rgb(124,29,34)',
  },
  navBtn: {
    width: 'auto',
    paddingHorizontal: 10,
  },
});

const {text, cell, activeCell, navBtn, textActive, container} = styles;
