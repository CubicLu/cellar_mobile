import React, {FC, useReducer, useEffect, useRef, useState} from 'react';
import RNProgressHud from 'progress-hud';
import {View, TouchableOpacity, StyleSheet, Keyboard, Image, Alert} from 'react-native';
import {Picker} from '@davidgovea/react-native-wheel-datepicker';
import moment from 'moment';

import {withNavigation, NavigationScreenProp} from 'react-navigation';
import {useMutation, useQuery} from '@apollo/react-hooks';

import {UPDATE_WINE} from '../../../apollo/mutations/updateWine';
import {flagsToUpdateAll} from '../../../utils/inventory.utils';
import textStyle from '../../../constants/Styles/textStyle';
import {timeoutError} from '../../../utils/errorCodes';
import {deleteSame, mapDesignationIdToName} from '../../../utils/other.utils';
import Colors from '../../../constants/colors';
import {Routes} from '../../../constants';
import {
  isDisabledButtonEdit,
  priceValidation,
  drinkWindowStartValidation,
  drinkWindowEndValidation,
} from '../../../utils/validation';

import {InputNew, InfoCell, ButtonNew, BottomSheetNew} from '../../../new_components';
import {DrinkWindowPicker, LocationDesignation} from '../../../components';
import {imageResizeAction} from '../../../utils/ProfileUtils/profilePhoto';
import {CameraWhiteIcon} from '../../../assets/svgIcons';
import {getStringYearsArr} from '../../../constants/yearsArr';

import {Currencies, inventoryAdditionReducer} from '../../../reducers/inventoryAddition.reducer';

import {
  PRODUCER,
  SET_APPELLATION,
  SET_COUNTRY,
  SET_DATA_EDIT,
  SET_IMAGE,
  SET_REGION,
  SET_SUB_REGION,
  COST,
  VINTAGE,
  WINE_NAME,
  SET_DESIGNATION,
  BOTTLE_SIZE,
  SET_VARIETAL,
  SET_DRINK_WINDOW_END,
  SET_DRINK_WINDOW_START,
  CLEAR_DRINK_WINDOW,
} from '../../../constants/ActionTypes/inventoryAdditions';
import {bottleSizes, NOT_LISTED} from '../../../constants/countries';
import {GET_LOCAL_DESIGNATION_LIST} from '../../../apollo/client/queries/InventoryLocalQueries';
import {revertBottleVolumes, volumes} from '../../../utils/currencies';
import {VARIETALS} from '../../../constants/varietals';

type Props = {
  navigation: NavigationScreenProp<any>;
};

const initState = {
  producer: '',
  wineName: '',
  country: '',
  region: '',
  subregion: '',
  appellation: '',
  imageURI: {uri: ''},
  displayCurrency: Currencies.USD,
  cost: '',
  vintage: 2020,
  cellarDesignation: {
    id: 0,
    name: '',
  },
  varietalList: VARIETALS,
  drinkWindowStart: '',
  drinkWindowEnd: '',
};

