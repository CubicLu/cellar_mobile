import React from 'react';
import {View, TouchableOpacity} from 'react-native';

import {SearchBarStyled} from '../../../new_components';
import {XMarkIcon} from '../../../assets/svgIcons';
import {styles} from './styles';

const {searchWrapper, innerWrapper, searchContainer, closeIcon} = styles;

const CommunitySearch = ({search, setShowSearch, setSearch, ref}) => {
  return (
    <View style={searchWrapper}>
      <View style={innerWrapper}>
        <View style={searchContainer}>
          <SearchBarStyled search={search} setSearch={setSearch} ref={ref} />
        </View>
        <TouchableOpacity
          style={closeIcon}
          onPress={() => {
            setShowSearch(false);
          }}>
          <XMarkIcon height={13} width={20} />
        </TouchableOpacity>
      </View>
    </View>
  );
};
export const CommunitySearchBar = CommunitySearch;
