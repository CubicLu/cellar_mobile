import RNProgressHud from 'progress-hud';
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, StatusBar, ScrollView, Image, Dimensions} from 'react-native';
import Colors from '../../constants/colors';
import Navigation from '../../types/navigation';
import {getStatusBarHeight} from 'react-native-iphone-x-helper';
import {CloseIconWhite, PencilWhiteIcon, WishEmptyIcon} from '../../assets/svgIcons';
import {useLazyQuery, useMutation} from '@apollo/react-hooks';
import {ADD_TO_WISHLIST, REMOVE_FROM_WISHLIST} from '../../apollo/mutations/addOrRemoveWishlist';
import {WINE_NOTES} from '../../apollo/queries/wineHistory';
import AsyncStorage from '@react-native-community/async-storage';
import {WINE} from '../../apollo/queries/wine';
import {Routes} from '../../constants';
import {NavigationEvents} from 'react-navigation';
import {BottleNotes} from '../../new_components';
import {WineImage} from '../../components';
import {renameKeyName} from '../../utils/other.utils';
import textStyle from '../../constants/Styles/textStyle';
import images from '../../assets/images';
import {formatPrice, volumes} from '../../utils/currencies';
import Header from '../../new_components/WineDetailsComponents/Header';

interface InventoryProps {
  navigation: Navigation;
}

/**
 * All info about this screen you can found here https://cellarventures.atlassian.net/wiki/spaces/CA/pages/50626675/Wine+details
 */

