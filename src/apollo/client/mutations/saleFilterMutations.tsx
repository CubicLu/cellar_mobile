import gql from 'graphql-tag';
import {GET_LOCAL_SALE_FILTERS, GET_LOCAL_SALE_SUBFILTERS} from '../queries';
import {initFilterList} from '../../../constants/inventory';
import {concat} from 'lodash';

export const SET_SALE_LOCAL_SUB_FILTERS = gql`
  mutation($subFilters: String) {
    setSaleLocalSubFilters(subFilters: $subFilters) @client
  }
`;

export const CLEAR_SALE_LOCAL_FILTERS = gql`
  mutation {
    clearSaleLocalFilters @client
  }
`;

export const CLEAR_ONE_LOCAL_SALE_FILTER = gql`
  mutation($title: String) {
    clearOneLocalSaleFilter(title: $title) @client
  }
`;

export const ADD_LOCAL_SALE_FILTER = gql`
  mutation($category: String, $filter: Filter) {
    addLocalSaleFilter(filter: $filter, category: $category) @client
  }
`;

export const filterSaleLocalMutations = {
  addLocalSaleFilter: (_, variables, {client}) => {
    const {category, filter} = variables;
    const selectedFilters = client.readQuery({query: GET_LOCAL_SALE_FILTERS}).saleFilters;

    if (selectedFilters.length < 1) {
      let initialValues = initFilterList.map(el => (el.hasOwnProperty(category) ? {[category]: [filter]} : el));

      client.writeQuery({query: GET_LOCAL_SALE_FILTERS, data: {saleFilters: initialValues}});
    } else {
      const categoryFilters = selectedFilters.map((el: any) => {
        if (el.hasOwnProperty(category) && el[category].includes(filter)) {
          return {
            [category]: el[category].filter(inner => {
              return inner !== filter;
            }),
          };
        } else if (el.hasOwnProperty(category) && !el[category.includes(filter)]) {
          return {[category]: concat(el[category], filter)};
        }
        return el;
      });

      client.writeQuery({query: GET_LOCAL_SALE_FILTERS, data: {saleFilters: categoryFilters}});
    }
    return null;
  },
  clearSaleLocalFilters: (_, __, {client}) => {
    client.writeQuery({query: GET_LOCAL_SALE_FILTERS, data: {saleFilters: initFilterList}});
  },
  clearOneLocalSaleFilter: (_, variables, {client}) => {
    const {title} = variables;
    const selectedFilters = client.readQuery({query: GET_LOCAL_SALE_FILTERS}).saleFilters;

    const newFilters = selectedFilters.map(el => (el.hasOwnProperty(title) ? {[title]: []} : el));

    client.writeQuery({query: GET_LOCAL_SALE_FILTERS, data: {saleFilters: newFilters}});
  },
  setSaleLocalSubFilters: (_, variables, {client}) => {
    const {region, subregion, appellation} = variables.subFilters;

    client.writeQuery({
      query: GET_LOCAL_SALE_SUBFILTERS,
      data: {saleSubFilters: {region, subregion, appellation}},
    });
  },
};
