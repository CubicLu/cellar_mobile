import gql from 'graphql-tag';

export const LOCAL_FILTERS = gql`
  {
    listData @client {
      list
    }
  }
`;
