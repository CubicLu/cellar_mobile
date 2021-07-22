import gql from 'graphql-tag';
import {GET_LOCAL_WISHLIST_FILTERS, GET_LOCAL_WISHLIST_SUBFILTERS} from '../queries';
import {initFilterList} from '../../../constants/inventory';
import {concat} from 'lodash';

export const SET_WISHLIST_LOCAL_SUB_FILTERS = gql`
  mutation setWishlistLocalSubFilters($subFilters: String) {
    setWishlistLocalSubFilters(subFilters: $subFilters) @client
  }
`;

export const CLEAR_WISHLIST_LOCAL_FILTERS = gql`
  mutation clearWishlistLocalFilters {
    clearWishlistLocalFilters @client
  }
`;

export const CLEAR_ONE_LOCAL_WISHLIST_FILTER = gql`
  mutation clearOneLocalWishlistFilter($title: String) {
    clearOneLocalWishlistFilter(title: $title) @client
  }
`;

export const ADD_LOCAL_WISHLIST_FILTER = gql`
  mutation addLocalWishlistFilter($category: String, $filter: Filter) {
    addLocalWishlistFilter(filter: $filter, category: $category) @client
  }
`;

export const filterWishlistLocalMutations = {
  addLocalWishlistFilter: (_, variables, {client}) => {
    const {category, filter} = variables;
    const selectedFilters = client.readQuery({query: GET_LOCAL_WISHLIST_FILTERS}).wishlistFilters;

    if (selectedFilters.length < 1) {
      let initialValues = initFilterList.map(el => (el.hasOwnProperty(category) ? {[category]: [filter]} : el));

      client.writeQuery({query: GET_LOCAL_WISHLIST_FILTERS, data: {wishlistFilters: initialValues}});
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

      client.writeQuery({query: GET_LOCAL_WISHLIST_FILTERS, data: {wishlistFilters: categoryFilters}});
    }
    return null;
  },
  clearWishlistLocalFilters: (_, __, {client}) => {
    client.writeQuery({query: GET_LOCAL_WISHLIST_FILTERS, data: {wishlistFilters: initFilterList}});
  },
  clearOneLocalWishlistFilter: (_, variables, {client}) => {
    const {title} = variables;
    const selectedFilters = client.readQuery({query: GET_LOCAL_WISHLIST_FILTERS}).wishlistFilters;

    const newFilters = selectedFilters.map(el => (el.hasOwnProperty(title) ? {[title]: []} : el));

    client.writeQuery({query: GET_LOCAL_WISHLIST_FILTERS, data: {wishlistFilters: newFilters}});
  },
  setWishlistLocalSubFilters: (_, variables, {client}) => {
    const {region, subregion, appellation} = variables.subFilters;

    client.writeQuery({
      query: GET_LOCAL_WISHLIST_SUBFILTERS,
      data: {wishlistSubFilters: {region, subregion, appellation}},
    });
  },
};
