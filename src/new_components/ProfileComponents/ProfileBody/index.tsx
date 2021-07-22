import React, {useCallback, useEffect, useRef, useState} from 'react';
import {TouchableOpacity, StyleSheet, View, Image, Platform, Text, Keyboard} from 'react-native';
import InputScrollView from 'react-native-input-scroll-view';
import {OutlinedTextField} from 'react-native-material-textfield-label-fixed';
import ImagePicker from 'react-native-image-picker';
import {PERMISSIONS, request} from 'react-native-permissions';

// import {Picker} from '@davidgovea/react-native-wheel-datepicker';
// import {BottomSheetNew} from '../../AddWineComponents/BottomSheetNew';

import {PhotoSheetNew} from '../PhotoSheetNew';
import {CameraWhiteIcon} from '../../../assets/svgIcons';
import {InfoCell} from '../../CommonComponents/InfoCell';
import {InputNew} from '../../CommonComponents/InputNew';
import {ButtonNew} from '../../CommonComponents/Button';
import {Routes} from '../../../constants';
import {
  SET_AVATAR_URL,
  SET_COUNTRY_PROFILE,
  SET_EMAIL,
  SET_FAVORITE_PLACE,
  SET_FAVORITE_WINERIES,
  SET_FIRST_NAME,
  SET_FIRST_WINE,
  SET_LAST_NAME,
  SET_RESTAURANT,
  SET_STATE_PROFILE,
  SET_LOCATION,
  // SET_CURRENCY,
  // SET_DEFAULT_CURRENCY,
} from '../../../constants/ActionTypes/profile';
import Colors from '../../../constants/colors';
import textStyle from '../../../constants/Styles/textStyle';
import {profileInitState} from '../../../reducers/profile.reducer';
import {initState} from '../../../apollo/client';
import {permissionAlert} from '../../../screens/Main/PhotoRecognition';
import {stylesAddWine} from '../../../screens/Main/AddWineNew';
import Navigation from '../../../types/navigation';
import {requestCameraOrLib} from '../../../utils/ProfileUtils/permissionUtils';
import {handleStorageResult} from '../../../utils/PhotoRecognitionUtils';
import {requiredColorValidation} from '../../../utils/validation';
import {requiredEmailValidation, requiredLocationValidation, requiredNameValidation} from '../../../utils/errorCodes';
import moment from 'moment';

interface BodyProps {
  navigation: Navigation;
  scrollRef: any;
  photoRef: any;
  profileState: any;
  onChangeField: any;
  profileDispatch: any;
  showEmail: boolean;
  updateProfile: () => void;
  isDisabledSave: boolean;
  headerTitle: string;
  showBackup?: boolean;
}

