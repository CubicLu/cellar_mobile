import RNProgressHud from 'progress-hud';
import React, {useRef, useReducer, useState, useEffect} from 'react';
import {View, TouchableOpacity, ImageBackground, Keyboard, StatusBar, Alert, StyleSheet} from 'react-native';
import {NavigationEvents} from 'react-navigation';
import {useMutation, useQuery} from '@apollo/react-hooks';
import AsyncStorage from '@react-native-community/async-storage';

import {stylesAddWine} from '../AddWineNew';
import {GET_PROFILE} from '../../../apollo/queries/profile';
import {UPDATE_PROFILE} from '../../../apollo/mutations/updateProfile';
import Photos from '../../../assets/photos';
import {BurgerIcon} from '../../../assets/svgIcons';
import {SET_REMOTE_DATA} from '../../../constants/ActionTypes/profile';
import Navigation from '../../../types/navigation';
import {ProfileBodyNew} from '../../../new_components/ProfileComponents/ProfileBody';
import {profileReducer} from '../../../reducers/profile.reducer';
import {isDisabledSave} from '../../../utils/ProfileUtils/disableSave';
import {updateProfile} from '../../../utils/ProfileUtils/authProfile';
import {timeoutError} from '../../../utils/errorCodes';
import {UPDATE_LOCAL_PROFILE} from '../../../apollo/client/mutations';
import {initState} from '../../../apollo/client';

interface ProfileProps {
  navigation: Navigation;
}

/**
 * All info about this screen you can found here https://cellarventures.atlassian.net/wiki/spaces/CA/pages/12746761/User+Profile+screen
 */

const Profile: React.FC<ProfileProps> = ({navigation}) => {
  const photoRef = useRef();
  const scrollRef = useRef();
  const [shouldReset, setShouldReset]: any = useState(false);
  const [updateProfileAction] = useMutation(UPDATE_PROFILE, {
    onCompleted: async data => {
      console.debug(data);
      Alert.alert('Success', data.updateProfileTest.message);
      RNProgressHud.dismiss();
    },
    onError: error => {
      timeoutError(error);
    },
  });

  const [setLocalProfile] = useMutation(UPDATE_LOCAL_PROFILE, {
    onCompleted: () => {
      profileDispatch({type: SET_REMOTE_DATA, payload: data.profile});
    },
  });

  const {loading, data, error} = useQuery(GET_PROFILE, {
    fetchPolicy: 'network-only',
    onCompleted: async response => {
      await setLocalProfile({variables: {userProfile: {...response.profile}}});
    },
  });

  const [profileState, profileDispatch] = useReducer(profileReducer, initState.userProfile);
  const onChangeField = type => val => {
    profileDispatch({type, payload: val});
  };

  useEffect(() => {
    if (!loading) {
      RNProgressHud.dismiss();
    } else {
      RNProgressHud.show();
    }
  }, [loading]);

  useEffect(() => {
    if (error) {
      RNProgressHud.dismiss();
      console.log('Error', error);
    }
  }, [error]);

  useEffect(() => {
    if (data) {
      profileDispatch({type: SET_REMOTE_DATA, payload: data.profile});
    }
  }, [data]);
  return (
    <View style={mainViewStyle}>
      <NavigationEvents
        onWillFocus={async () => {
          StatusBar.setBarStyle('light-content');
          const reset = await AsyncStorage.getItem('ResetProfile');
          if (reset) {
            const resetValue = JSON.parse(reset);
            if (resetValue.reset) {
              (scrollRef as any).current.scrollTo({y: 0, animated: false});
              if (data) {
                profileDispatch({type: SET_REMOTE_DATA, payload: data.profile});
              }
              await AsyncStorage.setItem('ResetProfile', JSON.stringify({reset: false}));
            }
          }
        }}
      />
      <View style={profileContainer}>
        <ImageBackground source={Photos.bgCellar} style={leftTabContainer} resizeMode={'cover'}>
          <View style={burgerContainer}>
            <TouchableOpacity
              style={burgerTouchable}
              onPress={() => {
                navigation.openDrawer();
                Keyboard.dismiss();
              }}>
              <BurgerIcon height={13} width={20} />
            </TouchableOpacity>
          </View>
        </ImageBackground>
        <View style={container}>
          <ProfileBodyNew
            headerTitle={'User Profile'}
            navigation={navigation}
            scrollRef={scrollRef}
            photoRef={photoRef}
            profileState={profileState}
            onChangeField={onChangeField}
            profileDispatch={profileDispatch}
            showEmail={true}
            showBackup={true}
            updateProfile={async () => {
              if (data) {
                await updateProfile(profileState, updateProfileAction, data.profile);
              }
            }}
            isDisabledSave={isDisabledSave(profileState, data, setShouldReset, shouldReset, true)}
          />
        </View>
      </View>
    </View>
  );
};

export const ProfileNew = Profile;

const styles = StyleSheet.create({profileContainer: {flex: 1, flexDirection: 'row'}});
const {leftTabContainer, burgerContainer, burgerTouchable, container, mainViewStyle} = stylesAddWine;
const {profileContainer} = styles;
