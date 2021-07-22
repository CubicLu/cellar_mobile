import React, {FC, useState} from 'react';
import RNProgressHud from 'progress-hud';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  ScrollView,
  Dimensions,
  Image,
} from 'react-native';
import {NavigationScreenProp, withNavigation} from 'react-navigation';
import ImageViewer from 'react-native-image-zoom-viewer';
import {useLazyQuery, useMutation} from '@apollo/react-hooks';

import {GET_WINE_WITH_HISTORY} from '../../apollo/queries/wine';
import textStyle from '../../constants/Styles/textStyle';
import {WineImage} from '../../components';
import {HistoryItemNew} from '../../new_components';
import {renameKeyName} from '../../utils/other.utils';
import {ADD_TO_WISHLIST, REMOVE_FROM_WISHLIST} from '../../apollo/mutations/addOrRemoveWishlist';
import AsyncStorage from '@react-native-community/async-storage';
import {CloseIconWhite, WishEmptyIcon} from '../../assets/svgIcons';
import colors from '../../constants/colors';
import {volumes} from '../../utils/currencies';
import images from '../../assets/images';
import Header from '../../new_components/WineDetailsComponents/Header';
import {Routes} from '../../constants';

type Props = {
  navigation: NavigationScreenProp<any>;
};

const WineDetails: FC<Props> = ({navigation}) => {
  const [preview, setPreview] = useState(false);
  const [initData, setInitData] = useState(navigation.getParam('initData'));
  const [isInWish, setInWish] = useState(initData.wine.wine.inWishList);

  const [getWineDetails] = useLazyQuery(GET_WINE_WITH_HISTORY, {
    onCompleted: data => {
      RNProgressHud.dismiss();
      setInitData(renameKeyName(data, 'wineV2', 'wine'));
    },
    onError: error => {
      RNProgressHud.dismiss();
      console.log(error.message);
    },
    variables: {
      wineId: initData.wine.wine.id,
    },
    fetchPolicy: 'no-cache',
  });

  console.log(initData);

  const [removeFromWish] = useMutation(REMOVE_FROM_WISHLIST, {
    onCompleted: async () => {
      RNProgressHud.dismiss();
      setInWish(false);
      await AsyncStorage.setItem('Wishlist', JSON.stringify({sync: true}));
    },
    onError: error => {
      console.log(error);
      RNProgressHud.dismiss();
    },
  });

  const [addToWish] = useMutation(ADD_TO_WISHLIST, {
    onCompleted: async () => {
      RNProgressHud.dismiss();
      setInWish(true);
      await AsyncStorage.setItem('Wishlist', JSON.stringify({sync: true}));
    },
    onError: error => {
      console.log(error);
      RNProgressHud.dismiss();
    },
  });

  const setLike = () => {
    // RNProgressHud.show();
    isInWish
      ? removeFromWish({variables: {wineId: initData.wine.wine.id}})
      : addToWish({variables: {wineId: initData.wine.wine.id}});
  };

  return (
    <View style={container}>
      <SafeAreaView style={flex1}>
        <Header label="History Details" goBack={() => navigation.goBack()} />
        <ScrollView style={scrollContainer} indicatorStyle="white" showsVerticalScrollIndicator>
          <View style={photoContainer}>
            {initData.wine.wine.pictureURL === '' ? (
              <WineImage uri={initData.wine.wine.pictureURL} />
            ) : (
              <TouchableOpacity onPress={() => setPreview(v => !v)}>
                <WineImage uri={initData.wine.wine.pictureURL} />

                <Modal visible={preview} transparent={true}>
                  <ImageViewer
                    renderIndicator={() => null}
                    onClick={() => setPreview(false)}
                    imageUrls={[
                      {
                        url: initData.wine.wine.pictureURL,
                      },
                    ]}
                  />
                </Modal>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={buttonPadding} activeOpacity={0.5} onPress={setLike} disabled={false}>
              {isInWish ? (
                <Image source={images.avesomeHeart} width={20} height={20} />
              ) : (
                <WishEmptyIcon width={51} height={51} />
              )}
            </TouchableOpacity>

            <View style={triangle} />
          </View>
          <View style={redContainer}>
            <Text style={vintage}>{initData.wine.wine.vintage}</Text>
            <Text style={wineTitle}>{initData.wine.wine.wineTitle}</Text>
            <View style={bottleContainer}>
              <Text style={bottleSizeText}>Bottle size: {volumes(initData.wine.wine.bottleCapacity)}</Text>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate(Routes.myCellar.name, {
                    data: {
                      wine: initData.wine.wine,
                      quantity: initData.wine.quantity,
                    },
                  });
                }}
                style={bottleImgContainer}>
                <Image source={images.wineBottle} width={25} height={34} />
                <Text style={quantity}> {initData.wine.quantity}</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={[row, {marginBottom: 20}]}>
            <Text style={mediumText}>Purhase price</Text>
            <Text style={boldText}>{initData.wine.wine.price}</Text>
          </View>
          <View style={row}>
            <Text style={mediumText}>Country</Text>
            <Text style={boldText}>{initData.wine.wine.locale.country}</Text>
          </View>
          <View style={row}>
            <Text style={mediumText}>Region</Text>
            <Text style={boldText}>{initData.wine.wine.locale.region}</Text>
          </View>
          <View style={row}>
            <Text style={mediumText}>Subregion</Text>
            <Text style={boldText}>{initData.wine.wine.locale.subregion}</Text>
          </View>
          <View style={row}>
            <Text style={mediumText}>Appellation</Text>
            <Text style={boldText}>{initData.wine.wine.locale.appellation}</Text>
          </View>
          <View style={row}>
            <Text style={mediumText}>Location</Text>
            <Text style={boldText}>none</Text>
          </View>
          <View style={[row, {marginBottom: 20}]}>
            <Text style={mediumText}>Variatel</Text>
            <Text style={boldText}>{initData.wine.wine.varietal}</Text>
          </View>
          <View style={{backgroundColor: 'black'}}>
            <View style={historyTitleContainer}>
              <Text style={[text, title]}>HISTORY</Text>
            </View>
          </View>
          <View style={historyContainer}>
            {initData.wineHistory.map((el, index) => (
              <HistoryItemNew
                key={index}
                el={el}
                navigation={navigation}
                onRefresh={() => {
                  RNProgressHud.show();
                  getWineDetails();
                }}
              />
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#041B1E'},
  text: {color: '#64091C', fontSize: 16, marginVertical: 18, marginHorizontal: 40, ...textStyle.boldText},
  flex1: {flex: 1},
  title: {...textStyle.boldText, fontSize: 24},
  imageContainer: {flexDirection: 'row', position: 'relative', paddingVertical: 20},
  infoContainer: {flexDirection: 'row'},
  historyContainer: {flex: 1, backgroundColor: 'black'},
  historyTitleContainer: {
    marginVertical: 20,
    backgroundColor: 'white',
    alignSelf: 'flex-start',
  },
  scrollContainer: {},
  hearthRow: {flexDirection: 'row', paddingHorizontal: 20, justifyContent: 'flex-end'},
  buttonPadding: {position: 'absolute', right: 10, bottom: 40},
  ////Мої стилі
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
  photoContainer: {
    minHeight: 300,
    justifyContent: 'center',
    backgroundColor: 'black',
  },
  redContainer: {
    flex: 1,
    backgroundColor: colors.dashboardRed,
    zIndex: 1,
    paddingLeft: 20,
    paddingBottom: 20,
    marginBottom: 20,
  },
  triangle: {
    borderRightWidth: Dimensions.get('screen').width,
    borderBottomWidth: 40,
    borderBottomColor: colors.dashboardRed,
    borderRightColor: 'transparent',
    flex: 1,
    position: 'absolute',
    bottom: 0,
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
  row: {flexDirection: 'row', paddingLeft: 20},
  boldText: {fontSize: 16, color: 'white', flex: 1, ...textStyle.boldText},
  mediumText: {
    flex: 1,
    fontSize: 16,
    color: 'white',
    ...textStyle.mediumText,
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
});

const {
  container,
  text,
  flex1,
  title,
  redContainer,
  historyContainer,
  historyTitleContainer,
  scrollContainer,
  buttonPadding,
  header,
  headerText,
  photoContainer,
  triangle,
  vintage,
  wineTitle,
  boldText,
  mediumText,
  row,
  bottleContainer,
  bottleSizeText,
  bottleImgContainer,
  quantity,
} = styles;

export const HistoryWineDetails = withNavigation(WineDetails);
