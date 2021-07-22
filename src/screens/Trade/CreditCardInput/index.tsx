import React, {FC, useCallback, useMemo, useReducer, useRef} from 'react';
import {Input} from 'react-native-elements';
import {TextInputMask} from 'react-native-masked-text';
import {NavigationScreenProp} from 'react-navigation';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  SafeAreaView,
  Dimensions,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';

import {CardIcon, HeaderWithChevron, ReceiptSummary} from '../../../components';
import {ButtonNew} from '../../../new_components';
import colors from '../../../constants/colors';
import textStyle from '../../../constants/Styles/textStyle';
import {
  formatMonthOutput,
  formatYearOutput,
  getCardType,
  isCardYearValid,
  validateCardForm,
  validateCardNumber,
  validateRequiredCardFields,
} from '../../../utils/TradeFlowUtils';
import {cardInputReducer, initState} from '../../../reducers/cardInput.reducer';
import {
  SET_ADDRESS_CITY,
  SET_ADDRESS_COUNTRY,
  SET_ADDRESS_LINE_1,
  SET_ADDRESS_LINE_2,
  SET_ADDRESS_STATE,
  SET_CARD_CVC,
  SET_CARD_EXPIRATION_MONTH,
  SET_CARD_EXPIRATION_YEAR,
  SET_CARD_NUMBER,
  SET_NAME,
  SET_ZIP_CODE,
} from '../../../constants/ActionTypes/cardInput';

type Props = {
  navigation: NavigationScreenProp<any>;
};

const screenWidth = Dimensions.get('screen').width;

