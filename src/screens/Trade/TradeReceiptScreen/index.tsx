import React, {FC, useCallback, useMemo, useState} from 'react';
import {View, Text, StyleSheet, SafeAreaView, ScrollView} from 'react-native';
import {NavigationScreenProp} from 'react-navigation';
import moment from 'moment';
import {useLazyQuery} from '@apollo/react-hooks';

import {CellrLogoIcon} from '../../../assets/svgIcons';
import textStyle from '../../../constants/Styles/textStyle';
import {ButtonNew} from '../../../new_components';
import {flagToUpdateScreen, selectScreenSize} from '../../../utils/other.utils';
import {ReceiptDetailsType} from '../../../types/trade';
import {ReceiptPaymentStatus, ReceiptFooter} from '../../../components';
import {useTradeRole} from '../../../hooks';
import {WINE} from '../../../apollo/queries/wine';
import {getPriceDependOnRole} from '../../../utils/TradeFlowUtils';
import {Routes} from '../../../constants';

type Props = {
  navigation: NavigationScreenProp<any>;
};

const Receipt: FC<Props> = ({navigation}) => {
  const receiptDetails: ReceiptDetailsType = navigation.getParam('receiptDetails');
  console.log(JSON.stringify(receiptDetails));
  const {
    quantity,
    pricePerBottle,
    wineTitle,
    wineId,
    status,
    insurance: insuranceAmount,
    tradeOfferId,
  }: ReceiptDetailsType = navigation.getParam('receiptDetails');
  const [insurance, setInsurance] = useState(false);
  const currentUserRole = useTradeRole(receiptDetails.seller.id);

  const [getWine] = useLazyQuery(WINE, {
    onCompleted: data => {
      navigation.navigate(Routes.DeliverySteps.name, {
        receiptDetails,
        totalPrice: finalPrice,
        wine: data.wineV2.wine,
      });
    },
    fetchPolicy: 'no-cache',
  });

  const finalPrice = useMemo((): number => getPriceDependOnRole(receiptDetails, currentUserRole, insurance), [
    receiptDetails,
    currentUserRole,
    insurance,
  ]);

  const onGetDeliveryData = useCallback(() => {
    getWine({
      variables: {
        wineId: wineId,
      },
    });
  }, [getWine, wineId]);

  const onCompletePayment = async () => {
    await flagToUpdateScreen('Receipts-screen');
    navigation.navigate(Routes.receipts.name);
  };

  return (
    <SafeAreaView style={container}>
      <ScrollView style={flex1} indicatorStyle="white">
        <View style={logoContainer}>
          <CellrLogoIcon width={243} height={51} />
        </View>
        <View style={[headerRow]}>
          <View style={leftCol}>
            <Text style={headerLeftText}>Receipt</Text>
          </View>
          <View style={[headerInfoContainer]}>
            <View>
              <Text style={[headerRightText]}>#{receiptDetails.tradeOfferId}</Text>
            </View>
            <View>
              <Text style={[headerRightText, flexShrink1]}>
                {moment(receiptDetails.updatedAt).format('MM/DD/YYYY')}
              </Text>
            </View>
          </View>
        </View>
        <View style={shipRow}>
          <View style={leftCol}>
            <Text style={addressText}>Ship to</Text>
          </View>
          <View style={flex1}>
            <Text numberOfLines={1} adjustsFontSizeToFit style={[addressText, shipUsrInfoText]}>
              {`${receiptDetails.buyer.userName}`}
            </Text>
            <Text ellipsizeMode="tail" style={shipLocText}>
              {receiptDetails.buyer.prettyLocationName}
            </Text>
          </View>
        </View>
        <View style={wineDetailsContainer}>
          <View style={rowContainer}>
            <View style={leftCol}>
              <Text style={shipLocText}>Wine Name</Text>
            </View>
            <View style={flexShrink1}>
              <Text style={[addressText, shipUsrInfoText]}>{receiptDetails.wineTitle}</Text>
            </View>
          </View>
          <View style={rowContainer}>
            <View style={leftCol}>
              <Text style={shipLocText}>Number of bottles</Text>
            </View>
            <View style={flexShrink1}>
              <Text style={[addressText, shipUsrInfoText]}>{receiptDetails.quantity}</Text>
            </View>
          </View>
          <View style={rowContainer}>
            <View style={leftCol}>
              <Text style={shipLocText}>Price per Bottle</Text>
            </View>
            <View style={flexShrink1}>
              <Text style={[addressText, shipUsrInfoText]}>${receiptDetails.pricePerBottle}</Text>
            </View>
          </View>
        </View>

        {status !== 'PAID' && (
          <ReceiptFooter
            tradeOfferId={tradeOfferId}
            variant={currentUserRole}
            insurance={insurance}
            insuranceAmount={insuranceAmount}
            quantity={quantity}
            pricePerBottle={pricePerBottle}
            setInsurance={setInsurance}
            wineTitle={wineTitle}
            totalPrice={finalPrice}
            onCompletePayment={onCompletePayment}
          />
        )}

        <ReceiptPaymentStatus onPressDelivery={onGetDeliveryData} status={status as any} role={currentUserRole} />

        <View style={btnRowContainer}>
          <ButtonNew
            text="Close"
            onPress={() => (navigation as any).popToTop()}
            textStyle={buttonTextStyle}
            style={btnContainer}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flex1: {flex: 1},
  flexShrink1: {flexShrink: 1},
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  logoContainer: {
    marginVertical: 50,
    alignItems: 'center',
  },
  headerLeftText: {
    fontSize: 18,
    ...textStyle.boldText,
    lineHeight: 25,
    color: '#fff',
  },
  headerRightText: {
    fontSize: 16,
    lineHeight: 21,
    color: '#fff',
    ...textStyle.mediumText,
  },
  leftCol: {
    width: '42%',
  },
  headerRow: {
    backgroundColor: '#64091C',
    paddingVertical: 20,
    paddingLeft: 20,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerInfoContainer: {
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
  },
  addressText: {
    fontSize: 24,
    ...textStyle.boldText,
    color: '#fff',
  },
  shipRow: {marginTop: 40, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 36},
  shipUsrInfoText: {fontSize: 16},
  shipLocText: {
    color: '#fff',
    ...textStyle.mediumText,
  },
  wineDetailsContainer: {
    paddingTop: 11,
    paddingBottom: 36,
    paddingHorizontal: 20,
    backgroundColor: '#041B1E',
  },
  rowContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  btnContainer: {borderWidth: 3, borderColor: '#E6750E', marginTop: 20},
  placeHolder: {height: selectScreenSize(50, 100)},
  btnRowContainer: {flex: 1, paddingHorizontal: 20, marginBottom: 20},
  checkBoxText: {
    color: '#fff',
    ...textStyle.mediumText,
    fontSize: 21,
  },
  buttonTextStyle: {color: '#fff'},
  horizontalMargin20: {marginHorizontal: 20},
});

const {
  flex1,

  flexShrink1,
  container,
  logoContainer,
  leftCol,
  headerRow,
  headerInfoContainer,
  headerLeftText,
  headerRightText,
  addressText,
  shipRow,
  shipUsrInfoText,
  shipLocText,
  wineDetailsContainer,
  rowContainer,
  btnContainer,
  btnRowContainer,
  buttonTextStyle,
} = styles;

export const TradeReceiptScreen = Receipt;
