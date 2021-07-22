import gql from 'graphql-tag';

export const GET_LOCAL_FILTERS = gql`
  query inventoryFilters {
    inventoryFilters @client
  }
`;

export const GET_LOCAL_SUBFILTERS = gql`
  query subFilters {
    subFilters @client {
      region
      subregion
      appellation
    }
  }
`;

export const GET_LOCAL_INVENTORY_STATE = gql`
  query inventoryState {
    subFilters @client {
      region
      subregion
      appellation
    }
    inventoryFilters @client
  }
`;
