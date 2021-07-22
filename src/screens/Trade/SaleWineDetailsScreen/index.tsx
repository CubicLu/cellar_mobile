import React, {FC, useEffect, useState} from 'react';
import RNProgressHud from 'progress-hud';
import {View, Text, SafeAreaView, StatusBar, KeyboardAvoidingView, Dimensions, Alert} from 'react-native';
import {useMutation, useQuery} from '@apollo/react-hooks';
import {NavigationScreenProp} from 'react-navigation';
import _ from 'lodash';

import {SALE_WINE} from '../../../apollo/queries/wine';
import {NavigationEvents, FlatList} from 'react-navigation';
import {WineInTrade, OfferToBuyInput} from '../../../types/trade';

import styles from '../CommunityWineDetails/styles';
import {Routes} from '../../../constants';
import {ButtonNew} from '../../../new_components';
import {showAlert} from '../../../utils/other.utils';
import {reduceBottleCount, reducePrice} from '../../../utils/TradeFlowUtils';
import {BUY_ON_SALE} from '../../../apollo/mutations/trading';
import {
  CommunityDetailWineBody,
  WineDetailsPreviableImage,
  ConfirmationDialog,
  HeaderWithChevron,
} from '../../../components';
import Colors from '../../../constants/colors';
import {DashedLineIcon} from '../../../assets/svgIcons';
import {formatGQLError} from '../../../utils/errorCodes';
import {GET_LOCAL_PROFILE} from '../../../apollo/client/queries';
import SaleOfferListItem from './SaleOfferListItem';

type Props = {
  navigation: NavigationScreenProp<any>;
};

const screenWidth = Dimensions.get('screen').width;

