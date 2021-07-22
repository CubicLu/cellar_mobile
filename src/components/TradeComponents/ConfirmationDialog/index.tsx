import React, {FC} from 'react';
import {View, Text, StyleSheet, Dimensions, ScrollView} from 'react-native';

import {QuestionCircleIcon, DashedLineIcon, CheckCircleIcon} from '../../../assets/svgIcons';
import textStyle from '../../../constants/Styles/textStyle';
import Colors from '../../../constants/colors';
import {AbsChevronLeft, TradePriceSummary} from '../../../components';
import {ButtonNew} from '../../../new_components';
import {selectScreenSize} from '../../../utils/other.utils';

type Props = {
  active: boolean;
  acceptationText: string;
  wineTitle?: string;
  onPressCancel: () => void;
  onPressAccept?: () => void;
  icon?: () => React.ReactNode;
  variant?: 'success' | 'question';
  dealTotalData?: {price: number; bottleCount: number};
};

const {width: screenWidth} = Dimensions.get('screen');

export const ConfirmationDialog: FC<Props> = ({
  active,
  acceptationText,
  wineTitle,
  onPressCancel,
  onPressAccept,
  variant = 'question',
  dealTotalData,
}) => {
  return (
    active && (
      <View style={backDrop}>
        <AbsChevronLeft customBack={onPressCancel} />
        <ScrollView contentContainerStyle={scrollContainer}>
          <View style={[flex1]}>
            <>
              {variant === 'question' ? (
                <View style={questionIconContainer}>
                  <QuestionCircleIcon width={100} height={100} />
                </View>
              ) : (
                <View style={questionIconContainer}>
                  <CheckCircleIcon width={100} height={100} />
                </View>
              )}
            </>
            <View style={[questionTextContainer, {flex: 1}]}>
              <Text allowFontScaling={false} style={questionText}>
                {acceptationText}
              </Text>
            </View>
            {variant === 'question' && (
              <>
                <View style={hrContainer}>
                  <DashedLineIcon width={screenWidth - 40} color="#fff" height={25} />
                </View>
                <View style={wineNameContainer}>
                  <Text allowFontScaling={false} style={wineNameText}>
                    {wineTitle}
                  </Text>
                </View>
                <View style={orderSummaryContainer}>
                  <TradePriceSummary
                    detailsObj={{bottles: dealTotalData.bottleCount, pricePerBottle: dealTotalData.price}}
                  />
                </View>
              </>
            )}
            <View style={[btnContainer]}>
              {variant === 'success' && (
                <ButtonNew onPress={onPressCancel} style={cancelBtn} text={onPressAccept ? 'Cancel' : 'OK'} />
              )}
              {variant === 'question' && (
                <ButtonNew onPress={onPressAccept} textStyle={btnText} style={acceptBtn} text="Confirm" />
              )}
            </View>
          </View>
        </ScrollView>
      </View>
    )
  );
};

const styles = StyleSheet.create({
  flex1: {flex: 1},
  backDrop: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.95)',
    flex: 1,
    paddingBottom: 20,
  },
  scrollContainer: {flexGrow: 1},
  topView: {height: selectScreenSize(0, 83)},
  questionIconContainer: {
    flex: 1,
    alignItems: 'center',
    marginTop: '20%',
  },
  questionText: {
    color: '#fff',
    ...textStyle.mediumText,
    fontSize: 26,
    textAlign: 'center',
  },
  questionTextContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  hrContainer: {
    alignItems: 'center',
    paddingVertical: selectScreenSize(5, 25),
  },
  wineNameContainer: {
    flex: 1,
    paddingHorizontal: selectScreenSize(5, 40),
  },
  wineNameText: {
    fontSize: 24,
    lineHeight: 30,
    color: '#fff',
    ...textStyle.boldText,
    textAlign: 'center',
  },
  orderSummaryContainer: {flex: 1},
  acceptBtn: {
    backgroundColor: Colors.orangeDashboard,
    paddingVertical: 13,
  },
  btnContainer: {
    paddingHorizontal: 20,
    flex: 1,
    justifyContent: 'flex-end',
  },
  btnText: {
    fontSize: 18,
    ...textStyle.boldText,
    textTransform: 'uppercase',
  },
  cancelBtn: {
    marginTop: 10,
    borderWidth: 3,
    borderColor: '#E6750E',
    textTransform: 'uppercase',
  },
});

const {
  backDrop,
  flex1,
  questionText,
  hrContainer,
  wineNameText,
  wineNameContainer,
  questionTextContainer,
  questionIconContainer,
  orderSummaryContainer,
  acceptBtn,
  btnText,
  cancelBtn,
  btnContainer,
  scrollContainer,
} = styles;
