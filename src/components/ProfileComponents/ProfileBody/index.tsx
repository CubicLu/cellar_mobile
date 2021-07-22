import React, {useCallback, useRef, useState} from 'react';
import {TouchableOpacity, StyleSheet, View, Image, Platform} from 'react-native';
import InputScrollView from 'react-native-input-scroll-view';
import Images from '../../../assets/images';
import {ProfileInput} from '../ProfileInput';
import {
  SET_AVATAR_URL,
  SET_COUNTRY_PROFILE,
  SET_CURRENCY,
  SET_DEFAULT_CURRENCY,
  SET_EMAIL,
  SET_FAVORITE_PLACE,
  SET_FAVORITE_WINERIES,
  SET_FIRST_NAME,
  SET_FIRST_WINE,
  SET_LAST_NAME,
  SET_RESTAURANT,
  SET_STATE_PROFILE,
} from '../../../constants/ActionTypes/profile';
import {requiredFieldsValidation} from '../../../utils/validation';
import {requiredEmailValidation} from '../../../utils/errorCodes';
import {LocaleCell} from '../LocaleCell';
import {Routes} from '../../../constants';
import moment from 'moment';
import Navigation from '../../../types/navigation';
import {BottomSheetComponent} from '../../InventoryAdditionsScreen/BottomSheetComponent';
import {Picker} from '@davidgovea/react-native-wheel-datepicker';
import {BottomSheetPhoto} from '../BottomSheetPhoto';
import {requestCameraOrLib} from '../../../utils/ProfileUtils/permissionUtils';
import ImagePicker from 'react-native-image-picker';
import {PERMISSIONS, request} from 'react-native-permissions';
import {handleStorageResult} from '../../../utils/PhotoRecognitionUtils';
import {permissionAlert} from '../../../screens/Main/PhotoRecognition';
interface BodyProps {
  navigation: Navigation;
  scrollRef: any;
  photoRef: any;
  profileState: any;
  onChangeField: any;
  profileDispatch: any;
  showEmail: boolean;
}

