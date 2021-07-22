import React from 'react';
import {StyleSheet} from 'react-native';
import textStyle from '../../../constants/Styles/textStyle';
import {SearchBar} from 'react-native-elements';
import Colors from '../../../constants/colors';

interface itemProps {
  search: string;
  setSearch: any;
  ref: any;
  loading?: boolean;
  onClear?: () => void;
}

const SearchBarComp: React.FC<itemProps> = React.forwardRef(({search, setSearch, loading, onClear}, ref) => (
  // @ts-ignore
  <SearchBar
    placeholder={'Search...'}
    onChangeText={val => setSearch(val)}
    value={search}
    containerStyle={container}
    inputContainerStyle={inputStyle}
    placeholderTextColor={Colors.borderGreen}
    inputStyle={text}
    returnKeyType={'search'}
    autoCorrect={false}
    showLoading={loading && loading}
    searchIcon={{size: 30}}
    clearIcon={{size: 30}}
    ref={ref}
    selectionColor={'white'}
    onClear={onClear && onClear}
  />
));

export const SearchBarStyled = SearchBarComp;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    borderBottomWidth: 0,
    paddingLeft: 10,
    paddingRight: 10,
  },
  text: {
    fontSize: 24,
    color: 'white',
    ...textStyle.mediumText,
  },
  inputStyle: {
    minHeight: 60,
    backgroundColor: 'black',
    borderWidth: 4,
    borderBottomWidth: 4,
    borderColor: Colors.borderGreen,
    borderRadius: 0,
  },
});
const {container, inputStyle, text} = styles;
