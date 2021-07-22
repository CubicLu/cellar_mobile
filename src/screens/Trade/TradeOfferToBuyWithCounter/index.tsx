import React, {FC, useEffect, useState} from 'react';
import {View, KeyboardAvoidingView, SafeAreaView, StatusBar, ScrollView, Alert, StyleSheet} from 'react-native';
import {NavigationEvents, NavigationScreenProp} from 'react-navigation';
import {useMutation} from '@apollo/react-hooks';
import RNProgressHud from 'progress-hud';
import {ApolloError} from 'apollo-client';

import {BUYER_ACCEPT_BUY_CONFIRMATION} from '../../../constants/text';
import {UPDATE_OFFER_BY_BUYER, DECLINE_TRADE_OFFER} from '../../../apollo/mutations/trading';
import wineDetailStyles from '../CommunityWineDetails/styles';
import {TradeDetailsType} from '../../../types/trade';
import {ButtonNew} from '../../../new_components';
import {Routes} from '../../../constants';

import Colors from '../../../constants/colors';
import {flagToUpdateScreen} from '../../../utils/other.utils';
import {
  CommunityDetailWineBody,
  TradeOfferPicker,
  TradeUserInfo,
  WineDetailsPreviableImage,
  ConfirmationDialog,
  HeaderWithChevron,
  CheckBox,
  CommentReply,
} from '../../../components';

type Props = {
  navigation: NavigationScreenProp<any>;
};

const BuyOfferWithCounter: FC<Props> = ({navigation}) => {
  const wineData = navigation.getParam('wine');
  const [modalActive, setModalActive] = useState(false);
  const tradeDetails: TradeDetailsType = navigation.getParam('tradeDetails');
  const [pricePerBottle, setPricePerBottle] = useState(tradeDetails.requestedPrice);
  const [isFormEdited, setIsFormEdited] = useState(false);
  const [isFinal, setIsFinal] = useState<boolean>(false);
  const [message, setMessage] = useState('');

  const [declineOffer] = useMutation(DECLINE_TRADE_OFFER, {
    variables: {tradeOfferId: tradeDetails.dealId},
    onCompleted,
    onError,
  });

  const [acceptOffer] = useMutation(UPDATE_OFFER_BY_BUYER, {
    variables: {
      tradeOfferId: tradeDetails.dealId,
      acceptCounter: isFinal ? false : isFormEdited,
      quantity: tradeDetails.requestedCount,
      pricePerBottle,
      note: message,
    },
    onCompleted,
    onError,
  });

  useEffect(() => {
    setIsFormEdited(tradeDetails.requestedPrice !== pricePerBottle);
  }, [pricePerBottle]);

  const onAcceptDeal = () => {
    RNProgressHud.show();
    acceptOffer();
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

  const onCancel = () => {
    RNProgressHud.show();
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
        dealTotalData={{bottleCount: tradeDetails.requestedCount, price: pricePerBottle}}
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

              <TradeOfferPicker
                bottleCount={tradeDetails.requestedCount}
                pickerMaxValue={tradeDetails.requestedCount}
                disableEditCount={true}
                price={pricePerBottle}
                priceConfig={{price: pricePerBottle, showTotalPriceBlock: true}}
                setPrice={val => setPricePerBottle(val)}
                renderFinalOffer={() =>
                  isFormEdited && (
                    <CheckBox
                      variant="default"
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
                      sellerID={tradeDetails.sellerId}
                      buyerID={tradeDetails.buyerId}
                      message={message}
                      setMessage={setMessage}
                      note={tradeDetails.note}
                      style={replyBlockAlign}
                    />
                    <ButtonNew
                      text={isFormEdited ? 'submit counter offer to buy' : 'accept'}
                      textStyle={btnText}
                      disabledOpacity
                      isDisabled={!!error}
                      style={acceptBtn}
                      onPress={() => setModalActive(true)}
                    />
                    <ButtonNew text="decline" textStyle={btnText} style={cancelBtn} onPress={onCancel} />
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
  replyBlockAlign: {left: -20},
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

export const TradeBuyOfferWithCounterScreen = BuyOfferWithCounter;
