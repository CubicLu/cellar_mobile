import React, {FC, useEffect, useState} from 'react';
import {useMutation} from '@apollo/react-hooks';
import {NavigationEvents, NavigationScreenProp} from 'react-navigation';
import {View, KeyboardAvoidingView, SafeAreaView, StatusBar, ScrollView, Alert} from 'react-native';
import RNProgressHud from 'progress-hud';

import {DECLINE_TRADE_OFFER, UPDATE_SELL_OFFER} from '../../../apollo/mutations/trading';
import {SELLER_MAY_COUNTER, SELLER_NEW_REQUEST_CONFIRMATION} from '../../../constants/text';
import wineDetailStyles from '../CommunityWineDetails/styles';
import {TradeDetailsType} from '../../../types/trade';
import {ButtonNew} from '../../../new_components';
import {Routes} from '../../../constants';
import Colors from '../../../constants/colors';
import {flagToUpdateScreen} from '../../../utils/other.utils';
import {
  CommunityDetailWineBody,
  TradeOfferPicker,
  WineDetailsPreviableImage,
  ConfirmationDialog,
  HeaderWithChevron,
  CommentReply,
  WarningLabel,
} from '../../../components';

type Props = {
  navigation: NavigationScreenProp<any>;
};

const NewOffer: FC<Props> = ({navigation}) => {
  const wineData = navigation.getParam('wine');
  const tradeDetails: TradeDetailsType = navigation.getParam('tradeDetails');
  const [wineQuestion, setWineQuestion] = useState(true);
  const [bottleCount, setBottleCount] = useState(tradeDetails.requestedCount);
  const [modalActive, setModalActive] = useState(false);
  const [withCounter, setWithCounter] = useState(false);
  const [isFormEdited, setIsFormEdited] = useState(false);
  const [message, setMessage] = useState('');
  const [declineOffer] = useMutation(DECLINE_TRADE_OFFER, {
    variables: {tradeOfferId: tradeDetails.dealId},
    onCompleted: () => {
      flagToUpdateScreen('CurrentOffers');
    },
  });
  const [pricePerBottle, setPricePerBottle] = useState(tradeDetails.requestedPrice);
  const [submitOfferToSell] = useMutation(UPDATE_SELL_OFFER, {
    variables: {
      tradeOfferId: tradeDetails.dealId,
      acceptCounter: withCounter,
      quantity: bottleCount,
      pricePerBottle,
      note: message,
    },
    onError: error => {
      RNProgressHud.dismiss();
      Alert.alert(error.message);
    },
    onCompleted: () => {
      RNProgressHud.dismiss();
      flagToUpdateScreen('CurrentOffers');
      navigation.navigate(Routes.tradingOffers.name);
    },
  });
  const onConfirm = () => {
    setWineQuestion(false);
  };
  console.log(tradeDetails, 'tradeDetails');
  const onAcceptDeal = () => {
    RNProgressHud.show();
    submitOfferToSell();
  };

  const onCancel = () => {
    declineOffer();
    navigation.goBack();
  };

  useEffect(() => {
    setIsFormEdited(!(tradeDetails.requestedCount === bottleCount && tradeDetails.requestedPrice === pricePerBottle));
  }, [bottleCount, pricePerBottle]);

  return (
    <SafeAreaView style={container}>
      <NavigationEvents
        onWillFocus={() => {
          StatusBar.setBarStyle('light-content');
        }}
      />
      <ConfirmationDialog
        acceptationText={SELLER_NEW_REQUEST_CONFIRMATION}
        active={modalActive}
        wineTitle={wineData.wine.wineTitle}
        dealTotalData={{bottleCount, price: pricePerBottle}}
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

              {wineQuestion && (
                <View style={btnContainer}>
                  <ButtonNew text="yes, i have this wine" textStyle={btnText} style={acceptBtn} onPress={onConfirm} />
                  <ButtonNew
                    text="No, I do not have this wine"
                    textStyle={btnText}
                    style={cancelBtn}
                    onPress={onCancel}
                  />
                </View>
              )}
              {!wineQuestion && (
                <>
                  <WarningLabel text={SELLER_MAY_COUNTER} />
                  <TradeOfferPicker
                    priceConfig={{price: tradeDetails.requestedPrice, showTotalPriceBlock: true}}
                    bottleCount={bottleCount}
                    price={pricePerBottle}
                    setPrice={val => setPricePerBottle(val)}
                    setBottleCount={setBottleCount}
                    pickerMaxValue={tradeDetails.requestedCount}
                    withCounter={withCounter}
                    toggleCounter={() => setWithCounter(c => !c)}
                    renderButtons={(error: string) => (
                      <View style={footerTotalContainer}>
                        <View style={{alignSelf: 'flex-end', width: '100%'}}>
                          <CommentReply
                            buyerID={tradeDetails.buyerId}
                            sellerID={tradeDetails.sellerId}
                            message={message}
                            style={{right: 0, left: -20}}
                            setMessage={setMessage}
                            note={tradeDetails.note}
                          />
                        </View>
                        <ButtonNew
                          text={isFormEdited ? 'submit offer to sell' : 'Accept offer to sell'}
                          isDisabled={!!error}
                          disabledOpacity
                          textStyle={btnText}
                          style={acceptBtn}
                          onPress={() => setModalActive(true)}
                        />
                        <ButtonNew text="Decline" textStyle={btnText} style={cancelBtn} onPress={onCancel} />
                      </View>
                    )}
                    showCounterCheckbox={isFormEdited}
                  />
                </>
              )}
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
  btnContainer,
  btnText,
  cancelBtn,
  blackBg,
  acceptBtn,
  footerTotalContainer,
  headerTitleText,
} = wineDetailStyles;

export const NewSellOfferReceived = NewOffer;