const Body: React.FC<BodyProps> = ({
  navigation,
  scrollRef,
  photoRef,
  profileState,
  onChangeField,
  profileDispatch,
  showEmail,
  updateProfile,
  isDisabledSave,
  headerTitle,
  showBackup,
}) => {
  const currencyRef = useRef();
  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const emailRef = useRef();
  const firstWineRef = useRef();
  const favWineriesRef = useRef();
  const placeRef = useRef();
  const restRef = useRef();

  const [, updateState] = useState();
  const forceUpdate = useCallback(() => updateState({}), []);
  const [isNeedUpdate, updateFlag] = useState(true);

  const onSelectCountry = val => {
    profileDispatch({type: SET_COUNTRY_PROFILE, payload: val.prettyLocationName});
    profileDispatch({type: SET_LOCATION, payload: val});
    if (val !== 'United States') {
      profileDispatch({type: SET_STATE_PROFILE, payload: ''});
    }
  };

  const onLocationPressHandler = () => {
    const {
      state: {routeName},
    } = navigation;

    navigation.navigate(routeName === 'Profile' ? Routes.locationPicker.name : Routes.authLocationPicker.name, {
      onSelect: onSelectCountry,
      title: 'Country',
      location: JSON.stringify(profileState.location),
    });
  };

  useEffect(() => {
    (firstNameRef as any).current.setValue(profileState.firstName);
    (lastNameRef as any).current.setValue(profileState.lastName);
    emailRef.current && (emailRef as any).current.setValue(profileState.email);
    (firstWineRef as any).current.setValue(profileState.firstWine);
    (favWineriesRef as any).current.setValue(profileState.favoriteWineries);
    (placeRef as any).current.setValue(profileState.favoritePlaceToTravel);
    (restRef as any).current.setValue(profileState.mustGoRestaurant);
  }, [profileState]);

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

  const onPressBackup = () => navigation.navigate(Routes.backupScreen.name, {email: profileState.email});

  return (
    <>
      <View style={{flex: 1}}>
        <InputScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: 50,
          }}
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          style={scrollContainer}
          keyboardOffset={90}
          keyboardDismissMode={'on-drag'}
          multilineInputStyle={{flex: 1, fontSize: 24}}>
          <Text allowFontScaling={false} numberOfLines={1} adjustsFontSizeToFit style={titleStyle}>
            {headerTitle}
          </Text>
          <TouchableOpacity onPress={() => (photoRef as any).current.open()} style={imgContainer}>
            {profileState.avatarURL !== '' && profileState.avatarURL !== null ? (
              <Image
                style={imageStyle}
                source={{uri: profileState.avatarURL, cache: 'force-cache'}}
                resizeMode={'cover'}
              />
            ) : (
              <View style={imageStyle}>
                <CameraWhiteIcon height={40} width={35} />
              </View>
            )}
          </TouchableOpacity>

          <InputNew
            placeHolder={'First Name'}
            value={profileState.firstName}
            onChange={onChangeField(SET_FIRST_NAME)}
            onSubmitEditing={() => Keyboard.dismiss()}
            keyboardType={'default'}
            returnKeyType={'done'}
            error={requiredNameValidation(profileState.firstName)}
            x1={2}
            requiredColorValidation={requiredColorValidation(profileState.firstName, '')}
            containerStyle={{marginTop: 20}}
            getRef={firstNameRef}
          />

          <InputNew
            placeHolder={'Last Name'}
            value={profileState.lastName}
            onChange={onChangeField(SET_LAST_NAME)}
            onSubmitEditing={() => Keyboard.dismiss()}
            keyboardType={'default'}
            returnKeyType={'done'}
            error={requiredNameValidation(profileState.lastName)}
            x1={2.5}
            requiredColorValidation={requiredColorValidation(profileState.lastName, '')}
            containerStyle={{marginTop: 20}}
            getRef={lastNameRef}
          />

          {showEmail && (
            <InputNew
              placeHolder={'Email'}
              value={profileState.email}
              onChange={onChangeField(SET_EMAIL)}
              onSubmitEditing={() => Keyboard.dismiss()}
              keyboardType={'default'}
              returnKeyType={'done'}
              x1={8.5}
              error={requiredEmailValidation(profileState.email)}
              requiredColorValidation={requiredColorValidation(profileState.email, '')}
              containerStyle={{marginTop: 20}}
              getRef={emailRef}
            />
          )}

          <InfoCell
            title={'Location'}
            content={profileState.country}
            onPress={onLocationPressHandler}
            error={requiredLocationValidation(profileState.country)}
            rotate={false}
            isChevron={false}
          />

          {profileState.country === 'United States' && (
            <InfoCell
              title={'State'}
              content={profileState.subdivision}
              onPress={() =>
                navigation.navigate(Routes.localeListNewUI.name, {
                  onSelect: onChangeField(SET_STATE_PROFILE),
                  title: 'State',
                })
              }
              error={''}
              rotate={false}
              isChevron={false}
            />
          )}

          {/* removed untill a currency logic will be done
          <InfoCell
            title={'Currency'}
            content={profileState.defaultCurrency}
            onPress={() => {
              (currencyRef as any).current.open();
            }}
            error={''}
            rotate={true}
          /> */}
          <View style={{flex: 1}}>
            <OutlinedTextField
              value={profileState.firstWine}
              label={'First wine you remember'}
              onChangeText={onChangeField(SET_FIRST_WINE)}
              onSubmitEditing={() => Keyboard.dismiss()}
              keyboardType={'default'}
              tintColor={'white'}
              returnKeyType={'done'}
              lineWidth={2}
              maxLength={100}
              activeLineWidth={2}
              fontSize={21}
              autoCorrect={false}
              disabledLineWidth={2}
              baseColor={Colors.inputBorderGrey}
              containerStyle={[containerInput, {minHeight: 50}]}
              inputContainerStyle={[inputStyle, {minHeight: 50}]}
              autoFocus={false}
              style={[styleMultiline, {marginLeft: 24}]}
              labelOffset={{
                x0: 10,
                x1: -5,
                y0: -10,
              }}
              contentInset={{
                left: 0,
                input: 0,
                label: 10,
                bottom: 0,
              }}
              multiline={true}
              blurOnSubmit={false}
              labelTextStyle={{...textStyle.mediumText}}
              error={''}
              errorColor={Colors.inputError}
              backgroundLabelColor={'black'}
              ref={firstWineRef}
            />
          </View>

          <View style={{flex: 1}}>
            <OutlinedTextField
              value={profileState.favoriteWineries}
              label={'Favorite wineries'}
              onChangeText={onChangeField(SET_FAVORITE_WINERIES)}
              onSubmitEditing={() => Keyboard.dismiss()}
              keyboardType={'default'}
              tintColor={'white'}
              returnKeyType={'done'}
              lineWidth={2}
              maxLength={100}
              activeLineWidth={2}
              fontSize={21}
              autoCorrect={false}
              disabledLineWidth={2}
              baseColor={Colors.inputBorderGrey}
              containerStyle={containerInput}
              inputContainerStyle={inputStyle}
              autoFocus={false}
              style={[styleMultiline, {marginLeft: 24}]}
              labelOffset={{
                x0: 10,
                x1: -5,
                y0: -10,
              }}
              contentInset={{
                left: 0,
                input: 0,
                label: 10,
                bottom: 0,
              }}
              multiline={true}
              blurOnSubmit={false}
              labelTextStyle={{...textStyle.mediumText}}
              error={''}
              errorColor={Colors.inputError}
              backgroundLabelColor={'black'}
              ref={favWineriesRef}
            />
          </View>

          <InputNew
            placeHolder={'Favorite place to travel'}
            value={profileState.favoritePlaceToTravel}
            onChange={onChangeField(SET_FAVORITE_PLACE)}
            onSubmitEditing={() => Keyboard.dismiss()}
            keyboardType={'default'}
            returnKeyType={'done'}
            error={''}
            x1={-12.5}
            requiredColorValidation={Colors.inputBorderGrey}
            containerStyle={{marginTop: 20}}
            getRef={placeRef}
          />

          <InputNew
            placeHolder={'Must-go Restaurant'}
            value={profileState.mustGoRestaurant}
            onChange={onChangeField(SET_RESTAURANT)}
            onSubmitEditing={() => Keyboard.dismiss()}
            keyboardType={'default'}
            returnKeyType={'done'}
            error={''}
            x1={-8}
            requiredColorValidation={Colors.inputBorderGrey}
            containerStyle={{marginTop: 20}}
            getRef={restRef}
          />

          <InfoCell
            title={'Member since'}
            content={moment(profileState.createdAt).format('ddd MMM D, YYYY')}
            onPress={() => {}}
            error={''}
            rotate={false}
            showArrow={false}
            disabled={true}
          />

          <InfoCell
            title={'Cellar Locations'}
            content={''}
            onPress={() =>
              navigation.navigate(Routes.inventoryAdditions.editLocation, {
                isStack: true,
              })
            }
            error={''}
            rotate={false}
            isChevron={true}
          />

          {showBackup && (
            <InfoCell
              title={'Backup now'}
              content={''}
              onPress={onPressBackup}
              error={''}
              rotate={false}
              isChevron={true}
            />
          )}

          <ButtonNew onPress={updateProfile} isDisabled={isDisabledSave} style={buttonStyle} text={'SAVE'} />
        </InputScrollView>
      </View>

      <PhotoSheetNew
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
      {/* removed untill a currency logic will be done
      <BottomSheetNew
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
          // @ts-ignore
          itemStyle={{color: 'white'}}
          selectedValue={profileState.currency}
          pickerData={['GBP', 'USD', 'EUR']}
          onValueChange={value =>
            profileDispatch({
              type: SET_CURRENCY,
              payload: value,
            })
          }
        />
      </BottomSheetNew> */}
    </>
  );
};
export const ProfileBodyNew = Body;

const style = StyleSheet.create({
  imageStyle: {
    height: 200,
    width: 200,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imgContainer: {
    height: 200,
    width: 200,
    marginTop: 48,
  },
});

const {imageStyle, imgContainer} = style;

const {
  scrollContainer,
  buttonStyle,
  titleStyle,
  containerInput,
  inputStyle,
  styleMultiline,
  // bottomSheetContainer,
} = stylesAddWine;
