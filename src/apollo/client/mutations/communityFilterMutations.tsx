import gql from 'graphql-tag';
import {GET_LOCAL_COMMUNITY_FILTERS, GET_COMM_LOCAL_SUBFILTERS, GET_LOCAL_COMM_STATE} from '../queries';
import {initFilterList} from '../../../constants/inventory';
import {concat} from 'lodash';

export const ADD_COMM_LOCAL_FILTER = gql`
  mutation addCommLocalFilter($category: String, $filter: Filter) {
    addCommLocalFilter(filter: $filter, category: $category) @client
  }
`;

export const CLEAR_COMM_LOCAL_FILTERS = gql`
  mutation clearCommLocalFilters {
    clearCommLocalFilters @client
  }
`;

export const CLEAR_ONE_COMM_LOCAL_FILTER = gql`
  mutation clearCommOneLocalFilter($title: String) {
    clearOneCommLocalFilter(title: $title) @client
  }
`;

export const SET_COMM_LOCAL_SUB_FILTERS = gql`
  mutation setCommSubFilters($subFilters: String) {
    setCommSubFilters(subFilters: $subFilters) @client
  }
`;

export const INIT_COMM_FILTERS = gql`
  mutation initLocalCommunity {
    initLocalCommunity @client
  }
`;

export const RESET_ALL_COMM_LOCAL_FILTERS = gql`
  mutation resetAllLocalFilters {
    resetAllLocalFilters @client
  }
`;

type Filter = {
  title: String;
};

export const communityLocalMutations = {
  addCommLocalFilter: (_, variables, {client}) => {
    const {category, filter} = variables;
    const selectedFilters = client.readQuery({query: GET_LOCAL_COMMUNITY_FILTERS}).communityFilters;

    if (selectedFilters.length < 1) {
      let initialValues = initFilterList.map(el => (el.hasOwnProperty(category) ? {[category]: [filter]} : el));

      client.writeQuery({query: GET_LOCAL_COMMUNITY_FILTERS, data: {communityFilters: initialValues}});
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

      client.writeQuery({
        query: GET_LOCAL_COMMUNITY_FILTERS,
        data: {communityFilters: categoryFilters},
      });
    }
    return null;
  },
  clearCommLocalFilters: (_, __, {client}) => {
    client.writeQuery({query: GET_LOCAL_COMMUNITY_FILTERS, data: {communityFilters: initFilterList}});
  },
  setCommSubFilters: (_, variables, {client}) => {
    const {region, subregion, appellation} = variables.subFilters;
    client.writeQuery({
      query: GET_COMM_LOCAL_SUBFILTERS,
      data: {communitySubFilters: {region, subregion, appellation}},
    });
  },
  clearOneCommLocalFilter: (_, variables, {client}) => {
    const {title} = variables;
    const selectedFilters = client.readQuery({query: GET_LOCAL_COMMUNITY_FILTERS}).communityFilters;
    const newFilters = selectedFilters.map(el => (el.hasOwnProperty(title) ? {[title]: []} : el));
    client.writeQuery({query: GET_LOCAL_COMMUNITY_FILTERS, data: {communityFilters: newFilters}});
  },
  initLocalCommunity: (_, __, {client}) => {
    client.writeQuery({
      query: GET_LOCAL_COMM_STATE,
      data: {communityAppliedFilters: initFilterList, communityFilters: initFilterList},
    });
  },
  resetAllLocalFilters: (_, __, {client}) => {
    client.writeQuery({query: GET_LOCAL_COMMUNITY_FILTERS, data: {communityFilters: initFilterList}});
  },
};
