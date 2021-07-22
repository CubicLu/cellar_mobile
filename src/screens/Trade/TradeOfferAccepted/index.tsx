import React, {FC} from 'react';
import {View, Text, StyleSheet, SafeAreaView, ScrollView, Alert} from 'react-native';
import {withNavigation, NavigationScreenProp} from 'react-navigation';
import RNProgressHud from 'progress-hud';
import {useLazyQuery} from '@apollo/react-hooks';

import {ThumbUpIcon} from '../../../assets/svgIcons';
import {ButtonNew} from '../../../new_components';
import Routes from '../../../constants/navigator-name';
import textStyle from '../../../constants/Styles/textStyle';
import {selectScreenSize} from '../../../utils/other.utils';
import {TradeDetailsType} from '../../../types/trade';
import {GET_TRANSACTION_RECEIPT} from '../../../apollo/queries/trading';

type Props = {
  navigation: NavigationScreenProp<any>;
};

const OfferAccepted: FC<Props> = ({navigation}) => {
  const {mainText, tipText} = navigation.getParam('message', {mainText: '', tipText: ''});
  const tradeDetails: TradeDetailsType = navigation.getParam('tradeDetails');

  const [getReceipt] = useLazyQuery(GET_TRANSACTION_RECEIPT, {
    variables: {tradeOfferId: tradeDetails.dealId},
    onCompleted: data => {
      RNProgressHud.dismiss();
      navigation.navigate(Routes.tradingReceiptScreen.name, {receiptDetails: data.transactionReceipt});
    },
    onError: error => {
      RNProgressHud.dismiss();
      Alert.alert(error.message);
    },
    fetchPolicy: 'no-cache',
  });

  const onGetReceipt = () => {
    RNProgressHud.show();
    getReceipt();
  };

  return (
    <SafeAreaView style={container}>
      <ScrollView contentContainerStyle={scrollContainer}>
        <View style={innerScrollContainer}>
          <View style={flex1}>
            <View style={h1Container}>
              <Text allowFontScaling={false} style={h1}>
                Congratulations!
              </Text>
            </View>
          </View>
          <View style={flex1}>
            <View style={iconContainer}>
              <ThumbUpIcon width={40} height={37} />
            </View>
          </View>
          <View style={flex1}>
            <View style={h2Container}>
              <Text allowFontScaling={false} style={h2}>
                {mainText}
              </Text>
            </View>
            <View style={h3Container}>
              <Text allowFontScaling={false} style={h3}>
                {tipText}
              </Text>
            </View>
          </View>

          <View style={btnContainer}>
            <ButtonNew text="show receipt" textStyle={btnText} style={btn} onPress={onGetReceipt} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  flex1: {flex: 1},
  scrollContainer: {flexGrow: 1},
  innerScrollContainer: {flex: 1, justifyContent: 'space-between'},
  h1Container: {
    marginTop: 0,
  },
  h1: {
    fontSize: 40,
    textAlign: 'center',
    color: '#fff',
    ...textStyle.extraBold,
  },
  iconContainer: {
    backgroundColor: '#fff',
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    alignSelf: 'center',
  },
  btnText: {
    color: '#fff',
    textTransform: 'uppercase',
  },
  h2: {
    fontSize: selectScreenSize(22, 28),
    color: '#fff',
    ...textStyle.mediumText,
    textAlign: 'center',
  },
  h2Container: {
    paddingHorizontal: '12%',
  },
  h3: {
    fontSize: selectScreenSize(18, 21),
    color: '#fff',
    ...textStyle.mediumText,
    textAlign: 'center',
  },
  h3Container: {
    paddingHorizontal: '9%',
    marginTop: selectScreenSize(10, 30),
  },
  btnContainer: {
    marginHorizontal: 20,
    alignItems: 'flex-end',
    flex: 1,
    flexDirection: 'row',
    marginBottom: selectScreenSize(20, 0),
  },
  btn: {
    backgroundColor: '#E6750E',
  },
});

const {
  flex1,
  h1,
  h2,
  h3,
  iconContainer,
  btnContainer,
  btn,
  btnText,
  container,
  h1Container,
  h2Container,
  h3Container,
  scrollContainer,
  innerScrollContainer,
} = styles;

export const TradeOfferAcceptedScreen = withNavigation(OfferAccepted);
