import gql from 'graphql-tag';

export const GET_FAQ = gql`
  query Faq {
    faq {
      id
      title
      content
    }
  }
`;

export const GET_RELEASE_LIST = gql`
  query releasesList {
    releasesList {
      releases {
        release
        from
      }
    }
  }
`;

export const GET_RELEASE_ITEM = gql`
  query releaseNotes($release: String!) {
    releaseNotes(release: $release) {
      page
      release
      from
    }
  }
`;
