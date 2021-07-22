import ApolloClient from 'apollo-client';
import _ from 'lodash';
import LocalFilters, {FilterObject} from '../types/localFilters';

export const resetFiltersApollo = (cache: ApolloClient<any>) => {
  const data = {
    listData: {
      __typename: 'List',
      list: '[]',
    },
  };
  cache.writeData({data});
};

export const resetSubFilters = (title, client, localFilters) => {
  if (localFilters) {
    const localData = JSON.parse(localFilters.listData.list);
    _.remove(localData, (n: FilterObject) => {
      return n.title === title;
    });
    const data = {
      listData: {
        __typename: 'List',
        list: JSON.stringify(localData),
      },
    };
    client.writeData({data});
  }
};

export const setFiltersStore = (
  cache: ApolloClient<any>,
  queryData: string[],
  selectedArr: number[],
  title: string,
  localFilters: LocalFilters,
) => {
  const defaultData = [
    {
      title,
      data: {field: title.toLowerCase(), values: queryData},
      selectedArr,
    },
  ];
  let writeData = _.concat(defaultData);
  if (localFilters) {
    const localData = JSON.parse(localFilters.listData.list);
    _.remove(localData, (n: FilterObject) => {
      return n.title == title;
    });
    if (queryData.length === 0) {
      writeData = localData;
    } else if (localData.length !== 0) {
      writeData = [];
      writeData = _.concat(defaultData, localData);
    }
  }
  const data = {
    listData: {
      __typename: 'List',
      list: JSON.stringify(writeData),
    },
  };
  cache.writeData({data});
};

export const setSubregionsStore = (countryStr, title, selectedValues, selectedArr, localFilters, client) => {
  const defaultData = [
    {
      title,
      data: {field: title.toLowerCase(), values: selectedValues},
      country: {
        title: countryStr,
        selectedArr,
      },
    },
  ];
  let writeData = _.concat(defaultData);
  if (localFilters) {
    const localData = JSON.parse(localFilters.listData.list);
    _.remove(localData, (n: FilterObject) => {
      return n.title === title && n.country && n.country.title === countryStr;
    });
    if (selectedValues.length === 0) {
      writeData = localData;
    } else if (localData.length !== 0) {
      writeData = [];
      writeData = _.concat(defaultData, localData);
    }
  }
  const data = {
    listData: {
      __typename: 'List',
      list: JSON.stringify(writeData),
    },
  };
  client.writeData({data});
};