const Body: React.FC<BodyProps> = ({
  navigation,
  scrollRef,
  photoRef,
  profileState,
  onChangeField,
  profileDispatch,
  showEmail,
}) => {
  const currencyRef = useRef();
  const [, updateState] = useState();
  const forceUpdate = useCallback(() => updateState({}), []);

  const onSelectCountry = val => {
    profileDispatch({type: SET_COUNTRY_PROFILE, payload: val});
    if (val !== 'United States') {
      profileDispatch({type: SET_STATE_PROFILE, payload: ''});
    }
  };

  const requestStoragePermission = useCallback(() => {
    Platform.OS === 'ios'
      ? requestCameraOrLib(profileDispatch, ImagePicker.launchImageLibrary)
      : request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE).then(result => {
          handleStorageResult(
            result,
            forceUpdate,
            requestCameraOrLib(profileDispatch, ImagePicker.launchImageLibrary),
            permissionAlert,
          );
        });
  }, [forceUpdate]);

  const requestCameraPermission = useCallback(() => {
    requestCameraOrLib(profileDispatch, ImagePicker.launchCamera);
  }, []);
  return (
    <>
      <View style={{flex: 1}}>
        <InputScrollView
          ref={scrollRef}
          style={scrollContainer}
          keyboardOffset={90}
          multilineInputStyle={{flex: 1, fontSize: 24}}
          contentContainerStyle={{flexGrow: 1, paddingBottom: 40}}>
          <TouchableOpacity onPress={() => (photoRef as any).current.open()} style={photoContainer}>
            <Image
              source={
                profileState.avatarURL !== '' && profileState.avatarURL !== null
                  ? {uri: profileState.avatarURL, cache: 'force-cache'}
                  : Images.user
              }
              style={image}
              resizeMode={'cover'}
            />
          </TouchableOpacity>
          <ProfileInput
            value={profileState.firstName}
            headerTitle={'First name'}
            onChange={onChangeField(SET_FIRST_NAME)}
            validate={requiredFieldsValidation(profileState.firstName)}
            placeholder={'Enter your first name'}
          />
          <ProfileInput
            value={profileState.lastName}
            headerTitle={'Last name'}
            onChange={onChangeField(SET_LAST_NAME)}
            validate={requiredFieldsValidation(profileState.lastName)}
            placeholder={'Enter your last name'}
          />
          {showEmail && (
            <ProfileInput
              value={profileState.email}
              headerTitle={'Email'}
              onChange={onChangeField(SET_EMAIL)}
              validate={requiredEmailValidation(profileState.email)}
              placeholder={'Enter your email'}
              autoCapitalize={'none'}
            />
          )}
          <LocaleCell
            title={'Country'}
            displayValue={profileState.country}
            onPress={() =>
              navigation.navigate(Routes.localeListNewUI.name, {
                onSelect: onSelectCountry,
                title: 'Country',
              })
            }
          />
          {profileState.country === 'United States' && (
            <LocaleCell
              title={'State'}
              displayValue={profileState.subdivision}
              onPress={() =>
                navigation.navigate(Routes.localeListNewUI.name, {
                  onSelect: onChangeField(SET_STATE_PROFILE),
                  title: 'State',
                })
              }
            />
          )}
          <LocaleCell
            title={'Currency'}
            displayValue={profileState.defaultCurrency}
            onPress={() => {
              (currencyRef as any).current.open();
            }}
          />
          <ProfileInput
            value={profileState.firstWine}
            headerTitle={'First wine you remember'}
            onChange={onChangeField(SET_FIRST_WINE)}
            placeholder={'Enter first wine you remember'}
          />
          <ProfileInput
            value={profileState.favoriteWineries}
            headerTitle={'Favorite wineries'}
            onChange={onChangeField(SET_FAVORITE_WINERIES)}
            placeholder={'Enter your favorite wineries'}
          />
          <ProfileInput
            value={profileState.favoritePlaceToTravel}
            headerTitle={'Favorite place to travel'}
            onChange={onChangeField(SET_FAVORITE_PLACE)}
            placeholder={'Enter your favorite place to travel'}
          />
          <ProfileInput
            value={profileState.mustGoRestaurant}
            headerTitle={'Must-go Restaurant'}
            onChange={onChangeField(SET_RESTAURANT)}
            placeholder={'Enter must-go Restaurant'}
          />
          <View pointerEvents="none">
            <ProfileInput
              value={moment(profileState.createdAt).format('MM/YYYY')}
              headerTitle={'Member since "Month/Year"'}
              onChange={() => {}}
              placeholder={''}
            />
          </View>
        </InputScrollView>
      </View>
      <BottomSheetComponent
        onPressDone={() => {
          profileDispatch({
            type: SET_DEFAULT_CURRENCY,
            payload: profileState.currency,
          });
          (currencyRef as any).current.close();
        }}
        ref={currencyRef}>
        <Picker
          style={bottomSheetContainer}
          selectedValue={profileState.currency}
          pickerData={['GBP', 'USD', 'EUR']}
          onValueChange={value =>
            profileDispatch({
              type: SET_CURRENCY,
              payload: value,
            })
          }
        />
      </BottomSheetComponent>

      <BottomSheetPhoto
        ref={photoRef}
        onPressCamera={() => {
          (photoRef as any).current.close();
          setTimeout(() => {
            requestCameraPermission();
          }, 320);
        }}
        onPressLibrary={() => {
          (photoRef as any).current.close();
          setTimeout(() => {
            requestStoragePermission();
          }, 320);
        }}
        onPressRemove={() => {
          (photoRef as any).current.close();
          profileDispatch({type: SET_AVATAR_URL, payload: ''});
        }}
        onCancel={() => {
          (photoRef as any).current.close();
        }}
      />
    </>
  );
};
export const ProfileBody = Body;

const style = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: 'white',
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

const {scrollContainer, photoContainer, image, bottomSheetContainer} = style;
