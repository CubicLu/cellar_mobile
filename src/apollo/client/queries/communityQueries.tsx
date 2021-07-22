import gql from 'graphql-tag';

export const GET_LOCAL_COMMUNITY_FILTERS = gql`
  query communityFilters {
    communityFilters @client
  }
`;

export const GET_COMM_LOCAL_SUBFILTERS = gql`
  query communitySubFilters {
    communitySubFilters @client {
      region
      subregion
      appellation
    }
  }
`;

export const GET_LOCAL_COMM_STATE = gql`
  query communityFilterState {
    communityFilters @client
    communitySubFilters @client {
      region
      subregion
      appellation
    }
  }
`;
