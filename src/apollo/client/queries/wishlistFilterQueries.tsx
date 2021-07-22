import gql from 'graphql-tag';

export const GET_LOCAL_WISHLIST_FILTERS = gql`
  query wishlistFilters {
    wishlistFilters @client
  }
`;

export const GET_LOCAL_WISHLIST_SUBFILTERS = gql`
  query wishlistSubFilters {
    wishlistSubFilters @client {
      region
      subregion
      appellation
    }
  }
`;

export const GET_LOCAL_WISHLIST_STATE = gql`
  query wishlistState {
    wishlistFilters @client
    wishlistSubFilters @client {
      region
      subregion
      appellation
    }
  }
`;
