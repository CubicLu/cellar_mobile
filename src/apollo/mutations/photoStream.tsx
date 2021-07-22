import gql from 'graphql-tag';

export const UPDATE_STREAM_POST = gql`
  mutation($id: Int!, $description: String!) {
    stream__updatePost(id: $id, description: $description)
  }
`;

export const CREATE_STREAM_POST = gql`
  mutation stream__createPost($file: Upload!, $description: String!) {
    stream__createPost(file: $file, description: $description)
  }
`;

export const DELETE_OWN_POST = gql`
  mutation($id: Int!) {
    stream__deletePost(id: $id)
  }
`;
