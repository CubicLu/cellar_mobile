import gql from 'graphql-tag';

export const WINE_PRODUCERS = gql`
  query WineProducers($first: Int, $skip: Int, $q: String, $marker: String) {
    wineProducers(first: $first, skip: $skip, q: $q, marker: $marker) {
      marker
      data {
        name
      }
    }
  }
`;

export const GET_LOCATION_SUGGESTION = gql`
  query wineProducerLocaleList($producer: String!, $locale: LocaleInput) {
    wineProducerLocaleList(producer: $producer, locale: $locale) {
      localeList {
        country
        region
        subregion
        appellation
      }
    }
  }
`;
