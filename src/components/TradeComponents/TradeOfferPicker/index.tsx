import React, {FC, useEffect, useRef, useState} from 'react';
import {View, Text, StyleSheet, TextProperties, Dimensions} from 'react-native';
import {InfoCell, BottomSheetNew, InputNew} from '../../../new_components';
import {Picker} from '@davidgovea/react-native-wheel-datepicker';
import textStyle from '../../../constants/Styles/textStyle';
import Colors from '../../../constants/colors';
import {CheckBox} from '../../../components';
import {DashedLineIcon} from '../../../assets/svgIcons';
import {requiredPriceValidation} from '../../../utils/errorCodes';

type Props = {
  bottleCount: number;
  setBottleCount?: (val: number) => void;
  disableEditCount?: boolean;
  price: number;
  setPrice: (price: number) => void;
  showCounterCheckbox?: boolean;
  priceConfig?: {
    price: number;
    showTotalPriceBlock: boolean;
  };
  pickerMaxValue: number;
  withCounter?: boolean;
  toggleCounter?: () => void;
  renderButtons?: (error: string) => React.ReactNode;
  renderFinalOffer?: () => React.ReactNode;
};

const screenWidth = Dimensions.get('screen').width;

const OfferPicker: FC<Props> = ({
  children,
  bottleCount,
  setBottleCount,
  disableEditCount,
  showCounterCheckbox,
  priceConfig,
  pickerMaxValue,
  withCounter,
  toggleCounter,
  price,
  setPrice,
  renderButtons,
  renderFinalOffer,
}) => {
  const bottleCountRef = useRef();
  const priceRef = useRef();
  const [error, setError] = useState('');

  useEffect(() => {
    setError(requiredPriceValidation(bottleCount, price.toString()));
  }, [price, bottleCount]);

  const onChangeCost = val => {
    const _val = +val.replace(',', '.');
    setPrice(_val);
  };

  return (
    <View style={container}>
      <InfoCell
        title={'Bottles'}
        content={bottleCount.toString()}
        onPress={() => (bottleCountRef as any).current.open()}
        error={''}
        rotate={true}
        required={false}
        contentTextStyle={textStyle.mediumText}
        disabled={disableEditCount}
      />
      <InputNew
        placeHolder={'Cost per bottle'}
        value={price.toString()}
        onChange={onChangeCost}
        onSubmitEditing={() => (priceRef as any).current.blur()}
        keyboardType={'decimal-pad'}
        returnKeyType={'done'}
        error={error}
        x1={2}
        requiredColorValidation={Colors.inputBorderGrey}
        containerStyle={{marginTop: 20}}
        getRef={priceRef}
      />
      {showCounterCheckbox && (
        <CheckBox
          onValueChange={() => toggleCounter()}
          value={withCounter}
          textStyle={checkBoxText}
          text="I will accept a counter from the Buyer"
        />
      )}
      {renderFinalOffer && renderFinalOffer()}
      {priceConfig && (
        <View style={priceContainer}>
          <DashedLineIcon width={screenWidth - 40} height={10} color="#fff" />
          <Text style={priceText}>
            ${`${Number.isNaN(+(bottleCount * price).toFixed(2)) ? '0.00' : (bottleCount * price).toFixed(2)}`}
          </Text>
          <Text style={priceTotalText}>Total price</Text>
        </View>
      )}

      {renderButtons ? renderButtons(error) : children}

      <BottomSheetNew
        onPressDone={() => {
          setBottleCount(bottleCount);
          (bottleCountRef as any).current.close();
        }}
        ref={bottleCountRef}>
        <Picker
          style={bottomSheetContainer}
          itemStyle={whiteColor as TextProperties}
          selectedValue={bottleCount}
          pickerData={Array.from({length: pickerMaxValue}, (v, k) => k + 1)}
          onValueChange={value => setBottleCount(value)}
        />
      </BottomSheetNew>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomSheetContainer: {
    width: '100%',
    backgroundColor: 'black',
  },
  priceContainer: {marginTop: 20},
  whiteColor: {color: '#fff'},
  container: {
    paddingHorizontal: 20,
  },
  checkBoxText: {
    color: '#fff',
    ...textStyle.mediumText,
    fontSize: 21,
    paddingRight: 20,
  },
  priceText: {color: '#fff', fontSize: 40, ...textStyle.extraBold, marginTop: 20, textAlign: 'center'},
  priceTotalText: {
    fontSize: 16,
    color: '#fff',
    lineHeight: 21,
    ...textStyle.mediumText,
    textAlign: 'center',
  },
});

const {bottomSheetContainer, whiteColor, container, checkBoxText, priceText, priceTotalText, priceContainer} = styles;

export const TradeOfferPicker = OfferPicker;