const WineDetails: React.FC<InventoryProps> = ({navigation}) => {
  const [wineId] = useState(navigation.getParam('wineId', null));
  const [modalActive, setModalActinve] = useState(false);
  const [color] = useState(navigation.getParam('color', '#7C0C07'));
  const showAveragePrice = navigation.getParam('showAveragePrice', false);
  const expectedPrice = navigation.getParam('expectedPrice', -1);
  const [disableEdit] = useState(navigation.getParam('disableEdit', false));
  const [errorMessage, setErrorMessage] = useState('');
  const [addToWish, {loading: addLoading}] = useMutation(ADD_TO_WISHLIST, {
    onCompleted: async data => {
      console.log(data);
      setInWish(true);
      setErrorMessage('');
      await AsyncStorage.setItem('Wishlist', JSON.stringify({sync: true}));
    },
    onError: error => {
      console.log(error);
      setErrorMessage(error.message.toString());
    },
  });

  const [wineModel, setWineModel] = useState(undefined);
  const onLoadWine = () => {
    RNProgressHud.show();
    setTimeout(() => {
      getWine({variables: {wineId: wineId}});
    }, 300);
  };

  const [removeFromWish, {loading: removeLoading}] = useMutation(REMOVE_FROM_WISHLIST, {
    onCompleted: async data => {
      console.log(data);
      setInWish(false);
      setErrorMessage('');
      await AsyncStorage.setItem('Wishlist', JSON.stringify({sync: true}));
    },
    onError: error => {
      console.log(error);
      setErrorMessage(error.message.toString());
    },
  });
  const [getWine, {loading: loadWine, error: wineError}] = useLazyQuery(WINE, {
    fetchPolicy: 'network-only',
    onCompleted: data => {
      const temp = renameKeyName(data, 'wineV2', 'wine');
      setWineModel(temp);
      setInWish(temp.wine.wine.inWishList);
      setErrorMessage('');
    },
  });

  const [getBottleNotes, {loading: notesLoading, data: bottleNotes}] = useLazyQuery(WINE_NOTES);
  const [isInWish, setInWish] = useState(undefined);
  useEffect(() => {
    onLoadWine();
    getBottleNotes({variables: {wineId: wineId}});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getWine, wineId]);

  useEffect(() => {
    if (wineError) {
      setErrorMessage(wineError.message.toString());
    }
  }, [wineError]);

  const toggleModal = () => setModalActinve(v => !v);
  console.log(wineModel);
  return (
    <View style={{height: '100%', paddingTop: getStatusBarHeight(true), backgroundColor: Colors.dashboardDarkTab}}>
      {loadWine && RNProgressHud.dismiss()}
      <NavigationEvents
        onWillFocus={() => {
          StatusBar.setBarStyle('light-content');
        }}
      />
      <Header label="Wine Details" goBack={() => navigation.goBack()} />

      <View style={{flex: 1}}>
        <ScrollView contentContainerStyle={{flexGrow: 1, paddingBottom: 40}} style={container}>
          {wineModel && (
            <View style={imageContainer}>
              {wineModel.wine.pictureURL !== '' ? (
                <WineImage uri={wineModel.wine.wine.pictureURL} triange={true} />
              ) : (
                <TouchableOpacity onPress={() => {}}>
                  <WineImage uri={wineModel.wine.wine.pictureURL} triange={true} />
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={{position: 'absolute', right: 20, bottom: 20}}
                onPress={() => {
                  isInWish ? removeFromWish({variables: {wineId: wineId}}) : addToWish({variables: {wineId: wineId}});
                }}>
                {isInWish ? (
                  <Image source={images.avesomeHeart} width={20} height={20} />
                ) : (
                  <WishEmptyIcon width={51} height={51} />
                )}
              </TouchableOpacity>
              {/* {wineModel && <View style={triangle} />} */}
            </View>
          )}

          {wineModel && (
            <>
              <View style={redContainer}>
                <Text style={vintage}>{wineModel.wine.wine.vintage}</Text>
                <Text style={wineTitle}>{wineModel.wine.wine.wineTitle}</Text>
                <View style={bottleContainer}>
                  <Text style={bottleSizeText}>Bottle size: {volumes(wineModel.wine.wine.bottleCapacity)}</Text>
                  <TouchableOpacity
                    style={bottleImgContainer}
                    onPress={() => {
                      navigation.navigate(Routes.myCellar.name, {
                        data: {
                          wine: wineModel.wine.wine,
                          quantity: wineModel.wine.quantity,
                        },
                      });
                    }}>
                    <Image source={images.wineBottle} width={25} height={34} />
                    <Text style={quantity}> {wineModel.wine.quantity}</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={infoContainer}>
                <View>
                  <Text style={[text, priceLeft]}>${formatPrice(wineModel.wine.pricePerBottle)}</Text>
                  <Text style={[text, {marginRight: 15}]}>Purchase Price</Text>
                </View>
                <View style={borderVertical} />
                <View>
                  <Text style={[text, priceRight]}>$0.00</Text>
                  <Text style={[text, {marginLeft: 15}]}>Estimated market price</Text>
                </View>
              </View>
              <View style={row}>
                <Text style={mediumText}>Country</Text>
                <Text style={boldText}>{wineModel.wine.wine.locale.country}</Text>
              </View>
              <View style={row}>
                <Text style={mediumText}>Region</Text>
                <Text style={boldText}>{wineModel.wine.wine.locale.region}</Text>
              </View>
              <View style={row}>
                <Text style={mediumText}>Subregion</Text>
                <Text style={boldText}>{wineModel.wine.wine.locale.subregion}</Text>
              </View>
              <View style={row}>
                <Text style={mediumText}>Appellation</Text>
                <Text style={boldText}>{wineModel.wine.wine.locale.appellation}</Text>
              </View>
              <View style={row}>
                <Text style={mediumText}>Location</Text>
                <Text style={boldText}>none</Text>
              </View>
              <View style={[row, {marginBottom: 20}]}>
                <Text style={mediumText}>Variatel</Text>
                <Text style={boldText}>{wineModel.wine.wine.varietal}</Text>
              </View>
            </>
          )}

          {/* <WineBody
            onShowModal={toggleModal}
            expectedPrice={expectedPrice >= 0 ? expectedPrice : undefined}
            color={color}
            wineModel={wineModel}
            showAveragePrice={showAveragePrice}>
            {wineModel && (
              <>
                <BottomButtons
                  wineModel={wineModel}
                  isInWish={isInWish}
                  isWishDisabled={addLoading || removeLoading}
                  onPressWish={() => {
                    isInWish ? removeFromWish({variables: {wineId: wineId}}) : addToWish({variables: {wineId: wineId}});
                  }}
                  onPressBottle={() => {
                    navigation.navigate(Routes.myCellar.name, {
                      data: {
                        wine: wineModel.wine.wine,
                        quantity: wineModel.wine.quantity,
                      },
                    });
                  }}
                />
                <ImagePreviewer
                  imgUri={wineModel.wine.wine.pictureURL}
                  isVisible={modalActive}
                  toggleVisibility={toggleModal}
                />
              </>
            )}
          </WineBody> */}

          {wineModel && wineModel.wine.quantity > 0 && !disableEdit && (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate(Routes.editWine.name, {wine: wineModel.wine.wine, onSelect: onLoadWine})
              }
              style={editContainer}>
              <PencilWhiteIcon width={25} height={25} />
            </TouchableOpacity>
          )}

          {wineModel && wineModel.wine.quantity > 0 && !disableEdit && (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate(Routes.editWine.name, {
                  wine: wineModel.wine.wine,
                  onSelect: onLoadWine,
                  pricePerBottle: wineModel.wine.pricePerBottle,
                })
              }
              style={editContainer}>
              <PencilWhiteIcon width={25} height={25} />
            </TouchableOpacity>
          )}
          {bottleNotes && <BottleNotes data={bottleNotes.wineHistory} loading={!(notesLoading && loadWine)} />}
        </ScrollView>
      </View>
      {errorMessage !== '' && (
        <View style={errorContainer}>
          <Text style={errorText}>{errorMessage}</Text>
        </View>
      )}
    </View>
  );
};