const Body: FC<Props> = ({navigation}) => {
  const [additionState, inventoryDispatch] = useReducer(inventoryAdditionReducer, initState);
  const wine: any = navigation.getParam('wine', initState);
  const pricePerBottle: any = navigation.getParam('pricePerBottle', 0);
  const priceRef: any = useRef();
  const wineNameRef = useRef();
  const vintageRef = useRef();
  const bottleSizeRef = useRef();
  const [imageWidth] = useState<any>('100%');
  const [imageHeight] = useState(200);
  const [selectedVintage, setSelectedVintage] = useState('');
  const {data: localDesignationList} = useQuery(GET_LOCAL_DESIGNATION_LIST);

  const [updateWineAction] = useMutation(UPDATE_WINE, {
    onCompleted: async data => {
      console.debug(data);
      navigation.goBack();
      await flagsToUpdateAll();
      navigation.state.params.onSelect(data.updateWineV2.data.wine.id);
    },
    onError: error => {
      timeoutError(error);
    },
  });

  useEffect(() => {
    if (wine) {
      inventoryDispatch({
        type: SET_DATA_EDIT,
        payload: {
          imageURI: {uri: wine.pictureURL, cache: 'force-cache'},
          producer: wine.producer,
          country: wine.locale.country,
          region: wine.locale.region,
          subregion: wine.locale.subregion,
          appellation: wine.locale.appellation,
          cost: wine.price.toString(),
          vintage: wine.vintage,
          wineName: wine.wineName,
          cellarDesignation: {
            id: wine.cellarDesignationId,
            name: mapDesignationIdToName(wine.cellarDesignationId, localDesignationList.designationList),
          },
          bottleSize: wine.bottleCapacity,
          varietal: wine.varietal,
          drinkWindowStart:
            moment(wine.drinkWindow.start).get('year') <= 1000
              ? ''
              : `${moment.utc(wine.drinkWindow.start).get('year')}`,
          drinkWindowEnd:
            moment(wine.drinkWindow.end).get('year') <= 1000 ? '' : `${moment.utc(wine.drinkWindow.end).get('year')}`,
        },
      });
      setSelectedVintage(wine.vintage.toString());
      (wineNameRef as any).current.setValue(wine.wineName);
    }
  }, []);

  const onSelectProducer = val => {
    inventoryDispatch({
      type: PRODUCER,
      payload: val,
    });
  };

  const onSelectCountry = val => {
    if (val !== additionState.country) {
      inventoryDispatch({
        type: SET_COUNTRY,
        payload: {
          country: val,
          region: val === NOT_LISTED ? NOT_LISTED : '',
          subregion: val === NOT_LISTED ? NOT_LISTED : '',
          appellation: val === NOT_LISTED ? NOT_LISTED : '',
        },
      });
    }
  };

  const onSelectVarietal = val => {
    if (val !== additionState.varietal) {
      inventoryDispatch({
        type: SET_VARIETAL,
        payload: val,
      });
    }
  };

  const onSelectRegion = val => {
    if (val !== additionState.region) {
      inventoryDispatch({
        type: SET_REGION,
        payload: {
          region: val,
          subregion: val === NOT_LISTED ? NOT_LISTED : '',
          appellation: val === NOT_LISTED ? NOT_LISTED : '',
        },
      });
    }
  };

  const onSelectSubregion = val => {
    if (val !== additionState.subregion) {
      inventoryDispatch({
        type: SET_SUB_REGION,
        payload: {
          subregion: val,
          appellation: val === NOT_LISTED ? NOT_LISTED : '',
        },
      });
    }
  };

  const onSelectAppellation = val => {
    inventoryDispatch({
      type: SET_APPELLATION,
      payload: val,
    });
  };

  const onChangeCost = (val: string) => {
    inventoryDispatch({type: COST, payload: val.replace(',', '.')});
  };

  const onSelectPhoto = val => {
    inventoryDispatch({
      type: SET_IMAGE,
      payload: val,
    });
  };

  const onChangeName = (val: string) => {
    inventoryDispatch({type: WINE_NAME, payload: val});
  };

  const onChangeDrinkWindowStart = (val: string) => {
    inventoryDispatch({type: SET_DRINK_WINDOW_START, payload: val});
  };

  const onChangeDrinkWindowEnd = (val: string) => {
    inventoryDispatch({type: SET_DRINK_WINDOW_END, payload: val});
  };

  const clearDrinkWindow = callback => {
    Alert.alert('', 'Both drink window fields will be cleared', [
      {
        text: 'Clear',
        onPress: () => {
          inventoryDispatch({type: CLEAR_DRINK_WINDOW});
          callback();
        },
      },
      {
        text: 'Cancel',
      },
    ]);
  };

  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          RNProgressHud.show();
          setTimeout(() => {
            RNProgressHud.dismiss();
            navigation.navigate(Routes.camera.name, {
              onSelect: onSelectPhoto,
            });
          }, 500);
        }}
        style={[imageContainer, additionState.imageURI.uri === '' && noImageContainer]}>
        {additionState.imageURI.uri === '' ? (
          <View style={noImageIconContainer}>
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
        contentTextStyle={textStyle.mediumText}
        error={''}
        required={false}
      />
      <InputNew
        placeHolder={'Wine Name'}
        value={additionState.wineName}
        onChange={onChangeName}
        onSubmitEditing={() => Keyboard.dismiss()}
        keyboardType={'default'}
        returnKeyType={'done'}
        error={''}
        requiredColorValidation={Colors.inputBorderGrey}
        containerStyle={topMargin}
        getRef={wineNameRef}
      />

      <InfoCell
        title={'Vintage'}
        content={additionState.vintage}
        onPress={() => (vintageRef as any).current.open()}
        error={''}
        rotate={true}
        required={false}
      />

      <InfoCell
        title={'Varietal'}
        content={additionState.varietal}
        onPress={() =>
          navigation.navigate(Routes.varietalList.name, {
            onSelect: onSelectVarietal,
            data: additionState.varietalList.sort(),
            title: 'Varietal',
          })
        }
        error={''}
        required={true}
      />

      <InfoCell
        title={'Bottle Size, ml'}
        content={volumes(additionState.bottleSize)}
        onPress={() => (bottleSizeRef as any).current.open()}
        error={''}
        rotate={true}
        required={true}
      />

      <InfoCell
        title={'Country'}
        content={additionState.country}
        onPress={() =>
          navigation.navigate(Routes.localeList.name, {
            onSelect: onSelectCountry,
            model: {variable: {}, title: 'Country'},
            isEdit: false,
          })
        }
        required={false}
        error={''}
        contentTextStyle={textStyle.mediumText}
      />
      <InfoCell
        title={'Region'}
        content={additionState.region}
        onPress={() =>
          navigation.navigate(Routes.localeList.name, {
            onSelect: onSelectRegion,
            model: {
              variable: {country: additionState.country},
              title: 'Region',
            },
            isEdit: true,
          })
        }
        disabled={!additionState.country || additionState.country === NOT_LISTED}
        required={true}
        contentTextStyle={textStyle.mediumText}
        error={''}
      />

      <InfoCell
        title={'Subregion'}
        content={additionState.subregion}
        onPress={() =>
          navigation.navigate(Routes.localeList.name, {
            onSelect: onSelectSubregion,
            model: {
              variable: {country: additionState.country, region: additionState.region},
              title: 'Subregion',
            },
            isEdit: true,
          })
        }
        disabled={!additionState.region || additionState.region === NOT_LISTED}
        required={true}
        contentTextStyle={textStyle.mediumText}
        error={''}
      />
      <InfoCell
        title={'Appellation'}
        content={additionState.appellation}
        onPress={() =>
          navigation.navigate(Routes.localeList.name, {
            onSelect: onSelectAppellation,
            model: {
              variable: {
                country: additionState.country,
                region: additionState.region,
                subregion: additionState.subregion,
              },
              title: 'Appellation',
            },
            isEdit: true,
          })
        }
        disabled={!additionState.subregion || additionState.subregion === NOT_LISTED}
        required={true}
        contentTextStyle={textStyle.mediumText}
        error={''}
      />

      <DrinkWindowPicker
        onPressCancel={clearDrinkWindow}
        onPressDone={onChangeDrinkWindowStart}
        variant="start-date"
        content={additionState.drinkWindowStart}
        errorText={drinkWindowStartValidation(additionState.drinkWindowStart, additionState.drinkWindowEnd)}
      />

      <DrinkWindowPicker
        onPressCancel={clearDrinkWindow}
        onPressDone={onChangeDrinkWindowEnd}
        variant="end-date"
        content={additionState.drinkWindowEnd}
        errorText={drinkWindowEndValidation(additionState.drinkWindowStart, additionState.drinkWindowEnd)}
      />

      <LocationDesignation
        onChangeValue={value => {
          inventoryDispatch({type: SET_DESIGNATION, payload: value});
        }}
        selectedValue={additionState.cellarDesignation}
      />

      <InputNew
        placeHolder={'Purchase Price'}
        value={pricePerBottle.toString()}
        onChange={onChangeCost}
        onSubmitEditing={() => Keyboard.dismiss()}
        keyboardType={'decimal-pad'}
        returnKeyType={'done'}
        error={priceValidation(additionState.cost)}
        x1={2}
        requiredColorValidation={Colors.inputBorderGrey}
        containerStyle={topMargin}
        getRef={priceRef}
      />

      <ButtonNew
        text="SAVE"
        style={buttonStyle}
        onPress={() => updateWine(additionState, updateWineAction, wine)}
        isDisabled={isDisabledButtonEdit(additionState, wine)}
      />

      <BottomSheetNew
        onPressDone={() => {
          inventoryDispatch({
            type: VINTAGE,
            payload: selectedVintage,
          });
          (vintageRef as any).current.close();
        }}
        ref={vintageRef}>
        <Picker
          style={bottomSheetContainer}
          // @ts-ignore
          itemStyle={whiteColor}
          selectedValue={selectedVintage}
          pickerData={getStringYearsArr()}
          onValueChange={value => setSelectedVintage(value)}
        />
      </BottomSheetNew>

      <BottomSheetNew
        onPressDone={() => {
          (bottleSizeRef as any).current.close();
        }}
        ref={bottleSizeRef}>
        <Picker
          style={bottomSheetContainer}
          selectedValue={volumes(additionState.bottleSize)}
          pickerData={bottleSizes}
          // @ts-ignore
          itemStyle={whiteColor}
          onValueChange={value =>
            inventoryDispatch({
              type: BOTTLE_SIZE,
              payload: revertBottleVolumes(value),
            })
          }
        />
      </BottomSheetNew>
    </View>
  );
};

