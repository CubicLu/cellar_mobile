import RNProgressHud from 'progress-hud';
import React, {useRef, useReducer, useState, useEffect, useCallback} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ImageBackground,
  Keyboard,
  StatusBar,
  Alert,
} from 'react-native';
import {Picker} from '@davidgovea/react-native-wheel-datepicker';
import InputScrollView from 'react-native-input-scroll-view';
import {getStatusBarHeight} from 'react-native-iphone-x-helper';
import {OutlinedTextField} from 'react-native-material-textfield-label-fixed';
import {useApolloClient, useLazyQuery, useMutation, useQuery} from '@apollo/react-hooks';
import DateTimePicker from '@react-native-community/datetimepicker';

import {ADD_WINE_MUTATION} from '../../../apollo/mutations/addWine';
import {ADD_OR_REMOVE_BOTTLES} from '../../../apollo/mutations/addOrRemoveBottles';

import Photos from '../../../assets/photos';
import {bottleSizes, NOT_LISTED} from '../../../constants/countries';
import {
  BOTTLE_COUNT,
  BOTTLE_NOTE,
  BOTTLE_SIZE,
  WINE_NAME,
  COST,
  CURRENCY,
  DELIVERY_DATE,
  DISPLAY_BOTTLE_COUNT,
  DISPLAY_BOTTLE_SIZE,
  DISPLAY_CURRENCY,
  DISPLAY_DELIVERY_DATE,
  DISPLAY_PURCHASE_DATE,
  DISPLAY_VINTAGE,
  PURCHASE_DATE,
  PURCHASE_NOTE,
  VINTAGE,
  CLEAR_ALL,
  SET_DESIGNATION,
  SET_LOCATION_SUGGESTION,
} from '../../../constants/ActionTypes/inventoryAdditions';
import {Currencies, initState, inventoryAdditionReducer} from '../../../reducers/inventoryAddition.reducer';
import Navigation from '../../../types/navigation';
import {costValidation, isDisabledButton, requiredColorValidation} from '../../../utils/validation';
import {timeoutError} from '../../../utils/errorCodes';
import {BurgerIcon, CameraWhiteIcon} from '../../../assets/svgIcons';
import Colors from '../../../constants/colors';
import textStyle from '../../../constants/Styles/textStyle';
import {Routes} from '../../../constants';
import {yearsArr} from '../../../constants/yearsArr';
import {AddWineActions} from '../../../utils/AddWineUtils/addWine';
import {NavigationEvents} from 'react-navigation';
import {INVENTORY_SEARCH_MUTATION} from '../../../apollo/mutations/searchInventory';
import {flagsToUpdateAll} from '../../../utils/inventory.utils';
import {LocationDesignation} from '../../../components';
import {InputNew, InfoCell, BottomSheetNew, ButtonNew} from '../../../new_components';
import {mapDesignationIdToName, renameKeyName} from '../../../utils/other.utils';
import {GET_LOCAL_DESIGNATION_LIST} from '../../../apollo/client/queries/InventoryLocalQueries';
import {GET_LOCATION_SUGGESTION} from '../../../apollo/queries/wineProducers';

interface InventoryAdditionProps {
  navigation: Navigation;
}

/**
 * All info about this screen you can found here https://cellarventures.atlassian.net/wiki/spaces/CA/pages/27394049/Add+wine+screen
 */