const WineDetails: FC<Props> = ({navigation}) => {
  const [wineId] = useState(navigation.getParam('wineId', null));
  const [totalBottlesSelected, setTotalBottlesSelected] = useState<OfferToBuyInput[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [modalActive, setModalActive] = useState(false);
  const {data: profile} = useQuery(GET_LOCAL_PROFILE);
  const [onPressBuy] = useMutation(BUY_ON_SALE, {
    variables: {offersToBuy: totalBottlesSelected},
    onCompleted: () => {
      RNProgressHud.dismiss();
      setModalActive(true);
    },
    onError: error => {
      Alert.alert('', formatGQLError(error.message));
      RNProgressHud.dismiss();
    },
  });

  const {data: wineData, loading: loadWine, error: wineError} = useQuery(SALE_WINE, {
    fetchPolicy: 'no-cache',
    variables: {wineId},
    onCompleted: () => {
      RNProgressHud.dismiss();
    },
    onError: error => {
      console.debug(error);
      RNProgressHud.dismiss();
    },
  });

  useEffect(() => {
    RNProgressHud.show();
    if (wineData) {
      RNProgressHud.dismiss();
    }
  }, [wineData]);

  useEffect(() => {
    if (wineError) {
      setErrorMessage(wineError.message.toString());
    }
  }, [wineError]);

  const onTotalBottleCountChange = (bottles: OfferToBuyInput) => {
    if (bottles.quantity === 0) {
      setTotalBottlesSelected(list => _.remove(list, el => el.sellerId !== bottles.sellerId));
    } else {
      setTotalBottlesSelected(list => [..._.remove(list, el => el.sellerId !== bottles.sellerId), bottles]);
    }
  };

  const onSubmitOffer = () => {
    RNProgressHud.show();
    onPressBuy();
  };

  const onSubmitOffersToBuy = ({userProfile: {authorizedTrader}}) => {
    const sellerCount = totalBottlesSelected.length;
    const bottleCount = reduceBottleCount(totalBottlesSelected);

    if (!authorizedTrader) {
      Alert.alert('', 'This functionality is currently being tested in Beta for Authorized Users');
    }

    showAlert(
      '',
      `Selected ${sellerCount} seller${
        sellerCount > 1 ? 's' : ''
      },\ntotal bottle count is ${bottleCount}.\nDo you confirm?`,
      onSubmitOffer,
    );
  };

  return (
    <SafeAreaView style={container}>
      <KeyboardAvoidingView style={flex1} behavior="padding">
        <NavigationEvents
          onWillFocus={() => {
            StatusBar.setBarStyle('light-content');
          }}
        />
        <ConfirmationDialog
          acceptationText="Your offer to buy was successfully sent"
          active={modalActive}
          onPressCancel={() => navigation.navigate(Routes.tradingMain.name)}
          variant="success"
        />
        {!loadWine && RNProgressHud.dismiss()}
        {errorMessage !== '' && (
          <View style={errorContainer}>
            <Text style={errorText}>{errorMessage}</Text>
          </View>
        )}
        {wineData && (
          <View style={flex1}>
            <FlatList<WineInTrade>
              ListHeaderComponent={
                <>
                  <HeaderWithChevron
                    titleTextStyle={headerTitleText}
                    title={wineData.wineV2.wine.wineTitle}
                    buttonBgColor={Colors.dashboardRed}
                  />
                  <WineDetailsPreviableImage src={wineData.wineV2.wine.pictureURL} />
                  <CommunityDetailWineBody wishListButton wine={wineData.wineV2} />
                </>
              }
              data={wineData.winesInTradeCellrSale.wineInTrade}
              contentContainerStyle={scrollContainer}
              keyExtractor={item => item.sellerId.toString()}
              renderItem={({item, index}) => (
                <>
                  {index === 0 && <View style={firstIndexPadding} />}
                  <SaleOfferListItem
                    data={item}
                    index={index}
                    onChangeCount={onTotalBottleCountChange}
                    totalCount={item.quantity}
                    pricePerBottle={item.pricePerBottle}
                  />
                </>
              )}
              ListEmptyComponent={
                <View style={emptyListContainer}>
                  <Text numberOfLines={1} adjustsFontSizeToFit style={noBottlesText}>
                    No bottles available for trade
                  </Text>
                </View>
              }
              ListFooterComponent={
                <>
                  {wineData.winesInTradeCellrSale.wineInTrade.length > 0 && (
                    <View style={listFooterContainer}>
                      <View style={hrContainer}>
                        <DashedLineIcon width={screenWidth - 40} color="#fff" height={25} />
                      </View>
                      {+reduceBottleCount(totalBottlesSelected) !== 0 ? (
                        <View style={[footerTotalContainer, communityWineDetailsFooter]}>
                          <View style={{flex: 0.5}}>
                            <Text style={bottleCount}>{reduceBottleCount(totalBottlesSelected)}</Text>
                            <Text style={[text, textAlignCenter]}>Bottles</Text>
                          </View>
                          <View style={flex1}>
                            <Text adjustsFontSizeToFit numberOfLines={1} style={bottleCount}>
                              ${reducePrice(totalBottlesSelected)}
                            </Text>
                            <Text style={[text, textAlignCenter]}>Total price</Text>
                          </View>
                        </View>
                      ) : (
                        <View>
                          <Text numberOfLines={1} adjustsFontSizeToFit style={noBottlesText}>
                            No bottles selected
                          </Text>
                        </View>
                      )}

                      <View style={btnContainer}>
                        <ButtonNew
                          text="submit offer to buy"
                          textStyle={btnText}
                          style={acceptBtn}
                          disabledOpacity
                          onPress={() => onSubmitOffersToBuy(profile)}
                          isDisabled={totalBottlesSelected.length < 1}
                        />
                        <ButtonNew
                          text="cancel"
                          textStyle={btnText}
                          style={cancelBtn}
                          onPress={() => navigation.goBack()}
                        />
                      </View>
                    </View>
                  )}
                </>
              }
            />
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const {
  container,
  btnContainer,
  text,
  bottleCount,
  btnText,
  acceptBtn,
  cancelBtn,
  scrollContainer,
  errorContainer,
  errorText,
  firstIndexPadding,
  flex1,
  footerTotalContainer,
  textAlignCenter,
  headerTitleText,
  listFooterContainer,
  communityWineDetailsFooter,
  hrContainer,
  noBottlesText,
  emptyListContainer,
} = styles;

export const SaleWineDetailsScreen = WineDetails;
