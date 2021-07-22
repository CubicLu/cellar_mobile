import gql from 'graphql-tag';

export const UPDATE_CELLAR_DESIGNATIONS = gql`
  mutation updateCellarDesignations($cellarDesignations: [CellarDesignationInput!]!) {
    updateCellarDesignations(cellarDesignations: $cellarDesignations) {
      cellarDesignations {
        id
        name
      }
      message
    }
  }
`;
