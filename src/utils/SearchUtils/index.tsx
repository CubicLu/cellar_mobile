import RNProgressHud from 'progress-hud';
import {resetFiltersApollo} from '../handleLocalFilters';
import FilterType from '../../types/filter';
import {FilterObject} from '../../types/localFilters';
import {FIRST, SYNC_MESSAGE, EMPTY_MESSAGE} from '../../constants/inventory';
import moment from 'moment';
import _ from 'lodash';

export function groupStringArrayByFirstLetter(
  list: {
    title: string;
  }[],
) {
  let result = list.reduce((t, c) => {
    const char = c.title.charAt(0);
    if (isLetter(char)) {
      if (!t.hasOwnProperty(char)) {
        t[char] = [c];
      } else {
        t[char] = [...t[char], c];
      }
      return t;
    } else {
      if (!t.hasOwnProperty('#')) {
        t['#'] = [c];
      } else {
        t['#'] = [...t['#'], c];
      }
      return t;
    }
  }, {});
  const temp = result['#'];
  delete result['#'];
  result = {...result, ['#']: temp};

  const keys = Object.keys(result);

  const obj = keys.map(el => {
    return {
      title: el,
      data: result[el],
    };
  });

  return [result, obj];
}

function isLetter(letter: string) {
  const result = letter.match(/[A-Z]/);
  return result ? result.index === 0 : false;
}

export const searchStringInArray = (array, searchWord, callback) => {
  const firstChar = searchWord.charAt(0);
  const firstCharRegexp = /^([A-Z]|#):/i;
  let searchRegexp = new RegExp(searchWord, 'i');

  if (firstCharRegexp.test(searchWord)) {
    searchRegexp = new RegExp(`^${firstChar}`, 'i');
    if (searchWord.includes('#')) {
      searchRegexp = /^(\W|\d|_|\/)/i;
    }
  }
  callback(_.filter(array, el => searchRegexp.test(el.title)));
};

export default class Search {
  static handleShowSearch = (showSearch, setShowSearch, setSearch, search, client, setSkip, filters): void => {
    resetFiltersApollo(client);
    setShowSearch(!showSearch);
    setSearch('');
    if (search || (filters !== undefined && filters.length !== 0)) {
      RNProgressHud.show();
      setSkip(0);
    }
  };

  static searchParams = (searchServer, searchQuery, filters, skip, setMarker) => {
    const reqMarker = moment().unix();
    setMarker(reqMarker);
    searchServer({
      variables: {
        first: FIRST,
        skip,
        q: searchQuery,
        filters,
        marker: reqMarker.toString(),
      },
    });
  };

  static onCompleteSearch = (
    setSearchData,
    setRefresh,
    data,
    setFlag,
    setLoadingFooter,
    invalidate,
    setInvalidate,
    scrollRef,
    searchData,
    marker,
    setMarker,
  ) => {
    setTimeout(() => setLoadingFooter(false), 0);
    const unixMarker = parseInt(data.marker, 0);
    if (moment(marker).isSame(unixMarker) || moment(marker).isBefore(unixMarker)) {
      setMarker(unixMarker);
      if (data.data.length < FIRST) {
        setFlag(false);
      }
      if (invalidate) {
        setSearchData(data.data);
        setInvalidate(false);
      } else {
        searchData.push(...data.data);
        setSearchData(searchData);
      }
      setLoadingFooter(false);
      setTimeout(() => {
        RNProgressHud.dismiss();
      }, 300);
    }
    RNProgressHud.dismiss();
    setRefresh(false);
  };

  static emptySearch = (data, setEmptyMessage, search, filters, syncWithCellarTrackerIsAllowed) => {
    if (!data.data.length && !search && (!filters || filters.length === 0)) {
      if (syncWithCellarTrackerIsAllowed === false) {
        setEmptyMessage(EMPTY_MESSAGE);
        return;
      }
      setEmptyMessage(SYNC_MESSAGE);
    } else {
      setEmptyMessage('');
    }
  };
  static applyFilters = (localFilters, filters, setFilters, setFormattedFilters, setShowSearch, setSkip) => {
    if (localFilters) {
      const dataLocal = JSON.parse(localFilters.listData.list);
      if (dataLocal.length) {
        setShowSearch(true);
      }
      const searchLoc: FilterType[] = [];
      let subregions = [];
      let regions = [];
      let appellation = [];
      dataLocal.map((e: FilterObject) => {
        switch (e.data.field) {
          case 'subregion':
            subregions.push({data: e.data, country: e.country});
            break;
          case 'region':
            regions.push({data: e.data, country: e.country});
            break;
          case 'appellation':
            appellation.push({data: e.data, country: e.country});
            break;
          default:
            searchLoc.push(e.data);
        }
      });
      if (subregions.length) {
        searchLoc.push(Search.setLocaleFilters('subregion', subregions));
      }
      if (regions.length) {
        searchLoc.push(Search.setLocaleFilters('region', regions));
      }
      if (appellation.length) {
        searchLoc.push(Search.setLocaleFilters('appellation', appellation));
      }
      if (JSON.stringify(filters) !== JSON.stringify(searchLoc)) {
        RNProgressHud.show();
        setFilters(searchLoc);
        setFormattedFilters(Search.setFormattedFilters(localFilters));
        setSkip(0);
      }
    }
  };

  static setLocaleFilters = (title: string, data) => {
    const subValues = [];
    data.map(el => {
      subValues.push(JSON.stringify({country: el.country.title, values: el.data.values}));
    });
    return {field: title, values: subValues};
  };

  static setFormattedFilters = localFilters => {
    if (localFilters) {
      const dataLocal = JSON.parse(localFilters.listData.list);
      const formattedArr = [];
      dataLocal.map(el => {
        if (el.title === 'Subregion' || el.title === 'Region' || el.title === 'Appellation') {
          el.data.values.forEach(item => {
            formattedArr.push({
              field: el.title,
              values: [`${el.country.title} - ${item}`],
            });
          });
        } else {
          formattedArr.push(el.data);
        }
      });
      return formattedArr;
    }
  };

  static updatePagination = (setInvalidate, setSkip, setFlag, scrollRef) => {
    setInvalidate(true);
    setFlag(true);
    setSkip(0);
    scrollRef.current && (scrollRef as any).current.scrollToOffset({x: 0, animated: false});
  };
}
