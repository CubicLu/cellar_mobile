import React from 'react';
import {Text, StyleSheet, View, TouchableOpacity} from 'react-native';

import Colors from '../../../constants/colors';
import textStyle from '../../../constants/Styles/textStyle';
import {ChevronLeftIcon} from '../../../assets/svgIcons';
import {NavigationScreenProp} from 'react-navigation';

interface HeaderProps {
  clearAll?: () => void;
  navigation: NavigationScreenProp<any>;
  title: string;
  showClear: boolean;
  isDisabled?: boolean;
}

const Header: React.FC<HeaderProps> = ({clearAll, navigation, title, showClear, isDisabled}) => {
  return (
    <View style={header}>
      <View style={filterContainer}>
        <TouchableOpacity style={filterTouchable} onPress={() => navigation.goBack()}>
          <ChevronLeftIcon height={25} width={20} />
        </TouchableOpacity>
      </View>
      <View style={titleContainer}>
        <Text numberOfLines={1} allowFontScaling={false} adjustsFontSizeToFit style={text}>
          {title}
        </Text>
      </View>
      {showClear && (
        <TouchableOpacity onPress={clearAll} disabled={isDisabled} style={clearAllStyle}>
          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            allowFontScaling={false}
            style={[clearText, {color: isDisabled ? Colors.borderGreen : 'white'}]}>
            Clear all
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
export const HeaderFilter = Header;

const styles = StyleSheet.create({
  header: {
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
  },
  text: {
    ...textStyle.mediumText,
    fontSize: 40,
    color: 'white',
    marginLeft: 10,
  },
  filterContainer: {
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.borderGreen,
  },
  filterTouchable: {
    width: 50,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    flex: 1,
    minHeight: 80,
    justifyContent: 'center',
  },
  clearAllStyle: {
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearText: {
    ...textStyle.mediumText,
    fontSize: 18,
  },
});
const {header, filterContainer, filterTouchable, text, titleContainer, clearAllStyle, clearText} = styles;
