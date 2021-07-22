import React, {FC, useEffect, useState} from 'react';
import {View, KeyboardAvoidingView, SafeAreaView, StatusBar, ScrollView, Alert, StyleSheet} from 'react-native';
import {NavigationEvents, NavigationScreenProp} from 'react-navigation';
import RNProgressHud from 'progress-hud';
import {ApolloError} from 'apollo-client';
import {useMutation} from '@apollo/react-hooks';

import wineDetailStyles from '../CommunityWineDetails/styles';
import {ButtonNew} from '../../../new_components';
import {SELLER_COUNTER_WARNING, SELLER_ACCEPT_COUNTER_CONFIRMATION} from '../../../constants/text';
import {TradeDetailsType} from '../../../types/trade';
import {DECLINE_TRADE_OFFER, UPDATE_SELL_OFFER} from '../../../apollo/mutations/trading';
import {Routes} from '../../../constants';
import Colors from '../../../constants/colors';
import {flagToUpdateScreen} from '../../../utils/other.utils';
import {
  CommunityDetailWineBody,
  TradeOfferPicker,
  TradeUserInfo,
  WarningLabel,
  WineDetailsPreviableImage,
  ConfirmationDialog,
  HeaderWithChevron,
  CheckBox,
  CommentReply,
} from '../../../components';

type Props = {
  navigation: NavigationScreenProp<any>;
};

const OfferWithCounter: FC<Props> = ({navigation}) => {
  const wineData = navigation.getParam('wine');
  const [modalActive, setModalActive] = useState(false);
  const tradeDetails: TradeDetailsType = navigation.getParam('tradeDetails');
  const [pricePerBottle, setPricePerBottle] = useState(tradeDetails.requestedPrice);
  const [isFinal, setIsFinal] = useState<boolean>(false);
  const [isFormEdited, setIsFormEdited] = useState(false);
  const [message, setMessage] = useState('');

  const [updateSellOffer] = useMutation(UPDATE_SELL_OFFER, {
    variables: {
      tradeOfferId: tradeDetails.dealId,
      pricePerBottle,
      quantity: wineData.quantity,
      acceptCounter: isFinal ? false : isFormEdited,
      note: message,
    },
    onCompleted,
    onError,
  });

  const [declineOffer] = useMutation(DECLINE_TRADE_OFFER, {
    variables: {tradeOfferId: tradeDetails.dealId},
    onCompleted,
    onError,
  });

  const onAcceptDeal = () => {
    RNProgressHud.show();
    updateSellOffer();
  };

  function onCompleted() {
    flagToUpdateScreen('CurrentOffers');
    RNProgressHud.dismiss();
    navigation.navigate(Routes.tradingOffers.name);
  }

  function onError(error: ApolloError) {
    RNProgressHud.dismiss();
    Alert.alert(error.message);
  }

  const onDecline = () => {
    RNProgressHud.show();
    declineOffer();
  };

  useEffect(() => {
    setIsFormEdited(tradeDetails.requestedPrice !== pricePerBottle);
  }, [pricePerBottle]);

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
        dealTotalData={{
          price: pricePerBottle,
          bottleCount: tradeDetails.requestedCount,
        }}
        wineTitle={wineData.wineTitle}
        onPressCancel={() => setModalActive(false)}
        onPressAccept={onAcceptDeal}
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
              <WarningLabel text={SELLER_COUNTER_WARNING} />

              <TradeOfferPicker
                bottleCount={tradeDetails.requestedCount}
                disableEditCount={true}
                price={pricePerBottle}
                setPrice={val => setPricePerBottle(val)}
                priceConfig={{price: pricePerBottle, showTotalPriceBlock: true}}
                pickerMaxValue={tradeDetails.requestedCount}
                renderFinalOffer={() =>
                  isFormEdited && (
                    <CheckBox
                      textStyle={checkBoxText}
                      value={isFinal}
                      onValueChange={() => setIsFinal(v => !v)}
                      text="Final offer"
                    />
                  )
                }
                renderButtons={error => (
                  <View style={{marginTop: 20}}>
                    <CommentReply
                      buyerID={tradeDetails.buyerId}
                      sellerID={tradeDetails.sellerId}
                      message={message}
                      style={replyBlockAlign}
                      setMessage={setMessage}
                      note={tradeDetails.note}
                    />
                    <ButtonNew
                      text={isFormEdited ? 'Submit offer to sell' : 'accept'}
                      textStyle={btnText}
                      style={acceptBtn}
                      isDisabled={!!error}
                      disabledOpacity
                      onPress={() => setModalActive(true)}
                    />
                    <ButtonNew text="decline" textStyle={btnText} style={cancelBtn} onPress={onDecline} />
                  </View>
                )}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  replyBlockAlign: {right: 0, left: -20},
});

const {replyBlockAlign} = styles;

const {
  container,
  scrollContainer,
  btnText,
  cancelBtn,
  blackBg,
  acceptBtn,
  headerTitleText,
  checkBoxText,
} = wineDetailStyles;

export const OfferWithCounterScreen = OfferWithCounter;