const updateWine = async (state, updateAction, wine) => {
  state.cellarDesignationId = state.cellarDesignation.id;
  let updatedState = {
    ...state,
    bottleCapacity: +state.bottleSize,
    cost: Number(state.cost),
    drinkDateStart:
      state.drinkWindowStart === '' ? moment.utc(new Date(1000, 1)) : moment.utc(new Date(state.drinkWindowStart, 1)),
    drinkDateEnd:
      state.drinkWindowEnd === '' ? moment.utc(new Date(1000, 1)) : moment.utc(new Date(state.drinkWindowEnd, 1)),
  };

  const compareObj = {
    producer: wine.producer,
    appellation: wine.locale.appellation,
    country: wine.locale.country,
    region: wine.locale.region,
    subregion: wine.locale.subregion,
    cost: Number(wine.price),
    vintage: wine.vintage,
    wineName: wine.wineName,
    cellarDesignationId: wine.cellarDesignationId,
    varietal: wine.varietal,
    bottleCapacity: wine.bottleCapacity,
    drinkDateStart: wine.drinkWindow.start,
    drinkDateEnd: wine.drinkWindow.end,
  };
  updatedState = deleteSame(updatedState, compareObj);
  if (updatedState.imageURI.uri !== wine.pictureURL) {
    const file = await imageResizeAction(updatedState.imageURI.uri);
    updatedState = {...updatedState, file: file};
  }
  delete updatedState.imageURI;
  delete updatedState.cellarDesignation;
  delete updatedState.varietalList;
  delete updatedState.drinkWindowStart;
  delete updatedState.drinkWindowEnd;

  updatedState = {...updatedState, wineId: wine.id};
  updatedState.wineName = state.wineName;
  updatedState.cellarDesignationId = state.cellarDesignationId;

  RNProgressHud.show();
  console.log('Updated fields', updatedState);
  setTimeout(() => {
    updateAction({
      variables: {...updatedState},
    });
  }, 200);
};

const styles = StyleSheet.create({
  buttonStyle: {
    minHeight: 50,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    backgroundColor: Colors.orangeDashboard,
    marginTop: 20,
  },
  image: {
    height: '100%',
    width: '100%',
  },
  imageContainer: {
    alignSelf: 'center',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    borderColor: 'white',
  },
  noImageContainer: {
    borderWidth: 2,
  },
  noImageIconContainer: {height: 200, justifyContent: 'center', alignItems: 'center'},
  bottomSheetContainer: {
    width: '100%',
    backgroundColor: 'black',
  },
  topMargin: {marginTop: 20},
  whiteColor: {color: 'white'},
});

const {
  buttonStyle,
  image,
  topMargin,
  imageContainer,
  noImageContainer,
  noImageIconContainer,
  bottomSheetContainer,
  whiteColor,
} = styles;

export const InventoryEditWineBody = withNavigation(Body);
