import React, {FC} from 'react';
import {NavigationEvents, NavigationScreenProp} from 'react-navigation';
import {View, StyleSheet, SafeAreaView, StatusBar, ScrollView, Alert} from 'react-native';
import {useMutation} from '@apollo/react-hooks';

import {DECLINE_TRADE_OFFER} from '../../../apollo/mutations/trading';
import wineDetailStyles from '../CommunityWineDetails/styles';
import {ButtonNew} from '../../../new_components';
import {TradeDetailsType} from '../../../types/trade';
import Colors from '../../../constants/colors';
import {flagToUpdateScreen} from '../../../utils/other.utils';
import {
  CommunityDetailWineBody,
  WineDetailsPreviableImage,
  HeaderWithChevron,
  CounterDetails,
  Countdown,
  TradeUserInfo,
} from '../../../components';
import textStyle from '../../../constants/Styles/textStyle';

type Props = {
  navigation: NavigationScreenProp<any>;
};

const SellerPending: FC<Props> = ({navigation}) => {
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
    <SafeAreaView style={container}>
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
            <View style={userInfoContainer}>
              <TradeUserInfo userId={tradeDetails.buyerId} />
            </View>
            <CounterDetails requestedPrice={tradeDetails.requestedPrice} requestedCount={tradeDetails.requestedCount} />
            <View style={[btnContainer, btnContainerMargin]}>
              <ButtonNew text="Decline" textStyle={btnText} style={cancelBtn} onPress={onCancel} />
            </View>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  priceSummaryContainer: {marginTop: 40},
  btnContainerMargin: {marginTop: 45},
  userInfoContainer: {
    alignItems: 'center',
    flex: 1,
    paddingBottom: 10,
  },
  bottleCountContainer: {flex: 0, justifyContent: 'center', paddingRight: 20},
  bottleCountText: {color: '#fff', fontSize: 25, ...textStyle.boldText, textAlign: 'center'},
});

const {btnContainerMargin, userInfoContainer} = styles;
const {container, scrollContainer, btnText, btnContainer, cancelBtn, blackBg, headerTitleText} = wineDetailStyles;

export const SellerPendingScreen = SellerPending;
