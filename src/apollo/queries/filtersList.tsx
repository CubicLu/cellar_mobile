import gql from 'graphql-tag';

export const FILTERS_LIST = gql`
  query Filters($filters: [SearchInventoryFilter!]) {
    filters(filters: $filters)
  }
`;

export const COMMUNITY_FILTER_LIST = gql`
  query filtersCommunity {
    filtersCommunity
  }
`;

export const WISHLIST_FILTER_LIST = gql`
  query filtersWishlist {
    filtersWishlist
  }
`;

export const GET_CASCADING_FILTERS = gql`
  query Filters($filters: [SearchInventoryFilter!]) {
    filters(filters: $filters)
  }
`;
