import React, {FC, useState} from 'react';
import {NavigationEvents, NavigationScreenProp} from 'react-navigation';
import {View, KeyboardAvoidingView, SafeAreaView, StatusBar, ScrollView, Alert, StyleSheet} from 'react-native';
import RNProgressHud from 'progress-hud';
import {ApolloError} from 'apollo-client';
import {useMutation} from '@apollo/react-hooks';

import wineDetailStyles from '../CommunityWineDetails/styles';
import {ButtonNew} from '../../../new_components';
import {SELLER_ACCEPT_COUNTER_CONFIRMATION, SELLER_OFFER_MARKED_AS_FINAL} from '../../../constants/text';
import {TradeDetailsType} from '../../../types/trade';
import {DECLINE_TRADE_OFFER, FINAL_ACCEPT_BY_SELLER} from '../../../apollo/mutations/trading';
import {Routes} from '../../../constants';
import Colors from '../../../constants/colors';
import {flagToUpdateScreen} from '../../../utils/other.utils';
import {
  CommunityDetailWineBody,
  TradeUserInfo,
  TradePriceSummary,
  // FinalOfferLabel,
  WineDetailsPreviableImage,
  ConfirmationDialog,
  HeaderWithChevron,
  WarningLabel,
  CommentReply,
} from '../../../components';

type Props = {
  navigation: NavigationScreenProp<any>;
};

const FinalBuyOffer: FC<Props> = ({navigation}) => {
  const wineData = navigation.getParam('wine');
  const [modalActive, setModalActive] = useState(false);
  const tradeDetails: TradeDetailsType = navigation.getParam('tradeDetails');
  const [message, setMessage] = useState('');

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
        acceptationText={SELLER_ACCEPT_COUNTER_CONFIRMATION}
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
          <ScrollView keyboardDismissMode="on-drag" style={scrollContainer}>
            <HeaderWithChevron
              titleTextStyle={headerTitleText}
              title={wineData.wine.wineTitle}
              buttonBgColor={Colors.dashboardRed}
            />
            <WineDetailsPreviableImage src={wineData.wine.pictureURL} />
            {/*<FinalOfferLabel />*/}
            <View style={blackBg}>
              <CommunityDetailWineBody wine={wineData} />
              <TradeUserInfo userId={tradeDetails.buyerId} />
              <WarningLabel text={SELLER_OFFER_MARKED_AS_FINAL} />
              <TradePriceSummary
                detailsObj={{bottles: tradeDetails.requestedCount, pricePerBottle: tradeDetails.requestedPrice}}
                containerStyles={{marginTop: 40}}
              />
              <CommentReply
                buyerID={tradeDetails.buyerId}
                sellerID={tradeDetails.sellerId}
                message={message}
                style={replyBlockAlign}
                setMessage={setMessage}
                note={tradeDetails.note}
                noReply
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

const styles = StyleSheet.create({
  replyBlockAlign: {right: -20, left: 0, marginTop: 20},
});

const {replyBlockAlign} = styles;

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

export const FinalBuyOfferScreen = FinalBuyOffer;
