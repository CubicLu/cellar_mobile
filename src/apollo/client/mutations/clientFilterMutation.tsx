import gql from 'graphql-tag';
import {GET_LOCAL_FILTERS, GET_LOCAL_INVENTORY_STATE, GET_LOCAL_SUBFILTERS} from '../queries';
import {initFilterList} from '../../../constants/inventory';
import {concat, find} from 'lodash';

export const ADD_LOCAL_FILTER = gql`
  mutation addLocalFilter($category: String, $filter: Filter) {
    addLocalFilter(filter: $filter, category: $category) @client
  }
`;

export const CLEAR_LOCAL_FILTERS = gql`
  mutation clearLocalFilters {
    clearLocalFilters @client
  }
`;

export const CLEAR_ONE_LOCAL_FILTER = gql`
  mutation clearOneLocalFilter($title: String) {
    clearOneLocalFilter(title: $title) @client
  }
`;

export const APPLY_INVENTORY_FILTERS = gql`
  mutation applyInventoryFilters {
    applyInventoryFilters @client
  }
`;

export const SET_LOCAL_SUB_FILTERS = gql`
  mutation setSubFilters($subFilters: String) {
    setSubFilters(subFilters: $subFilters) @client
  }
`;

export const CLEAR_ALL_INV_FILTERS = gql`
  mutation clearAllInvFilters {
    clearLocalFilters @client
    resetInventoryAppliedFilters @client
  }
`;

export const INIT_INV_FILTERS = gql`
  mutation initLocalInventory {
    initLocalInventory @client
  }
`;

export const ADD_MULTIPLE_LOCAL_FILTERS = gql`
  mutation addMultipleLocalFilters($filters: Object) {
    addMultipleLocalFilters(filters: $filters) @client
  }
`;

export const filterLocalMutations = {
  addLocalFilter: (_, variables, {client}) => {
    const {category, filter} = variables;
    const selectedFilters = client.readQuery({query: GET_LOCAL_FILTERS}).inventoryFilters;

    if (selectedFilters.length < 1) {
      let initialValues = initFilterList.map(el => (el.hasOwnProperty(category) ? {[category]: [filter]} : el));

      client.writeQuery({query: GET_LOCAL_FILTERS, data: {inventoryFilters: initialValues}});
    } else {
      const categoryFilters = selectedFilters.map((el: any) => {
        if (el.hasOwnProperty(category) && !!find(el[category], filter)) {
          return {
            [category]: el[category].filter(f => f.title !== filter.title),
          };
        } else if (el.hasOwnProperty(category) && !el[category.includes(filter)]) {
          return {[category]: concat(el[category], filter)};
        }
        return el;
      });

      client.writeQuery({query: GET_LOCAL_FILTERS, data: {inventoryFilters: categoryFilters}});
    }
    return null;
  },
  clearLocalFilters: (_, __, {client}) => {
    client.writeQuery({query: GET_LOCAL_FILTERS, data: {inventoryFilters: initFilterList}});
  },
  clearOneLocalFilter: (_, variables, {client}) => {
    const {title} = variables;
    const selectedFilters = client.readQuery({query: GET_LOCAL_FILTERS}).inventoryFilters;

    const newFilters = selectedFilters.map(el => (el.hasOwnProperty(title) ? {[title]: []} : el));

    client.writeQuery({query: GET_LOCAL_FILTERS, data: {inventoryFilters: newFilters}});
  },
  setSubFilters: (_, variables, {client}) => {
    const {region, subregion, appellation} = variables.subFilters;
    client.writeQuery({query: GET_LOCAL_SUBFILTERS, data: {subFilters: {region, subregion, appellation}}});
  },

  initLocalInventory: (_, __, {client}) => {
    client.writeQuery({
      query: GET_LOCAL_INVENTORY_STATE,
      data: {inventoryAppliedFilters: initFilterList, inventoryFilters: initFilterList},
    });
  },
  addMultipleLocalFilters: (_, variables, {client}) => {
    const {filters} = variables;
    console.log('addMultipleLocalFilters variables', filters);
    filters.map(el => console.log(el));
    client.writeQuery({query: GET_LOCAL_FILTERS, data: {inventoryFilters: initFilterList}});
  },
};
