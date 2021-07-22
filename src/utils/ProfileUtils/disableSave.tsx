import {requiredEmailValidation} from '../errorCodes';

export const isDisabledSave = (profileState, data, setShouldReset, shouldReset, showEmail) => {
  if (!data) {
    return true;
  }
  const profileData = data.profile;

  let isDisabled =
    profileData.firstName === profileState.firstName &&
    profileData.lastName === profileState.lastName &&
    profileData.email === profileState.email &&
    profileData.favoritePlaceToTravel === profileState.favoritePlaceToTravel &&
    profileData.favoriteWineries === profileState.favoriteWineries &&
    profileData.firstWine === profileState.firstWine &&
    profileData.mustGoRestaurant === profileState.mustGoRestaurant &&
    profileData.avatarURL === profileState.avatarURL &&
    profileData.country === profileState.country &&
    profileData.defaultCurrency === profileState.defaultCurrency &&
    profileData.state === profileState.state;

  isDisabled = isDisabled || profileFieldsValidation(profileState, showEmail);

  if (isDisabled === shouldReset) {
    setShouldReset(!isDisabled);
  }
  return isDisabled;
};

export const resetValidation = (data, profileState, navigation, shouldReset) => {
  if (data) {
    const isEmpty =
      (profileState.firstName === '' && profileState.firstName !== data.profile.firstName) ||
      (profileState.lastName === '' && profileState.lastName !== data.profile.lastName);
    if (isEmpty) {
      navigation.state.params.onChange(true);
    } else {
      navigation.state.params.onChange(shouldReset);
    }
  } else {
    navigation.state.params.onChange(shouldReset);
  }
};

export const profileFieldsValidation = (profileState, showEmail) => {
  return (
    !profileState.firstName ||
    !profileState.lastName ||
    !profileState.country ||
    (showEmail ? requiredEmailValidation(profileState.email) !== '' : false)
  );
};
