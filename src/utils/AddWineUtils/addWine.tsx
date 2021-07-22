import {imageResizeAction} from '../ProfileUtils/profilePhoto';
import RNProgressHud from 'progress-hud';
import AsyncStorage from '@react-native-community/async-storage';
import {Alert, Image} from 'react-native';
import {
  CLEAR_ALL,
  PRODUCER,
  SET_APPELLATION,
  SET_COUNTRY,
  SET_IMAGE,
  SET_REGION,
  SET_SUB_REGION,
  SET_VARIETAL,
} from '../../constants/ActionTypes/inventoryAdditions';
import {parseBottleSize} from '../other.utils';

import {NOT_LISTED} from '../../constants/countries';

export class AddWineActions {
  additionState;
  inventoryDispatch;
  getSuggestion;

  constructor(additionState, inventoryDispatch, getSuggestion = null) {
    this.additionState = additionState;
    this.inventoryDispatch = inventoryDispatch;

    if (getSuggestion) {
      this.getSuggestion = getSuggestion;
    }
  }

  onSelectCountry = val => {
    if (val !== this.additionState.country) {
      this.inventoryDispatch({
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

  onSelectPhoto = val => {
    this.inventoryDispatch({
      type: SET_IMAGE,
      payload: val,
    });
  };

  onSelectProducer = val => {
    this.inventoryDispatch({
      type: PRODUCER,
      payload: val,
    });
  };
  onSelectRegion = val => {
    if (val !== this.additionState.region) {
      this.inventoryDispatch({
        type: SET_REGION,
        payload: {
          region: val,
          subregion: val === NOT_LISTED ? NOT_LISTED : '',
          appellation: val === NOT_LISTED ? NOT_LISTED : '',
        },
      });
    }
  };
  onSelectSubregion = val => {
    if (val !== this.additionState.subregion) {
      this.inventoryDispatch({
        type: SET_SUB_REGION,
        payload: {
          subregion: val,
          appellation: val === NOT_LISTED ? NOT_LISTED : '',
        },
      });
    }
  };

  onSelectAppellation = val => {
    this.inventoryDispatch({
      type: SET_APPELLATION,
      payload: val,
    });
  };

  onSelectVarietal = val => {
    this.inventoryDispatch({
      type: SET_VARIETAL,
      payload: val,
    });
  };

  clearAll = scrollRef => () => {
    this.inventoryDispatch({
      type: CLEAR_ALL,
    });
    (scrollRef as any).current.scrollTo({x: 0, y: 0, animated: true});
  };

  setBottomSheetVal = (ref, type, val) => {
    this.inventoryDispatch({
      type,
      payload: val,
    });
    (ref as any).current.close();
  };

  submitAddWine = async (addWine, isToWish) => {
    const bottleSize = this.additionState.displayBottleSize.replace(/[mlL]/g, '');
    const bottleCapacityBackend = bottleSize.includes('.') ? bottleSize : bottleSize / 1000;

    let wineModel: any = {
      producer: this.additionState.producer,
      wineName: this.additionState.wineName,
      vintage: this.additionState.displayVintage,
      bottleCapacity: parseFloat(bottleCapacityBackend),
      price: this.additionState.cost !== '' ? parseFloat(this.additionState.cost) : 0,
      currency: this.additionState.displayCurrency,
      varietal: this.additionState.varietal,
      cellarDesignationId: this.additionState.cellarDesignation.id,
      locale: {
        country: this.additionState.country,
        region: this.additionState.region,
        subregion: this.additionState.subregion,
        appellation: this.additionState.appellation,
      },
    };
    let data: any = {
      numberOfBottles: this.additionState.displayBottleCount,
      bottleNote: this.additionState.bottleNote,
      purchaseDate: this.additionState.displayPurchaseDate,
      deliveryDate: this.additionState.displayDeliveryDate,
      purchaseNote: this.additionState.purchaseNote,
      addToWishList: isToWish,
    };
    data = {...data, wine: {...wineModel}};
    if (this.additionState.imageURI !== 'default') {
      const file = await imageResizeAction(this.additionState.imageURI.uri);
      data = {...data, file: file};
    }
    console.log(data);
    RNProgressHud.show();
    setTimeout(() => {
      addWine({
        variables: {...data},
      });
    }, 150);
  };

  submitCustomToWishlist = async addCustomWineToWishlist => {
    const bottleSize = this.additionState.displayBottleSize.replace(/[mlL]/g, '');
    const bottleCapacityBackend = bottleSize.includes('.') ? bottleSize : bottleSize / 1000;

    let wineModel: any = {
      producer: this.additionState.producer,
      wineName: this.additionState.wineName,
      vintage: this.additionState.displayVintage,
      bottleCapacity: parseFloat(bottleCapacityBackend),
      expectedPrice: this.additionState.cost !== '' ? parseFloat(this.additionState.cost) : 0,
      currency: this.additionState.displayCurrency,
      varietal: this.additionState.varietal,
      locale: {
        country: this.additionState.country,
        region: this.additionState.region,
        subregion: this.additionState.subregion,
        appellation: this.additionState.appellation,
      },
    };
    let data: any = {
      wine: wineModel,
      //TODO: uncomment when a bottle note logic will be done
      // bottleNote: this.additionState.bottleNote,
    };

    if (this.additionState.imageURI !== 'default') {
      const file = await imageResizeAction(this.additionState.imageURI.uri);
      data = {...data, file: file};
    }
    console.log(data);
    RNProgressHud.show();
    setTimeout(() => {
      addCustomWineToWishlist({
        variables: {...data},
      });
    }, 150);
  };

  onCompleted = async (data, client, clearAll, navigation) => {
    if (data.addWine || data.addWishlist) {
      const emptyData = {
        listData: {
          __typename: 'List',
          list: '[]',
        },
      };
      client.writeData({data: emptyData});
      if (/wish/i.test(data.addWineV2)) {
        await AsyncStorage.setItem('Wishlist', JSON.stringify({sync: true}));
      } else {
        await AsyncStorage.setItem('Dashboard', JSON.stringify({sync: true}));
        await AsyncStorage.setItem('Filters', JSON.stringify({sync: true}));
        await AsyncStorage.setItem('Inventory', JSON.stringify({sync: true}));
        await AsyncStorage.setItem('DrinkHistory', JSON.stringify({sync: true}));
      }
      if (navigation.getParam('isStack', false)) {
        navigation.popToTop();
      }
      clearAll();
      RNProgressHud.dismiss();
      Alert.alert('Success', data.addWine);
    }
  };

  calcImgSize = (viewWidth, setImageHeight, setImageWidth) => {
    const MAX_HEIGHT = 200;
    if (this.additionState.imageURI !== 'default') {
      Image.getSize(
        this.additionState.imageURI,
        (width, height) => {
          const p = height / width; //proportion
          let h = MAX_HEIGHT; //height of view
          let w = h / p;
          if (w >= viewWidth) {
            w = viewWidth; //width of view
            h = w * p;
          }
          setImageHeight(h); //set height for border
          setImageWidth(w);
        },
        () => {},
      );
    }
  };

  checkIdentity = (findWine, additionState) => {
    findWine({
      variables: {
        filters: [
          {field: 'producer', values: additionState.producer},
          {field: 'bottleCapacity', values: parseBottleSize(additionState.bottleSize)},
          {field: 'vintage', values: additionState.vintage.toString()},
          {field: 'varietal', values: additionState.varietal},
          {field: 'country', values: additionState.country},
          {field: 'wineName', values: additionState.wineName},
          {
            field: 'region',
            values: [JSON.stringify({country: additionState.country, values: [additionState.region]})],
          },
          {
            field: 'subregion',
            values: [JSON.stringify({country: additionState.region, values: [additionState.subregion]})],
          },
          {
            field: 'appellation',
            values: [JSON.stringify({country: additionState.subregion, values: [additionState.appellation]})],
          },
        ],
      },
    });
  };
  checkWineInWishlist = (checkInWishlist, additionState, setCheckStatus) => {
    RNProgressHud.show();
    checkInWishlist({
      variables: {
        producer: additionState.producer,
        designation: '',
        vintage: additionState.vintage.toString(),
        locale: {
          country: additionState.country,
          region: additionState.region,
          subregion: additionState.subregion,
          appellation: additionState.appellation,
        },
        varietal: additionState.varietal,
        bottleCapacity: Number(parseBottleSize(additionState.bottleSize)),
      },
    });
    setCheckStatus(true);
  };

  getRequestParams = val => {
    const {country, region, subregion, appellation, producer} = this.additionState;

    let variables: any = {
      producer: val,
    };

    if (country && !producer) {
      variables = {
        producer: val,
        locale: {
          country,
          region,
          subregion,
          appellation,
        },
      };
    }

    return variables;
  };
}
