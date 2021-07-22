import gql from 'graphql-tag';

export const GET_LOCAL_DESIGNATION_LIST = gql`
  query getLocalDesignationList {
    designationList @client
  }
`;
