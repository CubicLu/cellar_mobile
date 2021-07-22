import Search from './SearchUtils';
import AsyncStorage from '@react-native-community/async-storage';
import {
  AppellationIcon,
  CountryIcon,
  ProducerIcon,
  RegionIcon,
  SubRegionIcon,
  VarietalIcon,
  VintageIcon,
  DesignationIcon,
} from '../assets/svgIcons';
import React from 'react';
import _ from 'lodash';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export const onRefreshList = (
  searchServer,
  setRefresh,
  searchRef,
  debouncedSearchTerm,
  filters,
  setSkip,
  setInvalidate,
  skip,
  setFlag,
  setMarker,
) => {
  setRefresh(true);
  setTimeout(() => {
    setInvalidate(true);
    if (skip === 0) {
      Search.searchParams(searchServer, debouncedSearchTerm, filters, 0, setMarker);
    } else {
      setSkip(0);
      setFlag(true);
    }
  }, 300);
};

export const onFocusSync = async (
  searchServer,
  scrollRef,
  setInvalidate,
  setFlag,
  debouncedSearchTerm,
  filters,
  setMarker,
  title,
) => {
  const syncString = await AsyncStorage.getItem(title);
  if (syncString) {
    const sync = JSON.parse(syncString);
    if (sync.sync) {
      Search.searchParams(searchServer, debouncedSearchTerm, filters, 0, setMarker);
      setInvalidate(true);
      setFlag(true);
      scrollRef.current && scrollRef.current.scrollToOffset({x: 0, animated: false});
      await AsyncStorage.setItem(title, JSON.stringify({sync: false}));
    }
  }
};
export const flagsToUpdateAll = async () => {
  await AsyncStorage.setItem('Dashboard', JSON.stringify({sync: true}));
  await AsyncStorage.setItem('Filters', JSON.stringify({sync: true}));
  await AsyncStorage.setItem('Inventory', JSON.stringify({sync: true}));
  await AsyncStorage.setItem('Community', JSON.stringify({sync: true}));
  await AsyncStorage.setItem('DrinkHistory', JSON.stringify({sync: true}));
  await AsyncStorage.setItem('Dashboard-price', JSON.stringify({sync: true}));
};

export const flagsToUpdateDashboard = async () => {
  await AsyncStorage.setItem('Dashboard', JSON.stringify({sync: true}));
  await AsyncStorage.setItem('Filters', JSON.stringify({sync: true}));
};

export const getKeyByValue = (map: Map<string, string>, value: string): string => {
  const [key] = Array.from(map).filter(el => el[1] === value);
  if (key) {
    return key[0];
  }
  return '';
};

export const switchIcon = (field: string) => {
  const defaultSize = 50;
  switch (field.toLowerCase()) {
    case 'producer':
      return <ProducerIcon height={defaultSize} width={defaultSize * 1.13} />;
    case 'varietal':
      return <VarietalIcon height={defaultSize} width={defaultSize} />;
    case 'country':
      return <CountryIcon height={defaultSize} width={defaultSize} />;
    case 'region':
      return <RegionIcon height={defaultSize} width={defaultSize} />;
    case 'subregion':
      return <SubRegionIcon height={defaultSize} width={defaultSize * 1.17} />;
    case 'appellation':
      return <AppellationIcon height={defaultSize} width={defaultSize * 0.63} />;
    case 'vintage':
      return <VintageIcon height={defaultSize} width={defaultSize * 0.61} />;
    case 'cellardesignation':
      return <DesignationIcon height={defaultSize} width={defaultSize} />;

    case 'price':
      return <FontAwesome name="dollar" size={42} color={'#fff'} />;

    default:
      return <CountryIcon height={defaultSize} width={defaultSize} />;
  }
};

export const getTitlesFromArray = (filters: {title: string}[]) => {
  if (!filters) {
    return [];
  }
  return filters.reduce((total, current) => {
    return total.concat(current.title);
  }, []);
};

export const handleSearchFilters = (selectedFilters, localSubFilters, setFilters, [filterKey, subFilterKey]) => {
  try {
    if (selectedFilters && localSubFilters) {
      let newLocationFilters = [];

      const dataLocal = _.cloneDeep(selectedFilters[filterKey]);

      if (dataLocal.length < 1) {
        return;
      }

      const reduced = dataLocal.reduce((t, c) => {
        const key = Object.keys(c)[0];
        c[key.toLowerCase()] = c[key];
        delete c[key];
        return {...t, ...c};
      }, {});

      const subKeys = Object.keys(localSubFilters[subFilterKey]);

      let valuesToFind = [];

      subKeys.map(k => {
        reduced[k].map(el => valuesToFind.push([k, el.title]));
      });

      if (valuesToFind.length > 0) {
        const subFilters = localSubFilters[subFilterKey];
        let result = [];

        valuesToFind.map(el => {
          const [key, value] = el;

          const objValues = Object.entries(subFilters[key]);

          objValues.reduce((t, c) => {
            const valtofind = _.flattenDeep(valuesToFind);
            // @ts-ignore
            let titles = getTitlesFromArray(c[1]);
            titles = titles.filter(title => valtofind.includes(title));

            titles.length > 0 && result.push(JSON.stringify({country: c[0], values: titles}));

            return t;
          }, []);

          for (let country in subFilters[key]) {
            subFilters[key][country].filter(c => {
              if (c.title === value) {
                newLocationFilters.push({
                  field: key,
                  values: [...result],
                });
              }
            });
          }
        });
      }

      let newFilters = [
        {field: 'producer', values: getTitlesFromArray(reduced.producer)},
        {field: 'vintage', values: getTitlesFromArray(reduced.vintage)},
        {field: 'varietal', values: getTitlesFromArray(reduced.varietal)},
        {field: 'country', values: getTitlesFromArray(reduced.country)},
        {field: 'cellarDesignation', values: getTitlesFromArray(reduced.cellardesignation)},
        {field: 'price', values: getTitlesFromArray(reduced.price)},
        ...newLocationFilters,
      ];

      setFilters(newFilters);
    }
  } catch (e) {
    console.log(e, 'ee');
    return;
  }
};

export const checkActiveFilters = (array: any[]): boolean => {
  return array.reduce((t, c) => {
    if (t) {
      return t;
    }
    const [key] = Object.keys(c);
    if (c[key].length > 0) {
      return true;
    }
  }, false);
};
