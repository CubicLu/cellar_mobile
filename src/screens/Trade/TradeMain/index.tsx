import React, {FC} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {GlassCounter, HeaderWithAside} from '../../../components';
import Photos from '../../../assets/photos';
import textStyles from '../../../constants/Styles/textStyle';
import {NavigationScreenProp} from 'react-navigation';
import Routes from '../../../constants/navigator-name';
import {useQuery} from '@apollo/react-hooks';
import {GET_SUBSCRIPTION_STATE} from '../../../apollo/client/queries/other';

type Props = {
  navigation: NavigationScreenProp<any>;
};

const Main: FC<Props> = ({navigation}) => {
  const {data: subscriptionData} = useQuery(GET_SUBSCRIPTION_STATE);

  return (
    <HeaderWithAside asideSrc={Photos.bgCellar} text="" drawer>
      <View style={container}>
        <TouchableOpacity
          style={buttonContainer}
          onPress={() => {
            navigation.navigate(Routes.communityInventory.name);
          }}>
          <Text allowFontScaling={false} numberOfLines={2} style={text}>
            Community Inventory
          </Text>
        </TouchableOpacity>
        <View style={hr} />

        <TouchableOpacity style={buttonContainer} onPress={() => navigation.navigate(Routes.tradingOffers.name)}>
          <Text allowFontScaling={false} numberOfLines={2} style={text}>
            Current Offers
          </Text>
          <GlassCounter
            unreadMessages={subscriptionData.unreadTradeMessages.unansweredTradeMessages.numberOfCurrentTradeOffers}
          />
        </TouchableOpacity>
        <View style={hr} />

        <TouchableOpacity style={buttonContainer} onPress={() => navigation.navigate(Routes.expiredOffers.name)}>
          <Text allowFontScaling={false} numberOfLines={2} style={text}>
            Past Offers
          </Text>
          <GlassCounter
            unreadMessages={subscriptionData.unreadTradeMessages.unansweredTradeMessages.numberOfPastTradeOffers}
          />
        </TouchableOpacity>
        <View style={hr} />

        <TouchableOpacity style={buttonContainer}>
          <Text allowFontScaling={false} numberOfLines={2} style={text}>
            Executed Offers
          </Text>
        </TouchableOpacity>
        <View style={hr} />

        <TouchableOpacity style={buttonContainer} onPress={() => navigation.navigate(Routes.receipts.name)}>
          <Text allowFontScaling={false} adjustsFontSizeToFit numberOfLines={2} style={text}>
            Transaction{'\n'}Receipts
          </Text>
          <GlassCounter
            unreadMessages={
              subscriptionData.unreadTradeMessages.unansweredTradeMessages.numberOfTransactionReceiptsTradeOffers
            }
          />
        </TouchableOpacity>
        <View style={hr} />
      </View>
    </HeaderWithAside>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginTop: -80,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  hr: {
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
    marginTop: 20,
    marginBottom: 20,
  },
  text: {
    color: '#fff',
    ...textStyles.mediumText,
    fontSize: 26,
  },
});

const {container, text, buttonContainer, hr} = styles;

export const TradeMainScreen = Main;
