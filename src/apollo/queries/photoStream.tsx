import gql from 'graphql-tag';

export const GET_LIVE_PHOTOS = gql`
  query($first: Int, $skip: Int) {
    stream__getPosts(first: $first, skip: $skip) {
      count
      data {
        id
        url
        description
        canEdit
        canDelete
        owner {
          id
          firstName
          lastName
          prettyLocationName
          avatarURL
        }
        createdAt
        updatedAt
      }
    }
  }
`;
