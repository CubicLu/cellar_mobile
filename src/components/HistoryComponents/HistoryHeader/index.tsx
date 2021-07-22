import React, {FC} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {OpenBookIcon} from '../../../assets/svgIcons';
import {SearchBarStyled} from '../../../new_components/CommonComponents/SearchBarNew';
import textStyle from '../../../constants/Styles/textStyle';

type Props = {
  isSearchVisible: boolean;
  search?: string;
  setSearch?: any;
  searchRef?: any;
  onSearchClear?: () => void;
  debouncedSearchTerm?: string;
  searchLoading?: boolean;
  title: string;
  withoutBookIcon?: boolean;
};

export const HistoryHeader: FC<Props> = ({
  isSearchVisible,
  search,
  setSearch,
  searchRef,
  onSearchClear,
  debouncedSearchTerm,
  searchLoading,
  title,
  withoutBookIcon,
}) => {
  return (
    <>
      <View style={[listHeaderContainer, {maxWidth: '70%'}]}>
        {!withoutBookIcon && (
          <View style={bookIconContainer}>
            <OpenBookIcon height={50} width={68} />
          </View>
        )}
        <Text allowFontScaling={false} adjustsFontSizeToFit numberOfLines={1} style={listHeaderTitle}>
          {title}
        </Text>
      </View>

      {isSearchVisible && (
        <SearchBarStyled
          search={search}
          setSearch={setSearch}
          ref={searchRef}
          loading={search !== debouncedSearchTerm || searchLoading}
          onClear={onSearchClear}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  listHeaderContainer: {marginLeft: 90, flex: 0.6},
  bookIconContainer: {height: 80, justifyContent: 'center'},
  listHeaderTitle: {color: '#fff', fontSize: 50, ...textStyle.mediumText, marginBottom: 5, paddingBottom: 30},
});

const {bookIconContainer, listHeaderContainer, listHeaderTitle} = styles;
