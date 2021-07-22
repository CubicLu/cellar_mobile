import React, {FC, useState} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Text,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

const screenWidth = Dimensions.get('screen').width;

import {StepItem} from './StepItem';

import textStyle from '../../../constants/Styles/textStyle';
import {NavigationScreenProp, withNavigation} from 'react-navigation';
import {ReceiptDetailsType} from '../../../types/trade';
import colors from '../../../constants/colors';
import moment from 'moment';

type Props = {
  navigation: NavigationScreenProp<any>;
};

const points = Array(6).fill('');

const DeliverySteps: FC<Props> = ({navigation}) => {
  const [active] = useState(1);
  const {pricePerBottle, quantity, wineTitle, tradeOfferId, updatedAt}: ReceiptDetailsType = navigation.getParam(
    'receiptDetails',
  );
  const finalPrice = navigation.getParam('totalPrice');
  const wine = navigation.getParam('wine');

  return (
    <View style={[flex1, blackBG]}>
      <SafeAreaView style={flex1}>
        <ScrollView indicatorStyle="white">
          <View>
            <View style={relativeContainer}>
              <View style={[StyleSheet.absoluteFillObject, imageBackdrop]} />

              <View style={[StyleSheet.absoluteFillObject, tileTextContainer]}>
                <Text allowFontScaling={false} style={tileText}>
                  Transaction Timeline
                </Text>
              </View>

              <ImageBackground
                source={{
                  uri: wine.pictureURL,
                }}
                style={bgImage}
                resizeMode={'cover'}
              />
            </View>
          </View>
          <View style={receiptInfoContainer}>
            <Text style={h2}>ORDER</Text>
            <Text style={h3}>00000{tradeOfferId}</Text>
            <Text style={h3}>{moment(updatedAt).format('MM/DD/YYYY')}</Text>
          </View>
          <View style={receiptDetails}>
            <View style={receiptDetailsHeaderContainer}>
              <Text allowFontScaling adjustsFontSizeToFit numberOfLines={2} style={[h1, textStyle.boldText]}>
                {wineTitle}
              </Text>
            </View>
            <View style={receiptDetailsContainer}>
              <View style={receiptDetailsRow}>
                <Text style={[h3, flex1]}>Number of Bottles</Text>
                <Text style={[h3, flex1, textStyle.boldText]}>{quantity}</Text>
              </View>
              <View style={receiptDetailsRow}>
                <Text style={[h3, flex1]}>Price per Bottle</Text>
                <Text style={[h3, flex1, textStyle.boldText]}>${pricePerBottle}</Text>
              </View>
              <View style={receiptDetailsRow}>
                <Text style={[h3, flex1]}>Total Price</Text>
                <Text style={[h3, flex1, textStyle.boldText]}>${finalPrice}</Text>
              </View>
            </View>
          </View>

          <StepItem
            text="Sending you a “Shipping Kit” for shipment to Cellr"
            activeIndex={active}
            index={0}
            maxIndex={points.length - 1}
            date="Yesterday"
          />

          <StepItem
            text="Wine is packed and dropped for shipment to Cellr"
            activeIndex={active}
            index={1}
            maxIndex={points.length - 1}
            date="Yesterday"
          />

          <StepItem
            text="Package is delivered to Cellr"
            activeIndex={active}
            index={2}
            maxIndex={points.length - 1}
            date="Today"
            description="Usually it takes 3-4 business days"
          />

          <StepItem
            text="Package arrived at Cellr and queued for inspection"
            activeIndex={active}
            index={3}
            maxIndex={points.length - 1}
          />

          <StepItem
            text="Wine is confirmed and inspected"
            activeIndex={active}
            index={4}
            maxIndex={points.length - 1}
          />

          <StepItem text="Shipment released" activeIndex={active} index={5} maxIndex={points.length - 1} />

          <View>
            <TouchableOpacity onPress={() => navigation.goBack()} style={buttonContainer}>
              <Text style={buttonText}>CLOSE</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  flex1: {flex: 1},
  receiptInfoContainer: {
    backgroundColor: colors.darkRedDrawer,
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  h1: {...textStyle.mediumText, letterSpacing: -1.2, fontSize: 24, color: '#fff', lineHeight: 30},
  h3: {fontSize: 16, ...textStyle.mediumText, color: '#fff'},
  h2: {
    ...textStyle.boldText,
    color: '#fff',
    fontSize: 18,
  },
  blackBG: {backgroundColor: '#000'},
  relativeContainer: {position: 'relative'},
  imageBackdrop: {backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 1},
  tileTextContainer: {zIndex: 3, justifyContent: 'center', paddingHorizontal: 20},
  tileText: {color: '#fff', fontSize: 50, ...textStyle.mediumText, lineHeight: 66},
  bgImage: {width: screenWidth, height: 226},
  receiptDetails: {backgroundColor: '#041B1E', marginBottom: 20, paddingHorizontal: 20},
  receiptDetailsHeaderContainer: {paddingVertical: 22},
  receiptDetailsContainer: {paddingBottom: 35},
  receiptDetailsRow: {flexDirection: 'row', justifyContent: 'space-between'},
  buttonContainer: {marginVertical: 40, borderWidth: 3, borderColor: '#E6750E', marginHorizontal: 20},
  buttonText: {
    paddingVertical: 13,
    textAlign: 'center',
    fontSize: 18,
    lineHeight: 25,
    ...textStyle.boldText,
    color: '#fff',
  },
});

const {
  flex1,
  receiptInfoContainer,
  h1,
  h2,
  h3,
  blackBG,
  relativeContainer,
  imageBackdrop,
  tileTextContainer,
  tileText,
  bgImage,
  receiptDetails,
  receiptDetailsHeaderContainer,
  receiptDetailsContainer,
  receiptDetailsRow,
  buttonContainer,
  buttonText,
} = styles;

export const DeliveryStepsScreen = withNavigation(DeliverySteps);
