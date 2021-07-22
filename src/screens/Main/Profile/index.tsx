import RNProgressHud from 'progress-hud';
import React, {useEffect, useReducer, useRef, useState} from 'react';
import {StyleSheet, Text, StatusBar, TouchableOpacity, Image, View, Keyboard, Alert} from 'react-native';
import Navigation from '../../../types/navigation';
import {NavigationEvents} from 'react-navigation';
import {useLazyQuery, useMutation} from '@apollo/react-hooks';
import {GET_PROFILE} from '../../../apollo/queries/profile';
import Images from '../../../assets/images';
import {Save} from '../../../components/ProfileComponents/Save';
import {getStatusBarHeight} from 'react-native-iphone-x-helper';
import {profileInitState, profileReducer} from '../../../reducers/profile.reducer';
import {SET_REMOTE_DATA} from '../../../constants/ActionTypes/profile';
import {timeoutError} from '../../../utils/errorCodes';
import {UPDATE_PROFILE} from '../../../apollo/mutations/updateProfile';
import {isDisabledSave, resetValidation} from '../../../utils/ProfileUtils/disableSave';
import AsyncStorage from '@react-native-community/async-storage';
import {ProfileBody} from '../../../components/ProfileComponents/ProfileBody';
import {updateProfile} from '../../../utils/ProfileUtils/authProfile';

interface InventoryProps {
  navigation: Navigation;
}

const Profile: React.FC<InventoryProps> = ({navigation}) => {
  const photoRef = useRef();
  const scrollRef = useRef();
  const [shouldReset, setShouldReset]: any = useState(false);
  const [updateProfileAction] = useMutation(UPDATE_PROFILE, {
    onCompleted: async data => {
      console.debug(data);
      Alert.alert('Success', data.updateProfile.message);
      loadProfile();
    },
    onError: error => {
      timeoutError(error);
    },
  });

  const [profileState, profileDispatch] = useReducer(profileReducer, profileInitState);
  const onChangeField = type => val => {
    profileDispatch({type, payload: val});
  };
  const [loadProfile, {loading, data, error}] = useLazyQuery(GET_PROFILE, {
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    RNProgressHud.show();
    loadProfile();
  }, [loadProfile]);

  useEffect(() => {
    if (!loading) {
      setTimeout(() => {
        RNProgressHud.dismiss();
      }, 1000);
    }
  }, [loading]);

  useEffect(() => {
    if (error) {
      RNProgressHud.dismiss();
      console.log('Error', error);
    }
  }, [error]);
  useEffect(() => {
    resetValidation(data, profileState, navigation, shouldReset);
  }, [data, navigation, profileState, shouldReset]);

  useEffect(() => {
    if (data) {
      console.log(data.profile);
      profileDispatch({type: SET_REMOTE_DATA, payload: data.profile});
    }
  }, [data]);

  return (
    <View style={{height: '100%'}}>
      <NavigationEvents
        onWillFocus={async () => {
          const reset = await AsyncStorage.getItem('ResetProfile');
          if (reset) {
            const resetValue = JSON.parse(reset);
            if (resetValue.reset) {
              (scrollRef as any).current.scrollTo({y: 0, animated: false});
              profileDispatch({type: SET_REMOTE_DATA, payload: data.profile});
              await AsyncStorage.setItem('ResetProfile', JSON.stringify({reset: false}));
            }
          }
          StatusBar.setBarStyle('dark-content');
        }}
      />
      <View style={header}>
        <TouchableOpacity
          style={touchableStyle}
          onPress={() => {
            Keyboard.dismiss();
            navigation.openDrawer();
          }}>
          <Image source={Images.burgerIcon} style={burgerIcon} resizeMode={'stretch'} />
        </TouchableOpacity>
        <View style={topBarContent}>
          <Text style={{fontSize: 26}}>Profile</Text>
        </View>
        <Save
          onPress={async () => {
            await updateProfile(profileState, updateProfileAction, data.profile);
          }}
          disabled={isDisabledSave(profileState, data, setShouldReset, shouldReset, true)}
        />
      </View>

      <ProfileBody
        navigation={navigation}
        onChangeField={onChangeField}
        profileDispatch={profileDispatch}
        photoRef={photoRef}
        profileState={profileState}
        scrollRef={scrollRef}
        showEmail={true}
      />
    </View>
  );
};

export const ProfileScreen = Profile;

const stylesMain = StyleSheet.create({
  header: {
    height: 80,
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'white',
    shadowOffset: {width: 0, height: 3},
    zIndex: 5,
    shadowColor: 'black',
    shadowOpacity: 0.4,
  },
  burgerIcon: {
    width: 30,
    height: 20,
  },
  topBarContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 40,
    alignItems: 'center',
  },
  touchableStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    width: 60,
  },
  scrollContainer: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 20,
    flex: 1,
  },
  photoContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
    height: 160,
  },
  image: {
    height: 160,
    width: 160,
    borderRadius: 80,
  },
  bottomSheetContainer: {
    height: 300,
    width: '100%',
    backgroundColor: 'white',
  },
});

const {header, topBarContent, burgerIcon, touchableStyle} = stylesMain;