export const CardInput: FC<Props> = ({navigation}) => {
  const front = useMemo(() => new Animated.Value(0), []);
  const back = useMemo(() => new Animated.Value(3), []);
  const frontOpacity = useMemo(() => new Animated.Value(1), []);
  const backOpacity = useMemo(() => new Animated.Value(0), []);
  const onPayHandler = navigation.getParam('onPayHandler');
  const cartItems = navigation.getParam('cartItems');

  const [cardInputState, dispatch] = useReducer(cardInputReducer, initState);

  const onPay = useCallback(() => onPayHandler(cardInputState), [cardInputState, onPayHandler]);

  const nameInputRef = useRef<Input>();
  const addressInputRef = useRef<Input>();
  const aptInputRef = useRef<Input>();
  const postCodeInputRef = useRef<Input>();
  const cityCodeInputRef = useRef<Input>();
  const stateCodeInputRef = useRef<Input>();
  const countryCodeInputRef = useRef<Input>();
  const scrollViewRef = useRef<ScrollView>();

  frontOpacity.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0, 1],
  });

  backOpacity.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.5, 0.1, 0],
  });

  front.interpolate({
    inputRange: [0, 1, 2, 3],
    outputRange: ['0deg', '45deg', '90deg', '180deg'],
  });

  back.interpolate({
    inputRange: [0, 1, 2, 3],
    outputRange: ['180deg', '90deg', '45deg', '0deg'],
  });

  const frontStyles = {
    transform: [{rotateY: front}],
    opacity: frontOpacity,
  };

  const backStyles = {
    transform: [{rotateY: back}],
    opacity: backOpacity,
  };

  const showCardBack = () => {
    Animated.parallel([
      Animated.timing(front, {
        toValue: 3,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(back, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(frontOpacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(backOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const showCardFront = () => {
    Animated.parallel([
      Animated.timing(front, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(back, {
        toValue: 3,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(frontOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(backOpacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={container}>
      <SafeAreaView style={flex1}>
        <HeaderWithChevron title="Pay with card" titleTextStyle={headerTitleText} />
        <ScrollView ref={scrollViewRef} style={flexGrow1}>
          <View style={cardContainer}>
            <Animated.View style={[card, cardFront, frontStyles]}>
              <View style={cardInnerContainer}>
                <View style={cardPhoto} />

                <View style={textContainer}>
                  <Text style={cardNumber}>•••• •••• •••• ••••</Text>
                  <View style={cardDatesContainer}>
                    <Text style={[cardDates, yearsText]}>MM / YY</Text>
                    <View style={cardTypeIconContainer}>
                      {!!cardInputState.number && validateCardNumber(cardInputState.number) && (
                        <CardIcon variant={getCardType(cardInputState.number)} />
                      )}
                    </View>
                  </View>
                </View>
              </View>
            </Animated.View>

            <Animated.View style={[card, cardBack, backStyles]}>
              <View style={cardBackLine} />
              <View style={cvvContainer}>
                <Text style={cardNumber}>•••</Text>
              </View>
            </Animated.View>
          </View>

          <View
            style={[
              cardInputContainer,
              !validateCardForm(
                cardInputState.number,
                cardInputState.expMonth,
                cardInputState.expYear,
                cardInputState.cvc,
              ) && redBorder,
            ]}>
            <View style={flex1}>
              <Input
                value={cardInputState.number}
                onChangeText={text => dispatch({type: SET_CARD_NUMBER, payload: text})}
                placeholder="0000 0000 0000 0000"
                placeholderTextColor="gray"
                returnKeyType="next"
                //@ts-ignore
                type={'credit-card'}
                inputComponent={TextInputMask}
                containerStyle={smallInputContainer}
                inputContainerStyle={[numberInputContainer, rightBorder]}
                inputStyle={[inputStyle, numberInputText, !validateCardNumber(cardInputState.number) && redText]}
                onFocus={showCardFront}
                autoCorrect={false}
              />
            </View>
            <View style={flex03}>
              <Input
                value={formatMonthOutput(cardInputState.expMonth)}
                onChangeText={text => dispatch({type: SET_CARD_EXPIRATION_MONTH, payload: text.replace(/[^0-9]/g, '')})}
                placeholderTextColor="gray"
                returnKeyType="next"
                inputContainerStyle={[numberInputContainer, rightBorder]}
                inputStyle={[inputStyle, numberInputText, +cardInputState.expMonth > 12 && redText]}
                containerStyle={smallInputContainer}
                placeholder="MM"
                maxLength={2}
                onFocus={showCardFront}
                autoCorrect={false}
                keyboardType="number-pad"
              />
            </View>
            <View style={flex03}>
              <Input
                value={formatYearOutput(cardInputState.expYear)}
                maxLength={2}
                onChangeText={text => dispatch({type: SET_CARD_EXPIRATION_YEAR, payload: text.replace(/[^0-9]/g, '')})}
                placeholderTextColor="gray"
                inputContainerStyle={[numberInputContainer, rightBorder]}
                inputStyle={[inputStyle, numberInputText, !isCardYearValid(cardInputState.expYear) && redText]}
                containerStyle={smallInputContainer}
                placeholder="YY"
                onFocus={showCardFront}
                autoCorrect={false}
                keyboardType="number-pad"
              />
            </View>

            <View style={flex03}>
              <Input
                value={cardInputState.cvc}
                maxLength={3}
                onChangeText={text => dispatch({type: SET_CARD_CVC, payload: text.replace(/[^0-9]/g, '')})}
                placeholderTextColor="gray"
                inputContainerStyle={[numberInputContainer]}
                inputStyle={[inputStyle, numberInputText, cardInputState.cvc.length < 3 && redText]}
                placeholder="CVC"
                containerStyle={smallInputContainer}
                onFocus={showCardBack}
                autoCorrect={false}
                keyboardType="number-pad"
              />
            </View>
          </View>

          <View style={sectionHeader}>
            <Text style={sectionHeaderText}>Billing address</Text>
          </View>

          <View style={addressForm}>
            <Input
              ref={nameInputRef}
              onChangeText={text => dispatch({type: SET_NAME, payload: text})}
              placeholderTextColor="gray"
              value={cardInputState.name}
              returnKeyType="next"
              placeholder="Name"
              inputStyle={inputStyle}
              inputContainerStyle={[inputContainerStyle, cardInputState.name.length < 1 && redBorder]}
              autoCorrect={false}
              onSubmitEditing={() => addressInputRef.current.focus()}
              blurOnSubmit={false}
            />

            <Input
              ref={addressInputRef}
              onChangeText={text => dispatch({type: SET_ADDRESS_LINE_1, payload: text})}
              placeholderTextColor="gray"
              returnKeyType="next"
              value={cardInputState.addressLine1}
              placeholder="Address"
              inputStyle={inputStyle}
              inputContainerStyle={[inputContainerStyle, cardInputState.addressLine1.length < 1 && redBorder]}
              autoCorrect={false}
              onSubmitEditing={() => aptInputRef.current.focus()}
              blurOnSubmit={false}
            />

            <Input
              ref={aptInputRef}
              onChangeText={text => dispatch({type: SET_ADDRESS_LINE_2, payload: text})}
              placeholderTextColor="gray"
              returnKeyType="next"
              value={cardInputState.addressLine2}
              placeholder="Apt."
              inputStyle={inputStyle}
              inputContainerStyle={inputContainerStyle}
              onSubmitEditing={() => postCodeInputRef.current.focus()}
              blurOnSubmit={false}
              autoCorrect={false}
            />

            <Input
              ref={postCodeInputRef}
              onChangeText={text => dispatch({type: SET_ZIP_CODE, payload: text})}
              placeholderTextColor="gray"
              returnKeyType="next"
              value={cardInputState.addressZip}
              placeholder="Post Code"
              inputStyle={inputStyle}
              inputContainerStyle={[inputContainerStyle, cardInputState.addressZip.length < 1 && redBorder]}
              onSubmitEditing={() => cityCodeInputRef.current.focus()}
              blurOnSubmit={false}
              autoCorrect={false}
            />

            <Input
              ref={cityCodeInputRef}
              onChangeText={text => dispatch({type: SET_ADDRESS_CITY, payload: text})}
              placeholderTextColor="gray"
              returnKeyType="next"
              value={cardInputState.addressCity}
              placeholder="City"
              inputStyle={inputStyle}
              inputContainerStyle={[inputContainerStyle, cardInputState.addressCity.length < 1 && redBorder]}
              textContentType="addressCity"
              onSubmitEditing={() => stateCodeInputRef.current.focus()}
              blurOnSubmit={false}
              autoCorrect={false}
            />

            <Input
              ref={stateCodeInputRef}
              onChangeText={text => dispatch({type: SET_ADDRESS_STATE, payload: text})}
              placeholderTextColor="gray"
              returnKeyType="next"
              value={cardInputState.addressState}
              placeholder="State / Province / Region"
              inputStyle={inputStyle}
              inputContainerStyle={[inputContainerStyle, cardInputState.addressState.length < 1 && redBorder]}
              textContentType="addressCityAndState"
              onSubmitEditing={() => countryCodeInputRef.current.focus()}
              blurOnSubmit={false}
              autoCorrect={false}
            />

            <Input
              ref={countryCodeInputRef}
              onChangeText={text => dispatch({type: SET_ADDRESS_COUNTRY, payload: text})}
              placeholderTextColor="gray"
              returnKeyType="done"
              value={cardInputState.addressCountry}
              placeholder="Country"
              inputStyle={inputStyle}
              inputContainerStyle={[inputContainerStyle, cardInputState.addressCountry.length < 1 && redBorder]}
              autoCorrect={false}
              onSubmitEditing={() => scrollViewRef.current.scrollToEnd({animated: true})}
            />
          </View>

          <ReceiptSummary cartItems={cartItems} />

          <View style={payButtonContainer}>
            <ButtonNew
              onPress={onPay}
              disabledOpacity
              isDisabled={!validateRequiredCardFields(cardInputState)}
              text="PAY"
              style={payButtonStyles}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  totalContainer: {flexDirection: 'row', paddingVertical: 5, paddingHorizontal: 5},
  totalText: {color: '#fff', flex: 1, fontSize: 20, ...textStyle.mediumText},
  totalTextPrice: {textAlign: 'right'},
  container: {flex: 1, backgroundColor: '#000'},
  headerTitleText: {fontSize: 30},
  cardContainer: {
    height: 250,
  },
  cardTypeIconContainer: {width: 100, height: 50},
  cardInputContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    borderWidth: 2,
    borderColor: 'gray',
  },
  card: {
    padding: 5,
    width: screenWidth - 100,
    top: 20,
    left: 50,
    right: 50,
    height: 200,
    backgroundColor: '#041B1E',
    borderRadius: 15,
    position: 'absolute',
    overflow: 'hidden',
  },
  cardFront: {},
  cardBack: {},
  cardInnerContainer: {
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.4)',
    flex: 1,
    borderRadius: 15,
    padding: 10,
    justifyContent: 'space-between',
  },
  cardPhoto: {
    backgroundColor: '#ccc',
    width: 50,
    height: 50,
    borderRadius: 5,
  },
  textContainer: {
    alignItems: 'center',
  },
  cardNumber: {
    fontSize: 25,
    color: '#fff',
  },
  cardDatesContainer: {
    alignSelf: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row',
  },
  cardDates: {
    textAlign: 'right',
  },
  cardBackLine: {
    height: 40,
    width: 350,
    backgroundColor: colors.orangeDashboard,
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
  },
  cvvContainer: {
    position: 'absolute',
    width: 50,
    height: 50,
    bottom: 15,
    right: 20,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    borderColor: '#fff',
  },
  yearsText: {...textStyle.mediumText, color: '#fff'},
  numberInputContainer: {alignSelf: 'center', borderBottomWidth: 0},
  numberInputText: {fontSize: 14, ...textStyle.mediumText},
  blackPerlBackground: {backgroundColor: colors.inventoryItemBg},
  inputStyle: {color: '#fff', ...textStyle.mediumText},
  inputContainerStyle: {
    borderWidth: 2,
    borderColor: '#666666',
    paddingHorizontal: 20,
    paddingVertical: 5,
    marginHorizontal: 0,
    marginTop: 10,
    maxHeight: 300,
  },
  rightBorder: {borderRightWidth: 1, borderRightColor: 'gray'},
  redText: {color: 'rgb(191,61,70)'},
  flex1: {flex: 1},
  flex03: {flex: 0.3, alignItems: 'center'},
  flexGrow1: {flexGrow: 1},
  sectionHeader: {marginTop: 20, marginLeft: 20},
  sectionHeaderText: {color: '#fff', ...textStyle.boldText},
  addressForm: {marginHorizontal: 10},
  payButtonContainer: {marginHorizontal: 20, marginVertical: 20},
  payButtonStyles: {backgroundColor: colors.orangeDashboard},
  redBorder: {borderColor: 'red'},
  smallInputContainer: {paddingHorizontal: 0, paddingLeft: 10},
});

const {
  card,
  container,
  cardContainer,
  cardBack,
  cardTypeIconContainer,
  cardInputContainer,
  sectionHeader,
  sectionHeaderText,
  addressForm,
  headerTitleText,
  cardFront,
  cardInnerContainer,
  cardPhoto,
  cardNumber,
  textContainer,
  cardDates,
  cardDatesContainer,
  cardBackLine,
  cvvContainer,
  yearsText,
  inputContainerStyle,
  inputStyle,
  numberInputContainer,
  numberInputText,
  rightBorder,
  redText,
  flex1,
  flex03,
  flexGrow1,
  payButtonContainer,
  payButtonStyles,
  redBorder,
  smallInputContainer,
} = styles;

export const CardInputScreen = CardInput;
