import gql from 'graphql-tag';

export const UPDATE_PROFILE = gql`
  mutation updateProfile(
    $email: String
    $firstName: String
    $lastName: String
    $defaultCurrency: Currencies
    $firstWine: String
    $favoriteWineries: String
    $mustGoRestaurant: String
    $favoritePlaceToTravel: String
    $avatarURL: String
    $country: String
    $subdivision: String
    $file: Upload
    $location: UserLocationInput
  ) {
    updateProfileTest(
      email: $email
      firstName: $firstName
      lastName: $lastName
      defaultCurrency: $defaultCurrency
      firstWine: $firstWine
      favoriteWineries: $favoriteWineries
      mustGoRestaurant: $mustGoRestaurant
      favoritePlaceToTravel: $favoritePlaceToTravel
      avatarURL: $avatarURL
      country: $country
      subdivision: $subdivision
      file: $file
      location: $location
    ) {
      message
      user {
        email
        avatarURL
      }
    }
  }
`;