const AddWineNew: React.FC<InventoryAdditionProps> = ({navigation}) => {
  const [additionState, inventoryDispatch] = useReducer(inventoryAdditionReducer, initState);

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

  const addWineInstance = new AddWineActions(additionState, inventoryDispatch, getSuggestion);

  const purchaseRef = useRef();
  const deliveryRef = useRef();
  const vintageRef = useRef();
  const currencyRef = useRef();
  const bottleSizeRef = useRef();
  const bottleCountRef = useRef();
  const scrollRef = useRef();
  const wineNameRef = useRef();
  const costRef = useRef();
  const bottleNoteRef = useRef();
  const purchaseNoteRef = useRef();

  const [imageWidth, setImageWidth] = useState<any>('100%');
  const [imageHeight, setImageHeight] = useState(200);
  const [viewWidth, setViewWidth] = useState(200);
  const {data: localDesignationList} = useQuery(GET_LOCAL_DESIGNATION_LIST);

  useEffect(() => {
    (wineNameRef as any).current.setValue(additionState.wineName);
  }, [additionState]);

  const client = useApolloClient();

  const [addWine] = useMutation(ADD_WINE_MUTATION, {
    onCompleted: async data => {
      (wineNameRef as any).current.clear();
      (costRef as any).current.clear();
      (bottleNoteRef as any).current.clear();
      (purchaseNoteRef as any).current.clear();
      await addWineInstance.onCompleted(
        renameKeyName(data, 'addWineV2', 'addWine'),
        client,
        addWineInstance.clearAll(scrollRef),
        navigation,
      );
      await flagsToUpdateAll();
    },
    onError: error => {
      timeoutError(error);
    },
  });

  const [addOrRemove] = useMutation(ADD_OR_REMOVE_BOTTLES, {
    onCompleted: async ({addOrRemoveBottlesV2: {message}}) => {
      (wineNameRef as any).current.clear();
      (costRef as any).current.clear();
      (bottleNoteRef as any).current.clear();
      (purchaseNoteRef as any).current.clear();
      inventoryDispatch({type: CLEAR_ALL});
      (scrollRef as any).current.scrollTo({x: 0, y: 0, animated: true});
      RNProgressHud.dismiss();
      Alert.alert(message);
      await flagsToUpdateAll();
    },
    onError: error => {
      RNProgressHud.dismiss();
      try {
        console.log(error);
        Alert.alert('Error', error.graphQLErrors[0].message);
      } catch (e) {
        Alert.alert('Error', error.message);
      }
    },
  });

  const [findWine] = useMutation(INVENTORY_SEARCH_MUTATION, {
    onCompleted: ({searchInventoryV2: {data}}) => {
      if (data.length >= 1) {
        let message = '';

        if (data[0].wine.cellarDesignationId !== 0) {
          message = `\nDesignation ${mapDesignationIdToName(
            data[0].wine.cellarDesignationId,
            localDesignationList.designationList,
          )}`;
        }

        return Alert.alert(
          `This wine already exists in your inventory.${message}`,
          'Do you wish to add your entry to already existing?',
          [
            {
              text: 'No',
              onPress: () => {},
            },
            {
              text: 'Yes',
              onPress: () => {
                RNProgressHud.show();
                addOrRemove({
                  variables: {
                    wineId: data[0].wine.id,
                    numberOfBottles: additionState.bottleCount,
                    date: new Date(),
                    note: additionState.purchaseNote,
                    cellarDesignation: additionState.cellarDesignation,
                    bottleNote: additionState.bottleNote,
                    reason: undefined,
                  },
                });
              },
              style: 'cancel',
            },
          ],
        );
      }
      if (data.length < 1) {
        return addWineInstance.submitAddWine(addWine, false);
      }
      // it is a fallback to not lose user's data;
      addWineInstance.submitAddWine(addWine, false);
    },
    onError: error => console.log(error),
  });

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

  useEffect(() => {
    addWineInstance.calcImgSize(viewWidth, setImageHeight, setImageWidth);
  }, [additionState.imageURI]);

  const onChangeField = title => val => {
    inventoryDispatch({type: title, payload: val});
  };

  const onSelectRecognized = payload =>
    inventoryDispatch({
      type: 'SET_FULL_WINE',
      payload: payload,
    });

  return (
    <View style={mainViewStyle}>
      <NavigationEvents
        onWillFocus={() => {
          StatusBar.setBarStyle('light-content');
        }}
      />
      <View style={{flex: 1, flexDirection: 'row'}}>
        <ImageBackground source={Photos.bgPhotoAdd} style={leftTabContainer} resizeMode={'cover'}>
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
                Add Inventory
              </Text>
              <TouchableOpacity
                onPress={() => {
                  RNProgressHud.show();
                  setTimeout(() => {
                    RNProgressHud.dismiss();
                    navigation.navigate(Routes.photoRecognition.name, {
                      onSelect: onSelectRecognized,
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
                title={'Bottle Count'}
                content={additionState.displayBottleCount}
                onPress={() => (bottleCountRef as any).current.open()}
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
              <LocationDesignation
                onChangeValue={value => {
                  inventoryDispatch({type: SET_DESIGNATION, payload: value});
                }}
                selectedValue={additionState.cellarDesignation}
              />

              <View style={{flexDirection: 'row', marginTop: 20}}>
                <InputNew
                  placeHolder={'Purchase Price'}
                  value={additionState.cost}
                  onChange={onChangeField(COST)}
                  onSubmitEditing={() => Keyboard.dismiss()}
                  keyboardType={'numeric'}
                  returnKeyType={'done'}
                  // commented untill currency logic will be done on the backend
                  // containerStyle={{width: '60%'}}
                  requiredColorValidation={requiredColorValidation(
                    additionState.cost,
                    costValidation(additionState.cost),
                  )}
                  x1={-2.5}
                  error={costValidation(additionState.cost)}
                  getRef={costRef}
                />
                {/* // commented untill currency logic will be done on the backend */}
                {/* <TouchableOpacity onPress={() => (currencyRef as any).current.open()} style={currencyContainer}>
                  <Text style={currTextStyle}>{additionState.displayCurrency}</Text>
                  <ChevronItem rotate={true} chevron={true} />
                </TouchableOpacity> */}
              </View>
              <View style={{flex: 1}}>
                <OutlinedTextField
                  value={additionState.bottleNote}
                  label={'Bottle Note'}
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
                    x1: 1.5,
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
                required={true}
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
                required={true}
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
                required={true}
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
                required={true}
              />

              <InfoCell
                title={'Purchase Date'}
                content={additionState.displayPurchaseDate}
                onPress={() => (purchaseRef as any).current.open()}
                error={''}
                required={false}
                rotate={true}
              />
              <InfoCell
                title={'Delivery Date'}
                content={additionState.displayDeliveryDate}
                onPress={() => (deliveryRef as any).current.open()}
                error={''}
                required={false}
                rotate={true}
              />

              <View style={{flex: 1}}>
                <OutlinedTextField
                  value={additionState.purchaseNote}
                  label={'Purchase Note'}
                  onChangeText={(val: string) =>
                    inventoryDispatch({
                      type: PURCHASE_NOTE,
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
                  style={[styleMultiline, {marginLeft: 24}]}
                  labelOffset={{
                    x0: 10,
                    x1: -2.5,
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
                  labelTextStyle={[{...textStyle.mediumText}]}
                  error={''}
                  errorColor={Colors.inputError}
                  backgroundLabelColor={'black'}
                  ref={purchaseNoteRef}
                />
              </View>
              <ButtonNew
                onPress={() => addWineInstance.checkIdentity(findWine, additionState)}
                style={buttonStyle}
                text={'SAVE'}
                isDisabled={isDisabledButton(additionState) || costValidation(additionState.cost) !== ''}
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
              addWineInstance.setBottomSheetVal(bottleCountRef, DISPLAY_BOTTLE_COUNT, additionState.bottleCount)
            }
            ref={bottleCountRef}>
            <Picker
              style={bottomSheetContainer}
              // @ts-ignore
              itemStyle={{color: 'white'}}
              selectedValue={additionState.bottleCount}
              pickerData={Array.from({length: 100}, (v, k) => k + 1)}
              onValueChange={value =>
                inventoryDispatch({
                  type: BOTTLE_COUNT,
                  payload: value,
                })
              }
            />
          </BottomSheetNew>

          <BottomSheetNew
            onPressDone={() =>
              addWineInstance.setBottomSheetVal(
                purchaseRef,
                DISPLAY_PURCHASE_DATE,
                additionState.purchaseDate.toDateString(),
              )
            }
            ref={purchaseRef}>
            <DateTimePicker
              mode="date"
              display="spinner"
              style={bottomSheetContainer}
              textColor={'white'}
              value={additionState.purchaseDate}
              maximumDate={new Date()}
              minimumDate={new Date('1630-01-01T00:00:00.000Z')}
              onChange={(event, selectedDate) =>
                inventoryDispatch({
                  type: PURCHASE_DATE,
                  payload: selectedDate,
                })
              }
            />
          </BottomSheetNew>

          <BottomSheetNew
            onPressDone={() =>
              addWineInstance.setBottomSheetVal(
                deliveryRef,
                DISPLAY_DELIVERY_DATE,
                additionState.deliveryDate.toDateString(),
              )
            }
            ref={deliveryRef}>
            <DateTimePicker
              mode="date"
              display="spinner"
              style={bottomSheetContainer}
              textColor={'white'}
              value={additionState.deliveryDate}
              maximumDate={new Date('2045-01-01T00:00:00.000Z')}
              minimumDate={new Date('1630-01-01T00:00:00.000Z')}
              onChange={(event, selectedDate) =>
                inventoryDispatch({
                  type: DELIVERY_DATE,
                  payload: selectedDate,
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

export const AddWineNewScreen = AddWineNew;

export const stylesAddWine = StyleSheet.create({
  mainViewStyle: {
    height: '100%',
    backgroundColor: 'black',
    paddingTop: getStatusBarHeight(true),
  },
  leftTabContainer: {
    height: '100%',
    width: 80,
  },
  burgerContainer: {
    backgroundColor: Colors.dashboardRed,
  },
  burgerTouchable: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    height: '100%',
    width: '80%',
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: 'black',
    flex: 1,
  },
  image: {
    borderWidth: 2,
    borderColor: 'white',
    maxHeight: 200,
    alignSelf: 'center',
  },
  scrollContainer: {
    flex: 1,
  },
  imageContainer: {
    alignSelf: 'center',
    marginTop: 48,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    borderColor: 'white',
  },
  inputStyle: {
    paddingTop: 0,
    paddingBottom: 0,
    minHeight: 200,
  },
  styleMultiline: {
    fontSize: 21,
    color: 'white',
    ...textStyle.boldText,
    alignSelf: 'flex-start',
    paddingTop: 0,
    paddingBottom: 0,
    marginLeft: 18,
  },
  containerInput: {
    marginTop: 20,
    minHeight: 200,
    width: '100%',
    alignItems: 'flex-start',
  },
  bottomSheetContainer: {
    width: '100%',
    backgroundColor: 'black',
  },
  buttonStyle: {
    minHeight: 50,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    backgroundColor: Colors.orangeDashboard,
    marginTop: 20,
  },
  currencyContainer: {
    width: '38%',
    borderWidth: 2,
    borderColor: Colors.inputBorderGrey,
    height: 50,
    alignItems: 'center',
    flexDirection: 'row',
    marginLeft: 5,
  },
  currTextStyle: {
    ...textStyle.boldText,
    fontSize: 21,
    color: 'white',
    width: '76%',
    paddingLeft: 20,
  },
  titleStyle: {
    color: 'white',
    fontSize: 45,
    ...textStyle.mediumText,
  },
});

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
  titleStyle,
  mainViewStyle,
} = stylesAddWine;
