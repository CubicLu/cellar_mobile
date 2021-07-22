import React, {useRef, useState} from 'react';
import {TextInput} from 'react-native';
import {useDebounce} from './useDebounce';

type useSearchReturnType = {
  search: string;
  debouncedSearch: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  isSearchVisible: boolean;
  setIsSearchVisible: React.Dispatch<React.SetStateAction<boolean>>;
  clearSearch: () => void;
  searchRef: React.Ref<TextInput>;
};

export const useSearch = (): useSearchReturnType => {
  const [search, setSearch] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const searchRef = useRef<TextInput>(null);
  const debouncedSearch = useDebounce(search, 500);

  const clearSearch = () => {
    setSearch('');
  };

  return {search, debouncedSearch, setSearch, isSearchVisible, setIsSearchVisible, clearSearch, searchRef};
};
