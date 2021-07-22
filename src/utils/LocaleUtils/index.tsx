import moment from 'moment';
import {FIRST, FIRST_PRODUCERS} from '../../constants/inventory';
import RNProgressHud from 'progress-hud';
import {NOT_LISTED} from '../../constants/countries';

export const fallbackLocale = {variable: {}, title: 'Country'};

export class LocaleFunctions {
  static handleResponse = (
    data,
    errorString,
    setErrorString,
    marker,
    setMarker,
    requestModel,
    setFlag,
    invalidate,
    search,
    setSearchData,
    setInvalidate,
    searchData,
    setLoadingFooter,
    isEdit,
  ) => {
    if (data) {
      if (errorString) {
        setErrorString(null);
      }
      if (moment(marker).isBefore(moment(data.marker))) {
        setMarker(data.marker);
        if (data.findLocale.data.length < FIRST) {
          setFlag(false);
        }
        if (invalidate) {
          let invData;
          if (search !== '' && isEdit) {
            invData = [{name: search}].concat(data.findLocale.data);
          } else {
            invData = data.findLocale.data;
          }
          setSearchData(invData);
          setInvalidate(false);
        } else {
          searchData.push(...data.findLocale.data.filter(el => el.name !== NOT_LISTED));
          setSearchData(searchData);
        }
        setLoadingFooter(false);
        setTimeout(() => {
          RNProgressHud.dismiss();
        }, 500);
      }
    }
  };

  static serverLocaleRequest = (
    firstLoad,
    setFirstLoad,
    setMarker,
    skip,
    debouncedSearchTerm,
    requestModel,
    getList,
  ) => {
    if (firstLoad) {
      RNProgressHud.show();
      setFirstLoad(false);
    }
    const reqMarker = moment().unix();
    setMarker(reqMarker);
    let variables = {
      first: FIRST_PRODUCERS,
      skip,
      q: debouncedSearchTerm,
      marker: reqMarker.toString(),
    };
    variables = {...variables, ...requestModel.variable};
    getList({
      variables,
    });
  };
}
