import RNProgressHud from 'progress-hud';
import React, {useRef, useReducer, useState, useEffect, useCallback} from 'react';
import {Text, View, TouchableOpacity, Image, ImageBackground, Keyboard, StatusBar, Alert} from 'react-native';
import {Picker} from '@davidgovea/react-native-wheel-datepicker';
import InputScrollView from 'react-native-input-scroll-view';
import {OutlinedTextField} from 'react-native-material-textfield-label-fixed';
import {useApolloClient, useMutation, useLazyQuery} from '@apollo/react-hooks';

import {ADD_CUSTOM_WINE_TO_WISHLIST} from '../../../apollo/mutations/addOrRemoveWishlist';
import {CHECK_WISHLIST_WINE} from '../../../apollo/queries/wishlist';
import Photos from '../../../assets/photos';
import {bottleSizes, NOT_LISTED} from '../../../constants/countries';
import {
  BOTTLE_NOTE,
  BOTTLE_SIZE,
  WINE_NAME,
  COST,
  CURRENCY,
  DISPLAY_BOTTLE_SIZE,
  DISPLAY_CURRENCY,
  DISPLAY_VINTAGE,
  VINTAGE,
  SET_LOCATION_SUGGESTION,
} from '../../../constants/ActionTypes/inventoryAdditions';
import {Currencies, initState, inventoryAdditionReducer} from '../../../reducers/inventoryAddition.reducer';
import Navigation from '../../../types/navigation';
import {isDisabledButtonWishlist} from '../../../utils/validation';
import {timeoutError} from '../../../utils/errorCodes';
import {BurgerIcon, CameraWhiteIcon} from '../../../assets/svgIcons';
import Colors from '../../../constants/colors';
import textStyle from '../../../constants/Styles/textStyle';
import {Routes} from '../../../constants';
import {InputNew, InfoCell, BottomSheetNew, ButtonNew} from '../../../new_components';
import {yearsArr} from '../../../constants/yearsArr';
import {AddWineActions} from '../../../utils/AddWineUtils/addWine';
import {stylesAddWine} from '../AddWineNew';
import {NavigationEvents} from 'react-navigation';
import {GET_LOCATION_SUGGESTION} from '../../../apollo/queries/wineProducers';

interface InventoryAdditionProps {
  navigation: Navigation;
}

/**
 * All info about this screen you can found here https://cellarventures.atlassian.net/wiki/spaces/CA/pages/27492353/Add+wishlist+screen
 */

