import gql from 'graphql-tag';

export const COUNTRIES_FRAGMENT = gql`
  fragment countries on CountriesResponse {
    marker
    data {
      name
    }
  }
`;

export const REGIONS_FRAGMENT = gql`
  fragment regions on RegionsResponse {
    marker
    data {
      name
    }
  }
`;

export const SUBREGIONS_FRAGMENT = gql`
  fragment subregions on SubregionsResponse {
    marker
    data {
      name
    }
  }
`;

export const APPELLATIONS_FRAGMENT = gql`
  fragment appellations on AppellationsResponse {
    marker
    data {
      name
    }
  }
`;

export const GET_LOCALE_LIST = gql`
  query FindLocale(
    $first: Int
    $skip: Int
    $q: String
    $marker: String
    $country: String
    $region: String
    $subregion: String
  ) {
    findLocale(
      first: $first
      skip: $skip
      q: $q
      marker: $marker
      country: $country
      region: $region
      subregion: $subregion
    ) {
      __typename
      ...countries
      ...regions
      ...subregions
      ...appellations
    }
  }
  ${COUNTRIES_FRAGMENT}
  ${REGIONS_FRAGMENT}
  ${SUBREGIONS_FRAGMENT}
  ${APPELLATIONS_FRAGMENT}
`;
