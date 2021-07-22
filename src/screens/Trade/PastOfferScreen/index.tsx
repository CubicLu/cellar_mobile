import React, {FC, useEffect, useState} from 'react';
import {View, StyleSheet, SafeAreaView, ScrollView, Alert} from 'react-native';
import {useMutation, useQuery} from '@apollo/react-hooks';
import {NavigationScreenProp} from 'react-navigation';

import {
  CommunityDetailWineBody,
  CounterDetails,
  HeaderWithChevron,
  TradeUserInfo,
  WineDetailsPreviableImage,
  WarningLabel,
} from '../../../components';
import {ButtonNew} from '../../../new_components';
import textStyles from '../../../constants/Styles/textStyle';
import {GET_LOCAL_PROFILE} from '../../../apollo/client/queries';
import colors from '../../../constants/colors';
import {RESTORE_TRADE_OFFER} from '../../../apollo/mutations/trading';
import {flagToUpdateScreen} from '../../../utils/other.utils';
import {Routes} from '../../../constants';

type Props = {
  navigation: NavigationScreenProp<any>;
};

const PastOffer: FC<Props> = ({navigation}) => {
  const [wine, tradeDetails] = navigation.getParam('data');
  const [role, setRole] = useState(null);
  const {
    data: {
      userProfile: {id: currentUserID},
    },
  } = useQuery(GET_LOCAL_PROFILE);

  const [restoreOffer] = useMutation(RESTORE_TRADE_OFFER, {
    variables: {
      tradeOfferId: tradeDetails.tradeOfferId,
    },
    onError: error => {
      Alert.alert('', error.message);
    },
    onCompleted: async data => {
      await flagToUpdateScreen('PastOffers');
      await flagToUpdateScreen('CurrentOffers');
      Alert.alert('', data.restoreTradeOffer, [{onPress: navigation.goBack}]);
    },
  });

  function getUserRole() {
    if (tradeDetails.hasOwnProperty('buyer')) {
      setRole('buyer');
    } else {
      setRole('seller');
    }
  }

  useEffect(() => {
    getUserRole();
  }, [tradeDetails, currentUserID]);

  function onResubmit() {
    Alert.alert('Offer restoring', 'The offer will be restored to its previous state. Are you sure?', [
      {
        text: 'OK',
        onPress: () => restoreOffer(),
      },
      {
        text: 'Cancel',
      },
    ]);
  }

  return (
    <View style={container}>
      <SafeAreaView style={flex1}>
        <ScrollView style={flexGrow1} contentContainerStyle={scrollContainer}>
          <HeaderWithChevron
            customBack={() => navigation.navigate(Routes.expiredOffers.name)}
            title={wine.wine.wineTitle}
            titleTextStyle={headerText}
          />

          <WineDetailsPreviableImage src={wine.wine.pictureURL} />

          <CommunityDetailWineBody wishListButton wine={wine} />

          <TradeUserInfo userId={role && tradeDetails[role === 'buyer' ? 'seller' : 'buyer'].id} />

          <WarningLabel
            text={`Your role in this deal is ${role}. Deal was declined by ${
              tradeDetails.canBeRestored ? 'you' : role === 'buyer' ? 'seller' : 'buyer'
            }`}
          />

          <CounterDetails requestedPrice={tradeDetails.pricePerBottle} requestedCount={tradeDetails.quantity} />

          {tradeDetails.canBeRestored && (
            <View style={buttonWrapper}>
              <ButtonNew text="Resubmit" textStyle={buttonText} onPress={onResubmit} style={buttonContainer} />
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#000'},
  buttonWrapper: {paddingHorizontal: 20},
  scrollContainer: {paddingBottom: 20},
  buttonContainer: {
    backgroundColor: colors.orangeDashboard,
    paddingHorizontal: 20,
    marginTop: 20,
    borderRadius: 0,
  },
  buttonText: {...textStyles.boldText, textTransform: 'uppercase', letterSpacing: 1.1},
  flex1: {flex: 1},
  flexGrow1: {flexGrow: 1},
  headerText: {color: '#fff', fontSize: 24, ...textStyles.boldText, lineHeight: 24},
});

const {container, buttonContainer, buttonText, flex1, flexGrow1, headerText, buttonWrapper, scrollContainer} = styles;

export const PastOfferScreen = PastOffer;
