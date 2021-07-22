import gql from 'graphql-tag';

export const GET_LOCAL_SALE_FILTERS = gql`
  query {
    saleFilters @client
  }
`;

export const GET_LOCAL_SALE_SUBFILTERS = gql`
  query {
    saleSubFilters @client {
      region
      subregion
      appellation
    }
  }
`;

export const GET_LOCAL_SALE_STATE = gql`
  query {
    saleFilters @client
    saleSubFilters @client {
      region
      subregion
      appellation
    }
  }
`;
