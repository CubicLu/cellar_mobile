import React, {FC, useState} from 'react';
import {NavigationEvents, NavigationScreenProp} from 'react-navigation';
import {View, KeyboardAvoidingView, SafeAreaView, StatusBar, ScrollView, Alert} from 'react-native';
import RNProgressHud from 'progress-hud';
import {ApolloError} from 'apollo-client';
import {useMutation} from '@apollo/react-hooks';

import wineDetailStyles from '../CommunityWineDetails/styles';

import {ButtonNew} from '../../../new_components';
import {SELLER_ACCEPT_SELL_CONFIRMATION, SELLER_BUYER_ACCEPTED_COUNTER} from '../../../constants/text';
import {TradeDetailsType} from '../../../types/trade';
import {DECLINE_TRADE_OFFER, FINAL_ACCEPT_BY_SELLER} from '../../../apollo/mutations/trading';
import {Routes} from '../../../constants';
import Colors from '../../../constants/colors';
import {flagToUpdateScreen} from '../../../utils/other.utils';
import {
  CommunityDetailWineBody,
  TradeUserInfo,
  TradePriceSummary,
  WineDetailsPreviableImage,
  ConfirmationDialog,
  HeaderWithChevron,
  WarningLabel,
} from '../../../components';

type Props = {
  navigation: NavigationScreenProp<any>;
};

const FinalAcceptBySeller: FC<Props> = ({navigation}) => {
  const wineData = navigation.getParam('wine');
  const [modalActive, setModalActive] = useState(false);
  const tradeDetails: TradeDetailsType = navigation.getParam('tradeDetails');
  const [declineOffer] = useMutation(DECLINE_TRADE_OFFER, {
    variables: {tradeOfferId: tradeDetails.dealId},
    onCompleted,
    onError,
  });

  const [finalAccept] = useMutation(FINAL_ACCEPT_BY_SELLER, {
    variables: {tradeOfferId: tradeDetails.dealId},
    onCompleted,
    onError,
  });

  function onCompleted() {
    flagToUpdateScreen('CurrentOffers');
    RNProgressHud.dismiss();
    navigation.navigate(Routes.tradingOffers.name);
  }
  function onError(error: ApolloError) {
    RNProgressHud.dismiss();
    Alert.alert(error.message);
  }

  const onAcceptDeal = () => {
    RNProgressHud.show();
    finalAccept();
  };

  const onDecline = () => {
    RNProgressHud.show();
    declineOffer();
  };

  return (
    <SafeAreaView style={container}>
      <NavigationEvents
        onWillFocus={() => {
          StatusBar.setBarStyle('light-content');
        }}
      />
      <ConfirmationDialog
        acceptationText={SELLER_ACCEPT_SELL_CONFIRMATION}
        active={modalActive}
        wineTitle={wineData.wine.wineTitle}
        onPressCancel={() => setModalActive(false)}
        onPressAccept={onAcceptDeal}
        dealTotalData={{
          price: tradeDetails.requestedPrice,
          bottleCount: tradeDetails.requestedCount,
        }}
      />
      {wineData && (
        <KeyboardAvoidingView behavior="padding">
          <ScrollView style={scrollContainer}>
            <HeaderWithChevron
              titleTextStyle={headerTitleText}
              title={wineData.wine.wineTitle}
              buttonBgColor={Colors.dashboardRed}
            />
            <WineDetailsPreviableImage src={wineData.wine.pictureURL} />
            <View style={blackBg}>
              <CommunityDetailWineBody wine={wineData} />
              <TradeUserInfo userId={tradeDetails.buyerId} />
              <WarningLabel text={SELLER_BUYER_ACCEPTED_COUNTER} />
              <TradePriceSummary
                detailsObj={{bottles: tradeDetails.requestedCount, pricePerBottle: tradeDetails.requestedPrice}}
                containerStyles={{marginTop: 40}}
              />
              <View style={[btnContainer, {marginTop: 45}]}>
                <ButtonNew text="accept" textStyle={btnText} style={acceptBtn} onPress={() => setModalActive(true)} />
                <ButtonNew text="decline" textStyle={btnText} style={cancelBtn} onPress={onDecline} />
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
};

const {
  container,
  scrollContainer,
  btnText,
  btnContainer,
  cancelBtn,
  blackBg,
  acceptBtn,
  headerTitleText,
} = wineDetailStyles;

export const FinalAcceptBySellerScreen = FinalAcceptBySeller;
