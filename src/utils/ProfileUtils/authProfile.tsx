import {checkAvatarStateChange, deleteSame} from '../other.utils';
import RNProgressHud from 'progress-hud';

export const updateProfile = async (profileState, updateAction, profileData) => {
  let updatedState = {...profileState};
  updatedState = deleteSame(updatedState, profileData);
  /*
   delete updatedState.email;
 */
  delete updatedState.currency;
  updatedState = await checkAvatarStateChange(updatedState, profileState, profileData);
  RNProgressHud.show();
  console.log('Upd_state', updatedState);
  setTimeout(() => {
    updateAction({
      variables: {...updatedState},
    });
  }, 200);
};
