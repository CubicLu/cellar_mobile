import React, {FC, useState} from 'react';
import {NavigationEvents, NavigationScreenProp} from 'react-navigation';
import {View, KeyboardAvoidingView, StyleSheet, SafeAreaView, StatusBar, ScrollView, Alert} from 'react-native';
import RNProgressHud from 'progress-hud';
import {useMutation} from '@apollo/react-hooks';

import {BUYER_ACCEPT_BUY_CONFIRMATION} from '../../../constants/text';
import {DECLINE_TRADE_OFFER, FINAL_ACCEPT_BY_BUYER} from '../../../apollo/mutations/trading';

import wineDetailStyles from '../CommunityWineDetails/styles';
import {ButtonNew} from '../../../new_components';
import {TradeDetailsType} from '../../../types/trade';
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
  CommentReply,
} from '../../../components';

type Props = {
  navigation: NavigationScreenProp<any>;
};

const BuyOfferReceived: FC<Props> = ({navigation}) => {
  const wineData = navigation.getParam('wine');
  const [modalActive, setModalActive] = useState(false);
  const tradeDetails: TradeDetailsType = navigation.getParam('tradeDetails');
  const [message, setMessage] = useState('');

  const [declineOffer] = useMutation(DECLINE_TRADE_OFFER, {
    variables: {tradeOfferId: tradeDetails.dealId},
    onCompleted: data => {
      console.log('data onDecline', data);
    },
  });

  const [acceptOffer] = useMutation(FINAL_ACCEPT_BY_BUYER, {
    variables: {tradeOfferId: tradeDetails.dealId},
    onError: error => {
      RNProgressHud.dismiss();
      Alert.alert(error.message);
    },
    onCompleted: () => {
      RNProgressHud.dismiss();
      navigation.navigate(Routes.tradingOffers.name);
      flagToUpdateScreen('CurrentOffers');
    },
  });

  const onAcceptDeal = () => {
    RNProgressHud.show();
    acceptOffer();
  };

  const onCancel = () => {
    flagToUpdateScreen('CurrentOffers');
    declineOffer();
    navigation.goBack();
  };

  return (
    <SafeAreaView style={container}>
      <NavigationEvents
        onWillFocus={() => {
          StatusBar.setBarStyle('light-content');
        }}
      />
      <ConfirmationDialog
        acceptationText={BUYER_ACCEPT_BUY_CONFIRMATION}
        active={modalActive}
        wineTitle={wineData.wine.wineTitle}
        onPressCancel={() => setModalActive(false)}
        onPressAccept={onAcceptDeal}
        dealTotalData={{price: tradeDetails.requestedPrice, bottleCount: tradeDetails.requestedCount}}
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

              <TradeUserInfo userId={tradeDetails.sellerId} />

              <TradePriceSummary
                detailsObj={{bottles: tradeDetails.requestedCount, pricePerBottle: tradeDetails.requestedPrice}}
                containerStyles={priceSummaryContainer}
              />
              <View style={replyContainer}>
                <CommentReply
                  buyerID={tradeDetails.buyerId}
                  sellerID={tradeDetails.sellerId}
                  message={message}
                  setMessage={setMessage}
                  note={tradeDetails.note}
                  noReply
                  style={replyBlockAlign}
                />
              </View>
              <View style={[btnContainer, btnContainerMargin]}>
                <ButtonNew text="accept" textStyle={btnText} style={acceptBtn} onPress={() => setModalActive(true)} />
                <ButtonNew text="decline" textStyle={btnText} style={cancelBtn} onPress={onCancel} />
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  priceSummaryContainer: {marginTop: 40},
  btnContainerMargin: {marginTop: 45},
  replyContainer: {marginTop: 20, paddingHorizontal: 20},
  replyBlockAlign: {left: -20, right: 0},
});

const {priceSummaryContainer, btnContainerMargin, replyContainer, replyBlockAlign} = styles;
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

export const TradeNoCounteredBuyOffer = BuyOfferReceived;
