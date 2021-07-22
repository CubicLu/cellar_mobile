import gql from 'graphql-tag';

export const UPDATE_LOCAL_PROFILE = gql`
  mutation updateLocalProfile($userProfile: User!) {
    updateLocalProfile(userProfile: $userProfile) @client
  }
`;

export const profileMutations = {
  updateLocalProfile: (_, variables, {cache}) => {
    let newProfileVal = variables.userProfile;

    cache.writeData({
      data: {userProfile: newProfileVal},
    });
    return null;
  },
};
