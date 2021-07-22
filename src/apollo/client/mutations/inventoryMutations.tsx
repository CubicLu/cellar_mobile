import gql from 'graphql-tag';
import {GET_LOCAL_DESIGNATION_LIST} from '../queries/InventoryLocalQueries';

export const SAVE_DESIGNATION_LIST = gql`
  mutation saveDesignationList($list: Array) {
    saveDesignationList(list: $list) @client
  }
`;

export const inventoryLocalMutations = {
  saveDesignationList: (_, variables, {client}) => {
    const {list} = variables;

    client.writeQuery({
      query: GET_LOCAL_DESIGNATION_LIST,
      data: {designationList: list},
    });
    return null;
  },
};