export const WineDetailsNewUI = WineDetails;

export const stylesWineDetails = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    marginBottom: 20,
    minHeight: 300,
  },
  editContainer: {
    position: 'absolute',
    right: 20,
    height: 34,
    width: 34,
    backgroundColor: Colors.transparentWhite,
    alignItems: 'center',
    padding: 5,
    top: 33,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    alignItems: 'center',
    paddingBottom: 20,
    backgroundColor: '#041B1E',
  },
  headerText: {
    fontSize: 24,
    color: 'white',
    ...textStyle.mediumText,
  },

  redContainer: {
    backgroundColor: Colors.dashboardRed,
    zIndex: 1,
    paddingLeft: 20,
    paddingBottom: 20,
  },
  vintage: {
    color: '#fff',
    fontSize: 30,
    marginBottom: 10,
    ...textStyle.mediumText,
  },
  wineTitle: {
    color: '#fff',
    fontSize: 36,
    ...textStyle.boldText,
  },
  bottleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bottleSizeText: {fontSize: 16, color: 'white', ...textStyle.boldText},
  bottleImgContainer: {flexDirection: 'row', alignItems: 'center', marginRight: 23},
  quantity: {
    fontSize: 26,
    color: 'white',
    ...textStyle.boldText,
  },
  row: {flexDirection: 'row', paddingLeft: 20},
  boldText: {fontSize: 16, color: 'white', flex: 1, ...textStyle.boldText},
  mediumText: {
    flex: 1,
    fontSize: 16,
    color: 'white',
    ...textStyle.mediumText,
  },
  infoContainer: {
    flexDirection: 'row',
    paddingLeft: 20,
    paddingVertical: 30,
    backgroundColor: Colors.dashboardDarkTab,
    marginBottom: 20,
    alignItems: 'center',
  },
  text: {color: '#fff', fontSize: 16, ...textStyle.mediumText},
  priceLeft: {fontSize: 30, marginRight: 15, ...textStyle.boldText},
  priceRight: {fontSize: 30, marginLeft: 15, ...textStyle.boldText},
  borderVertical: {borderWidth: 1, borderStyle: 'dashed', borderColor: 'white', height: '120%'},
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 24,
    marginBottom: 150,
  },
  imageContainer: {
    minHeight: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
const {
  container,
  editContainer,
  header,
  headerText,
  triangle,
  redContainer,
  vintage,
  wineTitle,
  bottleContainer,
  bottleSizeText,
  bottleImgContainer,
  quantity,
  row,
  boldText,
  mediumText,
  infoContainer,
  text,
  priceLeft,
  priceRight,
  borderVertical,
  errorContainer,
  errorText,
  imageContainer,
} = stylesWineDetails;
