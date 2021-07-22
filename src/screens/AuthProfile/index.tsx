import RNProgressHud from 'progress-hud';
import React, {useEffect, useReducer, useRef} from 'react';
import {StatusBar, View, Keyboard, ImageBackground, Alert} from 'react-native';
import Navigation from '../../types/navigation';
import {useLazyQuery, useMutation, useQuery} from '@apollo/react-hooks';
import {profileInitState, profileReducer} from '../../reducers/profile.reducer';
import {timeoutError} from '../../utils/errorCodes';
import {UPDATE_PROFILE} from '../../apollo/mutations/updateProfile';
import {profileFieldsValidation} from '../../utils/ProfileUtils/disableSave';
import {updateProfile} from '../../utils/ProfileUtils/authProfile';
import {NavigationEvents} from 'react-navigation';
import moment from 'moment';
import {SET_REMOTE_DATA} from '../../constants/ActionTypes/profile';
import {stylesAddWine} from '../Main/AddWineNew';
import Photos from '../../assets/photos';
import {ProfileBodyNew} from '../../new_components/ProfileComponents/ProfileBody';
import {UPDATE_LOCAL_PROFILE} from '../../apollo/client/mutations';
import {GET_PROFILE} from '../../apollo/queries/profile';

interface InventoryProps {
  navigation: Navigation;
}

const initServer = {
  __typename: 'User',
  avatarURL: null,
  country: '',
  createdAt: moment(),
  defaultCurrency: 'USD',
  email: null,
  emailVerified: true,
  favoritePlaceToTravel: null,
  favoriteWineries: null,
  firstName: null,
  firstWine: null,
  lastName: null,
  mustGoRestaurant: null,
  subdivision: null,
  location: {prettyLocationName: ''},
};
//Screen for initial setting up profile after signUP
const Profile: React.FC<InventoryProps> = ({navigation}) => {
  const photoRef = useRef();
  const scrollRef = useRef();
  const [setLocalProfile] = useMutation(UPDATE_LOCAL_PROFILE);

  const [getProfile] = useLazyQuery(GET_PROFILE, {
    onCompleted: async response => {
      await setLocalProfile({variables: {userProfile: {...response.profile}}});
      navigation.navigate('ProfileStack');
      Keyboard.dismiss();
      RNProgressHud.dismiss();
    },
    onError: err => {
      Alert.alert('', `Failed to load profile ${err.message}`);
      RNProgressHud.dismiss();
    },
  });
  const [updateProfileAction] = useMutation(UPDATE_PROFILE, {
    onCompleted: async data => {
      console.debug(data);
      RNProgressHud.show();
      getProfile();
    },
    onError: error => {
      timeoutError(error);
    },
  });

  const [profileState, profileDispatch] = useReducer(profileReducer, profileInitState);
  const onChangeField = type => val => {
    profileDispatch({type, payload: val});
  };

  useEffect(() => {
    profileDispatch({type: SET_REMOTE_DATA, payload: initServer});
  }, []);

  return (
    <View style={mainViewStyle}>
      <NavigationEvents
        onWillFocus={() => {
          StatusBar.setBarStyle('dark-content');
        }}
      />

      <View style={{flex: 1, flexDirection: 'row'}}>
        <ImageBackground source={Photos.bgCellar} style={leftTabContainer} resizeMode={'cover'} />
        <View style={container}>
          <ProfileBodyNew
            headerTitle={'User Profile'}
            navigation={navigation}
            scrollRef={scrollRef}
            photoRef={photoRef}
            profileState={profileState}
            onChangeField={onChangeField}
            profileDispatch={profileDispatch}
            showEmail={false}
            updateProfile={async () => {
              await updateProfile(profileState, updateProfileAction, initServer);
            }}
            isDisabledSave={profileFieldsValidation(profileState, false)}
          />
        </View>
      </View>
    </View>
  );
};

export const ProfileAuthScreen = Profile;

const {leftTabContainer, container, mainViewStyle} = stylesAddWine;
