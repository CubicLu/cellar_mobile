import React, {FC} from 'react';
import {NavigationEvents, NavigationScreenProp} from 'react-navigation';
import {View, StyleSheet, SafeAreaView, StatusBar, ScrollView, Alert, Text} from 'react-native';
import {useMutation} from '@apollo/react-hooks';

import {DECLINE_TRADE_OFFER} from '../../../apollo/mutations/trading';
import TRADE_STATUS from '../../../constants/tradeStatus';

import wineDetailStyles from '../CommunityWineDetails/styles';
import {ButtonNew} from '../../../new_components';
import {TradeDetailsType} from '../../../types/trade';
import Colors from '../../../constants/colors';
import {flagToUpdateScreen, selectScreenSize} from '../../../utils/other.utils';
import {
  CommunityDetailWineBody,
  TradeUserInfo,
  WineDetailsPreviableImage,
  HeaderWithChevron,
  TradePriceSummary,
  CounterDetails,
  Countdown,
  WarningLabel,
} from '../../../components';
import textStyle from '../../../constants/Styles/textStyle';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

type Props = {
  navigation: NavigationScreenProp<any>;
};

const mapStatusToPendingInfo = tradeDetails => {
  switch (tradeDetails.status) {
    case TRADE_STATUS.CREATED:
    case TRADE_STATUS.BUYER_MODIFIED:
      return (
        <>
          <View style={userInfoContainer}>
            <TradeUserInfo userId={tradeDetails.sellerId} />
          </View>
          <CounterDetails requestedPrice={tradeDetails.requestedPrice} requestedCount={tradeDetails.requestedCount} />
        </>
      );

    case TRADE_STATUS.BUYER_ACCEPTED:
      return (
        <>
          <View style={userInfoContainer}>
            <TradeUserInfo userId={tradeDetails.sellerId} />
          </View>
          <TradePriceSummary
            detailsObj={{bottles: tradeDetails.requestedCount, pricePerBottle: tradeDetails.requestedPrice}}
            containerStyles={{marginTop: 40}}
          />
        </>
      );

    default:
      return (
        <View>
          <Text style={{color: '#fff'}}>TODO {tradeDetails.status}</Text>
        </View>
      );
  }
};

const BuyerPending: FC<Props> = ({navigation}) => {
  const wineData = navigation.getParam('wine');
  const tradeDetails: TradeDetailsType = navigation.getParam('tradeDetails');

  const [declineOffer] = useMutation(DECLINE_TRADE_OFFER, {
    variables: {tradeOfferId: tradeDetails.dealId},
    onCompleted: data => {
      Alert.alert('', data.declineTradeOffer, [{onPress: () => navigation.goBack()}]);
    },
    onError: error => Alert.alert('', error.message),
  });

  const onCancel = () => {
    flagToUpdateScreen('CurrentOffers');
    declineOffer();
  };

  return (
    <SafeAreaView style={[container, listFooterContainer]}>
      <NavigationEvents
        onWillFocus={() => {
          StatusBar.setBarStyle('light-content');
        }}
      />

      {wineData && (
        <ScrollView style={scrollContainer}>
          <HeaderWithChevron
            titleTextStyle={headerTitleText}
            title={wineData.wine.wineTitle}
            buttonBgColor={Colors.dashboardRed}
          />
          <WineDetailsPreviableImage src={wineData.wine.pictureURL} />
          <View style={blackBg}>
            <CommunityDetailWineBody wine={wineData} />
            <Countdown updatedAt={tradeDetails.updatedAt} />
            {mapStatusToPendingInfo(tradeDetails)}

            <WarningLabel text="Your offer is pending" />
            <View style={[btnContainer, btnContainerMargin]}>
              <ButtonNew
                text="Cancel"
                textStyle={[btnText]}
                style={[cancelBtn, {backgroundColor: Colors.orangeDashboard}]}
                onPress={onCancel}
              />
            </View>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  priceSummaryContainer: {marginTop: 40},
  btnContainerMargin: {marginTop: 45, marginBottom: 20},
  userInfoContainer: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
  },
  bottleCountContainer: {flex: 0, justifyContent: 'center', paddingRight: 20},
  bottleCountText: {color: '#fff', fontSize: 25, ...textStyle.boldText, textAlign: 'center'},
  warningText: {
    alignItems: 'center',
    color: '#E6750E',
    fontSize: selectScreenSize(12, 14),
    ...textStyle.boldText,
    textTransform: 'uppercase',
  },
});

const {btnContainerMargin, userInfoContainer} = styles;
const {
  container,
  scrollContainer,
  btnText,
  btnContainer,
  cancelBtn,
  blackBg,
  headerTitleText,
  listFooterContainer,
} = wineDetailStyles;

export const BuyerPendingScreen = BuyerPending;