const AddWishlist: React.FC<InventoryAdditionProps> = ({navigation}) => {
  const vintageRef = useRef();
  const currencyRef = useRef();
  const bottleSizeRef = useRef();
  const scrollRef = useRef();
  const wineNameRef = useRef();
  const costRef = useRef();
  const bottleNoteRef = useRef();

  const [imageWidth, setImageWidth] = useState<any>('100%');
  const [imageHeight, setImageHeight] = useState(200);
  const [viewWidth, setViewWidth] = useState(200);
  const [checkStatus, setCheckStatus] = useState(false);

  const client = useApolloClient();
  const [addWine] = useMutation(ADD_CUSTOM_WINE_TO_WISHLIST, {
    onCompleted: async data => {
      (wineNameRef as any).current.clear();
      (costRef as any).current.clear();
      (bottleNoteRef as any).current.clear();
      await addWineInstance.onCompleted(data, client, addWineInstance.clearAll(scrollRef), navigation);
    },
    onError: error => {
      timeoutError(error);
    },
  });

  const [additionState, inventoryDispatch] = useReducer(inventoryAdditionReducer, initState);
  const addWineInstance = new AddWineActions(additionState, inventoryDispatch);
  useEffect(() => {
    addWineInstance.calcImgSize(viewWidth, setImageHeight, setImageWidth);
  }, [additionState.imageURI]);

  const [checkInWishlist, {loading, data: checkResponse}] = useLazyQuery(CHECK_WISHLIST_WINE, {
    fetchPolicy: 'network-only',
  });

  const [getSuggestion] = useLazyQuery(GET_LOCATION_SUGGESTION, {
    fetchPolicy: 'no-cache',
    onCompleted: data => {
      RNProgressHud.dismiss();

      const array = data.wineProducerLocaleList.localeList;
      if (array.length > 0) {
        console.log(array[0]);
        inventoryDispatch({type: SET_LOCATION_SUGGESTION, payload: array[0]});
      }
    },
    onError: () => {
      RNProgressHud.dismiss();
    },
  });

  const onChangeField = title => val => {
    inventoryDispatch({type: title, payload: val});
  };

  useEffect(() => {
    if (typeof checkResponse === 'undefined') {
      return;
    }
    if (checkResponse && checkStatus) {
      const {checkWineInWishlist: isInWishlist} = checkResponse;
      if (isInWishlist) {
        RNProgressHud.dismiss();
        Alert.alert('This wine already exist in your wish list');
        setCheckStatus(false);
        return;
      } else {
        addWineInstance.submitCustomToWishlist(addWine);
        setCheckStatus(false);
        return;
      }
    }
  }, [checkResponse, loading, checkStatus, addWineInstance, addWine]);

  const onSelectProducer = useCallback(
    function(val) {
      RNProgressHud.show();
      addWineInstance.onSelectProducer(val);

      getSuggestion({
        variables: addWineInstance.getRequestParams(val),
      });
    },
    [additionState],
  );

  return (
    <View style={mainViewStyle}>
      <NavigationEvents
        onWillFocus={() => {
          StatusBar.setBarStyle('light-content');
        }}
      />
      <View style={{flex: 1, flexDirection: 'row'}}>
        <ImageBackground source={Photos.bgCellar} style={leftTabContainer} resizeMode={'cover'}>
          <View style={burgerContainer}>
            <TouchableOpacity
              style={burgerTouchable}
              onPress={() => {
                navigation.openDrawer();
              }}>
              <BurgerIcon height={13} width={20} />
            </TouchableOpacity>
          </View>
        </ImageBackground>
        <View style={container}>
          <View style={{flex: 1}}>
            <InputScrollView
              onLayout={event => {
                let {width} = event.nativeEvent.layout;
                setViewWidth(width);
              }}
              contentContainerStyle={{
                flexGrow: 1,
                paddingBottom: 50,
              }}
              showsVerticalScrollIndicator={false}
              style={scrollContainer}
              ref={scrollRef}
              keyboardOffset={90}
              keyboardDismissMode={'on-drag'}
              multilineInputStyle={{flex: 1, fontSize: 24}}>
              <Text allowFontScaling={false} numberOfLines={1} adjustsFontSizeToFit style={titleStyle}>
                Add Wish List
              </Text>
              <TouchableOpacity
                onPress={() => {
                  RNProgressHud.show();
                  setTimeout(() => {
                    RNProgressHud.dismiss();
                    navigation.navigate(Routes.camera.name, {
                      onSelect: addWineInstance.onSelectPhoto,
                    });
                  }, 500);
                }}
                style={[imageContainer, {borderWidth: additionState.imageURI === 'default' ? 2 : 0}]}>
                {additionState.imageURI === 'default' ? (
                  <View style={{height: 200, justifyContent: 'center', alignItems: 'center'}}>
                    <CameraWhiteIcon height={40} width={35} />
                  </View>
                ) : (
                  <Image
                    source={additionState.imageURI}
                    style={[image, {width: imageWidth, height: imageHeight}]}
                    resizeMode={'contain'}
                  />
                )}
              </TouchableOpacity>
              <InfoCell
                title={'Producer'}
                content={additionState.producer}
                onPress={() =>
                  navigation.navigate(Routes.inventoryAdditions.producerList, {
                    onSelect: onSelectProducer,
                  })
                }
                error={''}
                required={true}
              />
              <InputNew
                placeHolder={'Wine Name'}
                value={additionState.wineName}
                onChange={onChangeField(WINE_NAME)}
                onSubmitEditing={() => Keyboard.dismiss()}
                keyboardType={'default'}
                returnKeyType={'done'}
                error={''}
                requiredColorValidation={Colors.inputBorderGrey}
                containerStyle={{marginTop: 20}}
                getRef={wineNameRef}
              />
              <InfoCell
                title={'Vintage'}
                content={additionState.displayVintage}
                onPress={() => (vintageRef as any).current.open()}
                error={''}
                rotate={true}
                required={true}
              />
              <InfoCell
                title={'Varietal'}
                content={additionState.varietal}
                onPress={() =>
                  navigation.navigate(Routes.varietalList.name, {
                    onSelect: addWineInstance.onSelectVarietal,
                    data: additionState.varietalList.sort(),
                    title: 'Varietal',
                  })
                }
                error={''}
                required={true}
              />
              <InfoCell
                title={'Bottle Size, ml'}
                content={additionState.displayBottleSize}
                onPress={() => (bottleSizeRef as any).current.open()}
                error={''}
                rotate={true}
                required={true}
              />
              <View style={{flexDirection: 'row', marginTop: 20}}>
                <InputNew
                  placeHolder={'Cost per Bottle'}
                  value={additionState.cost}
                  onChange={onChangeField(COST)}
                  onSubmitEditing={() => Keyboard.dismiss()}
                  keyboardType={'numeric'}
                  returnKeyType={'done'}
                  x1={-2.5}
                  // containerStyle={{width: '60%'}}
                  requiredColorValidation={Colors.inputBorderGrey}
                  error={''}
                  getRef={costRef}
                />

                {/* <TouchableOpacity onPress={() => (currencyRef as any).current.open()} style={currencyContainer}>
                  <Text style={currTextStyle}>{additionState.displayCurrency}</Text>
                  <ChevronItem rotate={true} chevron={true} />
                </TouchableOpacity> */}
              </View>

              <InfoCell
                title={'Country'}
                content={additionState.country}
                onPress={() =>
                  navigation.navigate(Routes.localeList.name, {
                    onSelect: addWineInstance.onSelectCountry,
                    model: {variable: {}, title: 'Country'},
                  })
                }
                error={''}
                required={false}
              />

              <InfoCell
                title={'Region'}
                content={additionState.region}
                onPress={() =>
                  navigation.navigate(Routes.localeList.name, {
                    onSelect: addWineInstance.onSelectRegion,
                    model: {
                      variable: {country: additionState.country},
                      title: 'Region',
                    },
                  })
                }
                disabled={additionState.country === '' || additionState.country === NOT_LISTED}
                error={''}
                required={false}
              />

              <InfoCell
                title={'Subregion'}
                content={additionState.subregion}
                onPress={() =>
                  navigation.navigate(Routes.localeList.name, {
                    onSelect: addWineInstance.onSelectSubregion,
                    model: {
                      variable: {country: additionState.country, region: additionState.region},
                      title: 'Subregion',
                    },
                  })
                }
                disabled={additionState.region === '' || additionState.region === NOT_LISTED}
                error={''}
                required={false}
              />
              <InfoCell
                title={'Appellation'}
                content={additionState.appellation}
                onPress={() =>
                  navigation.navigate(Routes.localeList.name, {
                    onSelect: addWineInstance.onSelectAppellation,
                    model: {
                      variable: {
                        country: additionState.country,
                        region: additionState.region,
                        subregion: additionState.subregion,
                      },
                      title: 'Appellation',
                    },
                  })
                }
                disabled={additionState.subregion === '' || additionState.subregion === NOT_LISTED}
                error={''}
                required={false}
              />

              <View style={{flex: 1}}>
                <OutlinedTextField
                  value={additionState.bottleNote}
                  label={'Wish List Note'}
                  onChangeText={(val: string) =>
                    inventoryDispatch({
                      type: BOTTLE_NOTE,
                      payload: val,
                    })
                  }
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
                  style={[styleMultiline, {marginLeft: 22}]}
                  labelOffset={{
                    x0: 10,
                    x1: -1,
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
                  ref={bottleNoteRef}
                />
              </View>

              <ButtonNew
                onPress={() => addWineInstance.checkWineInWishlist(checkInWishlist, additionState, setCheckStatus)}
                style={buttonStyle}
                text={'SAVE'}
                isDisabled={isDisabledButtonWishlist(additionState)}
              />
            </InputScrollView>
          </View>
          <BottomSheetNew
            onPressDone={() =>
              addWineInstance.setBottomSheetVal(vintageRef, DISPLAY_VINTAGE, additionState.vintage.toString())
            }
            ref={vintageRef}>
            <Picker
              style={bottomSheetContainer}
              // @ts-ignore
              itemStyle={{color: 'white'}}
              selectedValue={additionState.vintage}
              pickerData={yearsArr()}
              onValueChange={value =>
                inventoryDispatch({
                  type: VINTAGE,
                  payload: value,
                })
              }
            />
          </BottomSheetNew>

          <BottomSheetNew
            onPressDone={() => {
              addWineInstance.setBottomSheetVal(bottleSizeRef, DISPLAY_BOTTLE_SIZE, additionState.bottleSize);
            }}
            ref={bottleSizeRef}>
            <Picker
              style={bottomSheetContainer}
              selectedValue={additionState.bottleSize}
              pickerData={bottleSizes}
              // @ts-ignore
              itemStyle={{color: 'white'}}
              onValueChange={value =>
                inventoryDispatch({
                  type: BOTTLE_SIZE,
                  payload: value,
                })
              }
            />
          </BottomSheetNew>

          <BottomSheetNew
            onPressDone={() =>
              addWineInstance.setBottomSheetVal(
                currencyRef,
                DISPLAY_CURRENCY,
                Currencies[additionState.currency.toString()],
              )
            }
            ref={currencyRef}>
            <Picker
              style={bottomSheetContainer}
              // @ts-ignore
              itemStyle={{color: 'white'}}
              selectedValue={additionState.currency}
              pickerData={['GBP', 'USD', 'EUR']}
              onValueChange={value =>
                inventoryDispatch({
                  type: CURRENCY,
                  payload: value,
                })
              }
            />
          </BottomSheetNew>
        </View>
      </View>
    </View>
  );
};

export const AddWishlistScreen = AddWishlist;

const {
  leftTabContainer,
  burgerContainer,
  burgerTouchable,
  container,
  inputStyle,
  scrollContainer,
  image,
  imageContainer,
  styleMultiline,
  containerInput,
  bottomSheetContainer,
  buttonStyle,
  currencyContainer,
  currTextStyle,
  titleStyle,
  mainViewStyle,
} = stylesAddWine;
